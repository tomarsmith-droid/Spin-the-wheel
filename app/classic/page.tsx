"use client";

import { useState } from "react";
import { WheelStage } from "@/components/WheelStage";
import { OptionsList } from "@/components/OptionsList";
import { HydrationGate } from "@/components/HydrationGate";
import { useStore } from "@/lib/store";
import { PrimaryButton } from "@/components/PrimaryButton";
import { PageHeader } from "@/components/PageHeader";
import { Sounds } from "@/lib/sounds";

export default function ClassicPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const options = useStore((s) => s.currentOptions);
  const add = useStore((s) => s.addOption);
  const update = useStore((s) => s.updateOption);
  const remove = useStore((s) => s.removeOption);
  const clear = useStore((s) => s.clearOptions);
  const name = useStore((s) => s.currentName);
  const setName = useStore((s) => s.setCurrentName);
  const saveWheel = useStore((s) => s.saveWheel);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSave = () => {
    Sounds.tap(soundEnabled);
    saveWheel({ mode: "classic", name, options });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <div className="page-enter">
      <PageHeader
        title="Classic"
        tagline="Add options, spin, decide."
        rightSlot={
          <PrimaryButton variant="ghost" size="md" onClick={handleSave}>
            <SaveIcon className="w-4 h-4" />
            {savedFlash ? "Saved!" : "Save wheel"}
          </PrimaryButton>
        }
      />
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 mt-4">
        <div className="order-2 lg:order-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full text-center text-lg md:text-xl font-display font-bold bg-transparent focus:outline-none placeholder:text-ink-300 dark:placeholder:text-ink-500 tracking-tight"
            placeholder="Name this wheel"
          />
          <WheelStage options={options} mode="classic" />
        </div>
        <div className="order-1 lg:order-2">
          <OptionsList
            options={options}
            onAdd={add}
            onUpdate={update}
            onRemove={remove}
            onClear={clear}
          />
        </div>
      </div>
    </div>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
