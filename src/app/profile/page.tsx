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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { LANGUAGES } from "@/lib/constants";

const RARITY_BADGE: Record<string, { cls: string; label: string }> = {
  common:    { cls: "text-slate-400",  label: "Común" },
  rare:      { cls: "text-indigo-500", label: "Raro" },
  epic:      { cls: "text-purple-500", label: "Épico" },
  legendary: { cls: "text-amber-500",  label: "Legendario" },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [badges,   setBadges]   = useState<Badge[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [username, setUsername] = useState("");
  const [bio,      setBio]      = useState("");
  const [appLanguage, setAppLanguage] = useState("es");
  const [saving,   setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
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
      setAppLanguage(p?.app_language || "es");
      setLoading(false);
    });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Máximo 2 MB"); return; }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const cacheBusted = `${publicUrl}?t=${Date.now()}`;

      const updated = await profileService.updateProfile(user.id, { avatar_url: cacheBusted });
      setProfile(updated);
      toast.success("Foto actualizada");
    } catch (e: any) {
      toast.error(e.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async () => {
    if (!user || !username.trim()) return;
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(user.id, { 
        username: username.trim(), 
        bio: bio.trim(),
        app_language: appLanguage
      });
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
        <header
          className="bg-indigo-600 px-5 rounded-b-[32px] shadow-xl shadow-indigo-900/20"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2rem)', paddingBottom: '16px' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="w-9 h-9" />
            <span className="font-inter text-[9px] font-black text-white/40 uppercase tracking-widest">Mi perfil</span>
            <button
              onClick={() => setEditing(v => !v)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border",
                editing
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/10 border-white/10 text-white/70"
              )}
            >
              {editing ? "Cancelar" : "Editar"}
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* Avatar with upload */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.username}
                  size={88}
                  className="ring-4 ring-white/20 shadow-2xl"
                />
              </motion.div>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />

              {editing && (
                <motion.button
                  type="button"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ease: [0.34, 1.56, 0.64, 1] }}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-indigo-600 z-20 shadow-lg active:scale-90 transition-transform"
                  aria-label="Cambiar foto"
                >
                  {uploading
                    ? <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    : <Camera size={14} className="text-indigo-600" />
                  }
                </motion.button>
              )}
            </div>

            <div className="text-center">
              <h2 className="font-jakarta text-2xl font-black text-white leading-none tracking-tight">
                {profile?.username}
              </h2>
              <p className="font-inter text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">
                {profile?.bio || "Sin biografía"}
              </p>
            </div>
          </div>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-5 pb-8 mt-5 relative z-10 flex flex-col gap-6 max-w-[430px] mx-auto">

        {/* Stats / Edit Form */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100/50">
          {editing ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Seudónimo</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-black text-slate-900 tracking-tight text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="CÓMO TE LLAMAS"
                  maxLength={20}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Biografía</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 resize-none min-h-[80px] focus:outline-none focus:border-indigo-500 transition-all font-inter"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti..."
                  maxLength={120}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Idioma de la app</label>
                <div className="grid grid-cols-4 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => setAppLanguage(lang.value)}
                      className={cn(
                        "py-2.5 px-1 rounded-2xl text-center text-[10px] font-black transition-all flex flex-col items-center gap-1",
                        appLanguage === lang.value
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100"
                      )}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="leading-tight">{lang.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={save} loading={saving} className="h-13 mt-2">
                Guardar cambios
              </Button>
            </div>
          ) : (
            <div className="flex justify-around items-center py-1">
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
                    className="bg-white rounded-[24px] p-4 flex flex-col gap-3 border border-slate-100 shadow-sm relative overflow-hidden"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Star size={16} className="text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-jakarta text-[11px] font-black text-slate-800 uppercase leading-none truncate mb-1">
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

        {/* System Settings */}
        <div className="flex flex-col gap-3">
          <SectionTitle>Ajustes</SectionTitle>
          <div className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
            <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-all group active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50">
                  <Heart size={16} />
                </div>
                <span className="font-jakarta text-sm font-black text-slate-700">Contribuir al proyecto</span>
              </div>
              <ChevronRight size={15} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={signOut}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-rose-50/30 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200/50 group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors">
                  <LogOut size={16} />
                </div>
                <span className="font-jakarta text-sm font-black text-slate-700 group-hover:text-rose-600 transition-colors">Cerrar sesión</span>
              </div>
              <ChevronRight size={15} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 pb-2">
          <div className="h-px w-10 bg-slate-200" />
          <p className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
            v1.2 // AuditUs
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
