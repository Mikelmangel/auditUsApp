"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar } from "@/components/ui";
import { ChevronLeft, Send, Loader2, CheckCircle2, MessageCircle, BellRing, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { groupService, pollService, commentService, nudgeService, type Poll, type GroupMember, type Comment } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
    <div className="flex items-center justify-center h-svh">
      <Loader2 size={36} className="animate-spin text-emerald-500" />
    </div>
  );

  if (!poll) return (
    <div className="flex flex-col items-center justify-center h-svh gap-6 px-6 text-center">
      <p className="text-white/40 text-lg font-bold">Encuesta no encontrada</p>
      <Link href="/">
        <button className="btn-primary" style={{ maxWidth: 200 }}>Volver al inicio</button>
      </Link>
    </div>
  );

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
  const leaderId = Object.entries(results).sort((a, b) => b[1] - a[1])[0]?.[0];
  const isPredictionOpen = poll.poll_type === 'prediction' && poll.resolution_status === 'open';

  return (
    <div className="min-h-svh flex flex-col">
      {/* Header */}
      <header className="px-5 pt-14 pb-5 flex items-center gap-4 border-b border-white/[0.06]">
        <Link href={`/groups/${poll.group_id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-[14px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <ChevronLeft size={20} />
          </motion.button>
        </Link>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50 mb-0.5 truncate">
            {(poll.groups as any)?.name || "Encuesta"}
            {(poll as any).questions?.category ? ` • ${(poll as any).questions.category}` : ""}
            {(poll as any).questions?.mode ? ` • ${(poll as any).questions.mode}` : ""}
          </p>
          <div className="flex items-center gap-2">
            {poll.is_active && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
            )}
            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none truncate">
              {poll.is_active ? "Encuesta Activa" : "Encuesta Cerrada"}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowComments(s => !s)}
          className={`flex items-center gap-2 px-3 py-2 rounded-[14px] border transition-all ${
            showComments
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/80"
          }`}
        >
          <MessageCircle size={16} />
          <span className="text-xs font-black">{comments.length}</span>
        </button>
      </header>

      <div className="px-5 pt-6 pb-40 flex-1 max-w-[430px] mx-auto w-full flex flex-col gap-5">
        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6 text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full" />

          <p className="text-lg font-black text-white leading-snug tracking-tight relative z-10">
            {poll.rendered_question || poll.question}
          </p>

          {totalVotes > 0 && (
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mt-3">
              {totalVotes} {totalVotes === 1 ? "VOTO" : "VOTOS"}
            </p>
          )}

          {poll.poll_type === 'prediction' && poll.resolution_status === 'open' && (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mt-4">
              <Lock size={12} className="text-amber-400" />
              <p className="text-xs font-black text-amber-400 uppercase tracking-wider">Predicción — Resultados ocultos</p>
            </div>
          )}

          {isAdmin && poll.is_active && poll.poll_type !== 'prediction' && (
            <button
              onClick={closePollManually}
              className="mt-5 w-full py-3 rounded-[14px] bg-red-500/8 border border-red-500/15 text-red-400 text-xs font-black uppercase tracking-wider hover:bg-red-500/12 transition-all"
            >
              Cerrar encuesta
            </button>
          )}
        </motion.div>

        {/* Render mode specific inputs */}
        {(() => {
          const pollMode = (poll as any).questions?.mode || poll.poll_type;
          
          if (pollMode === 'mc') {
            const options: string[] = (poll as any).questions?.options || [];
            return (
              <div className="flex flex-col gap-3">
                {options.map((opt, i) => {
                  const count = results[opt] || 0;
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  const isWinner = voted && opt === leaderId && totalVotes > 0;
                  const isSelected = selectedId === opt;
                  const canVote = !voted && poll.is_active;

                  return (
                    <motion.div
                      key={opt}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={canVote ? { scale: 1.015 } : {}}
                      whileTap={canVote ? { scale: 0.98 } : {}}
                      onClick={() => canVote && vote(opt)}
                      className={`relative overflow-hidden rounded-[24px] p-5 border transition-all duration-300 ${
                        canVote ? "cursor-pointer" : "cursor-default"
                      } ${
                        isWinner
                          ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
                          : isSelected && submitting
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]"
                      }`}
                    >
                      {voted && pct > 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute top-0 left-0 bottom-0 rounded-[24px] opacity-[0.06] ${
                            isWinner ? "bg-emerald-400" : "bg-white"
                          }`}
                        />
                      )}
                      
                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex-1">
                           <span className="font-black text-white text-[15px] leading-tight tracking-tight">{opt}</span>
                        </div>
                        {voted && (
                          <div className={`text-xs font-black min-w-[36px] text-right flex-shrink-0 ${
                            isWinner ? "text-emerald-400" : "text-white/30"
                          }`}>
                            {pct}%
                          </div>
                        )}
                        {submitting && isSelected && (
                          <Loader2 size={16} className="animate-spin text-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          }

          if (pollMode === 'scale') {
            const average = totalVotes > 0 
              ? (Object.entries(results).reduce((acc, [k,v]) => acc + (parseFloat(k) * v), 0) / totalVotes).toFixed(1)
              : null;
              
            return (
              <div className="card-elevated p-6 pb-8 border border-white/[0.08]">
                 {!voted && poll.is_active ? (
                   <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-white/40 text-xs font-bold">1</span>
                        <span className="text-white font-black text-2xl tracking-tighter">{selectedId || "5"}</span>
                        <span className="text-white/40 text-xs font-bold">10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" step="1"
                        value={selectedId || "5"}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <button 
                        onClick={() => vote(selectedId || "5")} 
                        disabled={submitting}
                        className="btn-primary w-full mt-2"
                      >
                       {submitting ? <Loader2 size={16} className="animate-spin" /> : "Votar"} 
                      </button>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <p className="text-white/50 text-xs font-black uppercase tracking-widest">Media del grupo</p>
                      <span className="text-6xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_24px_rgba(16,185,129,0.3)]">{average || "?"}</span>
                      <p className="text-white/30 text-[10px] mt-2 font-bold uppercase tracking-widest">basado en {totalVotes} votos</p>
                   </div>
                 )}
              </div>
            );
          }

          if (pollMode === 'free') {
            return (
              <div className="card-elevated p-6 border border-white/[0.08]">
                {!voted && poll.is_active ? (
                  <div className="flex flex-col gap-4">
                    <textarea
                      value={selectedId || ""}
                      onChange={(e) => setSelectedId(e.target.value)}
                      placeholder="Escribe tu respuesta sincera (anónima)..."
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-[16px] p-4 text-white placeholder-white/30 resize-none h-32 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button 
                      onClick={() => vote(selectedId || "")} 
                      disabled={submitting || !selectedId?.trim()}
                      className="btn-primary w-full"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : "Enviar respuesta"} 
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest text-center mb-2">Respuestas anónimas enviadas</p>
                    {Object.entries(results).map(([text, count], i) => (
                      <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-[16px] p-4 text-left">
                         <p className="text-white/90 text-sm font-medium">"{text}"</p>
                         {count > 1 && <span className="text-[10px] text-emerald-400 mt-2 block font-bold">x{count} coincidieron</span>}
                      </div>
                    ))}
                    {Object.keys(results).length === 0 && <p className="text-white/30 text-center text-sm">Aún no hay respuestas publicadas</p>}
                  </div>
                )}
              </div>
            );
          }

          if (pollMode === 'ranking') {
            const orderedIds = (selectedId || members.map(m => m.profile_id).join(',')).split(',').filter(Boolean);
            const orderedMembers = orderedIds.map(id => members.find(m => m.profile_id === id)).filter(Boolean) as GroupMember[];
            
            const moveUp = (idx: number) => {
              if (idx === 0) return;
              const newArr = [...orderedIds];
              [newArr[idx-1], newArr[idx]] = [newArr[idx], newArr[idx-1]];
              setSelectedId(newArr.join(','));
            };
            const moveDown = (idx: number) => {
              if (idx === orderedIds.length - 1) return;
              const newArr = [...orderedIds];
              [newArr[idx+1], newArr[idx]] = [newArr[idx], newArr[idx+1]];
              setSelectedId(newArr.join(','));
            };

            return (
              <div className="flex flex-col gap-3">
                {!voted && poll.is_active ? (
                  <>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest text-center mb-1 mt-2">Ordena usando las flechas</p>
                    {orderedMembers.map((m, i) => (
                       <div key={m.profile_id} className="flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] rounded-[24px] p-4 transition-all">
                         <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center font-black text-xs text-white/50 shrink-0">
                           {i + 1}
                         </div>
                         <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={40} />
                         <span className="font-bold text-[15px] text-white flex-1 truncate">{m.profiles?.username}</span>
                         <div className="flex flex-col gap-1 shrink-0">
                           <button onClick={(e) => { e.preventDefault(); moveUp(i); }} disabled={i===0} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all"><ChevronLeft className="rotate-90" size={18} /></button>
                           <button onClick={(e) => { e.preventDefault(); moveDown(i); }} disabled={i===orderedMembers.length-1} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all"><ChevronLeft className="-rotate-90" size={18} /></button>
                         </div>
                       </div>
                    ))}
                    <button 
                      onClick={() => vote(orderedIds.join(','))} 
                      disabled={submitting}
                      className="btn-primary w-full mt-4"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : "Confirmar ranking"} 
                    </button>
                  </>
                ) : (
                  <div className="card-elevated p-6 text-center border-emerald-500/30 bg-emerald-500/5 mt-2">
                     <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle2 size={32} className="text-emerald-400" />
                     </div>
                     <h3 className="text-emerald-400 font-black text-lg mb-2 capitalize italic tracking-tight">Ranking Registrado</h3>
                     <p className="text-white/60 text-sm">El grupo está ordenado en la caja fuerte.</p>
                  </div>
                )}
              </div>
            );
          }

          // Fallback Default: Members list (poll, vs)
          return (
            <div className="flex flex-col gap-3">
          {members.map((m, i) => {
            const count = results[m.profile_id] || 0;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isWinner = voted && m.profile_id === leaderId && totalVotes > 0 && poll.poll_type !== 'prediction';
            const isSelected = selectedId === m.profile_id;
            const isMe = m.profile_id === user?.id;
            const isResolvedWinner = poll.poll_type === 'prediction' && poll.resolution_status === 'resolved' && poll.resolved_target_id === m.profile_id;
            const canVote = !voted && poll.is_active;

            return (
              <motion.div
                key={m.profile_id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={canVote ? { scale: 1.015 } : {}}
                whileTap={canVote ? { scale: 0.98 } : {}}
                onClick={() => canVote && vote(m.profile_id)}
                className={`relative overflow-hidden rounded-[24px] p-5 border transition-all duration-300 ${
                  canVote ? "cursor-pointer" : "cursor-default"
                } ${
                  isResolvedWinner
                    ? "border-amber-500/40 bg-amber-500/5 shadow-[0_0_24px_rgba(245,158,11,0.15)]"
                    : isWinner
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
                    : isSelected && submitting
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]"
                }`}
              >
                {/* Progress bar fill bg */}
                {voted && !isPredictionOpen && pct > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute top-0 left-0 bottom-0 rounded-[24px] opacity-[0.06] ${
                      isResolvedWinner ? "bg-amber-400" : isWinner ? "bg-emerald-400" : "bg-white"
                    }`}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={50} />
                    {isWinner && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                        <CheckCircle2 size={12} className="text-black" />
                      </div>
                    )}
                    {isResolvedWinner && (
                      <div className="absolute -top-1 -right-1 text-base">🏆</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-white text-base tracking-tight truncate">
                        {m.profiles?.username}
                      </span>
                      {isMe && (
                        <span className="text-[9px] font-black bg-white/10 text-white/40 px-2 py-0.5 rounded-full uppercase tracking-widest flex-shrink-0">
                          TÚ
                        </span>
                      )}
                    </div>

                    {voted && !isPredictionOpen && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full ${
                              isResolvedWinner ? "bg-amber-400" : isWinner ? "bg-emerald-400" : "bg-white/30"
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-black min-w-[36px] text-right ${
                          isResolvedWinner ? "text-amber-400" : isWinner ? "text-emerald-400" : "text-white/30"
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    )}

                    {voted && isPredictionOpen && (
                      <p className="text-white/25 text-xs font-bold flex items-center gap-1.5">
                        <Lock size={10} /> Resultados ocultos
                      </p>
                    )}
                  </div>

                  {/* Admin resolve button */}
                  {isAdmin && isPredictionOpen && (
                    <button
                      onClick={(e) => { e.stopPropagation(); resolvePrediction(m.profile_id); }}
                      className="flex-shrink-0 px-3 py-2 rounded-[12px] bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider hover:bg-amber-500/15 transition-all"
                    >
                      Resolver
                    </button>
                  )}

                  {submitting && isSelected && (
                    <Loader2 size={20} className="animate-spin text-emerald-500 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        );
        })()}

        {/* Comments section */}
        <AnimatePresence>
          {(voted || showComments) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 px-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">
                  Comentarios
                </p>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-black text-white/20">{comments.length}</span>
              </div>

              <div className="flex flex-col gap-3">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 items-start">
                    <Avatar src={c.profiles?.avatar_url} name={c.profiles?.username} size={34} />
                    <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-[18px] px-4 py-3">
                      <span className="text-xs font-black text-emerald-500/80">{c.profiles?.username} </span>
                      <span className="text-sm text-white/70 leading-snug">{c.content}</span>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-white/25 text-sm text-center py-4 font-medium">
                    Sé el primero en comentar
                  </p>
                )}
                <div ref={commentsRef} />
              </div>

              <form onSubmit={sendComment} className="flex gap-3 items-center">
                <input
                  className="input flex-1"
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={200}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-12 h-[56px] flex-shrink-0 bg-emerald-500 rounded-[16px] flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors"
                >
                  <Send size={18} className="text-black" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending voters (nudge) */}
        {voted && (
          <AnimatePresence>
            {members.filter(m => !voters.includes(m.profile_id)).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3 px-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">
                    Faltan por votar
                  </p>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                <div className="flex flex-col gap-2">
                  {members.filter(m => !voters.includes(m.profile_id)).map(m => (
                    <div
                      key={m.profile_id}
                      className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-[18px] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={36} />
                        <span className="text-sm font-bold text-white/70">{m.profiles?.username}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendNudge(m.profile_id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-black uppercase tracking-wider hover:bg-white/[0.07] hover:text-white/80 transition-all"
                      >
                        <BellRing size={13} />
                        Zumbar
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {voted && members.filter(m => !voters.includes(m.profile_id)).length === 0 && (
          <p className="text-center text-emerald-500/50 text-xs font-black uppercase tracking-widest py-4">
            ✓ Todo el grupo ha votado
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
