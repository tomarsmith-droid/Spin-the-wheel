"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function SavedPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const wheels = useStore((s) => s.savedWheels);
  const toggleFav = useStore((s) => s.toggleFavorite);
  const remove = useStore((s) => s.deleteWheel);
  const duplicate = useStore((s) => s.duplicateWheel);
  const rename = useStore((s) => s.renameWheel);
  const loadOptions = useStore((s) => s.loadOptions);
  const router = useRouter();

  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [renaming, setRenaming] = useState<{ id: string; value: string } | null>(null);

  const filtered = useMemo(() => {
    return filter === "favorites" ? wheels.filter((w) => w.favorite) : wheels;
  }, [wheels, filter]);

  const handleOpen = (id: string) => {
    const w = wheels.find((x) => x.id === id);
    if (!w) return;
    loadOptions(w.options, w.name);
    router.push("/classic");
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Saved wheels"
        tagline="Your custom decks, always one tap away."
        rightSlot={
          <Link href="/classic">
            <PrimaryButton size="md">
              <PlusIcon className="w-4 h-4" />
              Create wheel
            </PrimaryButton>
          </Link>
        }
      />

      <div className="mt-4 flex gap-2">
        {(["all", "favorites"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === f
                ? "bg-gold-400 text-navy-900"
                : "bg-white/60 dark:bg-white/10 text-ink-500 dark:text-ink-300"
            }`}
          >
            {f === "all" ? `All · ${wheels.length}` : `★ Favorites`}
          </button>
        ))}
      </div>

      {wheels.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <AnimatePresence>
            {filtered.map((w) => (
              <motion.div
                key={w.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass rounded-2xl p-4 shadow-card-dark flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {renaming?.id === w.id ? (
                      <input
                        autoFocus
                        value={renaming.value}
                        onChange={(e) =>
                          setRenaming({ id: w.id, value: e.target.value })
                        }
                        onBlur={() => {
                          if (renaming.value.trim()) {
                            rename(w.id, renaming.value.trim());
                          }
                          setRenaming(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (renaming.value.trim()) {
                              rename(w.id, renaming.value.trim());
                            }
                            setRenaming(null);
                          }
                          if (e.key === "Escape") setRenaming(null);
                        }}
                        className="bg-transparent border-b border-gold-400 focus:outline-none font-display font-bold text-base truncate w-full"
                      />
                    ) : (
                      <button
                        onDoubleClick={() => setRenaming({ id: w.id, value: w.name })}
                        className="font-display font-bold text-base truncate text-left"
                      >
                        {w.name}
                      </button>
                    )}
                    <p className="text-[11px] text-ink-400 dark:text-ink-300 capitalize">
                      {w.mode.replace("-", " ")} · {w.options.length} options · {formatDate(w.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFav(w.id)}
                    className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center transition-colors ${
                      w.favorite ? "text-gold-400" : "text-ink-400 hover:text-gold-400"
                    }`}
                    aria-label="Toggle favorite"
                  >
                    {w.favorite ? "★" : "☆"}
                  </button>
                </div>

                {/* Mini wheel preview */}
                <MiniWheel colors={w.options.map((o) => o.color)} />

                <div className="flex flex-wrap gap-1">
                  {w.options.slice(0, 4).map((o) => (
                    <span
                      key={o.id}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10 truncate max-w-[100px]"
                    >
                      {o.label}
                    </span>
                  ))}
                  {w.options.length > 4 && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/60 dark:bg-white/10">
                      +{w.options.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpen(w.id)}
                    className="flex-1 h-9 rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 font-bold text-xs shadow-glow-soft active:scale-95"
                  >
                    Open & spin
                  </button>
                  <button
                    onClick={() => duplicate(w.id)}
                    className="h-9 px-3 rounded-lg bg-white/60 dark:bg-white/10 text-xs font-semibold hover:bg-white/80 dark:hover:bg-white/20"
                    title="Duplicate"
                  >
                    <DupIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${w.name}"?`)) remove(w.id);
                    }}
                    className="h-9 px-3 rounded-lg bg-white/60 dark:bg-white/10 text-xs font-semibold hover:bg-rose-500/10 hover:text-rose-500"
                    title="Delete"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function MiniWheel({ colors }: { colors: string[] }) {
  const segs = colors.length === 0 ? ["#3a3f4d"] : colors;
  const total = segs.length;
  const seg = 360 / total;
  const r = 44;
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const arc = (start: number, end: number) => {
    const x1 = 50 + r * Math.cos(toRad(start));
    const y1 = 50 + r * Math.sin(toRad(start));
    const x2 = 50 + r * Math.cos(toRad(end));
    const y2 = 50 + r * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return `M50,50 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
  };
  return (
    <div className="relative w-full aspect-[16/6] rounded-xl overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-900 grid place-items-center">
      <svg viewBox="0 0 100 100" className="h-full max-h-[110%]">
        <circle cx="50" cy="50" r="46" fill="#FFD428" />
        <circle cx="50" cy="50" r="44.5" fill="#05080F" />
        {segs.map((c, i) => (
          <path key={i} d={arc(i * seg, (i + 1) * seg)} fill={c} />
        ))}
        <circle cx="50" cy="50" r="6" fill="#0A0E1A" />
        <circle cx="50" cy="50" r="3" fill="#FFD428" />
      </svg>
      {/* Mini pointer */}
      <svg
        viewBox="0 0 10 12"
        className="absolute left-1/2 -translate-x-1/2 top-0.5 w-3 h-3.5"
      >
        <path
          d="M5 11 L1 4 Q1 1 5 1 Q9 1 9 4 Z"
          fill="#FFD428"
          stroke="#0A0E1A"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 glass rounded-3xl p-10 text-center">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-navy-500 to-navy-800 grid place-items-center text-4xl text-gold-300 shadow-card-dark">
        🎁
      </div>
      <h2 className="font-display text-2xl font-bold mt-4">
        No saved wheels yet
      </h2>
      <p className="text-sm text-ink-400 dark:text-ink-300 mt-1">
        Build a wheel, hit save, and it'll live here.
      </p>
      <Link href="/classic" className="inline-block mt-5">
        <PrimaryButton size="md">Create your first wheel</PrimaryButton>
      </Link>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function DupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M4 16V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
    </svg>
  );
}
