"use client";

import { useEffect, useState } from "react";
import { BottomNav, Avatar, Card, SectionTitle } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, Zap, Loader2, Trophy, Medal, Ghost, Star } from "lucide-react";
import { profileService, type Profile } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    profileService.getLeaderboard(50).then((d) => { setLeaders(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center bg-black">
      <Loader2 size={40} className="animate-spin text-emerald-500 opacity-50" />
    </div>
  );

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const podiumRanks = [2, 1, 3];
  const podiumColors = ["bg-slate-400", "bg-emerald-500", "bg-amber-700"];

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh opacity-30" />

      {/* Header */}
      <header className="px-6 pt-14 pb-8 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">RANKING</h1>
          <p className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase opacity-70 italic">Elite de la Auditoría</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <Trophy size={24} />
        </div>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-10">
        
        {/* Podium Section */}
        {top3.length >= 3 && (
          <section>
            <div className="flex justify-center items-end gap-3 pt-6">
              {podiumOrder.map((p, i) => {
                if (!p) return null;
                const rank = podiumRanks[i];
                const isFirst = rank === 1;
                return (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex-1 flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      {isFirst && (
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-4 border border-dashed border-emerald-500/30 rounded-full"
                        />
                      )}
                      <Avatar 
                        src={p.avatar_url} 
                        name={p.username} 
                        size={isFirst ? 80 : 60} 
                        className={cn(
                          "transition-all duration-500",
                          isFirst ? "ring-4 ring-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]" : "ring-2 ring-white/10"
                        )}
                      />
                      <div className={cn(
                        "absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-xs italic",
                        rank === 1 ? "bg-emerald-500 text-black" : rank === 2 ? "bg-slate-400 text-black" : "bg-amber-700 text-white"
                      )}>
                        {rank}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-black text-white italic uppercase tracking-tighter text-xs truncate max-w-[80px]">
                        {p.username}
                      </p>
                      <p className={cn(
                        "text-[10px] font-black uppercase italic tracking-widest mt-1",
                        isFirst ? "text-emerald-500" : "text-white/40"
                      )}>
                        {p.points || 0} PTS
                      </p>
                    </div>

                    <div className={cn(
                      "w-20 rounded-t-3xl transition-all duration-1000",
                      podiumColors[i],
                      isFirst ? "h-32 opacity-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "h-20 opacity-30"
                    )}>
                      <div className="h-full w-full bg-gradient-to-t from-black/50 to-transparent rounded-t-3xl" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Full list */}
        <section className="space-y-4">
          <SectionTitle>Agentes de Campo</SectionTitle>
          <div className="grid gap-3">
            <AnimatePresence>
              {leaders.map((p, i) => {
                const isMe = p.id === user?.id;
                return (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300",
                      isMe ? "bg-emerald-500/[0.08] border-emerald-500/50 shadow-lg shadow-emerald-500/10" : "bg-white/[0.02] border-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-8 text-center font-black text-sm italic",
                      i < 3 ? "text-emerald-500" : "text-white/20"
                    )}>
                      #{i + 1}
                    </div>
                    
                    <Avatar src={p.avatar_url} name={p.username} size={44} className="ring-2 ring-white/5" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white italic uppercase tracking-tight truncate">{p.username}</span>
                        {isMe && (
                          <span className="px-2 py-0.5 bg-emerald-500 rounded-full text-[8px] font-black text-black italic uppercase tracking-widest">Tú</span>
                        )}
                        {i === 0 && <Crown size={12} className="text-emerald-500 animate-pulse" />}
                      </div>
                      <div className="flex gap-4 mt-1">
                         <span className="text-[9px] font-black flex items-center gap-1 uppercase italic tracking-widest text-white/40">
                            <Zap size={10} className="text-emerald-500" /> {p.points || 0}
                         </span>
                         <span className="text-[9px] font-black flex items-center gap-1 uppercase italic tracking-widest text-white/40">
                            <Flame size={10} className="text-orange-500" /> {p.current_streak || 0}
                         </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-10">
                       <Medal size={20} className={i < 10 ? "text-emerald-500" : "text-white"} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {leaders.length === 0 && (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                <Ghost size={40} className="mx-auto text-white/5 mb-4" />
                <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Base de datos vacía</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
