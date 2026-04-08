"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      } else {
        if (!username.trim()) { toast.error("Elige un nombre de usuario"); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { 
            data: { username: username.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          },
        });
        if (error) throw error;
        if (data.user) {
          toast.success("¡Cuenta creada! Revisa tu email para verificarla.");
          router.push("/");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-svh flex flex-col" style={{ maxWidth: 430, margin: "0 auto", background: "#fff" }}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-16 pb-10 px-6">
        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: "#10b981",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
        }}>
          <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="18" fill="#10b981"/>
            <path d="M11 18.5l4.5 4.5 9.5-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 6 }}>AuditUs</h1>
        <p style={{ color: "#6b7280", fontSize: 15 }}>
          {mode === "login" ? "Bienvenido de vuelta 👋" : "Únete a la comunidad"}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="pill-tabs">
          <button className={`pill-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Iniciar sesión
          </button>
          <button className={`pill-tab ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Registrarse
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 flex-1">
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div key="username"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input
                    className="input" type="text" placeholder="Nombre de usuario" value={username}
                    onChange={(e) => setUsername(e.target.value)} style={{ paddingLeft: 42 }}
                    maxLength={20} required={mode === "signup"}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              className="input" type="email" placeholder="Correo electrónico" value={email}
              onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 42 }} required
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              className="input" type={showPass ? "text" : "password"} placeholder="Contraseña"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: 42, paddingRight: 42 }} required minLength={6}
            />
            <button type="button" onClick={() => setShowPass(p => !p)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : (mode === "login" ? "Iniciar sesión" : "Crear cuenta")}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{ color: "#9ca3af", fontSize: 13, fontWeight: 500 }}>o continúa con</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} className="btn-secondary" style={{ gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </div>
    </div>
  );
}
