"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Wheel, type WheelHandle } from "./Wheel";
import { ResultModal } from "./ResultModal";
import { ConfettiBurst } from "./Confetti";
import { PrimaryButton } from "./PrimaryButton";
import type { GameMode, WheelOption } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Sounds } from "@/lib/sounds";

type Props = {
  options: WheelOption[];
  weighted?: boolean;
  mode: GameMode;
  resultSubtitle?: string;
  onResolved?: (option: WheelOption) => void;
  onSpinAgain?: () => void;
  ctaLabel?: string;
  hideShareOptions?: boolean;
  size?: number;
  highlightedId?: string | null;
};

export function WheelStage({
  options,
  weighted,
  mode,
  resultSubtitle,
  onResolved,
  onSpinAgain,
  ctaLabel,
  size,
  highlightedId,
}: Props) {
  const wheelRef = useRef<WheelHandle>(null);
  const pushResult = useStore((s) => s.pushResult);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);
  const [winner, setWinner] = useState<WheelOption | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [stageSize, setStageSize] = useState<number>(size ?? 320);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (size) {
      setStageSize(size);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth;
      // cap and floor for readability
      const next = Math.max(260, Math.min(440, Math.floor(w)));
      setStageSize(next);
    };
    calc();
    const obs = new ResizeObserver(calc);
    obs.observe(el);
    return () => obs.disconnect();
  }, [size]);

  const canSpin = useMemo(
    () => options.filter((o) => !o.eliminated).length > 1,
    [options],
  );

  const handleSpin = async () => {
    if (!wheelRef.current) return;
    const result = await wheelRef.current.spin();
    if (!result) return;
    pushResult({
      mode,
      optionId: result.option.id,
      optionLabel: result.option.label,
      duration: result.duration,
    });
    setWinner(result.option);
    setConfettiTrigger((t) => t + 1);
    setModalOpen(true);
    onResolved?.(result.option);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-md mx-auto"
    >
      <div className="relative grid place-items-center w-full" style={{ minHeight: stageSize + 50 }}>
        <Wheel
          ref={wheelRef}
          options={options}
          size={stageSize}
          weighted={weighted}
          highlightedId={highlightedId}
          onSpinStart={() => Sounds.tap(soundEnabled)}
        />
      </div>

      <div className="mt-6 w-full flex items-center justify-center">
        <PrimaryButton
          size="xl"
          disabled={!canSpin}
          onClick={handleSpin}
          className="px-10"
        >
          {!canSpin ? "Add 2+ options" : "Spin"}
          <SparkIcon className="w-5 h-5" />
        </PrimaryButton>
      </div>

      <ResultModal
        open={modalOpen}
        option={winner}
        onClose={() => setModalOpen(false)}
        onSpinAgain={() => {
          onSpinAgain?.();
          // small delay so the modal close animation finishes first
          setTimeout(() => handleSpin(), 350);
        }}
        ctaLabel={ctaLabel}
        subtitle={resultSubtitle}
      />
      <ConfettiBurst trigger={confettiTrigger} />
    </div>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" />
      <path d="M19 14l.9 2.6L22.5 17l-2.6.9L19 20l-.9-2.1L15.5 17l2.6-.4z" opacity=".6" />
    </svg>
  );
}
