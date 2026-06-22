"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/lib/supabase";
import { TurnstileWidget, verifyTurnstile } from "@/components/TurnstileWidget";
import { Honeypot } from "@/components/Honeypot";
import { notifyAdmin } from "@/lib/notify";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };
const interests = ["Setup", "Hospitality", "Stage crew", "Kids' Zone", "Food service", "Parking", "Cleanup"];
type Shift = { id: string; area: string; description: string | null; starts_at: string; ends_at: string; capacity: number };

export default function VolunteerApplyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<Set<string>>(new Set());
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [tsToken, setTsToken] = useState("");
  const [hp, setHp] = useState("");
  const [form, setForm] = useState({ full_name: "", contact_email: "", contact_phone: "", notes: "" });

  useEffect(() => {
    if (user) setForm(f => ({ ...f, full_name: user.user_metadata?.full_name ?? "", contact_email: user.email ?? "" }));
    supabase.from("volunteer_shifts").select("*").order("starts_at").then(({ data }) => setShifts(data ?? []));
  }, [user]);

  if (!loading && !user) return (
    <div className="container-page" style={{ paddingTop: "5rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>Sign in required</h1>
      <Link href="/login"><button style={{ marginTop: "1rem", padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Sign in</button></Link>
    </div>
  );

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, v: string) => {
    const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); setter(n);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    if (hp) { router.push("/dashboard"); setSubmitting(false); return; }
    if (tsToken) { const ok = await verifyTurnstile(tsToken); if (!ok) { toast.error("Security check failed. Please try again."); setSubmitting(false); return; } }
    const { error } = await supabase.from("volunteer_applications").insert({ ...form, user_id: user.id, interests: Array.from(selectedInterests), selected_shifts: Array.from(selectedShifts) });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    notifyAdmin("volunteer_application", { ...form, interests: Array.from(selectedInterests), selected_shifts: Array.from(selectedShifts) });
    toast.success("Thanks! We'll confirm your shifts by email.");
    router.push("/dashboard");
  };

  return (
    <>
      <PageHeader eyebrow="Volunteer" title="Volunteer application" subtitle="Pick your interests and the shifts that work for you." />
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "768px" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Honeypot value={hp} onChange={setHp} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Full name</label><input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inp} /></div>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Phone</label><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} style={inp} /></div>
          </div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Email</label><input type="email" required value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} style={inp} /></div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>Areas of interest</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {interests.map(i => (
                <button type="button" key={i} onClick={() => toggle(selectedInterests, setSelectedInterests, i)}
                  style={{ padding: "0.375rem 0.875rem", borderRadius: "9999px", fontSize: "0.875rem", border: `1px solid ${selectedInterests.has(i) ? "var(--primary)" : "var(--border)"}`, background: selectedInterests.has(i) ? "var(--primary)" : "none", color: selectedInterests.has(i) ? "white" : "inherit", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>Available shifts</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {shifts.length === 0 && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Shifts will appear here soon.</p>}
              {shifts.map(s => (
                <label key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.75rem", border: `1px solid ${selectedShifts.has(s.id) ? "var(--primary)" : "var(--border)"}`, cursor: "pointer", transition: "border-color 0.15s" }}>
                  <input type="checkbox" checked={selectedShifts.has(s.id)} onChange={() => toggle(selectedShifts, setSelectedShifts, s.id)} style={{ marginTop: "0.125rem", accentColor: "var(--primary)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.area}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                      {new Date(s.starts_at).toLocaleString()} → {new Date(s.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {s.description && <div style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>{s.description}</div>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Anything else?</label><textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>
          <TurnstileWidget onVerify={setTsToken} onError={() => setTsToken("")} />
          <button type="submit" disabled={submitting} style={{ width: "100%", padding: "0.875rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </section>
    </>
  );
}
import React from "react";
