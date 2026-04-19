"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui";
import { Search, Sparkles, Flame, Coffee, Brain, Zap, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Packs", icon: Sparkles },
  { id: "party", label: "Fiesta", icon: Flame },
  { id: "deep", label: "Profundo", icon: Brain },
  { id: "ai", label: "IA (Beta)", icon: Zap },
  { id: "casual", label: "Casual", icon: Coffee },
];

const PACKS = [
  {
    id: "ai-mode",
    title: "AI Future & Ethics",
    description: "Delve into the complex world of artificial intelligence and its societal impact.",
    icon: "🤖",
    category: "ai",
    count: 12,
    tag: "FEATURED",
    color: "from-blue-600 to-indigo-700",
    isPremium: true
  },
  {
    id: "party-night",
    title: "Noche de Fiesta",
    description: "¿Quién pagará la próxima ronda? Los mejores piques para salir.",
    icon: "🍻",
    category: "party",
    count: 15,
    tag: "POPULAR",
    color: "from-orange-500 to-rose-500",
  },
  {
    id: "deep-talks",
    title: "Filosofía Profunda",
    description: "Debates existenciales para conocer el alma de tu círculo.",
    icon: "🧘",
    category: "deep",
    count: 10,
    color: "from-indigo-600 to-purple-700",
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPacks = PACKS.filter(p => 
    selectedCategory === "all" || p.category === selectedCategory
  );

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-[var(--stitch-canvas)] dot-grid">
      {/* Header V4 */}
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <h1 className="font-jakarta text-2xl font-extrabold text-[var(--stitch-primary)] tracking-tight">
          AuditUs
        </h1>
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
          <User size={20} className="text-slate-400" />
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search question packs..." 
            className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="px-6 mb-8 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "chip-pill whitespace-nowrap",
              selectedCategory === cat.id 
                ? "bg-[var(--stitch-primary)] text-white shadow-lg shadow-indigo-500/20" 
                : "bg-white text-slate-500 border border-slate-100"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Stitch Cards */}
      <main className="px-6 flex flex-col gap-8">
        {filteredPacks.map((pack, idx) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-stitch-dark overflow-hidden group"
          >
            <div className={cn(
              "h-72 w-full relative bg-gradient-to-br overflow-hidden",
              pack.color
            )}>
              {/* Abstract Aura Background Overlay */}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full" />
              
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-80 group-hover:scale-110 transition-transform duration-700">
                {pack.icon}
              </div>

              {/* Tag Overlays */}
              <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-start">
                <div className="flex gap-2">
                  {pack.tag && (
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest">
                      {pack.tag}
                    </span>
                  )}
                  <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest">
                    {pack.count} QUESTIONS
                  </span>
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="font-jakarta text-3xl font-black text-white mb-2 tracking-tight">
                  {pack.title}
                </h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed mb-6 max-w-[240px]">
                  {pack.description}
                </p>
                <button className="bg-white text-black rounded-full px-6 py-3 text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                  Open Pack <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
