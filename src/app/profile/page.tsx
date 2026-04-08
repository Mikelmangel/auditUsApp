"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BottomNav, Avatar } from "@/components/ui";
import { Settings, Flame, Zap, Trophy, LogOut, ChevronRight, Loader2, Camera } from "lucide-react";
import { profileService, type Profile, type Badge } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100svh" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#10b981" }} />
    </div>
  );

  const rarityColors: Record<string, string> = {
    common: "#9ca3af", rare: "#3b82f6", epic: "#8b5cf6", legendary: "#f59e0b",
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100svh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #f3f4f6", padding: "56px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Perfil</h1>
        <button onClick={() => setEditing(e => !e)} className="btn-ghost" style={{ padding: "8px 12px", borderRadius: 12, display: "flex", gap: 6, alignItems: "center" }}>
          <Settings size={18} /><span style={{ fontSize: 14, fontWeight: 600 }}>{editing ? "Cancelar" : "Editar"}</span>
        </button>
      </div>

      <div style={{ padding: "20px 16px 96px" }}>
        {/* Profile card */}
        <div style={{ background: "white", borderRadius: 24, padding: 20, marginBottom: 16, border: "1px solid #f3f4f6", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ position: "relative" }}>
              <Avatar src={profile?.avatar_url} name={profile?.username} size={80} />
              {editing && (
                <div style={{
                  position: "absolute", bottom: 0, right: 0, width: 28, height: 28,
                  background: "#10b981", borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  border: "2.5px solid white",
                }}>
                  <Camera size={13} color="white" />
                </div>
              )}
            </div>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                <input className="input" value={username}
                  onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de usuario" maxLength={20} />
                <input className="input" value={bio}
                  onChange={(e) => setBio(e.target.value)} placeholder="Cuéntanos algo sobre ti..." maxLength={100} />
                <button onClick={save} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : "Guardar cambios"}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>{profile?.username}</h2>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>{profile?.bio || user?.email}</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, paddingTop: 16 }}>
            {[
              { icon: <Flame size={20} color="#f97316" />, value: profile?.current_streak || 0, label: "Racha" },
              { icon: <Zap size={20} color="#10b981" />, value: profile?.points || 0, label: "Puntos" },
              { icon: <Trophy size={20} color="#f59e0b" />, value: badges.length, label: "Logros" },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{ textAlign: "center", padding: "12px 4px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{icon}</div>
                <p style={{ fontWeight: 800, fontSize: 22, color: "#111827" }}>{value}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div style={{ background: "white", borderRadius: 24, padding: 20, marginBottom: 16, border: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Logros desbloqueados
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {badges.map((b) => (
                <div key={b.id} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: `${rarityColors[b.rarity] || "#9ca3af"}15`,
                  color: rarityColors[b.rarity] || "#9ca3af",
                  border: `1px solid ${rarityColors[b.rarity] || "#9ca3af"}40`,
                  borderRadius: 9999, padding: "6px 12px",
                  fontSize: 13, fontWeight: 600,
                }}>
                  {b.icon_url && <span>{b.icon_url}</span>}
                  {b.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div style={{ background: "white", borderRadius: 24, border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <button onClick={signOut} style={{
            width: "100%", padding: "16px 20px", background: "none", border: "none",
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            color: "#ef4444",
          }}>
            <LogOut size={18} />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Cerrar sesión</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
