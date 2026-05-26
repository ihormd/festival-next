"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = { id: string; name: string; role: string; bio: string | null; image_url: string | null; sort_order: number; };

function initials(name: string) { return name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase(); }

export function TeamSection() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    supabase.from("team_members").select("*").eq("active", true).order("sort_order").then(({ data }) => setMembers(data ?? []));
  }, []);

  return (
    <section className="container-page" style={{ paddingTop: "5rem", paddingBottom: "7rem" }}>
      <div style={{ maxWidth: "42rem" }}>
        <p className="eyebrow">Board of Directors</p>
        <h2 className="display-lg" style={{ marginTop: "0.5rem" }}>The volunteers behind NUFF.</h2>
        <p style={{ marginTop: "1rem", color: "var(--muted-foreground)" }}>An all-volunteer board guides the festival's vision, finances, and partnerships.</p>
      </div>
      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {members.map((m, i) => (
          <article key={m.id} className={`reveal reveal-delay-${(i % 4) + 1}`}
            style={{ borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", padding: "1.5rem", boxShadow: "var(--shadow-soft)", display: "flex", gap: "1rem" }}>
            {m.image_url ? (
              <img src={m.image_url} alt={m.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontFamily: "Montserrat, sans-serif", fontSize: "1.25rem", fontWeight: 600, background: "linear-gradient(135deg, var(--primary), var(--sky))", color: "white" }}>
                {initials(m.name)}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 600 }}>{m.name}</h3>
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", fontWeight: 600, marginTop: "0.125rem" }}>{m.role}</p>
              {m.bio && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.5rem", lineHeight: 1.6 }}>{m.bio}</p>}
            </div>
          </article>
        ))}
        {members.length === 0 && (
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", gridColumn: "1/-1" }}>Board members will appear here once added in Admin.</p>
        )}
      </div>
    </section>
  );
}
