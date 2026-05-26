"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { TeamSection } from "@/components/festival/TeamSection";
import { useSiteSettings } from "@/lib/site-content";

export default function AboutPage() {
  const s = useSiteSettings();
  return (
    <>
      <PageHeader eyebrow={s.about_eyebrow || "Who we are"} title={s.about_title || "About NUFF"} subtitle={s.about_subtitle || "The people and story behind the Niagara Ukrainian Family Festival."} />
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem", display: "grid", gap: "3rem" }}>
        <style>{`@media (min-width: 1024px) { .about-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
        <div className="about-grid" style={{ display: "grid", gap: "3rem" }}>
          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>{s.about_mission_heading || "Our Mission"}</h2>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.about_mission || "NUFF celebrates Ukrainian heritage and brings the Niagara community together through music, food, and culture."}</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>{s.about_history_heading || "Our History"}</h2>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.about_history || "Founded by the Ukrainian community of Niagara, NUFF has grown into one of the region's most beloved summer festivals."}</p>
          </div>
        </div>
      </section>
      <TeamSection />
    </>
  );
}
