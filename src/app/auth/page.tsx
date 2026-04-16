"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    <div className="min-h-svh flex items-center justify-center p-6 selection:bg-emerald-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] relative z-20"
      >
        {/* Main Glass Card */}
        <div className="card-elevated p-8 relative overflow-hidden group">
          {/* Internal Glow Interaction */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30 ring-8 ring-emerald-500/10"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase italic leading-none">AuditUs</h1>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-emerald-500/30" />
              <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.3em]">
                {mode === "login" ? "Acceso Sistema" : "Nuevos Usuarios"}
              </p>
              <div className="h-px w-8 bg-emerald-500/30" />
            </div>
          </div>

          {/* Mode Tabs (Pill Style) */}
          <div className="pill-tabs mb-8">
            <button 
              onClick={() => setMode("login")}
              className={cn(
                "pill-tab flex-1 py-3 text-xs",
                mode === "login" ? "bg-emerald-500 text-black shadow-lg" : "text-white/40 hover:text-white/70"
              )}
            >
              ENTRAR
            </button>
            <button 
              onClick={() => setMode("signup")}
              className={cn(
                "pill-tab flex-1 py-3 text-xs",
                mode === "signup" ? "bg-emerald-500 text-black shadow-lg" : "text-white/40 hover:text-white/70"
              )}
            >
              UNIRSE
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-12 uppercase text-sm tracking-widest font-bold"
                    required
                  />
                  <div className="h-4" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12 text-sm font-medium"
                required
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12 pr-12 text-sm font-medium"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-emerald-500 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary mt-4"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Alternativas Sociales</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Social Auth */}
          <button 
            onClick={handleGoogle} 
            className="btn-secondary w-full group/google"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover/google:scale-110 transition-transform">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar con Google
          </button>
        </div>

        {/* Footer Polish */}
        <div className="flex flex-col items-center mt-10 space-y-2">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-medium">
            Seguridad y Privacidad <span className="text-emerald-500/40 mx-2">•</span> AuditUs v2.4
          </p>
          <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
        </div>
      </motion.div>
    </div>
  );
}
