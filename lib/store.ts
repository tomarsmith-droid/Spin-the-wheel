"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  GameMode,
  Settings,
  SpinResult,
  Stats,
  Wheel,
  WheelOption,
} from "./types";
import { CLASSIC_DEFAULTS } from "./presets";
import { pickColor } from "./colors";
import { nanoid } from "nanoid";

const defaultStats: Stats = {
  totalSpins: 0,
  spinsByMode: {
    classic: 0,
    elimination: 0,
    tournament: 0,
    party: 0,
    "date-night": 0,
    weighted: 0,
  },
  optionFrequency: {},
  streak: 0,
  totalSpinTime: 0,
};

const defaultSettings: Settings = {
  theme: "dark",
  soundEnabled: true,
  hapticsEnabled: true,
  particlesEnabled: true,
  animationIntensity: "high",
  spinSpeed: "normal",
};

type Store = {
  hydrated: boolean;
  setHydrated: () => void;

  // current wheel session (used by Classic & saved wheels)
  currentOptions: WheelOption[];
  currentName: string;
  setCurrentOptions: (opts: WheelOption[]) => void;
  setCurrentName: (n: string) => void;
  addOption: (label: string) => void;
  updateOption: (id: string, patch: Partial<WheelOption>) => void;
  removeOption: (id: string) => void;
  clearOptions: () => void;
  loadOptions: (opts: WheelOption[], name?: string) => void;

  // saved wheels
  savedWheels: Wheel[];
  saveWheel: (wheel?: Partial<Wheel>) => Wheel;
  deleteWheel: (id: string) => void;
  toggleFavorite: (id: string) => void;
  duplicateWheel: (id: string) => Wheel | null;
  renameWheel: (id: string, name: string) => void;

  // results
  history: SpinResult[];
  pushResult: (r: Omit<SpinResult, "id" | "timestamp">) => void;
  clearHistory: () => void;

  // stats
  stats: Stats;
  resetStats: () => void;

  // settings
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      currentOptions: CLASSIC_DEFAULTS,
      currentName: "My Wheel",
      setCurrentOptions: (opts) => set({ currentOptions: opts }),
      setCurrentName: (n) => set({ currentName: n }),
      addOption: (label) => {
        const opts = get().currentOptions;
        const used = opts.map((o) => o.color);
        set({
          currentOptions: [
            ...opts,
            {
              id: nanoid(8),
              label,
              color: pickColor(opts.length, used),
              weight: 1,
            },
          ],
        });
      },
      updateOption: (id, patch) =>
        set({
          currentOptions: get().currentOptions.map((o) =>
            o.id === id ? { ...o, ...patch } : o,
          ),
        }),
      removeOption: (id) =>
        set({
          currentOptions: get().currentOptions.filter((o) => o.id !== id),
        }),
      clearOptions: () => set({ currentOptions: [] }),
      loadOptions: (opts, name) =>
        set({ currentOptions: opts, currentName: name ?? get().currentName }),

      savedWheels: [],
      saveWheel: (wheel) => {
        const now = Date.now();
        const opts = get().currentOptions;
        const name = wheel?.name ?? get().currentName ?? "Untitled wheel";
        const newWheel: Wheel = {
          id: wheel?.id ?? nanoid(10),
          name,
          options: wheel?.options ?? opts,
          createdAt: wheel?.createdAt ?? now,
          updatedAt: now,
          favorite: wheel?.favorite ?? false,
          mode: wheel?.mode ?? "classic",
          emoji: wheel?.emoji,
        };
        const existing = get().savedWheels.find((w) => w.id === newWheel.id);
        const list = existing
          ? get().savedWheels.map((w) => (w.id === newWheel.id ? newWheel : w))
          : [newWheel, ...get().savedWheels];
        set({ savedWheels: list });
        return newWheel;
      },
      deleteWheel: (id) =>
        set({ savedWheels: get().savedWheels.filter((w) => w.id !== id) }),
      toggleFavorite: (id) =>
        set({
          savedWheels: get().savedWheels.map((w) =>
            w.id === id ? { ...w, favorite: !w.favorite } : w,
          ),
        }),
      duplicateWheel: (id) => {
        const src = get().savedWheels.find((w) => w.id === id);
        if (!src) return null;
        const copy: Wheel = {
          ...src,
          id: nanoid(10),
          name: `${src.name} copy`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          favorite: false,
        };
        set({ savedWheels: [copy, ...get().savedWheels] });
        return copy;
      },
      renameWheel: (id, name) =>
        set({
          savedWheels: get().savedWheels.map((w) =>
            w.id === id ? { ...w, name, updatedAt: Date.now() } : w,
          ),
        }),

      history: [],
      pushResult: (r) => {
        const result: SpinResult = {
          ...r,
          id: nanoid(8),
          timestamp: Date.now(),
        };
        const prev = get().stats;
        const stats: Stats = {
          ...prev,
          totalSpins: prev.totalSpins + 1,
          totalSpinTime: prev.totalSpinTime + r.duration,
          lastSpinAt: result.timestamp,
          streak: prev.lastSpinAt && Date.now() - prev.lastSpinAt < 86400000 * 2
            ? prev.streak + 1
            : 1,
          spinsByMode: {
            ...prev.spinsByMode,
            [r.mode]: (prev.spinsByMode[r.mode] ?? 0) + 1,
          },
          optionFrequency: {
            ...prev.optionFrequency,
            [r.optionLabel]: (prev.optionFrequency[r.optionLabel] ?? 0) + 1,
          },
        };
        set({
          history: [result, ...get().history].slice(0, 200),
          stats,
        });
      },
      clearHistory: () => set({ history: [] }),

      stats: defaultStats,
      resetStats: () => set({ stats: defaultStats, history: [] }),

      settings: defaultSettings,
      updateSettings: (patch) =>
        set({ settings: { ...get().settings, ...patch } }),
    }),
    {
      name: "decision-wheel-pro",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (s) => ({
        currentOptions: s.currentOptions,
        currentName: s.currentName,
        savedWheels: s.savedWheels,
        history: s.history,
        stats: s.stats,
        settings: s.settings,
      }),
    },
  ),
);
