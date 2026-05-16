"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/saved", label: "Saved" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "Settings" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="px-4 md:px-8 pt-3">
        <div className="glass mx-auto max-w-7xl rounded-2xl flex items-center justify-between px-3 md:px-5 h-14 md:h-16 shadow-card-dark">
          <Link href="/" className="flex items-center gap-2.5 pl-1.5 group">
            <Logo />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-base md:text-lg tracking-tight">
                Decision Wheel
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase tracking-[0.18em] font-semibold px-1.5 py-0.5 rounded-md bg-gold-400 text-navy-900">
                Pro
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                    active
                      ? "text-ink-900 dark:text-white"
                      : "text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navpill"
                      className="absolute inset-0 rounded-xl bg-ink-900/5 dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 grid place-items-center shadow-glow-soft">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-navy-900" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
    </div>
  );
}
