"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, TabBar, PageHeader, LoadingScreen } from "@/components/ui";
import {
  Copy, Plus, Share2, LogOut,
  Loader2, UserMinus, ChevronRight, Sparkles, ChevronLeft,
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
  const [isCalendarOpen,   setIsCalendarOpen]   = useState(false);
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
      if (members.length < 2) {
        toast.error("Necesitas al menos 2 miembros para lanzar la mayoría de encuestas.");
        return;
      }
      const q = await questionService.getRandomQuestion(group.id, members.length);
      if (!q) { 
        toast.error("No hay preguntas adecuadas para " + members.length + " miembros."); 
        return; 
      }
      const shuffled = [...members].sort(() => Math.random() - 0.5);
      const rendered = questionService.renderQuestion(q.text, {
        groupName:   group.name,
        memberA:     shuffled[0]?.profiles?.username,
        memberB:     shuffled[1]?.profiles?.username,
        memberCount: members.length,
      });
      const poll = await pollService.createPoll(group.id, rendered, user.id, q.mode as import("@/lib/services").QuestionMode, q.id);
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
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 px-6 bg-[#f3ede2]">
      <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Grupo no encontrado</p>
      <Link href="/">
        <button className="btn-primary" style={{ maxWidth: 200 }}>Volver</button>
      </Link>
    </div>
  );

  const activePolls = polls.filter(p => p.is_active && (!p.expires_at || new Date(p.expires_at) > new Date()));
  const ranking = [...members].sort((a, b) => (b.profiles?.points || 0) - (a.profiles?.points || 0));
  const currentUserRole = members.find(m => m.profile_id === user?.id)?.role;
  const isAdmin   = currentUserRole === "admin" || currentUserRole === "creator";

  const isTodayDate   = (dateStr: string) => dateStr === new Date().toISOString().split("T")[0];

  /* ── Unified Date Navigator Component ── */
  const HistoryNavigator = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {tab === "audit" ? "Selector de fecha" : "Historial de encuestas"}
        </h3>
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="text-[10px] font-black text-[#14726e] uppercase tracking-widest flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-black/5 shadow-sm active:scale-95 transition-transform"
        >
          {isCalendarOpen ? "Ver tira" : "Ver mes completo"}
          <ChevronRight size={10} className={cn("transition-transform", isCalendarOpen && "rotate-90")} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isCalendarOpen ? (
          <motion.div 
            key="full-calendar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 mb-2">
              {(() => {
                const now = new Date();
                const calYear = now.getFullYear();
                const calMonth = now.getMonth();
                const calYearStr = calYear.toString();
                const calMonthStr = (calMonth + 1).toString().padStart(2, '0');
                const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                // Monday-first offset: 0=Mon … 6=Sun
                let startOffset = new Date(calYear, calMonth, 1).getDay();
                startOffset = startOffset === 0 ? 6 : startOffset - 1;
                const todayStr = now.toISOString().split('T')[0];

                return (
                  <div className="grid grid-cols-7 gap-y-3 text-center">
                    {["L","M","X","J","V","S","D"].map(d => (
                      <span key={d} className="text-[10px] font-black text-gray-300 uppercase">{d}</span>
                    ))}
                    {Array.from({ length: startOffset }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${calYearStr}-${calMonthStr}-${day.toString().padStart(2, '0')}`;
                      const hasPolls = polls.some(p => new Date(p.created_at).toISOString().split('T')[0] === dateStr);
                      const isSelected = selectedDate === dateStr;
                      const isToday = dateStr === todayStr;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all mx-auto",
                            isSelected ? "bg-[#14726e] text-white shadow-lg shadow-[#14726e]/20" :
                            hasPolls  ? "bg-orange-100 text-orange-500" :
                            isToday   ? "border-2 border-[#14726e] text-[#14726e]" :
                                        "text-gray-400 hover:bg-gray-50"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="collapsed-strip"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              {Array.from({ length: 14 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - 13 + i);
                const dateStr = d.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const hasPolls = polls.some(p => new Date(p.created_at).toISOString().split('T')[0] === dateStr);
                const hasSummary = summaries.some(s => new Date(s.created_at).toISOString().split("T")[0] === dateStr);
                const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(d);
                const dayNum = d.getDate();

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[56px] h-[72px] rounded-2xl transition-all border relative",
                      isSelected ? "bg-[#14726e] border-[#14726e] text-white shadow-lg shadow-[#14726e]/20" :
                      hasPolls ? "bg-white border-orange-200 text-orange-500" :
                      "bg-white border-black/5 text-gray-400"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase mb-1 opacity-60">{dayName}</span>
                    <span className="text-base font-black">{dayNum}</span>
                    {tab === "audit" && hasSummary && !isSelected && (
                      <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#14726e]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ── Render ── */
  return (
    <div className="min-h-svh bg-[#f3ede2] relative overflow-x-hidden">
      <header className="arc-header px-6 pb-14 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/">
             <motion.button 
               whileTap={{ scale: 0.9 }}
               className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
             >
                <ChevronLeft size={24} />
             </motion.button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-white truncate lowercase">
              {group.name}
            </h1>
            <button 
              onClick={copyCode}
              title="Copiar código"
              className="bg-[#0e3e3b] rounded-full px-3 py-1 flex items-center gap-1 w-fit mt-1 border border-white/5 hover:bg-[#14726e] transition-colors cursor-pointer active:scale-95"
            >
               <span className="text-[10px] font-black text-white">{group.invite_code}</span>
               <Copy size={10} className="text-white/40" />
            </button>
          </div>
        </div>
        
        <button onClick={share} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shadow-inner" aria-label="Compartir">
          <Share2 size={20} strokeWidth={2.5} />
        </button>
      </header>

      {/* Content */}
      <div className="px-5 pb-32 pt-6 flex flex-col gap-6 relative z-10 max-w-[430px] mx-auto">

         <div className="flex justify-between items-center bg-white rounded-[32px] p-4 shadow-sm border border-black/5">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">🔥</div>
               <div>
                  <p className="text-xs font-black text-gray-900 leading-tight">Racha activa</p>
                  <p className="text-[10px] text-orange-500 font-bold">
                    {(() => {
                      const days = Math.floor((Date.now() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24));
                      return days === 0 ? "¡Día 1 juntos!" : `${days + 1} días juntos`;
                    })()}
                  </p>
               </div>
            </div>
            <div className="bg-[#f3ede2] rounded-full px-4 py-2 font-black text-sm text-[#14726e]">
               {members.length} Miembros
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
                style={{ borderStyle: "dashed", borderColor: "rgba(20,114,110,0.3)" }}
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
                    <div className="card p-4 flex flex-col gap-3 mt-1 shadow-md">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Predicción Personalizada
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

          {/* Polls Tab (Calendar View) */}
          {tab === "polls" && (
            <motion.div key="polls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-6">
              
              <HistoryNavigator />

              {/* Day Contents */}
              <div className="flex flex-col gap-3">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Preguntas del {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(selectedDate))}
                 </h4>
                 {polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate).length === 0 ? (
                    <div className="bg-white/50 rounded-[28px] p-6 text-center border border-dashed border-gray-300">
                       <p className="text-sm font-bold text-gray-400">No hubo preguntas este día</p>
                    </div>
                 ) : (
                    polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate).map((poll, i) => (
                       <Link key={poll.id} href={`/poll/${poll.id}`}>
                          <div className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-black/5">
                             <p className="font-bold text-gray-800 text-sm leading-snug">
                                {poll.rendered_question || poll.question}
                             </p>
                             <div className="bg-gray-50 p-2 rounded-xl text-gray-300">
                                <ChevronRight size={16} />
                             </div>
                          </div>
                       </Link>
                    ))
                 )}
              </div>
            </motion.div>
          )}

          {/* Members Tab */}
          {tab === "members" && (
            <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-3">
              {members.map((m, i) => (
                <motion.div
                  key={m.profile_id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm border border-black/5"
                >
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-gray-900 text-sm truncate">{m.profiles?.username}</span>
                      {m.role === "creator" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      )}
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                         {m.profiles?.points || 0} monedas
                      </span>
                    </div>
                  </div>
                  {isAdmin && m.profile_id !== user?.id && (
                    <button
                      onClick={() => handleKick(m.profile_id, m.profiles?.username)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-400 flex items-center justify-center"
                      aria-label="Expulsar"
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
              className="flex flex-col gap-3">
              {ranking.map((m, i) => (
                <motion.div
                  key={m.profile_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm border border-black/5",
                    i === 0 && "ring-2 ring-orange-400"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-sm text-gray-400">
                    {i + 1}
                  </div>
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={44} />
                  <div className="flex-1">
                    <span className="font-black text-gray-900 text-sm block">{m.profiles?.username}</span>
                    <span className="text-[10px] text-[#14726e] font-bold uppercase">{m.profiles?.points || 0} monedas</span>
                  </div>
                  {i === 0 && <span className="text-2xl">🏆</span>}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Audit Tab */}
          {tab === "audit" && (
            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-4">

              <HistoryNavigator />

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
                    : <Sparkles size={16} className="text-[#14726e]" />
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
                      <div className="card p-5 shadow-md">
                        <p className="section-label mb-4 text-[#14726e]">Auditoría IA</p>
                        <div className="prose-light text-gray-700 leading-relaxed text-sm">
                          <ReactMarkdown>{daySummary.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {dayPolls.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">Encuestas del Día</p>
                        <div className="flex flex-col gap-3">
                          {dayPolls.map(poll => {
                            const isActive = poll.is_active && (!poll.expires_at || new Date(poll.expires_at) > new Date()) && isTodayDate(selectedDate);
                            return (
                              <Link key={poll.id} href={`/poll/${poll.id}`} className="block">
                                <div className={cn("bg-white rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-black/5", isActive && "border-[#14726e]/30")}>
                                  {isActive && <div className="live-dot" />}
                                  <p className="flex-1 text-gray-800 font-bold text-sm leading-snug">
                                    {poll.rendered_question || poll.question}
                                  </p>
                                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
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
                <div className="bg-white rounded-[40px] p-8 flex flex-col items-center text-center gap-5 shadow-sm border border-black/5">
                  <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center text-4xl shadow-inner">
                    ⚔️
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Battle Royale</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide leading-relaxed max-w-[240px]">
                      Modo eliminatorio: cada día al más votado le cortamos la cabeza.
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={startSurvival}
                      className="btn-primary w-full shadow-lg shadow-red-500/20"
                      style={{ background: "#dc2626" }}
                    >
                      Iniciar Battle Royale
                    </button>
                  )}
                </div>
              ) : (
                <div className="card-elevated p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-red-500 uppercase tracking-tighter">En curso ⚔️</h3>
                    <div className="live-dot" style={{ background: "#ef4444" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {members.map(m => {
                      const participant = survivalGame.participants?.find((p: any) => p.profile_id === m.profile_id);
                      const isEliminated = participant?.is_eliminated;
                      return (
                        <div
                          key={m.profile_id}
                          className={cn(
                            "rounded-[28px] p-4 flex flex-col items-center gap-2 relative overflow-hidden border transition-all",
                            isEliminated
                              ? "bg-gray-50 border-gray-100 opacity-40 grayscale"
                              : "bg-white border-black/5 shadow-sm"
                          )}
                        >
                          {isEliminated && (
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-full h-1 bg-red-500/40 rotate-[-15deg] blur-[1px]" />
                            </div>
                          )}
                          <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={52} />
                          <span className="text-xs font-black text-gray-900 text-center truncate w-full px-1">
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
