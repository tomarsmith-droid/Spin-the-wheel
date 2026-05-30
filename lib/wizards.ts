// ============================================================================
//  WIZARD TOP TRUMPS — CARD DATA
// ----------------------------------------------------------------------------
//  Everything you need to customise the game lives in THIS file.
//
//  • Edit names, epithets, stats, rules and rarities below.
//  • To use your own art, drop an image into /public/cards (e.g. pip.png)
//    and set `image: "/cards/pip.png"` on the card. If `image` is left
//    undefined, a hand-made magical placeholder crest is drawn instead.
//  • All characters are ORIGINAL parody/fantasy archetypes — no copyrighted
//    names, art or likenesses are used anywhere.
// ============================================================================

export type Rarity = "Common" | "Rare" | "Legendary";

export type StatKey = "magic" | "bravery" | "mischief" | "wisdom" | "luck";

export interface Wizard {
  id: string;
  /** Character name (parody / original fantasy). */
  name: string;
  /** A short flavour title shown under the name. */
  epithet: string;
  /** House id — see HOUSES below. */
  house: HouseId;
  rarity: Rarity;
  /** Stats out of 100. */
  stats: Record<StatKey, number>;
  /** 🍻 Drinking-game rule (shown by default). */
  drinkRule: string;
  /** 🎈 Safe-mode silly party prompt (shown when Safe Mode is on). */
  safeRule: string;
  /**
   * 🔁 REPLACE ME: path to your own portrait, e.g. "/cards/pip.png".
   * Leave undefined to use the generated magical placeholder.
   */
  image?: string;
}

export type HouseId = "emberhall" | "duskthorn" | "frostmere" | "larkhollow";

export interface House {
  id: HouseId;
  name: string;
  emblem: string; // emoji badge
  tagline: string;
  /** Tailwind-style gradient stops for the card art + badge. */
  from: string;
  via: string;
  to: string;
  /** Accent colour (hex) used for glows + bars. */
  accent: string;
}

// ----------------------------------------------------------------------------
//  HOUSES / FACTIONS — four original wizard-school houses.
// ----------------------------------------------------------------------------
export const HOUSES: Record<HouseId, House> = {
  emberhall: {
    id: "emberhall",
    name: "Emberhall",
    emblem: "🔥",
    tagline: "Courage forged in flame",
    from: "#7c1d12",
    via: "#b91c1c",
    to: "#f59e0b",
    accent: "#fb923c",
  },
  duskthorn: {
    id: "duskthorn",
    name: "Duskthorn",
    emblem: "🐍",
    tagline: "Ambition wrapped in shadow",
    from: "#053d2e",
    via: "#0f766e",
    to: "#10b981",
    accent: "#34d399",
  },
  frostmere: {
    id: "frostmere",
    name: "Frostmere",
    emblem: "🦉",
    tagline: "Wisdom carved in frost",
    from: "#0b1f4d",
    via: "#1d4ed8",
    to: "#38bdf8",
    accent: "#60a5fa",
  },
  larkhollow: {
    id: "larkhollow",
    name: "Larkhollow",
    emblem: "🍀",
    tagline: "Fortune favours the kind",
    from: "#5b4209",
    via: "#a16207",
    to: "#facc15",
    accent: "#fde047",
  },
};

export const RARITY_STYLE: Record<
  Rarity,
  { label: string; ring: string; text: string; glow: string }
> = {
  Common: {
    label: "Common",
    ring: "ring-slate-300/40",
    text: "text-slate-200",
    glow: "rgba(148,163,184,0.35)",
  },
  Rare: {
    label: "Rare",
    ring: "ring-sky-300/60",
    text: "text-sky-200",
    glow: "rgba(56,189,248,0.5)",
  },
  Legendary: {
    label: "Legendary",
    ring: "ring-amber-300/70",
    text: "text-amber-200",
    glow: "rgba(251,191,36,0.65)",
  },
};

export const STAT_META: Record<StatKey, { label: string; icon: string }> = {
  magic: { label: "Magic", icon: "✨" },
  bravery: { label: "Bravery", icon: "🦁" },
  mischief: { label: "Mischief", icon: "😈" },
  wisdom: { label: "Wisdom", icon: "📖" },
  luck: { label: "Luck", icon: "🎲" },
};

