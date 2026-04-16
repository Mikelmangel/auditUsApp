"use client";

import { motion } from "framer-motion";
import { BottomNav, Card, SectionTitle } from "@/components/ui";
import { ArrowRight, Loader2, Plus, Hash, Globe } from "lucide-react";
import { useState } from "react";
import { groupService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading,    setLoading]    = useState(false);
  const { user } = useAuth();
  const router    = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user)               return toast.error("Debes iniciar sesión primero");
    if (!inviteCode.trim())  return;
    setLoading(true);
    try {
      const group = await groupService.joinGroup(inviteCode.trim(), user.id);
      toast.success(`¡Bienvenido a ${group.name}!`);
      router.push(`/groups/${group.id}`);
    } catch (error: any) {
      toast.error(error.message || "Código no válido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh" />

      {/* Header */}
      <header
        className="px-6 pb-8 relative z-10"
        style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 52px)` }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mb-1">
            Protocolo de Redes
          </p>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Explorar
          </h1>
        </motion.div>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-8">

        {/* Join via code */}
        <section>
          <SectionTitle>Unirse a un Grupo</SectionTitle>
          <Card className="p-7 relative overflow-hidden">
            {/* Decorative bg icon */}
            <div className="absolute -right-4 -top-4 opacity-[0.03]">
              <Globe size={120} className="text-emerald-500" />
            </div>

            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.12em] mb-6 leading-relaxed">
              Ingresa el código de 6 caracteres para conectarte al grupo
            </p>

            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div className="relative">
                <Hash
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 pointer-events-none"
                />
                <input
                  type="text"
                  id="invite-code-input"
                  placeholder="CÓDIGO"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  className={cn(
                    "w-full bg-white/[0.05] border-2 rounded-2xl pl-14 pr-5 py-5",
                    "text-white text-2xl font-black tracking-[0.4em] uppercase",
                    "placeholder:text-white/15 outline-none transition-all duration-200",
                    inviteCode.length === 6
                      ? "border-emerald-500/60 bg-emerald-500/[0.06] shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                      : "border-white/[0.07] focus:border-emerald-500/40 focus:bg-white/[0.07]"
                  )}
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                  maxLength={6}
                  aria-label="Código de invitación"
                />
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-200",
                      i < inviteCode.length ? "bg-emerald-500 scale-125" : "bg-white/15"
                    )}
                  />
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={loading || inviteCode.length < 6}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
              >
                {loading
                  ? <Loader2 size={20} className="animate-spin" />
                  : <ArrowRight size={20} />
                }
                {loading ? "Verificando..." : "Conectar a la Red"}
              </motion.button>
            </form>
          </Card>
        </section>

        {/* Create group */}
        <section>
          <SectionTitle>Crear Nuevo Grupo</SectionTitle>
          <Link href="/groups/new?mode=create">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="card p-7 cursor-pointer group hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 flex-shrink-0">
                  <Plus size={30} className="text-emerald-500 group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                    Inaugurar Círculo
                  </h2>
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider">
                    Genera un nuevo entorno de auditoría
                  </p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-white/10 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                />
              </div>
            </motion.div>
          </Link>
        </section>

      </div>

      <BottomNav />
    </div>
  );
}
