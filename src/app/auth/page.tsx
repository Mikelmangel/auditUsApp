"use client";

import { Button, Card } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    <MobileLayout className="bg-[var(--stitch-canvas)]">
      <div className="min-h-full flex items-center justify-center p-6 selection:bg-indigo-500/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[440px] relative z-20"
        >
          {/* Main Card */}
          <Card className="p-8 shadow-2xl shadow-indigo-500/10 border-slate-100 ring-4 ring-white">
            
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 border-4 border-white"
              >
                <Zap size={40} className="text-white fill-white" />
              </motion.div>
              <h1 className="font-jakarta text-4xl font-black text-slate-900 tracking-tight mb-2 leading-none cursor-default">
                AuditUs
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-slate-200" />
                <p className="font-inter text-indigo-500 text-[11px] font-black uppercase tracking-[0.3em]">
                  {mode === "login" ? "Acceso Sistema" : "Nuevos Usuarios"}
                </p>
                <div className="h-px w-6 bg-slate-200" />
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-full mb-8 border border-slate-200/50">
              <button 
                onClick={() => setMode("login")}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all",
                  mode === "login" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                ENTRAR
              </button>
              <button 
                onClick={() => setMode("signup")}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all",
                  mode === "signup" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
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
                    <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      placeholder="NOMBRE DE USUARIO"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 font-black text-slate-900 text-xs tracking-widest focus:outline-none focus:border-indigo-400 transition-all uppercase"
                      required
                    />
                    <div className="h-4" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-400 transition-all font-inter"
                  required
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="CONTRASEÑA"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-400 transition-all font-inter"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button 
                type="submit" 
                loading={loading}
                className="h-16 mt-4 shadow-xl shadow-indigo-500/20"
              >
                {mode === "login" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
                <ArrowRight size={20} />
              </Button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-4 my-10">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Alternativas</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Social Auth */}
            <button 
              onClick={handleGoogle} 
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-full py-4 px-6 font-jakarta font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar con Google
            </button>
          </Card>

          {/* Footer Polish */}
          <div className="flex flex-col items-center mt-12 space-y-4">
            <p className="font-inter text-slate-300 text-[10px] uppercase tracking-[0.3em] font-black">
              AuditUs <span className="text-slate-200 mx-2">//</span> Sistema de Seguridad v3.0
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
