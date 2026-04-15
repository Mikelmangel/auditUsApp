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
    <div className="min-h-svh flex items-center justify-center relative overflow-hidden bg-black selection:bg-emerald-500/30">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-800/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] px-6 relative z-10"
      >
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">AuditUs</h1>
            <p className="text-emerald-500/70 text-sm font-medium uppercase tracking-[0.2em]">
              {mode === "login" ? "Acceso de Usuario" : "Registro de Sistema"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2.5 text-sm font-bold rounded-[14px] transition-all duration-300",
                mode === "login" ? "bg-emerald-500 text-black shadow-lg" : "text-white/40 hover:text-white/70"
              )}
            >
              Entrar
            </button>
            <button 
              onClick={() => setMode("signup")}
              className={cn(
                "flex-1 py-2.5 text-sm font-bold rounded-[14px] transition-all duration-300",
                mode === "signup" ? "bg-emerald-500 text-black shadow-lg" : "text-white/40 hover:text-white/70"
              )}
            >
              Unirse
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative"
                >
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all uppercase text-sm tracking-wider"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm tracking-wider"
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
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm tracking-wider"
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

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">SOCIAL</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Social Auth */}
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogle} 
            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar con Google
          </motion.button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-[10px] mt-8 uppercase tracking-[0.2em]">
          Protección de datos garantizada • <span className="text-emerald-500/50">AuditUs v2.0</span>
        </p>
      </motion.div>
    </div>
  );
}
