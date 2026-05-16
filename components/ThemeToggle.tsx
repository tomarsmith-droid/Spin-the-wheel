"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Sounds } from "@/lib/sounds";

export function ThemeToggle() {
  const theme = useStore((s) => s.settings.theme);
  const setSettings = useStore((s) => s.updateSettings);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);

  const toggle = () => {
    Sounds.tap(soundEnabled);
    setSettings({ theme: theme === "dark" ? "light" : "dark" });
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-10 h-10 rounded-xl grid place-items-center hover:bg-ink-900/5 dark:hover:bg-white/5 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.svg
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            viewBox="0 0 24 24"
            className="w-5 h-5 text-gold-400"
            fill="currentColor"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            viewBox="0 0 24 24"
            className="w-5 h-5 text-gold-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
