"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, Home, Loader2, Search, Trophy, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export function Avatar({
  src, name, size = 48, className,
}: { src?: string | null; name?: string; size?: number; className?: string }) {
  const initials = name ? name[0].toUpperCase() : "?";
  const style = { width: size, height: size, fontSize: size * 0.38, flexShrink: 0 as const };

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden border-2 border-white shadow-sm", className)} style={style}>
        <img
          src={src}
          alt={name || "avatar"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold border-2 border-white shadow-sm", className)} style={style}>
      {initials}
    </div>
  );
}

/* ── BottomNav ── */
export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const items = [
    { id: 'all', label: 'Home', icon: Home, path: '/' },
    { id: 'explore', label: 'Explore', icon: Search, path: '/explore' },
    { id: 'connect', label: 'Connect', icon: Users, path: '/groups/new' },
    { id: 'ranking', label: 'Ranking', icon: Trophy, path: '/leaderboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className={cn(
      "w-full h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center px-4 z-50 pb-safe",
      className
    )}>
      <div className="flex w-full justify-between items-center px-2">
        {items.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 px-3 py-1 rounded-2xl",
                isActive ? "text-[var(--stitch-primary)]" : "text-slate-400"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn(
                "transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] font-bold tracking-tight transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


/* ── PageHeader ── */
export function PageHeader({
  title,
  subtitle,
  back,
  action,
  className,
}: {
  title?: React.ReactNode;
  subtitle?: string;
  back?: string | boolean;
  action?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof back === "string") router.push(back);
    else router.back();
  };

  return (
    <header
      className={cn("px-6 pt-12 pb-6 flex items-center gap-4 bg-transparent", className)}
    >

      {back !== undefined && (
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm active:scale-90 transition-transform"
          aria-label="Volver"
        >
          <ChevronLeft size={22} className="text-slate-600" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          typeof title === "string"
            ? <h1 className="font-jakarta text-2xl font-black text-slate-900 leading-tight tracking-tight">{title}</h1>
            : title
        )}
        {subtitle && <p className="font-inter text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}

/* ── Card ── */
export function Card({
  children, className, onClick, elevated = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "card-stitch p-6 group relative overflow-hidden bg-white",
        elevated && "shadow-xl border-indigo-50",
        className
      )}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ── TabBar ── */
export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  const scrollable = tabs.length > 3;
  const inner = (
    <div className="flex gap-2 p-1 bg-slate-100/50 rounded-full backdrop-blur-sm border border-slate-100" role="tablist" style={scrollable ? { minWidth: "max-content" } : undefined}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          className={cn(
            "chip-pill px-4 py-2 text-xs font-bold transition-all",
            active === key 
              ? "bg-[var(--stitch-primary)] text-white shadow-md shadow-indigo-500/20 scale-[1.02]" 
              : "text-slate-500 hover:text-slate-800"
          )}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (scrollable) {
    return (
      <div className={cn("overflow-x-auto no-scrollbar pb-2", className)}>
        {inner}
      </div>
    );
  }

  return <div className={cn("flex justify-center", className)}>{inner}</div>;
}

/* ── StatBadge ── */
export function StatBadge({
  icon, value, label, accent,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <span className={cn("font-jakarta text-lg font-black leading-none mt-1", accent ? "text-[var(--stitch-primary)]" : "text-slate-900")}>
        {value}
      </span>
      <span className="font-inter text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
  );
}

/* ── EmptyState ── */
export function EmptyState({
  icon: Icon, title, message, action,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center gap-6"
    >
      <div className="w-20 h-20 rounded-[32px] bg-white border border-slate-100 flex items-center justify-center shadow-sm">
        {Icon ? <Icon size={36} className="text-slate-300" /> : <div className="text-4xl">🛰️</div>}
      </div>
      <div>
        <h3 className="font-jakarta text-xl font-black text-slate-900 mb-2 leading-none">{title}</h3>
        {message && <p className="font-inter text-sm font-medium text-slate-400 max-w-[240px] leading-relaxed">{message}</p>}
      </div>
      {action}
    </motion.div>
  );
}

/* ── LoadingScreen ── */
export function LoadingScreen() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[var(--stitch-canvas)] dot-grid">
      <motion.div
        animate={{ 
          scale: [0.95, 1.05, 0.95],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-[24px] border-4 border-[var(--stitch-primary)] border-t-transparent flex items-center justify-center shadow-xl"
      >
        <div className="w-4 h-4 rounded-full bg-[var(--stitch-primary)] animate-pulse" />
      </motion.div>
      <p className="mt-8 font-inter text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
        Auditando Sistema...
      </p>
    </div>
  );
}

/* ── Button ── */
export function Button({
  children, onClick, variant = "primary", fullWidth = true, className, disabled = false, type = "button", loading = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}) {
  const clsMap = {
    primary: "btn-pill",
    secondary: "bg-white text-slate-900 border border-slate-200 rounded-full px-6 py-3 font-bold text-sm hover:bg-slate-50 transition-all",
    ghost: "bg-transparent text-slate-500 rounded-full px-4 py-2 font-bold text-xs hover:bg-slate-100 transition-all",
    danger: "bg-rose-50 text-rose-500 border border-rose-100 rounded-full px-6 py-3 font-bold text-sm hover:bg-rose-100 transition-all",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        clsMap[variant],
        fullWidth && "w-full justify-center",
        !fullWidth && "w-auto",
        className,
        "flex items-center gap-2"
      )}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
}

/* ── SectionTitle ── */
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 px-1">
      <div className="w-2 h-6 bg-[var(--stitch-primary)] rounded-full shadow-lg shadow-indigo-500/30" />
      <h2 className={cn("font-jakarta text-xs font-black uppercase tracking-[0.2em] text-slate-900", className)}>
        {children}
      </h2>
    </div>
  );
}

/* ── FloatingCommandBar (alias) ── */
export function FloatingCommandBar() { return <BottomNav />; }
