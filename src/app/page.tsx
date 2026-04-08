"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNav, Avatar, EmptyState } from "@/components/ui";
import { Users, Plus, ChevronRight, Bell, Zap, Flame, Loader2 } from "lucide-react";
import { groupService, profileService, pollService, type Group, type Profile } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

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
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100svh" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#10b981" }} />
    </div>;
  }

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100svh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{
        padding: "56px 16px 16px", background: "white",
        borderBottom: "1px solid #f3f4f6", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 2 }}>
            Hola, {profile?.username || "amigo"} ��
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Tus Grupos</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/profile">
            <Avatar src={profile?.avatar_url} name={profile?.username} size={44} />
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      {profile && (
        <div style={{
          display: "flex", background: "white", borderBottom: "1px solid #f3f4f6",
          padding: "12px 16px", gap: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={16} style={{ color: "#f97316" }} />
            <span style={{ fontWeight: 700, color: "#111827" }}>{profile.current_streak || 0}</span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>racha</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={16} style={{ color: "#10b981" }} />
            <span style={{ fontWeight: 700, color: "#111827" }}>{profile.points || 0}</span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>puntos</span>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "16px 16px 96px" }}>
        {groups.length === 0 ? (
          <div style={{ marginTop: 40 }}>
            <EmptyState
              icon={Users}
              title="Aún no tienes grupos"
              message="Crea un grupo o únete con un código de invitación"
              action={
                <Link href="/groups/new">
                  <button className="btn-primary" style={{ marginTop: 8 }}>
                    <Plus size={18} /> Crear mi primer grupo
                  </button>
                </Link>
              }
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* New group CTA */}
            <Link href="/groups/new" style={{ textDecoration: "none" }}>
              <motion.div whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "#ecfdf5", border: "1.5px dashed #10b981",
                  borderRadius: 20, padding: "14px 16px", cursor: "pointer",
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "#10b981",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Plus size={22} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#059669" }}>Crear o unirse a un grupo</p>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>Añade amigos con un código</p>
                </div>
              </motion.div>
            </Link>

            {/* Group list */}
            {groups.map((group, i) => (
              <Link key={group.id} href={`/groups/${group.id}`} style={{ textDecoration: "none" }}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "white", borderRadius: 20, padding: "14px 16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6",
                    cursor: "pointer",
                  }}>
                  {/* Emoji avatar */}
                  <div style={{
                    width: 50, height: 50, borderRadius: "50%",
                    background: "#f3f4f6", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0,
                  }}>
                    {group.avatar_emoji || "🔮"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontWeight: 700, color: "#111827", fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {group.name}
                      </p>
                      {activePollsByGroup[group.id] && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                          <div className="live-dot" />
                          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>ACTIVA</span>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#9ca3af" }}>
                      {group.member_count || 0} miembros · {group.invite_code}
                    </p>
                  </div>
                  <ChevronRight size={18} color="#d1d5db" />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
