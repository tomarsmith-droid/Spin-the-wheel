"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { shuffle } from "@/lib/utils";
import { nanoid } from "nanoid";

type Match = {
  id: string;
  a: WheelOption | null;
  b: WheelOption | null;
  winner?: WheelOption;
};

type Round = Match[];

export default function TournamentPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function buildBracket(opts: WheelOption[]): Round[] {
  const shuffled = shuffle(opts);
  // pad to next power of two with byes (null)
  let size = 1;
  while (size < shuffled.length) size *= 2;
  const padded: (WheelOption | null)[] = [...shuffled];
  while (padded.length < size) padded.push(null);

  const round1: Round = [];
  for (let i = 0; i < padded.length; i += 2) {
    round1.push({ id: nanoid(6), a: padded[i], b: padded[i + 1] });
  }
  // auto-advance byes
  round1.forEach((m) => {
    if (m.a && !m.b) m.winner = m.a;
    if (m.b && !m.a) m.winner = m.b;
  });
  const rounds: Round[] = [round1];
  let cur = round1;
  while (cur.length > 1) {
    const next: Round = [];
    for (let i = 0; i < cur.length; i += 2) {
      next.push({
        id: nanoid(6),
        a: cur[i].winner ?? null,
        b: cur[i + 1]?.winner ?? null,
      });
    }
    rounds.push(next);
    cur = next;
  }
  return rounds;
}

function Inner() {
  const stored = useStore((s) => s.currentOptions);
  const add = useStore((s) => s.addOption);
  const update = useStore((s) => s.updateOption);
  const remove = useStore((s) => s.removeOption);
  const clear = useStore((s) => s.clearOptions);
  const pushResult = useStore((s) => s.pushResult);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);

  const [started, setStarted] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastWinner, setLastWinner] = useState<WheelOption | null>(null);
  const [champion, setChampion] = useState<WheelOption | null>(null);
  const [showChampion, setShowChampion] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const wheelRef = useRef<WheelHandle>(null);

  const reset = () => {
    setStarted(false);
    setRounds([]);
    setCurrentRound(0);
    setCurrentMatch(0);
    setShowResult(false);
    setChampion(null);
    setShowChampion(false);
    setLastWinner(null);
  };

  const start = () => {
    if (stored.length < 2) return;
    Sounds.tap(soundEnabled);
    setRounds(buildBracket(stored));
    setCurrentRound(0);
    setCurrentMatch(0);
    setStarted(true);
    setChampion(null);
  };

  // Advance to next non-bye match
  useEffect(() => {
    if (!started) return;
    if (rounds.length === 0) return;
    const round = rounds[currentRound];
    if (!round) return;
    const idx = round.findIndex((m) => !m.winner);
    if (idx === -1) {
      // round complete
      if (currentRound + 1 >= rounds.length) {
        // tournament done
        const finalRound = rounds[rounds.length - 1];
        const champ = finalRound[0]?.winner ?? null;
        setChampion(champ);
        setShowChampion(!!champ);
        if (champ) setConfettiTrigger((t) => t + 1);
        return;
      }
      setCurrentRound(currentRound + 1);
      setCurrentMatch(0);
    } else if (idx !== currentMatch) {
      setCurrentMatch(idx);
    }
  }, [rounds, currentRound, currentMatch, started]);

  const match = rounds[currentRound]?.[currentMatch] ?? null;

  const matchOptions = useMemo<WheelOption[]>(() => {
    if (!match || !match.a || !match.b) return [];
    return [
      { ...match.a, color: "#FFD428" },
      { ...match.b, color: "#FF6B9D" },
    ];
  }, [match]);

  const spinMatch = async () => {
    if (!wheelRef.current || !match || !match.a || !match.b) return;
    const result = await wheelRef.current.spin();
    if (!result) return;
    const winnerOpt = match.a.id === result.option.id ? match.a : match.b;
    pushResult({
      mode: "tournament",
      optionId: winnerOpt.id,
      optionLabel: winnerOpt.label,
      duration: result.duration,
    });
    setRounds((prev) => {
      const copy = prev.map((r) => r.map((m) => ({ ...m })));
      copy[currentRound][currentMatch].winner = winnerOpt;
      // propagate winner into the next round if it exists
      if (currentRound + 1 < copy.length) {
        const slot = Math.floor(currentMatch / 2);
        if (currentMatch % 2 === 0) copy[currentRound + 1][slot].a = winnerOpt;
        else copy[currentRound + 1][slot].b = winnerOpt;
      }
      return copy;
    });
    setLastWinner(winnerOpt);
    setShowResult(true);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Tournament"
        tagline="Bracket-style spin-offs. One champion."
        rightSlot={
          started ? (
            <PrimaryButton variant="ghost" size="md" onClick={reset}>
              Reset bracket
            </PrimaryButton>
          ) : (
            <PrimaryButton
              size="md"
              onClick={start}
              disabled={stored.length < 2}
            >
              Start bracket
            </PrimaryButton>
          )
        }
      />

      {!started ? (
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 mt-4">
          <div className="glass rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-300 to-amber-500 text-navy-900 grid place-items-center text-4xl shadow-glow mb-4">
              🏆
            </div>
            <h2 className="font-display text-2xl font-bold">
              Build your bracket
            </h2>
            <p className="text-sm text-ink-400 dark:text-ink-300 mt-1 max-w-xs">
              Add your contenders, then start the tournament. Best of any number
              — byes are handled automatically.
            </p>
            <PrimaryButton
              className="mt-6"
              onClick={start}
              disabled={stored.length < 2}
            >
              {stored.length < 2 ? "Add 2+ contenders" : "Start tournament"}
            </PrimaryButton>
          </div>
          <OptionsList
            options={stored}
            onAdd={add}
            onUpdate={update}
            onRemove={remove}
            onClear={clear}
            emptyHint="Add contenders to bracket"
          />
        </div>
      ) : (
        <div className="mt-4 grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          <div className="flex flex-col items-center">
            {match && match.a && match.b ? (
              <>
                <div className="mb-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gold-500">
                    Round {currentRound + 1} of {rounds.length} — Match {currentMatch + 1}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Contender option={match.a} />
                    <span className="text-xs text-ink-400 dark:text-ink-300 font-bold">VS</span>
                    <Contender option={match.b} />
                  </div>
                </div>
                <Wheel ref={wheelRef} options={matchOptions} size={320} />
                <PrimaryButton size="xl" className="mt-6 px-10" onClick={spinMatch}>
                  Spin the match
                </PrimaryButton>
              </>
            ) : champion ? (
              <ChampionCard option={champion} onRestart={reset} />
            ) : null}
          </div>

          <BracketView rounds={rounds} currentRound={currentRound} currentMatch={currentMatch} />
        </div>
      )}

      <ResultModal
        open={showResult}
        option={lastWinner}
        onClose={() => setShowResult(false)}
        ctaLabel="Next match"
        subtitle="Advances to the next round"
        onSpinAgain={() => {
          setTimeout(() => {
            if (wheelRef.current) void spinMatch();
          }, 300);
        }}
      />

      <ResultModal
        open={showChampion}
        option={champion}
        onClose={() => setShowChampion(false)}
        ctaLabel="New tournament"
        subtitle="🏆 Champion crowned!"
        onSpinAgain={reset}
      />

      <ConfettiBurst trigger={confettiTrigger} />
    </div>
  );
}

