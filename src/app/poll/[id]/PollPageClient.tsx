"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar } from "@/components/ui";
import { MobileLayout } from "@/components/MobileLayout";
import { Capacitor } from "@capacitor/core";

import { Loader2, BellRing, Home, ChevronLeft, Lock, ChevronUp, ChevronDown } from "lucide-react";
import { showInterstitialAd, AdMobProvider, INTERSTITIAL_AD_ID } from "@/components/ads/AdMobInterstitial";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  groupService, pollService, commentService, nudgeService,
  type Poll, type GroupMember, type Comment,
} from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CATEGORY_CONFIG: Record<string, { bg: string; emoji: string; label: string }> = {
  humor:      { bg: "from-amber-500 to-orange-600",    emoji: "😂", label: "Humor" },
  habilidades:{ bg: "from-emerald-500 to-teal-600",    emoji: "💪", label: "Habilidades" },
  futuro:     { bg: "from-violet-600 to-purple-700",   emoji: "🔮", label: "Futuro" },
  atrevidas:  { bg: "from-rose-500 to-pink-600",       emoji: "🌶️", label: "Atrevidas" },
  hipoteticas:{ bg: "from-cyan-500 to-blue-600",       emoji: "🧠", label: "Hipotéticas" },
  vinculos:   { bg: "from-yellow-500 to-amber-600",   emoji: "💛", label: "Vínculos" },
  eventos:    { bg: "from-fuchsia-500 to-purple-600",  emoji: "🎉", label: "Eventos" },
  ia_custom:  { bg: "from-indigo-600 to-blue-700",     emoji: "🤖", label: "IA" },
  general:    { bg: "from-indigo-600 to-indigo-700",    emoji: "❓", label: "General" },
};

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [voted, setVoted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNudgeList, setShowNudgeList] = useState(false);
  const [voters, setVoters] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  // Ranking mode
  const [rankOrder, setRankOrder] = useState<GroupMember[]>([]);
  const [rankingResults, setRankingResults] = useState<{ memberId: string; avgRank: number; voteCount: number }[]>([]);
  // Free-text mode
  const [freeText, setFreeText] = useState("");
  const [freeAnswers, setFreeAnswers] = useState<string[]>([]);

  const { user } = useAuth();
  const router = useRouter();
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const p = await pollService.getPoll(id);
      if (!p || !user) { setLoading(false); return; }
      setPoll(p);
      const [m, v, r, c, votersList] = await Promise.all([
        groupService.getGroupMembers(p.group_id),
        pollService.hasVoted(id, user.id),
        pollService.getResults(id),
        commentService.getComments(id),
        pollService.getVoters(id),
      ]);
      const memberList = m as GroupMember[];
      setMembers(memberList);
      setVoted(v);
      setResults(r);
      setComments(c);
      setVoters(votersList);
      const myRole = memberList.find(x => x.profile_id === user.id)?.role;
      setIsAdmin(myRole === 'admin' || myRole === 'creator');

      const pollMode = p.questions?.mode || p.poll_type;
      if (pollMode === 'ranking' || pollMode === 'ranked') {
        setRankOrder([...memberList].sort(() => Math.random() - 0.5));
        if (v) {
          const rr = await pollService.getRankingResults(id);
          setRankingResults(rr);
        }
      }
      if (pollMode === 'free' && p.phase === 'guessing') {
        const answers = await pollService.getFreeAnswers(id);
        setFreeAnswers(answers);
      }

      setLoading(false);

      const voteSub = supabase.channel(`poll-votes-${id}-${Math.random().toString(36).substring(7)}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes", filter: `poll_id=eq.${id}` }, () => {
          pollService.getResults(id).then(setResults);
          pollService.getVoters(id).then(setVoters);
        }).subscribe();

      const pollSub = supabase.channel(`poll-phase-${id}-${Math.random().toString(36).substring(7)}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "polls", filter: `id=eq.${id}` }, (payload) => {
          if (payload.new.phase === 'guessing') {
            setPoll(prev => prev ? { ...prev, phase: 'guessing' } : prev);
            pollService.getFreeAnswers(id).then(setFreeAnswers);
          }
        }).subscribe();

      return () => {
        supabase.removeChannel(voteSub);
        supabase.removeChannel(pollSub);
      };
    };
    load();
  }, [params, user]);

  const vote = async (targetId: string) => {
    if (voted || !poll || !user) return;
    setSelectedId(targetId);
    setSubmitting(true);
    try {
      await pollService.castVote(poll.id, user.id, targetId);
      setVoted(true);
      setVoters(prev => [...prev, user.id]);
      const r = await pollService.getResults(poll.id);
      setResults(r);
      toast.success("¡Voto registrado! +10 puntos");
      if (Capacitor.isNativePlatform()) showInterstitialAd().catch(() => {});
    } catch (e: any) {
      toast.error(e.message);
      setSelectedId(null);
    } finally { setSubmitting(false); }
  };

  const moveRankUp = (idx: number) => {
    if (idx === 0) return;
    setRankOrder(prev => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveRankDown = (idx: number) => {
    setRankOrder(prev => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const voteRanking = async () => {
    if (voted || !poll || !user || rankOrder.length === 0) return;
    setSubmitting(true);
    try {
      await pollService.castRankingVote(poll.id, user.id, rankOrder.map(m => m.profile_id));
      setVoted(true);
      setVoters(prev => [...prev, user.id]);
      const rr = await pollService.getRankingResults(poll.id);
      setRankingResults(rr);
      toast.success("¡Ranking enviado! +10 puntos");
      if (Capacitor.isNativePlatform()) showInterstitialAd().catch(() => {});
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSubmitting(false); }
  };

  const submitFreeAnswer = async () => {
    if (!freeText.trim() || !poll || !user || voted) return;
    setSubmitting(true);
    try {
      await pollService.castVote(poll.id, user.id, freeText.trim().substring(0, 120));
      setVoted(true);
      const newVoters = [...voters, user.id];
      setVoters(newVoters);
      if (newVoters.length >= members.length) {
        await pollService.transitionToGuessing(poll.id);
        setPoll(prev => prev ? { ...prev, phase: 'guessing' } : prev);
        const answers = await pollService.getFreeAnswers(poll.id);
        setFreeAnswers(answers);
      }
      toast.success("¡Respuesta enviada! +10 puntos");
      if (Capacitor.isNativePlatform()) showInterstitialAd().catch(() => {});
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSubmitting(false); }
  };

  const handleTransitionToGuessing = async () => {
    if (!poll || !isAdmin) return;
    try {
      await pollService.transitionToGuessing(poll.id);
      setPoll(prev => prev ? { ...prev, phase: 'guessing' } : prev);
      const answers = await pollService.getFreeAnswers(poll.id);
      setFreeAnswers(answers);
      toast.success("Fase de adivinanza activada");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const sendNudge = async (receiverId: string) => {
    if (!poll || !user) return;
    try {
      await nudgeService.createNudge(poll.id, user.id, receiverId);
      const sender = members.find(m => m.profile_id === user.id);
      const senderName = (sender as any)?.profiles?.username ?? 'alguien';
      
      const { data: { session } } = await supabase.auth.getSession();
      
      fetch('/api/push/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session && { 'Authorization': `Bearer ${session.access_token}` })
        },
        body: JSON.stringify({
          receiverId,
          payload: {
            title: `¡Zumbido de ${senderName}!`,
            body: `Te están esperando para votar en "${poll.rendered_question || poll.question}"`,
            url: `/poll/${poll.id}`,
          },
        }),
      }).catch(() => {});
      toast.success("¡Zumbido enviado!");
    } catch (e: any) { toast.error(e.message); }
  };

  const resolvePrediction = async (targetId: string) => {
    if (!poll || !user || !isAdmin) return;
    if (!confirm("¿Seguro? Esto dará 50 puntos a los acertantes.")) return;
    setSubmitting(true);
    try {
      await pollService.resolvePrediction(poll.id, targetId, user.id);
      setPoll({ ...poll, is_active: false, resolution_status: 'resolved', resolved_target_id: targetId });
      toast.success("¡Predicción resuelta y puntos repartidos!");
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSubmitting(false); }
  };

  const closePollManually = async () => {
    if (!poll || !isAdmin) return;
    if (!confirm("¿Cerrar la encuesta? Nadie más podrá votar.")) return;
    try {
      await pollService.closePoll(poll.id);
      setPoll({ ...poll, is_active: false });
      toast.success("Encuesta cerrada.");
    } catch (e: any) { toast.error(e.message); }
  };

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !poll || !user) return;
    try {
      const c = await commentService.addComment(poll.id, user.id, newComment.trim());
      setComments(prev => [...prev, c]);
      setNewComment("");
      setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) { toast.error(e.message); }
  };

  const [nextQuestionTime, setNextQuestionTime] = useState("00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = nextDay.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setNextQuestionTime(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-svh">
      <Loader2 size={36} className="animate-spin text-emerald-500" />
    </div>
  );

  if (!poll) return (
    <div className="flex flex-col items-center justify-center h-svh gap-6 px-6 text-center">
      <p className="text-white/40 text-lg font-bold">Encuesta no encontrada</p>
      <Link href="/"><button className="btn-primary" style={{ maxWidth: 200 }}>Volver al inicio</button></Link>
    </div>
  );

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
  const pollMode = poll.questions?.mode || poll.poll_type;
  const isAnonymous = poll.questions?.is_anonymous || poll.questions?.category === 'atrevidas';
  const scaleAvg = totalVotes > 0
    ? (Object.entries(results).reduce((sum, [k, v]) => sum + Number(k) * v, 0) / totalVotes).toFixed(1)
    : null;

  const pollCategory = poll.questions?.category || "general";
  const cat = CATEGORY_CONFIG[pollCategory] ?? CATEGORY_CONFIG["general"];

  return (
    <MobileLayout
      header={
        <header
          className={cn("px-5 text-center rounded-b-[32px] shadow-xl shadow-indigo-900/20 bg-gradient-to-br", cat.bg)}
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2.5rem)', paddingBottom: '20px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push(`/groups/${poll.group_id}`)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 active:scale-90 transition-transform"
              aria-label="Volver al grupo"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Nueva en</span>
              <span className="text-sm font-black text-white tabular-nums">{nextQuestionTime}</span>
              <button
                title={`Categoría: ${cat.label}`}
                className="text-base"
              >
                {cat.emoji}
              </button>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 active:scale-90 transition-transform"
              aria-label="Menú principal"
            >
              <Home size={18} strokeWidth={2.5} />
            </button>
          </div>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-jakarta text-lg font-black text-white leading-snug tracking-tight px-2"
          >
            {poll.rendered_question || poll.question}
          </motion.p>
        </header>
      }
      footer={<BottomNav />}
    >
      <main className="flex-1 px-5 mt-4 relative z-10 flex flex-col gap-5 max-w-[430px] mx-auto w-full pb-8">

        {/* Progress + Nudge */}
        {(() => {
          const pending = members.filter(m => !voters.includes(m.profile_id));
          const allVoted = pending.length === 0;
          return (
            <div className="bg-white/80 backdrop-blur-md rounded-[20px] border border-black/5 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 gap-3"
                onClick={() => !allVoted && setShowNudgeList(v => !v)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-1 h-1 rounded-full bg-indigo-500" />
                  </div>
                  <span className="text-xs font-black text-indigo-600">
                    Han respondido {voters.length} de {members.length}
                  </span>
                </div>
                {allVoted ? (
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">✓ Completo</span>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    <BellRing size={11} />
                    Enviar zumbido
                  </div>
                )}
              </button>

              <AnimatePresence>
                {showNudgeList && pending.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-1 border-t border-black/5 flex flex-col gap-2">
                      {pending.map(m => (
                        <div key={m.profile_id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={32} />
                            <span className="text-sm font-black text-gray-900">{m.profiles?.username}</span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => sendNudge(m.profile_id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-wider active:bg-indigo-100 transition-all"
                          >
                            <BellRing size={11} />
                            Zumbar
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()}

        {/* Voting area */}
        {poll.is_active ? (
          <div className="flex flex-col gap-4">

            {/* VS */}
            {pollMode === 'vs' && (
              <div className="flex flex-col gap-3">
                {[
                  { m: members.find(m => m.profile_id === poll.vs_member_a), id: poll.vs_member_a },
                  { m: members.find(m => m.profile_id === poll.vs_member_b), id: poll.vs_member_b },
                ].map(({ m, id }) => m && id && (
                  <motion.button key={id} whileTap={{ scale: 0.98 }} onClick={() => !voted && vote(id)}
                    className={cn(
                      "relative h-14 rounded-[20px] flex items-center border overflow-hidden transition-all",
                      voted ? "bg-slate-50 border-slate-100" : "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/20"
                    )}
                  >
                    <div className="flex items-center gap-3 px-2 pointer-events-none relative z-10">
                      <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={44} />
                      <span className={cn("font-black text-base", voted ? "text-slate-700" : "text-white")}>{m.profiles?.username}</span>
                    </div>
                    {voted && totalVotes > 0 && (
                      <motion.div initial={{ width: 0 }} animate={{ width: `${((results[id] || 0) / totalVotes) * 100}%` }}
                        className="absolute inset-0 bg-indigo-500 z-[1] flex items-center justify-end pr-5"
                      >
                        <span className="font-black text-white text-sm">{Math.round(((results[id] || 0) / totalVotes) * 100)}%</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Poll (vote any member) */}
            {(pollMode === 'poll' || pollMode === 'prediction') && (
              <div className="flex flex-col gap-3">
                {members.map((m) => (
                  <motion.button key={m.profile_id} whileTap={{ scale: 0.98 }} onClick={() => !voted && vote(m.profile_id)}
                    className={cn(
                      "relative h-14 rounded-[20px] flex items-center border overflow-hidden transition-all",
                      voted ? "bg-slate-50 border-slate-100" : "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/20"
                    )}
                  >
                    <div className="flex items-center gap-3 px-2 pointer-events-none relative z-10">
                      <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={44} />
                      <span className={cn("font-black text-base", voted ? "text-slate-700" : "text-white")}>{m.profiles?.username}</span>
                    </div>
                    {voted && totalVotes > 0 && (
                      <motion.div initial={{ width: 0 }} animate={{ width: `${((results[m.profile_id] || 0) / totalVotes) * 100}%` }}
                        className="absolute inset-0 bg-indigo-500 z-[1] flex items-center justify-end pr-5"
                      >
                        <span className="font-black text-white text-sm">{Math.round(((results[m.profile_id] || 0) / totalVotes) * 100)}%</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
                {pollMode === 'prediction' && voted && isAdmin && poll.resolution_status === 'open' && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resolver predicción (admin)</p>
                    {members.map(m => (
                      <button key={m.profile_id} onClick={() => resolvePrediction(m.profile_id)}
                        className="h-10 rounded-full border border-dashed border-indigo-400/40 text-xs font-black text-indigo-600 px-4"
                      >
                        ✓ {m.profiles?.username} ganó
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Multiple choice */}
            {pollMode === 'mc' && (
              <div className="flex flex-col gap-3">
                {(poll.questions?.options || []).map((opt: string) => (
                  <motion.button key={opt} whileTap={{ scale: 0.98 }} onClick={() => !voted && vote(opt)}
                    className={cn(
                      "relative h-14 rounded-[20px] flex items-center border transition-all overflow-hidden",
                      voted ? "bg-slate-50 border-slate-100" : "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/20"
                    )}
                  >
                    <span className={cn("px-6 font-black relative z-10", voted ? "text-slate-700" : "text-white")}>{opt}</span>
                    {voted && totalVotes > 0 && (
                      <motion.div initial={{ width: 0 }} animate={{ width: `${((results[opt] || 0) / totalVotes) * 100}%` }}
                        className="absolute inset-0 bg-indigo-500 z-[5] flex items-center justify-end pr-5"
                      >
                        <span className="font-black text-white text-sm">{Math.round(((results[opt] || 0) / totalVotes) * 100)}%</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Scale 1-10 */}
            {pollMode === 'scale' && (
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 flex flex-col gap-4">
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button key={n} onClick={() => !voted && vote(String(n))}
                      className={cn(
                        "h-12 rounded-2xl font-black text-sm transition-all",
                        selectedId === String(n)
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                          : voted && (results[String(n)] || 0) > 0
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {voted && scaleAvg && (
                  <div className="text-center pt-2">
                    <span className="text-3xl font-black text-indigo-600">{scaleAvg}</span>
                    <span className="text-sm font-bold text-gray-400 ml-1">/ 10 media del grupo</span>
                  </div>
                )}
              </div>
            )}

            {/* Ranking */}
            {(pollMode === 'ranking' || pollMode === 'ranked') && (
              <div className="flex flex-col gap-3">
                {!voted ? (
                  <>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Ordena con las flechas · 1 = mejor</p>
                    {rankOrder.map((m, idx) => (
                      <div key={m.profile_id} className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-3 border border-black/5 shadow-sm">
                        <span className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-black text-sm text-white flex-shrink-0">{idx + 1}</span>
                        <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={36} />
                        <span className="font-black text-gray-900 text-sm flex-1">{m.profiles?.username}</span>
                        <div className="flex flex-col gap-0.5 ml-auto">
                          <button onClick={() => moveRankUp(idx)} disabled={idx === 0}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:bg-gray-200 transition-colors"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button onClick={() => moveRankDown(idx)} disabled={idx === rankOrder.length - 1}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:bg-gray-200 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <motion.button whileTap={{ scale: 0.98 }} onClick={voteRanking} disabled={submitting}
                      className="h-14 rounded-[20px] bg-indigo-600 border border-indigo-600 font-black text-white text-base shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : "🏅 Confirmar ranking"}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Ranking del grupo ({voters.length} votos)</p>
                    {(rankingResults.length > 0 ? rankingResults : rankOrder.map((m, idx) => ({ memberId: m.profile_id, avgRank: idx + 1, voteCount: 0 }))).map((r, idx) => {
                      const m = members.find(x => x.profile_id === r.memberId);
                      if (!m) return null;
                      return (
                        <div key={r.memberId} className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-3 border border-black/5 shadow-sm">
                          <span className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-black text-sm text-white flex-shrink-0">{idx + 1}</span>
                          <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={36} />
                          <span className="font-black text-gray-900 text-sm flex-1">{m.profiles?.username}</span>
                          {r.voteCount > 0 && <span className="text-xs font-black text-gray-400">avg {r.avgRank.toFixed(1)}</span>}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* Free text */}
            {pollMode === 'free' && (
              <div className="flex flex-col gap-3">
                {poll.phase === 'guessing' ? (
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#FAECE7] rounded-[24px] p-4 text-center border border-[#F0997B]/30">
                      <p className="text-sm font-black text-[#4A1B0C]">🔍 Fase de adivinanza</p>
                      <p className="text-xs text-[#993C1D] mt-1">{freeAnswers.length} respuestas anónimas — ¿quién escribió cada una?</p>
                    </div>
                    {freeAnswers.map((answer, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                        className="bg-white rounded-[24px] p-5 shadow-sm border border-black/5"
                      >
                        <p className="text-sm font-bold text-gray-700 italic leading-relaxed">"{answer}"</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {members.map(m => (
                            <div key={m.profile_id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-black text-gray-600">
                              <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={18} />
                              {m.profiles?.username}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 flex flex-col gap-4">
                    {isAnonymous && (
                      <div className="flex items-center gap-2 text-xs font-black text-[#4A1B0C] bg-[#FAECE7] px-3 py-2 rounded-full w-fit">
                        <Lock size={12} />
                        Respuesta anónima
                      </div>
                    )}
                    <textarea
                      className="w-full border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-800 bg-slate-50 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
                      rows={4}
                      maxLength={120}
                      placeholder="Escribe tu respuesta... (máx. 120 caracteres)"
                      value={freeText}
                      onChange={e => setFreeText(e.target.value)}
                      disabled={voted}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">{freeText.length}/120</span>
                      {!voted ? (
                        <motion.button whileTap={{ scale: 0.97 }} onClick={submitFreeAnswer} disabled={!freeText.trim() || submitting}
                          className="bg-indigo-600 text-white font-black px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/20 disabled:opacity-40 flex items-center gap-2"
                        >
                          {submitting ? <Loader2 size={14} className="animate-spin" /> : "Enviar"}
                        </motion.button>
                      ) : (
                        <span className="text-sm font-black text-indigo-600">✓ Enviada</span>
                      )}
                    </div>
                    {voted && (
                      <p className="text-center text-xs text-gray-400 font-medium">
                        Esperando a que todos respondan... {voters.length}/{members.length}
                      </p>
                    )}
                    {voted && isAdmin && (
                      <button onClick={handleTransitionToGuessing}
                        className="text-xs font-black text-[#993C1D] bg-[#FAECE7] px-4 py-2 rounded-full w-fit mx-auto"
                      >
                        Forzar fase de adivinanza (admin)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Admin close */}
            {isAdmin && pollMode !== 'free' && (
              <div className="flex justify-center">
                <button onClick={closePollManually} className="text-xs font-black text-gray-400 uppercase tracking-wider hover:text-red-400 transition-colors">
                  Cerrar encuesta
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Votación Finalizada</p>
          </div>
        )}

        {/* Comments */}
        <div className="flex flex-col gap-3 pb-4" ref={commentsRef}>
          <div className="flex items-center gap-3 px-1">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map(m => (
                <Avatar key={m.profile_id} src={m.profiles?.avatar_url} name={m.profiles?.username} size={28} />
              ))}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {comments.length === 0 ? "Sin comentarios" : `${comments.length} Comentario${comments.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {comments.length > 0 && (
            <div className="flex flex-col gap-2">
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3 border border-black/5 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 flex-shrink-0">
                    {c.profiles?.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{c.profiles?.username}</p>
                    <p className="text-sm text-gray-800 font-medium leading-snug">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={sendComment} className="bg-white/70 rounded-[32px] p-2 pl-5 flex items-center gap-2 border border-black/5 backdrop-blur-sm shadow-sm">
            <input
              className="bg-transparent border-none outline-none font-bold text-gray-800 text-sm flex-1 placeholder:text-gray-300 min-w-0"
              placeholder="Tu reacción 😂😳😠"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={!newComment.trim()}
              className="bg-[#f36b2d] text-white font-black px-5 py-2.5 rounded-[22px] shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0"
            >
              Enviar
            </button>
          </form>
        </div>

      </main>
    </MobileLayout>
  );
}
