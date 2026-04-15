"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, Button, Card, SectionTitle } from "@/components/ui";
import { ChevronLeft, Send, Loader2, CheckCircle2, MessageCircle, BellRing, Sparkles, Trophy, Ghost, Skull, Zap, Flame, Users } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { groupService, pollService, commentService, nudgeService, type Poll, type GroupMember, type Comment } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [showComments, setShowComments] = useState(false);
  const [voters, setVoters] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
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
      setMembers(m as GroupMember[]);
      setVoted(v);
      setResults(r);
      setComments(c);
      setVoters(votersList);
      const myRole = (m as GroupMember[]).find(x => x.profile_id === user.id)?.role;
      setIsAdmin(myRole === 'admin' || myRole === 'creator');
      setLoading(false);

      // Real-time votes
      const sub = supabase.channel(`poll-${id}`)
        .on("postgres_changes", {
          event: "INSERT", schema: "public", table: "votes",
          filter: `poll_id=eq.${id}`,
        }, () => {
          pollService.getResults(id).then(setResults);
        }).subscribe();
      return () => { supabase.removeChannel(sub); };
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
    } catch (e: any) {
      toast.error(e.message);
      setSelectedId(null);
    } finally { setSubmitting(false); }
  };

  const sendNudge = async (receiverId: string) => {
    if (!poll || !user) return;
    try {
      await nudgeService.createNudge(poll.id, user.id, receiverId);
      toast.success("¡Zumbido enviado!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const resolvePrediction = async (targetId: string) => {
    if (!poll || !user || !isAdmin) return;
    if (!confirm("¿Seguro que quieres resolver la predicción a favor de esta persona? Esto dará 50 puntos a los acertantes.")) return;
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
    if (!confirm("¿Seguro que quieres cerrar esta encuesta? Nadie más podrá votar.")) return;
    try {
      await pollService.closePoll(poll.id);
      setPoll({ ...poll, is_active: false });
      toast.success("Encuesta cerrada.");
    } catch (e: any) {
      toast.error(e.message);
    }
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

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center bg-black">
      <Loader2 size={40} className="animate-spin text-emerald-500 opacity-50" />
    </div>
  );

  if (!poll) return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-black p-6 gap-6">
      <p className="text-white/40 uppercase tracking-widest font-black text-center">Encuesta no encontrada</p>
      <Link href="/"><Button variant="primary">VOLVER AL INICIO</Button></Link>
    </div>
  );

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
  const leaderId = Object.entries(results).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh opacity-40" />

      {/* Header */}
      <header className="px-6 pt-14 pb-8 flex items-center gap-4 relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0">
        <Link href={`/groups/${poll.group_id}`}>
          <Button variant="ghost" className="p-2 w-10 h-10 rounded-xl">
            <ChevronLeft size={24} />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase truncate">
            {(poll.groups as any)?.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {poll.is_active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            <h1 className="text-sm font-black text-white uppercase tracking-tight italic">
              {poll.is_active ? "AUDITORÍA EN CURSO" : "REGISTRO CERRADO"}
            </h1>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setShowComments(s => !s)} className={cn(
          "h-10 px-4 rounded-xl flex items-center gap-2 transition-all",
          showComments ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-white/40"
        )}>
          <MessageCircle size={18} />
          <span className="text-xs font-black italic">{comments.length}</span>
        </Button>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-8 pt-6">
        {/* Main Question Card */}
        <Card className="p-8 border-emerald-500/20 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles size={100} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-white italic leading-tight uppercase tracking-tight text-center relative z-10">
            {poll.rendered_question || poll.question}
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5 flex items-center gap-3">
              <Users size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">
                {totalVotes} {totalVotes === 1 ? "PARTICIPANTE" : "PARTICIPANTES"}
              </span>
            </div>
          </div>

          {poll.poll_type === 'prediction' && poll.resolution_status === 'open' && (
            <div className="mt-6 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 flex items-center gap-3 justify-center">
              <Ghost size={18} className="text-orange-500" />
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">PREDICCIÓN ACTIVA • RESULTADOS OCULTOS</p>
            </div>
          )}

          {isAdmin && poll.is_active && poll.poll_type !== 'prediction' && (
            <Button onClick={closePollManually} variant="ghost" className="mt-6 w-full py-4 text-red-500/60 hover:text-red-500 border border-red-500/20 rounded-2xl text-[10px] uppercase font-black tracking-widest italic">
              FINALIZAR AUDITORÍA
            </Button>
          )}
        </Card>

        {/* Members / Options Section */}
        <div className="space-y-4">
          <SectionTitle>Seleccionar Objetivo</SectionTitle>
          <div className="grid gap-3">
            {members.map((m) => {
              const count = results[m.profile_id] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isWinner = voted && m.profile_id === leaderId && totalVotes > 0 && poll.poll_type !== 'prediction';
              const isSelected = selectedId === m.profile_id;
              const isPredictionOpen = poll.poll_type === 'prediction' && poll.resolution_status === 'open';
              const isResolvedWinner = poll.poll_type === 'prediction' && poll.resolution_status === 'resolved' && poll.resolved_target_id === m.profile_id;

              return (
                <motion.div 
                  key={m.profile_id} 
                  whileTap={!voted ? { scale: 0.98 } : {}}
                  onClick={() => !voted && vote(m.profile_id)}
                  className={cn(
                    "relative overflow-hidden p-4 rounded-3xl border transition-all duration-300",
                    isResolvedWinner ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/5" :
                    (isWinner || isSelected) ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/5" :
                    "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                  )}
                >
                  {/* Progress Bar Background */}
                  {voted && !isPredictionOpen && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "absolute inset-0 opacity-[0.15] z-0",
                        isWinner ? "bg-emerald-500" : "bg-white"
                      )}
                    />
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={56} className={cn(
                      "transition-all duration-500",
                      isWinner ? "ring-4 ring-emerald-500/50 scale-110" : "ring-2 ring-white/5"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white italic uppercase tracking-tighter truncate leading-none mb-1">
                        {m.profiles?.username}
                      </p>
                      {voted && !isPredictionOpen && (
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={cn("h-full", isResolvedWinner ? "bg-yellow-500" : "bg-emerald-500")}
                              />
                           </div>
                           <span className={cn("text-xs font-black italic", isResolvedWinner ? "text-yellow-500" : isWinner ? "text-emerald-500" : "text-white/20")}>
                             {pct}%
                           </span>
                        </div>
                      )}
                      {voted && isPredictionOpen && (
                        <p className="text-[8px] font-black text-white/20 tracking-widest uppercase italic">Registro encriptado</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {voted && isWinner && <CheckCircle2 size={24} className="text-emerald-500" />}
                      {isResolvedWinner && <Trophy size={24} className="text-yellow-500 animate-bounce" />}
                      {submitting && isSelected && <Loader2 size={24} className="animate-spin text-emerald-500" />}
                      
                      {isAdmin && isPredictionOpen && (
                        <Button onClick={(e) => { e.stopPropagation(); resolvePrediction(m.profile_id); }} variant="primary" className="h-auto py-2 px-4 rounded-xl text-[9px] bg-orange-500 hover:bg-orange-600">
                          RESOLVER
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {(voted || showComments) && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                 <SectionTitle className="mb-0">Intercepciones</SectionTitle>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <div className="grid gap-3">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] group">
                    <Avatar src={c.profiles?.avatar_url} name={c.profiles?.username} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs text-emerald-500 italic uppercase mb-1 tracking-tight">{c.profiles?.username}</p>
                      <p className="text-sm text-white/60 leading-relaxed font-medium">{c.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="text-center py-12 bg-white/[0.01] border border-dashed border-white/5 rounded-[2rem]">
                     <MessageCircle size={30} className="mx-auto text-white/5 mb-2" />
                     <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Silencio absoluto</p>
                  </div>
                )}
                <div ref={commentsRef} />
              </div>

              <form onSubmit={sendComment} className="flex gap-2 relative">
                <input className="input py-6 pl-6 pr-16 bg-white/[0.03] border-white/10 text-white font-medium italic rounded-[2rem]" placeholder="ENVIAR MENSAJE..." value={newComment}
                  onChange={(e) => setNewComment(e.target.value)} maxLength={200} />
                <button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform">
                  <Send size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Missing Voters Section */}
        {voted && (
          <section className="space-y-4 mt-8">
            <SectionTitle>Faltan por Comparecer</SectionTitle>
            <div className="grid gap-2">
              {members.filter(m => !voters.includes(m.profile_id)).map(m => (
                <div key={m.profile_id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
                  <div className="flex items-center gap-3">
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={32} className="grayscale group-hover:grayscale-0 transition-opacity" />
                    <span className="text-xs font-black text-white/40 group-hover:text-white/80 transition-colors uppercase italic">{m.profiles?.username}</span>
                  </div>
                  <Button 
                    onClick={() => sendNudge(m.profile_id)}
                    variant="ghost" 
                    className="h-auto py-2 px-4 rounded-xl border-white/10 text-emerald-500/60 hover:text-emerald-500 text-[10px] font-black uppercase italic tracking-widest"
                  >
                    <BellRing size={14} className="mr-2" /> ZUMBAR
                  </Button>
                </div>
              ))}
              {members.filter(m => !voters.includes(m.profile_id)).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-20 italic">
                   <Skull size={32} />
                   <p className="text-[9px] font-black tracking-[0.3em] uppercase">TODOS LOS AGENTES HAN VOTADO</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
