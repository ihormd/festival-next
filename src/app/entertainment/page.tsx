"use client";
import { Music, Mic2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Performer = { id: string; name: string; genre: string; bio: string; image_url: string; performance_date: string; performance_time: string; stage: string; };

export default function EntertainmentPage() {
  const [performers, setPerformers] = useState<Performer[]>([]);

  useEffect(() => {
    supabase.from("performers").select("*").order("name").then(({ data }) => setPerformers(data ?? []));
  }, []);

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Live performances</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Entertainment</h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.85)", maxWidth: "36rem", fontSize: "1rem" }}>Two days of music, dance, and cultural performances at Fireman's Park.</p>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {[{ icon: Music, title: "Folk & Traditional", body: "Authentic Ukrainian folk music" }, { icon: Mic2, title: "Contemporary", body: "Modern Ukrainian pop and rock" }, { icon: Users, title: "Dance Ensembles", body: "Traditional dance performances" }].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)", textAlign: "center" }}>
              <Icon size={28} style={{ color: "var(--primary)", margin: "0 auto 0.75rem" }} />
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}>{title}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>{body}</p>
            </div>
          ))}
        </div>
        {performers.length > 0 ? (
          <>
            <h2 className="display-lg" style={{ marginBottom: "2rem" }}>Lineup</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
              {performers.map(p => (
                <div key={p.id} style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)" }}>
                  {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover" }} />}
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>{p.name}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, marginTop: "0.25rem" }}>{p.genre}</p>
                    {p.performance_time && <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.375rem" }}>{p.performance_date} · {p.performance_time} · {p.stage}</p>}
                    {p.bio && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.5rem", lineHeight: 1.6 }}>{p.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
            <Mic2 size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Lineup coming soon</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Artists will be announced closer to the festival. Stay tuned!</p>
          </div>
        )}
      </section>
    </div>
  );
}
