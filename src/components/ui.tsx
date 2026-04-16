"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Plus, Trophy, User, Search, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ── Avatar ── */
export function Avatar({
  src, name, size = 48, className,
}: { src?: string | null; name?: string; size?: number; className?: string }) {
  const initials = name ? name[0].toUpperCase() : "?";
  const style = { width: size, height: size, fontSize: size * 0.38, flexShrink: 0 as const };

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden border border-white/10 shadow-md", className)} style={style}>
        <img
          src={src}
          alt={name || "avatar"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className={cn("avatar-placeholder shadow-md", className)} style={style}>
      {initials}
    </div>
  );
}

/* ── BottomNav ── */
export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { icon: Home,   label: "Inicio",   path: "/" },
    { icon: Search, label: "Explorar", path: "/explore" },
    { icon: Plus,   label: "Crear",    path: "/groups/new" },
    { icon: Trophy, label: "Ranking",  path: "/leaderboard" },
    { icon: User,   label: "Perfil",   path: "/profile" },
  ];

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <div className="flex w-full items-end justify-between px-2">
        {items.map(({ icon: Icon, label, path }) => {
          const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              id={`nav-${label.toLowerCase()}`}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn("nav-item", active && "active")}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.75}
                className="transition-all duration-200"
              />
              <span className={cn(active ? "opacity-100" : "opacity-40")}>
                {label}
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
      className={cn("page-header flex items-center gap-3", className)}
      style={{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 20px)` }}
    >
      {back !== undefined && (
        <button
          onClick={handleBack}
          className="btn-ghost !min-h-[44px] !w-[44px] !rounded-xl !p-0 flex-shrink-0"
          aria-label="Volver"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          typeof title === "string"
            ? <h1 className="text-xl font-black text-white truncate leading-tight">{title}</h1>
            : title
        )}
        {subtitle && <p className="text-xs text-white/40 font-medium mt-0.5">{subtitle}</p>}
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
      className={cn(elevated ? "card-elevated" : "card", "p-5 group relative overflow-hidden", className)}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      {onClick && (
        <div className="absolute inset-0 bg-emerald-500/0 group-active:bg-emerald-500/[0.04] transition-colors duration-150 rounded-[inherit]" />
      )}
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
  return (
    <div className={cn("pill-tabs", className)} role="tablist">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          className={cn("pill-tab", active === key && "active")}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
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
    <div className="stat-item">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className={cn("stat-value", accent && "text-emerald-400")}>{value}</span>
      </div>
      <span className="stat-label">{label}</span>
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
      className="flex flex-col items-center justify-center py-16 px-8 text-center gap-5"
    >
      <div className="w-20 h-20 rounded-3xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06] shadow-lg">
        {Icon && <Icon size={36} className="text-white/20" />}
      </div>
      <div>
        <h3 className="text-white font-bold text-lg mb-2 leading-snug">{title}</h3>
        {message && <p className="text-white/40 text-sm max-w-[230px] leading-relaxed">{message}</p>}
      </div>
      {action}
    </motion.div>
  );
}

/* ── LoadingScreen ── */
export function LoadingScreen() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-black">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Loader2 size={36} className="text-emerald-500" style={{ animation: "spin 1s linear infinite" }} />
      </motion.div>
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
    primary:   "btn-primary",
    secondary: "btn-secondary",
    ghost:     "btn-ghost",
    danger:    "btn-danger",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        clsMap[variant],
        !fullWidth && "w-auto",
        className
      )}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
}

/* ── SectionTitle ── */
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 px-0.5">
      <div className="w-1 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      <h2 className={cn("text-[11px] font-black uppercase tracking-[0.2em] text-white/40", className)}>
        {children}
      </h2>
    </div>
  );
}

/* ── FloatingCommandBar (alias) ── */
export function FloatingCommandBar() { return <BottomNav />; }
