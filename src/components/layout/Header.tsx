"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useSiteSettings } from "@/lib/site-content";
import { usePathname } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, isModerator, isViewer, roles, signOut } = useAuth();
  const hasAnyRole = roles.length > 0;
  const s = useSiteSettings();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mainNav = [
    { href: "/festival", label: s.header_nav_festival },
    { href: "/entertainment", label: s.header_nav_entertainment },
    { href: "/merch", label: s.header_nav_merch },
    { href: "/about", label: s.header_nav_about },
    { href: "/contact", label: s.header_nav_contact },
  ];

  const involvedNav = [
    { href: "/artists", label: s.header_nav_artists_label, desc: s.header_nav_artists_desc },
    { href: "/vendors", label: s.header_nav_vendors_label, desc: s.header_nav_vendors_desc },
    { href: "/volunteers", label: s.header_nav_volunteers_label, desc: s.header_nav_volunteers_desc },
    { href: "/sponsors", label: s.header_nav_sponsors_label, desc: s.header_nav_sponsors_desc },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent", background: scrolled ? "rgba(255,253,245,0.88)" : "rgba(255,253,245,0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none" }}>
      <div className="container-page" style={{ display: "flex", height: 80, alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img src={s.logo_url || "/assets/nuff-logo.png"} alt={s.header_logo_alt} style={{ height: 56, width: "auto" }} />
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="hidden-mobile">
          {mainNav.map((n) => (
            <Link key={n.href} href={n.href}
              style={{ fontSize: "0.875rem", fontWeight: isActive(n.href) ? 600 : 500, color: isActive(n.href) ? "var(--primary)" : "var(--muted-foreground)", transition: "color 0.2s", borderBottom: isActive(n.href) ? "2px solid var(--primary)" : "2px solid transparent", paddingBottom: "0.125rem" }}>
              {n.label}
            </Link>
          ))}
          <div style={{ position: "relative" }} onMouseEnter={() => setInvolvedOpen(true)} onMouseLeave={() => setInvolvedOpen(false)}>
            <button style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer" }}>
              {s.header_nav_involved_label} <ChevronDown size={16} style={{ transform: involvedOpen ? "rotate(180deg)" : "", transition: "transform 0.2s" }} />
            </button>
            {involvedOpen && (
              <div style={{ position: "absolute", right: 0, top: "100%", paddingTop: "0.75rem", width: 288, zIndex: 50 }}>
                <div style={{ borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)", padding: "0.5rem" }}>
                  {involvedNav.map((n) => (
                    <Link key={n.href} href={n.href} onClick={() => setInvolvedOpen(false)}
                      style={{ display: "block", borderRadius: "0.5rem", padding: "0.625rem 0.75rem", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as any).style.background = "var(--muted)"}
                      onMouseLeave={e => (e.currentTarget as any).style.background = "transparent"}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{n.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>{n.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="hidden-mobile">
          {user ? (
            <>
              <Link href="/dashboard"><button style={{ padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem" }}><User size={16} />Account</button></Link>
              {(hasAnyRole) && <Link href="/admin"><button style={{ padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.875rem" }}>Admin</button></Link>}
              <button onClick={signOut} style={{ padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "none", background: "none", cursor: "pointer", fontSize: "0.875rem" }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login"><button style={{ padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "none", background: "none", cursor: "pointer", fontSize: "0.875rem" }}>Sign in</button></Link>
              <Link href="/signup"><button style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>Get involved</button></Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} style={{ padding: "0.5rem", background: "none", border: "none", cursor: "pointer" }} className="show-mobile">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}>
          <div className="container-page" style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {mainNav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ padding: "0.625rem 0.5rem", borderRadius: "0.5rem", fontSize: "1rem", fontWeight: 500 }}>{n.label}</Link>)}
            <div style={{ padding: "0.75rem 0.5rem 0.25rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>{s.header_nav_involved_label}</div>
            {involvedNav.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ padding: "0.5rem", borderRadius: "0.5rem", fontSize: "1rem" }}>{n.label}</Link>)}
            <div style={{ borderTop: "1px solid var(--border)", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)}><button style={{ width: "100%", padding: "0.625rem", borderRadius: "0.5rem", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: "1rem" }}>Account</button></Link>
                  {(hasAnyRole) && <Link href="/admin" onClick={() => setOpen(false)}><button style={{ width: "100%", padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "1rem" }}>Admin</button></Link>}
                  <button onClick={() => { signOut(); setOpen(false); }} style={{ padding: "0.625rem", borderRadius: "0.5rem", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: "1rem" }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}><button style={{ width: "100%", padding: "0.625rem", borderRadius: "0.5rem", border: "none", background: "none", cursor: "pointer", fontSize: "1rem" }}>Sign in</button></Link>
                  <Link href="/signup" onClick={() => setOpen(false)}><button style={{ width: "100%", padding: "0.625rem", borderRadius: "0.5rem", background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600 }}>Get involved</button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`.hidden-mobile { display: none; } @media (min-width: 1024px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } } .show-mobile { display: block; }`}</style>
    </header>
  );
}
