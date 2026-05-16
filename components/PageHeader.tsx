"use client";

import Link from "next/link";

export function PageHeader({
  title,
  tagline,
  rightSlot,
  back = true,
}: {
  title: string;
  tagline?: string;
  rightSlot?: React.ReactNode;
  back?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap">
      <div>
        {back && (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-400 dark:text-ink-300 hover:text-gold-500 mb-1.5"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        )}
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
          {title}
        </h1>
        {tagline && (
          <p className="text-sm md:text-base text-ink-400 dark:text-ink-300 mt-1">
            {tagline}
          </p>
        )}
      </div>
      {rightSlot}
    </div>
  );
}
