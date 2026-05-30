"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from "framer-motion";
import { WIZARDS, type Wizard } from "@/lib/wizards";
import { shuffle as shuffleArray } from "@/lib/utils";
import { WizardCard } from "@/components/wizards/WizardCard";
import { Sparkles } from "@/components/wizards/Sparkles";

const SWIPE_THRESHOLD = 90; // px of drag before a flick registers
const SWIPE_VELOCITY = 450; // or fast enough flick

type Phase = "start" | "playing";

export default function WizardsPage() {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("start");
  const [deck, setDeck] = useState<Wizard[]>(WIZARDS);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [showRules, setShowRules] = useState(false);

  // toggles (persisted)
  const [safeMode, setSafeMode] = useState(false);
  const [drinkMode, setDrinkMode] = useState(true);

  // restore prefs
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wizard-trumps-prefs");
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.safeMode === "boolean") setSafeMode(p.safeMode);
        if (typeof p.drinkMode === "boolean") setDrinkMode(p.drinkMode);
      }
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        "wizard-trumps-prefs",
        JSON.stringify({ safeMode, drinkMode }),
      );
    } catch {
      /* ignore */
    }
  }, [safeMode, drinkMode]);

  const current = deck[index];

  const paginate = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((i) => (i + dir + deck.length) % deck.length);
    },
    [deck.length],
  );

  const handleShuffle = useCallback(() => {
    setDeck((d) => shuffleArray(d));
    setDirection(1);
    setIndex(0);
  }, []);

  const handleRandom = useCallback(() => {
    if (deck.length < 2) return;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * deck.length);
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }, [deck.length, index]);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
        paginate(1); // flick left → next
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
        paginate(-1); // flick right → previous
      }
    },
    [paginate],
  );

  // keyboard support (desktop polish)
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
      else if (e.key === " ") {
        e.preventDefault();
        handleRandom();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, paginate, handleRandom]);

  const variants = useMemo(
    () => ({
      enter: (dir: number) => ({
        x: reduce ? 0 : dir > 0 ? 320 : -320,
        opacity: 0,
        rotate: reduce ? 0 : dir > 0 ? 7 : -7,
        scale: 0.92,
      }),
      center: { x: 0, opacity: 1, rotate: 0, scale: 1 },
      exit: (dir: number) => ({
        x: reduce ? 0 : dir > 0 ? -320 : 320,
        opacity: 0,
        rotate: reduce ? 0 : dir > 0 ? -7 : 7,
        scale: 0.92,
      }),
    }),
    [reduce],
  );

  return (
    <div className="page-enter relative">
      <Sparkles />

      {phase === "start" ? (
        <StartScreen
          onStart={() => setPhase("playing")}
          onRules={() => setShowRules(true)}
          count={deck.length}
        />
      ) : (
        <div className="mx-auto max-w-md">
          {/* Title bar */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">
                  Wizard Trumps
                </span>
              </h1>
              <p className="text-xs text-ink-400 dark:text-ink-300">
                Card {index + 1} of {deck.length} · flick or tap to explore
              </p>
            </div>
            <button
              onClick={() => setShowRules(true)}
              className="glass rounded-xl px-3 py-2 text-xs font-semibold shadow-card-dark"
            >
              ❔ Rules
            </button>
          </div>

          {/* Toggles */}
          <div className="mb-4 flex gap-2">
            <Toggle
              label="Safe mode"
              hint="Silly party prompts"
              on={safeMode}
              onChange={() => setSafeMode((v) => !v)}
            />
            <Toggle
              label="Drinking mode"
              hint="Make rules pop"
              on={drinkMode}
              onChange={() => setDrinkMode((v) => !v)}
            />
          </div>

          {/* Card stage */}
          <div
            className="relative mx-auto"
            style={{ height: "min(54vh, 520px)" }}
          >
            {/* ghost stack behind for depth */}
            <div className="absolute inset-x-3 top-2 bottom-0 -z-10 rounded-[26px] bg-black/30 blur-sm" />
            <div className="absolute inset-x-6 top-4 bottom-0 -z-20 rounded-[26px] bg-black/20 blur-sm" />

            <AnimatePresence custom={direction} initial={false} mode="popLayout">
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 320, damping: 32 },
                  opacity: { duration: 0.2 },
                  rotate: { type: "spring", stiffness: 320, damping: 32 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                whileTap={{ cursor: "grabbing" }}
                className="absolute inset-0 cursor-grab touch-pan-y"
              >
                <WizardCard
                  wizard={current}
                  safeMode={safeMode}
                  drinkMode={drinkMode}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <RoundButton label="Previous" onClick={() => paginate(-1)}>
              ‹
            </RoundButton>
            <ActionButton onClick={handleShuffle}>🔀 Shuffle</ActionButton>
            <ActionButton onClick={handleRandom} primary>
              🎲 Random
            </ActionButton>
            <RoundButton label="Next" onClick={() => paginate(1)}>
              ›
            </RoundButton>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showRules && <RulesPanel onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Start screen                                                       */
/* ------------------------------------------------------------------ */
function StartScreen({
  onStart,
  onRules,
  count,
}: {
  onStart: () => void;
  onRules: () => void;
  count: number;
}) {
  return (
    <div className="mx-auto max-w-md py-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 text-5xl shadow-glow">
          🪄
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          A cosy pub card game
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Wizard{" "}
          <span className="bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
            Trumps
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-ink-500 dark:text-ink-300">
          Flick through a candlelit deck of {count} original wizarding folk.
          Compare stats, follow the rule on each card, and let the night get
          gloriously chaotic. 🍻
        </p>

        <div className="mt-7 space-y-2.5">
          <button
            onClick={onStart}
            className="h-14 w-full rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 font-display text-lg font-bold text-navy-900 shadow-glow-soft transition-transform active:scale-[0.98]"
          >
            Start game →
          </button>
          <button
            onClick={onRules}
            className="glass h-12 w-full rounded-2xl text-sm font-semibold shadow-card-dark"
          >
            How to play
          </button>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-2 text-center">
          <MiniFeature emoji="🃏" label="Swipe deck" />
          <MiniFeature emoji="🔀" label="Shuffle" />
          <MiniFeature emoji="🎈" label="Safe mode" />
        </div>
      </motion.div>
    </div>
  );
}

function MiniFeature({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="glass rounded-2xl py-3 shadow-card-dark">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-[11px] font-medium text-ink-400 dark:text-ink-300">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Controls                                                           */
/* ------------------------------------------------------------------ */
function RoundButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      className="glass grid h-12 w-12 place-items-center rounded-full text-2xl font-bold leading-none shadow-card-dark"
    >
      {children}
    </motion.button>
  );
}

function ActionButton({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={
        primary
          ? "h-12 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 px-4 font-bold text-navy-900 shadow-glow-soft"
          : "glass h-12 rounded-2xl px-4 font-semibold shadow-card-dark"
      }
    >
      {children}
    </motion.button>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="glass flex flex-1 items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-left shadow-card-dark"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">
          {label}
        </span>
        <span className="block truncate text-[11px] text-ink-400 dark:text-ink-300">
          {hint}
        </span>
      </span>
      <span className="switch shrink-0" data-on={on} aria-hidden />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Rules panel (bottom sheet)                                         */
/* ------------------------------------------------------------------ */
function RulesPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="glass-strong fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-card-dark"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
        <h2 className="font-display text-2xl font-extrabold">How to play 🪄</h2>
        <p className="mt-1 text-sm text-ink-400 dark:text-ink-300">
          A relaxed pub game for 2+ wizards.
        </p>

        <ol className="mt-4 space-y-3 text-sm">
          <Rule n={1}>
            Pass the phone around the table. Each player reveals the top card.
          </Rule>
          <Rule n={2}>
            <strong>Flick or swipe</strong> the card left for the next wizard,
            right to go back — or use the ‹ › buttons.
          </Rule>
          <Rule n={3}>
            Read the rule at the bottom of the card aloud and{" "}
            <strong>everybody does what it says.</strong> 🍻
          </Rule>
          <Rule n={4}>
            Hit <strong>🎲 Random</strong> for a surprise card, or{" "}
            <strong>🔀 Shuffle</strong> to reorder the whole deck.
          </Rule>
          <Rule n={5}>
            Flip on <strong>Safe mode</strong> to swap drinks for silly party
            challenges, or <strong>Drinking mode</strong> to make rules bigger
            and bolder.
          </Rule>
          <Rule n={6}>
            Compare stats card-to-card to crown a champion — or just vibe. The
            highest <em>Power</em> wins ties.
          </Rule>
        </ol>

        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-ink-400 dark:text-ink-300">
          🧡 Please sip responsibly, know your limits, and never pressure anyone
          — Safe mode keeps the magic alcohol-free.
        </p>

        <button
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 font-bold text-navy-900 shadow-glow-soft active:scale-[0.98]"
        >
          Got it!
        </button>
      </motion.div>
    </>
  );
}

function Rule({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-xs font-bold text-navy-900">
        {n}
      </span>
      <span className="leading-relaxed text-ink-600 dark:text-ink-200">
        {children}
      </span>
    </li>
  );
}
