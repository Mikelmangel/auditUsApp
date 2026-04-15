"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, EmptyState, SectionTitle, Card } from "@/components/ui";
import { Users, Plus, ChevronRight, Bell, Zap, Flame, Loader2, Sparkles } from "lucide-react";
import { groupService, profileService, pollService, type Group, type Profile } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activePollsByGroup, setActivePollsByGroup] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

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

  if (authLoading || loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-black">
        <Loader2 size={40} className="animate-spin text-emerald-500 opacity-50" />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      {/* Background Mesh */}
      <div className="bg-mesh" />

      {/* Header */}
      <header className="px-6 pt-14 pb-8 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mb-1">
              SISTEMA ACTIVO
            </p>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              AuditUs
            </h1>
          </motion.div>
          <Link href="/profile">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar src={profile?.avatar_url} name={profile?.username} size={52} className="border-2 border-emerald-500/20" />
            </motion.div>
          </Link>
        </div>
      </header>

      {/* Stats Strip */}
      <AnimatePresence>
        {profile && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 mb-8"
          >
            <div className="flex bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-4 justify-around shadow-2xl">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-xl font-black text-white">{profile.current_streak || 0}</span>
                </div>
                <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">RACHA</span>
              </div>
              <div className="h-8 w-px bg-white/5 self-center" />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-emerald-500" />
                  <span className="text-xl font-black text-white">{profile.points || 0}</span>
                </div>
                <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">PUNTOS</span>
              </div>
              <div className="h-8 w-px bg-white/5 self-center" />
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-500" />
                  <span className="text-xl font-black text-white">{groups.length}</span>
                </div>
                <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">GRUPOS</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <main className="px-6 pb-32 relative z-10 max-w-[430px] mx-auto">
        <SectionTitle>Tus Conexiones</SectionTitle>

        {groups.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
            <EmptyState
              icon={Users}
              title="SOLITARIO EN EL SISTEMA"
              message="No tienes grupos activos. Crea uno o usa un código de acceso para comenzar el audit."
              action={
                <Link href="/groups/new" className="w-full">
                  <button className="btn-primary">
                    <Plus size={20} className="mr-2" /> CREAR GRUPO
                  </button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {/* New group CTA */}
            <Link href="/groups/new">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 rounded-3xl p-6 flex items-center gap-5 group transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Plus size={24} className="text-black font-bold" />
                </div>
                <div>
                  <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest">NUEVA CONEXIÓN</h3>
                  <p className="text-emerald-500/50 text-xs font-bold uppercase tracking-tight">Expandir red de AuditUs</p>
                </div>
              </motion.div>
            </Link>

            {/* List */}
            {groups.map((group, i) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex items-center gap-5 hover:bg-white/[0.08] transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 shadow-inner">
                    {group.avatar_emoji || "🔮"}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-base truncate uppercase tracking-tight">
                        {group.name}
                      </h3>
                      {activePollsByGroup[group.id] && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 rounded-full">
                          <div className="live-dot" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">LIVE</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                      <span>{group.member_count || 0} MIEMBROS</span>
                      <span className="w-1 h-1 bg-white/10 rounded-full" />
                      <span className="text-emerald-500/40">{group.invite_code}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/10 group-hover:text-emerald-500 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
