import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-svh w-full bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin text-[var(--primary)]" />
        <p className="text-sm font-black text-[var(--text-muted)] tracking-widest uppercase animate-pulse">
          Cargando AuditUs...
        </p>
      </div>
    </div>
  );
}
