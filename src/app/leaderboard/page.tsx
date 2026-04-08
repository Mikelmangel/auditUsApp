"use client";

import { useEffect, useState } from "react";
import { BottomNav, Avatar } from "@/components/ui";
import { motion } from "framer-motion";
import { Crown, Flame, Zap, Loader2 } from "lucide-react";
import { profileService, type Profile } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    profileService.getLeaderboard(50).then((d) => { setLeaders(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100svh" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#10b981" }} />
    </div>
  );

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const podiumHeights = [80, 110, 60];
  const podiumRanks = [2, 1, 3];

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100svh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #f3f4f6", padding: "56px 16px 16px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Clasificación</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>Los más activos de la comunidad</p>
      </div>

      <div style={{ padding: "20px 16px 96px" }}>
        {/* Podium */}
        {top3.length >= 3 && (
          <div style={{
            background: "white", borderRadius: 24, padding: "24px 16px 0",
            marginBottom: 20, border: "1px solid #f3f4f6", overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8 }}>
              {podiumOrder.map((p, i) => p && (
                <div key={p.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  {podiumRanks[i] === 1 && <Crown size={20} color="#f59e0b" />}
                  <Avatar src={p.avatar_url} name={p.username} size={podiumRanks[i] === 1 ? 56 : 44} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", textAlign: "center", maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.username}
                  </span>
                  <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>{p.points || 0} pts</span>
                  <div style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                    height: podiumHeights[i],
                    background: podiumRanks[i] === 1 ? "#10b981" : podiumRanks[i] === 2 ? "#d1d5db" : "#e5e7eb",
                    borderRadius: "12px 12px 0 0",
                  }}>
                    <span style={{ fontWeight: 900, fontSize: 28, color: "white" }}>{podiumRanks[i]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full list */}
        <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Clasificación completa
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leaders.map((p, i) => {
            const isMe = p.id === user?.id;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
                style={{
                  background: isMe ? "#ecfdf5" : "white",
                  border: isMe ? "1.5px solid #10b981" : "1px solid #f3f4f6",
                  borderRadius: 16, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                <span style={{
                  width: 28, textAlign: "center", fontWeight: 800, fontSize: 15,
                  color: i < 3 ? "#10b981" : "#9ca3af",
                }}>
                  {i + 1}
                </span>
                <Avatar src={p.avatar_url} name={p.username} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, color: "#111827" }}>{p.username}</span>
                    {isMe && <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Tú</span>}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                    <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                      <Zap size={11} color="#10b981" />{p.points || 0} pts
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                      <Flame size={11} color="#f97316" />{p.current_streak || 0} racha
                    </span>
                  </div>
                </div>
                {i === 0 && <Crown size={18} color="#f59e0b" />}
              </motion.div>
            );
          })}
          {leaders.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
              Todavía no hay participantes
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
