"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Trophy, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Avatar ── */
export function Avatar({
  src, name, size = 48, className,
}: { src?: string | null; name?: string; size?: number; className?: string }) {
  const initials = name ? name[0].toUpperCase() : "?";
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden border border-white/10 shadow-lg", className)} style={style}>
        <img
          src={src}
          alt={name || "avatar"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className={cn("avatar-placeholder shadow-lg", className)} style={style}>
      {initials}
    </div>
  );
}

/* ── BottomNav ── */
export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { icon: Home, label: "INICIO", path: "/" },
    { icon: Search, label: "EXPLORAR", path: "/explore" },
    { icon: Plus, label: "CREAR", path: "/groups/new" },
    { icon: Trophy, label: "RANKING", path: "/leaderboard" },
    { icon: User, label: "PERFIL", path: "/profile" },
  ];
  return (
    <nav className="bottom-nav px-4 pb-safe">
      <div className="flex w-full items-center justify-between gap-1">
        {items.map(({ icon: Icon, label, path }) => {
          const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
          return (
            <Link key={path} href={path} className={cn("nav-item", active && "active")}>
              <Icon size={20} className={cn("transition-all", active ? "scale-110" : "opacity-50")} />
              <span className={cn("text-[8px] font-black tracking-[0.1em]", active ? "opacity-100" : "opacity-30")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Card ── */
export function Card({
  children, className, onClick,
}: { children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div 
      className={cn("card p-5 group relative overflow-hidden", className)} 
      onClick={onClick} 
      style={onClick ? { cursor: "pointer" } : {}}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.03] transition-colors duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/* ── EmptyState ── */
export function EmptyState({ icon: Icon, title, message, action }: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
        {Icon && <Icon size={40} className="text-white/20" />}
      </div>
      <div>
        <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
        {message && <p className="text-white/40 text-sm max-w-[240px] leading-relaxed">{message}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Premium Exports ── */
export function Button({ 
  children, onClick, variant = "primary", fullWidth = false, className, disabled = false, type = "button" 
}: {
  children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean; className?: string; disabled?: boolean; type?: "button" | "submit" | "reset";
}) {
  const cls = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "hover:bg-white/5 text-white/60";
  return (
    <button 
      type={type} 
      disabled={disabled} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-center font-bold transition-all rounded-2xl",
        variant === "ghost" ? "px-4 py-2" : "",
        cls, 
        !fullWidth && "w-auto", 
        className
      )}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 px-1">
      <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
      <h2 className={cn("text-sm font-black uppercase tracking-[0.2em] text-white/40", className)}>
        {children}
      </h2>
    </div>
  );
}

export function FloatingCommandBar() { return <BottomNav />; }
