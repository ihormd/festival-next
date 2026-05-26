"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };
const sel: React.CSSProperties = { ...inp, cursor: "pointer" };

export default function ArtistApplyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rider, setRider] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ stage_name: "", bio: "", portfolio_links: "", contact_email: "", contact_phone: "", set_length_minutes: 30, stage_preference: "either" });

  useEffect(() => { if (user) setForm(f => ({ ...f, contact_email: user.email ?? "" })); }, [user]);

  if (!loading && !user) return (
    <div className="container-page" style={{ paddingTop: "5rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>Sign in required</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>Please sign in to submit an artist application.</p>
      <Link href="/login"><button style={{ marginTop: "1rem", padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Sign in</button></Link>
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    let tech_rider_url: string | null = null;
    if (rider) {
      const path = `${user.id}/${Date.now()}-${rider.name}`;
      const { error } = await supabase.storage.from("artist-riders").upload(path, rider);
      if (error) { toast.error(error.message); setSubmitting(false); return; }
      tech_rider_url = path;
    }
    const { error } = await supabase.from("artist_applications").insert({
      stage_name: form.stage_name, bio: form.bio,
      portfolio_links: form.portfolio_links.split("\n").map(s => s.trim()).filter(Boolean),
      contact_email: form.contact_email, contact_phone: form.contact_phone,
      set_length_minutes: form.set_length_minutes, stage_preference: form.stage_preference,
      tech_rider_url, user_id: user.id,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Submitted! Our booking team will review and reply.");
    router.push("/dashboard");
  };

  return (
    <>
      <PageHeader eyebrow="Artist" title="Apply to perform" subtitle="Share your work, set length, and tech requirements." />
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem", maxWidth: "672px" }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Stage name</label><input required value={form.stage_name} onChange={e => setForm({ ...form, stage_name: e.target.value })} style={inp} /></div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Short bio</label><textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Portfolio links (one per line)</label><textarea rows={3} placeholder="https://youtube.com/..." value={form.portfolio_links} onChange={e => setForm({ ...form, portfolio_links: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Preferred day</label>
              <select value={form.stage_preference} onChange={e => setForm({ ...form, stage_preference: e.target.value })} style={sel}>
                <option value="sat-jul-11">Saturday · July 11</option>
                <option value="sun-jul-12">Sunday · July 12</option>
                <option value="either">Either day</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Set length (min)</label>
              <input type="number" min={10} max={120} value={form.set_length_minutes} onChange={e => setForm({ ...form, set_length_minutes: parseInt(e.target.value) })} style={inp} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Email</label><input type="email" required value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} style={inp} /></div>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Phone</label><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} style={inp} /></div>
          </div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Tech rider (PDF)</label><input type="file" accept=".pdf" onChange={e => setRider(e.target.files?.[0] ?? null)} style={inp} /></div>
          <button type="submit" disabled={submitting} style={{ width: "100%", padding: "0.875rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </section>
    </>
  );
}
import React from "react";
