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
            <div className="animate-marquee" style={{ display: "flex", width: "max-content", alignItems: "center", gap: "6rem" }}>
              {loop.map((sp, i) => {
                const hasLogo = sp.logo_url && sp.logo_url.trim() !== "";
                const inner = hasLogo ? (
                  <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 1.5rem", borderRadius: "1rem", background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid var(--border)", transition: "all 0.3s", minWidth: 200 }}>
                    <img
                      src={sp.logo_url!}
                      alt={sp.name}
                      style={{ maxHeight: 120, maxWidth: 200, width: "auto", objectFit: "contain", transition: "all 0.3s" }}
                      onMouseEnter={e => { (e.currentTarget.parentElement as any).style.boxShadow = "0 8px 40px rgba(0,87,183,0.2)"; (e.currentTarget.parentElement as any).style.transform = "scale(1.06)"; (e.currentTarget.parentElement as any).style.borderColor = "var(--primary)"; }}
                      onMouseLeave={e => { (e.currentTarget.parentElement as any).style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; (e.currentTarget.parentElement as any).style.transform = "scale(1)"; (e.currentTarget.parentElement as any).style.borderColor = "var(--border)"; }}
                      onError={e => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.innerHTML = `<div style="font-size:0.875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted-foreground);padding:0 1rem;text-align:center">${sp.name}</div>`;
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ height: 160, minWidth: 200, borderRadius: "1rem", background: "white", border: "1px solid var(--border)", display: "grid", placeItems: "center", padding: "0 1.5rem", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
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
