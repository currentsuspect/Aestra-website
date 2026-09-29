/* ── The session in the hero mock, and the rules it is drawn by ──────
   The arrangement is the 15-track, 40-bar session in the Sep 2026 app
   captures (112 BPM). Every colour rule is ported from ~/Dev/Aestra and
   must track it:
     - track identity hues      → TRACK_PALETTE (AestraUI/Widgets/TrackColorPalette.h, Ember)
     - clip body / ink / label  → capClipLuminance(0.14), liftClipInk(0.86 / 0.94)
     - lane stripe + overview   → restrainLaneIdentityColor (0.84, 0.62)
     - chrome surfaces / text   → createAestraDark() in AestraUI/Core/NUIThemeSystem.cpp
   The waveforms are generated, shaped per instrument; they are not audio. */

export type RGB = [number, number, number];

/* Ember, from NUIThemeSystem.cpp. The mock is the DAW, so it stays in the
   DAW's own dark world in both site themes. */
export const D = {
  bed: "#000000",          // timelineBed: pure black by the owner's direction
  chrome: "#0c0b0a",       // trackChrome = backgroundPrimary
  panel: "#141210",        // backgroundSecondary
  control: "#1c1a17",      // surfaceTertiary
  raised: "#25221f",       // surfaceRaised
  border: "#2e2a26",
  borderStrong: "#3d3833",
  divider: "#27231f",
  t1: "#eee9e1",
  t2: "#aca397",
  t3: "#857d72",
  t4: "#57514a",
  primary: "#7c3aed",
  violet: "#a88dfb",       // secondary: violet readable as text
  meter: "#3fd6ad",
  warn: "#f3a93b",
  error: "#ff6b4f",
  success: "#5cc98a",
} as const;

/* TRACK_PALETTE, Ember: OKLCH L 0.73 C 0.18 at hues 172/300/55/30/232/128/355/272 */
export const PALETTE = ["#06c49d", "#b88efc", "#fb8304", "#ff7a66", "#10b6f3", "#86bc23", "#fb70ad", "#8aa1fc"];

