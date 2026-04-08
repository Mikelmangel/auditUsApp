"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar } from "@/components/ui";
import { ChevronLeft, Copy, Check, Crown, Flame, Zap, Plus, Share2, LogOut, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { groupService, pollService, questionService, type Group, type GroupMember, type Poll } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<"polls" | "members" | "ranking">("polls");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const [g, m, p] = await Promise.all([
        groupService.getGroup(id),
        groupService.getGroupMembers(id),
        groupService.getGroupPolls(id),
      ]);
      setGroup(g); setMembers(m as GroupMember[]); setPolls(p);
      setLoading(false);
    };
    load();
  }, [params]);

  const copyCode = async () => {
    if (!group) return;
    await navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    toast.success(`Código ${group.invite_code} copiado`);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (!group) return;
    const text = `Únete a ${group.name} en AuditUs! Código: ${group.invite_code}`;
    if (navigator.share) { await navigator.share({ text }); }
    else { await navigator.clipboard.writeText(text); toast.success("Copiado al portapapeles"); }
  };

  const createPoll = async () => {
    if (!group || !user) return;
    setCreating(true);
    try {
      const q = await questionService.getRandomQuestion(group.id, members.length);
      if (!q) { toast.error("No hay preguntas disponibles — ¡ya las respondisteis todas!"); return; }
      const shuffled = [...members].sort(() => Math.random() - 0.5);
      const rendered = questionService.renderQuestion(q.text, {
        groupName: group.name,
        memberA: shuffled[0]?.profiles?.username,
        memberB: shuffled[1]?.profiles?.username,
        memberCount: members.length,
      });
      const poll = await pollService.createPoll(group.id, rendered, user.id, q.poll_type);
      await supabase.from("group_poll_history").insert([{ group_id: group.id, question_id: q.id }]);
      toast.success("¡Encuesta lanzada!");
      router.push(`/poll/${poll.id}`);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally { setCreating(false); }
  };

  const leave = async () => {
    if (!group || !user || !confirm("¿Abandonar el grupo?")) return;
    await groupService.leaveGroup(group.id, user.id);
    toast.success("Has salido del grupo");
    router.push("/");
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100svh" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#10b981" }} />
    </div>
  );

  if (!group) return (
    <div style={{ padding: "60px 16px", textAlign: "center" }}>
      <p style={{ color: "#9ca3af" }}>Grupo no encontrado</p>
      <Link href="/"><button className="btn-primary" style={{ marginTop: 24, maxWidth: 200 }}>Volver</button></Link>
    </div>
  );

  const activePoll = polls.find(p => p.is_active);
  const ranking = [...members].sort((a, b) => (b.profiles?.points || 0) - (a.profiles?.points || 0));
  const isAdmin = members.find(m => m.profile_id === user?.id)?.role === "admin";

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100svh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{
        background: "white", borderBottom: "1px solid #f3f4f6",
        padding: "56px 16px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/">
          <button className="btn-ghost" style={{ padding: 8, borderRadius: 12 }}>
            <ChevronLeft size={24} />
          </button>
        </Link>
        <span style={{ fontSize: 32 }}>{group.avatar_emoji || "🔮"}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {group.name}
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>{group.member_count || members.length} miembros</p>
        </div>
        <button onClick={share} className="btn-ghost" style={{ padding: 8, borderRadius: 12 }}>
          <Share2 size={20} />
        </button>
      </div>

      <div style={{ padding: "16px 16px 96px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Invite code card */}
        <div style={{
          background: "white", borderRadius: 20, padding: "16px",
          border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Código de invitación
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="invite-code" style={{ flex: 1, fontSize: "1.75rem", padding: "12px" }}>
              {group.invite_code}
            </div>
            <button onClick={copyCode} className="btn-secondary" style={{ width: 44, height: 44, padding: 0, borderRadius: 12, flexShrink: 0 }}>
              {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Active poll or create CTA */}
        {activePoll ? (
          <Link href={`/poll/${activePoll.id}`} style={{ textDecoration: "none" }}>
            <motion.div whileTap={{ scale: 0.98 }} style={{
              background: "#10b981", borderRadius: 20, padding: "16px",
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div className="live-dot" style={{ background: "white" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Encuesta activa
                </span>
              </div>
              <p style={{ fontWeight: 700, color: "white", fontSize: 16, lineHeight: 1.4 }}>
                {activePoll.rendered_question || activePoll.question}
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8 }}>
                Toca para votar →
              </p>
            </motion.div>
          </Link>
        ) : (
          <button onClick={createPoll} disabled={creating} className="btn-primary" style={{ padding: "16px", borderRadius: 20 }}>
            {creating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            {creating ? "Lanzando encuesta..." : "Lanzar nueva encuesta"}
          </button>
        )}

        {/* Tabs */}
        <div className="pill-tabs" style={{ marginTop: 4 }}>
          {([["polls","Encuestas"], ["members","Miembros"], ["ranking","Ranking"]] as const).map(([key, label]) => (
            <button key={key} className={`pill-tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === "polls" && (
            <motion.div key="polls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {polls.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                  <p>Todavía no hay encuestas en este grupo</p>
                </div>
              ) : polls.map((poll) => (
                <Link key={poll.id} href={`/poll/${poll.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 8 }}>
                  <div style={{
                    background: "white", borderRadius: 16, padding: "14px 16px",
                    border: poll.is_active ? "1.5px solid #10b981" : "1px solid #f3f4f6",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    {poll.is_active && <div className="live-dot" />}
                    <p style={{ flex: 1, fontWeight: 600, color: "#111827", fontSize: 14, lineHeight: 1.4 }}>
                      {poll.rendered_question || poll.question}
                    </p>
                    <ChevronLeft size={16} color="#d1d5db" style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {tab === "members" && (
            <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {members.map((m) => (
                <div key={m.profile_id} style={{
                  background: "white", borderRadius: 16, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                  border: "1px solid #f3f4f6",
                }}>
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, color: "#111827" }}>{m.profiles?.username}</span>
                      {m.role === "admin" && <Crown size={13} color="#f59e0b" />}
                      {m.profile_id === user?.id && <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Tú</span>}
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                      <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                        <Zap size={11} color="#10b981" />{m.profiles?.points || 0} pts
                      </span>
                      <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                        <Flame size={11} color="#f97316" />{m.profiles?.current_streak || 0} racha
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "ranking" && (
            <motion.div key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ranking.map((m, i) => (
                <div key={m.profile_id} style={{
                  background: i === 0 ? "#ecfdf5" : "white",
                  border: i === 0 ? "1.5px solid #10b981" : "1px solid #f3f4f6",
                  borderRadius: 16, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: i === 0 ? "#10b981" : "#f3f4f6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14, color: i === 0 ? "white" : "#9ca3af",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={40} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, color: "#111827" }}>{m.profiles?.username}</span>
                    <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
                      <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                        <Zap size={11} color="#10b981" />{m.profiles?.points || 0} pts
                      </span>
                    </div>
                  </div>
                  {i === 0 && <Crown size={20} color="#f59e0b" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave group */}
        <button onClick={leave} className="btn-ghost" style={{
          color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "14px", marginTop: 8,
        }}>
          <LogOut size={16} /> Abandonar grupo
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
