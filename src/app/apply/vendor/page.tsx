"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TurnstileWidget, verifyTurnstile } from "@/components/TurnstileWidget";
import { Honeypot } from "@/components/Honeypot";
import { notifyAdmin } from "@/lib/notify";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorApplyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [spots, setSpots] = useState<{ id: string; code: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tsToken, setTsToken] = useState("");
  const [hp, setHp] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ business_name: "", category: "food", description: "", contact_email: "", contact_phone: "", requested_spot_id: "" });

  useEffect(() => {
    if (user) setForm(f => ({ ...f, contact_email: user.email ?? "" }));
    supabase.from("vendor_spots").select("id, code").eq("status", "available").order("code").then(({ data }) => setSpots(data ?? []));
  }, [user]);

  if (!loading && !user) return (
    <div className="container-page" style={{ paddingTop: "5rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>Sign in required</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>Please sign in to submit a vendor application.</p>
      <Link href="/login"><button style={{ marginTop: "1rem", padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Sign in</button></Link>
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    if (hp) { setDone(true); setSubmitting(false); return; }
    if (tsToken) { const ok = await verifyTurnstile(tsToken); if (!ok) { alert("Security check failed. Please try again."); setSubmitting(false); return; } }
    const document_urls: string[] = [];
    for (const f of files) {
      const path = `${user.id}/${Date.now()}-${f.name}`;
      const { error } = await supabase.storage.from("vendor-docs").upload(path, f);
      if (error) { alert(`Upload failed: ${error.message}`); setSubmitting(false); return; }
      document_urls.push(path);
    }
    const { error } = await supabase.from("vendor_applications").insert({ ...form, requested_spot_id: form.requested_spot_id || null, user_id: user.id, document_urls });
    setSubmitting(false);
    if (error) { alert(error.message); return; }
    notifyAdmin("vendor_application", { ...form, document_count: document_urls.length });
    setDone(true);
  };

  if (done) return (
    <div className="container-page" style={{ paddingTop: "5rem", textAlign: "center" }}>
      <div style={{ fontSize: "3rem" }}>🎉</div>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.5rem", marginTop: "1rem" }}>Application submitted!</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>We'll review and get back to you soon.</p>
      <Link href="/dashboard"><button style={{ marginTop: "1rem", padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Go to dashboard</button></Link>
    </div>
  );

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Vendor</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Vendor application</h1>
          <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.85)", maxWidth: "38rem", fontSize: "0.95rem" }}>Tell us about your business and upload required permits. Pick your preferred booth on the map.</p>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "672px" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Honeypot value={hp} onChange={setHp} />
          <Field label="Business name"><input required value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Category">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={selectStyle}>
                <option value="food">Food</option>
                <option value="retail">Retail / Crafts</option>
                <option value="service">Service</option>
                <option value="nonprofit">Non-profit</option>
              </select>
            </Field>
            <Field label="Preferred spot">
              <select value={form.requested_spot_id} onChange={e => setForm({ ...form, requested_spot_id: e.target.value })} style={selectStyle}>
                <option value="">Pick from available</option>
                {spots.map(s => <option key={s.id} value={s.id}>{s.code}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description"><textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Contact email"><input type="email" required value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></Field>
            <Field label="Contact phone"><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} /></Field>
          </div>
          <Field label="Permits / Insurance documents">
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFiles(Array.from(e.target.files ?? []))} style={inputStyle} />
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>PDF, JPG, or PNG. Multiple allowed.</p>
          </Field>
          <TurnstileWidget onVerify={setTsToken} onError={() => setTsToken("")} />
          <button type="submit" disabled={submitting} style={{ padding: "0.875rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };
const selectStyle: React.CSSProperties = { ...inputStyle };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{label}</label>
      {React.isValidElement(children) && (children.type === "input" || children.type === "textarea")
        ? React.cloneElement(children as any, { style: { ...inputStyle, ...(children as any).props.style } })
        : children}
    </div>
  );
}
import React from "react";
