"use client";

import { Avatar, BottomNav, Button, Card, LoadingScreen, TabBar } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";

import { useAuth } from "@/hooks/useAuth";
import {
  groupService, pollService, questionService, summaryService, survivalService,
  type Group, type GroupMember, type Poll, type SurvivalGame, type SurvivalParticipant,
} from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Copy, LogOut, Share2, Sparkles, UserMinus, Zap, Shield, Skull, Crown, Trophy, Swords
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";


type TabKey = "polls" | "members" | "ranking" | "audit" | "survival";

/* Isolated countdown — owns its own 1s ticker so GroupPage never re-renders from it */
function CountdownDisplay({
  deadline,
  expiredLabel,
  variant = "light",
}: {
  deadline: Date | null;
  expiredLabel: string;
  variant?: "light" | "dark";
}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!deadline) return null;
  const msLeft = Math.max(0, deadline.getTime() - now.getTime());
  if (msLeft === 0) {
    return (
      <span className="font-inter text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-rose-100 text-rose-600 animate-pulse">
        ⏰ {expiredLabel}
      </span>
    );
  }
  const label = `${Math.floor(msLeft / 3_600_000)}h ${Math.floor((msLeft % 3_600_000) / 60_000)}m ${Math.floor((msLeft % 60_000) / 1_000)}s`;
  return (
    <span className={cn(
      "font-inter text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
      variant === "dark" ? "bg-white/20 text-white" : "bg-white/70 text-slate-500"
    )}>
      ⏱ {label}
    </span>
  );
}

