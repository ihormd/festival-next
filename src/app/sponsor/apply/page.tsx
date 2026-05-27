"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };
const sel: React.CSSProperties = { ...inp, cursor: "pointer" };

function SponsorApplyForm() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ company_name: "", contact_name: "", email: "", tier: params.get("tier") || "gold", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sponsorship_inquiries").insert({ ...form, festival_year: 2026, status: "pending" });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Inquiry received! Our team will contact you shortly.");
    setDone(true);
  };

  if (done) return (
    <div className="container-page" style={{ paddingTop: "5rem", textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.75rem" }}>Thank you!</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>We'll review your inquiry and contact you shortly.</p>
      <Link href="/sponsors"><button style={{ marginTop: "1.5rem", padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Back to Sponsors</button></Link>
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="Sponsor Application" title="Become a partner." subtitle="Fill in your details and we'll get back to you within 2 business days." />
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "560px" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", padding: "1.5rem 2rem", boxShadow: "var(--shadow-soft)" }}>
          {[{ key: "company_name", label: "Company name *" }, { key: "contact_name", label: "Contact name *" }, { key: "email", label: "Email *" }].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
              <input required={f.label.includes("*")} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Sponsorship tier</label>
            <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} style={sel}>
              <option value="bronze">Bronze — $250</option>
              <option value="silver">Silver — $1,000</option>
              <option value="gold">Gold — $5,000</option>
              <option value="platinum">Platinum — $15,000</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Message (optional)</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.875rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending…" : "Send inquiry"}
          </button>
        </form>
      </section>
    </>
  );
}

export default function SponsorApplyPage() {
  return <Suspense><SponsorApplyForm /></Suspense>;
}
import React from "react";
