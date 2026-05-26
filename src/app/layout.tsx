import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "NUFF — Niagara Ukrainian Family Festival",
  description: "A celebration of Ukrainian heritage in the heart of Niagara. July 11–12, 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
