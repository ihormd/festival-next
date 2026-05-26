"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSiteSettings } from "@/lib/site-content";
import Link from "next/link";

const lineup = [
  { time: "Sat 12:00", act: "Opening Ceremony", note: "Welcome with Hopak dance ensemble" },
  { time: "Sat 14:00", act: "Bandura Live", note: "Traditional string instrument" },
  { time: "Sat 17:00", act: "Folk Dance Showcase", note: "5 ensembles · all ages" },
  { time: "Sat 20:00", act: "Headliner — TBA", note: "Modern Ukrainian artist" },
  { time: "Sun 13:00", act: "Pysanky Workshop", note: "Egg painting masterclass" },
  { time: "Sun 16:00", act: "Vyshyvanka Parade", note: "Traditional embroidered shirts" },
];

export default function EntertainmentPage() {
  const s = useSiteSettings();
  return (
    <>
      <PageHeader eyebrow={s.entertainment_eyebrow || "Live performances"} title={s.entertainment_title || "Entertainment"} subtitle={s.entertainment_subtitle || "Two days of music, dance, and cultural performances."} />
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <style>{`@media (min-width: 1024px) { .ent-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
        <div className="ent-grid" style={{ display: "grid", gap: "2.5rem", alignItems: "start" }}>
          <div style={{ borderRadius: "0.875rem", overflow: "hidden", border: "1px solid var(--border)" }}>
            <img src="/assets/stage-performance.jpg" alt="Stage performance" style={{ width: "100%", height: 320, objectFit: "cover" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>{s.entertainment_schedule_title || "Weekend lineup"}</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {lineup.map(l => (
                <div key={l.time + l.act} style={{ padding: "1rem 0", display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: 80, flexShrink: 0, fontSize: "0.8rem", fontFamily: "monospace", color: "var(--secondary)", fontWeight: 600, paddingTop: "0.125rem" }}>{l.time}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{l.act}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{l.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ background: "oklch(0.94 0.012 85 / 0.4)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <style>{`@media (min-width: 1024px) { .ent-cta { grid-template-columns: 1fr 1fr !important; } }`}</style>
          <div className="ent-cta" style={{ display: "grid", gap: "2.5rem", alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>{s.entertainment_cta_title || "Are you a performer?"}</h2>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem", lineHeight: 1.7 }}>{s.entertainment_cta_body || "Apply to perform on stage at NUFF 2026. We welcome all styles of Ukrainian music and dance."}</p>
              <Link href="/apply/artist"><button style={{ padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>Apply to Perform</button></Link>
            </div>
            <img src="/assets/culture-pysanky.jpg" alt="Pysanky" style={{ borderRadius: "0.875rem", width: "100%", height: 288, objectFit: "cover" }} />
          </div>
        </div>
      </section>
    </>
  );
}
