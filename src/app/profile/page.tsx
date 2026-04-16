"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNav, Avatar, Button, Card, SectionTitle, LoadingScreen } from "@/components/ui";
import { Flame, Zap, Trophy, LogOut, ChevronRight, Camera, Shield, Heart, Star } from "lucide-react";
import { profileService, type Profile, type Badge } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RARITY_BADGE: Record<string, { cls: string; label: string }> = {
  common:    { cls: "badge-gray",   label: "Común" },
  rare:      { cls: "badge-blue",   label: "Raro" },
  epic:      { cls: "badge-purple", label: "Épico" },
  legendary: { cls: "badge-amber",  label: "Legendario" },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [badges,   setBadges]   = useState<Badge[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [username, setUsername] = useState("");
  const [bio,      setBio]      = useState("");
  const [saving,   setSaving]   = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      profileService.getProfile(user.id),
      profileService.getBadges(user.id),
    ]).then(([p, b]) => {
      setProfile(p);
      setBadges(b);
      setUsername(p?.username || "");
      setBio(p?.bio || "");
      setLoading(false);
    });
  }, [user]);

  const save = async () => {
    if (!user || !username.trim()) return;
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(user.id, { username: username.trim(), bio: bio.trim() });
      setProfile(updated);
      setEditing(false);
      toast.success("Perfil actualizado");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh" />

      {/* Header */}
      <header
        className="px-6 pb-6 relative z-10 flex items-center justify-between"
        style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 52px)` }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black text-white italic tracking-tighter uppercase"
        >
          Perfil
        </motion.h1>
        <button
          onClick={() => setEditing(e => !e)}
          className={cn(
            "btn-ghost !text-[11px] !tracking-[0.18em] !font-black uppercase !min-h-[36px] !rounded-xl",
            editing ? "text-red-400 hover:text-red-300" : ""
          )}
        >
          {editing ? "Cancelar" : "Editar"}
        </button>
      </header>

      <div className="px-5 pb-32 relative z-10 flex flex-col gap-6 max-w-[430px] mx-auto">

        {/* Profile Card */}
        <Card className="p-7">
          <div className="flex flex-col items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative z-10"
              >
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.username}
                  size={96}
                  className="ring-4 ring-emerald-500/20 shadow-2xl"
                />
              </motion.div>
              {editing && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-black z-20 shadow-lg cursor-pointer"
                  aria-label="Cambiar foto"
                >
                  <Camera size={15} className="text-black" />
                </motion.button>
              )}
              {/* Glow */}
              <div className="absolute inset-0 bg-emerald-500/15 blur-[36px] rounded-full opacity-60 -z-10" />
            </div>

            {/* Name / Edit form */}
            <div className="text-center w-full">
              {editing ? (
                <div className="flex flex-col gap-3 mt-1 w-full">
                  <input
                    className="input text-center uppercase tracking-widest font-black"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="NOMBRE"
                    maxLength={20}
                    autoFocus
                  />
                  <textarea
                    className="input text-center text-sm min-h-[80px] py-3 resize-none"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Biografía..."
                    maxLength={120}
                  />
                  <Button onClick={save} loading={saving} variant="primary" className="mt-1">
                    Guardar Cambios
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {profile?.username}
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {profile?.bio || user?.email}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="badge badge-emerald">
                      <Shield size={9} /> Miembro Verificado
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {!editing && (
            <div className="grid grid-cols-3 gap-2 mt-7 pt-6 border-t border-white/[0.06]">
              <div className="stat-item">
                <div className="flex items-center gap-1.5">
                  <Flame size={16} className="text-orange-400" />
                  <span className="stat-value">{profile?.current_streak || 0}</span>
                </div>
                <span className="stat-label">Racha</span>
              </div>
              <div className="stat-item">
                <div className="flex items-center gap-1.5">
                  <Zap size={16} className="text-emerald-400" />
                  <span className="stat-value">{profile?.points || 0}</span>
                </div>
                <span className="stat-label">Puntos</span>
              </div>
              <div className="stat-item">
                <div className="flex items-center gap-1.5">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="stat-value">{badges.length}</span>
                </div>
                <span className="stat-label">Logros</span>
              </div>
            </div>
          )}
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <div>
            <SectionTitle>Reconocimientos</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b, i) => {
                const rarity = RARITY_BADGE[b.rarity] || RARITY_BADGE.common;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="card p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <Star size={18} className="text-yellow-400/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-white/80 uppercase leading-tight truncate mb-1">
                        {b.name}
                      </p>
                      <span className={cn("badge", rarity.cls)}>
                        {rarity.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* System */}
        <div>
          <SectionTitle>Sistema</SectionTitle>
          <div className="card overflow-hidden divide-y divide-white/[0.04]" style={{ padding: 0 }}>
            <button className="w-full px-5 py-4 flex items-center justify-between group hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Heart size={17} className="text-white/20 group-hover:text-rose-400 transition-colors" />
                </div>
                <span className="font-semibold text-white/50 text-sm group-hover:text-white/80 transition-colors">
                  Contribuir al Proyecto
                </span>
              </div>
              <ChevronRight size={16} className="text-white/15" />
            </button>

            <button
              onClick={signOut}
              className="w-full px-5 py-4 flex items-center justify-between group hover:bg-red-500/[0.07] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <LogOut size={17} className="text-red-500/40 group-hover:text-red-400 transition-colors" />
                </div>
                <span className="font-semibold text-red-500/50 text-sm group-hover:text-red-400 transition-colors">
                  Cerrar Sesión
                </span>
              </div>
              <ChevronRight size={16} className="text-white/15" />
            </button>
          </div>
        </div>

        <p className="text-center text-[9px] font-black text-white/10 uppercase tracking-[0.35em] py-2">
          2026 • AuditUs Core
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
