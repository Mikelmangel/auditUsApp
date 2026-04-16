"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ui";
import { ChevronLeft, Hash, Plus, Link as LinkIcon, Loader2, Users } from "lucide-react";
import { groupService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const EMOJIS = ["🔮","🌊","🎯","🔥","⚡","🌙","🎭","🦋","🌺","🏆","💎","🎪","🚀","🎸","🌈"];

export default function NewGroupPage() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🔮");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setLoading(true);
    try {
      const group = await groupService.createGroup(name.trim(), user.id, description.trim() || undefined, emoji);
      toast.success(`¡${group.name} creado! Código: ${group.invite_code}`);
      router.push(`/groups/${group.id}`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || code.length < 6) return;
    setLoading(true);
    try {
      const group = await groupService.joinGroup(code, user.id);
      toast.success(`¡Te has unido a ${group.name}!`);
      router.push(`/groups/${group.id}`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-svh flex flex-col">
      {/* Header */}
      <header className="px-5 pt-14 pb-5 flex items-center gap-4 border-b border-white/[0.06]">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <ChevronLeft size={20} />
          </motion.button>
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50 mb-0.5">Nueva Conexión</p>
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Grupos</h1>
        </div>
      </header>

      <div className="px-5 pt-6 pb-40 flex-1 max-w-[430px] mx-auto w-full">
        {/* Mode Tabs */}
        <div className="pill-tabs mb-8">
          <button
            className={`pill-tab flex-1 py-3 text-xs flex items-center justify-center gap-2 ${
              mode === "create" ? "bg-emerald-500 text-black shadow-lg" : "text-white/40 hover:text-white/70"
            }`}
            onClick={() => setMode("create")}
          >
            <Plus size={14} />
            CREAR GRUPO
          </button>
          <button
            className={`pill-tab flex-1 py-3 text-xs flex items-center justify-center gap-2 ${
              mode === "join" ? "bg-emerald-500 text-black shadow-lg" : "text-white/40 hover:text-white/70"
            }`}
            onClick={() => setMode("join")}
          >
            <LinkIcon size={14} />
            UNIRSE
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "create" ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <form onSubmit={create} className="flex flex-col gap-5">
                {/* Emoji Picker */}
                <div className="card-elevated p-5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4">
                    Elige un avatar
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {EMOJIS.map((e) => (
                      <motion.button
                        key={e}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setEmoji(e)}
                        className={`h-14 rounded-[16px] text-2xl border-2 transition-all duration-200 ${
                          emoji === e
                            ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_16px_rgba(16,185,129,0.3)]"
                            : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.06]"
                        }`}
                      >
                        {e}
                      </motion.button>
                    ))}
                  </div>
                  {/* Selected preview */}
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]">
                    <div className="w-12 h-12 rounded-[18px] bg-white/[0.05] border border-emerald-500/20 flex items-center justify-center text-2xl shadow-inner">
                      {emoji}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Avatar seleccionado</p>
                      <p className="text-white/60 text-xs font-semibold mt-0.5">
                        {name.trim() ? name : "Nombre del grupo..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] px-1">
                    Nombre del grupo <span className="text-emerald-500/60">*</span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Los Insomnes, Dream Team..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    required
                  />
                  <p className="text-right text-[10px] text-white/20 font-mono pr-1">{name.length}/40</p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] px-1">
                    Descripción <span className="text-white/20">(opcional)</span>
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder="¿De qué va este grupo?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-2"
                  disabled={loading || !name.trim()}
                >
                  {loading
                    ? <Loader2 size={22} className="animate-spin" />
                    : <><Plus size={20} /> CREAR GRUPO</>
                  }
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card-elevated p-7 flex flex-col items-center text-center mb-6">
                {/* Icon */}
                <div className="w-20 h-20 rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <Users size={36} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">
                  Unirse al grupo
                </h2>
                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-[260px]">
                  Introduce el código de 6 caracteres que te ha compartido el administrador
                </p>
              </div>

              <form onSubmit={join} className="flex flex-col gap-4">
                <div className="relative">
                  <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" />
                  <input
                    className="input pl-11 text-center font-black text-2xl tracking-[0.5em] uppercase"
                    type="text"
                    placeholder="XXXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6))}
                    maxLength={6}
                    required
                  />
                </div>

                {/* Character indicator dots */}
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i < code.length ? "bg-emerald-500 scale-110" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-2"
                  disabled={loading || code.length < 6}
                >
                  {loading
                    ? <Loader2 size={22} className="animate-spin" />
                    : <><Users size={20} /> UNIRSE AL GRUPO</>
                  }
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
