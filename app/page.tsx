"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { MODES, dailyChallenge, AI_SUGGESTIONS, makeOptions } from "@/lib/presets";
import { ModeCard } from "@/components/ModeCard";
import { HydrationGate } from "@/components/HydrationGate";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function HomePage() {
  return (
    <HydrationGate>
      <HomeContent />
    </HydrationGate>
  );
}

function HomeContent() {
  const router = useRouter();
  const stats = useStore((s) => s.stats);
  const history = useStore((s) => s.history);
  const savedWheels = useStore((s) => s.savedWheels);
  const loadOptions = useStore((s) => s.loadOptions);

  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const daily = useMemo(() => dailyChallenge(new Date()), []);
  const recent = history.slice(0, 3);

  const startWithSuggestion = (idx: number) => {
    const sug = AI_SUGGESTIONS[idx];
    const opts = makeOptions(sug.options);
    loadOptions(opts, sug.title);
    router.push("/classic");
  };

  return (
    <div className="page-enter space-y-8 md:space-y-10">
      {/* Hero */}
      <section className="relative">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="space-y-5"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-semibold backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {stats.totalSpins > 0
                ? `${stats.totalSpins.toLocaleString()} spins · streak ${stats.streak}`
                : "Welcome to your wheel HQ"}
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.02] tracking-tight">
              Spin the wheel.{" "}
              <span className="bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                Make the call.
              </span>
            </h1>
            <p className="text-base md:text-lg text-ink-500 dark:text-ink-300 max-w-md leading-relaxed">
              Six game modes. Saved wheels, instant party packs, weighted
              decisions, and a confetti shower when you finally agree.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <PrimaryButton onClick={() => router.push("/classic")} size="lg">
                Start spinning
                <ArrowIcon className="w-4 h-4" />
              </PrimaryButton>
              <PrimaryButton
                onClick={() => router.push("/party")}
                variant="ghost"
                size="lg"
              >
                🎉 Party mode
              </PrimaryButton>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-xs text-ink-400 dark:text-ink-300">
              <Pill label={`${savedWheels.length} saved`} />
              <Pill label={`${stats.totalSpins} spins`} />
              <Pill label={`${Object.keys(stats.optionFrequency).length} unique picks`} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 26 }}
            className="relative"
          >
            <DailyCard
              emoji={daily.emoji}
              label={daily.label}
              onSpin={() => {
                const labels = [
                  daily.label,
                  "Skip today",
                  "Double down",
                  "Ask a friend",
                  "Tomorrow instead",
                  "Make it bigger",
                ];
                loadOptions(makeOptions(labels), "Daily Challenge");
                router.push("/classic");
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Modes */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="font-display font-bold text-2xl tracking-tight">
              Game modes
            </h2>
            <p className="text-sm text-ink-400 dark:text-ink-300">
              Pick how you want to decide today.
            </p>
          </div>
          <Link
            href="/saved"
            className="text-sm font-semibold text-ink-500 dark:text-ink-300 hover:text-gold-500"
          >
            Saved wheels →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {MODES.map((m, i) => (
            <ModeCard key={m.id} mode={m} index={i} />
          ))}
        </div>
      </section>

      {/* AI Suggestions */}
      <section>
        <div className="mb-3">
          <h2 className="font-display font-bold text-2xl tracking-tight">
            Smart starters
          </h2>
          <p className="text-sm text-ink-400 dark:text-ink-300">
            Pre-built decks you can spin in one tap.
          </p>
        </div>
        <div className="scroll-x flex gap-3 -mx-4 px-4 pb-1">
          {AI_SUGGESTIONS.map((sug, i) => (
            <motion.button
              key={sug.title}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => setActiveSuggestion(i)}
              onClick={() => startWithSuggestion(i)}
              className="relative shrink-0 w-[260px] glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition-transform shadow-card-dark"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-300 to-amber-500 text-navy-900 grid place-items-center text-xl shadow-glow-soft">
                  {sug.emoji}
                </div>
                <div>
                  <p className="font-display font-bold text-base leading-tight">
                    {sug.title}
                  </p>
                  <p className="text-xs text-ink-400 dark:text-ink-300">
                    {sug.options.length} options
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {sug.options.slice(0, 4).map((o) => (
                  <span
                    key={o}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10"
                  >
                    {o}
                  </span>
                ))}
                {sug.options.length > 4 && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10">
                    +{sug.options.length - 4}
                  </span>
                )}
              </div>
              {activeSuggestion === i && (
                <motion.div
                  layoutId="sugGlow"
                  className="absolute -inset-px rounded-2xl ring-2 ring-gold-400/60 pointer-events-none"
                />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      {recent.length > 0 && (
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight">
                Recently picked
              </h2>
              <p className="text-sm text-ink-400 dark:text-ink-300">
                Your last few decisions.
              </p>
            </div>
            <Link
              href="/stats"
              className="text-sm font-semibold text-ink-500 dark:text-ink-300 hover:text-gold-500"
            >
              See stats →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {recent.map((r) => (
              <div
                key={r.id}
                className="glass rounded-2xl p-4 flex items-center gap-3 shadow-card-dark"
              >
                <div className="w-10 h-10 rounded-xl grid place-items-center text-xl bg-gradient-to-br from-gold-300 to-amber-500 text-navy-900">
                  🎯
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {r.optionLabel}
                  </p>
                  <p className="text-xs text-ink-400 dark:text-ink-300 capitalize">
                    {r.mode.replace("-", " ")} ·{" "}
                    {new Date(r.timestamp).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="px-2.5 py-1 rounded-md bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 font-medium">
      {label}
    </span>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function DailyCard({
  emoji,
  label,
  onSpin,
}: {
  emoji: string;
  label: string;
  onSpin: () => void;
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-500 via-navy-700 to-navy-900" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gold-400/30 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative p-6 md:p-7 text-white">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-gold-300">
            Daily challenge
          </span>
          <span className="text-xs font-medium text-white/70">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur grid place-items-center text-5xl md:text-6xl shadow-inner border border-white/10"
          >
            {emoji}
          </motion.div>
          <div className="flex-1">
            <p className="text-xl md:text-2xl font-display font-extrabold leading-snug">
              {label}
            </p>
            <p className="text-xs md:text-sm text-white/70 mt-1">
              Tap to spin a wheel built around today's prompt.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2.5">
          <button
            onClick={onSpin}
            className="flex-1 h-11 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 font-bold text-sm active:scale-[0.98] shadow-glow-soft"
          >
            Spin today's wheel
          </button>
        </div>
      </div>
    </div>
  );
}
