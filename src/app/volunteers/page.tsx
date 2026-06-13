"use client";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/lib/supabase";
import { notifyAdmin } from "@/lib/notify";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSiteSettings } from "@/lib/site-content";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };

const ROLES = ["Setup / Teardown","Guest Services","Food Support","Stage Assistant","Kids' Zone","Parking & Traffic","Vendor Liaison","Cleanup Crew"];
const DAYS = [{ value: "sat-jul-11", label: "Saturday · July 11" }, { value: "sun-jul-12", label: "Sunday · July 12" }, { value: "both", label: "Both days" }];

export default function VolunteersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const s = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Set<string>>(new Set());
  const [days, setDays] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ full_name: user?.user_metadata?.full_name ?? "", contact_email: user?.email ?? "", contact_phone: "", notes: "" });

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, v: string) => {
    const n = new Set(set); n.has(v) ? n.delete(v) : n.add(v); setter(n);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.info("Please sign in to submit your application."); router.push("/login"); return; }
    if (roles.size === 0) { toast.error("Pick at least one role."); return; }
    if (days.size === 0) { toast.error("Pick at least one day."); return; }
    setLoading(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      ...form, user_id: user.id,
      interests: [...Array.from(roles), ...Array.from(days).map(d => `day:${d}`)],
      selected_shifts: [],
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    notifyAdmin("volunteer_application", { ...form, roles: Array.from(roles), days: Array.from(days) });
    toast.success("Thanks! We'll confirm your shifts by email.");
    router.push("/dashboard");
  };

  return (
    <>
      <PageHeader eyebrow={s.volunteers_eyebrow || "Crew up"} title={s.volunteers_title || "Volunteer with NUFF"} subtitle={s.volunteers_subtitle || "Help us run the most welcoming festival in the region. Pick your roles, pick your days."} />
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "768px" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "2rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", padding: "1.5rem 2rem", boxShadow: "var(--shadow-soft)" }}>
          <style>{`@media (min-width: 640px) { .vol-2col { grid-template-columns: 1fr 1fr !important; } }`}</style>
          <div className="vol-2col" style={{ display: "grid", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Full name</label><input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inp} /></div>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Phone</label><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} style={inp} /></div>
          </div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Email</label><input type="email" required value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} style={inp} /></div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>Select roles you're interested in</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {ROLES.map(r => (
                <button type="button" key={r} onClick={() => toggle(roles, setRoles, r)}
                  style={{ padding: "0.375rem 0.875rem", borderRadius: "9999px", fontSize: "0.875rem", border: `1px solid ${roles.has(r) ? "var(--primary)" : "var(--border)"}`, background: roles.has(r) ? "var(--primary)" : "none", color: roles.has(r) ? "white" : "inherit", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>Select your availability</label>
            <div className="vol-2col" style={{ display: "grid", gap: "0.5rem" }}>
              {DAYS.map(d => (
                <button type="button" key={d.value} onClick={() => toggle(days, setDays, d.value)}
                  style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, border: `1px solid ${days.has(d.value) ? "var(--primary)" : "var(--border)"}`, background: days.has(d.value) ? "var(--primary)" : "none", color: days.has(d.value) ? "white" : "inherit", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Anything else? (experience, accessibility needs, group sign-ups)</label><textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>

          {!user && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>You'll need to <Link href="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>sign in</Link> or <Link href="/signup" style={{ color: "var(--primary)", textDecoration: "underline" }}>create an account</Link> to submit.</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.875rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </section>
    </>
  );
}
import React from "react";
