"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ModeMeta, GameMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ModeCard({ mode, index }: { mode: ModeMeta; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * index,
        type: "spring",
        stiffness: 280,
        damping: 28,
      }}
    >
      <Link
        href={mode.href}
        className="group relative block rounded-2xl overflow-hidden h-full"
      >
        {/* gradient background */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-95 transition-transform duration-500 group-hover:scale-[1.06]",
            mode.gradient,
          )}
        />
        {/* darken bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {/* light wash from top-left */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        {/* grain */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Mode-specific decorative artwork */}
        <ModeArtwork mode={mode.id} />

        <div className="relative p-5 md:p-6 h-full min-h-[180px] flex flex-col justify-between text-white">
          <div className="flex items-start justify-between">
            <ModeIcon mode={mode.id} />
            {mode.badge && (
              <span className="text-[10px] tracking-[0.18em] font-bold uppercase px-2 py-1 rounded-full bg-navy-900/80 text-gold-300 backdrop-blur">
                {mode.badge}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl md:text-2xl leading-tight drop-shadow-sm">
              {mode.title}
            </h3>
            <p className="text-xs md:text-sm font-semibold opacity-90 mt-0.5">
              {mode.tagline}
            </p>
          </div>
          <div className="flex items-center text-xs font-bold opacity-95 group-hover:translate-x-1 transition-transform">
            Open
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ModeIcon({ mode }: { mode: GameMode }) {
  return (
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/25 backdrop-blur-md grid place-items-center shadow-inner border border-white/30">
      <svg viewBox="0 0 40 40" className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none">
        {mode === "classic" && <ClassicGlyph />}
        {mode === "elimination" && <ElimGlyph />}
        {mode === "tournament" && <TrophyGlyph />}
        {mode === "party" && <PartyGlyph />}
        {mode === "date-night" && <HeartGlyph />}
        {mode === "weighted" && <ScalesGlyph />}
      </svg>
    </div>
  );
}

/* ============ Decorative background art per mode ============ */
function ModeArtwork({ mode }: { mode: GameMode }) {
  switch (mode) {
    case "classic":
      return (
        <svg
          className="absolute -right-6 -bottom-6 w-40 h-40 opacity-25"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="8" fill="white" />
        </svg>
      );
    case "elimination":
      return (
        <svg
          className="absolute -right-4 -bottom-4 w-44 h-44 opacity-20"
          viewBox="0 0 100 100"
          aria-hidden
        >
          {[10, 25, 45, 65, 85].map((x, i) => (
            <g
              key={i}
              transform={`translate(${x} ${70 + (i % 2) * 8}) rotate(${(i - 2) * 8})`}
            >
              <path
                d="M0 0 C 4 -10 -2 -16 0 -22 C 6 -16 10 -8 8 -2 C 12 -6 14 -2 12 4 C 8 8 4 6 0 0 Z"
                fill="white"
              />
            </g>
          ))}
        </svg>
      );
    case "tournament":
      return (
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-32 h-32 opacity-30"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <g stroke="white" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M10 20 L40 20 L40 35 L70 35" />
            <path d="M10 50 L40 50 L40 35" />
            <path d="M10 70 L40 70 L40 55 L70 55" />
            <path d="M70 35 L70 55 L88 45" />
          </g>
          <circle cx="88" cy="45" r="4" fill="white" />
        </svg>
      );
    case "party":
      return (
        <svg
          className="absolute inset-0 w-full h-full opacity-35"
          viewBox="0 0 100 100"
          aria-hidden
        >
          {[
            { x: 12, y: 22, r: 18 },
            { x: 80, y: 18, r: 12 },
            { x: 88, y: 70, r: 8 },
            { x: 20, y: 78, r: 14 },
            { x: 60, y: 26, r: 10 },
            { x: 50, y: 70, r: 6 },
            { x: 70, y: 50, r: 14 },
          ].map((p, i) => (
            <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${i * 35})`}>
              <path
                d={`M0 -${p.r} L${p.r * 0.3} -${p.r * 0.3} L${p.r} 0 L${p.r * 0.3} ${p.r * 0.3} L0 ${p.r} L-${p.r * 0.3} ${p.r * 0.3} L-${p.r} 0 L-${p.r * 0.3} -${p.r * 0.3} Z`}
                fill="white"
                opacity={0.55}
              />
            </g>
          ))}
        </svg>
      );
    case "date-night":
      return (
        <svg
          className="absolute -right-2 -bottom-4 w-44 h-44 opacity-25"
          viewBox="0 0 100 100"
          aria-hidden
        >
          {[
            { x: 30, y: 65, s: 1.6 },
            { x: 65, y: 50, s: 1.0 },
            { x: 80, y: 80, s: 0.7 },
            { x: 18, y: 30, s: 0.5 },
          ].map((h, i) => (
            <g key={i} transform={`translate(${h.x} ${h.y}) scale(${h.s})`}>
              <path
                d="M0 6 C -10 -4 -10 -16 -2 -16 C 2 -16 4 -12 0 -8 C 4 -12 6 -16 10 -16 C 18 -16 18 -4 8 6 L 0 14 Z"
                fill="white"
              />
            </g>
          ))}
        </svg>
      );
    case "weighted":
      return (
        <svg
          className="absolute right-4 bottom-4 w-32 h-32 opacity-25"
          viewBox="0 0 100 100"
          aria-hidden
        >
          {[
            { x: 10, h: 40 },
            { x: 28, h: 64 },
            { x: 46, h: 30 },
            { x: 64, h: 76 },
            { x: 82, h: 52 },
          ].map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={90 - b.h}
              width="10"
              height={b.h}
              rx="2"
              fill="white"
            />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

/* ================ Glyphs (in 40×40 viewBox) ================ */
function ClassicGlyph() {
  return (
    <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" r="8" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <path d="M20 4v6M20 30v6M4 20h6M30 20h6" />
    </g>
  );
}
function ElimGlyph() {
  return (
    <g fill="currentColor">
      <path
        d="M20 5 C 12 14 8 22 20 35 C 32 22 28 14 20 5 Z"
        opacity="0.85"
      />
      <path
        d="M20 14 C 16 19 14 24 20 31 C 26 24 24 19 20 14 Z"
        fill="rgba(255,255,255,0.6)"
      />
    </g>
  );
}
function TrophyGlyph() {
  return (
    <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7h16v6a8 8 0 0 1-16 0V7z" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 10h-3a3 3 0 0 0 3 3M28 10h3a3 3 0 0 1-3 3" />
      <path d="M16 22h8l1 6h-10z" fill="currentColor" fillOpacity="0.25" />
      <path d="M14 32h12" strokeWidth="3" />
    </g>
  );
}
function PartyGlyph() {
  return (
    <g fill="currentColor">
      <path
        d="M8 32 L18 14 L26 22 Z"
        fillOpacity="0.95"
      />
      <circle cx="28" cy="10" r="2.4" />
      <circle cx="33" cy="16" r="1.8" />
      <circle cx="14" cy="9" r="2" />
      <circle cx="22" cy="6" r="1.6" />
      <circle cx="32" cy="26" r="2" />
      <path d="M28 10 l-3 -2 M33 16 l3 -1 M14 9 l-3 -2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
}
function HeartGlyph() {
  return (
    <g fill="currentColor">
      <path d="M20 33 C 6 23 6 12 13 9 C 17 9 19 12 20 14 C 21 12 23 9 27 9 C 34 12 34 23 20 33 Z" />
    </g>
  );
}
function ScalesGlyph() {
  return (
    <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6v28M8 34h24" />
      <path d="M10 14h20" />
      <path d="M10 14 L5 25 a5 5 0 0 0 10 0 z" fill="currentColor" fillOpacity="0.3" />
      <path d="M30 14 L25 25 a5 5 0 0 0 10 0 z" fill="currentColor" fillOpacity="0.3" />
      <circle cx="20" cy="6" r="2" fill="currentColor" />
    </g>
  );
}
