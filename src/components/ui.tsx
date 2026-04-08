"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Trophy, User } from "lucide-react";

/* ── cn helper ── */
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Avatar ── */
export function Avatar({
  src, name, size = 40,
}: { src?: string | null; name?: string; size?: number }) {
  const initials = name ? name[0].toUpperCase() : "?";
  const style = { width: size, height: size, fontSize: size * 0.4 };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        className="avatar"
        style={style}
      />
    );
  }
  return (
    <div className="avatar-placeholder" style={style}>
      {initials}
    </div>
  );
}

/* ── BottomNav ── */
export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Plus, label: "Crear", path: "/groups/new" },
    { icon: Trophy, label: "Ranking", path: "/leaderboard" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(({ icon: Icon, label, path }) => {
        const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return (
          <Link key={path} href={path} className={cn("nav-item", active && "active")}>
            <Icon size={24} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Card ── */
export function Card({
  children, className, onClick,
}: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={cn("card p-4", className)} onClick={onClick} style={onClick ? { cursor: "pointer" } : {}}>
      {children}
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
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
      {Icon && <Icon size={48} className="text-gray-200" />}
      <h3 className="text-gray-400 font-semibold text-base">{title}</h3>
      {message && <p className="text-gray-300 text-sm">{message}</p>}
      {action}
    </div>
  );
}

/* ── Legacy exports (kept for backward compat) ── */
export function PremiumCard({ children, className, onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void;
}) {
  return <Card className={className} onClick={onClick}>{children}</Card>;
}
export function PremiumButton({ children, onClick, variant = "primary", fullWidth = false, className, disabled = false, type = "button" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean; className?: string; disabled?: boolean; type?: "button" | "submit" | "reset";
}) {
  const cls = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-ghost";
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={cn(cls, !fullWidth && "w-auto", className)}>
      {children}
    </button>
  );
}
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("section-label", className)}>{children}</p>;
}
export function FloatingCommandBar() { return <BottomNav />; }
