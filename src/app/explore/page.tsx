"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";
import { useAuth } from "@/hooks/useAuth";
import { groupService, pollService, questionService } from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Search, Sparkles, Flame, Brain, Zap, Coffee,
  ArrowRight, User, Loader2, Lock, HelpCircle, X, Users
} from "lucide-react";

const CATEGORY_META: Record<string, {
  label: string;
  icon: typeof Sparkles;
  color: string;
  emoji: string;
  description: string;
  tagline: string;
}> = {
  humor: {
    label: "Humor",
    icon: Flame,
    color: "from-amber-400 to-orange-500",
    emoji: "😂",
    description: "Piques, burras y situaciones ridículas",
    tagline: "¿Quién perdería una معركة de dignidad?",
  },
  habilidades: {
    label: "Habilidades",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
    emoji: "💪",
    description: "Quién vale más para determinadas tareas",
    tagline: "Demuestra quién manda aquí",
  },
  futuro: {
    label: "Futuro",
    icon: Brain,
    color: "from-violet-600 to-purple-700",
    emoji: "🔮",
    description: "Predicciones sobre el destino del grupo",
    tagline: "¿Quién se hará rico primero?",
  },
  atrevidas: {
    label: "Atrevidas",
    icon: Lock,
    color: "from-rose-500 to-pink-600",
    emoji: "🌶️",
    description: "Confesiones y decisiones comprometedoras",
    tagline: "Sin filtro, sin piedad",
  },
  hipoteticas: {
    label: "Hipotéticas",
    icon: HelpCircle,
    color: "from-cyan-500 to-blue-600",
    emoji: "🧠",
    description: "Escenarios imposibles, respuestas creativas",
    tagline: "Si el mundo fuera al revés...",
  },
  vinculos: {
    label: "Vínculos",
    icon: Coffee,
    color: "from-yellow-500 to-amber-600",
    emoji: "💛",
    description: "Lo que realmente importa: esta panda",
    tagline: "El pegamento que nos mantiene",
  },
  eventos: {
    label: "Eventos",
    icon: Sparkles,
    color: "from-fuchsia-500 to-purple-600",
    emoji: "🎉",
    description: "Fiestas, viajes y momentos épicos",
    tagline: "Ordena al grupo para la próxima quedada",
  },
  ia_custom: {
    label: "IA (Beta)",
    icon: Zap,
    color: "from-indigo-600 to-blue-700",
    emoji: "🤖",
    description: "El futuro ya está aquí",
    tagline: "¿Cuánto depende cada uno de la tecnología?",
  },
};

