import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "ihor.m.dorosh@gmail.com";
const FROM_EMAIL = "NUFF Website <onboarding@resend.dev>";

type NotifyType = "contact" | "vendor_application" | "artist_application" | "volunteer_application" | "sponsorship_inquiry" | "vendor_booking";

const TITLES: Record<NotifyType, string> = {
  contact: "📬 New Contact Message — NUFF",
  vendor_application: "🏪 New Vendor Application — NUFF",
  artist_application: "🎤 New Artist Application — NUFF",
  volunteer_application: "🙌 New Volunteer Application — NUFF",
  sponsorship_inquiry: "🏆 New Sponsorship Inquiry — NUFF",
  vendor_booking: "📍 New Vendor Spot Booking — NUFF",
};

function renderRows(data: Record<string, any>) {
  return Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && v !== "undefined")
    .map(([k, v]) => {
      const label = k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const value = Array.isArray(v) ? v.join(", ") : String(v);
      return `<tr><td style="padding:8px 14px;font-weight:600;color:#555;vertical-align:top;white-space:nowrap;background:#f9f9f9;border-bottom:1px solid #eee">${label}</td><td style="padding:8px 14px;color:#222;border-bottom:1px solid #eee">${value}</td></tr>`;
    }).join("");
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[notify] RESEND_API_KEY not set");
      return NextResponse.json({ ok: false, error: "Email not configured" });
    }

    const { type, data } = (await req.json()) as { type: NotifyType; data: Record<string, any> };
    const title = TITLES[type] || "📋 New submission — NUFF";
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#0057B7;padding:20px 24px">
          <h2 style="color:white;margin:0;font-size:18px;font-weight:700">${title}</h2>
          <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:12px">festua.ca — NUFF 2026</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#fff">
          ${renderRows(data)}
        </table>
        <div style="padding:12px 16px;background:#f9f9f9;border-top:1px solid #eee">
          <p style="color:#aaa;font-size:11px;margin:0">Sent automatically from festua.ca · ${new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" })}</p>
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: title,
      html,
    });

    if (result.error) {
      console.error("[notify] Resend error:", result.error);
      return NextResponse.json({ ok: false, error: result.error });
    }

    console.log("[notify] Email sent to", ADMIN_EMAIL, "id:", result.data?.id);
    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (e: any) {
    console.error("[notify] Exception:", e.message);
    return NextResponse.json({ ok: false, error: e.message });
  }
}
