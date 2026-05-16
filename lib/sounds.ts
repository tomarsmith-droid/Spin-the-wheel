// Lightweight WebAudio-based sound design — no external assets needed.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function envelope(
  osc: OscillatorNode,
  gain: GainNode,
  c: AudioContext,
  attack = 0.005,
  decay = 0.1,
  volume = 0.15,
) {
  const now = c.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  osc.start(now);
  osc.stop(now + attack + decay + 0.02);
}

export const Sounds = {
  tick(enabled: boolean) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.value = 1200;
    osc.connect(gain);
    gain.connect(c.destination);
    envelope(osc, gain, c, 0.001, 0.04, 0.04);
  },
  tap(enabled: boolean) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = 520;
    osc.connect(gain);
    gain.connect(c.destination);
    envelope(osc, gain, c, 0.002, 0.07, 0.08);
  },
  win(enabled: boolean) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(c.destination);
      const now = c.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.36);
    });
  },
  celebrate(enabled: boolean) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    const seq = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
    seq.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = i % 2 === 0 ? "triangle" : "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(c.destination);
      const now = c.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.55);
    });
  },
  whoosh(enabled: boolean) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, c.currentTime + 0.4);
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    const now = c.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc.start(now);
    osc.stop(now + 0.5);
  },
};

export function haptic(enabled: boolean, pattern: number | number[] = 12) {
  if (!enabled) return;
  if (typeof navigator === "undefined") return;
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }
}
