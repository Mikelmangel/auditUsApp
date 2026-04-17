"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, TabBar, PageHeader, LoadingScreen } from "@/components/ui";
import {
  Copy, Check, Crown, Flame, Zap, Plus, Share2, LogOut,
  Loader2, Users, ShieldCheck, UserMinus, ChevronRight, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  groupService, pollService, questionService, summaryService, survivalService,
  type Group, type GroupMember, type Poll,
} from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type TabKey = "polls" | "members" | "ranking" | "audit" | "survival";

const TABS: { key: TabKey; label: string }[] = [
  { key: "polls",    label: "Encuestas" },
  { key: "members",  label: "Miembros" },
  { key: "ranking",  label: "Ranking" },
  { key: "audit",    label: "Auditoría" },
  { key: "survival", label: "⚔️ Battle" },
];

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const [group,            setGroup]            = useState<Group | null>(null);
  const [members,          setMembers]          = useState<GroupMember[]>([]);
  const [polls,            setPolls]            = useState<Poll[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [copied,           setCopied]           = useState(false);
  const [creating,         setCreating]         = useState(false);
  const [showPrediction,   setShowPrediction]   = useState(false);
  const [predictionText,   setPredictionText]   = useState("");
  const [tab,              setTab]              = useState<TabKey>("polls");
  const [summaries,        setSummaries]        = useState<any[]>([]);
  const [pollCount,        setPollCount]        = useState(0);
  const [generating,       setGenerating]       = useState(false);
  const [survivalGame,     setSurvivalGame]     = useState<any>(null);
  const [selectedDate,     setSelectedDate]     = useState<string>(new Date().toISOString().split("T")[0]);
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
      setGroup(g);
      setMembers(m as GroupMember[]);
      setPolls(p);
      setPollCount(count);
      setSummaries(s);
      setSurvivalGame(sg);
      setLoading(false);
    };
    load();
  }, [params]);

  /* ── Actions ── */
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
    if (navigator.share) await navigator.share({ text });
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
        groupName:   group.name,
        memberA:     shuffled[0]?.profiles?.username,
        memberB:     shuffled[1]?.profiles?.username,
        memberCount: members.length,
      });
      const poll = await pollService.createPoll(group.id, rendered, user.id, q.mode);
      await supabase.from("group_poll_history").insert([{ group_id: group.id, question_id: q.id }]);
      setPollCount(prev => prev + 1);
      toast.success("¡Encuesta lanzada!");
      router.push(`/poll/${poll.id}`);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setCreating(false);
    }
  };

  const createPrediction = async () => {
    if (!group || !user || !predictionText.trim()) return;
    setCreating(true);
    try {
      const poll = await pollService.createPoll(group.id, predictionText.trim(), user.id, "prediction");
      setPollCount(prev => prev + 1);
      toast.success("¡Predicción lanzada!");
      setShowPrediction(false);
      setPredictionText("");
      router.push(`/poll/${poll.id}`);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setCreating(false);
    }
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
      toast.success("¡Auditoría generada!");
    } catch (e: any) {
      toast.error(e.message || "Error al generar la auditoría");
    } finally {
      setGenerating(false);
    }
  };

  const startSurvival = async () => {
    if (!group || !isAdmin) return;
    if (!confirm("¿Empezar un Battle Royale? Esto invitará a todos los miembros actuales.")) return;
    try {
      const g = await survivalService.startSurvivalGame(group.id, members.map(m => m.profile_id));
      setSurvivalGame({ ...g, participants: members.map(m => ({ profile_id: m.profile_id, is_eliminated: false })) });
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
    if (!group || !confirm(`¿Expulsar a ${username}? No podrá volver a entrar.`)) return;
    try {
      await groupService.kickMember(group.id, targetUserId);
      setMembers(prev => prev.filter(m => m.profile_id !== targetUserId));
      toast.success(`${username} ha sido expulsado.`);
    } catch {
      toast.error("No se pudo expulsar al miembro");
    }
  };

  if (loading) return <LoadingScreen />;

  if (!group) return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 px-6 bg-black">
      <p className="text-white/40 text-sm">Grupo no encontrado</p>
      <Link href="/">
        <button className="btn-primary" style={{ maxWidth: 200 }}>Volver</button>
      </Link>
    </div>
  );

  const activePolls = polls.filter(p => p.is_active && (!p.expires_at || new Date(p.expires_at) > new Date()));
  const ranking = [...members].sort((a, b) => (b.profiles?.points || 0) - (a.profiles?.points || 0));
  const currentUserRole = members.find(m => m.profile_id === user?.id)?.role;
  const isAdmin   = currentUserRole === "admin" || currentUserRole === "creator";

  const pastDays = Array.from({ length: 15 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 14 + i);
    return d.toISOString().split("T")[0];
  });
  const formattedDay  = (dateStr: string) => new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric" }).format(new Date(dateStr));
  const isTodayDate   = (dateStr: string) => dateStr === new Date().toISOString().split("T")[0];

  /* ── Render ── */
  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh" />

      {/* Header */}
      <PageHeader
        back="/"
        title={
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl leading-none">{group.avatar_emoji || "🔮"}</span>
            <div className="min-w-0">
              <h1 className="text-base font-black text-white truncate uppercase tracking-tight">
                {group.name}
              </h1>
              <p className="text-[11px] text-white/40 font-medium">
                {group.member_count || members.length} miembros
              </p>
            </div>
          </div>
        }
        action={
          <button onClick={share} className="btn-ghost !w-11 !h-11 !p-0 !rounded-xl" aria-label="Compartir">
            <Share2 size={18} />
          </button>
        }
        className="border-b border-white/[0.06]"
      />

      {/* Content */}
      <div className="px-5 pb-32 pt-4 flex flex-col gap-4 relative z-10 max-w-[430px] mx-auto">

        {/* Invite Code */}
        <div className="card p-4">
          <p className="section-label mb-3">Código de invitación</p>
          <div className="flex items-center gap-3">
            <div className="invite-code flex-1">{group.invite_code}</div>
            <button
              onClick={copyCode}
              aria-label="Copiar código"
              className={cn(
                "w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all duration-200",
                copied
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              )}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Active Polls + CTA */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {activePolls.map(poll => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <Link href={`/poll/${poll.id}`} className="block">
                  <div className="poll-banner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="live-dot" style={{ background: "rgba(255,255,255,0.9)" }} />
                      <span className="text-[11px] font-black text-white/70 uppercase tracking-wider">
                        Activo {poll.expires_at && `· hasta ${new Date(poll.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                      </span>
                      {poll.poll_type === "prediction" && (
                        <span className="ml-auto text-[10px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase">
                          Predicción
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-white text-[15px] leading-snug mb-2">
                      {poll.rendered_question || poll.question}
                    </p>
                    <div className="flex items-center gap-1.5 text-white/60 text-xs font-semibold">
                      <span>Toca para interactuar</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {pollCount < 3 && (
            <div className="flex flex-col gap-2">
              <button
                onClick={createPoll}
                disabled={creating}
                className="btn-primary"
              >
                {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {creating ? "Lanzando..." : `Lanzar encuesta aleatoria (${pollCount}/3)`}
              </button>

              <button
                onClick={() => setShowPrediction(v => !v)}
                disabled={creating}
                className="btn-secondary"
                style={{ borderStyle: "dashed", borderColor: "rgba(16,185,129,0.35)", color: "var(--emerald)" }}
              >
                <Sparkles size={16} />
                Crear una Predicción Manual
              </button>

              <AnimatePresence>
                {showPrediction && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="card p-4 flex flex-col gap-3 mt-1">
                      <p className="text-sm font-semibold text-white/70">
                        Escribe sobre qué quieres que apueste el grupo:
                      </p>
                      <input
                        className="input"
                        placeholder="Ej: ¿Quién llegará más tarde hoy?"
                        value={predictionText}
                        onChange={e => setPredictionText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button className="btn-ghost flex-1" onClick={() => setShowPrediction(false)}>
                          Cancelar
                        </button>
                        <button
                          className="btn-primary flex-1"
                          style={{ width: "auto" }}
                          onClick={createPrediction}
                          disabled={creating || !predictionText.trim()}
                        >
                          Lanzar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Tabs */}
        <TabBar
          tabs={TABS}
          active={tab}
          onChange={setTab}
          className="sticky top-[88px] z-40"
        />

        {/* Tab Content */}
        <AnimatePresence mode="wait">

          {/* Polls Tab */}
          {tab === "polls" && (
            <motion.div key="polls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-2">
              {polls.length === 0 ? (
                <div className="text-center py-12 text-white/30 text-sm">
                  Todavía no hay encuestas en este grupo
                </div>
              ) : polls.map((poll, i) => {
                const isActive = poll.is_active && (!poll.expires_at || new Date(poll.expires_at) > new Date());
                return (
                  <Link key={poll.id} href={`/poll/${poll.id}`} className="block">
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        "list-item",
                        isActive && "border-emerald-500/30 bg-emerald-500/[0.04]"
                      )}
                    >
                      {isActive && <div className="live-dot flex-shrink-0" />}
                      <p className="flex-1 font-semibold text-white text-sm leading-snug">
                        {poll.rendered_question || poll.question}
                      </p>
                      <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}

          {/* Members Tab */}
          {tab === "members" && (
            <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-2">
              {members.map((m, i) => (
                <motion.div
                  key={m.profile_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="list-item cursor-default"
                >
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-sm truncate">{m.profiles?.username}</span>
                      {m.role === "creator" && (
                        <span className="badge badge-amber">
                          <Crown size={9} /> Creador
                        </span>
                      )}
                      {m.role === "admin" && (
                        <span className="badge badge-blue">
                          <ShieldCheck size={9} /> Admin
                        </span>
                      )}
                      {m.profile_id === user?.id && (
                        <span className="badge badge-emerald">Tú</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <Zap size={10} className="text-emerald-500" />
                        {m.profiles?.points || 0} pts
                      </span>
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <Flame size={10} className="text-orange-500" />
                        {m.profiles?.current_streak || 0} racha
                      </span>
                    </div>
                  </div>
                  {isAdmin && m.profile_id !== user?.id && (
                    <button
                      onClick={() => handleKick(m.profile_id, m.profiles?.username)}
                      className="btn-ghost !text-red-400 !w-10 !h-10 !p-0 !rounded-xl flex-shrink-0"
                      aria-label={`Expulsar a ${m.profiles?.username}`}
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Ranking Tab */}
          {tab === "ranking" && (
            <motion.div key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-2">
              {ranking.map((m, i) => (
                <motion.div
                  key={m.profile_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "list-item cursor-default",
                    i === 0 && "border-emerald-500/30 bg-emerald-500/[0.06]"
                  )}
                >
                  {/* Position number */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0",
                      i === 0 ? "bg-emerald-500 text-black" :
                      i === 1 ? "bg-slate-500/30 text-slate-300" :
                      i === 2 ? "bg-amber-700/30 text-amber-400" :
                                "bg-white/5 text-white/30"
                    )}
                  >
                    {i + 1}
                  </div>
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={40} />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white text-sm block truncate">{m.profiles?.username}</span>
                    <span className="text-[11px] text-white/40 flex items-center gap-1">
                      <Zap size={10} className="text-emerald-500" />
                      {m.profiles?.points || 0} pts
                    </span>
                  </div>
                  {i === 0 && <Crown size={18} className="text-yellow-400 flex-shrink-0" />}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Audit Tab */}
          {tab === "audit" && (
            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-4">

              {/* Date Picker */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {pastDays.map(dateStr => {
                  const isSelected = selectedDate === dateStr;
                  const hasSummary = summaries.some(s => new Date(s.created_at).toISOString().split("T")[0] === dateStr);
                  const isToday    = isTodayDate(dateStr);
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={cn(
                        "flex flex-col items-center flex-shrink-0 rounded-2xl px-3 py-2 min-w-[56px] transition-all duration-200 relative border",
                        isSelected
                          ? "bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                          : "bg-white/[0.04] border-white/[0.06] text-white/60 hover:bg-white/[0.07]"
                      )}
                    >
                      <span className={cn("text-[10px] font-bold uppercase", isSelected ? "text-black/70" : "text-white/40")}>
                        {isToday ? "Hoy" : formattedDay(dateStr).split(" ")[0]}
                      </span>
                      <span className={cn("text-base font-black", isSelected ? "text-black" : "text-white")}>
                        {formattedDay(dateStr).split(" ")[1]}
                      </span>
                      {hasSummary && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Generate Button (today only) */}
              {isTodayDate(selectedDate) && (
                <button
                  onClick={generateAudit}
                  disabled={generating || pollCount < 1}
                  className="btn-secondary"
                  style={{ borderStyle: "dashed", borderColor: "rgba(16,185,129,0.3)" }}
                >
                  {generating
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Sparkles size={16} className="text-emerald-400" />
                  }
                  {generating ? "Consultando a Gemini..." : "Generar Auditoría de Hoy"}
                </button>
              )}

              {/* Day Content */}
              {(() => {
                const daySummary = summaries.find(s => new Date(s.created_at).toISOString().split("T")[0] === selectedDate);
                const dayPolls   = polls.filter(p => new Date(p.created_at).toISOString().split("T")[0] === selectedDate);

                if (!daySummary && dayPolls.length === 0) {
                  return (
                    <div className="text-center py-12 text-white/30 text-sm">
                      No hay actividad registrada en este día.
                    </div>
                  );
                }

                return (
                  <>
                    {daySummary && (
                      <div className="card p-5">
                        <p className="section-label mb-4" style={{ color: "var(--emerald)" }}>Auditoría IA</p>
                        <div className="prose-dark">
                          <ReactMarkdown>{daySummary.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {dayPolls.length > 0 && (
                      <div>
                        <p className="section-label mb-3">Encuestas del Día</p>
                        <div className="flex flex-col gap-2">
                          {dayPolls.map(poll => {
                            const isActive = poll.is_active && (!poll.expires_at || new Date(poll.expires_at) > new Date()) && isTodayDate(selectedDate);
                            return (
                              <Link key={poll.id} href={`/poll/${poll.id}`} className="block">
                                <div className={cn("list-item", isActive && "border-emerald-500/30")}>
                                  {isActive && <div className="live-dot" />}
                                  <p className="flex-1 text-white font-semibold text-sm leading-snug">
                                    {poll.rendered_question || poll.question}
                                  </p>
                                  <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* Survival Tab */}
          {tab === "survival" && (
            <motion.div key="survival" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-4">

              {!survivalGame ? (
                <div className="card p-8 flex flex-col items-center text-center gap-5">
                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl">
                    ⚔️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">Battle Royale</h3>
                    <p className="text-sm text-white/50 leading-relaxed max-w-[240px]">
                      Modo de una semana donde cada día se elimina al más votado en la encuesta diaria.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={startSurvival}
                      className="btn-primary w-full"
                      style={{ background: "#dc2626", boxShadow: "0 0 20px rgba(220,38,38,0.3)" }}
                    >
                      Iniciar Battle Royale
                    </button>
                  )}
                </div>
              ) : (
                <div className="card-elevated p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-black" style={{ color: "#fca5a5" }}>En curso ⚔️</h3>
                    <span className="live-dot" style={{ background: "#ef4444" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {members.map(m => {
                      const participant = survivalGame.participants?.find((p: any) => p.profile_id === m.profile_id);
                      const isEliminated = participant?.is_eliminated;
                      return (
                        <div
                          key={m.profile_id}
                          className={cn(
                            "rounded-2xl p-3 flex flex-col items-center gap-2 relative overflow-hidden border transition-all",
                            isEliminated
                              ? "bg-white/[0.02] border-white/[0.04] opacity-40"
                              : "bg-white/[0.06] border-white/[0.08]"
                          )}
                        >
                          {isEliminated && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-red-500/60 rotate-[-15deg]" />
                            </div>
                          )}
                          <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={48} />
                          <span className="text-xs font-bold text-white/80 text-center truncate w-full px-1">
                            {m.profiles?.username}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* Leave Group */}
        <div className="pt-2 border-t border-white/[0.04] mt-2">
          <button onClick={leave} className="btn-danger w-full">
            <LogOut size={16} />
            Abandonar grupo
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
