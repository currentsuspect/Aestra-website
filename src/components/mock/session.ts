/* ── Demo session for the hero MockTimeline ─────────────────────────
   An eleven-track beat in progress, so the preview shows a DAW with
   music in it instead of an empty project.

   The *drawing rules* are not free design choices. They are ported
   from the C++ renderer in ~/Dev/Aestra and must track it:
     - clip body / waveform ink tones → AestraUI/Widgets/TrackColorPalette.h
       (restrainDawColor, clipBodyTone, waveformTintTone, liftWaveformInk)
     - audio clip body, header scrim, ghost-instance border
       → TrackUIComponent::drawSampleClipForClip / drawSampleClipHeader
     - waveform envelope + RMS layers → deriveWaveformInk / drawChannelWaveform
     - pattern clip fill, header band, left strip, guides
       → TrackUIComponent::drawPatternClipForClip
     - lane stripe + overview colours → restrainLaneIdentityColor
     - shell geometry → measured from the running app (see constants)
   The *content* (names, notes, audio shapes) is invented demo material.
   ─────────────────────────────────────────────────────────────────── */

export const BARS = 16;
export const BEATS = BARS * 4;
/* Chrome geometry measured from the running app (Sep 2026 Timeline
   screenshot): 235px track header, 42px lane pitch, overview strip above
   the ruler. LayoutDimensions::trackHeight is 46 logical px. */
export const HEADER_W = 235;
export const RIGHT_PAD = 14;
export const ROW_H = 42;
export const OVERVIEW_H = 26;
export const RULER_H = 28;
export const COLS_PER_BEAT = 12;

export const SESSION_TRACKS = [
  "Drums", "808", "Hats", "Keys", "Vox Lead", "Vox Double",
  "Pad", "Perc Loop", "FX", "Bass Gtr", "Chops",
];
export const SESSION_LANES_HEIGHT = OVERVIEW_H + RULER_H + SESSION_TRACKS.length * ROW_H;

/* ── Colour math, ported ─────────────────────────────────────────── */
export type RGB = [number, number, number];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const hexToRgb = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

export const rgba = (c: RGB, a: number) =>
  `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`;

const lerp = (c: RGB, t: RGB, k: number): RGB => [
  c[0] + (t[0] - c[0]) * k,
  c[1] + (t[1] - c[1]) * k,
  c[2] + (t[2] - c[2]) * k,
];

/** NUIColor::lightened(k) = withBrightness(1 + k): a channel multiply, not a
    blend toward white (AestraUI/Core/NUITypes.h). Clamped as the renderer does. */
export const lightened = (c: RGB, k: number): RGB => c.map((v) => clamp01(v * (1 + k))) as RGB;

/** restrainDawColor */
const restrain = (c: RGB, brightness: number, saturation: number): RGB => {
  const luma = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return c.map((v) => clamp01(((v - luma) * saturation + luma) * brightness)) as RGB;
};

export const tone = {
  /** clipBodyTone(identity, selected=false) */
  body: (hex: string) => restrain(hexToRgb(hex), 0.68, 0.56),
  /** liftWaveformInk(waveformTintTone(identity, false)) */
  ink: (hex: string) => lerp(restrain(hexToRgb(hex), 1.0, 0.92), [1, 1, 1], 0.52),
  /** restrainLaneIdentityColor — lane stripe and overview lines */
  lane: (hex: string) => restrain(hexToRgb(hex), 0.84, 0.62),
  raw: hexToRgb,
};

/* ── Content ─────────────────────────────────────────────────────── */
type AudioShape = "keys" | "vox" | "pad" | "perc" | "riser" | "impact" | "chops";
export type Note = { at: number; len: number; row: number };

export type SessionClip = {
  id: string;
  track: number;
  start: number;
  len: number;
  name: string;
  kind: "audio" | "pattern";
  /** A later instance of a pattern already on the timeline: dimmer border. */
  ghost?: boolean;
  notes?: Note[];
  rows?: number;
  cols?: number;
  env?: string;
  rms?: string;
  peaks?: Float32Array;
};

