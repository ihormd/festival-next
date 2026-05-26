"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Check, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Tier = { tier: string; name: string; price: number; perks: string[]; featured?: boolean; };
const tiers: Tier[] = [
  { tier: "bronze", name: "Bronze", price: 250, perks: ["Logo on website", "Social media mention", "Festival program listing"] },
  { tier: "silver", name: "Silver", price: 1000, perks: ["All Bronze perks", "Stage shout-out", "Reserved booth space", "Logo on signage"] },
  { tier: "gold", name: "Gold", price: 5000, perks: ["All Silver perks", "Premium booth location", "Headline stage banner", "VIP hospitality"], featured: true },
  { tier: "platinum", name: "Platinum", price: 15000, perks: ["All Gold perks", "Title sponsor naming", "Dedicated press release", "Year-round partnership"] },
];
type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: string; sort_order: number; };

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };

export default function SponsorsPage() {
  const [list, setList] = useState<Sponsor[]>([]);
  const [form, setForm] = useState({ company_name: "", contact_name: "", email: "", tier: "gold", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("sponsors").select("*").eq("active", true).order("sort_order").then(({ data }) => setList(data ?? []));
  }, []);

  const groups: Record<string, Sponsor[]> = { platinum: [], gold: [], silver: [], bronze: [] };
  list.forEach(s => { if (groups[s.level]) groups[s.level].push(s); });

  const submit = async () => {
    if (!form.company_name || !form.email) return;
    setLoading(true);
    await supabase.from("sponsorship_inquiries").insert({ ...form, festival_year: 2026, status: "pending" });
    setLoading(false); setSent(true);
  };

  return (
    <>
      <PageHeader eyebrow="Partner with NUFF" title="Sponsor the festival." subtitle="Reach thousands of engaged Niagara families and align your brand with Ukrainian heritage." />

      {/* Current partners */}
      {list.length > 0 && (
        <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
          {(["platinum", "gold", "silver", "bronze"] as const).map(lvl => groups[lvl].length > 0 && (
            <div key={lvl} style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600, textTransform: "capitalize", marginBottom: "1.25rem" }}>{lvl} Partners</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
                {groups[lvl].map(sp => {
                  const h = lvl === "platinum" ? 112 : lvl === "gold" ? 96 : 80;
                  const inner = sp.logo_url
                    ? <img src={sp.logo_url} alt={sp.name} style={{ height: h, width: "auto", objectFit: "contain" }} />
                    : <div style={{ height: h, minWidth: 180, borderRadius: "0.5rem", background: "white", border: "1px dashed var(--border)", display: "grid", placeItems: "center", padding: "0 1rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--muted-foreground)" }}>{sp.name}</div>;
                  return sp.website_url
                    ? <a key={sp.id} href={sp.website_url} target="_blank" rel="noopener noreferrer">{inner}</a>
                    : <div key={sp.id}>{inner}</div>;
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Tiers */}
      <section className="container-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Sponsorship Packages</h2>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2.5rem" }}>Choose your tier — or design a custom partnership with our team.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {tiers.map(t => (
            <div key={t.tier} style={{ position: "relative", borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column", border: t.featured ? "2px solid var(--primary)" : "1px solid var(--border)", background: t.featured ? "linear-gradient(to bottom, oklch(0.42 0.19 255 / 0.05), transparent)" : "var(--card)", boxShadow: t.featured ? "0 8px 32px -8px oklch(0.42 0.19 255 / 0.3)" : "none" }}>
              {t.featured && <span style={{ position: "absolute", top: -12, left: 24, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, background: "var(--primary)", color: "white", padding: "0.2rem 0.6rem", borderRadius: "0.25rem" }}>Most popular</span>}
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>{t.name}</h3>
              <div style={{ margin: "0.5rem 0 1.5rem" }}>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "2.25rem", fontWeight: 700 }}>${t.price.toLocaleString()}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginLeft: "0.25rem" }}>CAD</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", flex: 1 }}>
                {t.perks.map(p => <li key={p} style={{ display: "flex", gap: "0.5rem" }}><Check size={16} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />{p}</li>)}
              </ul>
              <button onClick={() => { setForm(f => ({ ...f, tier: t.tier })); document.getElementById("sponsor-form")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ marginTop: "1.5rem", padding: "0.625rem", borderRadius: "0.5rem", background: t.featured ? "var(--primary)" : "none", color: t.featured ? "white" : "var(--primary)", border: `1px solid ${t.featured ? "transparent" : "var(--primary)"}`, cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
                Choose {t.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container-page" style={{ paddingBottom: "4rem" }}>
        <div style={{ borderRadius: "1.5rem", background: "linear-gradient(135deg, var(--primary), var(--sky))", padding: "3rem 2rem", color: "white", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700 }}>Partner with NUFF 2026</h2>
          <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.9)", maxWidth: "40rem", margin: "0.75rem auto 0" }}>Custom packages, in-kind contributions, and multi-year partnerships are all welcome.</p>
          <Link href="/contact"><button style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", borderRadius: "9999px", background: "var(--secondary)", color: "var(--ink)", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "Montserrat, sans-serif", fontSize: "1rem" }}>Talk to our team</button></Link>
        </div>
      </section>

      {/* Apply form */}
      <section id="sponsor-form" className="container-page" style={{ paddingBottom: "5rem", maxWidth: "600px" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Apply to sponsor</h2>
        {sent ? (
          <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏆</div>
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Inquiry received!</h3>
            <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem", fontSize: "0.875rem" }}>Our team will contact you shortly.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[{ key: "company_name", label: "Company name *" }, { key: "contact_name", label: "Contact name *" }, { key: "email", label: "Email *" }].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Sponsorship tier</label>
              <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} style={inp}>
                {tiers.map(t => <option key={t.tier} value={t.tier}>{t.name} — ${t.price.toLocaleString()}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Message (optional)</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} />
            </div>
            <button onClick={submit} disabled={loading} style={{ padding: "0.75rem 1.75rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif", alignSelf: "flex-start", opacity: loading ? 0.7 : 1 }}>
              <Send size={16} /> {loading ? "Sending…" : "Send inquiry"}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
import React from "react";
