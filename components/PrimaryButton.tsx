"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
  variant?: "gold" | "navy" | "ghost" | "danger";
  type?: "button" | "submit";
  fullWidth?: boolean;
};

export function PrimaryButton({
  onClick,
  disabled,
  children,
  className,
  size = "lg",
  variant = "gold",
  type = "button",
  fullWidth,
}: Props) {
  const variants: Record<string, string> = {
    gold:
      "bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 text-navy-900 shadow-glow",
    navy:
      "bg-gradient-to-br from-navy-500 via-navy-600 to-navy-800 text-white shadow-card-dark",
    ghost:
      "bg-white/60 dark:bg-white/10 text-ink-900 dark:text-white border border-black/5 dark:border-white/10",
    danger:
      "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-card-dark",
  };
  const sizes: Record<string, string> = {
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-[15px]",
    xl: "h-14 px-7 text-base",
  };
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl font-bold tracking-tight inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-shadow",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
