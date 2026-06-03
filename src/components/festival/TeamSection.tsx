"use client";
import { useEffect, useState } from "react";
import { dbQuery } from "@/lib/db";

type Member = { id: string; name: string; role: string; bio: string | null; image_url: string | null; sort_order: number; };

function initials(name: string) { return name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase(); }

export function TeamSection() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    dbQuery<Member>({ table: "team_members", filters: { active: true }, order: { col: "sort_order" } })
      .then(setMembers);
  }, []);

  return (
    <section className="container-page" style={{ paddingTop: "5rem", paddingBottom: "7rem" }}>
      <div style={{ maxWidth: "42rem" }}>
        <p className="eyebrow">Board of Directors</p>
        <h2 className="display-lg" style={{ marginTop: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>The volunteers behind NUFF.</h2>
        <p style={{ marginTop: "1rem", color: "var(--muted-foreground)" }}>An all-volunteer board guides the festival's vision, finances, and partnerships.</p>
      </div>
      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
        {members.map((m, i) => (
          <article key={m.id} className={`reveal reveal-delay-${(i % 4) + 1}`}
            style={{ borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", boxShadow: "var(--shadow-soft)" }}>
            {/* Photo — full width, square */}
            <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "var(--muted)" }}>
              {m.image_url ? (
                <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onMouseEnter={e => (e.currentTarget as any).style.transform = "scale(1.05)"}
                  onMouseLeave={e => (e.currentTarget as any).style.transform = "scale(1)"} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontFamily: "Montserrat, sans-serif", fontSize: "3rem", fontWeight: 700, background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.18 252))", color: "white" }}>
                  {initials(m.name)}
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.15rem", fontWeight: 700 }}>{m.name}</h3>
              <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", fontWeight: 600, marginTop: "0.25rem" }}>{m.role}</p>
              {m.bio && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.625rem", lineHeight: 1.65 }}>{m.bio}</p>}
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
