"use client";

import { Avatar, BottomNav, LoadingScreen } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";
import { useAuth } from "@/hooks/useAuth";
import { groupService, type Group, type GroupMember } from "@/lib/services";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Crown, Flame, Ghost, Trophy, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user groups
  useEffect(() => {
    if (!user) return;
    groupService.getMyGroups(user.id).then(g => {
      setGroups(g);
      if (g.length > 0) setSelectedGroup(g[0]);
      setLoading(false);
    });
  }, [user]);

  // Load members when group changes
  useEffect(() => {
    if (!selectedGroup) return;
    setLoadingMembers(true);
    groupService.getGroupMembers(selectedGroup.id).then(m => {
      const sorted = [...m]
        .filter(x => x.profiles)
        .sort((a, b) => (b.profiles.points || 0) - (a.profiles.points || 0))
        .slice(0, 5);
      setMembers(sorted);
      setLoadingMembers(false);
    });
  }, [selectedGroup]);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (loading) return <LoadingScreen />;

  const top3 = members.slice(0, 3);
  const rest = members.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = ["h-20", "h-32", "h-16"];
  const podiumRanks = [2, 1, 3];

  return (
    <MobileLayout
      header={
        <header className="px-6 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                <Trophy size={16} className="text-indigo-500" />
              </div>
              <h1 className="font-jakarta text-xl font-black text-slate-900 leading-none tracking-tight">
                Ranking
              </h1>
            </div>

            {/* Group selector */}
            {groups.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-colors"
                >
                  <span className="text-sm leading-none">
                    {selectedGroup?.avatar_emoji || "🔮"}
                  </span>
                  <span className="font-jakarta font-bold text-slate-700 text-xs max-w-[88px] truncate leading-none">
                    {selectedGroup?.name}
                  </span>
                  <ChevronDown
                    size={12}
                    className={cn("text-slate-400 transition-transform duration-200", dropdownOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 min-w-[160px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-900/8 overflow-hidden z-50"
                    >
                      {groups.map(g => (
                        <button
                          key={g.id}
                          onClick={() => { setSelectedGroup(g); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-50 transition-colors text-left"
                        >
                          <span className="text-sm leading-none">{g.avatar_emoji || "🔮"}</span>
                          <span className="font-jakarta font-bold text-slate-700 text-xs flex-1 truncate">
                            {g.name}
                          </span>
                          {selectedGroup?.id === g.id && (
                            <Check size={12} className="text-indigo-500 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-6 pb-12 flex flex-col gap-8 relative z-10">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 border-2 border-dashed border-slate-100 rounded-[40px]">
            <Ghost size={40} className="text-slate-200 mb-4" />
            <p className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
              Únete a un grupo<br />para ver el ranking
            </p>
          </div>
        ) : loadingMembers ? (
          <div className="flex justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 border-2 border-dashed border-slate-100 rounded-[40px]">
            <Ghost size={40} className="text-slate-200 mb-4" />
            <p className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Sin miembros activos
            </p>
          </div>
        ) : (
          <>
            {/* Podium top 3 */}
            {top3.length >= 2 && (
              <section>
                <div className="flex justify-center items-end gap-3 pt-2 px-2">
                  {podiumOrder.map((m, i) => {
                    if (!m) return null;
                    const rank = podiumRanks[i];
                    const isFirst = rank === 1;
                    const p = m.profiles;
                    const isMe = p.id === user?.id;

                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 flex flex-col items-center gap-3"
                      >
                        <div className="relative">
                          {isFirst && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                              className="absolute -inset-3 border-2 border-dashed border-indigo-200 rounded-full"
                            />
                          )}
                          <Avatar
                            src={p.avatar_url}
                            name={p.username}
                            size={isFirst ? 76 : 60}
                            className={cn(
                              "ring-4",
                              isFirst ? "ring-white shadow-xl" : "ring-white/50 shadow-md",
                              isMe && "ring-indigo-400"
                            )}
                          />
                          <div className={cn(
                            "absolute -bottom-2 -right-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center font-black text-[10px] shadow-md",
                            isFirst ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"
                          )}>
                            {rank}
                          </div>
                        </div>

                        <div className="text-center w-full px-1">
                          <p className={cn(
                            "font-jakarta font-black truncate leading-none mb-1",
                            isFirst ? "text-xs text-slate-900" : "text-[10px] text-slate-500"
                          )}>
                            {p.username}
                          </p>
                          <div className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border",
                            isFirst ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-white border-slate-100 text-slate-400"
                          )}>
                            <Zap size={8} className={isFirst ? "fill-indigo-500" : "fill-slate-300"} />
                            <span className="font-inter text-[9px] font-black">{p.points || 0}</span>
                          </div>
                        </div>

                        <div className={cn(
                          "w-full rounded-[20px] border relative overflow-hidden",
                          podiumHeights[i],
                          isFirst
                            ? "bg-[var(--stitch-primary)] border-indigo-400 shadow-xl shadow-indigo-500/30"
                            : rank === 2
                            ? "bg-indigo-50 border-indigo-100"
                            : "bg-white border-slate-100"
                        )}>
                          <span className={cn(
                            "absolute inset-0 flex items-center justify-center font-jakarta text-2xl font-black opacity-20",
                            isFirst ? "text-white" : "text-indigo-500"
                          )}>
                            #{rank}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Positions 4–5 */}
            {rest.length > 0 && (
              <section className="flex flex-col gap-3">
                <AnimatePresence>
                  {rest.map((m, i) => {
                    const p = m.profiles;
                    const rank = i + 4;
                    const isMe = p.id === user?.id;
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                          "flex items-center gap-3.5 p-3.5 rounded-[24px] border transition-all duration-300",
                          isMe
                            ? "bg-white border-indigo-200 shadow-lg shadow-indigo-500/5 ring-2 ring-indigo-500/5"
                            : "bg-white/60 border-slate-100/50"
                        )}
                      >
                        <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-jakarta font-black text-xs bg-slate-50 text-slate-300 flex-shrink-0">
                          #{rank}
                        </div>
                        <Avatar
                          src={p.avatar_url}
                          name={p.username}
                          size={44}
                          className={cn(isMe ? "ring-2 ring-indigo-500" : "border-slate-100")}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-jakarta font-black text-slate-900 truncate text-sm">{p.username}</span>
                            {isMe && (
                              <span className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">Tú</span>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <span className="font-inter text-[10px] font-black flex items-center gap-1 text-slate-400">
                              <Zap size={9} className="text-indigo-500 fill-indigo-500" /> {p.points || 0}
                            </span>
                            <span className="font-inter text-[10px] font-black flex items-center gap-1 text-slate-400">
                              <Flame size={9} className="text-amber-500 fill-amber-500" /> {p.current_streak || 0}
                            </span>
                          </div>
                        </div>
                        {rank === 4 && <Crown size={14} className="text-slate-300 flex-shrink-0" />}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </section>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}
