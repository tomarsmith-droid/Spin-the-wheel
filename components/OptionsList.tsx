"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WheelOption } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  options: WheelOption[];
  onAdd: (label: string) => void;
  onUpdate: (id: string, patch: Partial<WheelOption>) => void;
  onRemove: (id: string) => void;
  onClear?: () => void;
  weighted?: boolean;
  emptyHint?: string;
  maxItems?: number;
};

export function OptionsList({
  options,
  onAdd,
  onUpdate,
  onRemove,
  onClear,
  weighted,
  emptyHint,
  maxItems = 24,
}: Props) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const v = draft.trim();
    if (!v) return;
    if (options.length >= maxItems) return;
    onAdd(v);
    setDraft("");
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-5 shadow-card-dark">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">
            Options
          </h3>
          <p className="text-xs text-ink-400 dark:text-ink-300">
            {options.length}/{maxItems} · tap to edit
          </p>
        </div>
        {options.length > 0 && onClear && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-ink-400 dark:text-ink-300 hover:text-rose-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Add an option…"
          className="flex-1 px-4 py-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 placeholder:text-ink-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all text-sm font-medium"
        />
        <button
          onClick={submit}
          disabled={!draft.trim() || options.length >= maxItems}
          className="h-11 px-4 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 font-bold text-sm shadow-glow-soft disabled:opacity-40 disabled:shadow-none active:scale-95 transition-transform"
        >
          Add
        </button>
      </div>

      <div className="max-h-[40vh] md:max-h-[420px] overflow-y-auto pr-1 no-scrollbar space-y-2">
        <AnimatePresence initial={false}>
          {options.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-ink-400 dark:text-ink-300 text-center py-8"
            >
              {emptyHint ?? "Start by adding some options above."}
            </motion.p>
          )}
          {options.map((o) => (
            <motion.div
              key={o.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={cn(
                "group flex items-center gap-3 p-2 pl-3 pr-2 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10",
                o.eliminated && "opacity-50",
              )}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow"
                style={{ background: o.color }}
              />
              <input
                value={o.label}
                onChange={(e) => onUpdate(o.id, { label: e.target.value })}
                className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
              />
              {weighted && (
                <div className="flex items-center gap-1.5">
                  <button
                    aria-label="Decrease weight"
                    onClick={() =>
                      onUpdate(o.id, { weight: Math.max(0.5, (o.weight || 1) - 0.5) })
                    }
                    className="w-6 h-6 rounded-md bg-white/70 dark:bg-white/10 grid place-items-center text-xs font-bold hover:bg-white/90 dark:hover:bg-white/20"
                  >
                    –
                  </button>
                  <span className="text-xs font-mono w-7 text-center tabular-nums">
                    {(o.weight || 1).toFixed(1)}
                  </span>
                  <button
                    aria-label="Increase weight"
                    onClick={() =>
                      onUpdate(o.id, { weight: Math.min(10, (o.weight || 1) + 0.5) })
                    }
                    className="w-6 h-6 rounded-md bg-white/70 dark:bg-white/10 grid place-items-center text-xs font-bold hover:bg-white/90 dark:hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemove(o.id)}
                aria-label="Remove"
                className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-md text-rose-500 hover:bg-rose-500/10 grid place-items-center"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
