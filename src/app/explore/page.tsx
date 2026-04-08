"use client";

import { motion } from "framer-motion";
import { PremiumButton, PremiumCard, cn } from "@/components/ui";
import { Link as LinkIcon, ArrowRight, Loader2, Plus, Hash } from "lucide-react";
import { useState } from "react";
import { groupService } from "@/lib/services";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

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
    <div className="px-8 pt-24 pb-48 bg-onyx min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="label-micro opacity-40 mb-3">Protocolo de Red</p>
        <h1 className="text-white text-6xl font-black heading-infinite tracking-tighter leading-none italic uppercase">
          Explorar
        </h1>
      </motion.div>

      {/* Join by code */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mb-12">
        <PremiumCard className="border-white/[0.03] bg-zinc-950/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon size={14} className="text-white/20" />
            <span className="label-micro opacity-20">Acceso por Código</span>
          </div>
          <form onSubmit={handleJoin} className="flex gap-4">
            <div className="relative flex-1">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10" size={16} />
              <input
                type="text"
                placeholder="CÓDIGO"
                className="w-full glass bg-white/[0.02] border-white/5 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-white focus:ring-0 outline-none transition-all uppercase font-black text-sm tracking-[0.3em]"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 6))}
                maxLength={6}
              />
            </div>
            <PremiumButton className="px-6 rounded-2xl py-4" disabled={loading || inviteCode.length < 6}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
            </PremiumButton>
          </form>
        </PremiumCard>
      </motion.div>

      {/* CTA: Create Group */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Link href="/groups/new?mode=create">
          <PremiumCard className="p-8 border-white/[0.03] bg-zinc-950/20 group cursor-pointer hover:border-white/[0.06] hover:bg-zinc-950/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.05] flex items-center justify-center mb-5">
                  <Plus size={20} className="text-white/30 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter heading-infinite mb-2">
                  Crear Círculo
                </h3>
                <p className="text-white/30 text-sm font-medium">
                  Empieza un nuevo grupo de confianza
                </p>
              </div>
              <ArrowRight size={20} className="text-white/10 group-hover:text-white transition-colors" />
            </div>
          </PremiumCard>
        </Link>
      </motion.div>
    </div>
  );
}
