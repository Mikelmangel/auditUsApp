"use client";

import { BottomNav, EmptyState, LoadingScreen, SectionTitle } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { groupService, pollService, profileService, type Group, type Profile } from "@/lib/services";
import { motion } from "framer-motion";
import { Flame, MessageSquare, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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


  if (authLoading || loading) return <LoadingScreen />;

  return (
    <div className="min-h-svh flex flex-col bg-[#f3ede2]">
      {/* Header with Arc */}
      <header className="arc-header px-6 pb-12 flex items-center justify-between shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter lowercase">
            auditus
          </h1>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0e3e3b] rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 shadow-inner">
            <span className="text-white font-black text-sm">{profile?.points || 0}</span>
            <div className="w-4 h-4 rounded-full border-2 border-orange-400" />
          </div>
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60">
              <Settings size={20} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-8 relative z-10 flex-1 max-w-[430px] mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center gap-2 px-1">
          <SectionTitle>Tus grupos</SectionTitle>
        </div>
        {groups.length === 0 ? (
          <EmptyState
            title="Sin grupos"
            message="No tienes grupos activos aún."
            action={
              <Link href="/groups/new" className="w-full">
                <button className="btn-primary">
                  + Crear grupo
                </button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {groups.map((group, i) => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[32px] p-4 flex items-center justify-between shadow-sm border border-black/5"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar Group Placeholder */}
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400 overflow-hidden">
                            {group.avatar_emoji || "👥"}
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                          <MessageSquare size={12} strokeWidth={3} />
                          <span>
                            {new Date(group.created_at).toLocaleDateString() === new Date().toLocaleDateString()
                              ? "Hoy"
                              : `Hace ${Math.floor((new Date().getTime() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24))}d`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-gray-600">{profile?.current_streak || 0}</span>
                      <Flame size={12} className="text-orange-500 fill-orange-500" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <Link href="/groups/new">
              <div className="border-2 border-dashed border-[#14726e]/20 rounded-[32px] p-6 text-center bg-transparent group active:bg-[#14726e]/5 transition-colors">
                <p className="text-[#14726e]/80 font-black text-sm uppercase tracking-wider mb-1">
                  Creadores 🎬
                </p>
                <p className="text-[#14726e]/40 text-[10px] font-bold">
                  Sugerencia
                </p>
              </div>
            </Link>

            <Link href="/groups/new">
              <button className="btn-primary flex items-center justify-center gap-2">
                <Plus size={20} strokeWidth={3} />
                <span>Crear grupo</span>
              </button>
            </Link>

            <p className="text-center text-[11px] font-bold text-[#14726e]/60">
              o <Link href="/groups/new" className="underline underline-offset-4 decoration-[#14726e]/30">Unirse a un grupo</Link>
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
