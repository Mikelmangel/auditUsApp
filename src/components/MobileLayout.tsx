"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MobileLayout({
  header,
  footer,
  children,
  className,
  contentClassName,
}: MobileLayoutProps) {
  return (
    <div className={cn("flex flex-col h-svh w-full max-w-[430px] mx-auto overflow-hidden bg-[var(--stitch-canvas)] dot-grid", className)}>
      {/* Fixed Header Slot */}
      {header && (
        <div className="flex-shrink-0 z-20 bg-transparent">
          {header}
        </div>
      )}

      {/* Scrollable Content Area */}
      <main className={cn("flex-1 overflow-y-auto custom-scrollbar relative z-10", contentClassName)}>
        {children}
      </main>

      {/* Fixed Footer Slot */}
      {footer && (
        <div className="flex-shrink-0 z-20 bg-transparent">
          {footer}
        </div>
      )}
    </div>
  );
}
