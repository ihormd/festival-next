"use client";
import { Award, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SponsorsPage() {
  const [form, setForm] = useState({ company_name: "", contact_name: "", email: "", tier: "gold", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.company_name || !form.email) return;
    setLoading(true);
    await supabase.from("sponsorship_inquiries").insert({ ...form, festival_year: 2026, status: "pending" });
    setSent(true); setLoading(false);
  };

  const tiers = [
    { name: "Gold", price: "$5,000+", perks: ["Logo on main stage banner", "Full-page program ad", "Social media features", "10 VIP passes"] },
    { name: "Silver", price: "$2,500", perks: ["Logo on event signage", "Half-page program ad", "Social media mention", "6 VIP passes"] },
    { name: "Bronze", price: "$1,000", perks: ["Name on sponsor list", "Quarter-page program ad", "2 VIP passes"] },
  ];

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Partner with NUFF</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Sponsorship</h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.85)", maxWidth: "36rem", fontSize: "1rem" }}>Support the Niagara Ukrainian community and reach thousands of festival attendees.</p>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {tiers.map(t => (
            <div key={t.name} style={{ padding: "1.75rem", borderRadius: "1rem", border: `2px solid ${t.name === "Gold" ? "#FFD700" : "var(--border)"}`, background: "var(--card)" }}>
              {t.name === "Gold" && <div style={{ background: "#FFD700", color: "#1e1a14", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: "9999px", display: "inline-block", marginBottom: "0.75rem" }}>Most popular</div>}
              <Award size={24} style={{ color: t.name === "Gold" ? "#FFD700" : "var(--primary)", marginBottom: "0.5rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.25rem", fontWeight: 700 }}>{t.name}</h3>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Montserrat, sans-serif", color: "var(--primary)", margin: "0.5rem 0" }}>{t.price}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "0.75rem" }}>
                {t.perks.map(p => <li key={p} style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", display: "flex", gap: "0.375rem" }}><span style={{ color: "var(--primary)" }}>✓</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "560px" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Become a sponsor</h2>
          {sent ? (
            <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏆</div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Inquiry received!</h3>
              <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem", fontSize: "0.875rem" }}>Our sponsorship team will contact you shortly.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ key: "company_name", label: "Company name *" }, { key: "contact_name", label: "Contact name *" }, { key: "email", label: "Email *" }].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Sponsorship tier</label>
                <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }}>
                  <option value="gold">Gold — $5,000+</option>
                  <option value="silver">Silver — $2,500</option>
                  <option value="bronze">Bronze — $1,000</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Message (optional)</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
              </div>
              <button onClick={submit} disabled={loading} style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
                <Send size={16} /> {loading ? "Submitting…" : "Send inquiry"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
