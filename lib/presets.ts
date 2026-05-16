import type { ModeMeta, WheelOption } from "./types";
import { shuffledPalette } from "./colors";
import { nanoid } from "nanoid";

export const MODES: ModeMeta[] = [
  {
    id: "classic",
    title: "Classic",
    tagline: "Pure decisions, no nonsense",
    description: "The original spin to decide. Add anything, hit go.",
    icon: "🎯",
    gradient: "from-gold-400 via-amber-400 to-orange-400",
    href: "/classic",
  },
  {
    id: "elimination",
    title: "Elimination",
    tagline: "Last one standing wins",
    description: "Each spin removes one option until a single survivor remains.",
    icon: "🔥",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    href: "/elimination",
  },
  {
    id: "tournament",
    title: "Tournament",
    tagline: "Bracket-style showdown",
    description: "Head-to-head match-ups crown your ultimate winner.",
    icon: "🏆",
    gradient: "from-amber-300 via-yellow-400 to-orange-500",
    href: "/tournament",
    badge: "Live bracket",
  },
  {
    id: "party",
    title: "Party",
    tagline: "Truth, dare, chaos",
    description: "Built-in packs for game night, drinks and bold moves.",
    icon: "🎉",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    href: "/party",
    badge: "Hot",
  },
  {
    id: "date-night",
    title: "Date Night",
    tagline: "Food, films, adventures",
    description: "Curated decks for couples who can never agree on anything.",
    icon: "💖",
    gradient: "from-rose-400 via-red-400 to-pink-500",
    href: "/date-night",
  },
  {
    id: "weighted",
    title: "Weighted",
    tagline: "Bend the odds",
    description: "Manually weight each slice to nudge probabilities your way.",
    icon: "⚖️",
    gradient: "from-cyan-400 via-sky-500 to-indigo-500",
    href: "/weighted",
    badge: "Pro",
  },
];

export function makeOptions(labels: string[], emojis?: string[]): WheelOption[] {
  const palette = shuffledPalette(labels.length);
  return labels.map((label, i) => ({
    id: nanoid(8),
    label,
    color: palette[i],
    weight: 1,
    emoji: emojis?.[i],
  }));
}

export const CLASSIC_DEFAULTS = makeOptions([
  "Yes",
  "No",
  "Maybe",
  "Ask again",
  "Definitely",
  "Not today",
]);

export const PARTY_PACKS: Record<string, { label: string; options: string[] }> = {
  truth: {
    label: "Truth or Dare",
    options: [
      "Tell a secret",
      "Show last text",
      "Confess a crush",
      "Worst date story",
      "Sing for 10 sec",
      "Imitate a friend",
      "Hot take on the room",
      "Embarrassing photo",
    ],
  },
  drinking: {
    label: "Drinking Forfeits",
    options: [
      "Take a sip",
      "Down your drink",
      "Pick a victim",
      "Pass the shot",
      "Two-sip rule",
      "Waterfall!",
      "Cheers everyone",
      "Skip a turn",
    ],
  },
  punishments: {
    label: "Random Punishments",
    options: [
      "10 push-ups",
      "Speak in accent",
      "No phone 15 min",
      "Sit on the floor",
      "Compliment everyone",
      "Worst dance move",
      "Tongue twister",
      "Eat a lemon",
    ],
  },
  chaos: {
    label: "Chaos Mode",
    options: [
      "Swap seats",
      "Switch shoes",
      "Backwards talk",
      "Whisper only",
      "No vowels",
      "Group selfie",
      "Plot twist",
      "Mystery round",
    ],
  },
};

export const DATE_NIGHT_PACKS: Record<
  string,
  { label: string; emoji: string; options: string[] }
> = {
  food: {
    label: "Food",
    emoji: "🍝",
    options: [
      "Sushi",
      "Italian",
      "Tacos",
      "Burgers",
      "Thai",
      "Ramen",
      "Pizza",
      "Korean BBQ",
      "Mediterranean",
      "Brunch",
    ],
  },
  activities: {
    label: "Activities",
    emoji: "🎳",
    options: [
      "Mini golf",
      "Bowling",
      "Arcade",
      "Cooking class",
      "Hike",
      "Live music",
      "Board games",
      "Pottery",
      "Museum",
      "Stargazing",
    ],
  },
  movies: {
    label: "Movies",
    emoji: "🎬",
    options: [
      "Rom-com",
      "Thriller",
      "Indie drama",
      "Action blockbuster",
      "Animation",
      "Horror",
      "Cult classic",
      "Documentary",
      "A24 vibes",
      "Studio Ghibli",
    ],
  },
  trips: {
    label: "Trips",
    emoji: "✈️",
    options: [
      "Beach weekend",
      "Mountain cabin",
      "City break",
      "Road trip",
      "Wine country",
      "National park",
      "Spa retreat",
      "Foreign capital",
      "Island getaway",
      "Train journey",
    ],
  },
  adventures: {
    label: "Random Adventures",
    emoji: "🎢",
    options: [
      "Surprise day trip",
      "Try new cuisine",
      "Karaoke night",
      "Open mic",
      "Vintage shopping",
      "Sunrise picnic",
      "Stay-up-all-night",
      "Photo walk",
      "Bookstore date",
      "Themed dinner",
    ],
  },
};

export const DAILY_CHALLENGES = [
  { emoji: "☕", label: "Treat someone to coffee" },
  { emoji: "📞", label: "Call an old friend" },
  { emoji: "🚶", label: "20-minute walk outside" },
  { emoji: "📚", label: "Read 10 pages" },
  { emoji: "🧘", label: "5 minutes of stillness" },
  { emoji: "💌", label: "Send a kind message" },
  { emoji: "🎵", label: "Discover a new song" },
  { emoji: "🧹", label: "Tidy one drawer" },
  { emoji: "🥗", label: "Cook something new" },
  { emoji: "🌅", label: "Watch the sunset" },
  { emoji: "✏️", label: "Sketch for 5 minutes" },
  { emoji: "🎯", label: "Do the thing you've been avoiding" },
];

export function dailyChallenge(date = new Date()): (typeof DAILY_CHALLENGES)[number] {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
}

export const AI_SUGGESTIONS: { title: string; emoji: string; options: string[] }[] = [
  {
    title: "What's for lunch?",
    emoji: "🥪",
    options: ["Salad", "Sandwich", "Sushi", "Soup", "Bowl", "Tacos", "Pasta"],
  },
  {
    title: "Workout style",
    emoji: "💪",
    options: ["Run", "Yoga", "HIIT", "Stretch", "Bike", "Lift", "Rest day"],
  },
  {
    title: "Friday night",
    emoji: "🌙",
    options: [
      "Movie in",
      "Bar with friends",
      "Cook elaborate meal",
      "Walk + ice cream",
      "Game night",
      "Live music",
    ],
  },
  {
    title: "Coffee or tea?",
    emoji: "☕",
    options: ["Espresso", "Latte", "Cold brew", "Matcha", "Green tea", "Chai", "Water"],
  },
  {
    title: "Weekend project",
    emoji: "🛠️",
    options: [
      "Declutter",
      "Plant something",
      "Side project",
      "Try a recipe",
      "Photo walk",
      "DIY upgrade",
    ],
  },
];
