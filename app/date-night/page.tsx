"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { WheelStage } from "@/components/WheelStage";
import { DATE_NIGHT_PACKS, makeOptions } from "@/lib/presets";
import { cn } from "@/lib/utils";

type CategoryKey = keyof typeof DATE_NIGHT_PACKS;

const ORDER: CategoryKey[] = ["food", "activities", "movies", "trips", "adventures"];

export default function DateNightPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const [category, setCategory] = useState<CategoryKey>("food");

  const options = useMemo(() => {
    const pack = DATE_NIGHT_PACKS[category];
    return makeOptions(pack.options, pack.options.map(() => pack.emoji));
  }, [category]);

  return (
    <div className="page-enter">
      <PageHeader
        title="Date Night"
        tagline="Curated picks so you can both finally agree."
      />

      <div className="mt-4">
        <div className="scroll-x flex gap-2 -mx-4 px-4 pb-1">
          {ORDER.map((key) => {
            const c = DATE_NIGHT_PACKS[key];
            const active = category === key;
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCategory(key)}
                className={cn(
                  "shrink-0 flex items-center gap-2 px-4 h-11 rounded-2xl text-sm font-bold transition-all",
                  active
                    ? "bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-card-dark"
                    : "bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10",
                )}
              >
                <span className="text-base">{c.emoji}</span>
                {c.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 mt-5">
        <div>
          <HeroBanner category={category} />
          <WheelStage
            options={options}
            mode="date-night"
            resultSubtitle={DATE_NIGHT_PACKS[category].label}
          />
        </div>
        <div className="glass rounded-2xl p-4 md:p-5 shadow-card-dark">
          <h3 className="font-display text-base font-bold tracking-tight">
            On the wheel
          </h3>
          <p className="text-xs text-ink-400 dark:text-ink-300 mb-3">
            {options.length} curated picks
          </p>
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto no-scrollbar">
            {options.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: o.color }}
                />
                <span className="text-sm font-medium">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroBanner({ category }: { category: CategoryKey }) {
  const c = DATE_NIGHT_PACKS[category];
  const gradient: Record<CategoryKey, string> = {
    food: "from-orange-400 via-rose-400 to-red-500",
    activities: "from-teal-400 via-cyan-500 to-blue-500",
    movies: "from-violet-500 via-fuchsia-500 to-pink-500",
    trips: "from-sky-400 via-indigo-400 to-violet-500",
    adventures: "from-amber-400 via-orange-500 to-rose-500",
  };
  return (
    <motion.div
      key={category}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden mb-4"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient[category])} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="relative px-5 py-4 text-white flex items-center gap-4">
        <div className="text-4xl">{c.emoji}</div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold opacity-90">
            Date Night pack
          </p>
          <h2 className="font-display font-extrabold text-xl leading-tight">
            {c.label}
          </h2>
        </div>
      </div>
    </motion.div>
  );
}
