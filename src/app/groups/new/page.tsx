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
    <div className="min-h-svh bg-[#f3ede2] flex flex-col">
      {/* Header with Arc */}
      <header className="arc-header px-6 pb-20 text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
            >
              <ChevronLeft size={20} />
            </motion.button>
          </Link>
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
            Conectar
          </h1>
          <div className="w-10 h-10" />
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative z-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
            Gestión de Círculos
          </p>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            {mode === "create" ? "Nuevo Grupo" : "Unirse"}
          </h2>
        </motion.div>
      </header>

      <div className="px-5 pb-40 flex-1 max-w-[430px] mx-auto w-full -mt-10 relative z-10">
        {/* Mode Tabs */}
        <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-[24px] border border-black/5 flex items-center mb-8 shadow-sm">
          <button
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all duration-300 flex items-center justify-center gap-2 ${
              mode === "create" ? "bg-[#14726e] text-white shadow-lg shadow-[#14726e]/20" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setMode("create")}
          >
            <Plus size={14} strokeWidth={3} />
            Crear
          </button>
          <button
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all duration-300 flex items-center justify-center gap-2 ${
              mode === "join" ? "bg-[#14726e] text-white shadow-lg shadow-[#14726e]/20" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setMode("join")}
          >
            <LinkIcon size={14} strokeWidth={3} />
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
              <form onSubmit={create} className="flex flex-col gap-6">
                {/* Emoji Picker */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">
                    Icono del grupo
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {EMOJIS.map((e) => (
                      <motion.button
                        key={e}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => setEmoji(e)}
                        className={`h-14 rounded-[18px] text-2xl border-2 transition-all duration-200 ${
                          emoji === e
                            ? "border-[#14726e] bg-[#14726e]/5"
                            : "border-gray-50 bg-gray-50/50 hover:bg-gray-100/50"
                        }`}
                      >
                        {e}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Main Fields */}
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                        Nombre <span className="text-[#f36b2d]">*</span>
                      </label>
                      <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-black text-gray-900 tracking-tight focus:outline-none focus:border-[#14726e] transition-all"
                        type="text"
                        placeholder="LOS INSOMNES..."
                        value={name}
                        onChange={(e) => setName(e.target.value.toUpperCase())}
                        maxLength={40}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                        Descripción <span className="text-gray-300">(opcional)</span>
                      </label>
                      <input
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14726e] transition-all"
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
                    ? <Loader2 size={22} className="animate-spin text-white" />
                    : <><Plus size={20} strokeWidth={3} /> CREAR GRUPO</>
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
              <div className="bg-white rounded-[32px] p-8 flex flex-col items-center text-center mb-6 shadow-sm border border-black/5">
                <div className="w-20 h-20 rounded-[28px] bg-orange-50 flex items-center justify-center mb-6 shadow-inner">
                  <Users size={36} className="text-[#f36b2d]" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">
                  Unirse por código
                </h2>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[240px]">
                  Introduce los 6 caracteres que te ha pasado el admin del grupo.
                </p>
              </div>

              <form onSubmit={join} className="flex flex-col gap-6">
                <div className="relative bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
                  <div className="relative">
                    <Hash size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#14726e]/30" />
                    <input
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-5 py-5 text-center font-black text-3xl tracking-[0.4em] uppercase text-[#14726e] focus:outline-none focus:border-[#14726e] focus:bg-white transition-all"
                      type="text"
                      placeholder="XXXXXX"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6))}
                      maxLength={6}
                      required
                    />
                  </div>
                  
                  {/* Character indicator dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i < code.length ? "bg-[#f36b2d] scale-125 shadow-[0_0_8px_rgba(243,107,45,0.4)]" : "bg-gray-100"
                        }`}
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
                    ? <Loader2 size={22} className="animate-spin text-white" />
                    : <><LinkIcon size={20} strokeWidth={3} /> UNIRSE AHORA</>
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
