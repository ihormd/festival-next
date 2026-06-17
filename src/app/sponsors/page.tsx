"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/lib/site-content";
import Link from "next/link";
import { dbQuery } from "@/lib/db";

type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: "platinum"|"gold"|"silver"|"bronze"; sort_order: number };

export default function SponsorsPage() {
  const [list, setList] = useState<Sponsor[]>([]);
  const s = useSiteSettings();

  useEffect(() => {
    dbQuery<Sponsor>({ table: "sponsors", filters: { active: true }, order: { col: "sort_order" } }).then(setList);
  }, []);

  // Parse tier cards from settings
  const tiers = [
    {
      tier: "bronze",
      name: s.tier_bronze_name || "Bronze",
      price: s.tier_bronze_price || "$250",
      perks: (s.tier_bronze_perks || "Logo on website\nSocial media mention\nFestival program listing").split("\n").filter(Boolean),
    },
    {
      tier: "silver",
      name: s.tier_silver_name || "Silver",
      price: s.tier_silver_price || "$1,000",
      perks: (s.tier_silver_perks || "All Bronze perks\nStage shout-out\nReserved booth space\nLogo on signage").split("\n").filter(Boolean),
      featured: true,
    },
    {
      tier: "gold",
      name: s.tier_gold_name || "Gold",
      price: s.tier_gold_price || "$5,000",
      perks: (s.tier_gold_perks || "All Silver perks\nPremium booth location\nHeadline stage banner\nVIP hospitality").split("\n").filter(Boolean),
    },
    {
      tier: "platinum",
      name: s.tier_platinum_name || "Platinum",
      price: s.tier_platinum_price || "$15,000",
      perks: (s.tier_platinum_perks || "All Gold perks\nTitle sponsor naming\nDedicated press release\nYear-round partnership").split("\n").filter(Boolean),
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Partner with NUFF" title="Sponsor the festival." subtitle="Reach thousands of engaged Niagara families and align your brand with Ukrainian heritage." />

      {/* All sponsors — flat grid, no tier grouping */}
      {list.length > 0 && (
        <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginBottom: "2rem" }}>Our Partners</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem", alignItems: "center" }}>
            {list.map(sp => (
              <div key={sp.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "1.5rem", borderRadius: "1rem", background: "white", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "all 0.25s" }}
                onMouseEnter={e => { (e.currentTarget as any).style.boxShadow = "0 8px 40px rgba(0,87,183,0.15)"; (e.currentTarget as any).style.borderColor = "var(--primary)"; (e.currentTarget as any).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as any).style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; (e.currentTarget as any).style.borderColor = "var(--border)"; (e.currentTarget as any).style.transform = "translateY(0)"; }}>
                {sp.logo_url ? (
                  sp.website_url
                    ? <a href={sp.website_url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                        <img src={sp.logo_url} alt={sp.name} style={{ maxHeight: 120, maxWidth: 200, width: "auto", objectFit: "contain" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>{sp.name}</span>
                      </a>
                    : <>
                        <img src={sp.logo_url} alt={sp.name} style={{ maxHeight: 120, maxWidth: 200, width: "auto", objectFit: "contain" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>{sp.name}</span>
                      </>
                ) : (
                  <div style={{ height: 120, width: "100%", display: "grid", placeItems: "center", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>{sp.name}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tier cards */}
      <section className="container-page" style={{ paddingTop: list.length > 0 ? "2rem" : "3rem", paddingBottom: "3rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}>Sponsorship Packages</h2>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>{s.tier_section_subtitle || "Choose your tier — or design a custom partnership with our team."}</p>
        <style>{`@media (min-width: 768px) { .tier-grid { grid-template-columns: repeat(2,1fr) !important; } } @media (min-width: 1024px) { .tier-grid { grid-template-columns: repeat(4,1fr) !important; } }`}</style>
        <div className="tier-grid" style={{ display: "grid", gap: "1.5rem" }}>
          {tiers.map(t => (
            <div key={t.tier} style={{ position: "relative", borderRadius: "1rem", border: `${t.featured ? "2px" : "1px"} solid ${t.featured ? "var(--primary)" : "var(--border)"}`, padding: "1.5rem", display: "flex", flexDirection: "column", background: t.featured ? "linear-gradient(to bottom, oklch(0.42 0.19 255 / 0.05), transparent)" : "var(--card)", boxShadow: t.featured ? "0 8px 32px -8px oklch(0.42 0.19 255 / 0.3)" : "none" }}>
              {t.featured && <span style={{ position: "absolute", top: -12, left: 24, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, background: "var(--primary)", color: "white", padding: "0.2rem 0.6rem", borderRadius: "0.25rem" }}>Most popular</span>}
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600 }}>{t.name}</h3>
              <div style={{ margin: "0.5rem 0 1.5rem" }}>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2.25rem", fontWeight: 600 }}>{t.price}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginLeft: "0.25rem" }}>CAD</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", fontSize: "0.875rem", flex: 1 }}>
                {t.perks.map(p => <li key={p} style={{ display: "flex", gap: "0.5rem" }}><Check size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} /><span>{p}</span></li>)}
              </ul>
              <Link href={`/sponsor/apply?tier=${t.tier}`} style={{ marginTop: "1.5rem" }}>
                <button style={{ width: "100%", padding: "0.625rem", borderRadius: "0.5rem", background: t.featured ? "var(--primary)" : "none", color: t.featured ? "white" : "var(--primary)", border: `1px solid ${t.featured ? "transparent" : "var(--primary)"}`, cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
                  Choose {t.name}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page" style={{ paddingBottom: "4rem" }}>
        <div style={{ borderRadius: "1.5rem", background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.18 252))", padding: "2.5rem 2rem", color: "white", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 600 }}>{s.tier_cta_title || "Partner with NUFF 2026"}</h2>
          <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.9)", maxWidth: "40rem", margin: "0.75rem auto 0" }}>{s.tier_cta_body || "Custom packages, in-kind contributions, and multi-year partnerships are all welcome."}</p>
          <Link href="/contact">
            <button style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", borderRadius: "9999px", background: "var(--secondary)", color: "var(--ink)", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}>Talk to our team</button>
          </Link>
        </div>
      </section>
    </>
  );
}
