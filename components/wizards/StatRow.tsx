"use client";

import { motion } from "framer-motion";
import { STAT_META, type StatKey } from "@/lib/wizards";

export function StatRow({
  stat,
  value,
  accent,
  index,
}: {
  stat: StatKey;
  value: number;
  accent: string;
  index: number;
}) {
  const meta = STAT_META[stat];
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[88px] shrink-0 text-sm font-semibold text-white/90">
        <span className="mr-1.5">{meta.icon}</span>
        {meta.label}
      </span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, #fff8)`,
            boxShadow: `0 0 12px ${accent}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            delay: 0.12 + index * 0.07,
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}
        />
      </div>
      <motion.span
        className="w-7 shrink-0 text-right font-display text-base font-extrabold tabular-nums text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.07 }}
      >
        {value}
      </motion.span>
    </div>
  );
}
