"use client";

import { WheelStage } from "@/components/WheelStage";
import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function WeightedPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const options = useStore((s) => s.currentOptions);
  const add = useStore((s) => s.addOption);
  const update = useStore((s) => s.updateOption);
  const remove = useStore((s) => s.removeOption);

  const totalWeight = useMemo(
    () => options.reduce((s, o) => s + Math.max(0.1, o.weight || 1), 0),
    [options],
  );

  return (
    <div className="page-enter">
      <PageHeader
        title="Weighted"
        tagline="Bend the odds. Drag the slider, change reality."
      />

      <div className="mt-4 grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">
        <div>
          <WheelStage options={options} mode="weighted" weighted />
        </div>

        <div className="glass rounded-2xl p-4 md:p-5 shadow-card-dark">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-base font-bold tracking-tight">
                Probabilities
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-300">
                Each weight relative to the total.
              </p>
            </div>
            <AddOption onAdd={add} />
          </div>

          <div className="space-y-3 max-h-[55vh] overflow-y-auto no-scrollbar">
            {options.length === 0 && (
              <p className="text-sm text-ink-400 text-center py-6">
                Add a few options to start tuning the odds.
              </p>
            )}
            {options.map((o) => {
              const w = Math.max(0.1, o.weight || 1);
              const pct = (w / totalWeight) * 100;
              return (
                <motion.div
                  key={o.id}
                  layout
                  className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: o.color }}
                    />
                    <input
                      value={o.label}
                      onChange={(e) =>
                        update(o.id, { label: e.target.value })
                      }
                      className="flex-1 bg-transparent text-sm font-semibold focus:outline-none"
                    />
                    <span className="text-xs font-mono tabular-nums text-ink-400 dark:text-ink-300 min-w-[44px] text-right">
                      {pct.toFixed(1)}%
                    </span>
                    <button
                      onClick={() => remove(o.id)}
                      aria-label="Remove"
                      className="w-7 h-7 rounded-md text-rose-500 hover:bg-rose-500/10 grid place-items-center"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 6l12 12M6 18L18 6" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={w}
                      onChange={(e) =>
                        update(o.id, { weight: parseFloat(e.target.value) })
                      }
                    />
                    <span className="text-xs font-bold w-9 tabular-nums">
                      ×{w.toFixed(1)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddOption({ onAdd }: { onAdd: (label: string) => void }) {
  return (
    <button
      onClick={() => {
        const label = prompt("New option");
        if (label && label.trim()) onAdd(label.trim());
      }}
      className="h-9 px-3 rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 text-xs font-bold"
    >
      + Add
    </button>
  );
}
