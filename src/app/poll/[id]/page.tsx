"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar } from "@/components/ui";
import { ChevronLeft, Send, Loader2, CheckCircle2, MessageCircle, BellRing } from "lucide-react";
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100svh" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#10b981" }} />
    </div>
  );

  if (!poll) return (
    <div style={{ padding: "60px 16px", textAlign: "center" }}>
      <p style={{ color: "#9ca3af" }}>Encuesta no encontrada</p>
      <Link href="/"><button className="btn-primary" style={{ marginTop: 24, maxWidth: 200 }}>Volver</button></Link>
    </div>
  );

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
  const leaderId = Object.entries(results).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100svh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{
        background: "white", borderBottom: "1px solid #f3f4f6",
        padding: "56px 16px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href={`/groups/${poll.group_id}`}>
          <button className="btn-ghost" style={{ padding: 8, borderRadius: 12 }}>
            <ChevronLeft size={24} />
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {(poll.groups as any)?.name || "Encuesta"}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            {poll.is_active && <div className="live-dot" />}
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>
              {poll.is_active ? "Encuesta activa" : "Encuesta cerrada"}
            </h1>
          </div>
        </div>
        <button onClick={() => setShowComments(s => !s)} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none",
          border: "none", cursor: "pointer", color: "#6b7280", fontWeight: 600,
          padding: "8px 12px", borderRadius: 12,
        }}>
          <MessageCircle size={18} />
          <span style={{ fontSize: 13 }}>{comments.length}</span>
        </button>
      </div>

      <div style={{ padding: "16px 16px 96px" }}>
        {/* Question */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px",
          marginBottom: 16, border: "1px solid #f3f4f6",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.4, textAlign: "center" }}>
            {poll.rendered_question || poll.question}
          </p>
          {totalVotes > 0 && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 10 }}>
              {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
            </p>
          )}
          {poll.poll_type === 'prediction' && poll.resolution_status === 'open' && (
            <div style={{ background: "#fef3c7", padding: "8px 12px", borderRadius: 10, marginTop: 12, display: "inline-block" }}>
              <p style={{ fontSize: 13, color: "#92400e", fontWeight: 700 }}>🔮 PREDICCIÓN (Resultados ocultos)</p>
            </div>
          )}
        </div>

        {/* Members to vote / Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {members.map((m) => {
            const count = results[m.profile_id] || 0;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isWinner = voted && m.profile_id === leaderId && totalVotes > 0 && poll.poll_type !== 'prediction';
            const isSelected = selectedId === m.profile_id;
            const isMe = m.profile_id === user?.id;
            const isPredictionOpen = poll.poll_type === 'prediction' && poll.resolution_status === 'open';
            const isResolvedWinner = poll.poll_type === 'prediction' && poll.resolution_status === 'resolved' && poll.resolved_target_id === m.profile_id;

            return (
              <motion.div key={m.profile_id} whileTap={!voted ? { scale: 0.98 } : {}}
                onClick={() => !voted && vote(m.profile_id)}
                style={{
                  background: "white", borderRadius: 20, padding: "14px 16px",
                  border: isResolvedWinner ? "3px solid #f59e0b" : (isWinner ? "2px solid #10b981" : isSelected ? "2px solid #10b981" : "1px solid #f3f4f6"),
                  cursor: voted ? "default" : "pointer",
                  transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}>
                {/* Progress bar fill (when voted, unless hidden prediction) */}
                {voted && !isPredictionOpen && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute", top: 0, left: 0, bottom: 0,
                      background: isWinner ? "#ecfdf5" : "#f9fafb",
                      borderRadius: 20, zIndex: 0,
                    }}
                  />
                )}

                <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>
                        {m.profiles?.username}
                      </span>
                      {isMe && <span style={{ fontSize: 11, color: "#6b7280" }}>(Tú)</span>}
                    </div>
                    {voted && !isPredictionOpen && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                          <motion.div className="progress-fill" style={{ background: isResolvedWinner ? "#f59e0b" : undefined }}
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: isResolvedWinner ? "#f59e0b" : (isWinner ? "#10b981" : "#6b7280"), minWidth: 36 }}>
                          {pct}%
                        </span>
                      </div>
                    )}
                    {voted && isPredictionOpen && (
                      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Resultados ocultos...</p>
                    )}
                  </div>
                  {voted && isWinner && <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />}
                  {isResolvedWinner && <div style={{ fontSize: 20 }}>🏆</div>}
                  {submitting && isSelected && <Loader2 size={20} className="animate-spin" color="#10b981" style={{ flexShrink: 0 }} />}
                  
                  {/* Botón de Resolver (Solo Admins) */}
                  {isAdmin && isPredictionOpen && (
                    <button onClick={(e) => { e.stopPropagation(); resolvePrediction(m.profile_id); }}
                      className="btn-secondary" style={{ padding: "8px 12px", borderRadius: 10, fontSize: 12, borderColor: "#f59e0b", color: "#b45309", zIndex: 10, position: "relative" }}>
                      Resolver Aquí
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comments section */}
        {(voted || showComments) && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Comentarios ({comments.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {comments.map((c) => (
                <div key={c.id} style={{
                  background: "white", borderRadius: 14, padding: "10px 14px",
                  border: "1px solid #f3f4f6", display: "flex", gap: 10,
                }}>
                  <Avatar src={c.profiles?.avatar_url} name={c.profiles?.username} size={32} />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{c.profiles?.username} </span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{c.content}</span>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "16px 0" }}>
                  Sé el primero en comentar
                </p>
              )}
              <div ref={commentsRef} />
            </div>
            <form onSubmit={sendComment} style={{ display: "flex", gap: 8 }}>
              <input className="input" placeholder="Escribe un comentario..." value={newComment}
                onChange={(e) => setNewComment(e.target.value)} maxLength={200} style={{ flex: 1 }} />
              <button type="submit" style={{
                background: "#10b981", border: "none", borderRadius: 12, width: 46, height: 46,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
              }}>
                <Send size={18} color="white" />
              </button>
            </form>
          </div>
        )}

        {/* Faltan por votar (Zumbidos) */}
        {voted && (
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Faltan por votar
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {members.filter(m => !voters.includes(m.profile_id)).map(m => (
                <div key={m.profile_id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "white", padding: "10px 14px", borderRadius: 14,
                  border: "1px solid #f3f4f6"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={32} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{m.profiles?.username}</span>
                  </div>
                  <button 
                    onClick={() => sendNudge(m.profile_id)}
                    className="btn-secondary" 
                    style={{ padding: "6px 12px", borderRadius: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <BellRing size={14} /> Zumbar
                  </button>
                </div>
              ))}
              {members.filter(m => !voters.includes(m.profile_id)).length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "16px 0" }}>
                  ¡Todo el grupo ha votado!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
