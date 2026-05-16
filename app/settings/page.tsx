"use client";

import { HydrationGate } from "@/components/HydrationGate";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import type { Settings } from "@/lib/types";
import { Sounds } from "@/lib/sounds";

export default function SettingsPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);

  return (
    <div className="page-enter">
      <PageHeader
        title="Settings"
        tagline="Make the app feel exactly like you want."
      />

      <div className="mt-6 grid gap-4 max-w-2xl">
        <Group title="Appearance">
          <RowSelect
            label="Theme"
            help="Switch between dark and light."
            value={settings.theme}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            onChange={(v) => update({ theme: v as Settings["theme"] })}
          />
          <RowSelect
            label="Animation intensity"
            help="Higher means more dramatic motion."
            value={settings.animationIntensity}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            onChange={(v) =>
              update({ animationIntensity: v as Settings["animationIntensity"] })
            }
          />
        </Group>

        <Group title="Wheel & feedback">
          <RowSelect
            label="Spin speed"
            help="Length of the wheel animation."
            value={settings.spinSpeed}
            options={[
              { value: "slow", label: "Slow" },
              { value: "normal", label: "Normal" },
              { value: "fast", label: "Fast" },
            ]}
            onChange={(v) => update({ spinSpeed: v as Settings["spinSpeed"] })}
          />
          <RowToggle
            label="Sound effects"
            help="Ticks, taps and the winning fanfare."
            value={settings.soundEnabled}
            onChange={(v) => {
              update({ soundEnabled: v });
              if (v) Sounds.celebrate(true);
            }}
          />
          <RowToggle
            label="Haptic feedback"
            help="Subtle vibrations on supported devices."
            value={settings.hapticsEnabled}
            onChange={(v) => update({ hapticsEnabled: v })}
          />
          <RowToggle
            label="Particle effects"
            help="Confetti & sparkles when you win."
            value={settings.particlesEnabled}
            onChange={(v) => update({ particlesEnabled: v })}
          />
        </Group>

        <Group title="About">
          <div className="p-4 text-sm text-ink-500 dark:text-ink-300 space-y-2">
            <p>
              <span className="font-bold text-ink-900 dark:text-white">Decision Wheel Pro</span> · v1.0
            </p>
            <p>
              Built with Next.js 15, React, Framer Motion and a healthy
              respect for chance. Everything saved locally — nothing leaves
              your device.
            </p>
          </div>
        </Group>
      </div>
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl shadow-card-dark overflow-hidden">
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
        <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-ink-400 dark:text-ink-300">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-black/5 dark:divide-white/10">
        {children}
      </div>
    </div>
  );
}

function RowToggle({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/40 dark:hover:bg-white/5 transition-colors text-left"
    >
      <div className="min-w-0">
        <p className="font-semibold text-sm">{label}</p>
        {help && (
          <p className="text-xs text-ink-400 dark:text-ink-300 mt-0.5">{help}</p>
        )}
      </div>
      <span className="switch" data-on={value ? "true" : "false"} />
    </button>
  );
}

function RowSelect({
  label,
  help,
  value,
  options,
  onChange,
}: {
  label: string;
  help?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-sm">{label}</p>
        {help && (
          <p className="text-xs text-ink-400 dark:text-ink-300 mt-0.5">{help}</p>
        )}
      </div>
      <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
              value === o.value
                ? "bg-gradient-to-br from-gold-300 to-gold-500 text-navy-900 shadow-glow-soft"
                : "text-ink-500 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
