"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wheel, type WheelHandle } from "@/components/Wheel";
import { OptionsList } from "@/components/OptionsList";
import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ConfettiBurst } from "@/components/Confetti";
import { ResultModal } from "@/components/ResultModal";
import { useStore } from "@/lib/store";
import type { WheelOption } from "@/lib/types";
import { Sounds } from "@/lib/sounds";

export default function EliminationPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const stored = useStore((s) => s.currentOptions);
  const add = useStore((s) => s.addOption);
  const update = useStore((s) => s.updateOption);
  const remove = useStore((s) => s.removeOption);
  const clear = useStore((s) => s.clearOptions);
  const pushResult = useStore((s) => s.pushResult);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);

  // local working copy of options that we mutate as items are eliminated
  const [working, setWorking] = useState<WheelOption[]>(
    stored.map((o) => ({ ...o, eliminated: false })),
  );
  const [eliminated, setEliminated] = useState<WheelOption[]>([]);
  const [lastOut, setLastOut] = useState<WheelOption | null>(null);
  const [showOutModal, setShowOutModal] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [winner, setWinner] = useState<WheelOption | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const wheelRef = useRef<WheelHandle>(null);

  // Sync working from stored when add/remove happen and we haven't started eliminating
  useEffect(() => {
    if (eliminated.length === 0 && !winner) {
      setWorking(stored.map((o) => ({ ...o, eliminated: false })));
    }
  }, [stored, eliminated.length, winner]);

  const remaining = working.filter((o) => !o.eliminated);

  const reset = () => {
    setWorking(stored.map((o) => ({ ...o, eliminated: false })));
    setEliminated([]);
    setWinner(null);
    setLastOut(null);
    setShowFinal(false);
    setShowOutModal(false);
  };

  const handleSpin = async () => {
    if (!wheelRef.current) return;
    const result = await wheelRef.current.spin();
    if (!result) return;
    Sounds.tap(soundEnabled);
    pushResult({
      mode: "elimination",
      optionId: result.option.id,
      optionLabel: result.option.label,
      duration: result.duration,
    });
    // Mark eliminated
    setWorking((prev) =>
      prev.map((o) => (o.id === result.option.id ? { ...o, eliminated: true } : o)),
    );
    setEliminated((prev) => [...prev, result.option]);
    setLastOut(result.option);

    const nextRemaining = remaining.filter((o) => o.id !== result.option.id);
    if (nextRemaining.length === 1) {
      setWinner(nextRemaining[0]);
      setConfettiTrigger((t) => t + 1);
      setTimeout(() => setShowFinal(true), 800);
    } else {
      setShowOutModal(true);
    }
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Elimination"
        tagline="Each spin removes one. Last one standing wins."
        rightSlot={
          <PrimaryButton variant="ghost" size="md" onClick={reset}>
            <ResetIcon className="w-4 h-4" />
            Reset
          </PrimaryButton>
        }
      />

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 mt-4">
        <div className="order-2 lg:order-1 flex flex-col items-center">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <Stat label="Remaining" value={remaining.length} accent="gold" />
            <Stat label="Out" value={eliminated.length} accent="rose" />
          </div>

          <div className="relative">
            <Wheel ref={wheelRef} options={working} size={340} />
          </div>

          <div className="mt-6">
            <PrimaryButton
              size="xl"
              onClick={handleSpin}
              disabled={remaining.length < 2 || !!winner}
              className="px-10"
            >
              {winner
                ? "🏆 We have a winner"
                : remaining.length < 2
                ? "Add 2+ options"
                : "Eliminate one"}
            </PrimaryButton>
          </div>

          {eliminated.length > 0 && (
            <div className="mt-6 w-full max-w-sm">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-ink-400 dark:text-ink-300 mb-2">
                Eliminated
              </p>
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {eliminated.map((e, i) => (
                    <motion.span
                      key={e.id}
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold line-through"
                    >
                      {e.label}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <OptionsList
            options={working}
            onAdd={add}
            onUpdate={(id, p) => {
              update(id, p);
              setWorking((prev) =>
                prev.map((o) => (o.id === id ? { ...o, ...p } : o)),
              );
            }}
            onRemove={(id) => {
              remove(id);
              setWorking((prev) => prev.filter((o) => o.id !== id));
            }}
            onClear={() => {
              clear();
              setWorking([]);
              setEliminated([]);
            }}
          />
        </div>
      </div>

      <ResultModal
        open={showOutModal}
        option={lastOut}
        onClose={() => setShowOutModal(false)}
        ctaLabel="Spin again"
        subtitle="Eliminated. Off the wheel."
        onSpinAgain={() => {
          setTimeout(() => handleSpin(), 300);
        }}
      />

      <ResultModal
        open={showFinal}
        option={winner}
        onClose={() => setShowFinal(false)}
        ctaLabel="Restart"
        subtitle="🏆 Last one standing!"
        onSpinAgain={() => reset()}
      />

      <ConfettiBurst trigger={confettiTrigger} />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "gold" | "rose";
}) {
  const color = accent === "gold" ? "text-gold-400" : "text-rose-500";
  return (
    <div className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-400 dark:text-ink-300">
        {label}
      </p>
      <p className={`font-display font-extrabold text-lg ${color}`}>{value}</p>
    </div>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 10 9 10" />
    </svg>
  );
}