function HistoryNavigator({
  tab, isCalendarOpen, setIsCalendarOpen, selectedDate, setSelectedDate, polls, summaries,
}: {
  tab: TabKey;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (v: boolean) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  polls: Poll[];
  summaries: any[];
}) {
  const { t, language } = useLanguage();
  const calendarStripRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    requestAnimationFrame(() => { node.scrollLeft = node.scrollWidth; });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {tab === "audit" ? t.group.audit : t.group.activityLog}
        </h3>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="font-inter text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm active:scale-95 transition-transform"
        >
          {isCalendarOpen ? t.group.minimize : t.group.viewCalendar}
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
                    {t.group.weekdays.map((d, i) => (
                      <span key={i} className="font-jakarta text-[10px] font-black text-slate-300 uppercase">{d}</span>
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
                            hasPolls   ? "bg-indigo-50 text-indigo-500" :
                            isToday    ? "border-2 border-indigo-600 text-indigo-600" :
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
            <div ref={calendarStripRef} className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              {Array.from({ length: 14 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - 13 + i);
                const dateStr = d.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const hasPolls = polls.some(p => new Date(p.created_at).toISOString().split('T')[0] === dateStr);
                const hasSummary = summaries.some(s => new Date(s.created_at).toISOString().split("T")[0] === dateStr);
                const dayName = new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' }).format(d);
                const dayNum = d.getDate();
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[60px] h-[76px] rounded-[24px] transition-all border relative",
                      isSelected ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50" :
                      hasPolls    ? "bg-white border-indigo-100 text-indigo-500" :
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
}

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const TABS: { key: TabKey; label: string }[] = [
    { key: "polls",   label: t.group.polls },
    { key: "members", label: t.group.members },
    { key: "ranking", label: t.group.ranking },
  ];

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
  const [survivalGame,     setSurvivalGame]     = useState<SurvivalGame | null>(null);
  const [survivalVoted,    setSurvivalVoted]    = useState(false);
  const [survivalVotes,    setSurvivalVotes]    = useState<Record<string, number>>({});
  const [survivalHistory,  setSurvivalHistory]  = useState<SurvivalGame[]>([]);
  const [survivalVoting,   setSurvivalVoting]   = useState(false);
  const [processingRound,  setProcessingRound]  = useState(false);
  const [roundExpired,     setRoundExpired]     = useState(false);
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

      // Load Battle Royale state
      if (sg && user) {
        const [voted, votes] = await Promise.all([
          survivalService.hasVotedThisRound(sg.id, sg.current_round, user.id),
          survivalService.getRoundVotes(sg.id, sg.current_round),
        ]);
        setSurvivalVoted(voted);
        setSurvivalVotes(votes);
      }

      // Load game history
      const history = await survivalService.getGameHistory(id).catch(() => []);
      setSurvivalHistory(history);

      setLoading(false);
    };
    load();
  }, [params, user]);

  // Fire once when the round deadline passes — no 1s re-render flood
  useEffect(() => {
    const deadline = survivalGame?.round_deadline ? new Date(survivalGame.round_deadline) : null;
    if (!deadline) { setRoundExpired(false); return; }
    const msLeft = deadline.getTime() - Date.now();
    if (msLeft <= 0) { setRoundExpired(true); return; }
    setRoundExpired(false);
    const t = setTimeout(() => setRoundExpired(true), msLeft);
    return () => clearTimeout(t);
  }, [survivalGame?.round_deadline]);

  // Auto-refresh survival game state every 30s when game is active
  useEffect(() => {
    if (!survivalGame || survivalGame.status === "finished" || !group) return;
    const interval = setInterval(async () => {
      const sg = await survivalService.getActiveGame(group.id).catch(() => null);
      if (!sg) return;
      setSurvivalGame(sg);
      if (user) {
        const [voted, votes] = await Promise.all([
          survivalService.hasVotedThisRound(sg.id, sg.current_round, user.id),
          survivalService.getRoundVotes(sg.id, sg.current_round),
        ]);
        setSurvivalVoted(voted);
        setSurvivalVotes(votes);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [survivalGame?.id, survivalGame?.status, group?.id, user]);

  /* ── Actions ── */
  const copyCode = async () => {
    if (!group) return;
    await navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    toast.success(t.group.copiedCode.replace("{code}", group.invite_code));
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (!group) return;
    const text = t.group.shareInvite.replace("{name}", group.name).replace("{code}", group.invite_code);
    if (navigator.share) await navigator.share({ text });
    else { await navigator.clipboard.writeText(text); toast.success(t.group.copiedToClipboard); }
  };

  const createPoll = async () => {
    if (!group || !user) return;
    setCreating(true);
    try {
      if (members.length < 2) {
        toast.error(t.group.noQuestions.replace("{count}", "2"));
        return;
      }
      const q = await questionService.getRandomQuestion(group.id, members.length);
      if (!q) { 
        toast.error(t.group.noQuestions.replace("{count}", String(members.length))); 
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
      toast.success(t.group.pollLaunched);
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
      toast.success(t.group.predictionLaunched);
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
    if (!group || !isAdmin) return;
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/groups/${group.id}/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({ groupName: group.name }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || t.group.auditError);
      setSummaries(prev => [body, ...prev]);
      toast.success(t.group.auditReport);
    } catch (e: any) {
      toast.error(e.message || t.group.auditError);
    } finally {
      setGenerating(false);
    }
  };

  const startSurvival = async () => {
    if (!group || !isAdmin) return;
    if (members.length < 4) {
      toast.error(t.group.battleMinMembers);
      return;
    }
    if (!confirm(t.group.battleRoyaleDesc + "\n\n" + t.group.battleRules)) return;
    try {
      const g = await survivalService.startSurvivalGame(group.id, members.map(m => m.profile_id));
      setSurvivalGame(g);
      setSurvivalVoted(false);
      setSurvivalVotes({});
      toast.success(t.group.battleHungerGames);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const castSurvivalVote = async (targetId: string) => {
    if (!survivalGame || !user || survivalVoted || survivalVoting) return;
    if (targetId === user.id) {
      toast.error(t.group.battleCantVoteSelf);
      return;
    }
    setSurvivalVoting(true);
    try {
      await survivalService.castSurvivalVote(survivalGame.id, survivalGame.current_round, user.id, targetId);
      setSurvivalVoted(true);
      const votes = await survivalService.getRoundVotes(survivalGame.id, survivalGame.current_round);
      setSurvivalVotes(votes);
      toast.success(t.group.battleVoteRegistered);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSurvivalVoting(false);
    }
  };

  const processRound = async () => {
    if (!group || !survivalGame || processingRound) return;
    setProcessingRound(true);
    try {
      const res = await fetch(`/api/groups/${group.id}/survival/process-round`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Error"); return; }
      toast.success(data.isFinished ? "¡Juego terminado! 🏆" : "Ronda procesada — nueva ronda iniciada");
      const sg = await survivalService.getActiveGame(group.id).catch(() => null);
      const history = await survivalService.getGameHistory(group.id).catch(() => []);
      setSurvivalGame(sg);
      setSurvivalHistory(history);
      setSurvivalVoted(false);
      setSurvivalVotes({});
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setProcessingRound(false);
    }
  };

  const leave = async () => {
    if (!group || !user || !confirm(t.group.leaveGroupConfirm)) return;
    await groupService.leaveGroup(group.id, user.id);
    toast.success(t.group.leftGroup);
    router.push("/");
  };

  const handleKick = async (targetUserId: string, username: string) => {
    if (!group || !confirm(t.group.kickMember.replace("{name}", username))) return;
    try {
      await groupService.kickMember(group.id, targetUserId);
      setMembers(prev => prev.filter(m => m.profile_id !== targetUserId));
      toast.success(t.group.memberKicked.replace("{name}", username));
    } catch {
      toast.error("Error");
    }
  };


  if (loading) return <LoadingScreen />;

  if (!group) return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 px-6 bg-[var(--stitch-canvas)]">
      <p className="font-inter text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">{t.group.nonExistent}</p>
      <Link href="/">
        <Button variant="primary" className="max-w-[200px]">{t.group.backToHome}</Button>
      </Link>
    </div>
  );

  const activePolls = polls.filter(p => p.is_active && (!p.expires_at || new Date(p.expires_at) > new Date()));
  const ranking = [...members].sort((a, b) => (b.group_points || 0) - (a.group_points || 0));
  const currentUserRole = members.find(m => m.profile_id === user?.id)?.role;
  const isAdmin   = currentUserRole === "admin" || currentUserRole === "creator";

  const isTodayDate = (dateStr: string) => dateStr === new Date().toISOString().split("T")[0];

  // ── Battle Royale helpers ──
  const lastBattleWinnerId = survivalHistory[0]?.winner_id;
  const roundDeadline = survivalGame?.round_deadline ? new Date(survivalGame.round_deadline) : null;

  /* ── Main Render ── */
  return (
    <MobileLayout
      header={
        <header className="px-5 pt-10 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/">
              <button className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm active:scale-90 transition-transform flex-shrink-0">
                <ChevronLeft size={20} className="text-slate-600" />
              </button>
            </Link>
            <div className="min-w-0">
              <h1 className="font-jakarta text-xl font-black text-slate-900 leading-none tracking-tight truncate">
                {group.name}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <button
                  onClick={copyCode}
                  className="bg-indigo-600 rounded-full pl-2.5 pr-1.5 py-0.5 flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
                >
                  <span className="font-inter text-[9px] font-black text-white uppercase tracking-widest">{group.invite_code}</span>
                  <div className="bg-white/20 p-0.5 rounded-full"><Copy size={9} className="text-white" /></div>
                </button>
                <span className="font-inter text-[9px] font-black text-slate-400 uppercase tracking-widest">🔥 {Math.floor((Date.now() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24)) + 1}d</span>
                <span className="font-inter text-[9px] font-black text-slate-400 uppercase tracking-widest">👥 {members.length}</span>
              </div>
            </div>
          </div>

          <button onClick={share} className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm active:scale-95 transition-all flex-shrink-0">
            <Share2 size={18} />
          </button>
        </header>
      }
      footer={<BottomNav />}
    >
      <div className="px-5 pb-6 flex flex-col gap-6 max-w-[430px] mx-auto pt-3">

        {/* Mode Cards Grid */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Encuesta aleatoria */}
            <button
              onClick={createPoll}
              disabled={creating || pollCount >= 3}
              className={cn(
                "flex flex-col items-start gap-3 p-4 rounded-[28px] border transition-all active:scale-[0.97] text-left",
                pollCount >= 3
                  ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                  : "bg-white border-indigo-100 shadow-md shadow-indigo-500/10 hover:border-indigo-200"
              )}
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Zap size={18} className="text-white fill-white" />
              </div>
              <div>
                <p className="font-jakarta font-black text-slate-900 text-sm leading-tight">{t.group.launchAudit}</p>
                <span className={cn(
                  "font-inter text-[9px] font-black uppercase tracking-widest mt-1 block",
                  pollCount >= 3 ? "text-slate-400" : "text-indigo-500"
                )}>
                  {pollCount}/3 hoy
                </span>
              </div>
            </button>

            {/* Predicción */}
            <button
              onClick={() => setShowPrediction(v => !v)}
              className={cn(
                "flex flex-col items-start gap-3 p-4 rounded-[28px] border transition-all active:scale-[0.97] text-left",
                showPrediction
                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/30"
                  : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center",
                showPrediction ? "bg-white/20" : "bg-slate-100"
              )}>
                <Sparkles size={18} className={showPrediction ? "text-white" : "text-slate-500"} />
              </div>
              <div>
                <p className={cn("font-jakarta font-black text-sm leading-tight", showPrediction ? "text-white" : "text-slate-900")}>
                  {t.group.manualPrediction}
                </p>
                <span className={cn("font-inter text-[9px] font-black uppercase tracking-widest mt-1 block", showPrediction ? "text-white/70" : "text-slate-400")}>
                  personalizada
                </span>
              </div>
            </button>

            {/* Auditoría IA */}
            <button
              onClick={() => setTab("audit")}
              className={cn(
                "flex flex-col items-start gap-3 p-4 rounded-[28px] border transition-all active:scale-[0.97] text-left",
                tab === "audit"
                  ? "bg-violet-600 border-violet-600 shadow-lg shadow-violet-500/30"
                  : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center",
                tab === "audit" ? "bg-white/20" : "bg-violet-50"
              )}>
                <Crown size={18} className={tab === "audit" ? "text-white" : "text-violet-500"} />
              </div>
              <div>
                <p className={cn("font-jakarta font-black text-sm leading-tight", tab === "audit" ? "text-white" : "text-slate-900")}>
                  {t.group.audit}
                </p>
                <span className={cn("font-inter text-[9px] font-black uppercase tracking-widest mt-1 block", tab === "audit" ? "text-white/70" : "text-slate-400")}>
                  {summaries.length > 0 ? `${summaries.length} reportes` : "ia · gemini"}
                </span>
              </div>
            </button>

            {/* Battle Royale */}
            <button
              onClick={() => setTab("survival")}
              className={cn(
                "flex flex-col items-start gap-3 p-4 rounded-[28px] border transition-all active:scale-[0.97] text-left",
                tab === "survival"
                  ? "bg-rose-600 border-rose-600 shadow-lg shadow-rose-500/30"
                  : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center",
                tab === "survival" ? "bg-white/20" : "bg-rose-50"
              )}>
                <Swords size={18} className={tab === "survival" ? "text-white" : "text-rose-500"} />
              </div>
              <div>
                <p className={cn("font-jakarta font-black text-sm leading-tight", tab === "survival" ? "text-white" : "text-slate-900")}>
                  {t.group.battleRoyale}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {survivalGame && survivalGame.status !== "finished" ? (
                    <>
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", tab === "survival" ? "bg-white" : "bg-rose-500")} />
                      <span className={cn("font-inter text-[9px] font-black uppercase tracking-widest", tab === "survival" ? "text-white/70" : "text-rose-500")}>activo</span>
                    </>
                  ) : (
                    <span className={cn("font-inter text-[9px] font-black uppercase tracking-widest", tab === "survival" ? "text-white/70" : "text-slate-400")}>
                      {members.length >= 4 ? "disponible" : "min. 4 jugadores"}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Prediction form */}
          <AnimatePresence>
            {showPrediction && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-5 flex flex-col gap-4">
                  <h4 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">{t.group.configPrediction}</h4>
                  <input
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-jakarta font-bold text-slate-900 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                    placeholder={t.group.placeholderPrediction}
                    value={predictionText}
                    onChange={e => setPredictionText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowPrediction(false)}>{t.group.cancel}</Button>
                    <Button onClick={createPrediction} loading={creating} disabled={!predictionText.trim()}>{t.group.launch}</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Tab System */}
        <div className="flex flex-col gap-5">
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
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-8"
              >
                <HistoryNavigator
                  tab={tab}
                  isCalendarOpen={isCalendarOpen}
                  setIsCalendarOpen={setIsCalendarOpen}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  polls={polls}
                  summaries={summaries}
                />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-1 mb-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    <h4 className="font-jakarta text-xs font-black text-slate-900 uppercase">
                      {t.group.auditsFrom} {new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long' }).format(new Date(selectedDate))}
                    </h4>
                  </div>
                  {polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white/50 border-2 border-dashed border-slate-100 rounded-[40px] text-center px-8">
                      <p className="font-inter text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.group.noRecordsDate}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate).map((poll) => {
                        const isLive = activePolls.some(a => a.id === poll.id);
                        return (
                          <Link key={poll.id} href={`/poll/${poll.id}`}>
                            <Card className={cn(
                              "p-4 flex items-center justify-between hover:scale-[1.01] transition-all",
                              isLive ? "border-indigo-200 bg-indigo-50/50 ring-1 ring-indigo-100" : "border-slate-100/50"
                            )}>
                              <div className="flex items-center gap-3 min-w-0">
                                {isLive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
                                )}
                                <p className="font-jakarta font-bold text-slate-800 text-sm leading-snug">
                                  {poll.rendered_question || poll.question}
                                </p>
                              </div>
                              <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner flex-shrink-0 ml-3",
                                isLive ? "bg-indigo-100 text-indigo-400 border-indigo-200" : "bg-slate-50 text-slate-300 border-slate-100"
                              )}>
                                <ChevronRight size={16} />
                              </div>
                            </Card>
                          </Link>
                        );
                      })}
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
                  <Card key={m.profile_id} className={cn(
                    "p-4 flex items-center gap-4 border-slate-100/50",
                    m.profile_id === lastBattleWinnerId && "border-rose-100 bg-rose-50/30"
                  )}>
                    <div className="relative flex-shrink-0">
                      <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={50} className="shadow-md" />
                      {m.profile_id === lastBattleWinnerId && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/40 border-2 border-white">
                          <Crown size={11} className="text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-jakarta font-black text-slate-900 text-sm truncate">{m.profiles?.username}</span>
                        {m.role === "creator" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                        )}
                        {m.profile_id === lastBattleWinnerId && (
                          <span className="font-inter text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-100 px-1.5 py-0.5 rounded-full">Campeón ⚔️</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={10} className="text-indigo-400 fill-indigo-400" />
                        <span className="font-inter text-[9px] text-slate-400 font-black uppercase tracking-widest">
                          {m.profiles?.points || 0} {t.group.credentials}
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
                          {m.group_points || 0}
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
                <HistoryNavigator
                  tab={tab}
                  isCalendarOpen={isCalendarOpen}
                  setIsCalendarOpen={setIsCalendarOpen}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  polls={polls}
                  summaries={summaries}
                />
                {isAdmin && isTodayDate(selectedDate) && (() => {
                  const todayHasSummary = summaries.some(
                    s => new Date(s.created_at).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
                  );
                  if (todayHasSummary) return (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-[20px] bg-indigo-50 border border-indigo-100">
                      <Sparkles size={14} className="text-indigo-400" />
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{t.group.auditReport} · {t.group.generatingAudit.replace("...", "")} ✓</span>
                    </div>
                  );
                  return (
                    <Button
                      onClick={generateAudit}
                      loading={generating}
                      disabled={pollCount < 1}
                      variant="secondary"
                      className="h-16 border-dashed border-indigo-200"
                    >
                      {!generating && <Sparkles size={18} className="text-indigo-600" />}
                      {generating ? t.group.generatingAudit : t.group.generateAudit}
                    </Button>
                  );
                })()}
                {(() => {
                  const daySummary = summaries.find(s => new Date(s.created_at).toISOString().split("T")[0] === selectedDate);
                  const dayPolls   = polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate);

                  if (!daySummary && dayPolls.length === 0) return (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/30 border-2 border-dashed border-slate-100 rounded-[40px] text-center px-12">
                      <p className="font-inter text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">{t.group.insufficientData}</p>
                    </div>
                  );

                  return (
                    <div className="flex flex-col gap-8">
                      {daySummary && (
                        <Card className="p-8 border-indigo-100 shadow-xl shadow-indigo-500/5">
                          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full mb-6">
                            <Sparkles size={12} className="fill-indigo-500" />
                            <span className="font-inter text-[10px] font-black uppercase tracking-widest">{t.group.auditReport}</span>
                          </div>
                          <div className="prose-light font-inter text-slate-700 leading-relaxed text-sm antialiased">
                            <ReactMarkdown>{daySummary.content}</ReactMarkdown>
                          </div>
                        </Card>
                      )}
                      {dayPolls.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h4 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.group.activityLog}</h4>
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

            {/* Survival Tab — Battle Royale v2 */}
            {tab === "survival" && (
              <motion.div 
                key="survival" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                {(() => {
                  // ── STATE 1: No active game ──
                  if (!survivalGame || survivalGame.status === 'finished') {
                    return (
                      <div className="flex flex-col gap-6">
                        {/* Start Card */}
                        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-[40px] p-10 flex flex-col items-center text-center gap-6 shadow-sm border border-rose-100/50">
                          <motion.div 
                            className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-5xl shadow-xl shadow-rose-500/30"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          >
                            ⚔️
                          </motion.div>
                          <div>
                            <h3 className="font-jakarta text-2xl font-black text-slate-900 mb-3 tracking-tight">{t.group.battleRoyale}</h3>
                            <p className="font-inter text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose max-w-[280px]">
                              {t.group.battleRules}
                            </p>
                          </div>
                          {isAdmin && (
                            <Button 
                              onClick={startSurvival} 
                              disabled={members.length < 4}
                              className="h-16 bg-gradient-to-r from-rose-600 to-orange-600 border-rose-500 shadow-xl shadow-rose-500/30 w-full"
                            >
                              <Swords size={18} />
                              {t.group.launchBattle}
                            </Button>
                          )}
                          {members.length < 4 && (
                            <p className="font-inter text-[9px] font-black text-rose-400 uppercase tracking-widest">{t.group.battleMinMembers}</p>
                          )}
                        </div>

                        {/* Hall of Fame */}
                        {survivalHistory.length > 0 && (
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 px-1">
                              <Trophy size={14} className="text-amber-500" />
                              <h4 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.group.battleHallOfFame}</h4>
                            </div>
                            {survivalHistory.map(game => {
                              const winner = game.participants.find(p => p.final_position === 1);
                              const totalParticipants = game.participants.length;
                              return (
                                <Card key={game.id} className="p-5 flex items-center gap-4 border-amber-100/50 bg-amber-50/30">
                                  {/* Winner avatar with red crown */}
                                  <div className="relative flex-shrink-0">
                                    <Avatar
                                      src={winner?.profiles?.avatar_url}
                                      name={winner?.profiles?.username}
                                      size={48}
                                      className="shadow-md shadow-amber-500/20"
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/40 border-2 border-white">
                                      <Crown size={11} className="text-white fill-white" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="font-jakarta font-black text-slate-900 text-sm block truncate">{winner?.profiles?.username || '—'}</span>
                                    <span className="font-inter text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                      {t.group.battleSurvived.replace("{rounds}", String(totalParticipants - 1))}
                                    </span>
                                  </div>
                                  <span className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    {new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' }).format(new Date(game.created_at))}
                                  </span>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const alive = survivalGame.participants?.filter((p: SurvivalParticipant) => !p.is_eliminated) || [];
                  const eliminated = survivalGame.participants?.filter((p: SurvivalParticipant) => p.is_eliminated)
                    .sort((a: SurvivalParticipant, b: SurvivalParticipant) => (b.eliminated_round || 0) - (a.eliminated_round || 0)) || [];
                  const isUserAlive = alive.some((p: SurvivalParticipant) => p.profile_id === user?.id);
                  const isUserParticipant = survivalGame.participants?.some((p: SurvivalParticipant) => p.profile_id === user?.id);
                  const totalSurvivalVotes = Object.values(survivalVotes).reduce((a, b) => a + b, 0);
                  const canVote = survivalGame.phase === 'final_duel' 
                    ? (isUserParticipant && !survivalVoted) // In final duel, all participants can vote
                    : (isUserAlive && !survivalVoted); // In normal rounds, only alive can vote

                  // ── STATE 3: Final Duel ──
                  if (survivalGame.phase === 'final_duel' && alive.length === 2) {
                    return (
                      <div className="flex flex-col gap-6">
                        {/* Final Duel Header */}
                        <motion.div 
                          className="bg-gradient-to-br from-rose-600 to-orange-700 rounded-[32px] p-8 text-center shadow-2xl shadow-rose-500/30"
                          animate={{ boxShadow: ["0 25px 50px -12px rgba(225,29,72,0.3)", "0 25px 50px -12px rgba(225,29,72,0.5)", "0 25px 50px -12px rgba(225,29,72,0.3)"] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <p className="font-inter text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-2">{t.group.battleFinalDuel}</p>
                          <h3 className="font-jakarta text-xl font-black text-white tracking-tight">
                            {t.group.battleFinalScenarios ? t.group.battleFinalScenarios[(survivalGame.current_round || 0) % t.group.battleFinalScenarios.length] : t.group.battleFinalDuelDesc}
                          </h3>
                        </motion.div>

                        {/* Two Finalists */}
                        <div className="grid grid-cols-2 gap-4">
                          {alive.map((p: SurvivalParticipant) => {
                            const memberData = members.find(m => m.profile_id === p.profile_id);
                            const voteCount = survivalVotes[p.profile_id] || 0;
                            return (
                              <motion.button
                                key={p.profile_id}
                                whileTap={canVote ? { scale: 0.95 } : {}}
                                onClick={() => canVote && castSurvivalVote(p.profile_id)}
                                disabled={!canVote || p.profile_id === user?.id}
                                className={cn(
                                  "rounded-[32px] p-6 flex flex-col items-center gap-4 relative overflow-hidden transition-all border-2",
                                  survivalVoted
                                    ? "bg-white border-slate-100"
                                    : "bg-gradient-to-b from-rose-50 to-white border-rose-200 shadow-lg shadow-rose-500/10 active:scale-95"
                                )}
                              >
                                <div className="relative">
                                  <Avatar src={memberData?.profiles?.avatar_url} name={memberData?.profiles?.username} size={72} className="shadow-lg" />
                                  {p.profile_id === user?.id && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-md">tú</div>
                                  )}
                                </div>
                                <span className="font-jakarta text-sm font-black text-slate-900 text-center truncate w-full">{memberData?.profiles?.username}</span>
                                {survivalVoted && totalSurvivalVotes > 0 && (
                                  <div className="w-full">
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(voteCount / totalSurvivalVotes) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full"
                                      />
                                    </div>
                                    <span className="font-inter text-[10px] font-black text-rose-500 mt-1">{voteCount} votos</span>
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        {survivalVoted && (
                          <div className="text-center py-4">
                            <p className="font-inter text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t.group.battleYouVoted}</p>
                          </div>
                        )}

                        {!isUserParticipant && (
                          <div className="bg-slate-50 rounded-2xl p-4 text-center">
                            <p className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.group.battleSpectator}</p>
                          </div>
                        )}

                        {/* Countdown + admin button for final duel */}
                        {roundDeadline && (
                          <div className="flex items-center justify-center gap-2">
                            <CountdownDisplay deadline={roundDeadline} expiredLabel="Duelo cerrado" variant="dark" />
                          </div>
                        )}
                        {isAdmin && roundExpired && (
                          <Button
                            onClick={processRound}
                            loading={processingRound}
                            className="w-full h-14 bg-gradient-to-r from-rose-600 to-orange-600 border-rose-500 shadow-xl shadow-rose-500/30"
                          >
                            <Crown size={16} className="fill-white" />
                            Coronar Ganador
                          </Button>
                        )}
                      </div>
                    );
                  }

                  // ── STATE 2: Active game — Voting phase ──
                  return (
                    <div className="flex flex-col gap-6">
                      {/* Round Header */}
                      <Card className="p-6 border-rose-100 bg-gradient-to-r from-rose-50/50 to-orange-50/50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <h3 className="font-jakarta text-lg font-black text-rose-600 tracking-tight">{t.group.battleRoyale}</h3>
                          </div>
                          <span className="font-inter text-[10px] font-black text-rose-400 uppercase tracking-widest">
                            {t.group.battleRound.replace("{current}", String(survivalGame.current_round)).replace("{total}", String(survivalGame.total_rounds))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {alive.slice(0, 5).map((p: SurvivalParticipant) => {
                                const memberData = members.find(m => m.profile_id === p.profile_id);
                                return <Avatar key={p.profile_id} src={memberData?.profiles?.avatar_url} name={memberData?.profiles?.username} size={28} />;
                              })}
                            </div>
                            <span className="font-inter text-[10px] font-black text-rose-500 uppercase tracking-widest">
                              {t.group.battleAlive.replace("{count}", String(alive.length))}
                            </span>
                          </div>
                          {roundDeadline && (
                            <CountdownDisplay deadline={roundDeadline} expiredLabel="Cerrada" variant="light" />
                          )}
                        </div>
                        {/* Admin: process round when expired */}
                        {isAdmin && roundExpired && (
                          <Button
                            onClick={processRound}
                            loading={processingRound}
                            className="mt-4 w-full h-12 bg-gradient-to-r from-rose-600 to-orange-600 border-rose-500 shadow-lg shadow-rose-500/20 text-xs"
                          >
                            <Skull size={14} />
                            Cerrar Ronda y Eliminar
                          </Button>
                        )}
                      </Card>

                      {/* Spectator Banner */}
                      {isUserParticipant && !isUserAlive && (
                        <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-3 border border-slate-200">
                          <Skull size={18} className="text-slate-400" />
                          <p className="font-inter text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.group.battleSpectator}</p>
                        </div>
                      )}

                      {/* Voting Section */}
                      <div className="flex flex-col gap-3">
                        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 mb-2">
                          <p className="font-jakarta text-sm font-bold text-rose-900 leading-snug">
                            {t.group.battleScenarios ? t.group.battleScenarios[(survivalGame.current_round || 0) % t.group.battleScenarios.length] : t.group.battleVoteEliminate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-1">
                          <Skull size={12} className="text-rose-400" />
                          <h4 className="font-inter text-[10px] font-black text-rose-500 uppercase tracking-widest">{t.group.battleVoteEliminate}</h4>
                        </div>
                        {alive.map((p: SurvivalParticipant) => {
                          const memberData = members.find(m => m.profile_id === p.profile_id);
                          const voteCount = survivalVotes[p.profile_id] || 0;
                          const isMe = p.profile_id === user?.id;
                          return (
                            <motion.button
                              key={p.profile_id}
                              whileTap={canVote && !isMe ? { scale: 0.98 } : {}}
                              onClick={() => canVote && !isMe && castSurvivalVote(p.profile_id)}
                              disabled={!canVote || isMe}
                              className={cn(
                                "relative h-16 rounded-[24px] flex items-center border overflow-hidden transition-all",
                                isMe
                                  ? "bg-indigo-50 border-indigo-100 opacity-60 cursor-default"
                                  : survivalVoted
                                    ? "bg-white border-slate-100"
                                    : "bg-gradient-to-r from-rose-600 to-orange-600 border-rose-500 shadow-lg shadow-rose-500/20"
                              )}
                            >
                              <div className="flex items-center gap-3 px-3 pointer-events-none relative z-10">
                                <Avatar src={memberData?.profiles?.avatar_url} name={memberData?.profiles?.username} size={44} className="shadow-sm" />
                                <div className="flex flex-col items-start">
                                  <span className={cn("font-black text-sm", isMe ? "text-indigo-600" : survivalVoted ? "text-slate-700" : "text-white")}>
                                    {memberData?.profiles?.username}
                                  </span>
                                  {p.is_immune && (
                                    <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                      <Shield size={9} /> {t.group.battleImmune}
                                    </span>
                                  )}
                                  {isMe && (
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                      (tú)
                                    </span>
                                  )}
                                </div>
                              </div>
                              {survivalVoted && totalSurvivalVotes > 0 && (
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${(voteCount / totalSurvivalVotes) * 100}%` }}
                                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-400 z-[1] flex items-center justify-end pr-5"
                                >
                                  <span className="font-black text-white text-sm">{Math.round((voteCount / totalSurvivalVotes) * 100)}%</span>
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}

                        {survivalVoted && (
                          <div className="text-center py-2">
                            <p className="font-inter text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2">
                              ✓ {t.group.battleYouVoted}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Elimination Timeline */}
                      {eliminated.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 px-1">
                            <Skull size={12} className="text-slate-300" />
                            <h4 className="font-inter text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.group.battleTimeline}</h4>
                          </div>
                          {eliminated.map((p: SurvivalParticipant, idx: number) => {
                            const memberData = members.find(m => m.profile_id === p.profile_id);
                            return (
                              <motion.div
                                key={p.profile_id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 opacity-60"
                              >
                                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                                  <Skull size={14} className="text-rose-400" />
                                </div>
                                <div className="relative flex-shrink-0">
                                  <Avatar src={memberData?.profiles?.avatar_url} name={memberData?.profiles?.username} size={36} className="grayscale" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-rose-500/60 rotate-[15deg]" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-jakarta font-black text-slate-500 text-xs block truncate">{memberData?.profiles?.username}</span>
                                  <span className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                    {t.group.battleEliminated.replace("{round}", String(p.eliminated_round || '?'))}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System Danger Zone */}
        <div className="pt-8 border-t border-slate-100 mt-4 flex flex-col gap-8 items-center pb-20">
          <Button variant="danger" onClick={leave} className="h-14 font-black tracking-widest uppercase text-xs">
            <LogOut size={16} />
            {t.group.leaveBtn}
          </Button>
          <p className="font-inter text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">UID: {group.id.split('-')[0]}</p>
        </div>
      </div>
    </MobileLayout>
  );
}
