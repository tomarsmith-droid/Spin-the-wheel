"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { WheelStage } from "@/components/WheelStage";
import { OptionsList } from "@/components/OptionsList";
import { PARTY_PACKS, makeOptions } from "@/lib/presets";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { WheelOption } from "@/lib/types";
import { Sounds } from "@/lib/sounds";
import { shuffle } from "@/lib/utils";
import { nanoid } from "nanoid";

const PACK_META: { key: keyof typeof PARTY_PACKS; emoji: string; gradient: string }[] = [
  { key: "truth", emoji: "🙊", gradient: "from-fuchsia-500 to-purple-600" },
  { key: "drinking", emoji: "🍹", gradient: "from-rose-400 to-red-500" },
  { key: "punishments", emoji: "😈", gradient: "from-amber-400 to-orange-500" },
  { key: "chaos", emoji: "🌀", gradient: "from-cyan-400 to-indigo-500" },
];

export default function PartyPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const soundEnabled = useStore((s) => s.settings.soundEnabled);
  const [activePack, setActivePack] = useState<keyof typeof PARTY_PACKS>("truth");
  const [customOnly, setCustomOnly] = useState(false);
  const [custom, setCustom] = useState<WheelOption[]>([]);
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);

  const baseOptions = useMemo(() => {
    if (customOnly) return custom;
    return makeOptions(PARTY_PACKS[activePack].options);
  }, [activePack, customOnly, custom]);

  return (
    <div className="page-enter">
      <PageHeader
        title="Party Mode"
        tagline="Game-night fuel for any vibe."
      />

      <div className="mt-4 grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
        <div>
          {/* Pack chooser */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {PACK_META.map((p) => {
              const active = !customOnly && activePack === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => {
                    Sounds.tap(soundEnabled);
                    setCustomOnly(false);
                    setActivePack(p.key);
                  }}
                  className={cn(
                    "relative rounded-2xl p-3 text-left overflow-hidden border transition-all",
                    active
                      ? "border-gold-400 shadow-glow-soft"
                      : "border-black/5 dark:border-white/10 hover:border-gold-400/40",
                  )}
                >
                  <div className={cn("absolute inset-0 opacity-90 bg-gradient-to-br", p.gradient)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="relative text-white">
                    <div className="text-2xl">{p.emoji}</div>
                    <p className="font-display font-bold text-sm mt-1 leading-tight">
                      {PARTY_PACKS[p.key].label}
                    </p>
                    <p className="text-[10px] opacity-80">
                      {PARTY_PACKS[p.key].options.length} prompts
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <button
              onClick={() => setCustomOnly(false)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors",
                !customOnly ? "bg-gold-400 text-navy-900" : "bg-white/60 dark:bg-white/10",
              )}
            >
              Pack
            </button>
            <button
              onClick={() => setCustomOnly(true)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors",
                customOnly ? "bg-gold-400 text-navy-900" : "bg-white/60 dark:bg-white/10",
              )}
            >
              Custom
            </button>
            <button
              onClick={() => setTeamPickerOpen((v) => !v)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/60 dark:bg-white/10 hover:bg-gold-400/30"
            >
              👥 Team picker
            </button>
          </div>

          {teamPickerOpen && (
            <TeamPicker onClose={() => setTeamPickerOpen(false)} />
          )}

          {!teamPickerOpen && (
            <WheelStage
              options={baseOptions}
              mode="party"
              resultSubtitle={customOnly ? "Custom dare" : PARTY_PACKS[activePack].label}
            />
          )}
        </div>

        <div>
          {customOnly ? (
            <OptionsList
              options={custom}
              onAdd={(label) =>
                setCustom((prev) => [
                  ...prev,
                  {
                    id: nanoid(8),
                    label,
                    color:
                      ["#FF6B9D", "#A78BFA", "#FFD428", "#4ECDC4", "#FB923C"][
                        prev.length % 5
                      ],
                    weight: 1,
                  },
                ])
              }
              onUpdate={(id, patch) =>
                setCustom((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
              }
              onRemove={(id) => setCustom((prev) => prev.filter((o) => o.id !== id))}
              onClear={() => setCustom([])}
              emptyHint="Write your own dares & prompts."
            />
          ) : (
            <div className="glass rounded-2xl p-4 md:p-5 shadow-card-dark">
              <h3 className="font-display text-base font-bold tracking-tight">
                {PARTY_PACKS[activePack].label}
              </h3>
              <p className="text-xs text-ink-400 dark:text-ink-300 mt-0.5 mb-3">
                {baseOptions.length} prompts loaded
              </p>
              <div className="space-y-1.5 max-h-[40vh] md:max-h-[420px] overflow-y-auto no-scrollbar">
                {baseOptions.map((o) => (
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
          )}
        </div>
      </div>
    </div>
  );
}

function TeamPicker({ onClose }: { onClose: () => void }) {
  const [players, setPlayers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [teams, setTeams] = useState<string[][] | null>(null);
  const [teamCount, setTeamCount] = useState(2);

  const make = () => {
    if (players.length < teamCount) return;
    const shuffled = shuffle(players);
    const out: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((p, i) => out[i % teamCount].push(p));
    setTeams(out);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 shadow-card-dark"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-lg">Team picker</h3>
        <button onClick={onClose} className="text-xs text-ink-400 hover:text-rose-500">
          Close
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {players.map((p) => (
          <span
            key={p}
            className="px-2.5 py-1 rounded-md bg-gold-400/20 border border-gold-400/40 text-xs font-semibold"
          >
            {p}
            <button
              className="ml-1.5 text-ink-400 hover:text-rose-500"
              onClick={() => setPlayers((arr) => arr.filter((n) => n !== p))}
            >
              ×
            </button>
          </span>
        ))}
        {players.length === 0 && (
          <p className="text-xs text-ink-400">Add players to split into teams.</p>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (draft.trim()) {
                setPlayers((arr) => [...arr, draft.trim()]);
                setDraft("");
              }
            }
          }}
          placeholder="Add player name"
          className="flex-1 h-10 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm focus:outline-none focus:border-gold-400"
        />
        <select
          value={teamCount}
          onChange={(e) => setTeamCount(parseInt(e.target.value))}
          className="h-10 px-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm focus:outline-none"
        >
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} teams
            </option>
          ))}
        </select>
        <button
          onClick={make}
          disabled={players.length < teamCount}
          className="h-10 px-4 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 text-sm font-bold disabled:opacity-40"
        >
          Shuffle
        </button>
      </div>

      {teams && (
        <div className="grid sm:grid-cols-2 gap-2">
          {teams.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 p-3"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gold-500 mb-1">
                Team {i + 1}
              </p>
              <p className="text-sm font-semibold leading-snug">{t.join(", ")}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
