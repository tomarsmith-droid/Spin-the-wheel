"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  hue: string;
}

const HUES = ["#ffd428", "#fde047", "#fca5a5", "#a5b4fc", "#86efac", "#f0abfc"];

/**
 * Floating magical particles drifting up the screen. Positions are generated
 * AFTER mount (in an effect) so server + client markup stay identical and we
 * never hit a hydration mismatch.
 */
export function Sparkles({ count = 26 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const next: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 12,
      duration: 9 + Math.random() * 12,
      drift: (Math.random() - 0.5) * 80,
      hue: HUES[Math.floor(Math.random() * HUES.length)],
    }));
    setParticles(next);
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle-dot"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.hue,
              boxShadow: `0 0 ${p.size * 3}px ${p.hue}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
