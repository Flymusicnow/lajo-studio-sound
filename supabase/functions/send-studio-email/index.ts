import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const baseStyle = `
  body{font-family:'Georgia',serif;background:#0a0a0a;color:#f5f5f0;margin:0;padding:40px 20px}
  .c{max-width:600px;margin:0 auto}.hdr{text-align:center;margin-bottom:40px}
  .logo{font-size:28px;font-weight:700;letter-spacing:4px;color:#f5f5f0}
  .gold{color:#d4af37}.div{width:60px;height:1px;background:#d4af37;margin:20px auto}
  h1{font-size:24px;font-weight:400;margin-bottom:10px}
  p{line-height:1.8;color:#999;font-size:16px}
  .box{background:#111;padding:30px;margin:30px 0;border-left:2px solid #d4af37}
  .btn{display:inline-block;background:#d4af37;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-weight:700;letter-spacing:1px;margin:20px 0}
  .ftr{text-align:center;margin-top:40px;font-size:14px;color:#666}
`;

const wrap = (content: string) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyle}</style></head><body><div class="c">
  <div class="hdr"><div class="logo">TOPLINER</div><div class="div"></div></div>
  ${content}
  <div class="ftr"><p>TOPLINER PRODUCTION</p><p style="color:#d4af37">Professionell Studio & Musikproduktion</p></div>
</div></body></html>`;

interface EmailPayload {
  type: string;
  email?: string;
  customerName?: string;
  bookingId?: string;
  totalPrice?: number;
  depositAmount?: number;
  uploadUrl?: string;
  reason?: string;
}

const templates: Record<string, (p: EmailPayload) => { subject: string; html: string }> = {
  booking_approved: (p) => ({
    subject: 'Din bokning är godkänd – TOPLINER PRODUCTION',
    html: wrap(`
      <h1>Grattis, <span class="gold">${p.customerName}</span>!</h1>
      <p>Din sessionförfrågan har godkänts. Vi ser fram emot att arbeta med dig.</p>
      <div class="box">
        <p style="color:#f5f5f0;margin:0">Nästa steg: slutför betalningen för att bekräfta din session.</p>
        ${p.totalPrice ? `<p style="color:#d4af37;font-size:20px;margin:10px 0 0">Totalt: ${p.totalPrice.toLocaleString()} SEK</p>` : ''}
        ${p.depositAmount ? `<p style="color:#999;margin:5px 0 0">Förskott (50%): ${p.depositAmount.toLocaleString()} SEK</p>` : ''}
      </div>
      <p>Vi återkommer med betalningsinformation inom kort.</p>
    `),
  }),

  booking_declined: (p) => ({
    subject: 'Angående din bokningsförfrågan – TOPLINER PRODUCTION',
    html: wrap(`
      <h1>Hej <span class="gold">${p.customerName}</span>,</h1>
      <p>Tyvärr kan vi inte tillgodose din sessionförfrågan just nu.</p>
      ${p.reason ? `<div class="box"><p style="color:#f5f5f0;margin:0">${p.reason}</p></div>` : ''}
      <p>Tveka inte att kontakta oss för alternativa tider eller upplägg.</p>
    `),
  }),

  payment_request: (p) => ({
    subject: 'Betalning – TOPLINER PRODUCTION',
    html: wrap(`
      <h1>Dags att säkra din session, <span class="gold">${p.customerName}</span></h1>
      <div class="box">
        ${p.totalPrice ? `<p style="color:#d4af37;font-size:24px;font-weight:700;margin:0">${p.depositAmount?.toLocaleString() || p.totalPrice.toLocaleString()} SEK</p>` : ''}
        <p style="color:#999;margin:10px 0 0">Betala förskottet för att bekräfta din plats.</p>
      </div>
      <p>Betalningsinstruktioner bifogas separat. Vid frågor, svara på detta mejl.</p>
    `),
  }),

  payment_received: (p) => ({
    subject: 'Betalning mottagen – TOPLINER PRODUCTION',
    html: wrap(`
      <h1>Tack, <span class="gold">${p.customerName}</span>!</h1>
      <p>Vi har mottagit din betalning. Din session är nu bekräftad.</p>
      <div class="box">
        <p style="color:#f5f5f0;margin:0">Nästa steg: Vi skickar instruktioner för att ladda upp dina projektfiler.</p>
      </div>
    `),
  }),

  files_requested: (p) => ({
    subject: 'Skicka dina projektfiler – TOPLINER PRODUCTION',
    html: wrap(`
      <h1>Hej <span class="gold">${p.customerName}</span>,</h1>
      <p>Det är dags att skicka dina projektfiler så vi kan börja arbeta.</p>
      <div class="box">
        <p style="color:#f5f5f0;margin:0 0 10px">Instruktioner:</p>
        <p style="color:#999;margin:0">• Lägg alla spår/stems i en mapp</p>
        <p style="color:#999;margin:0">• Namnge filerna tydligt</p>
        <p style="color:#999;margin:0">• Komprimera som ZIP</p>
        <p style="color:#999;margin:0">• Inkludera referensspår, BPM & tonart</p>
      </div>
      ${p.uploadUrl ? `<a href="${p.uploadUrl}" class="btn">LADDA UPP FILER</a>` : ''}
      <p style="font-size:14px;color:#666">Alternativt: Skicka en WeTransfer- eller Google Drive-länk genom uppladdningssidan.</p>
    `),
  }),

  files_received: (p) => ({
    subject: 'Filer mottagna – TOPLINER PRODUCTION',
    html: wrap(`
      <h1>Filer mottagna!</h1>
      <p>Vi har tagit emot projektfiler för <span class="gold">${p.customerName}</span>.</p>
      <div class="box">
        <p style="color:#f5f5f0;margin:0">Vi granskar materialet och påbörjar arbetet enligt plan.</p>
      </div>
    `),
  }),
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { type, email } = payload;

    const template = templates[type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: `Unknown email type: ${type}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { subject, html } = template(payload);

    // For files_received, send to studio (no customer email needed)
    const toEmail = type === 'files_received' 
      ? 'studio@toplinerproduction.com'
      : email;

    if (!toEmail) {
      return new Response(
        JSON.stringify({ error: 'No recipient email provided' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = await resend.emails.send({
      from: "TOPLINER PRODUCTION <onboarding@resend.dev>",
      to: [toEmail],
      subject,
      html,
    });

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-studio-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
