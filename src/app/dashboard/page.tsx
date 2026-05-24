"use client";
import { useAuth } from "@/context/auth";
import Link from "next/link";
import { User, Store, Mic2, HandHeart, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <div className="container-page" style={{ paddingTop: "4rem" }}>Loading…</div>;
  if (!user) return (
    <div className="container-page" style={{ paddingTop: "4rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Please sign in</h1>
      <Link href="/login"><button style={{ marginTop: "1rem", padding: "0.75rem 2rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>Sign in</button></Link>
    </div>
  );

  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", display: "grid", placeItems: "center" }}>
          <User size={28} style={{ color: "white" }} />
        </div>
        <div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>{user.user_metadata?.full_name || user.email}</div>
          <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{user.email}</div>
        </div>
        <button onClick={signOut} style={{ marginLeft: "auto", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit" }}>Sign out</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
        {[
          { href: "/vendors", icon: Store, label: "Apply as vendor" },
          { href: "/artists", icon: Mic2, label: "Apply as artist" },
          { href: "/volunteers", icon: HandHeart, label: "Volunteer" },
          ...(isAdmin ? [{ href: "/admin", icon: Shield, label: "Admin panel" }] : []),
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)", transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget as any).style.borderColor = "var(--primary)"}
            onMouseLeave={e => (e.currentTarget as any).style.borderColor = "var(--border)"}>
            <Icon size={22} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
