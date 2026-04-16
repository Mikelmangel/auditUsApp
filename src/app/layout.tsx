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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div id="app-root">
            {children}
          </div>
          <NudgeListener />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
