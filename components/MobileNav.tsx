"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/saved", label: "Saved", icon: BookmarkIcon },
  { href: "/stats", label: "Stats", icon: ChartIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-3"
      aria-label="Primary"
    >
      <div className="glass-strong mx-auto max-w-md rounded-2xl px-2 py-1.5 flex items-center justify-between shadow-card-dark">
        {items.map((i) => {
          const active = pathname === i.href;
          const Icon = i.icon;
          return (
            <Link
              key={i.href}
              href={i.href}
              className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl"
            >
              {active && (
                <motion.span
                  layoutId="mnavpill"
                  className="absolute inset-1 rounded-xl bg-ink-900/5 dark:bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className={cn(
                  "relative w-5 h-5 transition-colors",
                  active
                    ? "text-gold-400"
                    : "text-ink-400 dark:text-ink-300",
                )}
              />
              <span
                className={cn(
                  "relative text-[10px] font-medium tracking-wide transition-colors",
                  active ? "text-ink-900 dark:text-white" : "text-ink-500",
                )}
              >
                {i.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
    </svg>
  );
}
function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path d="M6 3h12v18l-6-4-6 4z" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6" strokeLinecap="round" />
    </svg>
  );
}
function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}
