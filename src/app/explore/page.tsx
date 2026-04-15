"use client";

import { motion } from "framer-motion";
import { Button, Card, SectionTitle } from "@/components/ui";
import { Link as LinkIcon, ArrowRight, Loader2, Plus, Hash, Globe, Search } from "lucide-react";
import { useState } from "react";
import { groupService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Debes iniciar sesión primero");
    if (!inviteCode.trim()) return;
    setLoading(true);
    try {
      const group = await groupService.joinGroup(inviteCode.trim(), user.id);
      toast.success(`¡Bienvenido a ${group.name}!`);
      router.push(`/groups/${group.id}`);
    } catch (error: any) {
      toast.error(error.message || "Código no válido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-black relative overflow-x-hidden">
      <div className="bg-mesh opacity-40" />

      {/* Header */}
      <header className="px-6 pt-14 pb-8 flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">EXPLORAR</h1>
          <p className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase opacity-70 italic">Protocolo de Redes</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/20">
          <Globe size={24} />
        </div>
      </header>

      <div className="px-6 pb-32 relative z-10 flex flex-col gap-8">
        {/* Search / Join card */}
        <section className="space-y-4">
          <SectionTitle>Acceso de Usuario</SectionTitle>
          <Card className="p-8 border-emerald-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Search size={80} className="text-emerald-500" />
            </div>
            
            <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-6 italic">Ingresa el código compartido para unirte a un despliegue</p>
            
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div className="relative">
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/40" size={18} />
                <input
                  type="text"
                  placeholder="CÓDIGO_AGENTE"
                  className="w-full bg-white/5 border-2 border-white/5 rounded-3xl pl-16 pr-5 py-6 text-white text-xl font-black tracking-[0.4em] italic placeholder:text-white/10 focus:border-emerald-500/50 outline-none transition-all uppercase"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <Button variant="primary" className="py-6 rounded-[2rem] gap-3 text-sm italic" disabled={loading || inviteCode.length < 6}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
                <span>{loading ? "VERIFICANDO..." : "CONECTAR A LA RED"}</span>
              </Button>
            </form>
          </Card>
        </section>

        {/* Create Group CTA */}
        <section className="space-y-4">
          <SectionTitle>Nuevas Operaciones</SectionTitle>
          <Link href="/groups/new?mode=create">
            <Card className="p-8 group hover:border-emerald-500/30 transition-all cursor-pointer bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                    <Plus size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tight uppercase mb-1">Inaugurar Círculo</h3>
                    <p className="text-[10px] font-black text-white/20 tracking-widest uppercase">Genera un nuevo entorno de auditoría</p>
                  </div>
                </div>
                <ArrowRight size={24} className="text-white/5 group-hover:text-white transition-all transform group-hover:translate-x-2" />
              </div>
            </Card>
          </Link>
        </section>

        <footer className="mt-8 py-10 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex gap-6 opacity-20">
             <div className="w-1 h-1 bg-white rounded-full" />
             <div className="w-1 h-1 bg-white rounded-full" />
             <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <p className="text-[8px] font-black text-white/10 tracking-[0.5em] uppercase">AuditUs Network • Layer 0</p>
        </footer>
      </div>

    </div>
  );
}