// ----------------------------------------------------------------------------
//  THE DECK — 22 starter cards. Tweak freely!
// ----------------------------------------------------------------------------
export const WIZARDS: Wizard[] = [
  {
    id: "mossbeard",
    name: "Headmaster Mossbeard",
    epithet: "The Twinkle-Eyed",
    house: "frostmere",
    rarity: "Legendary",
    stats: { magic: 98, bravery: 80, mischief: 60, wisdom: 99, luck: 72 },
    drinkRule:
      "Everyone takes 2 sips while you give a wise but completely useless speech.",
    safeRule: "Give a 10-second wise speech. No speech? You do 10 star jumps.",
  },
  {
    id: "pip-underhill",
    name: "Pip Underhill",
    epithet: "The Reluctant Chosen One",
    house: "emberhall",
    rarity: "Legendary",
    stats: { magic: 85, bravery: 95, mischief: 55, wisdom: 70, luck: 99 },
    drinkRule: "Take 2 sips if you've ever tripped over absolutely nothing.",
    safeRule: "Strike a heroic pose. Last to pose does a victory lap of the room.",
  },
  {
    id: "tilly-quillsworth",
    name: "Tilly Quillsworth",
    epithet: "Top of Every Class",
    house: "frostmere",
    rarity: "Rare",
    stats: { magic: 90, bravery: 78, mischief: 40, wisdom: 96, luck: 65 },
    drinkRule:
      "The cleverest-sounding person hasn't spoken yet — they drink. Or you do.",
    safeRule: "Name 3 facts in 10 seconds. Fail and you wear a 'know-it-all' crown.",
  },
  {
    id: "rufus-ashford",
    name: "Rufus Ashford",
    epithet: "Loyal to a Fault",
    house: "emberhall",
    rarity: "Common",
    stats: { magic: 60, bravery: 82, mischief: 70, wisdom: 58, luck: 50 },
    drinkRule: "Pick your best friend here. You both take a sip together.",
    safeRule: "Give the person on your left a heartfelt 5-second compliment.",
  },
  {
    id: "vexley-nightshade",
    name: "Professor Vexley Nightshade",
    epithet: "Master of Dramatic Sighs",
    house: "duskthorn",
    rarity: "Rare",
    stats: { magic: 92, bravery: 65, mischief: 75, wisdom: 88, luck: 45 },
    drinkRule: "Sneer at someone. They drink. If you can't sneer, YOU drink.",
    safeRule: "Deliver one savage-but-loving roast of the player to your right.",
  },
  {
    id: "mungo-bramblefoot",
    name: "Big Mungo Bramblefoot",
    epithet: "Keeper of Friendly Beasts",
    house: "larkhollow",
    rarity: "Rare",
    stats: { magic: 55, bravery: 90, mischief: 60, wisdom: 62, luck: 80 },
    drinkRule: "Anyone with a pet takes 2 sips. No pet? You're safe… this round.",
    safeRule: "Do your best animal impression. Group guesses — losers clap.",
  },
  {
    id: "wren-moonsilver",
    name: "Wren Moonsilver",
    epithet: "Beautifully Befuddled",
    house: "frostmere",
    rarity: "Rare",
    stats: { magic: 88, bravery: 70, mischief: 50, wisdom: 91, luck: 95 },
    drinkRule: "Say something dreamy and bizarre. If nobody laughs, take a sip.",
    safeRule: "Invent a creature that lives in the ceiling. Describe it lovingly.",
  },
  {
    id: "cassius-duskthorn",
    name: "Cassius Duskthorn",
    epithet: "Heir to Everything (Allegedly)",
    house: "duskthorn",
    rarity: "Rare",
    stats: { magic: 80, bravery: 60, mischief: 92, wisdom: 72, luck: 68 },
    drinkRule: "Brag about something tiny. Worst brag drinks. Probably you.",
    safeRule: "Boast about a useless talent. Group rates it 1–10 by applause.",
  },
  {
    id: "agnes-sternquill",
    name: "Professor Agnes Sternquill",
    epithet: "Rules Are Rules",
    house: "frostmere",
    rarity: "Common",
    stats: { magic: 84, bravery: 80, mischief: 30, wisdom: 90, luck: 55 },
    drinkRule: "Invent a house rule. It's law until the next card. Breakers drink.",
    safeRule: "Invent a silly rule for the next 2 minutes. Breakers do a forfeit.",
  },
  {
    id: "lord-voidheart",
    name: "Lord Mortis Voidheart",
    epithet: "He Who Must Not Be Invited",
    house: "duskthorn",
    rarity: "Legendary",
    stats: { magic: 99, bravery: 88, mischief: 80, wisdom: 85, luck: 30 },
    drinkRule: "Point at someone menacingly. They drink. Then everyone shudders.",
    safeRule: "Do your most dramatic villain laugh. Weakest laugh is banished to the kitchen.",
  },
  {
    id: "reginald-translucent",
    name: "Sir Reginald the Translucent",
    epithet: "Resident Friendly Ghost",
    house: "larkhollow",
    rarity: "Common",
    stats: { magic: 70, bravery: 65, mischief: 78, wisdom: 60, luck: 88 },
    drinkRule: "Go quiet and 'haunt' the table. Last to notice takes a sip.",
    safeRule: "Float around the room like a ghost for 10 seconds. Commit fully.",
  },
  {
    id: "grumble-mopps",
    name: "Grumble Mopps",
    epithet: "Caretaker & Chief Complainer",
    house: "duskthorn",
    rarity: "Common",
    stats: { magic: 35, bravery: 60, mischief: 65, wisdom: 70, luck: 40 },
    drinkRule: "Complain about something for 10 seconds. Stop early and you drink.",
    safeRule: "Grumble about something trivial in your grumpiest old-timer voice.",
  },
  {
    id: "skye-brightwing",
    name: "Skye Brightwing",
    epithet: "Broomstick League Champion",
    house: "emberhall",
    rarity: "Rare",
    stats: { magic: 72, bravery: 94, mischief: 66, wisdom: 64, luck: 85 },
    drinkRule: "Tallest player drinks. Then the shortest. Sport is unfair like that.",
    safeRule: "Mime an epic broomstick race in slow motion. Crowd commentates.",
  },
  {
    id: "esme-starclaw",
    name: "Madame Esme Starclaw",
    epithet: "Reader of Murky Futures",
    house: "frostmere",
    rarity: "Rare",
    stats: { magic: 86, bravery: 58, mischief: 55, wisdom: 93, luck: 90 },
    drinkRule: "Predict who drinks next. If you're right, they drink. If wrong, you do.",
    safeRule: "Make a dramatic prediction about someone's night. The group decides if it's prophecy.",
  },
  {
    id: "lyall-greymoon",
    name: "Professor Lyall Greymoon",
    epithet: "Gentle by Day",
    house: "emberhall",
    rarity: "Rare",
    stats: { magic: 83, bravery: 89, mischief: 60, wisdom: 82, luck: 48 },
    drinkRule: "Everyone howls at the moon. Quietest howl takes 2 sips.",
    safeRule: "Lead the group in a 5-second synchronised howl. No half-howls!",
  },
  {
    id: "tibbs",
    name: "Tibbs the Helpful",
    epithet: "Free and Proud",
    house: "larkhollow",
    rarity: "Common",
    stats: { magic: 68, bravery: 85, mischief: 50, wisdom: 66, luck: 92 },
    drinkRule: "Do a kind deed for someone at the table. They drink in gratitude.",
    safeRule: "Offer to do a tiny favour for someone right now. They must accept.",
  },
  {
    id: "grixle-coincarver",
    name: "Grixle Coincarver",
    epithet: "Vault-Keeper of Gold Hollow",
    house: "duskthorn",
    rarity: "Common",
    stats: { magic: 58, bravery: 55, mischief: 88, wisdom: 80, luck: 70 },
    drinkRule: "Whoever spent the most money today takes 2 sips. Honesty, please.",
    safeRule: "Confess the most pointless thing you've ever bought. Group judges.",
  },
  {
    id: "maeve-ashford",
    name: "Maeve Ashford",
    epithet: "Matriarch of the Burrowdown",
    house: "emberhall",
    rarity: "Rare",
    stats: { magic: 87, bravery: 96, mischief: 45, wisdom: 84, luck: 75 },
    drinkRule: "Mum mode: tell someone to drink some water. Then everyone sips.",
    safeRule: "Fuss over the player to your left like a proud parent for 10 seconds.",
  },
  {
    id: "fen-fynn-tricklewood",
    name: "Fen & Fynn Tricklewood",
    epithet: "The Two-Headed Prank",
    house: "larkhollow",
    rarity: "Rare",
    stats: { magic: 76, bravery: 80, mischief: 99, wisdom: 60, luck: 82 },
    drinkRule: "Start a chain: you sip, then the next person sips double, and so on until someone breaks.",
    safeRule: "Begin a clap-and-stomp pattern. Everyone copies. First to fumble loses.",
  },
  {
    id: "dharma-flameheart",
    name: "Dharma Flameheart",
    epithet: "Tamer of Tiny Dragons",
    house: "emberhall",
    rarity: "Legendary",
    stats: { magic: 91, bravery: 97, mischief: 70, wisdom: 75, luck: 60 },
    drinkRule: "Anyone who's eaten something spicy this week takes a fiery sip.",
    safeRule: "Breathe 'fire' (your scariest dragon roar). Group rates the flames.",
  },
  {
    id: "clementine-sparrowmoor",
    name: "Clementine Sparrowmoor",
    epithet: "Prodigy of the Potions Lab",
    house: "duskthorn",
    rarity: "Rare",
    stats: { magic: 95, bravery: 62, mischief: 82, wisdom: 89, luck: 54 },
    drinkRule: "Mix a 'potion': everyone adds one rule to the next round. Then sip.",
    safeRule: "Invent a magic potion from things on the table. Name it dramatically.",
  },
  {
    id: "bramwell-root",
    name: "Professor Bramwell Root",
    epithet: "Friend to Every Plant",
    house: "larkhollow",
    rarity: "Common",
    stats: { magic: 64, bravery: 70, mischief: 48, wisdom: 86, luck: 78 },
    drinkRule: "Anyone who keeps a houseplant alive takes a proud sip. Killers drink twice.",
    safeRule: "Talk encouragingly to an imaginary plant for 10 seconds. Help it grow.",
  },
];

/** Convenience: average power rating for a card (used for sorting/labels). */
export function powerRating(w: Wizard): number {
  const v = Object.values(w.stats);
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
}
