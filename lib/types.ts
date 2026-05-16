export type WheelOption = {
  id: string;
  label: string;
  color: string;
  weight: number;
  eliminated?: boolean;
  emoji?: string;
};

export type Wheel = {
  id: string;
  name: string;
  options: WheelOption[];
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
  mode: GameMode;
  emoji?: string;
};

export type GameMode =
  | "classic"
  | "elimination"
  | "tournament"
  | "party"
  | "date-night"
  | "weighted";

export type SpinResult = {
  id: string;
  wheelId?: string;
  optionId: string;
  optionLabel: string;
  mode: GameMode;
  timestamp: number;
  duration: number;
};

export type Stats = {
  totalSpins: number;
  spinsByMode: Record<GameMode, number>;
  optionFrequency: Record<string, number>;
  lastSpinAt?: number;
  streak: number;
  totalSpinTime: number;
};

export type Settings = {
  theme: "dark" | "light";
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  particlesEnabled: boolean;
  animationIntensity: "low" | "medium" | "high";
  spinSpeed: "slow" | "normal" | "fast";
};

export type ModeMeta = {
  id: GameMode;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
  badge?: string;
};
