"use client";
import { useSiteSettings } from "@/lib/site-content";
import { Heart, Globe, Star } from "lucide-react";

export default function AboutPage() {
  const s = useSiteSettings();
  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Who we are</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>About NUFF</h1>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem", maxWidth: "860px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {[
            { icon: Heart, title: "Our Mission", body: s.about_mission || "NUFF celebrates Ukrainian heritage and brings the Niagara community together through music, food, and culture." },
            { icon: Globe, title: "Our History", body: s.about_history || "Founded by the Ukrainian community of Niagara, NUFF has grown into one of the region's most beloved summer festivals." },
            { icon: Star, title: "Our Vision", body: "To create an annual celebration that honors Ukrainian culture while welcoming everyone from across the Niagara region and beyond." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ padding: "1.75rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)" }}>
              <Icon size={28} style={{ color: "var(--primary)", marginBottom: "0.75rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1.7, color: "var(--foreground)" }}>
            "The Niagara Ukrainian Family Festival is more than an event — it's a living expression of who we are as a community, a celebration of resilience, joy, and the enduring spirit of Ukrainian culture."
          </p>
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--muted-foreground)" }}>— NUFF Organizing Committee</p>
        </div>
      </section>
    </div>
  );
}
