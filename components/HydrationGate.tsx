"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export function HydrationGate({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const hydrated = useStore((s) => s.hydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hydrated) {
    return (
      <>{fallback ?? <div className="h-[60vh] grid place-items-center text-ink-400">Loading…</div>}</>
    );
  }
  return <>{children}</>;
}
