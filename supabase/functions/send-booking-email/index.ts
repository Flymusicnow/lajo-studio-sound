import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDIO_EMAIL = "lajomou@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking = await req.json();
    const isSv = booking.language === 'sv';

    const renderLine = (label: string, value: string) =>
      value ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #222"><span style="color:#666">${label}</span><span style="color:#f5f5f0">${value}</span></div>` : '';

    const addOnLines = (booking.addOns || []).map((a: any) =>
      renderLine(a.label, `${(a.price || 0).toLocaleString()} SEK`)
    ).join('');

    const masteringLine = booking.mastering?.type === 'per-track'
      ? renderLine(isSv ? 'Mastering' : 'Mastering', `${booking.mastering.tracks} × ${booking.mastering.pricePerTrack?.toLocaleString()} SEK`)
      : '';

    const total = booking.totalPrice || 0;
    const deposit = booking.depositAmount || 0;

    const customerSubject = isSv
      ? 'Bekräftelse: Din sessionförfrågan till TOPLINER PRODUCTION'
      : 'Confirmation: Your session request to TOPLINER PRODUCTION';

    const detailsBlock = `
      ${renderLine(isSv ? 'Session' : 'Session', booking.session?.label || '')}
      ${(booking.creativeTypes || []).length > 0 ? renderLine(isSv ? 'Skapar' : 'Creating', booking.creativeTypes.join(', ')) : ''}
      ${addOnLines}
      ${masteringLine}
      ${renderLine(isSv ? 'Resultatpaket' : 'Result Package', booking.resultPackage?.label || '')}
      ${booking.resultPackage?.price > 0 ? renderLine(isSv ? 'Paketpris' : 'Package price', `${booking.resultPackage.price.toLocaleString()} SEK`) : ''}
      ${booking.mixingScope ? renderLine(isSv ? 'Spår' : 'Tracks', booking.mixingScope) : ''}
      ${booking.projectDetails?.songs ? renderLine(isSv ? 'Antal låtar' : 'Songs', booking.projectDetails.songs) : ''}
      ${booking.projectDetails?.reference ? renderLine(isSv ? 'Referens' : 'Reference', booking.projectDetails.reference) : ''}
      ${booking.projectDetails?.deadline ? renderLine(isSv ? 'Deadline' : 'Deadline', new Date(booking.projectDetails.deadline).toLocaleDateString()) : ''}
      ${booking.projectDetails?.description ? renderLine(isSv ? 'Beskrivning' : 'Description', booking.projectDetails.description) : ''}
      ${renderLine(isSv ? 'Betalningsval' : 'Payment', booking.paymentChoice === 'deposit' ? (isSv ? '50% förskott' : '50% deposit') : (isSv ? 'Fullbetalning' : 'Full payment'))}
    `;

    const customerHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:'Georgia',serif;background:#0a0a0a;color:#f5f5f0;margin:0;padding:40px 20px}
      .c{max-width:600px;margin:0 auto}.hdr{text-align:center;margin-bottom:40px}
      .logo{font-size:28px;font-weight:700;letter-spacing:4px;color:#f5f5f0}
      .gold{color:#d4af37}.div{width:60px;height:1px;background:#d4af37;margin:20px auto}
      h1{font-size:24px;font-weight:400;margin-bottom:10px}
      p{line-height:1.8;color:#999;font-size:16px}
      .det{background:#111;padding:30px;margin:30px 0;border-left:2px solid #d4af37}
      .tot{text-align:center;margin:30px 0;padding:20px;border:1px solid #333}
      .tot .amt{font-size:32px;color:#d4af37;font-weight:700}
      .ftr{text-align:center;margin-top:40px;font-size:14px;color:#666}
    </style></head><body><div class="c">
      <div class="hdr"><div class="logo">TOPLINER</div><div class="div"></div></div>
      <h1>${isSv ? 'Tack för din förfrågan,' : 'Thank you for your request,'} <span class="gold">${booking.name}</span></h1>
      <p>${isSv ? 'Vi har mottagit din sessionförfrågan och återkommer inom 24 timmar.' : 'We have received your session request and will get back to you within 24 hours.'}</p>
      <div class="det">${detailsBlock}</div>
      <div class="tot">
        <p style="margin:0 0 8px;color:#999;font-size:14px">${isSv ? 'Totalt' : 'Total'}</p>
        <div class="amt">${total.toLocaleString()} SEK</div>
        ${booking.paymentChoice === 'deposit' ? `<p style="margin:8px 0 0;color:#666;font-size:14px">${isSv ? 'Förskott' : 'Deposit'}: ${deposit.toLocaleString()} SEK</p>` : ''}
      </div>
      <div class="ftr"><p>TOPLINER PRODUCTION</p><p style="color:#d4af37">${isSv ? 'Professionell Studio & Musikproduktion' : 'Professional Studio & Music Production'}</p></div>
    </div></body></html>`;

    const studioHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:'Georgia',serif;background:#0a0a0a;color:#f5f5f0;margin:0;padding:40px 20px}
      .c{max-width:600px;margin:0 auto}.hdr{text-align:center;margin-bottom:40px}
      .logo{font-size:28px;font-weight:700;letter-spacing:4px;color:#f5f5f0}
      .gold{color:#d4af37}.div{width:60px;height:1px;background:#d4af37;margin:20px auto}
      h1{font-size:24px;font-weight:400;margin-bottom:10px}
      p{line-height:1.8;color:#999;font-size:16px}
      .det{background:#111;padding:30px;margin:30px 0;border-left:2px solid #d4af37}
      .tot{text-align:center;margin:30px 0;padding:20px;border:1px solid #333}
      .tot .amt{font-size:32px;color:#d4af37;font-weight:700}
      .ftr{text-align:center;margin-top:40px;font-size:14px;color:#666}
    </style></head><body><div class="c">
      <div class="hdr"><div class="logo">TOPLINER</div><div class="div"></div></div>
      <h1>Ny bokningsförfrågan: <span class="gold">${booking.name}</span></h1>
      <p>Telefon: ${booking.phone || '–'} &nbsp;|&nbsp; E-post: ${booking.email}</p>
      <div class="det">
        ${renderLine('Arbetsläge', booking.workMode === 'remote' ? 'Remote' : 'Studio')}
        ${detailsBlock}
      </div>
      <div class="tot">
        <p style="margin:0 0 8px;color:#999;font-size:14px">Totalt</p>
        <div class="amt">${total.toLocaleString()} SEK</div>
        ${booking.paymentChoice === 'deposit' ? `<p style="margin:8px 0 0;color:#666;font-size:14px">Förskott: ${deposit.toLocaleString()} SEK</p>` : ''}
      </div>
      <div class="ftr"><p>TOPLINER PRODUCTION — intern bokningsavisering</p></div>
    </div></body></html>`;

    const [customerEmail, studioEmail] = await Promise.all([
      resend.emails.send({
        from: "TOPLINER PRODUCTION <onboarding@resend.dev>",
        to: [booking.email],
        subject: customerSubject,
        html: customerHtml,
      }),
      resend.emails.send({
        from: "TOPLINER PRODUCTION <onboarding@resend.dev>",
        to: [STUDIO_EMAIL],
        subject: `Ny bokning: ${booking.name} — ${booking.session?.label || ''} — ${total.toLocaleString()} SEK`,
        html: studioHtml,
      }),
    ]);

    return new Response(
      JSON.stringify({ success: true, customerEmail, studioEmail }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
