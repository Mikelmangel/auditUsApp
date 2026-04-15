"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar } from "@/components/ui";
import { ChevronLeft, Copy, Check, Crown, Flame, Zap, Plus, Share2, LogOut, Loader2, Users, ShieldCheck, UserMinus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { groupService, pollService, questionService, summaryService, survivalService, type Group, type GroupMember, type Poll } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { gemini } from "@/lib/gemini";
import ReactMarkdown from 'react-markdown';

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [predictionText, setPredictionText] = useState("");
  const [tab, setTab] = useState<"polls" | "members" | "ranking" | "audit" | "survival">("polls");
  const [summaries, setSummaries] = useState<any[]>([]);
  const [pollCount, setPollCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [survivalGame, setSurvivalGame] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const [g, m, p, count, s, sg] = await Promise.all([
        groupService.getGroup(id),
        groupService.getGroupMembers(id),
        groupService.getGroupPolls(id),
        pollService.getTodaysPollCount(id),
        summaryService.getSummaries(id),
        survivalService.getActiveGame(id).catch(() => null),
      ]);
      setGroup(g); setMembers(m as GroupMember[]); setPolls(p);
      setPollCount(count); setSummaries(s); setSurvivalGame(sg);
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
      setPollCount(prev => prev + 1);
      toast.success("¡Encuesta lanzada!");
      router.push(`/poll/${poll.id}`);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally { setCreating(false); }
  };

  const createPrediction = async () => {
    if (!group || !user || !predictionText.trim()) return;
    setCreating(true);
    try {
      const poll = await pollService.createPoll(group.id, predictionText.trim(), user.id, "prediction");
      setPollCount(prev => prev + 1);
      toast.success("¡Predicción lanzada!");
      setShowPredictionForm(false);
      setPredictionText("");
      router.push(`/poll/${poll.id}`);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally { setCreating(false); }
  };

  const generateAudit = async () => {
    if (!group) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/groups/${group.id}/audit`, {
        method: "POST",
        body: JSON.stringify({ groupName: group.name }),
      });
      if (!res.ok) throw new Error("Error al generar la auditoría");
      const newSummary = await res.json();
      setSummaries(prev => [newSummary, ...prev]);
      toast.success("¡Auditoría generada con éxito!");
    } catch (e: any) {
      toast.error(e.message || "Error al generar la auditoría");
    } finally { setGenerating(false); }
  };

  const startSurvival = async () => {
    if (!group || !isAdmin) return;
    if (!confirm("¿Empezar un Battle Royale? Esto invitará a todos los miembros actuales.")) return;
    try {
      const g = await survivalService.startSurvivalGame(group.id, members.map(m => m.profile_id));
      setSurvivalGame({ ...g, participants: members.map(m => ({ profile_id: m.profile_id, is_eliminated: false }))});
      toast.success("¡Que comiencen los juegos del hambre!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const leave = async () => {
    if (!group || !user || !confirm("¿Abandonar el grupo?")) return;
    await groupService.leaveGroup(group.id, user.id);
    toast.success("Has salido del grupo");
    router.push("/");
  };

  const handleKick = async (targetUserId: string, username: string) => {
    if (!group || !confirm(`¿Estás seguro de que quieres expulsar a ${username}? No podrá volver a entrar.`)) return;
    try {
      await groupService.kickMember(group.id, targetUserId);
      setMembers(prev => prev.filter(m => m.profile_id !== targetUserId));
      toast.success(`${username} ha sido expulsado.`);
    } catch (e: any) {
      toast.error("No se pudo expulsar al miembro");
    }
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

  const activePolls = polls.filter(p => p.is_active && (!p.expires_at || new Date(p.expires_at) > new Date()));
  const ranking = [...members].sort((a, b) => (b.profiles?.points || 0) - (a.profiles?.points || 0));
  const currentUserRole = members.find(m => m.profile_id === user?.id)?.role;
  const isAdmin = currentUserRole === "admin" || currentUserRole === "creator";
  const isCreator = currentUserRole === "creator";

  // Date Logic
  const pastDays = Array.from({ length: 15 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 14 + i);
    return d.toISOString().split('T')[0];
  });
  
  const formattedDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric' }).format(d);
  };
  
  const isTodayDate = (dateStr: string) => dateStr === new Date().toISOString().split('T')[0];

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

        {/* Active polls and create CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activePolls.map(activePoll => (
            <Link key={activePoll.id} href={`/poll/${activePoll.id}`} style={{ textDecoration: "none" }}>
              <motion.div whileTap={{ scale: 0.98 }} style={{
                background: "#10b981", borderRadius: 20, padding: "16px",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div className="live-dot" style={{ background: "white" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Activo (Hasta {new Date(activePoll.expires_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                  {activePoll.poll_type === 'prediction' && (
                    <span style={{ marginLeft: "auto", fontSize: 11, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 10, color: "white", fontWeight: 700 }}>PREDICCIÓN</span>
                  )}
                </div>
                <p style={{ fontWeight: 700, color: "white", fontSize: 16, lineHeight: 1.4 }}>
                  {activePoll.rendered_question || activePoll.question}
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8 }}>
                  Toca para interactuar →
                </p>
              </motion.div>
            </Link>
          ))}

          {pollCount < 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button 
                onClick={createPoll} 
                disabled={creating} 
                className="btn-primary" 
                style={{ padding: "16px", borderRadius: 20 }}
              >
                {creating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                {creating ? "Lanzando encuesta..." : `Lanzar encuesta aleatoria (${pollCount}/3)`}
              </button>
              
              <button 
                onClick={() => setShowPredictionForm(!showPredictionForm)} 
                disabled={creating} 
                className="btn-secondary" 
                style={{ padding: "14px", borderRadius: 16, border: "1.5px dashed #10b981", color: "#10b981" }}
              >
                🔮 Crear una Predicción Manual
              </button>
              
              <AnimatePresence>
                {showPredictionForm && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ background: "white", padding: 16, borderRadius: 16, border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Escribe sobre qué quieres que apueste el grupo:</p>
                      <input className="input" placeholder="Ej: ¿Quién va a llegar más tarde hoy?" value={predictionText} onChange={e => setPredictionText(e.target.value)} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowPredictionForm(false)}>Cancelar</button>
                        <button className="btn-primary" style={{ flex: 1 }} onClick={createPrediction} disabled={creating || !predictionText}>Lanzar</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="pill-tabs" style={{ marginTop: 4, overflowX: "auto" }}>
          {([["polls","Encuestas"], ["members","Miembros"], ["ranking","Ranking"], ["audit", "Auditoría"], ["survival", "⚔️ Supervivencia"]] as const).map(([key, label]) => (
            <button key={key} className={`pill-tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)} style={{ whiteSpace: "nowrap" }}>
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
                    border: poll.is_active && (!poll.expires_at || new Date(poll.expires_at) > new Date()) ? "1.5px solid #10b981" : "1px solid #f3f4f6",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    {poll.is_active && (!poll.expires_at || new Date(poll.expires_at) > new Date()) && <div className="live-dot" />}
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
                      {m.role === "creator" && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>
                          <Crown size={10} /> Creador
                        </span>
                      )}
                      {m.role === "admin" && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, background: "#dbeafe", color: "#1e40af", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>
                          <ShieldCheck size={10} /> Admin
                        </span>
                      )}
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
                  {/* Kick button */}
                  {isAdmin && m.profile_id !== user?.id && (
                    <button 
                      onClick={() => handleKick(m.profile_id, m.profiles?.username)}
                      className="btn-ghost" 
                      style={{ padding: 8, color: "#ef4444" }}
                    >
                      <UserMinus size={18} />
                    </button>
                  )}
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

          {tab === "audit" && (
            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              
              {/* Horizontal Date Picker */}
              <div style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8, margin: "0 -16px", padding: "0 16px 8px" }} className="hide-scrollbar">
                {pastDays.map(dateStr => {
                  const isSelected = selectedDate === dateStr;
                  const hasSummary = summaries.some(s => new Date(s.created_at).toISOString().split('T')[0] === dateStr);
                  const isToday = isTodayDate(dateStr);
                  
                  return (
                    <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
                      style={{
                        background: isSelected ? "#10b981" : "white",
                        color: isSelected ? "white" : "#374151",
                        border: isSelected ? "1px solid #10b981" : "1px solid #e5e7eb",
                        borderRadius: 14, padding: "8px 16px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64,
                        position: "relative",
                        flexShrink: 0
                      }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.8)" : "#9ca3af" }}>
                        {isToday ? "Hoy" : formattedDay(dateStr).split(' ')[0]}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>
                        {formattedDay(dateStr).split(' ')[1]}
                      </span>
                      {hasSummary && !isSelected && (
                        <div style={{ width: 4, height: 4, background: "#10b981", borderRadius: "50%", position: "absolute", bottom: 4 }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {isTodayDate(selectedDate) && (
                <button 
                  onClick={generateAudit} 
                  disabled={generating || pollCount < 1} 
                  className="btn-secondary" 
                  style={{ width: "100%", padding: 14, borderRadius: 16, border: "1.5px dashed #10b981", background: "#f0fdf4" }}
                >
                  {generating ? <Loader2 size={18} className="animate-spin" /> : <Flame size={18} color="#10b981" />}
                  {generating ? "Consultando a Gemini..." : "Generar Auditoría de Hoy"}
                </button>
              )}

              {/* Day's Content */}
              {(() => {
                const daySummary = summaries.find(s => new Date(s.created_at).toISOString().split('T')[0] === selectedDate);
                const dayPolls = polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate);

                if (!daySummary && dayPolls.length === 0) {
                  return (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                      <p>No hay actividad registrada en este día.</p>
                    </div>
                  );
                }

                return (
                  <>
                    {daySummary && (
                      <div style={{
                        background: "white", borderRadius: 20, padding: "20px",
                        border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        marginBottom: 16
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Auditoría IA
                          </span>
                        </div>
                        <div className="prose" style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                          <ReactMarkdown>{daySummary.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {dayPolls.length > 0 && (
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                          Encuestas del Día
                        </p>
                        {dayPolls.map((poll) => (
                          <Link key={poll.id} href={`/poll/${poll.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 8 }}>
                            <div style={{
                              background: "white", borderRadius: 16, padding: "14px 16px",
                              border: poll.is_active && (!poll.expires_at || new Date(poll.expires_at) > new Date()) && isTodayDate(selectedDate) ? "1.5px solid #10b981" : "1px solid #f3f4f6",
                              display: "flex", alignItems: "center", gap: 12,
                            }}>
                              <p style={{ flex: 1, fontWeight: 600, color: "#111827", fontSize: 14, lineHeight: 1.4 }}>
                                {poll.rendered_question || poll.question}
                              </p>
                              <ChevronLeft size={16} color="#d1d5db" style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )
              })()}
            </motion.div>
          )}

          {tab === "survival" && (
            <motion.div key="survival" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              
              {!survivalGame ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⚔️</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Battle Royale</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, padding: "0 20px" }}>
                    Un modo de una semana donde cada día se elimina al más votado en la encuesta diaria.
                  </p>
                  {isAdmin && (
                    <button onClick={startSurvival} className="btn-primary" style={{ background: "#ef4444", border: "none" }}>
                      Iniciar Supervivencia
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ background: "#111827", borderRadius: 20, padding: 20, color: "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fca5a5" }}>En curso ⚔️</h3>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {members.map(m => {
                      const participant = survivalGame.participants.find((p: any) => p.profile_id === m.profile_id);
                      const isEliminated = participant?.is_eliminated;
                      
                      return (
                        <div key={m.profile_id} style={{
                          background: isEliminated ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                          borderRadius: 12, padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                          opacity: isEliminated ? 0.4 : 1, position: "relative",
                        }}>
                          {isEliminated && (
                            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, background: "#ef4444", transform: "translateY(-50%) rotate(-15deg)", zIndex: 10 }} />
                          )}
                          <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={48} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: isEliminated ? "#9ca3af" : "white" }}>{m.profiles?.username}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
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
