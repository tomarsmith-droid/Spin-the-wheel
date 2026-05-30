"use client";

import { HOUSES, type Wizard } from "@/lib/wizards";

/**
 * Portrait area for a card.
 *
 * 🔁 If a card has an `image` set, that picture is shown (cover-fit inside the
 *    gold frame). Otherwise we draw an original, generated "magical crest"
 *    placeholder built from the character's house colours + monogram so the
 *    deck looks finished out of the box — and contains zero copyrighted art.
 */
export function CardArtwork({ wizard }: { wizard: Wizard }) {
  const house = HOUSES[wizard.house];
  const initials = wizard.name
    .replace(/^(Professor|Headmaster|Madame|Sir|Lord|Big)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (wizard.image) {
    // Replace-able real artwork.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={wizard.image}
        alt={wizard.name}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 120% at 50% 10%, ${house.via}, ${house.from} 70%)`,
      }}
    >
      {/* soft glow orb */}
      <div
        className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: house.accent, opacity: 0.55 }}
      />

      {/* faint concentric runes */}
      <svg
        viewBox="0 0 200 240"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="white" strokeWidth="0.6">
          <circle cx="100" cy="120" r="78" />
          <circle cx="100" cy="120" r="60" strokeDasharray="3 5" />
          <circle cx="100" cy="120" r="44" />
        </g>
      </svg>

      {/* giant ghosted house emblem */}
      <div className="absolute inset-0 grid place-items-center">
        <span className="select-none text-[120px] leading-none opacity-20 drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
          {house.emblem}
        </span>
      </div>

      {/* monogram medallion */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="grid h-24 w-24 place-items-center rounded-full border-2 backdrop-blur-sm"
          style={{
            borderColor: "rgba(255,255,255,0.55)",
            background: "rgba(0,0,0,0.22)",
            boxShadow: `0 0 30px ${house.accent}`,
          }}
        >
          <span className="font-display text-4xl font-extrabold text-white drop-shadow">
            {initials}
          </span>
        </div>
      </div>

      {/* tiny twinkles */}
      <span className="absolute left-[18%] top-[24%] text-lg opacity-80">✦</span>
      <span className="absolute right-[20%] top-[34%] text-sm opacity-70">✧</span>
      <span className="absolute right-[26%] bottom-[22%] text-base opacity-75">✦</span>
      <span className="absolute left-[24%] bottom-[28%] text-xs opacity-70">✧</span>

      {/* vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
    </div>
  );
}
