"use client";

import { Avatar, BottomNav, Button, LoadingScreen, SectionTitle, StatBadge } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { useAuth } from "@/hooks/useAuth";
import { profileService, type Badge, type Profile } from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Camera, ChevronRight, Flame, Heart, LogOut, Star, Trophy, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RARITY_BADGE: Record<string, { cls: string; label: string }> = {
  common: { cls: "text-slate-400", label: "Común" },
  rare: { cls: "text-indigo-500", label: "Raro" },
  epic: { cls: "text-purple-500", label: "Épico" },
  legendary: { cls: "text-amber-500", label: "Legendario" },
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
    <MobileLayout
      header={
        <header className="px-6 pt-12 pb-8 text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="w-10 h-10" /> {/* Spacer */}
            <h1 className="font-jakarta text-22 font-black text-slate-900 uppercase tracking-tight">
              Perfil
            </h1>
            <button
              onClick={() => setEditing(e => !e)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                editing ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white border-slate-100 text-slate-500 shadow-sm"
              )}
            >
              {editing ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.username}
                  size={110}
                  className="ring-8 ring-white shadow-2xl"
                />
              </motion.div>
              {editing && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white z-20 shadow-lg cursor-pointer"
                  aria-label="Cambiar foto"
                >
                  <Camera size={16} className="text-white" />
                </motion.button>
              )}
            </div>

            <div className="mt-6">
              <h2 className="font-jakarta text-3xl font-black text-slate-900 leading-none tracking-tight mb-2">
                {profile?.username}
              </h2>
              <div className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                <p className="font-inter text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">
                  {profile?.bio || "Auditando sin biografía"}
                </p>
              </div>
            </div>
          </div>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-5 pb-12 relative z-10 flex flex-col gap-8 max-w-[430px] mx-auto">

        {/* Profile Card / Edit Form */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100/50">
          {editing ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seudónimo</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-900 tracking-tight focus:outline-none focus:border-indigo-500 transition-all"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="CÓMO TE LLAMAS"
                  maxLength={20}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Biografía</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 resize-none min-h-[100px] focus:outline-none focus:border-indigo-500 transition-all font-inter"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti..."
                  maxLength={120}
                />
              </div>
              <Button onClick={save} loading={saving} className="h-14">
                Confirmar Cambios
              </Button>
            </div>
          ) : (
            <div className="flex justify-around items-center py-2">
              <StatBadge 
                icon={<Flame size={20} className="text-amber-500 fill-amber-500" />} 
                value={profile?.current_streak || 0} 
                label="Racha" 
              />
              <StatBadge 
                icon={<Zap size={20} className="text-indigo-500 fill-indigo-500" />} 
                value={profile?.points || 0} 
                label="Puntos" 
                accent 
              />
              <StatBadge 
                icon={<Trophy size={20} className="text-indigo-400" />} 
                value={badges.length} 
                label="Logros" 
              />
            </div>
          )}
        </div>

        {/* Badges Section */}
        {badges.length > 0 && (
          <div>
            <SectionTitle>Reconocimientos</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((b, i) => {
                const rarity = RARITY_BADGE[b.rarity] || RARITY_BADGE.common;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-[28px] p-5 flex flex-col gap-3 border border-slate-100 shadow-sm relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50/30 rounded-bl-[20px] -mr-2 -mt-2 group-hover:bg-indigo-50/50 transition-colors" />
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                      <Star size={18} className="text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-jakarta text-[11px] font-black text-slate-800 uppercase leading-none truncate mb-1.5">
                        {b.name}
                      </p>
                      <span className={cn("font-inter text-[9px] font-black uppercase tracking-wider", rarity.cls)}>
                        {rarity.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* System Settings Section */}
        <div className="flex flex-col gap-4">
          <SectionTitle>Ajustes de Sistema</SectionTitle>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
            <button className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all group active:scale-[0.99]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50">
                  <Heart size={18} />
                </div>
                <span className="font-jakarta text-sm font-black text-slate-700">Contribuir al proyecto</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={signOut}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-rose-50/30 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200/50 group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors">
                  <LogOut size={18} />
                </div>
                <span className="font-jakarta text-sm font-black text-slate-700 group-hover:text-rose-600 transition-colors">Cerrar sesión</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="h-px w-12 bg-slate-200" />
          <p className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
            v1.2 // AuditUs Premium
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
