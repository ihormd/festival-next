"use client";
import { useSiteSettings } from "@/lib/site-content";
export default function Page() {
  const s = useSiteSettings();
  return (
    <div className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <p className="eyebrow">NUFF 2026</p>
      <h1 className="display-lg" style={{ marginTop: "0.5rem", textTransform: "capitalize" }}>volunteers</h1>
      <p style={{ marginTop: "1rem", color: "var(--muted-foreground)" }}>{s.festival_dates} · {s.location_name}.</p>
    </div>
  );
}
