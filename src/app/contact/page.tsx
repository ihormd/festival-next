"use client";
import { useSiteSettings } from "@/lib/site-content";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const s = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await supabase.from("contact_messages").insert({ full_name: form.name, email: form.email, message: form.message });
    setSent(true); setLoading(false);
  };

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Reach out</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Contact Us</h1>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Get in touch</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <Mail size={20} style={{ color: "var(--primary)", marginTop: "0.125rem", flexShrink: 0 }} />
                <div><div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Email</div><div style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>{s.contact_email || "info@niagarka.ca"}</div></div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={20} style={{ color: "var(--primary)", marginTop: "0.125rem", flexShrink: 0 }} />
                <div><div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Location</div><div style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>{s.location_address || "2275 Dorchester Road, Niagara Falls, ON"}</div></div>
              </div>
            </div>
          </div>
          <div>
            {sent ? (
              <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Message sent!</h3>
                <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem", fontSize: "0.875rem" }}>We'll get back to you soon.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[{ key: "name", label: "Full name", type: "text" }, { key: "email", label: "Email", type: "email" }].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
                </div>
                <button onClick={submit} disabled={loading} style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
                  <Send size={16} /> {loading ? "Sending…" : "Send message"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
