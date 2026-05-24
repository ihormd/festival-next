"use client";
import { useSiteSettings } from "@/lib/site-content";
import { Store, MapPin, DollarSign, Clock, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";

export default function VendorsPage() {
  const s = useSiteSettings();
  const { user } = useAuth();
  const [form, setForm] = useState({ business_name: "", contact_name: "", email: "", phone: "", description: "", product_type: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.business_name || !form.email) return;
    setLoading(true);
    await supabase.from("vendor_applications").insert({ ...form, user_id: user?.id ?? null, festival_year: 2026, status: "pending" });
    setSent(true); setLoading(false);
  };

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Get involved</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Vendor Applications</h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.85)", maxWidth: "36rem", fontSize: "1rem" }}>Reserve a booth at NUFF 2026 and reach thousands of festival-goers.</p>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {[{ icon: MapPin, title: "Prime location", body: "Fireman's Park, Niagara Falls" }, { icon: DollarSign, title: "Competitive rates", body: "Starting from $150/day" }, { icon: Clock, title: "Two full days", body: s.festival_dates || "July 11–12, 2026" }, { icon: Store, title: "30+ spots", body: "Limited availability" }].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)", textAlign: "center" }}>
              <Icon size={24} style={{ color: "var(--primary)", margin: "0 auto 0.5rem" }} />
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>{body}</div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "560px" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Apply for a booth</h2>
          {sent ? (
            <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Application received!</h3>
              <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem", fontSize: "0.875rem" }}>We'll be in touch within 3–5 business days.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ key: "business_name", label: "Business name *" }, { key: "contact_name", label: "Contact name *" }, { key: "email", label: "Email *" }, { key: "phone", label: "Phone" }, { key: "product_type", label: "Product/service type" }].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
                  style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
              </div>
              <button onClick={submit} disabled={loading} style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
                <Send size={16} /> {loading ? "Submitting…" : "Submit application"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
