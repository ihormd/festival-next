"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { dbQuery } from "@/lib/db";

type Tier = { tier: "bronze"|"silver"|"gold"|"platinum"; name: string; price: number; perks: string[]; featured?: boolean };
const tiers: Tier[] = [
  { tier: "bronze", name: "Bronze", price: 250, perks: ["Logo on website", "Social media mention", "Festival program listing"] },
  { tier: "silver", name: "Silver", price: 1000, perks: ["All Bronze perks", "Stage shout-out", "Reserved booth space", "Logo on signage"] },
  { tier: "gold", name: "Gold", price: 5000, perks: ["All Silver perks", "Premium booth location", "Headline stage banner", "VIP hospitality"], featured: true },
  { tier: "platinum", name: "Platinum", price: 15000, perks: ["All Gold perks", "Title sponsor naming", "Dedicated press release", "Year-round partnership"] },
];

type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: "platinum"|"gold"|"silver"|"bronze"; sort_order: number };

export default function SponsorsPage() {
  const [list, setList] = useState<Sponsor[]>([]);
  useEffect(() => {
    dbQuery<Sponsor>({ table: "sponsors", filters: { active: true }, order: { col: "sort_order" } }).then(setList);
  }, []);

  const groups: Record<Sponsor["level"], Sponsor[]> = { platinum: [], gold: [], silver: [], bronze: [] };
  list.forEach(s => groups[s.level].push(s));

  return (
    <>
      <PageHeader eyebrow="Partner with NUFF" title="Sponsor the festival." subtitle="Reach thousands of engaged Niagara families and align your brand with Ukrainian heritage." />

      {/* Current partners by level */}
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
        {(["platinum", "gold", "silver", "bronze"] as const).map(lvl => groups[lvl].length > 0 && (
          <div key={lvl} style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600, textTransform: "capitalize", marginBottom: "1.25rem" }}>{lvl} Partners</h2>
            <div style={{ display: "grid", gap: "1.5rem", alignItems: "center", gridTemplateColumns: lvl === "platinum" ? "repeat(auto-fill, minmax(220px, 1fr))" : "repeat(auto-fill, minmax(160px, 1fr))" }}>
              {groups[lvl].map(sp => {
                const h = lvl === "platinum" ? 112 : lvl === "gold" ? 96 : 80;
                const inner = sp.logo_url
                  ? <img src={sp.logo_url} alt={sp.name} style={{ height: h, width: "auto", objectFit: "contain", margin: "0 auto", display: "block" }} />
                  : <div style={{ height: h, width: "100%", borderRadius: "0.5rem", background: "white", border: "1px dashed var(--border)", display: "grid", placeItems: "center", padding: "0 1rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", textAlign: "center" }}>{sp.name}</div>;
                return sp.website_url
                  ? <a key={sp.id} href={sp.website_url} target="_blank" rel="noopener noreferrer">{inner}</a>
                  : <div key={sp.id}>{inner}</div>;
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Tiers */}
      <section className="container-page" style={{ paddingBottom: "3rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem" }}>Sponsorship Packages</h2>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem" }}>Choose your tier — or design a custom partnership with our team.</p>
        <style>{`@media (min-width: 768px) { .tier-grid { grid-template-columns: repeat(2,1fr) !important; } } @media (min-width: 1024px) { .tier-grid { grid-template-columns: repeat(4,1fr) !important; } }`}</style>
        <div className="tier-grid" style={{ display: "grid", gap: "1.5rem" }}>
          {tiers.map(t => (
            <div key={t.tier} style={{ position: "relative", borderRadius: "1rem", border: `1px solid ${t.featured ? "var(--primary)" : "var(--border)"}`, padding: "1.5rem", display: "flex", flexDirection: "column", background: t.featured ? "linear-gradient(to bottom, oklch(0.42 0.19 255 / 0.05), transparent)" : "var(--card)", boxShadow: t.featured ? "0 8px 32px -8px oklch(0.42 0.19 255 / 0.3)" : "none" }}>
              {t.featured && <span style={{ position: "absolute", top: -12, left: 24, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, background: "var(--primary)", color: "white", padding: "0.2rem 0.6rem", borderRadius: "0.25rem" }}>Most popular</span>}
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600 }}>{t.name}</h3>
              <div style={{ margin: "0.5rem 0 1.5rem" }}>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2.25rem", fontWeight: 600 }}>${t.price.toLocaleString()}</span>
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
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 600 }}>Partner with NUFF 2026</h2>
          <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.9)", maxWidth: "40rem", margin: "0.75rem auto 0" }}>Custom packages, in-kind contributions, and multi-year partnerships are all welcome. Let's design something meaningful together.</p>
          <Link href="/contact">
            <button style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", borderRadius: "9999px", background: "var(--secondary)", color: "var(--ink)", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}>Talk to our team</button>
          </Link>
        </div>
      </section>
    </>
  );
}
