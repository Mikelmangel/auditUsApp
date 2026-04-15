"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, Button, Card, SectionTitle } from "@/components/ui";
import { Settings, Flame, Zap, Trophy, LogOut, ChevronRight, Loader2, Camera, Shield, Heart } from "lucide-react";
import { profileService, type Profile, type Badge } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      setProfile(p); setBadges(b);
      setUsername(p?.username || ""); setBio(p?.bio || "");
      setLoading(false);
    });
  }, [user]);

  const save = async () => {
    if (!user || !username.trim()) return;
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(user.id, { username: username.trim(), bio: bio.trim() });
      setProfile(updated); setEditing(false);
      toast.success("Perfil actualizado");
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center bg-black">
      <Loader2 size={40} className="animate-spin text-emerald-500 opacity-50" />
    </div>
  );

  const rarityColors: Record<string, string> = {
    common: "rgba(255,255,255,0.4)", rare: "#3b82f6", epic: "#a855f7", legendary: "#f59e0b",
  };

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh opacity-50" />

      {/* Header */}
      <header className="px-6 pt-14 pb-8 flex items-center justify-between relative z-10">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Perfil</h1>
        <Button variant="ghost" onClick={() => setEditing(e => !e)} className="text-[10px] tracking-[0.2em] font-black uppercase">
          {editing ? "CANCELAR" : "GESTIONAR"}
        </Button>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-6">
        {/* Profile Info Card */}
        <Card className="p-8">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
                <Avatar src={profile?.avatar_url} name={profile?.username} size={100} className="border-4 border-emerald-500/20 shadow-2xl" />
              </motion.div>
              {editing && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-black z-20 shadow-lg cursor-pointer"
                >
                  <Camera size={14} className="text-black" />
                </motion.div>
              )}
              {/* Decorative radial glow */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full opacity-50 mix-blend-screen" />
            </div>

            <div className="text-center w-full">
              {editing ? (
                <div className="flex flex-col gap-4 mt-2">
                  <input className="input text-center uppercase tracking-widest font-black" value={username}
                    onChange={(e) => setUsername(e.target.value)} placeholder="NOMBRE" maxLength={20} />
                  <textarea className="input text-center text-sm min-h-[80px] py-4" value={bio}
                    onChange={(e) => setBio(e.target.value)} placeholder="BIOGRAFÍA..." maxLength={100} />
                  <Button onClick={save} disabled={saving} variant="primary" className="mt-2">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : "ACTUALIZAR DATOS"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{profile?.username}</h2>
                  <p className="text-white/40 text-sm font-medium">{profile?.bio || user?.email}</p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-1.5 ring-1 ring-emerald-500/20">
                      <Shield size={10} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Miembro Verificado</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
            {[
              { icon: <Flame size={20} className="text-orange-500" />, value: profile?.current_streak || 0, label: "RACHA" },
              { icon: <Zap size={20} className="text-emerald-500" />, value: profile?.points || 0, label: "PUNTOS" },
              { icon: <Trophy size={20} className="text-yellow-500" />, value: badges.length, label: "LOGROS" },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="mb-1 opacity-80">{icon}</div>
                <p className="font-black text-2xl text-white">{value}</p>
                <p className="text-[8px] font-black text-white/20 tracking-[0.2em]">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges Section */}
        {badges.length > 0 && (
          <div className="space-y-4">
            <SectionTitle>Reconocimientos</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b.id} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                  <div className="text-xl opacity-80">{b.icon_url || "🏅"}</div>
                  <div>
                    <p className="text-[10px] font-black text-white/80 uppercase leading-none mb-1">{b.name}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: rarityColors[b.rarity] }}>
                      {b.rarity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utils */}
        <div className="space-y-4">
          <SectionTitle>Sistema</SectionTitle>
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
            <button className="w-full px-6 py-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                  <Heart size={18} />
                </div>
                <span className="font-bold text-white/60 text-sm">Contribuir al Proyecto</span>
              </div>
              <ChevronRight size={18} className="text-white/10" />
            </button>
            <button onClick={signOut} className="w-full px-6 py-5 flex items-center justify-between group hover:bg-red-500/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500/40 group-hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </div>
                <span className="font-bold text-red-500/60 text-sm group-hover:text-red-500">Cerrar Sesión</span>
              </div>
              <ChevronRight size={18} className="text-white/10" />
            </button>
          </div>
        </div>

        <p className="text-center text-[8px] font-black text-white/10 uppercase tracking-[0.4em] mt-4">
          Sesión expirada • 2026 AUDITUS CORE
        </p>
      </div>
      
      <BottomNav />
    </div>
  );
}