const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const toCss = (c: RGB, a = 1) =>
  `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;
const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const lum = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);

/** capClipLuminance: one scalar on all channels until WCAG luminance ≤ ceiling. */
const capClip = (c: RGB, ceiling = 0.14): RGB => {
  if (lum(c) <= ceiling) return c;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 14; i++) {
    const k = (lo + hi) / 2;
    if (lum(c.map((v) => v * k) as RGB) > ceiling) hi = k;
    else lo = k;
  }
  return c.map((v) => v * lo) as RGB;
};
const lift = (c: RGB, k: number): RGB => c.map((v) => v + (1 - v) * k) as RGB;
const restrain = (c: RGB, b: number, s: number): RGB => {
  const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return c.map((v) => Math.max(0, Math.min(1, ((v - l) * s + l) * b))) as RGB;
};

export const tone = (slot: number) => {
  const identity = hex(PALETTE[slot % PALETTE.length]);
  const body = capClip(identity);
  return {
    body: toCss(body),
    edge: toCss(lift(body, 0.3)),
    ink: toCss(lift(body, 0.86)),
    label: toCss(lift(body, 0.94)),
    lane: toCss(restrain(identity, 0.84, 0.62)),
  };
};

/* ── Session ─────────────────────────────────────────────────────── */
export const BPM = 112;
export const BARS = 40;
export const BEATS = BARS * 4;

type Shape = "vox" | "pad" | "perc" | "drum" | "bass" | "keys";
export type Track = { name: string; slot: number };
export type Clip = { id: string; track: number; start: number; end: number; shape: Shape };

export const TRACKS: Track[] = [
  { name: "Vocal Intro", slot: 6 }, { name: "Intro Pad", slot: 0 }, { name: "Intro Swell", slot: 4 },
  { name: "Perc Intro", slot: 2 }, { name: "Drums", slot: 3 }, { name: "Synth Bass", slot: 7 },
  { name: "Organ", slot: 5 }, { name: "Poly Synth", slot: 4 }, { name: "Synth Stabs", slot: 6 },
  { name: "Texture", slot: 5 }, { name: "Accent A", slot: 1 }, { name: "Accent B", slot: 1 },
  { name: "Lead Vocal", slot: 6 }, { name: "Drum Kit", slot: 3 }, { name: "Keys", slot: 2 },
];

const C = (track: number, start: number, end: number, shape: Shape): Clip =>
  ({ id: `${track}-${start}`, track, start, end, shape });

/* Bars, 0-based, read off the capture. */
export const CLIPS: Clip[] = [
  C(0, 0, 7.8, "vox"), C(1, 0, 7.1, "pad"), C(2, 6, 7.1, "pad"), C(3, 0, 7.1, "perc"),
  C(4, 8, 16, "drum"), C(4, 16, 24, "drum"), C(4, 24, 37.6, "drum"),
  C(5, 8, 24, "bass"), C(5, 24, 40, "bass"), C(6, 8, 24, "pad"), C(6, 24, 40, "pad"),
  C(7, 8, 40, "pad"), C(8, 8, 22, "keys"), C(8, 24, 40, "keys"),
  C(9, 9, 16, "pad"), C(9, 16, 24, "pad"), C(9, 25, 38.2, "pad"),
  C(10, 9, 40, "perc"), C(11, 8, 24, "perc"),
  C(12, 8, 12, "vox"), C(12, 12, 19, "vox"), C(12, 20, 24, "vox"), C(12, 28, 36, "vox"), C(12, 36, 40, "vox"),
  C(13, 24, 28, "drum"), C(13, 28, 32, "drum"), C(13, 32, 36, "drum"), C(13, 36, 40, "drum"),
  C(14, 24, 28, "keys"), C(14, 28, 32, "keys"), C(14, 32, 36, "keys"), C(14, 36, 40, "keys"),
];

/* Stems in the library, as the app now shows them: the pack's shared
   "<name> - " prefix dropped, since the folder already names the pack. */
export const FILES = [
  "Accent 1 [Intro].wav", "Accent 2.wav", "Accent 3.wav", "Drum Loop.wav", "Noise.wav",
  "Pad [Intro].wav", "Perc Loop [Intro].wav", "Synth Accent.wav", "Synth Bass.wav",
  "Synth Texture.wav", "Synth [Farfisa V].wav", "Synth [Prophet V].wav", "Vocal [Intro].wav", "Vocal.wav",
];

/* ── Waveforms ───────────────────────────────────────────────────── */
const rng = (seed: number) => {
  let a = (seed * 9973) | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const amp = (shape: Shape, beat: number, r: number) => {
  const f = beat % 1;
  switch (shape) {
    case "drum": return (f < 0.06 ? 1 : Math.exp(-f * 6)) * (beat % 2 < 1 ? 0.95 : 0.72) * (0.8 + 0.2 * r);
    case "perc": { const g = (beat * 2) % 1; return (g < 0.05 ? 0.7 : Math.exp(-g * 9) * 0.6) * (0.7 + 0.3 * r); }
    case "vox": { const b = beat % 4; return b > 0.3 && b < 3.3 ? (0.38 + 0.42 * Math.abs(Math.sin(beat * 2.3))) * (0.8 + 0.2 * r) : 0.03; }
    case "bass": return 0.5 + 0.12 * Math.sin(beat * Math.PI) + 0.05 * r;
    case "keys": return Math.exp(-(beat % 2) * 1.2) * 0.75 * (0.9 + 0.1 * r) + 0.05;
    default: return 0.34 + 0.16 * Math.sin(beat * 0.6) + 0.05 * r;
  }
};

const COLS_PER_BEAT = 3;

/** Envelope + RMS body, mirrored about the lane centre (drawChannelWaveform's grammar).
    ViewBox: `0 0 cols 100`, centre at 50. */
export const waveform = (clip: Clip, seed: number) => {
  const beats = (clip.end - clip.start) * 4;
  const cols = Math.max(2, Math.round(beats * COLS_PER_BEAT));
  const next = rng(seed + 7);
  const env: number[] = [];
  let smooth = 0;
  for (let i = 0; i < cols; i++) {
    const a = amp(clip.shape, i / COLS_PER_BEAT, next()) * 0.9;
    smooth = a > smooth ? a : smooth * 0.8 + a * 0.2;
    env.push(Math.min(1, smooth));
  }
  const strip = (k: number) => {
    let d = `M0 50`;
    env.forEach((a, i) => { d += `L${i} ${(50 - a * k).toFixed(1)}`; });
    for (let i = cols - 1; i >= 0; i--) d += `L${i} ${(50 + env[i] * k).toFixed(1)}`;
    return `${d}Z`;
  };
  return { cols, env: strip(46), rms: strip(25), peaks: env };
};

/** Level of a clip at a timeline bar position, 0..1, for the live meters. */
export const levelAt = (clip: Clip, peaks: number[], bar: number) => {
  if (bar < clip.start || bar >= clip.end) return 0;
  const i = Math.floor((bar - clip.start) * 4 * COLS_PER_BEAT);
  return peaks[Math.min(peaks.length - 1, Math.max(0, i))];
};

/** Transport position: bar.beat.sixteenth, the way the DAW's clock shows it. */
export const barBeatSixteenth = (bar: number) => {
  const s = Math.floor(Math.max(0, bar) * 16 + 1e-6);
  return [Math.floor(s / 16) + 1, Math.floor((s % 16) / 4) + 1, (s % 4) + 1] as const;
};

export const clockTime = (bar: number) => {
  const secs = (bar * 4 * 60) / BPM;
  return `${Math.floor(secs / 60)}:${(secs % 60).toFixed(2).padStart(5, "0")}`;
};
