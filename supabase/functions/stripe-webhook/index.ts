import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingRequestId = session.metadata?.booking_request_id;
      const paymentStage = session.metadata?.payment_stage || session.metadata?.type || "deposit";

      if (bookingRequestId) {
        const isDeposit = paymentStage === "deposit";
        const paymentStatus = isDeposit ? "deposit_paid" : "fully_paid";
        const bookingStatus = isDeposit ? "paid" : "paid";

        // Update booking request
        await supabase.from("booking_requests").update({
          status: bookingStatus,
          payment_status: paymentStatus,
          updated_at: new Date().toISOString(),
        }).eq("id", bookingRequestId);

        // Get customer info
        const { data: booking } = await supabase
          .from("booking_requests")
          .select("*, customers(*)")
          .eq("id", bookingRequestId)
          .single();

        if (booking?.customers) {
          // Send appropriate email
          const emailType = isDeposit ? "payment_received" : "payment_received";
          await supabase.functions.invoke("send-studio-email", {
            body: {
              type: emailType,
              email: booking.customers.email,
              customerName: booking.customers.name,
              bookingId: bookingRequestId,
              totalPrice: booking.total_price,
              depositAmount: booking.deposit_amount,
              uploadUrl: isDeposit ? `https://lajo-studio-sound.lovable.app/upload/${bookingRequestId}` : undefined,
            },
          });

          // If deposit paid, also send file upload instructions
          if (isDeposit) {
            try {
              await supabase.functions.invoke("send-studio-email", {
                body: {
                  type: "files_requested",
                  email: booking.customers.email,
                  customerName: booking.customers.name,
                  bookingId: bookingRequestId,
                  uploadUrl: `https://lajo-studio-sound.lovable.app/upload/${bookingRequestId}`,
                },
              });
            } catch (e) {
              console.error("Upload email failed:", e);
            }
          }

          // Update customer total_spent
          await supabase.from("customers").update({
            total_spent: (booking.customers.total_spent || 0) + (session.amount_total ? session.amount_total / 100 : 0),
            updated_at: new Date().toISOString(),
          }).eq("id", booking.customers.id);

          // Telegram notification
          try {
            const BOT_TOKEN = Deno.env.get("TELEGRAM_API_KEY");
            const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
            if (BOT_TOKEN && CHAT_ID) {
              const stageLabel = isDeposit ? "Förskott" : "Slutbetalning";
              await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: CHAT_ID,
                  text: `💰 <b>Betalning mottagen!</b>\n\n👤 ${booking.customers.name}\n💳 ${session.amount_total ? (session.amount_total / 100).toLocaleString() : '?'} SEK\n📋 ${stageLabel}`,
                  parse_mode: "HTML",
                }),
              });
            }
          } catch (e) {
            console.error("Telegram notification failed:", e);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