function PackCard({
  pack,
  index,
  onSelect,
}: {
  pack: {
    category: string;
    count: number;
    isNew?: boolean;
  };
  index: number;
  onSelect: (category: string) => void;
}) {
  const meta = CATEGORY_META[pack.category] ?? CATEGORY_META["humor"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-stitch-dark overflow-hidden group"
    >
      <div className={cn("h-72 w-full relative bg-gradient-to-br overflow-hidden", meta.color)}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full" />

        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-80 group-hover:scale-110 transition-transform duration-700">
          {meta.emoji}
        </div>

        <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-start">
          <div className="flex gap-2">
            {pack.isNew && (
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest">
                NUEVO
              </span>
            )}
            <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest">
              {pack.count} PREGUNTAS
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <h3 className="font-jakarta text-3xl font-black text-white mb-2 tracking-tight">
            {meta.label}
          </h3>
          <p className="text-white/70 text-sm font-medium leading-relaxed mb-2 max-w-[240px]">
            {meta.description}
          </p>
          <p className="text-white/50 text-xs italic mb-6">{meta.tagline}</p>
          <button
            className="bg-white text-black rounded-full px-6 py-3 text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            onClick={() => onSelect(pack.category)}
          >
            Usar pack <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [packs, setPacks] = useState<
    { category: string; count: number; isNew?: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectingPack, setSelectingPack] = useState<string | null>(null);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [launching, setLaunching] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadPacks() {
      const { data } = await supabase
        .from("questions")
        .select("category, mode");

      if (!data) {
        setLoading(false);
        return;
      }

      // Count per category
      const counts: Record<string, number> = {};
      for (const q of data) {
        counts[q.category] = (counts[q.category] ?? 0) + 1;
      }

      const categories = Object.keys(CATEGORY_META);
      const packList = categories
        .filter((cat) => cat !== "general")
        .map((cat) => ({
          category: cat,
          count: counts[cat] ?? 0,
          isNew: cat === "ia_custom",
        }))
        .filter((p) => p.count > 0);

      setPacks(packList);
      setLoading(false);
    }
    loadPacks();
  }, []);

  const allCategories = [
    { id: "all", label: "Todos", icon: Sparkles, color: "bg-indigo-500" },
    ...Object.entries(CATEGORY_META).map(([id, meta]) => ({
      id,
      label: meta.label,
      icon: meta.icon,
      color: "",
    })),
  ];

  const filteredPacks = packs.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      search === "" ||
      CATEGORY_META[p.category]?.label.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MobileLayout
      header={
        <header className="px-6 pt-10 pb-6 flex items-center justify-between">
          <h1 className="font-jakarta text-2xl font-extrabold text-[var(--stitch-primary)] tracking-tight">
            Explorar
          </h1>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <User size={20} className="text-slate-400" />
          </div>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="pt-4 pb-12 overflow-x-hidden">
        {/* Hero Section */}
        <div className="px-6 mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Busca categorías o preguntas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="px-6 mb-8 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {allCategories.map((cat) => {
            const meta = CATEGORY_META[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "chip-pill whitespace-nowrap flex items-center gap-1.5",
                  selectedCategory === cat.id
                    ? "bg-[var(--stitch-primary)] text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white text-slate-500 border border-slate-100"
                )}
              >
                {meta ? meta.emoji : <Sparkles size={12} />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid of Pack Cards */}
        <main className="px-6 flex flex-col gap-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin text-indigo-400" />
            </div>
          ) : filteredPacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40 font-bold text-sm">
                No hay preguntas en esta categoría todavía.
              </p>
              <p className="text-white/20 text-xs mt-1">
                Prueba con otro pack o vuelve más tarde.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredPacks.map((pack, idx) => (
                <PackCard key={pack.category} pack={pack} index={idx} onSelect={(cat) => {
                  if (!user) { toast.error("Inicia sesión para usar un pack"); return; }
                  setSelectingPack(cat);
                  setLoadingGroups(true);
                  groupService.getMyGroups(user.id).then((g) => {
                    setUserGroups(g);
                    setLoadingGroups(false);
                  });
                }} />
              ))}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Group selector modal */}
      <AnimatePresence>
        {selectingPack && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[var(--stitch-canvas)] rounded-t-3xl shadow-2xl border-t border-slate-200 px-6 py-6 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-jakarta text-xl font-black text-[var(--stitch-primary)]">
                  Lanzar en grupo
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  {CATEGORY_META[selectingPack]?.label ?? selectingPack} — elige un grupo
                </p>
              </div>
              <button
                onClick={() => setSelectingPack(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {loadingGroups ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-indigo-400" />
              </div>
            ) : userGroups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 font-semibold text-sm">No estás en ningún grupo.</p>
                <p className="text-slate-300 text-xs mt-1">Crea o únete a uno primero.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={async () => {
                      if (!user) return;
                      setLaunching(true);
                      setSelectingPack(null);
                      try {
                        const members = await groupService.getGroupMembers(group.id);
                        if (members.length < 2) {
                          toast.error("Necesitas al menos 2 miembros en el grupo.");
                          setLaunching(false);
                          return;
                        }
                        const q = await questionService.getRandomQuestion(group.id, members.length, selectingPack);
                        if (!q) {
                          toast.error(`No hay preguntas de ${CATEGORY_META[selectingPack]?.label ?? selectingPack} para este grupo.`);
                          setLaunching(false);
                          return;
                        }
                        const shuffled = [...members].sort(() => Math.random() - Math.random());
                        const rendered = questionService.renderQuestion(q.text, {
                          groupName: group.name,
                          memberA: shuffled[0]?.profiles?.username,
                          memberB: shuffled[1]?.profiles?.username,
                          memberCount: members.length,
                        });
                        const poll = await pollService.createPoll(group.id, rendered, user.id, q.mode, q.id);
                        await supabase.from("group_poll_history").insert([{ group_id: group.id, question_id: q.id }]);
                        toast.success("¡Encuesta lanzada!");
                        router.push(`/poll/${poll.id}`);
                      } catch (e: any) {
                        toast.error(e.message || "Error al lanzar");
                      } finally {
                        setLaunching(false);
                      }
                    }}
                    disabled={launching}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 text-left hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                      {group.avatar_emoji ?? "🔮"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-jakarta font-extrabold text-[var(--stitch-primary)] truncate">{group.name}</p>
                      <p className="text-slate-400 text-xs">{group.member_count ?? 0} miembros</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {launching && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-white" />
        </div>
      )}
    </MobileLayout>
  );
}