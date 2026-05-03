"use client";

import { Avatar, BottomNav, Button, Card, EmptyState, LoadingScreen, SectionTitle } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { useAuth } from "@/hooks/useAuth";
import { groupService, pollService, profileService, type Group, type Profile } from "@/lib/services";
import { motion } from "framer-motion";
import { Flame, MessageSquare, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activePollsByGroup, setActivePollsByGroup] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }
    if (!user) return;
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
    <MobileLayout
      header={
        <header className="px-6 pt-12 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--stitch-primary)] flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="font-jakarta text-2xl font-black text-slate-900 leading-none tracking-tight">
                AuditUs
              </h1>
              <p className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                Dashboard Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2 border border-slate-100 shadow-sm">
              <span className="font-jakarta text-sm font-black text-slate-900">{profile?.points || 0}</span>
              <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-white shadow-inner">💎</div>
            </div>
            <Link href="/profile">
              <Avatar 
                src={profile?.avatar_url} 
                name={profile?.username} 
                size={44} 
                className="ring-2 ring-white shadow-md active:scale-95 transition-transform" 
              />
            </Link>
          </div>
        </header>
      }
      footer={<BottomNav />}
    >
      <main className="px-6 py-6 flex-1 max-w-[430px] mx-auto w-full flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <SectionTitle className="mb-0">Tus Grupos</SectionTitle>
          <div className="bg-indigo-50 text-[var(--stitch-primary)] px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider">
            {groups.length} activos
          </div>
        </div>

        {groups.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <EmptyState
              title="Sin grupos activos"
              message="Únete a un grupo o crea uno nuevo para empezar a auditar a tus amigos."
              action={
                <Link href="/groups/new" className="w-full">
                  <Button>
                    <Plus size={20} />
                    Crear primer grupo
                  </Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/groups/${group.id}`}>
                  <Card className="hover:scale-[1.02] active:scale-[0.98] transition-all border-slate-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[24px] bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shadow-inner">
                          {group.avatar_emoji || "👥"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-jakarta text-lg font-black text-slate-900 leading-tight truncate">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                              <MessageSquare size={10} className="text-slate-400" />
                              <span className="font-inter text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                {new Date(group.created_at).toLocaleDateString() === new Date().toLocaleDateString()
                                  ? "Hoy"
                                  : `Hace ${Math.floor((new Date().getTime() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24))}d`}
                              </span>
                            </div>
                            {activePollsByGroup[group.id] && (
                              <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="font-inter text-[9px] font-black text-indigo-600 uppercase">En vivo</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 bg-amber-50 rounded-[20px] px-3 py-2 border border-amber-100 shadow-sm">
                        <Flame size={14} className="text-amber-500 fill-amber-500" />
                        <span className="font-jakarta text-xs font-black text-amber-700">{profile?.current_streak || 0}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <Link href="/groups/new">
                <Button className="h-16 shadow-xl shadow-indigo-500/20">
                  <Plus size={20} className="text-white" />
                  <span>Crear nuevo grupo</span>
                </Button>
              </Link>
              
              <Link href="/groups/new" className="text-center group">
                <span className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[var(--stitch-primary)] transition-colors">
                  O unirse mediante código hexagonal
                </span>
                <div className="h-0.5 w-0 mx-auto bg-[var(--stitch-primary)] group-hover:w-20 transition-all duration-300" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </MobileLayout>
  );

}
