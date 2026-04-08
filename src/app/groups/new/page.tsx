"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/ui";
import { ChevronLeft, Hash, Plus, Link as LinkIcon, Loader2, Users } from "lucide-react";
import { groupService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const EMOJIS = ["🔮","🌊","🎯","🔥","⚡","🌙","🎭","🦋","🌺","🏆","💎","🎪","🚀","🎸","🌈"];

export default function NewGroupPage() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🔮");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setLoading(true);
    try {
      const group = await groupService.createGroup(name.trim(), user.id, description.trim() || undefined, emoji);
      toast.success(`¡${group.name} creado! Código: ${group.invite_code}`);
      router.push(`/groups/${group.id}`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || code.length < 6) return;
    setLoading(true);
    try {
      const group = await groupService.joinGroup(code, user.id);
      toast.success(`¡Te has unido a ${group.name}!`);
      router.push(`/groups/${group.id}`);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100svh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{
        background: "white", borderBottom: "1px solid #f3f4f6",
        padding: "56px 16px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/">
          <button className="btn-ghost" style={{ padding: 8, borderRadius: 12 }}>
            <ChevronLeft size={24} />
          </button>
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Grupos</h1>
      </div>

      <div style={{ padding: "16px 16px 96px" }}>
        {/* Tabs */}
        <div className="pill-tabs" style={{ marginBottom: 20 }}>
          <button className={`pill-tab ${mode === "create" ? "active" : ""}`} onClick={() => setMode("create")}>
            <Plus size={14} style={{ display: "inline", marginRight: 4 }} />Crear grupo
          </button>
          <button className={`pill-tab ${mode === "join" ? "active" : ""}`} onClick={() => setMode("join")}>
            <LinkIcon size={14} style={{ display: "inline", marginRight: 4 }} />Unirse con código
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "create" ? (
            <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <form onSubmit={create} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Emoji picker */}
                <div style={{ background: "white", borderRadius: 20, padding: 16, border: "1px solid #f3f4f6" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                    Elige un emoji
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                    {EMOJIS.map((e) => (
                      <motion.button key={e} type="button" whileTap={{ scale: 0.9 }}
                        onClick={() => setEmoji(e)}
                        style={{
                          height: 52, borderRadius: 14, fontSize: 24, border: "2px solid",
                          borderColor: emoji === e ? "#10b981" : "#f3f4f6",
                          background: emoji === e ? "#ecfdf5" : "#f9fafb",
                          cursor: "pointer", transition: "all 0.15s",
                        }}>
                        {e}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                    Nombre del grupo *
                  </label>
                  <input className="input" type="text" placeholder="Los Insomnes, Dream Team..."
                    value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                    Descripción (opcional)
                  </label>
                  <input className="input" type="text" placeholder="¿De qué va este grupo?"
                    value={description} onChange={(e) => setDescription(e.target.value)} maxLength={100} />
                </div>

                <button type="submit" className="btn-primary" disabled={loading || !name.trim()}>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <><Plus size={20} />Crear grupo</>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="join" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1px solid #f3f4f6", marginBottom: 20 }}>
                <div style={{ textAlign: "center", paddingBottom: 20 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", background: "#ecfdf5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                  }}>
                    <Users size={28} color="#10b981" />
                  </div>
                  <h2 style={{ fontSize: 20 }}>Unirse a un grupo</h2>
                  <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>
                    Introduce el código de 6 letras que te compartió el administrador
                  </p>
                </div>
                <form onSubmit={join} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ position: "relative" }}>
                    <Hash size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                    <input
                      className="input"
                      type="text" placeholder="CÓDIGO"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6))}
                      maxLength={6} required
                      style={{
                        paddingLeft: 42, textAlign: "center",
                        fontSize: 24, fontWeight: 900, letterSpacing: "0.4em",
                        textTransform: "uppercase",
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading || code.length < 6}>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : "Unirse al grupo"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
