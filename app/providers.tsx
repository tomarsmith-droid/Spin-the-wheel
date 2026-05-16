"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.settings.theme);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#05080F" : "#FAFAFC");
  }, [theme]);

  // avoid flash by applying dark immediately when hydrated false
  useEffect(() => {
    if (!hydrated) {
      // default starts in dark per defaultSettings
      document.documentElement.classList.add("dark");
    }
  }, [hydrated]);

  return <>{children}</>;
}
