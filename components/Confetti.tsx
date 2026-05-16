"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";

type Props = {
  trigger: number; // change to re-fire
  intensity?: "low" | "medium" | "high";
};

export function ConfettiBurst({ trigger, intensity = "high" }: Props) {
  const enabled = useStore((s) => s.settings.particlesEnabled);

  useEffect(() => {
    if (!enabled) return;
    if (trigger === 0) return;
    const count = intensity === "low" ? 80 : intensity === "medium" ? 140 : 220;
    const colors = ["#FFD428", "#FF6B9D", "#4ECDC4", "#A78BFA", "#60A5FA", "#34D399"];

    const defaults: confetti.Options = {
      origin: { y: 0.55 },
      colors,
      ticks: 220,
      gravity: 0.95,
      spread: 90,
      scalar: 1.05,
      shapes: ["square", "circle"],
    };

    confetti({ ...defaults, particleCount: count, startVelocity: 55, angle: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...defaults, particleCount: count, startVelocity: 55, angle: 120, origin: { x: 1, y: 0.7 } });
    confetti({
      ...defaults,
      particleCount: Math.round(count * 0.6),
      spread: 360,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.45 },
      scalar: 1.2,
    });
  }, [trigger, intensity, enabled]);

  return null;
}
