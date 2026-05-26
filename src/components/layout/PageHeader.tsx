interface Props { eyebrow?: string; title: string; subtitle?: string; }
export function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section style={{ borderBottom: "1px solid var(--border)", background: "oklch(0.94 0.012 85 / 0.3)" }}>
      <div className="container-page" style={{ paddingTop: "3.5rem", paddingBottom: "5rem" }}>
        {eyebrow && <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>{eyebrow}</p>}
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ marginTop: "1rem", maxWidth: "42rem", fontSize: "clamp(1rem, 2vw, 1.125rem)", color: "var(--muted-foreground)" }}>{subtitle}</p>}
      </div>
    </section>
  );
}
