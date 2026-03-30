"use client";

import { cn } from "@/lib/utils";

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

export function GlassBadge({
  children,
  variant = "default",
  className,
}: GlassBadgeProps) {
  const variantClasses = {
    default: "glass-badge",
    primary: "glass-badge bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] border-[var(--color-primary)]/30",
    success: "glass-badge bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "glass-badge bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "glass-badge bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}