const rng = (seed: number) => {
  let a = (seed * 9973) | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const amplitude = (shape: AudioShape, t: number, len: number, r: number, seed: number) => {
  const beatFrac = t % 1;
  const halfFrac = (t % 0.5) * 2;
  switch (shape) {
    case "keys": {
      const f = t % 2;
      return Math.exp(-f * 0.9) * 0.72 * (0.78 + 0.22 * r) + 0.05 * r;
    }
    case "vox": {
      const inBar = t % 4;
      const gate = inBar > 0.25 && inBar < 3.4 ? 1 : 0;
      const syllable = Math.pow(Math.abs(Math.sin(t * 3.7 + seed)), 1.6);
      const breath = Math.abs(Math.sin(t * 13.1 + seed * 2));
      return gate * (0.14 + 0.62 * syllable * (0.6 + 0.4 * breath)) * (0.55 + 0.45 * r);
    }
    case "pad": {
      const fade = Math.min(1, t / 1.5) * Math.min(1, (len - t) / 1.5);
      return (0.36 + 0.08 * Math.sin(t * 0.7 + seed) + 0.04 * r) * fade;
    }
    case "perc":
      return Math.exp(-halfFrac * 5.5) * (beatFrac < 0.5 ? 0.82 : 0.5) * (0.7 + 0.3 * r) + 0.05 * r;
    case "riser":
      return Math.pow(t / len, 2.2) * 0.95 * (0.8 + 0.2 * r);
    case "impact":
      return Math.exp(-t * 1.4) * 0.95 * (0.85 + 0.15 * r);
    case "chops": {
      const slice = Math.floor(t * 2);
      const on = Math.sin(slice * 12.9898 + seed) * 43758.5453 % 1;
      return Math.abs(on) > 0.35 ? Math.exp(-halfFrac * 2.2) * 0.8 : 0.03 * r;
    }
  }
};

const audio = (track: number, start: number, len: number, name: string, shape: AudioShape, seed: number): SessionClip => {
  const cols = Math.round(len * COLS_PER_BEAT);
  const next = rng(seed);
  const max = new Float32Array(cols);
  const min = new Float32Array(cols);
  const rms = new Float32Array(cols);
  for (let i = 0; i < cols; i++) {
    // 0.72 headroom: mixed material rarely sits at full scale, and a clip
    // filled edge to edge reads as a slab, not audio.
    const a = clamp01(amplitude(shape, i / COLS_PER_BEAT, len, next(), seed) * 0.72);
    max[i] = a * (0.62 + 0.38 * next());
    min[i] = -a * (0.62 + 0.38 * next());
    rms[i] = a * 0.48;
  }
  // 100-unit tall viewBox, centre at 50, 2-unit inset like halfDrawH = h/2 - 2.
  const y = (v: number) => (50 - v * 46).toFixed(1);
  const strip = (top: (i: number) => number, bottom: (i: number) => number) => {
    let d = `M0 ${y(top(0))}`;
    for (let i = 0; i < cols; i++) d += `L${i + 0.5} ${y(top(i))}`;
    d += `L${cols} ${y(top(cols - 1))}L${cols} ${y(bottom(cols - 1))}`;
    for (let i = cols - 1; i >= 0; i--) d += `L${i + 0.5} ${y(bottom(i))}`;
    return `${d}L0 ${y(bottom(0))}Z`;
  };
  return {
    id: `a${track}-${start}`,
    track, start, len, name, kind: "audio", cols,
    env: strip((i) => max[i], (i) => min[i]),
    rms: strip((i) => Math.min(max[i], rms[i]), (i) => Math.max(min[i], -rms[i])),
    peaks: max,
  };
};

const pattern = (track: number, start: number, len: number, name: string, notes: Note[], rows: number, ghost = false): SessionClip => ({
  id: `p${track}-${start}`,
  track, start, len, name, kind: "pattern", notes: notes.filter((n) => n.at < len), rows, ghost,
});

/* Rows count from the top; drum kick sits on the bottom row. */
const drums = (len: number, fill = false) => {
  const n: Note[] = [];
  for (let b = 0; b < len; b += 4) {
    n.push({ at: b, len: 0.25, row: 5 }, { at: b + 2.5, len: 0.25, row: 5 });
    n.push({ at: b + 1, len: 0.25, row: 2 }, { at: b + 3, len: 0.25, row: 2 });
    if (b % 8 === 4) n.push({ at: b + 3.75, len: 0.2, row: 5 });
  }
  if (fill) for (let s = 0; s < 8; s++) n.push({ at: len - 2 + s * 0.25, len: 0.2, row: 1 + (s % 3) });
  return n;
};

const bassLine = (len: number, shift = 0) => {
  const seq = [8, 8, 5, 10];
  const n: Note[] = [];
  for (let b = 0, i = 0; b < len; b += 4, i++) {
    const p = seq[(i + shift) % 4];
    n.push({ at: b, len: 1.5, row: p }, { at: b + 2, len: 0.75, row: p }, { at: b + 2.75, len: 1.1, row: p - 3 });
  }
  return n;
};

const hats = (len: number, roll = false) => {
  const n: Note[] = [];
  for (let t = 0; t < len; t += 0.5) n.push({ at: t, len: 0.2, row: 2 });
  for (let b = 0; b < len; b += 4) n.push({ at: b + 3.5, len: 0.4, row: 0 });
  if (roll) for (let t = len - 2; t < len; t += 0.25) n.push({ at: t, len: 0.15, row: 1 });
  return n;
};

const guitar = (len: number) => {
  const seq = [7, 7, 5, 4, 7, 9, 5, 4];
  return Array.from({ length: len }, (_, i) => ({ at: i, len: 0.8, row: seq[i % 8] }));
};

export const SESSION_CLIPS: SessionClip[] = [
  pattern(0, 0, 16, "Drums A", drums(16), 7),
  pattern(0, 16, 16, "Drums A", drums(16, true), 7, true),
  pattern(0, 36, 24, "Drums B", drums(24, true), 7),
  pattern(1, 0, 16, "808 Line", bassLine(16), 12),
  pattern(1, 16, 16, "808 Line", bassLine(16), 12, true),
  pattern(1, 36, 24, "808 B", bassLine(24, 2), 12),
  pattern(2, 4, 12, "Hats", hats(12), 4),
  pattern(2, 16, 16, "Hats Roll", hats(16, true), 4),
  pattern(2, 36, 24, "Hats", hats(24), 4, true),
  audio(3, 0, 32, "keys_chords.wav", "keys", 3),
  audio(3, 36, 24, "keys_chords.wav", "keys", 4),
  audio(4, 8, 8, "vox_take3.wav", "vox", 5),
  audio(4, 20, 12, "vox_take3.wav", "vox", 6),
  audio(4, 40, 16, "vox_hook.wav", "vox", 7),
  audio(5, 20, 12, "vox_dbl.wav", "vox", 8),
  audio(5, 40, 16, "vox_hook_dbl.wav", "vox", 9),
  audio(6, 0, 16, "pad_air.wav", "pad", 10),
  audio(6, 24, 36, "pad_air.wav", "pad", 11),
  audio(7, 16, 16, "perc_loop_95.wav", "perc", 12),
  audio(7, 36, 24, "perc_loop_95.wav", "perc", 13),
  audio(8, 12, 4, "riser_up.wav", "riser", 14),
  audio(8, 32, 4, "impact.wav", "impact", 15),
  audio(8, 56, 4, "riser_up.wav", "riser", 17),
  pattern(9, 36, 24, "Bass Gtr", guitar(24), 12),
  audio(10, 44, 8, "chops.wav", "chops", 16),
  audio(10, 56, 4, "chops.wav", "chops", 18),
];

/** Instantaneous level of a clip at a timeline beat, 0..1. */
export const clipLevel = (c: SessionClip, beat: number) => {
  const local = beat - c.start;
  if (local < 0 || local >= c.len) return 0;
  if (c.kind === "audio" && c.peaks) {
    return c.peaks[Math.min(c.peaks.length - 1, Math.floor(local * COLS_PER_BEAT))];
  }
  let level = 0;
  for (const n of c.notes ?? []) {
    if (n.at > local) continue;
    const held = local < n.at + n.len;
    level = Math.max(level, held ? 0.85 : 0.85 * Math.exp(-(local - n.at - n.len) * 6));
  }
  return level;
};
