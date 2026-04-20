"use client";

import { Avatar, BottomNav, Button, Card, LoadingScreen, TabBar } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { useAuth } from "@/hooks/useAuth";
import {
  groupService, pollService, questionService, summaryService, survivalService,
  type Group, type GroupMember, type Poll,
} from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Copy, Loader2, LogOut, MessageSquare, Plus, Share2, Sparkles, UserMinus, Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

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
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 px-6 bg-[var(--stitch-canvas)]">
      <p className="font-inter text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Grupo Inexistente</p>
      <Link href="/">
        <Button variant="primary" className="max-w-[200px]">Volver al Inicio</Button>
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {tab === "audit" ? "Análisis Temporal" : "Historial de Datos"}
        </h3>
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="font-inter text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm active:scale-95 transition-transform"
        >
          {isCalendarOpen ? "Minimizar" : "Ver Calendario"}
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
            <Card className="p-6 mb-2 bg-white">
              {(() => {
                const now = new Date();
                const calYear = now.getFullYear();
                const calMonth = now.getMonth();
                const calYearStr = calYear.toString();
                const calMonthStr = (calMonth + 1).toString().padStart(2, '0');
                const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                let startOffset = new Date(calYear, calMonth, 1).getDay();
                startOffset = startOffset === 0 ? 6 : startOffset - 1;
                const todayStr = now.toISOString().split('T')[0];

                return (
                  <div className="grid grid-cols-7 gap-y-3 text-center">
                    {["L","M","X","J","V","S","D"].map(d => (
                      <span key={d} className="font-jakarta text-[10px] font-black text-slate-300 uppercase">{d}</span>
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
                            "w-9 h-9 rounded-xl flex items-center justify-center font-jakarta text-sm font-black transition-all mx-auto",
                            isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" :
                            hasPolls  ? "bg-indigo-50 text-indigo-500" :
                            isToday   ? "border-2 border-indigo-600 text-indigo-600" :
                                        "text-slate-300 hover:bg-slate-50"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="collapsed-strip"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
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
                      "flex flex-col items-center justify-center min-w-[60px] h-[76px] rounded-[24px] transition-all border relative",
                      isSelected ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50" :
                      hasPolls ? "bg-white border-indigo-100 text-indigo-500" :
                      "bg-white border-slate-100 text-slate-300 hover:border-slate-200"
                    )}
                  >
                    <span className="font-inter text-[9px] font-black uppercase mb-1 opacity-70 tracking-widest">{dayName}</span>
                    <span className="font-jakarta text-lg font-black">{dayNum}</span>
                    {tab === "audit" && hasSummary && !isSelected && (
                      <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
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

  /* ── Main Render ── */
  return (
    <MobileLayout
      header={
        <header className="px-6 pt-12 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                <ChevronLeft size={22} className="text-slate-600" />
              </button>
            </Link>
            <div className="min-w-0">
              <h1 className="font-jakarta text-2xl font-black text-slate-900 leading-none tracking-tight truncate">
                {group.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={copyCode}
                  className="bg-indigo-600 rounded-full pl-3 pr-2 py-1 flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
                >
                  <span className="font-inter text-[10px] font-black text-white uppercase tracking-widest">{group.invite_code}</span>
                  <div className="bg-white/20 p-1 rounded-full"><Copy size={10} className="text-white" /></div>
                </button>
              </div>
            </div>
          </div>
          
          <button onClick={share} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm active:scale-95 transition-all">
            <Share2 size={20} />
          </button>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-5 pb-12 flex flex-col gap-8 max-w-[430px] mx-auto pt-4">

         
         <div className="grid grid-cols-2 gap-3">
            <Card className="p-5 flex items-center gap-4 border-slate-100/50">
               <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shadow-inner border border-amber-100">🔥</div>
               <div>
                  <p className="font-jakarta text-xs font-black text-slate-900 leading-none mb-1">Día {Math.floor((Date.now() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24)) + 1}</p>
                  <p className="font-inter text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Racha Activa</p>
               </div>
            </Card>
            <Card className="p-5 flex items-center gap-4 border-slate-100/50">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl shadow-inner border border-indigo-100">👥</div>
               <div>
                  <p className="font-jakarta text-xs font-black text-slate-900 leading-none mb-1">{members.length}</p>
                  <p className="font-inter text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Miembros</p>
               </div>
            </Card>
         </div>

        {/* Action Center: Polls & Predictions */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {activePolls.map(poll => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <Link href={`/poll/${poll.id}`} className="block">
                  <div className="bg-[var(--stitch-card-dark)] rounded-[32px] p-6 shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] group-hover:bg-indigo-500/20 transition-all duration-700" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          <span className="font-inter text-[10px] font-black text-white/80 uppercase tracking-widest">En Vivo</span>
                        </div>
                        {poll.poll_type === "prediction" && (
                          <span className="font-inter text-[10px] bg-indigo-500/20 text-indigo-300 font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
                            Predicción
                          </span>
                        )}
                      </div>
                      <p className="font-jakarta font-black text-white text-lg leading-tight mb-4">
                        {poll.rendered_question || poll.question}
                      </p>
                      <div className="flex items-center gap-2 text-white/40 font-jakarta font-bold text-xs group-hover:text-white/60 transition-colors">
                        <span>Audiencia necesaria para completar</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {pollCount < 3 && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={createPoll}
                loading={creating}
                className="h-16 shadow-xl shadow-indigo-500/20"
              >
                {!creating && <Zap size={18} fill="currentColor" />}
                Lanzar Auditoría Aleatoria ({pollCount}/3)
              </Button>

              {!showPrediction ? (
                <button
                  onClick={() => setShowPrediction(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-[32px] font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <Sparkles size={16} />
                  Predicción Manual
                </button>
              ) : (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <Card className="p-6 flex flex-col gap-4 mt-2">
                    <h4 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Configurar Predicción</h4>
                    <input
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-jakarta font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                      placeholder="¿Quién es más probable que...?"
                      value={predictionText}
                      onChange={e => setPredictionText(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={() => setShowPrediction(false)}>Cancelar</Button>
                      <Button onClick={createPrediction} loading={creating} disabled={!predictionText.trim()}>Lanzar</Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Main Tab System */}
        <div className="flex flex-col gap-6 mt-4">
          <TabBar
            tabs={TABS}
            active={tab}
            onChange={setTab}
          />

          <AnimatePresence mode="wait">
            {/* Polls History Tab */}
            {tab === "polls" && (
              <motion.div 
                key="polls" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Expo-out
                className="flex flex-col gap-8"
              >
                <HistoryNavigator />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    <h4 className="font-jakarta text-xs font-black text-slate-900 uppercase">
                      Auditorías del {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(selectedDate))}
                    </h4>
                  </div>
                  {polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white/50 border-2 border-dashed border-slate-100 rounded-[40px] text-center px-8">
                      <p className="font-inter text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay registros para esta fecha</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate).map((poll) => (
                        <Link key={poll.id} href={`/poll/${poll.id}`}>
                          <Card className="p-5 flex items-center justify-between hover:scale-[1.01] transition-all border-slate-100/50">
                            <p className="font-jakarta font-bold text-slate-800 text-sm leading-snug">
                              {poll.rendered_question || poll.question}
                            </p>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
                              <ChevronRight size={18} />
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Members Tab */}
            {tab === "members" && (
              <motion.div 
                key="members" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {members.map((m, i) => (
                  <Card key={m.profile_id} className="p-4 flex items-center gap-4 border-slate-100/50">
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={50} className="shadow-md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-jakarta font-black text-slate-900 text-sm truncate">{m.profiles?.username}</span>
                        {m.role === "creator" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={10} className="text-indigo-400 fill-indigo-400" />
                        <span className="font-inter text-[9px] text-slate-400 font-black uppercase tracking-widest">
                          {m.profiles?.points || 0} Credenciales
                        </span>
                      </div>
                    </div>
                    {isAdmin && m.profile_id !== user?.id && (
                      <button
                        onClick={() => handleKick(m.profile_id, m.profiles?.username)}
                        className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center border border-rose-100 shadow-sm active:scale-95 transition-all"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Ranking Tab */}
            {tab === "ranking" && (
              <motion.div 
                key="ranking" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {ranking.map((m, i) => (
                  <Card key={m.profile_id} className={cn("p-5 flex items-center gap-4 transition-all", i === 0 ? "ring-2 ring-indigo-500 bg-white shadow-xl shadow-indigo-500/10 border-white" : "border-slate-100/50")}>
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-jakarta font-black text-xs", i === 0 ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-300")}>
                      #{i + 1}
                    </div>
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={48} />
                    <div className="flex-1">
                      <span className="font-jakarta font-black text-slate-900 text-sm block">{m.profiles?.username}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Zap size={10} className={cn(i === 0 ? "text-indigo-600 fill-indigo-600" : "text-slate-300 fill-slate-300")} />
                        <span className={cn("font-inter text-[10px] font-black uppercase tracking-widest", i === 0 ? "text-indigo-600" : "text-slate-400")}>
                          {m.profiles?.points || 0}
                        </span>
                      </div>
                    </div>
                    {i === 0 && <span className="text-2xl drop-shadow-md">🏆</span>}
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Audit Tab */}
            {tab === "audit" && (
              <motion.div 
                key="audit" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <HistoryNavigator />
                {isTodayDate(selectedDate) && (
                  <Button
                    onClick={generateAudit}
                    loading={generating}
                    disabled={pollCount < 1}
                    variant="secondary"
                    className="h-16 border-dashed border-indigo-200"
                  >
                    {!generating && <Sparkles size={18} className="text-indigo-600" />}
                    {generating ? "Procesando Auditoría IA..." : "Sintetizar Datos de Hoy"}
                  </Button>
                )}
                {(() => {
                  const daySummary = summaries.find(s => new Date(s.created_at).toISOString().split("T")[0] === selectedDate);
                  const dayPolls   = polls.filter(p => new Date(p.created_at).toISOString().split("T")[0] === selectedDate);

                  if (!daySummary && dayPolls.length === 0) return (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/30 border-2 border-dashed border-slate-100 rounded-[40px] text-center px-12">
                      <p className="font-inter text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">No hay suficiente información para generar un reporte automático</p>
                    </div>
                  );

                  return (
                    <div className="flex flex-col gap-8">
                      {daySummary && (
                        <Card className="p-8 border-indigo-100 shadow-xl shadow-indigo-500/5">
                          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full mb-6">
                            <Sparkles size={12} className="fill-indigo-500" />
                            <span className="font-inter text-[10px] font-black uppercase tracking-widest">Reporte Gemini AI</span>
                          </div>
                          <div className="prose-light font-inter text-slate-700 leading-relaxed text-sm antialiased">
                            <ReactMarkdown>{daySummary.content}</ReactMarkdown>
                          </div>
                        </Card>
                      )}
                      {dayPolls.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h4 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registros de Actividad</h4>
                          <div className="flex flex-col gap-3">
                            {dayPolls.map(poll => (
                              <Link key={poll.id} href={`/poll/${poll.id}`}>
                                <Card className="p-5 flex items-center justify-between border-slate-100/50">
                                  <p className="font-jakarta font-bold text-slate-800 text-sm leading-snug">{poll.rendered_question || poll.question}</p>
                                  <ChevronRight size={18} className="text-slate-300" />
                                </Card>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Survival Tab */}
            {tab === "survival" && (
              <motion.div 
                key="survival" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {!survivalGame ? (
                  <div className="bg-white rounded-[40px] p-10 flex flex-col items-center text-center gap-8 shadow-sm border border-slate-100">
                    <div className="w-24 h-24 rounded-[32px] bg-rose-50 border border-rose-100 flex items-center justify-center text-5xl shadow-inner animate-pulse">⚔️</div>
                    <div>
                      <h3 className="font-jakarta text-2xl font-black text-slate-900 mb-3 tracking-tight">Battle Royale</h3>
                      <p className="font-inter text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-loose max-w-[260px]">Modo de supervivencia extrema: una eliminación diaria por votación popular.</p>
                    </div>
                    {isAdmin && (
                      <Button onClick={startSurvival} className="h-16 bg-rose-600 border-rose-500 shadow-xl shadow-rose-500/30">Lanzar Desafío Letal</Button>
                    )}
                  </div>
                ) : (
                  <Card className="p-8 shadow-2xl shadow-rose-500/5 border-rose-100 ring-4 ring-rose-50/50">
                    <div className="flex items-center justify-between mb-8 border-b border-rose-50 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <h3 className="font-jakarta text-lg font-black text-rose-600 tracking-tight">Estado Crítico</h3>
                      </div>
                      <span className="font-inter text-[10px] font-black text-rose-400 uppercase tracking-widest">En Curso</span>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      {members.map(m => {
                        const participant = survivalGame.participants?.find((p: any) => p.profile_id === m.profile_id);
                        const isEliminated = participant?.is_eliminated;
                        return (
                          <div key={m.profile_id} className={cn("rounded-[32px] p-5 flex flex-col items-center gap-3 relative overflow-hidden transition-all", isEliminated ? "bg-slate-50 border-slate-100 opacity-30 grayscale saturate-0" : "bg-white border-slate-100 shadow-sm")}>
                            {isEliminated && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-1 bg-rose-600/40 rotate-[15deg] blur-[1px]" /></div>}
                            <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={60} />
                            <span className="font-jakarta text-[11px] font-black text-slate-900 text-center truncate w-full">{m.profiles?.username}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Danger Zone */}
        <div className="pt-8 border-t border-slate-100 mt-4 flex flex-col gap-8 items-center pb-20">
          <Button variant="danger" onClick={leave} className="h-14 font-black tracking-widest uppercase text-xs">
            <LogOut size={16} />
            Abandonar Organización
          </Button>
          <p className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Identificador Único: {group.id.split('-')[0]}</p>
        </div>
      </div>
    </MobileLayout>
  );
}
