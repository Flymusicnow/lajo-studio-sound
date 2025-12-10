import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequest {
  service: string;
  package: string;
  songs: string;
  tracks: string;
  delivery: string;
  recordingDate: string;
  name: string;
  artistName: string;
  email: string;
  phone: string;
  location: string;
  musicLink: string;
  description: string;
  language: 'sv' | 'en';
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Booking email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingRequest = await req.json();
    console.log("Received booking:", { name: booking.name, email: booking.email, service: booking.service });

    const isSv = booking.language === 'sv';

    // Email to the customer
    const customerSubject = isSv 
      ? 'Bekräftelse: Din bokningsförfrågan till LAJO Studio'
      : 'Confirmation: Your booking request to LAJO Studio';

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Georgia', serif; background: #0a0a0a; color: #f5f5f0; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: 600; letter-spacing: 4px; color: #f5f5f0; }
          .gold { color: #d4af37; }
          .divider { width: 60px; height: 1px; background: #d4af37; margin: 20px auto; }
          h1 { font-size: 24px; font-weight: 400; margin-bottom: 10px; }
          p { line-height: 1.8; color: #999; font-size: 16px; }
          .details { background: #111; padding: 30px; margin: 30px 0; border-left: 2px solid #d4af37; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #222; }
          .detail-label { color: #666; }
          .detail-value { color: #f5f5f0; }
          .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LAJO</div>
            <div class="divider"></div>
          </div>
          
          <h1>${isSv ? 'Tack för din förfrågan,' : 'Thank you for your request,'} <span class="gold">${booking.name}</span></h1>
          
          <p>${isSv 
            ? 'Vi har mottagit din bokningsförfrågan och återkommer inom kort med bekräftelse, pris och nästa steg.'
            : 'We have received your booking request and will get back to you shortly with confirmation, pricing, and next steps.'
          }</p>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">${isSv ? 'Tjänst' : 'Service'}</span>
              <span class="detail-value">${booking.service}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">${isSv ? 'Paket' : 'Package'}</span>
              <span class="detail-value">${booking.package}</span>
            </div>
            ${booking.songs ? `
            <div class="detail-row">
              <span class="detail-label">${isSv ? 'Antal låtar' : 'Number of songs'}</span>
              <span class="detail-value">${booking.songs}</span>
            </div>
            ` : ''}
            ${booking.artistName ? `
            <div class="detail-row">
              <span class="detail-label">${isSv ? 'Artistnamn' : 'Artist name'}</span>
              <span class="detail-value">${booking.artistName}</span>
            </div>
            ` : ''}
          </div>
          
          <p>${isSv 
            ? 'Om du har några frågor, svara gärna på detta mail.'
            : 'If you have any questions, feel free to reply to this email.'
          }</p>
          
          <div class="footer">
            <p>LAJO Studio</p>
            <p style="color: #d4af37;">${isSv ? 'Professionell Mixning & Mastring' : 'Professional Mixing & Mastering'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send customer confirmation email
    const customerEmail = await resend.emails.send({
      from: "LAJO Studio <onboarding@resend.dev>",
      to: [booking.email],
      subject: customerSubject,
      html: customerHtml,
    });

    console.log("Customer email sent:", customerEmail);

    return new Response(
      JSON.stringify({ success: true, customerEmail }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
