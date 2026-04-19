"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav, Card } from "@/components/ui";
import { Search, Sparkles, Flame, Coffee, Heart, Brain, Zap, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "party", label: "Fiesta", icon: Flame },
  { id: "deep", label: "Profundo", icon: Brain },
  { id: "ai", label: "Modo IA", icon: Zap },
  { id: "casual", label: "Casual", icon: Coffee },
];

const PACKS = [
  {
    id: "party-night",
    title: "Noche de Fiesta",
    description: "¿Quién pagará la próxima ronda? Risas y piques asegurados.",
    icon: "🍻",
    category: "party",
    count: 15,
    tag: "Popular",
    color: "from-orange-500 to-rose-500",
  },
  {
    id: "deep-talks",
    title: "Filosofía Profunda",
    description: "Debates existenciales para conocer el alma de tu grupo.",
    icon: "🧘",
    category: "deep",
    count: 12,
    tag: "Nuevo",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "ai-mode",
    title: "Modo IA",
    description: "Preguntas generadas por IA basadas en la química de tu grupo.",
    icon: "🤖",
    category: "ai",
    count: 20,
    tag: "Beta",
    color: "from-aura-violet to-aura-pink",
    isPremium: true
  },
  {
    id: "office-gossip",
    title: "Office Gossip",
    description: "El pack perfecto para el café de la oficina. Sin filtros.",
    icon: "💼",
    category: "casual",
    count: 10,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "first-date",
    title: "Primera Cita",
    description: "Rompe el hielo y evita silencios incómodos de forma divertida.",
    icon: "✨",
    category: "deep",
    count: 8,
    color: "from-aura-pink to-rose-400",
  },
  {
    id: "chaos-pack",
    title: "Caos Total",
    description: "Preguntas impredecibles que pondrán a prueba vuestra amistad.",
    icon: "🔥",
    category: "party",
    count: 18,
    color: "from-red-600 to-orange-400",
    isPremium: true
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPacks = PACKS.filter(p => 
    selectedCategory === "all" || p.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Dynamic Aura Background Orbs */}
      <div className="aura-bg-orb w-64 h-64 bg-aura-violet top-[-5%] left-[-10%] opacity-20" />
      <div className="aura-bg-orb w-72 h-72 bg-aura-pink bottom-[15%] right-[-15%] opacity-15" />

      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aura mb-2 block">Descubrimiento</span>
          <h1 className="font-outfit text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Explorar <br/> <span className="text-outline-aura">Paquetes</span>
          </h1>
          <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-[280px]">
            Elige un pack de preguntas para activar en tus círculos. Dinamiza tus auditorías sociales.
          </p>
        </motion.div>
      </header>

      {/* Search Bar - Visual Only */}
      <div className="px-6 mb-8">
        <div className="glass-v3 rounded-3xl p-4 flex items-center gap-3">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar packs o temas..." 
            className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="px-6 mb-8 overflow-x-auto no-scrollbar flex gap-3 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all text-xs font-black uppercase tracking-tight",
              selectedCategory === cat.id 
                ? "btn-aura text-white" 
                : "glass-v3 text-slate-500"
            )}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Packs Grid */}
      <main className="px-6 grid grid-cols-1 gap-6">
        {filteredPacks.map((pack, idx) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative"
          >
            <div className="glass-v3 p-3 rounded-[40px] transition-all hover:translate-y-[-4px] active:scale-[0.98] cursor-pointer">
              <div className={cn(
                "h-44 w-full rounded-[32px] relative overflow-hidden mb-4 bg-gradient-to-br",
                pack.color
              )}>
                {/* Decorative Pattern / Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-90 transition-transform group-hover:scale-110 duration-500 select-none">
                  {pack.icon}
                </div>
                
                {/* Tag Overlay */}
                {pack.tag && (
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">{pack.tag}</span>
                  </div>
                )}

                {/* Premium Icon */}
                {pack.isPremium && (
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/20">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="px-3 pb-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-outfit text-2xl font-black uppercase italic leading-none text-slate-800">
                    {pack.title}
                  </h3>
                  <span className="text-[10px] font-black text-aura uppercase">{pack.count} Preguntas</span>
                </div>
                <p className="text-xs font-bold text-slate-500 mb-6 leading-relaxed">
                  {pack.description}
                </p>
                <div className="flex gap-2">
                   <button className="flex-1 btn-aura py-3 text-xs italic tracking-tighter">
                     Añadir a Grupo
                   </button>
                   <button className="w-12 h-12 glass-v3 flex items-center justify-center rounded-2xl text-slate-400 hover:text-aura transition-colors">
                     <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
