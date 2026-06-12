import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "info@niagarka.ca";
const FROM_EMAIL = "NUFF Website <onboarding@resend.dev>";

type NotifyType =
  | "contact"
  | "vendor_application"
  | "artist_application"
  | "volunteer_application"
  | "sponsorship_inquiry"
  | "vendor_booking";

const TITLES: Record<NotifyType, string> = {
  contact: "📬 New Contact Message",
  vendor_application: "🏪 New Vendor Application",
  artist_application: "🎤 New Artist Application",
  volunteer_application: "🙌 New Volunteer Application",
  sponsorship_inquiry: "🏆 New Sponsorship Inquiry",
  vendor_booking: "📍 New Vendor Spot Booking",
};

function renderRows(data: Record<string, any>) {
  return Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => {
      const label = k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const value = Array.isArray(v) ? v.join(", ") : String(v);
      return `<tr><td style="padding:6px 12px;font-weight:600;color:#444;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 12px;color:#222">${value}</td></tr>`;
    })
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: false, error: "Email not configured" });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { type, data } = (await req.json()) as { type: NotifyType; data: Record<string, any> };
    const title = TITLES[type] || "New submission";

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <div style="background: #0057B7; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">${title}</h2>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 12px;">NUFF 2026 — Niagara Ukrainian Family Festival</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          ${renderRows(data)}
        </table>
        <p style="color: #999; font-size: 11px; margin-top: 12px;">Sent automatically from festua.ca</p>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: title,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[notify] error:", e.message);
    return NextResponse.json({ ok: false, error: e.message });
  }
}
