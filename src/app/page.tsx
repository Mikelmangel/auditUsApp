"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, EmptyState, SectionTitle, LoadingScreen } from "@/components/ui";
import { Users, Plus, ChevronRight, Flame, Zap, Sparkles } from "lucide-react";
import { groupService, profileService, pollService, type Group, type Profile } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [groups,            setGroups]           = useState<Group[]>([]);
  const [profile,           setProfile]          = useState<Profile | null>(null);
  const [activePollsByGroup, setActivePollsByGroup] = useState<Record<string, boolean>>({});
  const [loading,           setLoading]          = useState(true);

  useEffect(() => {
    if (!user) { if (!authLoading) setLoading(false); return; }
    Promise.all([
      groupService.getMyGroups(user.id),
      profileService.getProfile(user.id),
    ]).then(async ([g, p]) => {
      setGroups(g as Group[]);
      setProfile(p);
      const pollMap: Record<string, boolean> = {};
      await Promise.all((g as Group[]).map(async (group) => {
        if (group?.id) {
          const poll = await pollService.getActivePoll(group.id);
          pollMap[group.id] = !!poll;
        }
      }));
      setActivePollsByGroup(pollMap);
      setLoading(false);
    });
  }, [user, authLoading]);

  if (authLoading || loading) return <LoadingScreen />;

  return (
    <div className="min-h-svh flex flex-col pt-[env(safe-area-inset-top,0px)]">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">
              Sistema Operativo
            </p>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            AuditUs
          </h1>
        </motion.div>

        <Link href="/profile">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.username}
              size={52}
              className="ring-2 ring-emerald-500/20"
            />
          </motion.div>
        </Link>
      </header>

      {/* Stats Strip */}
      <AnimatePresence>
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="px-6 mb-10"
          >
            <div className="flex bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-[24px] p-5 justify-around shadow-xl shadow-black/40">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={16} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]" />
                  <span className="text-xl font-black text-white">{profile.current_streak || 0}</span>
                </div>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Racha</span>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                  <span className="text-xl font-black text-white">{profile.points || 0}</span>
                </div>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Puntos</span>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.4)]" />
                  <span className="text-xl font-black text-white">{groups.length}</span>
                </div>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Grupos</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <main className="px-6 pb-40 flex-1 max-w-[430px] mx-auto w-full">
        <div className="flex items-center justify-between mb-6 px-1">
          <SectionTitle>Tus Conexiones</SectionTitle>
          <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest">
            {groups.length} ACTIVOS
          </span>
        </div>

        {groups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Sin conexiones aún"
            message="No tienes grupos activos. Crea uno o usa un código de acceso para comenzar."
            action={
              <Link href="/groups/new" className="w-full">
                <button className="btn-primary">
                  <Plus size={20} /> CREAR GRUPO
                </button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {/* New group CTA with kinetic hover */}
            <Link href="/groups/new">
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-dashed border-emerald-500/20 rounded-[30px] p-6 flex items-center gap-5 bg-emerald-500/[0.04] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-[20px] bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 flex-shrink-0">
                  <Plus size={24} className="text-black" />
                </div>
                <div>
                  <p className="text-emerald-500 font-black text-sm uppercase tracking-[0.15em] leading-none mb-1.5">
                    Nueva Conexión
                  </p>
                  <p className="text-emerald-500/40 text-[10px] font-black uppercase tracking-widest">
                    Expandir Red AuditUs
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Staggered Groups List */}
            <div className="flex flex-col gap-3">
              {groups.map((group, i) => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="card p-5 flex items-center gap-5"
                  >
                    {/* Emoji icon container */}
                    <div className="w-16 h-16 rounded-[22px] bg-white/[0.03] flex items-center justify-center text-4xl border border-white/[0.06] flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                      {group.avatar_emoji || "🔮"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-white font-black text-lg truncate uppercase tracking-tighter leading-none">
                          {group.name}
                        </h2>
                        {activePollsByGroup[group.id] && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                          <Users size={12} className="text-white/20" />
                          <span>{group.member_count || 0}</span>
                        </div>
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <span className="text-emerald-500/40 font-mono text-[11px] font-black tracking-widest">{group.invite_code}</span>
                      </div>
                    </div>

                    <ChevronRight size={20} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
