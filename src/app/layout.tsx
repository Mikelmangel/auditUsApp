import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";
import { NudgeListener } from "@/components/NudgeListener";

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "AuditUs | Social Polls",
  description: "Encuestas sociales para grupos de amigos",
  manifest: "/manifest.json",
};

import { PageTransition } from "@/components/PageTransition";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black antialiased overscroll-none" suppressHydrationWarning>
        {/* Living Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/15 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-800/10 blur-[120px]" />
          <div className="absolute top-[30%] right-[5%] w-[30%] h-[30%] rounded-full bg-emerald-900/5 blur-[80px]" />
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
