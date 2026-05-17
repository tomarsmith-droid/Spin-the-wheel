"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { WheelOption } from "@/lib/types";
import { Sounds } from "@/lib/sounds";
import { useStore } from "@/lib/store";

type Props = {
  open: boolean;
  option: WheelOption | null;
  onClose: () => void;
  onSpinAgain?: () => void;
  ctaLabel?: string;
  subtitle?: string;
};

export function ResultModal({
  open,
  option,
  onClose,
  onSpinAgain,
  ctaLabel = "Spin again",
  subtitle,
}: Props) {
  const [copied, setCopied] = useState(false);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);

  useEffect(() => {
    if (open && option) {
      Sounds.celebrate(soundEnabled);
    }
  }, [open, option, soundEnabled]);

  const copy = async () => {
    if (!option) return;
    try {
      await navigator.clipboard.writeText(option.label);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {open && option && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(8px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 dark:bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-sm rounded-3xl overflow-hidden glass-strong shadow-card-dark"
            initial={{ y: 30, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Colored top accent */}
            <div
              className="h-2 w-full"
              style={{ background: option.color }}
            />

            {/* Close X */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-4 z-10 w-8 h-8 rounded-full grid place-items-center bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-ink-500 dark:text-ink-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>

            <div className="px-6 pt-7 pb-6 text-center">
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 18 }}
                className="mx-auto w-20 h-20 rounded-full grid place-items-center shadow-glow"
                style={{
                  background: `conic-gradient(from 0deg, ${option.color}, #FFD428, ${option.color})`,
                }}
              >
                <div className="w-[68px] h-[68px] rounded-full bg-white dark:bg-ink-900 grid place-items-center text-3xl">
                  {option.emoji ?? "🎉"}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="mt-4 text-xs uppercase tracking-[0.18em] font-bold text-gold-500"
              >
                The wheel picked
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, type: "spring", stiffness: 280, damping: 22 }}
                className="font-display font-extrabold text-3xl md:text-4xl mt-1 leading-tight"
              >
                {option.label}
              </motion.h2>
              {subtitle && (
                <p className="mt-1.5 text-sm text-ink-400 dark:text-ink-300">
                  {subtitle}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button
                  onClick={copy}
                  className="h-11 rounded-xl bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 font-semibold text-sm hover:bg-white/90 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CopyIcon className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSpinAgain?.();
                  }}
                  className="h-11 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 font-bold text-sm shadow-glow-soft active:scale-95 transition-transform"
                >
                  {ctaLabel}
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
