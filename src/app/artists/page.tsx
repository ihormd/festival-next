"use client";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Mic2, Users, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TurnstileWidget, verifyTurnstile } from "@/components/TurnstileWidget";
import { notifyAdmin } from "@/lib/notify";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSiteSettings } from "@/lib/site-content";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" };
const sel: React.CSSProperties = { ...inp, cursor: "pointer" };

const PERFORMANCE_TYPES = ["Solo musician","Band / ensemble","Folk dance group","Choir / vocal ensemble","DJ / electronic","Bandura / traditional instrument","Spoken word / poetry","Other"];

export default function ArtistsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const s = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [tsToken, setTsToken] = useState("");
  const [form, setForm] = useState({ stage_name: "", bio: "", performance_type: "", equipment: "", social_links: "", media_link: "", contact_email: user?.email ?? "", contact_phone: "", set_length_minutes: 30, stage_preference: "main" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.info("Please sign in to submit your application."); router.push("/login"); return; }
    if (!form.performance_type) { toast.error("Please choose a performance type."); return; }
    setLoading(true);
    if (tsToken) { const ok = await verifyTurnstile(tsToken); if (!ok) { toast.error("Security check failed. Please try again."); setLoading(false); return; } }
    const portfolio_links = [form.media_link, ...form.social_links.split("\n")].map(s => s.trim()).filter(Boolean);
    const { error } = await supabase.from("artist_applications").insert({
      stage_name: form.stage_name,
      bio: `${form.bio}\n\n— Performance type: ${form.performance_type}\n— Equipment required: ${form.equipment}`,
      portfolio_links, contact_email: form.contact_email, contact_phone: form.contact_phone,
      set_length_minutes: form.set_length_minutes, stage_preference: form.stage_preference, user_id: user.id,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    notifyAdmin("artist_application", { stage_name: form.stage_name, performance_type: form.performance_type, contact_email: form.contact_email, contact_phone: form.contact_phone, stage_preference: form.stage_preference, set_length_minutes: form.set_length_minutes });
    toast.success("Submitted! Our booking team will review and reply.");
    router.push("/dashboard");
  };

  return (
    <>
      <PageHeader eyebrow={s.artists_eyebrow || "Perform at NUFF"} title={s.artists_title || "Take the NUFF stage"} subtitle={s.artists_subtitle || "One main stage, two days, a packed crowd of families and culture lovers. We program traditional Ukrainian acts alongside contemporary voices."} />

      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
        <style>{`@media (min-width: 1024px) { .artist-cards { grid-template-columns: repeat(3,1fr) !important; } }`}</style>
        <div className="artist-cards" style={{ display: "grid", gap: "1.5rem" }}>
          {[
            { icon: Mic2, title: s.artists_card1_title || "Main stage", body: s.artists_card1_body || "Our single main stage — full PA, monitors, backline, lighting rig. Headliner, feature, and emerging slots throughout the weekend." },
            { icon: Calendar, title: s.artists_card2_title || "July 11–12, 2026", body: s.artists_card2_body || "Two-day festival at Fireman's Park, Niagara Falls. Set lengths from 20 to 60 minutes." },
            { icon: Users, title: s.artists_card3_title || "What you get", body: s.artists_card3_body || "Hospitality, parking, vendor passes for your crew, and a connected Niagara audience." },
          ].map(s => (
            <div key={s.title} style={{ borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", padding: "1.5rem" }}>
              <s.icon size={24} style={{ color: "var(--primary)", marginBottom: "0.75rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.375rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page" style={{ paddingBottom: "4rem", maxWidth: "768px" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>Artist application</h2>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", padding: "1.5rem 2rem", boxShadow: "var(--shadow-soft)" }}>
          <style>{`@media (min-width: 640px) { .artist-2col { grid-template-columns: 1fr 1fr !important; } }`}</style>
          <div className="artist-2col" style={{ display: "grid", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Stage / artist name</label><input required value={form.stage_name} onChange={e => setForm({ ...form, stage_name: e.target.value })} style={inp} /></div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Performance type</label>
              <select value={form.performance_type} onChange={e => setForm({ ...form, performance_type: e.target.value })} style={sel}>
                <option value="">Choose one…</option>
                {PERFORMANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Short bio</label><textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Equipment required</label><textarea rows={3} placeholder="What you bring vs. what you need from us (mics, DI, monitors, backline, lighting…)" value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Audio / video link</label><input placeholder="https://youtube.com/… or https://soundcloud.com/…" value={form.media_link} onChange={e => setForm({ ...form, media_link: e.target.value })} style={inp} /></div>
          <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Social media links (one per line)</label><textarea rows={3} placeholder={"https://instagram.com/…\nhttps://tiktok.com/…\nhttps://spotify.com/…"} value={form.social_links} onChange={e => setForm({ ...form, social_links: e.target.value })} style={{ ...inp, resize: "vertical" }} /></div>
          <div className="artist-2col" style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Preferred day</label>
              <select value={form.stage_preference} onChange={e => setForm({ ...form, stage_preference: e.target.value })} style={sel}>
                <option value="sat-jul-11">Saturday · July 11</option>
                <option value="sun-jul-12">Sunday · July 12</option>
                <option value="either">Either day</option>
              </select>
            </div>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Set length (min)</label><input type="number" min={10} max={120} value={form.set_length_minutes} onChange={e => setForm({ ...form, set_length_minutes: parseInt(e.target.value) || 30 })} style={inp} /></div>
          </div>
          <div className="artist-2col" style={{ display: "grid", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Contact email</label><input type="email" required value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} style={inp} /></div>
            <div><label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Contact phone</label><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} style={inp} /></div>
          </div>
          {!user && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>You'll need to <Link href="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>sign in</Link> or <Link href="/signup" style={{ color: "var(--primary)", textDecoration: "underline" }}>create an account</Link> to submit.</p>}
          <TurnstileWidget onVerify={setTsToken} onError={() => setTsToken("")} />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.875rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </section>
    </>
  );
}
import React from "react";
