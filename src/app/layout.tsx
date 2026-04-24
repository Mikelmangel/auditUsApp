import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";
import { NudgeListener } from "@/components/NudgeListener";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://auditus.fun";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AuditUs | Social Polls",
  description: "Encuestas sociales para grupos de amigos",
  manifest: "/manifest.json",
  openGraph: {
    title: "AuditUs | Social Polls",
    description: "Encuestas sociales para grupos de amigos. ¡Vota, compite y descubre qué piensan de ti!",
    url: siteUrl,
    siteName: "AuditUs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditUs | Social Polls",
    description: "Descubre qué piensan tus amigos de ti en AuditUs. ¡Únete a la diversión!",
  },
};

import { PageTransition } from "@/components/PageTransition";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="bg-[var(--bg)] antialiased overscroll-none" suppressHydrationWarning>
        {/* Living Background Aura Orbs (V3 style) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[120px]" />
          <div className="absolute top-[30%] right-[5%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[80px]" />
        </div>

        <AuthProvider>
          <div id="app-root" className="relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
          <NudgeListener />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "rgba(10, 10, 10, 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 600,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
