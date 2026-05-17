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

// Internal wheel coordinate system — all positions in this 200×200 space.
const VB = 200;
const CENTER = 100;
const BEZEL_OUTER = 99;
const BEZEL_INNER = 90;
const WHEEL_RADIUS = 88;
const LABEL_RADIUS = 58;
const HUB_RADIUS = 16;
const STUD_RADIUS = 1.4;
const STUD_ORBIT = 94.5;
const STUD_COUNT = 28;

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
  const lastSegmentRef = useRef<number>(-1);
  const tickTimerRef = useRef<number | null>(null);

  // Pre-compute segment ranges (start, end) in degrees, starting at 0 = top.
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

  const computePath = useCallback((start: number, end: number, r: number) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const x1 = CENTER + r * Math.cos(toRad(start));
    const y1 = CENTER + r * Math.sin(toRad(start));
    const x2 = CENTER + r * Math.cos(toRad(end));
    const y2 = CENTER + r * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return `M${CENTER},${CENTER} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
  }, []);

  const pickWinner = useCallback(() => {
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

    const segMid = (target.start + target.end) / 2;
    const wedge = target.end - target.start;
    const jitter = (Math.random() - 0.5) * wedge * 0.7;
    const landAt = segMid + jitter;

    const fullTurns = 6 + Math.floor(Math.random() * 3);
    const finalAngle = fullTurns * 360 + (360 - landAt);

    const start = rotation;
    const end = start + finalAngle;
    const duration = Math.round(baseDuration * intensityMultiplier);
    const startedAt = performance.now();

    setRotation(end);

    if (tickTimerRef.current) {
      cancelAnimationFrame(tickTimerRef.current);
    }
    lastSegmentRef.current = -1;

    const tickLoop = () => {
      const now = performance.now();
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (end - start) * eased;
      const normalized = ((360 - (current % 360)) + 360) % 360;
      const idx = segments.findIndex(
        (s) => normalized >= s.start && normalized < s.end,
      );
      if (idx !== lastSegmentRef.current && idx !== -1) {
        lastSegmentRef.current = idx;
        Sounds.tick(settings.soundEnabled);
        haptic(settings.hapticsEnabled, 5);
      }
      if (t < 1) {
        tickTimerRef.current = requestAnimationFrame(tickLoop) as unknown as number;
      } else {
        tickTimerRef.current = null;
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

  // Font sizing — scaled by segment count, refined by label length.
  const fitFontSize = (label: string) => {
    const base =
      segments.length <= 3
        ? 7.5
        : segments.length <= 5
        ? 6.4
        : segments.length <= 7
        ? 5.6
        : segments.length <= 10
        ? 4.8
        : segments.length <= 14
        ? 4.2
        : segments.length <= 18
        ? 3.6
        : segments.length <= 24
        ? 3.0
        : 2.5;
    // Approximate length-fit: width of text grows ~0.55 * fontSize per char.
    // Available chord at LABEL_RADIUS for one segment:
    const segDeg = 360 / Math.max(1, segments.length);
    const chord = 2 * LABEL_RADIUS * Math.sin((segDeg / 2) * (Math.PI / 180));
    const maxByChord = (chord - 6) / Math.max(1, label.length * 0.52);
    return Math.max(2.2, Math.min(base, maxByChord));
  };

  const truncate = (s: string) => {
    const maxLen =
      segments.length <= 4
        ? 18
        : segments.length <= 8
        ? 14
        : segments.length <= 12
        ? 11
        : segments.length <= 18
        ? 9
        : 7;
    if (s.length <= maxLen) return s;
    return s.slice(0, maxLen - 1).trimEnd() + "…";
  };

  return (
    <div
      className="relative inline-block touch-none select-none"
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-8 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,212,40,0.35), transparent 70%)",
          opacity: spinning ? 1 : 0.45,
          transition: "opacity 400ms ease",
        }}
        aria-hidden
      />

      {/* Wheel SVG */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Gold bezel ring gradient */}
          <linearGradient id="bezelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE885" />
            <stop offset="45%" stopColor="#FFD428" />
            <stop offset="100%" stopColor="#B7860A" />
          </linearGradient>
          <radialGradient id="bezelInner" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>

          {/* Per-segment gradients */}
          {segments.map((s) => (
            <linearGradient
              key={s.option.id}
              id={`grad-${s.option.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={lighten(s.option.color, 18)} />
              <stop offset="55%" stopColor={s.option.color} />
              <stop offset="100%" stopColor={darken(s.option.color, 12)} />
            </linearGradient>
          ))}

          {/* Inner shine over wheel */}
          <radialGradient id="wheelShine" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Center hub */}
          <radialGradient id="hubGold" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF1A8" />
            <stop offset="55%" stopColor="#FFD428" />
            <stop offset="100%" stopColor="#A87C04" />
          </radialGradient>
        </defs>

        {/* Bezel outer ring */}
        <circle cx={CENTER} cy={CENTER} r={BEZEL_OUTER} fill="url(#bezelGrad)" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={BEZEL_OUTER}
          fill="url(#bezelInner)"
          opacity="0.9"
        />
        {/* Inner dark backdrop */}
        <circle cx={CENTER} cy={CENTER} r={BEZEL_INNER} fill="#05080F" />

        {/* Rotating wheel group */}
        <motion.g
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          animate={{ rotate: rotation }}
          transition={{
            duration: spinning ? baseDuration / 1000 : 0,
            ease: [0.17, 0.67, 0.21, 0.99],
          }}
        >
          {/* Segments */}
          {segments.map((s) => {
            const dim = s.option.eliminated;
            const highlighted = highlightedId && s.option.id === highlightedId;
            return (
              <path
                key={`seg-${s.option.id}`}
                d={computePath(s.start, s.end, WHEEL_RADIUS)}
                fill={`url(#grad-${s.option.id})`}
                opacity={dim ? 0.22 : 1}
                stroke={highlighted ? "#FFD428" : "rgba(255,255,255,0.32)"}
                strokeWidth={highlighted ? 1.2 : 0.5}
                strokeLinejoin="round"
              />
            );
          })}

          {/* Inner shine */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={WHEEL_RADIUS}
            fill="url(#wheelShine)"
            pointerEvents="none"
          />

          {/* Labels */}
          {segments.map((s) => {
            const mid = (s.start + s.end) / 2;
            const rad = ((mid - 90) * Math.PI) / 180;
            const x = CENTER + LABEL_RADIUS * Math.cos(rad);
            const y = CENTER + LABEL_RADIUS * Math.sin(rad);
            const textColor = getContrastText(s.option.color);
            const label = truncate(s.option.label);
            // Flip text in the lower half so it stays right-side up.
            const isBottom = mid > 90 && mid < 270;
            const rotation = isBottom ? mid + 180 : mid;
            const fontSize = fitFontSize(label);
            const dim = s.option.eliminated;
            const strokeColor =
              textColor === "#FFFFFF"
                ? "rgba(0,0,0,0.45)"
                : "rgba(255,255,255,0.6)";
            return (
              <g
                key={`l-${s.option.id}`}
                transform={`translate(${x} ${y}) rotate(${rotation})`}
                opacity={dim ? 0.4 : 1}
                pointerEvents="none"
              >
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fill: textColor,
                    fontSize,
                    fontWeight: 800,
                    letterSpacing: "0.01em",
                    paintOrder: "stroke",
                    stroke: strokeColor,
                    strokeWidth: Math.max(0.35, fontSize * 0.09),
                    strokeLinejoin: "round",
                    fontFamily:
                      "var(--font-display), ui-sans-serif, system-ui",
                  }}
                >
                  {s.option.emoji ? `${s.option.emoji} ` : ""}
                  {label}
                </text>
              </g>
            );
          })}
        </motion.g>

        {/* Stationary studs along the bezel inner edge */}
        <g>
          {Array.from({ length: STUD_COUNT }).map((_, i) => {
            const a = ((i / STUD_COUNT) * 360 - 90) * (Math.PI / 180);
            const x = CENTER + STUD_ORBIT * Math.cos(a);
            const y = CENTER + STUD_ORBIT * Math.sin(a);
            return (
              <circle
                key={`stud-${i}`}
                cx={x}
                cy={y}
                r={STUD_RADIUS}
                fill="#FFF6CC"
                style={{
                  filter:
                    "drop-shadow(0 0 1.5px rgba(255,212,40,0.9))",
                }}
              />
            );
          })}
        </g>

        {/* Center hub */}
        <g>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={HUB_RADIUS}
            fill="#0A0E1A"
            stroke="rgba(255,212,40,0.55)"
            strokeWidth="1.2"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={HUB_RADIUS - 5}
            fill="url(#hubGold)"
          />
          {/* Gold center jewel */}
          <circle
            cx={CENTER - 2}
            cy={CENTER - 3}
            r="2.4"
            fill="rgba(255,255,255,0.6)"
          />
        </g>
      </svg>

      {/* Pointer (top, overlays bezel) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{
          top: `-${Math.round(size * 0.025)}px`,
          animation: spinning
            ? "none"
            : "pointerBob 2.6s ease-in-out infinite",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
        }}
        aria-hidden
      >
        <svg
          width={Math.round(size * 0.12)}
          height={Math.round(size * 0.15)}
          viewBox="0 0 36 46"
        >
          <defs>
            <linearGradient id="pointerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFF1A8" />
              <stop offset="0.6" stopColor="#FFD428" />
              <stop offset="1" stopColor="#C68A0A" />
            </linearGradient>
          </defs>
          <path
            d="M18 44 L4 16 Q4 2 18 2 Q32 2 32 16 Z"
            fill="url(#pointerGrad)"
            stroke="#0A0E1A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="14" r="4.2" fill="#0A0E1A" />
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
