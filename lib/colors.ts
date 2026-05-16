export const SEGMENT_PALETTE = [
  "#FFD428",
  "#FF6B9D",
  "#4ECDC4",
  "#A78BFA",
  "#F38181",
  "#5EEAD4",
  "#FBBF24",
  "#60A5FA",
  "#F472B6",
  "#34D399",
  "#FB7185",
  "#818CF8",
  "#FACC15",
  "#22D3EE",
  "#C084FC",
  "#FB923C",
];

export function pickColor(index: number, used: string[] = []): string {
  const candidate = SEGMENT_PALETTE[index % SEGMENT_PALETTE.length];
  if (!used.includes(candidate)) return candidate;
  // try a few alternatives to keep adjacent segments distinct
  for (let i = 1; i < SEGMENT_PALETTE.length; i += 1) {
    const next = SEGMENT_PALETTE[(index + i) % SEGMENT_PALETTE.length];
    if (!used.includes(next)) return next;
  }
  return candidate;
}

export function shuffledPalette(count: number, seed?: number): string[] {
  const arr = [...SEGMENT_PALETTE];
  let s = seed ?? Math.floor(Math.random() * 1e9);
  // simple deterministic shuffle
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result: string[] = [];
  for (let i = 0; i < count; i += 1) {
    result.push(arr[i % arr.length]);
  }
  return result;
}

export function getContrastText(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.6 ? "#0A0E1A" : "#FFFFFF";
}
