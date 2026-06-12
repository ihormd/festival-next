import { PageHeader } from "@/components/layout/PageHeader";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="How NUFF collects and uses information." />
      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: "720px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", color: "var(--muted-foreground)", lineHeight: 1.8, fontSize: "0.95rem" }}>
          <p>This Privacy Policy explains how the Niagara Ukrainian Family Festival ("NUFF", "we", "us") collects, uses, and protects information when you visit festua.ca.</p>

          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Information we collect</h2>
            <p>We collect information you provide directly — such as your name, email, and phone number — when you sign up, apply as a vendor, artist, or volunteer, contact us, or sign up for sponsorships. We also use Google Analytics to understand site traffic (pages visited, general location, device type).</p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Cookies</h2>
            <p>We use cookies for authentication (keeping you signed in) and for analytics via Google Analytics. You can decline non-essential cookies using the banner on our site.</p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>How we use information</h2>
            <p>Information is used to process applications (vendor, artist, volunteer, sponsorship), respond to contact inquiries, manage merchandise orders, and improve the festival experience. We do not sell your personal information.</p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Contact</h2>
            <p>Questions about this policy can be sent via our <a href="/contact" style={{ color: "var(--primary)", textDecoration: "underline" }}>Contact page</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
