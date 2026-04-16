"use client";

import { useEffect, useState } from "react";
import { BottomNav, Avatar, SectionTitle, LoadingScreen } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, Zap, Trophy, Ghost } from "lucide-react";
import { profileService, type Profile } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

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
  const podiumRanks  = [2, 1, 3];
  const podiumHeights = ["h-20", "h-32", "h-16"];
  const podiumColors  = [
    "bg-slate-500/60",
    "bg-emerald-500   shadow-[0_0_24px_rgba(16,185,129,0.35)]",
    "bg-amber-700/60",
  ];
  const podiumRingColors = [
    "ring-slate-400/40",
    "ring-emerald-500  shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    "ring-amber-600/40",
  ];
  const rankBgColors = [
    "bg-slate-500 text-black",
    "bg-emerald-500 text-black",
    "bg-amber-700 text-white",
  ];

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh" />

      {/* Header */}
      <header
        className="px-6 pb-6 relative z-10 flex items-end justify-between"
        style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 52px)` }}
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-500/60 mb-1">
            Elite de la Auditoría
          </p>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Ranking
          </h1>
        </motion.div>
        <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.15)]">
          <Trophy size={22} className="text-yellow-400" />
        </div>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-8">

        {/* Podium */}
        {top3.length >= 3 && (
          <section>
            <div className="flex justify-center items-end gap-4 pt-4 pb-2">
              {podiumOrder.map((p, i) => {
                if (!p) return null;
                const rank    = podiumRanks[i];
                const isFirst = rank === 1;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex flex-col items-center gap-3"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {isFirst && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-3 border border-dashed border-emerald-500/25 rounded-full"
                        />
                      )}
                      <Avatar
                        src={p.avatar_url}
                        name={p.username}
                        size={isFirst ? 76 : 58}
                        className={cn("ring-2", podiumRingColors[i])}
                      />
                      <div className={cn(
                        "absolute -bottom-2 -right-1 w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-black text-xs",
                        rankBgColors[i]
                      )}>
                        {rank}
                      </div>
                    </div>

                    {/* Name + Score */}
                    <div className="text-center">
                      <p className={cn(
                        "font-black italic uppercase tracking-tight truncate",
                        isFirst ? "text-sm text-white max-w-[90px]" : "text-xs text-white/70 max-w-[72px]"
                      )}>
                        {p.username}
                      </p>
                      <p className={cn(
                        "text-[10px] font-black uppercase italic tracking-widest mt-0.5",
                        isFirst ? "text-emerald-400" : "text-white/30"
                      )}>
                        {p.points || 0} pts
                      </p>
                    </div>

                    {/* Podium block */}
                    <div className={cn("w-full rounded-t-2xl relative overflow-hidden", podiumHeights[i], podiumColors[i])}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Full list */}
        <section>
          <SectionTitle>Agentes de Campo</SectionTitle>
          <div className="flex flex-col gap-2">
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
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200",
                      isMe
                        ? "bg-emerald-500/[0.07] border-emerald-500/40"
                        : "bg-white/[0.02] border-white/[0.05]"
                    )}
                  >
                    {/* Rank */}
                    <div className={cn(
                      "w-8 text-center font-black text-sm italic flex-shrink-0",
                      i < 3 ? "text-emerald-400" : "text-white/20"
                    )}>
                      #{i + 1}
                    </div>

                    <Avatar
                      src={p.avatar_url}
                      name={p.username}
                      size={42}
                      className={cn(isMe ? "ring-2 ring-emerald-500/50" : "")}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-black text-white italic uppercase tracking-tight truncate text-sm">
                          {p.username}
                        </span>
                        {isMe && (
                          <span className="badge badge-emerald">Tú</span>
                        )}
                        {i === 0 && <Crown size={12} className="text-yellow-400 flex-shrink-0" />}
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[10px] font-black flex items-center gap-1 text-white/40 uppercase tracking-wider">
                          <Zap size={9} className="text-emerald-500" /> {p.points || 0}
                        </span>
                        <span className="text-[10px] font-black flex items-center gap-1 text-white/40 uppercase tracking-wider">
                          <Flame size={9} className="text-orange-500" /> {p.current_streak || 0}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {leaders.length === 0 && (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/[0.05] rounded-3xl">
                <Ghost size={36} className="mx-auto text-white/10 mb-3" />
                <p className="text-[10px] font-black text-white/15 uppercase tracking-widest">
                  Base de datos vacía
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
