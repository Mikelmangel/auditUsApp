"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNav, Avatar, Button, Card, SectionTitle, LoadingScreen } from "@/components/ui";
import { Flame, Zap, Trophy, LogOut, ChevronRight, Camera, Shield, Heart, Star, Loader2 } from "lucide-react";
import { profileService, type Profile, type Badge } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RARITY_BADGE: Record<string, { cls: string; label: string }> = {
  common: { cls: "badge-gray", label: "Común" },
  rare: { cls: "badge-blue", label: "Raro" },
  epic: { cls: "badge-purple", label: "Épico" },
  legendary: { cls: "badge-amber", label: "Legendario" },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
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
    <div className="min-h-svh bg-[#f3ede2] relative overflow-x-hidden">
      {/* Header with Arc */}
      <header className="arc-header px-6 pb-20 text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="w-10 h-10" /> {/* Spacer */}
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            Perfil
          </h1>
          <button
            onClick={() => setEditing(e => !e)}
            className={cn(
              "bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/20 transition-all",
              editing ? "bg-red-500/20 border-red-500/30 text-red-200" : "hover:bg-white/20"
            )}
          >
            {editing ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center">
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
                size={100}
                className="ring-4 ring-white shadow-2xl"
              />
            </motion.div>
            {editing && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#f36b2d] rounded-full flex items-center justify-center border-4 border-[#14726e] z-20 shadow-lg cursor-pointer"
                aria-label="Cambiar foto"
              >
                <Camera size={16} className="text-white" />
              </motion.button>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">
              {profile?.username}
            </h2>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none">
              {profile?.bio || "Sin biografía"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-5 pb-32 relative z-10 flex flex-col gap-6 max-w-[430px] mx-auto -mt-10">

        {/* Profile Card / Edit Form */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
          {editing ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Seudónimo</label>
                <input
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-black text-gray-900 tracking-tight focus:outline-none focus:border-[#14726e] transition-all"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="CÓMO TE LLAMAS"
                  maxLength={20}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Biografía</label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-800 resize-none min-h-[100px] focus:outline-none focus:border-[#14726e] transition-all"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti..."
                  maxLength={120}
                />
              </div>
              <button onClick={save} disabled={saving} className="btn-primary mt-2">
                {saving ? <Loader2 className="animate-spin" size={20} /> : "Actualizar perfil"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Flame size={20} className="text-[#f36b2d]" />
                </div>
                <span className="text-lg font-black text-gray-900 leading-none mt-1">{profile?.current_streak || 0}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Racha</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-[#14726e]/10 flex items-center justify-center">
                  <Zap size={20} className="text-[#14726e]" />
                </div>
                <span className="text-lg font-black text-gray-900 leading-none mt-1">{profile?.points || 0}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Puntos</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
                  <Trophy size={20} className="text-yellow-500" />
                </div>
                <span className="text-lg font-black text-gray-900 leading-none mt-1">{badges.length}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Logros</span>
              </div>
            </div>
          )}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div>
            <SectionTitle>Reconocimientos</SectionTitle>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {badges.map((b, i) => {
                const rarity = RARITY_BADGE[b.rarity] || RARITY_BADGE.common;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-[24px] p-4 flex items-center gap-3 border border-black/5 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Star size={18} className="text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-800 uppercase leading-tight truncate mb-0.5">
                        {b.name}
                      </p>
                      <span className={cn("text-[9px] font-black uppercase tracking-wider", rarity.cls.replace('badge-', 'text-'))}>
                        {rarity.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* System Settings */}
        <div className="flex flex-col gap-3">
          <SectionTitle>Ajustes</SectionTitle>
          <div className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm divide-y divide-gray-50">
            <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                  <Heart size={18} />
                </div>
                <span className="text-sm font-black text-gray-700">Contribuir al proyecto</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>

            <button
              onClick={signOut}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-red-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-black text-red-600">Cerrar sesión</span>
              </div>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          </div>
        </div>

        <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em] pt-4">
          v1.0.2 • AuditUs Premium
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
