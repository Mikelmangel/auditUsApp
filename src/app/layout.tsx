import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AuditUs | Social Polls",
  description: "Encuestas sociales para grupos de amigos",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <main>
            {children}
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#111827",
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
