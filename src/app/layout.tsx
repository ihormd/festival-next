import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import Script from "next/script";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "NUFF — Niagara Ukrainian Family Festival",
  description: "A celebration of Ukrainian heritage in the heart of Niagara. July 11–12, 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LCMTZXVL2Y" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LCMTZXVL2Y');
          `}
        </Script>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
