"use client";

import { useMemo } from "react";
import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { PrimaryButton } from "@/components/PrimaryButton";
import { formatDate } from "@/lib/utils";
import type { GameMode } from "@/lib/types";

const MODE_LABEL: Record<GameMode, string> = {
  classic: "Classic",
  elimination: "Elimination",
  tournament: "Tournament",
  party: "Party",
  "date-night": "Date Night",
  weighted: "Weighted",
};

export default function StatsPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const stats = useStore((s) => s.stats);
  const history = useStore((s) => s.history);
  const resetStats = useStore((s) => s.resetStats);

  const avgSpin = stats.totalSpins > 0 ? stats.totalSpinTime / stats.totalSpins : 0;

  const top = useMemo(() => {
    const entries = Object.entries(stats.optionFrequency);
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 6);
  }, [stats.optionFrequency]);

  const favMode = useMemo(() => {
    const entries = Object.entries(stats.spinsByMode) as [GameMode, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[1] ? entries[0] : null;
  }, [stats.spinsByMode]);

  return (
    <div className="page-enter">
      <PageHeader
        title="Stats"
        tagline="What the wheel knows about you."
        rightSlot={
          <PrimaryButton
            variant="ghost"
            size="md"
            onClick={() => {
              if (confirm("Reset all stats and history?")) resetStats();
            }}
          >
            Reset
          </PrimaryButton>
        }
      />

      {stats.totalSpins === 0 ? (
        <div className="mt-8 glass rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-navy-500 to-navy-800 grid place-items-center text-4xl text-gold-300 shadow-card-dark">
            📊
          </div>
          <h2 className="font-display text-2xl font-bold mt-4">No spins yet</h2>
          <p className="text-sm text-ink-400 dark:text-ink-300 mt-1">
            Take the wheel for a spin to start building your stats.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid md:grid-cols-3 gap-3 md:gap-4">
          <BigStat
            label="Total spins"
            value={stats.totalSpins.toLocaleString()}
            icon="🌀"
          />
          <BigStat
            label="Current streak"
            value={`${stats.streak} day${stats.streak === 1 ? "" : "s"}`}
            icon="🔥"
          />
          <BigStat
            label="Avg spin time"
            value={`${(avgSpin / 1000).toFixed(1)}s`}
            icon="⚡"
          />

          <div className="md:col-span-2 glass rounded-2xl p-4 md:p-5 shadow-card-dark">
            <h3 className="font-display font-bold text-lg">Most selected</h3>
            <p className="text-xs text-ink-400 dark:text-ink-300 mb-3">
              Your wheel's favourites.
            </p>
            {top.length === 0 && (
              <p className="text-sm text-ink-400">No data yet.</p>
            )}
            <div className="space-y-2.5">
              {top.map(([label, count], i) => {
                const max = top[0]?.[1] ?? 1;
                const pct = (count / max) * 100;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-semibold flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md grid place-items-center text-[10px] font-bold"
                          style={{
                            background:
                              i === 0
                                ? "linear-gradient(135deg,#FFD428,#F5A623)"
                                : "rgba(127,127,127,0.18)",
                            color: i === 0 ? "#0A0E1A" : "inherit",
                          }}
                        >
                          {i + 1}
                        </span>
                        {label}
                      </span>
                      <span className="text-xs text-ink-400 dark:text-ink-300 tabular-nums">
                        {count}×
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.05 * i, type: "spring", stiffness: 110, damping: 22 }}
                        className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 md:p-5 shadow-card-dark">
            <h3 className="font-display font-bold text-lg">By mode</h3>
            {favMode && (
              <p className="text-xs text-ink-400 dark:text-ink-300 mb-3">
                You spin {MODE_LABEL[favMode[0]]} the most.
              </p>
            )}
            <div className="space-y-2 mt-2">
              {(Object.keys(stats.spinsByMode) as GameMode[]).map((m) => {
                const total = stats.totalSpins || 1;
                const count = stats.spinsByMode[m] || 0;
                const pct = (count / total) * 100;
                return (
                  <div key={m}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-semibold">{MODE_LABEL[m]}</span>
                      <span className="tabular-nums text-ink-400 dark:text-ink-300">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: "spring", stiffness: 110, damping: 22 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-3 glass rounded-2xl p-4 md:p-5 shadow-card-dark">
            <h3 className="font-display font-bold text-lg">Recent spins</h3>
            <p className="text-xs text-ink-400 dark:text-ink-300 mb-3">
              The last {Math.min(8, history.length)} results.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {history.slice(0, 8).map((h) => (
                <div
                  key={h.id}
                  className="px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-300 to-amber-500 text-navy-900 grid place-items-center text-xs font-bold">
                    🎯
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{h.optionLabel}</p>
                    <p className="text-[11px] text-ink-400 dark:text-ink-300 capitalize">
                      {h.mode.replace("-", " ")} · {formatDate(h.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden p-4 md:p-5 glass shadow-card-dark"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-ink-400 dark:text-ink-300">
            {label}
          </p>
          <p className="font-display font-extrabold text-3xl mt-1 tracking-tight">
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-300 to-amber-500 grid place-items-center text-xl shadow-glow-soft">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
