"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin, Calendar, Music, HandHeart, Store, Award, Users, Mic2, PartyPopper } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";
import { PartnersStrip } from "@/components/festival/PartnersStrip";

export default function Home() {
  const s = useSiteSettings();
  const [splashDone, setSplashDone] = useState(false);
  const [splashExit, setSplashExit] = useState(false);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("nuff_splash")) {
      setSplashDone(true); return;
    }
    const t = setTimeout(() => {
      setSplashExit(true);
      setTimeout(() => { setSplashDone(true); if (typeof window !== "undefined") sessionStorage.setItem("nuff_splash", "1"); }, 700);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { icon: Award, value: s.home_stat_1_value || "2", label: s.home_stat_1_label || "Days of celebration" },
    { icon: Mic2, value: s.home_stat_2_value || "10+", label: s.home_stat_2_label || "Performers & artists" },
    { icon: Store, value: s.home_stat_3_value || "30+", label: s.home_stat_3_label || "Vendors & artisans" },
    { icon: Users, value: s.home_stat_4_value || "1000+", label: s.home_stat_4_label || "Expected guests" },
  ];

  const pillars = [
    { img: s.pillar_food_image_url || "/assets/food-vendors.jpg", title: s.home_pillar_food_title || "Food", body: s.home_pillar_food_body || "Authentic Ukrainian cuisine and drinks." },
    { img: s.pillar_music_image_url || "/assets/stage-performance.jpg", title: s.home_pillar_music_title || "Music", body: s.home_pillar_music_body || "Live performances all weekend." },
    { img: s.pillar_culture_image_url || "/assets/culture-pysanky.jpg", title: s.home_pillar_culture_title || "Culture", body: s.home_pillar_culture_body || "Art, crafts, and traditions." },
    { img: s.pillar_family_image_url || "/assets/memory-2.jpg", title: s.home_pillar_family_title || "Family", body: s.home_pillar_family_body || "Activities for all ages." },
  ];

  const involved = [
    { href: "/vendors", title: s.home_involved_vendors_title || "Vendors", body: s.home_involved_vendors_body || "Reserve a booth on the live map.", icon: Store },
    { href: "/artists", title: s.home_involved_artists_title || "Artists", body: s.home_involved_artists_body || "Apply to perform on stage.", icon: Music },
    { href: "/volunteers", title: s.home_involved_volunteers_title || "Volunteers", body: s.home_involved_volunteers_body || "Pick a shift, choose your role.", icon: HandHeart },
    { href: "/sponsors", title: s.home_involved_sponsors_title || "Sponsors", body: s.home_involved_sponsors_body || "Partner with NUFF 2026.", icon: PartyPopper },
  ];

  return (
    <>
      {/* Splash */}
      {!splashDone && (
        <div ref={splashRef} className={splashExit ? "splash-exit" : ""} style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center", background: "var(--background)" }}>
          <img src="/assets/nuff-logo.png" alt="NUFF" className="splash-logo" style={{ width: "min(22rem, 75vw)", height: "auto", filter: "drop-shadow(0 20px 40px rgba(0,87,183,0.2))" }} />
        </div>
      )}

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 80px)" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={s.hero_image_url || "/assets/hero-festival.jpg"} alt="NUFF Festival" loading="eager" decoding="async" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.62) 100%)" }} />
        </div>
        <div className="container-page" style={{ position: "relative", paddingTop: "8rem", paddingBottom: "8rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: "white" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.1rem", borderRadius: "9999px", background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.22)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "Inter, sans-serif" }}>
            <Calendar size={13} /> {s.festival_dates || "July 11–12, 2026"} · {s.location_name || "Fireman's Park"}
          </div>
          <h1 className="display-xl" style={{ marginTop: "1.5rem", color: "white", maxWidth: "56rem", textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}>
            <span style={{ color: "#3b9eff" }}>N</span>iagara <span style={{ color: "#FFD700" }}>U</span>krainian{" "}
            <em style={{ fontWeight: 500 }}>Family Festival</em>
          </h1>
          <p style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "rgba(255,255,255,0.9)", maxWidth: "42rem", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
            {s.hero_subtitle || "Two days of music, dance, food, craft, and community at Fireman's Park."}
          </p>
          <div style={{ marginTop: "2.25rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            <Link href="/vendors">
              <button style={{ padding: "0.8rem 1.75rem", borderRadius: "9999px", background: "#0057B7", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif" }}>
                {s.home_hero_cta_primary || "Book a vendor spot"} <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/festival">
              <button style={{ padding: "0.8rem 1.75rem", borderRadius: "9999px", background: "rgba(255,255,255,0.13)", color: "white", border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1rem", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                {s.home_hero_cta_secondary || "Explore the festival"}
              </button>
            </Link>
          </div>
          <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.82)", fontFamily: "Inter, sans-serif" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={15} /> {s.festival_dates || "July 11–12, 2026"}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={15} /> {s.location_name || "Fireman's Park"}, Niagara Falls</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#0057B7", color: "white" }}>
        <div className="container-page stats-grid" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.25rem" }}>
              <Icon size={34} style={{ color: "#FFD700", marginBottom: "0.5rem" }} />
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.78)", fontFamily: "Inter, sans-serif", marginTop: "0.25rem" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "42rem" }}>
          <p className="eyebrow">{s.home_pillars_eyebrow || "What to expect"}</p>
          <h2 className="display-lg" style={{ marginTop: "0.5rem" }}>{s.home_pillars_heading || "Four pillars of the festival"}</h2>
        </div>
        <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {pillars.map((p) => (
            <div key={p.title} className="pillar-card" style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)", boxShadow: "var(--shadow-soft)" }}>
              <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "var(--muted)" }}>
                <img src={p.img} alt={p.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>{p.title}</h3>
                <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get involved */}
      <section style={{ background: "var(--cream)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-page" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <p className="eyebrow">{s.home_involved_eyebrow || "Get involved"}</p>
          <h2 className="display-lg" style={{ marginTop: "0.5rem", marginBottom: "3rem" }}>{s.home_involved_heading || "Join NUFF 2026"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {involved.map(({ href, title, body, icon: Icon }) => (
              <Link key={href} href={href} className="involved-card" style={{ display: "block", borderRadius: "1rem", background: "var(--card)", padding: "1.5rem", border: "1px solid var(--border)" }}>
                <Icon size={24} style={{ color: "var(--primary)" }} />
                <div style={{ marginTop: "1.25rem", fontFamily: "Montserrat, sans-serif", fontSize: "1.2rem", fontWeight: 700 }}>{title}</div>
                <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{body}</p>
                <div style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}>
                  Learn more <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PartnersStrip />
    </>
  );
}
