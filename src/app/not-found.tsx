import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(5rem, 15vw, 10rem)", fontWeight: 800, lineHeight: 1, color: "var(--primary)", opacity: 0.15 }}>404</div>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, marginTop: "-1rem" }}>Page not found</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.75rem", maxWidth: "36rem", lineHeight: 1.7 }}>
        The page you're looking for doesn't exist or has been moved. Head back to the festival homepage.
      </p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/">
          <button style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
            Go home
          </button>
        </Link>
        <Link href="/contact">
          <button style={{ padding: "0.75rem 1.75rem", borderRadius: "9999px", background: "none", color: "var(--primary)", border: "1px solid var(--primary)", cursor: "pointer", fontSize: "1rem", fontWeight: 500, fontFamily: "inherit" }}>
            Contact us
          </button>
        </Link>
      </div>
    </div>
  );
}
