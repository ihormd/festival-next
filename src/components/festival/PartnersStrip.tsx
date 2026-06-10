"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dbQuery } from "@/lib/db";

type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: string; sort_order: number; };

export function PartnersStrip() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    dbQuery<Sponsor>({ table: "sponsors", filters: { active: true }, order: { col: "sort_order" } })
      .then(setSponsors);
  }, []);

  const loop = sponsors.length > 0 ? [...sponsors, ...sponsors, ...sponsors] : [];

  return (
    <section style={{ background: "var(--cream)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container-page" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <p className="eyebrow">Our Partners</p>
            <h2 className="display-lg" style={{ marginTop: "0.5rem" }}>Powered by community.</h2>
          </div>
          <Link href="/sponsors" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}>Become a sponsor →</Link>
        </div>

        {sponsors.length === 0 ? (
          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Partner roster coming soon.</p>
        ) : (
          <div className="marquee-mask" style={{ overflow: "hidden" }}>
            <div className="animate-marquee" style={{ display: "flex", width: "max-content", alignItems: "center", gap: "5rem" }}>
              {loop.map((sp, i) => {
                const hasLogo = sp.logo_url && sp.logo_url.trim() !== "";
                const inner = hasLogo ? (
                  <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src={sp.logo_url!}
                      alt={sp.name}
                      style={{ maxHeight: 120, maxWidth: 240, width: "auto", objectFit: "contain", filter: "grayscale(0.3)", opacity: 0.85, transition: "all 0.3s" }}
                      onMouseEnter={e => { (e.currentTarget as any).style.filter = "grayscale(0)"; (e.currentTarget as any).style.opacity = "1"; (e.currentTarget as any).style.transform = "scale(1.05)"; }}
                      onMouseLeave={e => { (e.currentTarget as any).style.filter = "grayscale(0.3)"; (e.currentTarget as any).style.opacity = "0.85"; (e.currentTarget as any).style.transform = "scale(1)"; }}
                      onError={e => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                        const div = document.createElement("div");
                        div.style.cssText = "height:120px;min-width:200px;border-radius:0.5rem;background:white;border:1px dashed #ddd;display:grid;place-items:center;padding:0 1.5rem;font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;text-align:center";
                        div.textContent = sp.name;
                        el.parentElement?.appendChild(div);
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ height: 120, minWidth: 200, borderRadius: "0.5rem", background: "white", border: "1px dashed var(--border)", display: "grid", placeItems: "center", padding: "0 1.5rem", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", textAlign: "center" }}>
                    {sp.name}
                  </div>
                );

                return sp.website_url?.trim() ? (
                  <a key={`${sp.id}-${i}`} href={sp.website_url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: "block" }}>
                    {inner}
                  </a>
                ) : (
                  <div key={`${sp.id}-${i}`} style={{ flexShrink: 0 }}>{inner}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