function Contender({ option }: { option: WheelOption }) {
  return (
    <div className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 text-sm font-semibold max-w-[160px] truncate">
      <span
        className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
        style={{ background: option.color }}
      />
      {option.label}
    </div>
  );
}

function BracketView({
  rounds,
  currentRound,
  currentMatch,
}: {
  rounds: Round[];
  currentRound: number;
  currentMatch: number;
}) {
  return (
    <div className="glass rounded-2xl p-3 md:p-4 max-h-[60vh] lg:max-h-none overflow-auto no-scrollbar">
      <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-ink-400 dark:text-ink-300 mb-3 px-1">
        Bracket
      </p>
      <div className="flex gap-3 min-w-max">
        {rounds.map((round, ri) => (
          <div key={ri} className="flex flex-col gap-2 justify-around">
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-400 dark:text-ink-300 px-1">
              {ri === rounds.length - 1
                ? "Final"
                : ri === rounds.length - 2
                ? "Semi"
                : `R${ri + 1}`}
            </p>
            {round.map((m, mi) => {
              const isActive = ri === currentRound && mi === currentMatch && !m.winner;
              return (
                <div
                  key={m.id}
                  className={`rounded-xl border text-xs overflow-hidden transition-all w-[140px] ${
                    isActive
                      ? "border-gold-400 shadow-glow-soft"
                      : "border-black/5 dark:border-white/10"
                  }`}
                >
                  <Cell option={m.a} winner={m.winner?.id === m.a?.id} />
                  <div className="h-px bg-black/5 dark:bg-white/10" />
                  <Cell option={m.b} winner={m.winner?.id === m.b?.id} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ option, winner }: { option: WheelOption | null; winner?: boolean }) {
  if (!option) {
    return (
      <div className="px-2.5 py-1.5 bg-white/40 dark:bg-white/5 text-[11px] text-ink-300 italic">
        TBD
      </div>
    );
  }
  return (
    <div
      className={`px-2.5 py-1.5 flex items-center gap-1.5 truncate ${
        winner
          ? "bg-gradient-to-r from-gold-300/30 to-gold-500/10 font-bold"
          : "bg-white/50 dark:bg-white/5 font-medium"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: option.color }} />
      <span className="truncate text-[11px]">{option.label}</span>
      {winner && <span className="ml-auto text-gold-500">✓</span>}
    </div>
  );
}

function ChampionCard({
  option,
  onRestart,
}: {
  option: WheelOption;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="relative rounded-3xl overflow-hidden p-8 text-center min-w-[320px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-gold-400 to-orange-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="relative text-navy-900">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-white/40 backdrop-blur grid place-items-center text-6xl shadow-inner">
          🏆
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] font-extrabold">
          Tournament champion
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl mt-1">
          {option.label}
        </h2>
        <button
          onClick={onRestart}
          className="mt-6 h-11 px-6 rounded-xl bg-navy-900 text-gold-300 font-bold text-sm hover:bg-navy-800"
        >
          New tournament
        </button>
      </div>
    </motion.div>
  );
}
