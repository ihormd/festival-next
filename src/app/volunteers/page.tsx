"use client";
import { HandHeart, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";

export default function VolunteersPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", availability: "", skills: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.full_name || !form.email) return;
    setLoading(true);
    await supabase.from("volunteer_applications").insert({ ...form, user_id: user?.id ?? null, festival_year: 2026, status: "pending" });
    setSent(true); setLoading(false);
  };

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Join the team</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Volunteer</h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.85)", maxWidth: "36rem", fontSize: "1rem" }}>Help make NUFF 2026 unforgettable. Pick a shift, choose your role.</p>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "560px" }}>
          {sent ? (
            <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)", textAlign: "center" }}>
              <HandHeart size={32} style={{ color: "var(--primary)", margin: "0 auto 0.5rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Thank you!</h3>
              <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem", fontSize: "0.875rem" }}>We'll be in touch with your shift details.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[{ key: "full_name", label: "Full name *" }, { key: "email", label: "Email *" }, { key: "phone", label: "Phone" }, { key: "availability", label: "Availability (days/times)" }, { key: "skills", label: "Skills or experience" }].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
                </div>
              ))}
              <button onClick={submit} disabled={loading} style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
                <Send size={16} /> {loading ? "Submitting…" : "Sign up to volunteer"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
