"use client";

import { Avatar, BottomNav, LoadingScreen, SectionTitle } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { useAuth } from "@/hooks/useAuth";
import { profileService, type Profile } from "@/lib/services";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Flame, Ghost, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    profileService.getLeaderboard(50).then(d => { setLeaders(d); setLoading(false); });
  }, []);

  if (loading) return <LoadingScreen />;

  const top3 = leaders.slice(0, 3);
  const rest  = leaders.slice(3);

  // Podium order: 2nd (left), 1st (center), 3rd (right)
  const podiumOrder  = [top3[1], top3[0], top3[2]];
  const podiumHeights = ["h-24", "h-40", "h-20"];
  const podiumColors  = [
    "bg-indigo-100/50 border-indigo-100",
    "bg-[var(--stitch-primary)] shadow-2xl shadow-indigo-500/40 border-indigo-400",
    "bg-white border-slate-100",
  ];
  const podiumTextColors = [
    "text-indigo-600",
    "text-white",
    "text-slate-400",
  ];

  return (
    <MobileLayout
      header={
        <header className="px-6 pt-16 pb-8 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center border border-slate-100 shadow-xl">
                <Trophy size={40} className="text-indigo-500 drop-shadow-md" />
              </div>
            </div>
            <h1 className="font-jakarta text-4xl font-black text-slate-900 leading-none tracking-tight">
              Ranking
            </h1>
            <p className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">
              Elite de la Auditoría
            </p>
          </motion.div>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-6 pb-12 relative z-10 flex flex-col gap-10">

        {/* Podium Section */}
        {top3.length >= 3 && (
          <section>
            <div className="flex justify-center items-end gap-3 pt-4 px-2">
              {podiumOrder.map((p, i) => {
                if (!p) return null;
                const ranks = [2, 1, 3];
                const rank = ranks[i];
                const isFirst = rank === 1;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex flex-col items-center gap-4"
                  >
                    {/* Avatar with Halo for 1st */}
                    <div className="relative">
                      {isFirst && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-4 border-2 border-dashed border-indigo-200 rounded-full"
                        />
                      )}
                      <Avatar
                        src={p.avatar_url}
                        name={p.username}
                        size={isFirst ? 88 : 68}
                        className={cn(
                          "ring-4 transition-all duration-500",
                          isFirst ? "ring-white shadow-2xl" : "ring-white/50 shadow-md"
                        )}
                      />
                      <div className={cn(
                        "absolute -bottom-2 -right-1 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-black text-xs shadow-lg",
                        isFirst ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"
                      )}>
                        {rank}
                      </div>
                    </div>

                    {/* Name + Points badge */}
                    <div className="text-center w-full px-1">
                      <p className={cn(
                        "font-jakarta font-black truncate leading-none mb-1.5",
                        isFirst ? "text-sm text-slate-900" : "text-xs text-slate-500"
                      )}>
                        {p.username}
                      </p>
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border",
                        isFirst ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-white border-slate-100 text-slate-400"
                      )}>
                        <Zap size={10} className={isFirst ? "fill-indigo-500" : "fill-slate-300"} />
                        <span className="font-inter text-[10px] font-black">{p.points || 0}</span>
                      </div>
                    </div>

                    {/* Geometric Podium Block */}
                    <div className={cn("w-full rounded-[28px] border relative overflow-hidden flex items-center justify-center", podiumHeights[i], podiumColors[i])}>
                       <span className={cn("font-jakarta text-3xl font-black opacity-30", podiumTextColors[i])}>#{rank}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Full List Section */}
        <section className="flex flex-col gap-6">
          <SectionTitle>Agentes de Campo</SectionTitle>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {leaders.map((p, i) => {
                const isMe = p.id === user?.id;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-[32px] border transition-all duration-300",
                      isMe
                        ? "bg-white border-indigo-200 shadow-xl shadow-indigo-500/5 ring-2 ring-indigo-500/5"
                        : "bg-white/60 border-slate-100/50 hover:bg-white hover:border-slate-200 hover:shadow-sm"
                    )}
                  >
                    {/* Rank Indicator */}
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center font-jakarta font-black text-sm flex-shrink-0",
                      i < 3 ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-300"
                    )}>
                      #{i + 1}
                    </div>

                    <Avatar
                      src={p.avatar_url}
                      name={p.username}
                      size={48}
                      className={cn(isMe ? "ring-2 ring-indigo-500 shadow-md" : "border-slate-100")}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-jakarta font-black text-slate-900 truncate text-sm">
                          {p.username}
                        </span>
                        {isMe && (
                          <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Tú</span>
                        )}
                        {i === 0 && <Crown size={12} className="text-amber-400 fill-amber-400" />}
                      </div>
                      <div className="flex gap-3">
                        <span className="font-inter text-[10px] font-black flex items-center gap-1 text-slate-400 uppercase tracking-widest">
                          <Zap size={10} className="text-indigo-500 fill-indigo-500" /> {p.points || 0}
                        </span>
                        <span className="font-inter text-[10px] font-black flex items-center gap-1 text-slate-400 uppercase tracking-widest">
                          <Flame size={10} className="text-amber-500 fill-amber-500" /> {p.current_streak || 0}
                        </span>
                      </div>
                    </div>

                    {isMe && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {leaders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 bg-white/50 border-2 border-dashed border-slate-100 rounded-[40px]">
                <Ghost size={48} className="text-slate-200 mb-4" />
                <p className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Base de Datos Vacía
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
