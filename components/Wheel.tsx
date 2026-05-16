"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import type { WheelOption } from "@/lib/types";
import { getContrastText } from "@/lib/colors";
import { Sounds, haptic } from "@/lib/sounds";
import { useStore } from "@/lib/store";

type SpinResult = {
  option: WheelOption;
  index: number;
  duration: number;
};

export type WheelHandle = {
  spin: () => Promise<SpinResult | null>;
  isSpinning: () => boolean;
};

type Props = {
  options: WheelOption[];
  size?: number;
  onSpinStart?: () => void;
  onSpinEnd?: (result: SpinResult) => void;
  weighted?: boolean;
  highlightedId?: string | null;
};

const SPEEDS: Record<"slow" | "normal" | "fast", number> = {
  slow: 7200,
  normal: 5400,
  fast: 3600,
};

export const Wheel = forwardRef<WheelHandle, Props>(function Wheel(
  { options, size = 360, onSpinStart, onSpinEnd, weighted = false, highlightedId },
  ref,
) {
  const settings = useStore((s) => s.settings);
  const baseDuration = SPEEDS[settings.spinSpeed];
  const intensityMultiplier =
    settings.animationIntensity === "low"
      ? 0.7
      : settings.animationIntensity === "medium"
      ? 0.9
      : 1;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastSegmentRef = useRef<number>(-1);
  const tickTimerRef = useRef<number | null>(null);

  const total = Math.max(1, options.length);
  const segmentAngle = 360 / total;

  // Pre-compute weighted segment ranges (start, end) in degrees
  const segments = useMemo(() => {
    const totalWeight = options.reduce(
      (s, o) => s + (weighted ? Math.max(0.1, o.weight || 1) : 1),
      0,
    );
    let acc = 0;
    return options.map((o) => {
      const w = weighted ? Math.max(0.1, o.weight || 1) : 1;
      const portion = (w / totalWeight) * 360;
      const start = acc;
      const end = acc + portion;
      acc = end;
      return { option: o, start, end, portion };
    });
  }, [options, weighted]);

  const computePath = useCallback(
    (start: number, end: number, r: number) => {
      const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
      const x1 = 50 + r * Math.cos(toRad(start));
      const y1 = 50 + r * Math.sin(toRad(start));
      const x2 = 50 + r * Math.cos(toRad(end));
      const y2 = 50 + r * Math.sin(toRad(end));
      const large = end - start > 180 ? 1 : 0;
      return `M50,50 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    },
    [],
  );

  const pickWinner = useCallback(() => {
    // pick by weight
    const eligible = segments.filter((s) => !s.option.eliminated);
    if (eligible.length === 0) return null;
    const totalW = eligible.reduce(
      (s, seg) => s + (weighted ? Math.max(0.1, seg.option.weight || 1) : 1),
      0,
    );
    let r = Math.random() * totalW;
    for (const seg of eligible) {
      const w = weighted ? Math.max(0.1, seg.option.weight || 1) : 1;
      r -= w;
      if (r <= 0) return seg;
    }
    return eligible[eligible.length - 1];
  }, [segments, weighted]);

  const spin = useCallback(async (): Promise<SpinResult | null> => {
    if (spinning) return null;
    if (options.length < 2) return null;

    const target = pickWinner();
    if (!target) return null;

    setSpinning(true);
    onSpinStart?.();
    Sounds.whoosh(settings.soundEnabled);
    haptic(settings.hapticsEnabled, 10);

    // Choose where in the segment to land — a little randomness inside the wedge
    const segMid = (target.start + target.end) / 2;
    const wedge = target.end - target.start;
    const jitter = (Math.random() - 0.5) * wedge * 0.7;
    const landAt = segMid + jitter;

    // The pointer is at the top (0deg). To bring landAt to 0, we rotate by (360 - landAt)
    // plus several full turns to look dramatic.
    const fullTurns = 6 + Math.floor(Math.random() * 3);
    const finalAngle = fullTurns * 360 + (360 - landAt);

    // We accumulate rotation so successive spins continue smoothly
    const start = rotation;
    const end = start + finalAngle;

    const duration = Math.round(baseDuration * intensityMultiplier);
    const startedAt = performance.now();

    // Animate
    setRotation(end);

    // Tick sound timing - schedule ticks while crossing segment boundaries
    if (tickTimerRef.current) {
      window.clearInterval(tickTimerRef.current);
    }

    lastSegmentRef.current = -1;
    const tickLoop = () => {
      const now = performance.now();
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = start + (end - start) * eased;
      const normalized = ((360 - (current % 360)) + 360) % 360;
      // figure out which segment is at pointer (top, 0 deg)
      const idx = segments.findIndex(
        (s) => normalized >= s.start && normalized < s.end,
      );
      if (idx !== lastSegmentRef.current && idx !== -1) {
        lastSegmentRef.current = idx;
        Sounds.tick(settings.soundEnabled);
        haptic(settings.hapticsEnabled, 5);
      }
      if (t < 1 && tickTimerRef.current !== null) {
        tickTimerRef.current = requestAnimationFrame(tickLoop) as unknown as number;
      }
    };
    tickTimerRef.current = requestAnimationFrame(tickLoop) as unknown as number;

    return new Promise<SpinResult>((resolve) => {
      window.setTimeout(() => {
        if (tickTimerRef.current) {
          cancelAnimationFrame(tickTimerRef.current);
          tickTimerRef.current = null;
        }
        const index = options.findIndex((o) => o.id === target.option.id);
        const result: SpinResult = {
          option: target.option,
          index,
          duration,
        };
        setSpinning(false);
        Sounds.win(settings.soundEnabled);
        haptic(settings.hapticsEnabled, [20, 30, 20]);
        onSpinEnd?.(result);
        resolve(result);
      }, duration + 60);
    });
  }, [
    spinning,
    options,
    pickWinner,
    onSpinStart,
    settings.soundEnabled,
    settings.hapticsEnabled,
    rotation,
    baseDuration,
    intensityMultiplier,
    segments,
    onSpinEnd,
  ]);

  useImperativeHandle(ref, () => ({
    spin,
    isSpinning: () => spinning,
  }));

  useEffect(() => {
    return () => {
      if (tickTimerRef.current) {
        cancelAnimationFrame(tickTimerRef.current);
      }
    };
  }, []);

  const safeSize = size;

  const radius = 48;
  const labelRadius = 32;

  return (
    <div
      className="relative inline-block touch-none select-none"
      style={{ width: safeSize, height: safeSize }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,212,40,0.25), transparent 70%)",
          opacity: spinning ? 1 : 0.45,
          transition: "opacity 400ms ease",
        }}
        aria-hidden
      />

      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-300 via-amber-400 to-orange-500 p-[6px] shadow-glow">
        <div className="w-full h-full rounded-full bg-navy-900 dark:bg-ink-950 grid place-items-center overflow-hidden">
          {/* Studs */}
          <div className="absolute inset-2 rounded-full pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2;
              const r = (safeSize / 2) - 14;
              const x = safeSize / 2 + r * Math.cos(a) - 3;
              const y = safeSize / 2 + r * Math.sin(a) - 3;
              return (
                <span
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gold-300/80 shadow-[0_0_8px_rgba(255,212,40,0.6)]"
                  style={{ left: x, top: y }}
                />
              );
            })}
          </div>

          {/* Wheel SVG */}
          <motion.div
            ref={wheelRef}
            className="relative"
            style={{ width: safeSize - 24, height: safeSize - 24 }}
            animate={{ rotate: rotation }}
            transition={{
              duration: spinning ? baseDuration / 1000 : 0,
              ease: [0.17, 0.67, 0.21, 0.99],
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              <defs>
                {segments.map((s, i) => (
                  <linearGradient
                    key={s.option.id}
                    id={`grad-${s.option.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={lighten(s.option.color, 12)} />
                    <stop offset="100%" stopColor={darken(s.option.color, 8)} />
                  </linearGradient>
                ))}
              </defs>

              {segments.map((s) => {
                const dim = s.option.eliminated;
                const highlighted = highlightedId && s.option.id === highlightedId;
                return (
                  <g key={s.option.id} opacity={dim ? 0.22 : 1}>
                    <path
                      d={computePath(s.start, s.end, radius)}
                      fill={`url(#grad-${s.option.id})`}
                      stroke={highlighted ? "#FFD428" : "rgba(0,0,0,0.18)"}
                      strokeWidth={highlighted ? 0.6 : 0.25}
                    />
                  </g>
                );
              })}

              {/* Labels */}
              {segments.map((s) => {
                const mid = (s.start + s.end) / 2;
                const rad = ((mid - 90) * Math.PI) / 180;
                const x = 50 + labelRadius * Math.cos(rad);
                const y = 50 + labelRadius * Math.sin(rad);
                const fillColor = getContrastText(s.option.color);
                const label =
                  s.option.label.length > 14
                    ? s.option.label.slice(0, 13) + "…"
                    : s.option.label;
                const dim = s.option.eliminated;
                const fontSize =
                  segments.length > 14
                    ? 3.1
                    : segments.length > 8
                    ? 3.8
                    : segments.length > 4
                    ? 4.4
                    : 5.2;
                return (
                  <g
                    key={`l-${s.option.id}`}
                    transform={`translate(${x} ${y}) rotate(${mid})`}
                    style={{ pointerEvents: "none" }}
                    opacity={dim ? 0.4 : 1}
                  >
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fill: fillColor,
                        fontSize,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        paintOrder: "stroke",
                      }}
                    >
                      {s.option.emoji ? `${s.option.emoji} ` : ""}
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* divider lines */}
              {segments.map((s) => {
                const rad = ((s.start - 90) * Math.PI) / 180;
                const x = 50 + radius * Math.cos(rad);
                const y = 50 + radius * Math.sin(rad);
                return (
                  <line
                    key={`d-${s.option.id}`}
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="0.2"
                  />
                );
              })}
            </svg>
          </motion.div>

          {/* Center hub */}
          <div className="absolute w-[18%] h-[18%] rounded-full bg-gradient-to-br from-ink-700 to-ink-900 grid place-items-center shadow-inner border-2 border-gold-400/40">
            <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-[0_0_24px_rgba(255,212,40,0.5)] grid place-items-center">
              <span className="text-navy-900 text-[10px] font-black tracking-widest">
                DWP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pointer (top) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-1 z-10"
        style={{ animation: spinning ? "none" : "pointerBob 2.6s ease-in-out infinite" }}
      >
        <svg width="36" height="46" viewBox="0 0 36 46">
          <defs>
            <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFE885" />
              <stop offset="1" stopColor="#F5A623" />
            </linearGradient>
          </defs>
          <path
            d="M18 44 L4 14 Q4 2 18 2 Q32 2 32 14 Z"
            fill="url(#pointerGrad)"
            stroke="#0A0E1A"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="14" r="4" fill="#0A0E1A" />
          <circle cx="18" cy="14" r="2" fill="#FFD428" />
        </svg>
      </div>
    </div>
  );
});

function lighten(hex: string, amount: number) {
  return shade(hex, amount);
}
function darken(hex: string, amount: number) {
  return shade(hex, -amount);
}
function shade(hex: string, amount: number) {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
