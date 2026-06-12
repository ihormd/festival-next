"use client";
import { useEffect, useState } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("nuff_cookie_consent")) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("nuff_cookie_consent", "accepted");
    setShow(false);
  };
  const decline = () => {
    localStorage.setItem("nuff_cookie_consent", "declined");
    // Disable analytics tracking
    (window as any).gtag?.("consent", "update", { analytics_storage: "denied" });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "var(--card)", borderTop: "1px solid var(--border)", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
      <div className="container-page" style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", margin: 0, flex: 1, minWidth: 200 }}>
          We use cookies to understand site traffic and improve your experience. See our{" "}
          <a href="/privacy" style={{ color: "var(--primary)", textDecoration: "underline" }}>Privacy Policy</a>.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button onClick={decline} style={{ padding: "0.5rem 1.125rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit" }}>
            Decline
          </button>
          <button onClick={accept} style={{ padding: "0.5rem 1.125rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
