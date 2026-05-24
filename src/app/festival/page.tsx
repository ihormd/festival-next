"use client";
import { useSiteSettings } from "@/lib/site-content";
import { Calendar, MapPin, Clock, Music, Utensils, Palette, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type ScheduleItem = { id: string; day: string; start_time: string; end_time: string; title: string; description: string; area: string; sort_order: number; };

export default function FestivalPage() {
  const s = useSiteSettings();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    supabase.from("festival_schedule").select("*").order("sort_order").then(({ data }) => setSchedule(data ?? []));
  }, []);

  const days = ["saturday", "sunday"];
  const defaultSchedule = [
    { day: "saturday", start_time: "11:00", end_time: "12:00", title: "Opening Ceremony", description: "Welcome from NUFF organizers", area: "Main Stage", id: "1", sort_order: 1 },
    { day: "saturday", start_time: "12:00", end_time: "13:00", title: "Traditional Dance Showcase", description: "Veselka & Yavir ensembles", area: "Main Stage", id: "2", sort_order: 2 },
    { day: "saturday", start_time: "14:00", end_time: "15:30", title: "Headliner Performance", description: "Featured Ukrainian artist", area: "Main Stage", id: "3", sort_order: 3 },
    { day: "sunday", start_time: "11:30", end_time: "12:00", title: "Sunday Welcome", description: "Day two opening", area: "Main Stage", id: "4", sort_order: 4 },
    { day: "sunday", start_time: "14:00", end_time: "15:30", title: "Closing Concert", description: "Grand finale headliner", area: "Main Stage", id: "5", sort_order: 5 },
  ];
  const items = schedule.length > 0 ? schedule : defaultSchedule;

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>NUFF 2026</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>The Festival</h1>
          <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={16} /> {s.festival_dates || "July 11–12, 2026"}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><MapPin size={16} /> {s.location_name || "Fireman's Park"}, Niagara Falls</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}><Clock size={16} /> 11:00 AM – 6:00 PM daily</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          {[
            { icon: Music, title: "Live Music", body: "Ukrainian folk, pop, and classical performances on two stages throughout the weekend." },
            { icon: Utensils, title: "Food & Drinks", body: "Borscht, varenyky, holubtsi, pampushky, and traditional Ukrainian beverages." },
            { icon: Palette, title: "Arts & Crafts", body: "Pysanky workshops, embroidery, woodwork, and artisan marketplace." },
            { icon: Users, title: "Community", body: "Meet Ukrainian diaspora, learn about heritage, and celebrate together." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)" }}>
              <Icon size={28} style={{ color: "var(--primary)", marginBottom: "0.75rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.375rem" }}>{title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <h2 className="display-lg" style={{ marginBottom: "2rem" }}>Schedule</h2>
        {days.map(day => (
          <div key={day} style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.25rem", fontWeight: 700, textTransform: "capitalize", padding: "0.75rem 1rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem", marginBottom: "1rem" }}>{day}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {items.filter(i => i.day === day).map(item => (
                <div key={item.id} style={{ display: "flex", gap: "1rem", padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)" }}>
                  <div style={{ minWidth: "6rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", paddingTop: "0.125rem" }}>{item.start_time}–{item.end_time}</div>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "1rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>{item.description}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--primary)", marginTop: "0.25rem", fontWeight: 600 }}>{item.area}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
