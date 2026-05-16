"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ModeMeta } from "@/lib/types";
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
            "absolute inset-0 bg-gradient-to-br opacity-90 transition-transform duration-500 group-hover:scale-[1.04]",
            mode.gradient,
          )}
        />
        {/* glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* grain */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        <div className="relative p-5 md:p-6 h-full min-h-[160px] flex flex-col justify-between text-navy-900">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/35 backdrop-blur grid place-items-center text-2xl md:text-3xl shadow-inner">
              {mode.icon}
            </div>
            {mode.badge && (
              <span className="text-[10px] tracking-[0.18em] font-bold uppercase px-2 py-1 rounded-full bg-navy-900/85 text-gold-300">
                {mode.badge}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl md:text-2xl leading-tight">
              {mode.title}
            </h3>
            <p className="text-xs md:text-sm font-semibold opacity-80 mt-0.5">
              {mode.tagline}
            </p>
          </div>
          <div className="flex items-center text-xs font-bold opacity-90 group-hover:translate-x-1 transition-transform">
            Open
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
