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
    <div className={cn("avatar-placeholder shadow-sm border-white/50", className)} style={style}>
      {initials}
    </div>
  );
}

/* ── BottomNav ── */
export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { id: 'home', label: 'Inicio', icon: Home, path: '/' },
    { id: 'explore', label: 'Explorar', icon: Search, path: '/explore' },
    { id: 'connect', label: 'Conectar', icon: Users, path: '/groups/new' },
    { id: 'ranking', label: 'Ranking', icon: Trophy, path: '/leaderboard' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  return (
    <nav className="bottom-nav border-t border-black/5" aria-label="Navegación principal">
      <div className="flex w-full items-center justify-between px-6">
        {items.map(({ icon: Icon, label, path }) => {
          const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                active ? "text-[#14726e]" : "text-gray-400"
              )}
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-[10px] font-black uppercase tracking-wider">
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
            ? <h1 className="text-xl font-black text-gray-900 truncate leading-tight lowercase">{title}</h1>
            : title
        )}
        {subtitle && <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>}
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
    <div className="pill-tabs" role="tablist" style={scrollable ? { minWidth: "max-content" } : undefined}>
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

  if (scrollable) {
    return (
      <div className={cn("overflow-x-auto -mx-5 px-5", className)}>
        {inner}
      </div>
    );
  }

  return <div className={cn(className)}>{inner}</div>;
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
        <span className={cn("stat-value", accent && "text-[#14726e]")}>{value}</span>
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
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center border border-black/5 shadow-sm">
        {Icon && <Icon size={36} className="text-gray-300" />}
      </div>
      <div>
        <h3 className="text-gray-900 font-black text-lg mb-2 leading-snug">{title}</h3>
        {message && <p className="text-gray-400 text-sm font-medium max-w-[230px] leading-relaxed">{message}</p>}
      </div>
      {action}
    </motion.div>
  );
}

/* ── LoadingScreen ── */
export function LoadingScreen() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-[#f3ede2]">
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-12 h-12 rounded-full border-4 border-[#14726e] border-t-transparent animate-spin" />
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
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
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
      <div className="w-1 h-5 bg-[#14726e] rounded-full shadow-[0_0_10px_rgba(20,114,110,0.3)]" />
      <h2 className={cn("text-[10px] font-black uppercase tracking-[0.2em] text-[#14726e]", className)}>
        {children}
      </h2>
    </div>
  );
}

/* ── FloatingCommandBar (alias) ── */
export function FloatingCommandBar() { return <BottomNav />; }
