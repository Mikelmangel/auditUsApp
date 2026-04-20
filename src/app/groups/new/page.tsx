"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { ChevronLeft, Hash, Plus, Link as LinkIcon, Loader2, Users } from "lucide-react";
import { groupService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EMOJI_GROUPS = [
  { label: "Vibras", icons: ["🔮","⚡","🌊","🔥","💥","🌙","🌈","✨","🌀","💫"] },
  { label: "Personas", icons: ["🦋","👑","🎭","🥷","🦁","🐺","🦊","🐉","🦅","🐬"] },
  { label: "Actividad", icons: ["🎯","🏆","🚀","🎸","🎪","⚽","🏄","🎮","🥊","🎲"] },
  { label: "Objetos", icons: ["💎","🔑","🗺️","🧿","📡","🧬","🪐","🔭","⚗️","🪄"] },
];

const ALL_EMOJIS = EMOJI_GROUPS.flatMap(g => g.icons);

export default function NewGroupPage() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🔮");
  const [activeCategory, setActiveCategory] = useState(0);
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
    <MobileLayout
      header={
        <header
          className="bg-indigo-600 px-5 rounded-b-[32px] shadow-xl shadow-indigo-900/20"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2.5rem)', paddingBottom: '20px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <Link href="/">
              <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 active:scale-90 transition-transform">
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
            </Link>
            <span className="font-jakarta text-sm font-black text-white/50 uppercase tracking-widest">
              {mode === "create" ? "Nuevo grupo" : "Unirse"}
            </span>
            <div className="w-9 h-9" />
          </div>
          <motion.div
            className="flex items-center gap-4 px-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-14 h-14 rounded-[20px] bg-white/10 border border-white/10 flex items-center justify-center text-3xl flex-shrink-0">
              {emoji}
            </div>
            <div className="min-w-0">
              <p className="font-jakarta text-xl font-black text-white leading-tight truncate">
                {name || (mode === "create" ? "Nombre del grupo" : "Unirse por código")}
              </p>
              <p className="font-inter text-[9px] font-black text-white/40 uppercase tracking-widest mt-0.5">
                {mode === "create" ? "Círculo de confianza" : "Introduce el código de 6 caracteres"}
              </p>
            </div>
          </motion.div>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-5 pb-8 flex-1 max-w-[430px] mx-auto w-full pt-5">
        {/* Mode Tabs */}
        <div className="bg-white/60 backdrop-blur-md p-1 rounded-[20px] border border-slate-100 flex items-center mb-6 shadow-sm">
          <button
            className={cn(
              "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[16px] transition-all duration-300 flex items-center justify-center gap-2",
              mode === "create" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400"
            )}
            onClick={() => setMode("create")}
          >
            <Plus size={13} strokeWidth={3} />
            Crear
          </button>
          <button
            className={cn(
              "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[16px] transition-all duration-300 flex items-center justify-center gap-2",
              mode === "join" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400"
            )}
            onClick={() => setMode("join")}
          >
            <LinkIcon size={13} strokeWidth={3} />
            Unirse
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
                <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100/50">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Icono del grupo</p>
                    <div className="flex gap-1">
                      {EMOJI_GROUPS.map((g, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveCategory(i)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                            activeCategory === i
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          )}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-5 gap-2"
                    >
                      {EMOJI_GROUPS[activeCategory].icons.map((e) => (
                        <motion.button
                          key={e}
                          type="button"
                          whileTap={{ scale: 0.88 }}
                          onClick={() => setEmoji(e)}
                          className={cn(
                            "h-13 rounded-[16px] text-2xl border-2 transition-all duration-200 flex items-center justify-center aspect-square",
                            emoji === e
                              ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/20"
                              : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                          )}
                        >
                          {e}
                        </motion.button>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Main Fields */}
                <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100/50 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Nombre <span className="text-[#f36b2d]">*</span>
                    </label>
                    <input
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-black text-slate-900 tracking-tight focus:outline-none focus:border-indigo-500 transition-all text-sm"
                      type="text"
                      placeholder="LOS INSOMNES..."
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      maxLength={40}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Descripción <span className="text-slate-300">(opcional)</span>
                    </label>
                    <input
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                      type="text"
                      placeholder="¿De qué va este grupo?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !name.trim()}
                >
                  {loading
                    ? <Loader2 size={20} className="animate-spin text-white" />
                    : <><Plus size={18} strokeWidth={3} /> Crear Grupo</>
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
              <div className="bg-white rounded-[28px] p-7 flex flex-col items-center text-center mb-5 shadow-sm border border-slate-100/50">
                <div className="w-16 h-16 rounded-[20px] bg-indigo-50 flex items-center justify-center mb-5 border border-indigo-100">
                  <Users size={28} className="text-indigo-600" />
                </div>
                <h2 className="font-jakarta text-xl font-black text-slate-900 tracking-tight mb-2">
                  Unirse por código
                </h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[240px]">
                  Introduce los 6 caracteres que te ha pasado el admin del grupo.
                </p>
              </div>

              <form onSubmit={join} className="flex flex-col gap-5">
                <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100/50">
                  <div className="relative">
                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" />
                    <input
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-center font-black text-2xl tracking-[0.4em] uppercase text-indigo-600 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      type="text"
                      placeholder="XXXXXX"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6))}
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex justify-center gap-2 mt-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          i < code.length ? "bg-indigo-600 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "bg-slate-200"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || code.length < 6}
                >
                  {loading
                    ? <Loader2 size={20} className="animate-spin text-white" />
                    : <><LinkIcon size={18} strokeWidth={3} /> Unirse Ahora</>
                  }
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}
