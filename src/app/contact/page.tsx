"use client";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notifyAdmin } from "@/lib/notify";
import { useSiteSettings } from "@/lib/site-content";
import { toast } from "sonner";

import { TurnstileWidget, verifyTurnstile } from "@/components/TurnstileWidget";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };

export default function ContactPage() {
  const s = useSiteSettings();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [tsToken, setTsToken] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const subject = String(fd.get("subject") ?? "") || null;
    const message = String(fd.get("message") ?? "");
    setBusy(true);
    // Turnstile verification
    if (tsToken) {
      const ok = await verifyTurnstile(tsToken);
      if (!ok) { toast.error("Security check failed. Please try again."); setBusy(false); return; }
    }
    // Rate limit check
    const rl = await fetch("/api/contact", { method: "POST" });
    if (!rl.ok) { const j = await rl.json(); toast.error(j.error || "Too many submissions"); setBusy(false); return; }
    await supabase.from("contact_messages").insert({ name, email, subject, message });
    notifyAdmin("contact", { name, email, subject, message });
    setBusy(false);
    setDone(true);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." subtitle="Questions about the festival, partnerships, or media inquiries? Send us a note." />
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <style>{`@media (min-width: 1024px) { .contact-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
        <div className="contact-grid" style={{ display: "grid", gap: "3rem" }}>
          <div>
            {done ? (
              <div style={{ padding: "2rem", borderRadius: "1rem", background: "var(--cream)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Thanks — we'll be in touch shortly.</h3>
                <button onClick={() => setDone(false)} style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--primary)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "36rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Name</label><input name="name" required maxLength={200} style={inp} /></div>
                  <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Email</label><input name="email" type="email" required style={inp} /></div>
                </div>
                <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Subject</label><input name="subject" maxLength={300} style={inp} /></div>
                <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Message</label><textarea name="message" rows={6} required minLength={5} maxLength={5000} style={{ ...inp, resize: "vertical" }} /></div>
                <TurnstileWidget onVerify={setTsToken} onError={() => setTsToken("")} />
                <button type="submit" disabled={busy} style={{ padding: "0.75rem 1.75rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif", alignSelf: "flex-start", opacity: busy ? 0.7 : 1 }}>
                  {busy ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}><MapPin size={20} style={{ color: "var(--primary)", flexShrink: 0 }} /><div><div style={{ fontWeight: 600 }}>{s.location_name || "Fireman's Park"}</div><div style={{ color: "var(--muted-foreground)" }}>{s.location_address || "2275 Dorchester Road, Niagara Falls, ON"}</div></div></div>
              {s.contact_email && <div style={{ display: "flex", gap: "0.75rem" }}><Mail size={20} style={{ color: "var(--primary)", flexShrink: 0 }} /><a href={`mailto:${s.contact_email}`} style={{ color: "inherit" }}>{s.contact_email}</a></div>}
              {s.contact_phone && <div style={{ display: "flex", gap: "0.75rem" }}><Phone size={20} style={{ color: "var(--primary)", flexShrink: 0 }} /><a href={`tel:${s.contact_phone}`} style={{ color: "inherit" }}>{s.contact_phone}</a></div>}
            </div>
          </div>
          <div style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", minHeight: 400 }}>
            <iframe title="NUFF location" src="https://www.google.com/maps?q=Fireman%27s+Park%2C+2275+Dorchester+Road%2C+Niagara+Falls%2C+ON&output=embed" style={{ width: "100%", height: "100%", minHeight: 400, border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
    </>
  );
}
import React from "react";
