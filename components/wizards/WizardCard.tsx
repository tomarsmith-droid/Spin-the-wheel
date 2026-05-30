"use client";

import { motion } from "framer-motion";
import {
  HOUSES,
  RARITY_STYLE,
  type StatKey,
  type Wizard,
  powerRating,
} from "@/lib/wizards";
import { cn } from "@/lib/utils";
import { CardArtwork } from "./CardArtwork";
import { StatRow } from "./StatRow";

const STAT_ORDER: StatKey[] = ["magic", "bravery", "mischief", "wisdom", "luck"];

export function WizardCard({
  wizard,
  safeMode,
  drinkMode,
}: {
  wizard: Wizard;
  /** When true, show the silly party prompt instead of the drinking rule. */
  safeMode: boolean;
  /** When true, make the rule panel larger / glowing. */
  drinkMode: boolean;
}) {
  const house = HOUSES[wizard.house];
  const rarity = RARITY_STYLE[wizard.rarity];
  const rule = safeMode ? wizard.safeRule : wizard.drinkRule;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-[26px] ring-2",
        rarity.ring,
      )}
      style={{
        background:
          "linear-gradient(160deg, #1a1206 0%, #0f0a04 45%, #080604 100%)",
        boxShadow: `0 30px 60px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,212,40,0.25), 0 0 40px -8px ${rarity.glow}`,
      }}
    >
      {/* Ornate gold inner border */}
      <div className="pointer-events-none absolute inset-1.5 rounded-[20px] border border-gold-400/40" />
      <div className="pointer-events-none absolute inset-2.5 rounded-[16px] border border-gold-400/15" />

      {/* HEADER: house badge + rarity */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-lg shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${house.via}, ${house.to})`,
              boxShadow: `0 0 16px ${house.accent}`,
            }}
          >
            {house.emblem}
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-white">
              {house.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              {house.tagline}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur",
            rarity.text,
          )}
        >
          {wizard.rarity}
        </span>
      </div>

      {/* NAME */}
      <div className="relative z-10 px-4 pt-2.5">
        <h2 className="font-display text-[26px] font-extrabold leading-none text-white drop-shadow">
          {wizard.name}
        </h2>
        <p className="mt-1 text-sm italic text-gold-300/90">{wizard.epithet}</p>
      </div>

      {/* PORTRAIT — flex-1 so it absorbs slack and the rule always fits */}
      <div className="relative z-10 mx-4 mt-3 min-h-0 flex-1 overflow-hidden rounded-2xl border-2 border-gold-400/50 shadow-inner">
        <div className="h-full w-full">
          <CardArtwork wizard={wizard} />
        </div>
        {/* power rating chip */}
        <div className="absolute bottom-2 right-2 rounded-lg border border-gold-400/40 bg-black/55 px-2 py-1 backdrop-blur">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gold-300">
            Power
          </span>{" "}
          <span className="font-display text-sm font-extrabold text-white">
            {powerRating(wizard)}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="relative z-10 mt-2.5 space-y-1 px-4">
        {STAT_ORDER.map((s, i) => (
          <StatRow
            key={s}
            stat={s}
            value={wizard.stats[s]}
            accent={house.accent}
            index={i}
          />
        ))}
      </div>

      {/* RULE PANEL */}
      <div className="relative z-10 mt-auto px-4 pb-4 pt-3">
        <motion.div
          layout
          className={cn(
            "rounded-2xl border px-3.5 py-3 transition-colors",
            drinkMode
              ? "border-gold-400/70 bg-gradient-to-br from-gold-500/25 to-amber-700/15"
              : "border-white/15 bg-white/5",
          )}
          style={
            drinkMode
              ? { boxShadow: "0 0 26px -6px rgba(255,212,40,0.55)" }
              : undefined
          }
          animate={drinkMode ? { scale: [1, 1.015, 1] } : { scale: 1 }}
          transition={{
            duration: 2.2,
            repeat: drinkMode ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <p
            className={cn(
              "mb-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em]",
              safeMode ? "text-emerald-300" : "text-gold-300",
            )}
          >
            <span>{safeMode ? "🎈" : "🍻"}</span>
            {safeMode ? "Party Challenge" : "Drinking Rule"}
          </p>
          <p
            className={cn(
              "font-medium leading-snug text-white",
              drinkMode ? "text-[17px]" : "text-[15px]",
            )}
          >
            {rule}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
