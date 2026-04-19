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
  const podiumHeights = ["h-20", "h-36", "h-16"];
  const podiumColors  = [
    "bg-[#14726e]/10 border-[#14726e]/20",
    "bg-[#14726e] shadow-[0_12px_40px_rgba(20,114,110,0.3)]",
    "bg-white border-black/5",
  ];
  const podiumTextColors = [
    "text-[#14726e]",
    "text-white",
    "text-gray-400",
  ];

  return (
    <div className="min-h-svh bg-[#f3ede2] relative overflow-x-hidden">
      {/* Header with Arc */}
      <header className="arc-header px-6 pb-20 text-center relative overflow-hidden">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative z-10"
        >
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[24px] flex items-center justify-center border border-white/20 shadow-xl">
                <Trophy size={32} className="text-orange-400" />
             </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
            Elite de la Auditoría
          </p>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Ranking
          </h1>
        </motion.div>
        
        {/* Floating circles decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-3xl" />
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-8 -mt-10">

        {/* Podium */}
        {top3.length >= 3 && (
          <section>
            <div className="flex justify-center items-end gap-3 pt-4">
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
                    className="flex-1 flex flex-col items-center gap-3"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {isFirst && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-4 border border-dashed border-[#14726e]/30 rounded-full"
                        />
                      )}
                      <Avatar
                        src={p.avatar_url}
                        name={p.username}
                        size={isFirst ? 84 : 64}
                        className={cn(
                          "ring-4 transition-all duration-500",
                          isFirst ? "ring-white shadow-2xl" : "ring-white/50"
                        )}
                      />
                      <div className={cn(
                        "absolute -bottom-2 -right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-black text-xs shadow-lg",
                        isFirst ? "bg-[#f36b2d] text-white" : "bg-white text-[#14726e]"
                      )}>
                        {rank}
                      </div>
                    </div>

                    {/* Name + Score */}
                    <div className="text-center">
                      <p className={cn(
                        "font-black uppercase tracking-tight truncate",
                        isFirst ? "text-sm text-gray-900 max-w-[90px]" : "text-xs text-gray-500 max-w-[72px]"
                      )}>
                        {p.username}
                      </p>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest mt-0.5",
                        isFirst ? "text-[#f36b2d]" : "text-gray-400"
                      )}>
                        {p.points || 0} pts
                      </p>
                    </div>

                    {/* Podium block */}
                    <div className={cn("w-full rounded-[24px] border relative overflow-hidden flex items-center justify-center", podiumHeights[i], podiumColors[i])}>
                       <span className={cn("text-2xl font-black opacity-40", podiumTextColors[i])}>#{rank}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Full list */}
        <section className="flex flex-col gap-4">
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
                      "flex items-center gap-4 p-4 rounded-[28px] border transition-all duration-300",
                      isMe
                        ? "bg-white border-[#14726e]/30 shadow-md ring-2 ring-[#14726e]/5"
                        : "bg-white/60 border-black/5 hover:bg-white hover:shadow-sm"
                    )}
                  >
                    {/* Rank */}
                    <div className={cn(
                      "w-8 text-center font-black text-sm flex-shrink-0",
                      i < 3 ? "text-[#f36b2d]" : "text-gray-300"
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
                        <span className="font-black text-gray-900 italic uppercase tracking-tight truncate text-sm">
                          {p.username}
                        </span>
                        {isMe && (
                          <span className="badge badge-emerald">Tú</span>
                        )}
                        {i === 0 && <Crown size={12} className="text-yellow-400 flex-shrink-0" />}
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[10px] font-black flex items-center gap-1 text-gray-400 uppercase tracking-wider">
                          <Zap size={9} className="text-emerald-500" /> {p.points || 0}
                        </span>
                        <span className="text-[10px] font-black flex items-center gap-1 text-gray-400 uppercase tracking-wider">
                          <Flame size={9} className="text-orange-500" /> {p.current_streak || 0}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {leaders.length === 0 && (
              <div className="text-center py-20 bg-black/5 border border-dashed border-black/10 rounded-3xl">
                <Ghost size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
