"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Car, Accessibility, ShieldCheck, Heart, Music, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/lib/site-content";

type ScheduleRow = { id: string; day: "saturday" | "sunday"; start_time: string; end_time: string | null; title: string; area: string | null };
const memories = ["/assets/memory-1.jpg","/assets/memory-2.jpg","/assets/memory-3.jpg","/assets/memory-4.jpg","/assets/memory-5.jpg","/assets/memory-6.jpg"];

export default function FestivalPage() {
  const s = useSiteSettings();
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  useEffect(() => {
    supabase.from("festival_schedule").select("id,day,start_time,end_time,title,area").eq("active", true).order("day").order("sort_order").then(({ data }) => setSchedule((data as ScheduleRow[]) ?? []));
  }, []);

  const visitCards = [
    { icon: Calendar, title: s.festival_visit_dates_title || "Dates", body: s.festival_visit_dates_body || "July 11–12, 2026" },
    { icon: MapPin, title: s.festival_visit_location_title || "Location", body: s.festival_visit_location_body || "Fireman's Park, 2275 Dorchester Road, Niagara Falls, ON" },
    { icon: Clock, title: s.festival_visit_hours_title || "Hours", body: s.festival_visit_hours_body || "11:00 AM – 10:00 PM both days" },
    { icon: Car, title: s.festival_visit_parking_title || "Parking", body: s.festival_visit_parking_body || "Free parking on site. Accessible spots available near the main entrance." },
    { icon: Accessibility, title: s.festival_visit_accessibility_title || "Accessibility", body: s.festival_visit_accessibility_body || "The grounds are fully accessible. Quiet zones and sensory breaks available." },
    { icon: ShieldCheck, title: s.festival_visit_safety_title || "Safety", body: s.festival_visit_safety_body || "Licensed event with on-site first aid, security, and family-friendly policies." },
  ];

  const experienceItems = (s.festival_experience_items || "Live music on two stages\nAuthentic Ukrainian food vendors\nTraditional dance ensembles\nPysanky & craft workshops\nKids' Zone activities\nArtisan marketplace").split("\n").filter(Boolean);
  const days: { key: "saturday" | "sunday"; label: string }[] = [
    { key: "saturday", label: "Saturday — July 11" },
    { key: "sunday", label: "Sunday — July 12" },
  ];

  return (
    <>
      <PageHeader eyebrow={s.festival_page_eyebrow || "NUFF 2026"} title={s.festival_page_title || "The Festival"} subtitle={s.festival_page_subtitle || "Two days of music, dance, food, craft, and community at Fireman's Park."} />

      {/* Mission + History */}
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div style={{ display: "grid", gap: "3rem" }}>
          <style>{`@media (min-width: 1024px) { .fest-2col { grid-template-columns: 1fr 1fr !important; } }`}</style>
          <div className="fest-2col" style={{ display: "grid", gap: "3rem" }}>
            <div>
              <Heart size={28} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>{s.festival_mission_title || "Our Mission"}</h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.8 }}>{s.festival_mission_body || "NUFF celebrates Ukrainian heritage and brings the Niagara community together through music, food, and culture."}</p>
            </div>
            <div>
              <Users size={28} style={{ color: "var(--primary)", marginBottom: "1rem" }} />
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>{s.festival_history_title || "Our History"}</h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.8 }}>{s.festival_history_body || "Founded by the Ukrainian community of Niagara, NUFF has grown into one of the region's most beloved summer festivals."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community + Experience */}
      <section style={{ background: "var(--cream)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-page" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
          <style>{`@media (min-width: 1024px) { .fest-comm { grid-template-columns: 1.2fr 1fr !important; } }`}</style>
          <div className="fest-comm" style={{ display: "grid", gap: "3rem", alignItems: "center" }}>
            <div>
              <p className="eyebrow">{s.festival_community_eyebrow || "Community first"}</p>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginTop: "0.5rem", marginBottom: "1rem" }}>{s.festival_community_title || "Built by volunteers, for everyone."}</h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.8, marginBottom: "0.75rem" }}>{s.festival_community_body1 || "NUFF is an all-volunteer effort rooted in the Ukrainian diaspora of Niagara Falls."}</p>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.8 }}>{s.festival_community_body2 || "Every ticket sold, every vendor booth booked, and every volunteer hour goes directly toward making NUFF the best it can be."}</p>
            </div>
            <div style={{ borderRadius: "1rem", background: "white", border: "1px solid var(--border)", padding: "2rem", boxShadow: "var(--shadow-soft)" }}>
              <Music size={28} style={{ color: "var(--primary)", marginBottom: "0.75rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>{s.festival_experience_title || "What to expect"}</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {experienceItems.map((item, i) => (
                  <li key={i} style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: "var(--primary)", flexShrink: 0 }}>·</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
        <p className="eyebrow">Schedule outline</p>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginTop: "0.5rem", marginBottom: "2.5rem" }}>Two days at a glance</h2>
        <style>{`@media (min-width: 768px) { .fest-sched { grid-template-columns: 1fr 1fr !important; } }`}</style>
        <div className="fest-sched" style={{ display: "grid", gap: "1.5rem" }}>
          {days.map(d => {
            const items = schedule.filter(r => r.day === d.key);
            return (
              <div key={d.key} style={{ borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", padding: "1.5rem" }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>{d.label}</div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem", fontSize: "0.875rem" }}>
                  {items.length === 0 && <li style={{ color: "var(--muted-foreground)" }}>Schedule coming soon.</li>}
                  {items.map(r => (
                    <li key={r.id} style={{ display: "flex", gap: "0.75rem", color: "var(--muted-foreground)" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.75rem", width: 48, flexShrink: 0, color: "var(--primary)", paddingTop: 1 }}>{r.start_time.slice(0, 5)}</span>
                      <span><span style={{ color: "var(--foreground)", fontWeight: 500 }}>{r.title}</span>{r.area && <span style={{ fontSize: "0.75rem" }}> · {r.area}</span>}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Full lineup announced closer to the festival. Times subject to change.</p>
      </section>

      {/* Visitor info */}
      <section style={{ background: "oklch(0.94 0.012 85 / 0.3)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-page" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
          <p className="eyebrow">{s.festival_visit_eyebrow || "Plan your visit"}</p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginTop: "0.5rem", marginBottom: "2.5rem" }}>{s.festival_visit_heading || "Everything you need to know."}</h2>
          <style>{`@media (min-width: 768px) { .visit-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (min-width: 1024px) { .visit-grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
          <div className="visit-grid" style={{ display: "grid", gap: "1.5rem" }}>
            {visitCards.map(i => (
              <div key={i.title} style={{ borderRadius: "0.75rem", border: "1px solid var(--border)", padding: "1.5rem", background: "var(--card)" }}>
                <i.icon size={24} style={{ color: "var(--primary)", marginBottom: "0.75rem" }} />
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>{i.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.375rem", lineHeight: 1.7 }}>{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memories gallery */}
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "42rem", marginBottom: "2.5rem" }}>
          <p className="eyebrow">{s.festival_memories_eyebrow || "Past festivals"}</p>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 600, marginTop: "0.5rem" }}>{s.festival_memories_title || "Moments that last."}</h2>
          <p style={{ marginTop: "0.75rem", color: "var(--muted-foreground)" }}>{s.festival_memories_body || "A glimpse of the joy, culture, and community from previous NUFF festivals."}</p>
        </div>
        <div style={{ columns: "2 200px", gap: "1rem" }}>
          {memories.map((src, i) => (
            <div key={i} style={{ marginBottom: "1rem", breakInside: "avoid", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-soft)" }}>
              <img src={src} alt={`NUFF memory ${i + 1}`} loading="lazy" style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.5s" }}
                onMouseEnter={e => (e.currentTarget as any).style.transform = "scale(1.02)"}
                onMouseLeave={e => (e.currentTarget as any).style.transform = "scale(1)"} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
