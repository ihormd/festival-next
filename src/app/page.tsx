"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Calendar, Music, HandHeart, Store, Award, Users, Mic2, PartyPopper } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";

export default function Home() {
  const s = useSiteSettings();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("nuff_splash")) { setSplash(false); return; }
    const t = setTimeout(() => { setSplash(false); sessionStorage.setItem("nuff_splash", "1"); }, 2800);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { icon: Award, value: s.home_stat_1_value, label: s.home_stat_1_label },
    { icon: Mic2, value: s.home_stat_2_value, label: s.home_stat_2_label },
    { icon: Store, value: s.home_stat_3_value, label: s.home_stat_3_label },
    { icon: Users, value: s.home_stat_4_value, label: s.home_stat_4_label },
  ];

  const pillars = [
    { img: "/assets/food-vendors.jpg", title: s.home_pillar_food_title, body: s.home_pillar_food_body },
    { img: "/assets/stage-performance.jpg", title: s.home_pillar_music_title, body: s.home_pillar_music_body },
    { img: "/assets/culture-pysanky.jpg", title: s.home_pillar_culture_title, body: s.home_pillar_culture_body },
    { img: "/assets/memory-2.jpg", title: s.home_pillar_family_title, body: s.home_pillar_family_body },
  ];

  const involved = [
    { href: "/vendors", title: s.home_involved_vendors_title, body: s.home_involved_vendors_body, icon: Store },
    { href: "/artists", title: s.home_involved_artists_title, body: s.home_involved_artists_body, icon: Music },
    { href: "/volunteers", title: s.home_involved_volunteers_title, body: s.home_involved_volunteers_body, icon: HandHeart },
    { href: "/sponsors", title: s.home_involved_sponsors_title, body: s.home_involved_sponsors_body, icon: PartyPopper },
  ];

  return (
    <>
      {splash && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center", background: "var(--background)", transition: "opacity 0.7s", opacity: splash ? 1 : 0 }}>
          <img src="/assets/nuff-logo.png" alt="NUFF" style={{ width: "min(20rem, 80vw)", height: "auto", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }} />
        </div>
      )}

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="/assets/hero-festival.jpg" alt="NUFF Festival" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65))" }} />
        </div>
        <div className="container-page" style={{ position: "relative", paddingTop: "6rem", paddingBottom: "7rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: "white" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 1rem", borderRadius: "9999px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em" }}>
            <Calendar size={14} /> {s.festival_dates} · {s.location_name}
          </div>
          <h1 className="display-xl" style={{ marginTop: "1.5rem", color: "white", maxWidth: "56rem", textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}>
            <span style={{ color: "#0057B7" }}>N</span>iagara <span style={{ color: "#FFD700" }}>U</span>krainian{" "}
            <em style={{ fontStyle: "italic", fontWeight: 500 }}>Family Festival</em>
          </h1>
          <p style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "rgba(255,255,255,0.9)", maxWidth: "42rem" }}>{s.hero_subtitle}</p>
          <div style={{ marginTop: "2.25rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            <Link href="/vendors">
              <button style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "#0057B7", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {s.home_hero_cta_primary} <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/festival">
              <button style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1rem", fontWeight: 500 }}>
                {s.home_hero_cta_secondary}
              </button>
            </Link>
          </div>
          <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.85)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={16} /> {s.festival_dates}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={16} /> {s.location_name}, Niagara Falls</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "var(--primary)", color: "white" }}>
        <div className="container-page" style={{ padding: "2.5rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.25rem" }}>
              <Icon size={32} style={{ color: "#FFD700", marginBottom: "0.25rem" }} />
              <div className="font-display" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.8)" }}>{label}</div>
            </div>
          ))}
        </div>
        <style>{`@media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(4,1fr) !important; } }`}</style>
      </section>

      {/* Pillars */}
      <section className="container-page" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "42rem" }}>
          <p className="eyebrow">{s.home_pillars_eyebrow}</p>
          <h2 className="display-lg" style={{ marginTop: "0.5rem" }}>{s.home_pillars_heading}</h2>
        </div>
        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {pillars.map((p) => (
            <div key={p.title} style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)", boxShadow: "var(--shadow-soft)" }}>
              <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "var(--muted)" }}>
                <img src={p.img} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--primary)" }}>{p.title}</h3>
                <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get involved */}
      <section style={{ background: "var(--cream)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-page" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <p className="eyebrow">{s.home_involved_eyebrow}</p>
          <h2 className="display-lg" style={{ marginTop: "0.5rem", marginBottom: "3rem" }}>{s.home_involved_heading}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {involved.map(({ href, title, body, icon: Icon }) => (
              <Link key={href} href={href} style={{ display: "block", borderRadius: "1rem", background: "var(--card)", padding: "1.5rem", border: "1px solid var(--border)", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as any).style.borderColor = "var(--primary)"}
                onMouseLeave={e => (e.currentTarget as any).style.borderColor = "var(--border)"}>
                <Icon size={24} style={{ color: "var(--primary)" }} />
                <div className="font-display" style={{ marginTop: "1.25rem", fontSize: "1.25rem", fontWeight: 600 }}>{title}</div>
                <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{body}</p>
                <div style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}>
                  Learn more <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
