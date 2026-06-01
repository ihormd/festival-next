"use client";
import Link from "next/link";
import { useSiteSettings } from "@/lib/site-content";

export function Footer() {
  const s = useSiteSettings();
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "6rem", background: "var(--cream)" }}>
      <div className="ribbon" style={{ height: 6 }} />
      <div className="container-page" style={{ padding: "3.5rem 1.5rem", display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={s.logo_url || "/assets/nuff-logo.png"} alt={s.festival_short_name} style={{ height: 56, width: "auto" }} />
            <div>
              <div className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>{s.festival_short_name}</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>{s.festival_name}</div>
            </div>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted-foreground)", maxWidth: 400 }}>
            {s.festival_dates} · {s.location_name}, Niagara Falls. {s.footer_tagline}
          </p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>{s.footer_col1_title}</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
            <li><Link href="/festival">{s.header_nav_festival}</Link></li>
            <li><Link href="/entertainment">{s.header_nav_entertainment}</Link></li>
            <li><Link href="/merch">{s.header_nav_merch}</Link></li>
            <li><Link href="/about">{s.header_nav_about}</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>{s.footer_col2_title}</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
            <li><Link href="/vendors">{s.header_nav_vendors_label}</Link></li>
            <li><Link href="/volunteers">{s.header_nav_volunteers_label}</Link></li>
            <li><Link href="/sponsors">{s.header_nav_sponsors_label}</Link></li>
            <li><Link href="/contact">{s.header_nav_contact}</Link></li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-page" style={{ padding: "1.25rem 1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          <div>© {new Date().getFullYear()} {s.footer_copyright}</div>
          <div>{s.footer_contact_display}</div>
        </div>
      </div>
    </footer>
  );
}
