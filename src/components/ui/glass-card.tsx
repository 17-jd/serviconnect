"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "subtle" | "strong";
  hoverable?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  variant = "default",
  hoverable = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  const variants = {
    default: "glass",
    subtle: "glass-subtle",
    strong: "glass-strong",
  };

  return (
    <motion.div
      className={cn(
        variants[variant],
        hoverable && "cursor-pointer",
        !hoverable && "[&]:hover:transform-none [&]:hover:shadow-none",
        "p-6",
        className
      )}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
