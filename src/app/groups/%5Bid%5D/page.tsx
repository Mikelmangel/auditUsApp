"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav, Avatar, Button, Card, SectionTitle } from "@/components/ui";
import { ChevronLeft, Copy, Check, Crown, Flame, Zap, Plus, Share2, LogOut, Loader2, Users, ShieldCheck, UserMinus, Sparkles, Ghost, Skull } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { groupService, pollService, questionService, summaryService, survivalService, type Group, type GroupMember, type Poll } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [predictionText, setPredictionText] = useState("");
  const [tab, setTab] = useState<"polls" | "members" | "audit" | "survival">("polls");
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
      if (!q) { toast.error("No hay preguntas disponibles"); return; }
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

  const generateAudit = async () => {
    if (!group) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/groups/${group.id}/audit`, {
        method: "POST",
        body: JSON.stringify({ groupName: group.name }),
      });
      if (!res.ok) throw new Error("Error al generar auditoría");
      const newSummary = await res.json();
      setSummaries(prev => [newSummary, ...prev]);
      toast.success("Auditoría Finalizada");
    } catch (e: any) {
      toast.error("Error en el procesado");
    } finally { setGenerating(false); }
  };

  const leave = async () => {
    if (!group || !user || !confirm("¿Abandonar el grupo?")) return;
    await groupService.leaveGroup(group.id, user.id);
    toast.success("Has salido del grupo");
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center bg-black">
      <Loader2 size={40} className="animate-spin text-emerald-500 opacity-50" />
    </div>
  );

  if (!group) return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-black p-6 gap-6">
      <p className="text-white/40 uppercase tracking-widest font-black text-center">Grupo no encontrado</p>
      <Link href="/"><Button variant="primary">VOLVER AL INICIO</Button></Link>
    </div>
  );

  const activePolls = polls.filter(p => p.is_active && (!p.expires_at || new Date(p.expires_at) > new Date()));
  const ranking = [...members].sort((a, b) => (b.profiles?.points || 0) - (a.profiles?.points || 0));
  const currentUserRole = members.find(m => m.profile_id === user?.id)?.role;
  const isAdmin = currentUserRole === "admin" || currentUserRole === "creator";

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
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh opacity-30" />

      {/* Header */}
      <header className="px-6 pt-14 pb-12 flex items-center gap-4 relative z-10">
        <Link href="/">
          <Button variant="ghost" className="p-2 w-10 h-10 rounded-xl">
            <ChevronLeft size={24} />
          </Button>
        </Link>
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10 italic font-black">
          {group.avatar_emoji || "🔮"}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter truncate leading-tight">
            {group.name}
          </h1>
          <p className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase opacity-70">
            {group.member_count || members.length} AGENTES ACTIVOS
          </p>
        </div>
        <Button variant="ghost" onClick={share} className="p-2 w-10 h-10 rounded-xl">
          <Share2 size={20} className="text-white/40" />
        </Button>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-8">
        
        {/* Info & Invite Sections */}
        <section className="space-y-4">
          <div className="flex gap-4 items-center">
            <SectionTitle className="mb-0 flex-1">Acceso al Grupo</SectionTitle>
            <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500 tracking-widest uppercase italic">Sistema Online</span>
            </div>
          </div>
          
          <Card className="p-4 flex items-center gap-4 border-emerald-500/10 group">
            <div className="flex-1">
              <p className="text-[9px] font-black text-white/20 tracking-widest mb-2 uppercase">Credencial de acceso</p>
              <div className="text-3xl font-black tracking-[0.3em] text-white italic transition-all group-hover:tracking-[0.4em] duration-500">
                {group.invite_code}
              </div>
            </div>
            <Button onClick={copyCode} variant={copied ? "primary" : "ghost"} className="w-14 h-14 rounded-2xl p-0 transition-all">
              {copied ? <Check size={24} className="text-black" /> : <Copy size={20} className="text-emerald-500/40" />}
            </Button>
          </Card>
        </section>

        {/* Action Center */}
        <section className="space-y-4">
          <SectionTitle>Centro de Operaciones</SectionTitle>
          <div className="grid gap-3">
            <AnimatePresence>
              {activePolls.map(activePoll => (
                <Link key={activePoll.id} href={`/poll/${activePoll.id}`} className="block">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-emerald-500 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] border-b-4 border-emerald-700 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles size={60} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      <span className="text-[9px] font-black text-white/80 uppercase tracking-widest leading-none">
                        CRÍTICO • CIERRA {new Date(activePoll.expires_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xl font-black text-white italic leading-tight uppercase tracking-tight">
                      {activePoll.rendered_question || activePoll.question}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>

            {pollCount < 3 && (
              <Button 
                onClick={createPoll} 
                disabled={creating} 
                variant="primary" 
                className="py-6 rounded-3xl gap-3 shadow-xl italic"
              >
                {creating ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                <span className="tracking-tight">{creating ? "PROCESANDO..." : `SOLICITAR AUDITORÍA (${pollCount}/3)`}</span>
              </Button>
            )}
          </div>
        </section>

        {/* Dynamic Tabs */}
        <section className="space-y-6">
          <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl overflow-x-auto hide-scrollbar">
            {([["polls","STATUS"], ["members","EQUIPO"], ["audit", "INTELIGENCIA"], ["survival", "LOGROS"]] as const).map(([key, label]) => (
              <button 
                key={key} 
                onClick={() => setTab(key)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                  tab === key ? "bg-emerald-500 text-black italic shadow-lg" : "text-white/20 hover:text-white/60"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "polls" && (
              <motion.div key="polls" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                {polls.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                    <Ghost size={40} className="mx-auto text-white/5 mb-4" />
                    <p className="text-[10px] font-black text-white/20 tracking-widest uppercase">Sin registros en base</p>
                  </div>
                ) : polls.map((poll) => (
                  <Link key={poll.id} href={`/poll/${poll.id}`}>
                    <Card className={cn(
                      "p-5 flex items-center gap-4 group transition-all",
                      poll.is_active ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "opacity-60"
                    )}>
                      {poll.is_active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      <p className="flex-1 font-bold text-white/80 text-sm leading-snug">
                        {poll.rendered_question || poll.question}
                      </p>
                      <ChevronLeft size={16} className="text-white/10 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all rotate-180" />
                    </Card>
                  </Link>
                ))}
              </motion.div>
            )}

            {tab === "members" && (
              <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-3">
                {ranking.map((m, i) => (
                  <div key={m.profile_id} className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl flex items-center gap-4 group">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm italic",
                      i === 0 ? "bg-yellow-500 text-black" : "bg-white/5 text-white/20"
                    )}>
                      {i + 1}
                    </div>
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.username} size={48} className="ring-2 ring-white/5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white uppercase tracking-tight">{m.profiles?.username}</span>
                        {m.role === "creator" && <Crown size={12} className="text-yellow-500" />}
                        {m.role === "admin" && <ShieldCheck size={12} className="text-blue-500" />}
                      </div>
                      <div className="flex gap-4 mt-1 opacity-40">
                         <span className="text-[9px] font-black flex items-center gap-1 uppercase italic tracking-widest">
                            <Zap size={10} className="text-emerald-500" /> {m.profiles?.points || 0} PTS
                         </span>
                         <span className="text-[9px] font-black flex items-center gap-1 uppercase italic tracking-widest">
                            <Flame size={10} className="text-orange-500" /> RACHA {m.profiles?.current_streak || 0}
                         </span>
                      </div>
                    </div>
                    {isAdmin && m.profile_id !== user?.id && (
                      <Button variant="ghost" className="p-2 h-auto text-red-500/40 hover:text-red-500">
                        <UserMinus size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "audit" && (
              <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* Horizontal Date Picker */}
                <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6">
                  {pastDays.map(dateStr => {
                    const isSelected = selectedDate === dateStr;
                    const hasSummary = summaries.some(s => new Date(s.created_at).toISOString().split('T')[0] === dateStr);
                    const isToday = isTodayDate(dateStr);
                    
                    return (
                      <button 
                        key={dateStr} 
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "flex flex-col items-center min-w-[70px] p-4 rounded-[2rem] border transition-all duration-500 relative",
                          isSelected ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "bg-white/5 text-white/20 border-white/5"
                        )}
                      >
                        <span className="text-[8px] font-black uppercase tracking-widest italic mb-1 opacity-70">
                          {isToday ? "HOY" : formattedDay(dateStr).split(' ')[0]}
                        </span>
                        <span className={cn("text-xl font-black italic", isSelected ? "text-black" : "text-white/40")}>
                          {formattedDay(dateStr).split(' ')[1]}
                        </span>
                        {hasSummary && !isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                {isTodayDate(selectedDate) && (
                  <Button 
                    onClick={generateAudit} 
                    disabled={generating || pollCount < 1} 
                    variant="ghost" 
                    className="w-full py-8 border-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-black italic rounded-[2rem]"
                  >
                    {generating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={20} />}
                    <span className="ml-2 uppercase tracking-widest">
                      {generating ? "PROCESANDO INTELIGENCIA..." : "GENERAR AUDITORÍA DIARIA"}
                    </span>
                  </Button>
                )}

                {/* Day's Content */}
                <div className="space-y-6">
                  {(() => {
                    const daySummary = summaries.find(s => new Date(s.created_at).toISOString().split('T')[0] === selectedDate);
                    const dayPolls = polls.filter(p => new Date(p.created_at).toISOString().split('T')[0] === selectedDate);

                    if (!daySummary && dayPolls.length === 0) return (
                      <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-white/5">
                        <Ghost size={40} className="mx-auto text-white/5 mb-4" />
                        <p className="text-[10px] font-black text-white/20 tracking-widest uppercase italic">Cero actividad detectada</p>
                      </div>
                    );

                    return (
                      <>
                        {daySummary && (
                          <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[3rem] p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                               <Sparkles size={80} className="text-black" />
                             </div>
                             <div className="flex items-center gap-3 mb-6">
                               <span className="px-3 py-1 bg-black rounded-full text-[9px] font-black text-white italic tracking-widest">INFORME GEMINI</span>
                               <div className="h-px flex-1 bg-black/10" />
                             </div>
                             <div className="prose-slate prose-invert !text-black font-medium leading-relaxed italic text-lg tracking-tight">
                               <ReactMarkdown>{daySummary.content}</ReactMarkdown>
                             </div>
                             <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center text-black/20 font-black text-[9px] uppercase tracking-widest">
                               <span>ID SECURE: {daySummary.id.slice(0,8)}</span>
                               <span>2026 AUDITUS</span>
                             </div>
                          </div>
                        )}
                        
                        {dayPolls.length > 0 && (
                          <div className="space-y-3">
                             <SectionTitle>Actividad Detallada</SectionTitle>
                             {dayPolls.map(poll => (
                               <Link key={poll.id} href={`/poll/${poll.id}`}>
                                 <Card className="p-5 flex items-center gap-4 group">
                                    <p className="flex-1 font-bold text-white/80 text-sm">{poll.rendered_question || poll.question}</p>
                                    <ChevronLeft size={16} className="text-white/10 group-hover:text-emerald-500 rotate-180" />
                                 </Card>
                               </Link>
                             ))}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </motion.div>
            )}

            {tab === "survival" && (
              <motion.div key="survival" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <Card className="p-8 border-red-500/20 bg-red-500/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500">
                     <Skull size={80} />
                   </div>
                   <h3 className="text-2xl font-black text-red-500 uppercase tracking-tighter italic mb-2">BATTLE ROYALE</h3>
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                     Modo Supervivencia Extrema. Un eliminado por cada auditoria diaria. Solo sobrevive el más influyente.
                   </p>
                   <Button variant="ghost" className="mt-6 border-red-500/20 text-red-500 uppercase tracking-widest text-[10px] h-auto py-3 px-6 italic font-black">
                     DISPONIBLE PRÓXIMAMENTE
                   </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* System Settings */}
        <div className="pt-8 border-t border-white/5 space-y-4">
          <SectionTitle>Ajustes de Sistema</SectionTitle>
          <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden">
            <button onClick={leave} className="w-full px-8 py-6 flex items-center justify-between group bg-red-500/[0.02] hover:bg-red-500/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500/40 group-hover:text-red-500 transition-colors">
                  <Skull size={20} />
                </div>
                <span className="font-black text-red-500/40 text-xs italic tracking-widest uppercase group-hover:text-red-500">Abandonar Grupo</span>
              </div>
              <ChevronLeft size={20} className="text-white/5 group-hover:text-red-500 rotate-180 transition-all" />
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
