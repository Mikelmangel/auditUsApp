"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumButton, PremiumCard, cn } from "@/components/ui";
import { ChevronRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const slides: Slide[] = [
  {
    title: "Cuestiona. Conecta.",
    description: "Crea círculos de confianza y descubre la verdad latente en tu red social.",
    icon: <Sparkles className="text-white" size={32} />,
    gradient: "from-white/5 to-transparent",
  },
  {
    title: "Sincronía Total",
    description: "Resultados en tiempo real procesados por el protocolo de inteligencia colectiva.",
    icon: <Zap className="text-white" size={32} />,
    gradient: "from-white/5 to-transparent",
  },
  {
    title: "Identidad Blindada",
    description: "Tu huella digital está protegida por encriptación de grado militar en la red Supabase.",
    icon: <ShieldCheck className="text-white" size={32} />,
    gradient: "from-white/5 to-transparent",
  },
];

export function MagicOnboarding({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-onyx flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Subtle Grain & Ambient Glow */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className={cn(
              "absolute inset-0 bg-gradient-to-b blur-[120px] pointer-events-none opacity-20",
              slides[current].gradient
            )}
        />
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <div className="w-full mb-20 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0, filter: "blur(20px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-16 border border-white/5 shadow-2xl">
                {slides[current].icon}
              </div>
              
              <h1 className="text-white text-5xl font-black mb-6 heading-infinite leading-tight tracking-tight uppercase italic">
                {slides[current].title}
              </h1>
              
              <p className="text-white/40 text-lg font-medium leading-relaxed mb-12">
                {slides[current].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Minimalist Indicators */}
          <div className="flex gap-2 justify-center">
            {slides.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-[2px] transition-all duration-700",
                  i === current ? "w-12 bg-white" : "w-4 bg-white/10"
                )}
              />
            ))}
          </div>
        </div>

        <PremiumButton 
          fullWidth 
          className="py-7 text-sm"
          onClick={next}
        >
          {current === slides.length - 1 ? "Entrar en el Protocolo" : "Siguiente Fase"}
          <ChevronRight className="ml-2" size={16} />
        </PremiumButton>

        <button 
          onClick={onComplete}
          className="mt-12 label-micro opacity-10 hover:opacity-100 transition-opacity"
        >
          Saltar Transmisión
        </button>
      </div>
    </div>
  );
}
