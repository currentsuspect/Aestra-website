import React from "react";
import { D, PALETTE, tone } from "../mock/emberSession";

/* ── Preview kit ─────────────────────────────────────────────────────
   The pieces every changelog preview is drawn from, in the DAW's own
   Ember UI: panels, clips, the piano roll, Arsenal step lanes, knobs,
   meters, menus and a pointer. A scene is a pure function of time, so
   it can be scrubbed, looped, or frozen for reduced motion. Coordinates
   are the stage's 600 × 240 viewBox. These are illustrations of what
   shipped, not screen recordings, and the stage says so. */

export { D, PALETTE, tone };

import { W, H } from "./size";
export { W, H };

export type Scene = {
  /** Panel title shown above the stage. */
  title: string;
  /** Seconds of motion before the loop holds and restarts. */
  dur: number;
  /** The frame shown when motion is reduced. Defaults to the end. */
  still?: number;
  draw: (t: number) => React.ReactNode;
};

/* ── Time ─────────────────────────────────────────────────────────── */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** Progress of t through [a, b], 0..1. */
export const k = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const out = (p: number) => 1 - Math.pow(1 - p, 3);
export const io = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
/** Eased progress through [a, b]. */
export const ek = (t: number, a: number, b: number) => io(k(t, a, b));
/** A value that follows keyframes [time, value] with eased segments. */
export const keys = (t: number, frames: [number, number][]) => {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i];
    const [t0, v0] = frames[i - 1];
    if (t <= t1) return lerp(v0, v1, io(k(t, t0, t1)));
  }
  return frames[frames.length - 1][1];
};
/** A point that follows keyframes [time, x, y]. */
export const path2 = (t: number, frames: [number, number, number][]) => ({
  x: keys(t, frames.map(([a, x]) => [a, x] as [number, number])),
  y: keys(t, frames.map(([a, , y]) => [a, y] as [number, number])),
});
/** Bar → x for a timeline of `bars` bars spanning (x, w); bar 1 sits at x. */
export const grid = (bars: number, x = 20, w = 560) => (bar: number) => x + ((bar - 1) / bars) * w;
/** True inside [a, b). */
export const within = (t: number, a: number, b: number) => t >= a && t < b;

/* ── Deterministic noise ──────────────────────────────────────────── */
const rng = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
};
export type Shape = "drum" | "vox" | "pad" | "bass" | "keys" | "hit";
/** Peak envelope, 0..1, n columns. */
export const peaks = (n: number, seed: number, shape: Shape = "vox") => {
  const r = rng(seed);
  const res: number[] = [];
  let env = 0;
  const period = 7 + (seed % 5);
  for (let i = 0; i < n; i++) {
    const x = i / n;
    let a: number;
    switch (shape) {
      case "drum": { const ph = (i % period) / period; a = (i % (period * 2) < period ? 0.95 : 0.7) * Math.exp(-ph * 5) + 0.12; break; }
      case "hit": a = Math.exp(-x * 5) * 0.95 + 0.04; break;
      case "pad": a = 0.5 + Math.sin(x * 7 + seed) * 0.12; break;
      case "bass": { const ph = (i % (period * 2)) / (period * 2); a = 0.4 + Math.exp(-ph * 3) * 0.35; break; }
      case "keys": { const ph = (i % (period * 3)) / (period * 3); a = 0.28 + Math.exp(-ph * 2.2) * 0.45; break; }
      default: a = (0.3 + 0.45 * Math.abs(Math.sin(x * 9 + seed))) * (0.75 + 0.25 * Math.sin(x * 31 + seed * 2));
    }
    env = a > env ? env * 0.4 + a * 0.6 : env * 0.82 + a * 0.18;
    res.push(clamp(env * (0.5 + 0.5 * r()) * 0.92));
  }
  return res;
};

/** Mirrored waveform path inside (x, y, w, h). */
export const wavePath = (p: number[], x: number, y: number, w: number, h: number) => {
  const mid = y + h / 2;
  const step = w / Math.max(1, p.length - 1);
  let top = `M${x} ${mid}`;
  let bot = "";
  p.forEach((v, i) => {
    top += `L${(x + i * step).toFixed(1)} ${(mid - (v * h) / 2).toFixed(1)}`;
    bot = `L${(x + i * step).toFixed(1)} ${(mid + (v * h) / 2).toFixed(1)}` + bot;
  });
  return `${top}${bot}Z`;
};

/** Clips its children to a rectangle without a clipPath id, so many stages can share a page. */
export const Crop = ({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) => (
  <svg x={x} y={y} width={Math.max(0, w)} height={Math.max(0, h)} viewBox={`${x} ${y} ${Math.max(0.01, w)} ${Math.max(0.01, h)}`} overflow="hidden">
    {children}
  </svg>
);

/* ── Type ─────────────────────────────────────────────────────────── */
export const SANS = "var(--font-sans)";
export const MONO = "var(--font-mono)";

export const Label = ({ x, y, children, size = 11, color = D.t2, anchor = "start", weight = 500, mono = false, opacity = 1 }: {
  x: number; y: number; children: React.ReactNode; size?: number; color?: string;
  anchor?: "start" | "middle" | "end"; weight?: number; mono?: boolean; opacity?: number;
}) => (
  <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontWeight={weight} opacity={opacity}
    style={{ fontFamily: mono ? MONO : SANS }}>{children}</text>
);

/* ── Chrome ───────────────────────────────────────────────────────── */
/** A DAW panel: title strip, window keys, body. */
export const Panel = ({ x = 8, y = 8, w = W - 16, h = H - 16, title, right, children }: {
  x?: number; y?: number; w?: number; h?: number; title: string; right?: React.ReactNode; children?: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={D.chrome} stroke={D.border} />
    <rect x={x} y={y} width={w} height={24} fill={D.panel} />
    <line x1={x} x2={x + w} y1={y + 24.5} y2={y + 24.5} stroke={D.border} />
    <Label x={x + 10} y={y + 16} size={10.5} color={D.t2} weight={600}>{title.toUpperCase()}</Label>
    {right}
    <g stroke={D.t3} strokeWidth={1.2} fill="none">
      <line x1={x + w - 44} x2={x + w - 36} y1={y + 12.5} y2={y + 12.5} />
      <path d={`M${x + w - 18} ${y + 8.5}l7 7M${x + w - 11} ${y + 8.5}l-7 7`} />
    </g>
    {children}
  </g>
);

/** Plugin editor window (their own accent, like the real editors). */
export const PluginWindow = ({ x, y, w, h, name, tag, accent, children }: {
  x: number; y: number; w: number; h: number; name: string; tag?: string; accent: string; children?: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} fill="#0e0f10" stroke="#2a2d30" />
    <Label x={x + 12} y={y + 19} size={11} color="#c9ccd0">{name}</Label>
    {tag && (
      <g>
        <rect x={x + 18 + name.length * 5.6} y={y + 7} width={tag.length * 5.8 + 14} height={17} rx={8.5} fill="none" stroke={accent} strokeOpacity={0.6} />
        <Label x={x + 25 + name.length * 5.6} y={y + 19} size={10} color={accent}>{tag}</Label>
      </g>
    )}
    <path d={`M${x + w - 20} ${y + 10}l8 8M${x + w - 12} ${y + 10}l-8 8`} stroke="#8a8f94" strokeWidth={1.3} />
    <line x1={x} x2={x + w} y1={y + 30.5} y2={y + 30.5} stroke="#1f2225" />
    {children}
  </g>
);

export const Button = ({ x, y, w, h = 20, label, on = false, color = D.primary, ink, pressed = 0, size = 10.5 }: {
  x: number; y: number; w: number; h?: number; label: React.ReactNode; on?: boolean; color?: string; ink?: string; pressed?: number; size?: number;
}) => (
  <g transform={pressed ? `translate(${x + w / 2} ${y + h / 2}) scale(${1 - pressed * 0.06}) translate(${-x - w / 2} ${-y - h / 2})` : undefined}>
    <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={3} fill={on ? color : D.control} stroke={on ? color : D.borderStrong} />
    <Label x={x + w / 2} y={y + h / 2 + size * 0.36} size={size} anchor="middle" weight={600} color={ink ?? (on ? "#0b0714" : D.t2)}>{label}</Label>
  </g>
);

/** Keyboard shortcut chip, pressed while `on`. */
export const Keycap = ({ x, y, label, on = false }: { x: number; y: number; label: string; on?: boolean }) => {
  const w = Math.max(24, label.length * 7.2 + 14);
  return (
    <g transform={`translate(0 ${on ? 1.5 : 0})`}>
      <rect x={x} y={y} width={w} height={22} rx={4} fill={on ? D.t1 : D.raised} stroke={on ? D.t1 : D.borderStrong} />
      {!on && <rect x={x} y={y + 19} width={w} height={3} rx={2} fill={D.border} />}
      <Label x={x + w / 2} y={y + 15} size={11} anchor="middle" weight={600} mono color={on ? "#100e0d" : D.t1}>{label}</Label>
    </g>
  );
};

/** The pointer. `down` 0..1 draws the click ring. */
export const Cursor = ({ x, y, down = 0, hand = false }: { x: number; y: number; down?: number; hand?: boolean }) => (
  <g transform={`translate(${x} ${y})`} style={{ pointerEvents: "none" }}>
    {down > 0 && <circle r={6 + down * 10} fill="none" stroke={D.t1} strokeOpacity={0.55 * (1 - down)} strokeWidth={1.5} />}
    {hand ? (
      <path d="M-1 -2v-7a2 2 0 0 1 4 0v6h1v-3a2 2 0 0 1 4 0v3h1v-2a2 2 0 0 1 4 0v8c0 5-3 8-7 8h-2c-3 0-5-2-7-5l-3-5a2 2 0 0 1 3-2l2 2z"
        fill="#fff" stroke="#111" strokeWidth={1} />
    ) : (
      <path d="M0 0v16l4.2-4 2.8 6.4 2.6-1.1-2.8-6.3 5.8-.2z" fill="#fff" stroke="#111" strokeWidth={1} strokeLinejoin="round" />
    )}
  </g>
);

/** Centre y of row `i` in a Menu at `y`; aim the cursor here so the highlight and the pointer agree. */
export const menuRowY = (y: number, i: number, rowH = 20) => y + 4 + i * rowH + rowH / 2;
/** Centre of a track header's M / S / R button. */
export const trackBtn = (x: number, y: number, w: number, h: number, which: "M" | "S" | "R") =>
  ({ x: x + w - 64 + ["M", "S", "R"].indexOf(which) * 21 + 9, y: y + h / 2 });

/** A popup menu. The highlighted row is the one under `cursor` once it has opened, so the pointer
    and the highlight cannot disagree; `hover` forces a row when there is no pointer. */
export const Menu = ({ x, y, w = 150, items, hover = -1, open = 1, cursor, rowH = 20 }: {
  x: number; y: number; w?: number; items: (string | { label: string; dim?: boolean; hint?: string; danger?: boolean; head?: boolean })[];
  hover?: number; open?: number; cursor?: { x: number; y: number }; rowH?: number;
}) => {
  const rows = items.map((i) => (typeof i === "string" ? { label: i } : i));
  const h = rows.length * rowH + 8;
  if (cursor && open > 0.6 && cursor.x >= x && cursor.x <= x + w) {
    const i = Math.floor((cursor.y - (y + 4)) / rowH);
    hover = i >= 0 && i < rows.length && !rows[i].head ? i : -1;
  }
  const base = (i: number) => y + 4 + i * rowH + rowH / 2 + 4;
  return (
    <g opacity={clamp(open * 2)} transform={`translate(0 ${(1 - out(open)) * -4})`}>
      <Crop x={x - 1} y={y - 1} w={w + 2} h={(h + 2) * out(open)}>
        <rect x={x} y={y} width={w} height={h} rx={4} fill={D.raised} stroke={D.borderStrong} />
        {rows.map((r, i) => (
          <g key={i}>
            {i === hover && <rect x={x + 3} y={y + 4 + i * rowH} width={w - 6} height={rowH} rx={3} fill={D.primary} />}
            <Label x={x + 10} y={base(i)} size={r.head ? 9.5 : 11} mono={r.head}
              color={i === hover ? "#fff" : r.head ? D.t3 : r.danger ? D.error : r.dim ? D.t3 : D.t1}>{r.label}</Label>
            {r.hint && <Label x={x + w - 10} y={base(i)} size={10} anchor="end" mono color={i === hover ? "#e6e0ff" : D.t3}>{r.hint}</Label>}
          </g>
        ))}
      </Crop>
    </g>
  );
};

/** A small notice, as the DAW shows it. */
export const Toast = ({ x, y, w, text, kind = "info", show = 1 }: {
  x: number; y: number; w: number; text: string; kind?: "info" | "warn" | "ok" | "error"; show?: number;
}) => {
  const c = kind === "warn" ? D.warn : kind === "ok" ? D.success : kind === "error" ? D.error : D.violet;
  return (
    <g opacity={clamp(show * 1.5)} transform={`translate(0 ${(1 - out(clamp(show))) * 8})`}>
      <rect x={x} y={y} width={w} height={26} rx={4} fill={D.raised} stroke={c} strokeOpacity={0.7} />
      <rect x={x} y={y} width={3} height={26} rx={1.5} fill={c} />
      <Label x={x + 12} y={y + 17} size={11} color={D.t1}>{text}</Label>
    </g>
  );
};

/* ── Timeline ─────────────────────────────────────────────────────── */
export type Lane = { x: number; y: number; w: number; h: number };

/** Ruler with bar numbers from `first`, `bars` wide. */
export const Ruler = ({ x, y, w, bars, first = 1, h = 18 }: { x: number; y: number; w: number; bars: number; first?: number; h?: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={D.chrome} />
    {Array.from({ length: bars * 4 + 1 }, (_, i) => {
      const xx = x + (i / (bars * 4)) * w;
      const major = i % 4 === 0;
      return <line key={i} x1={xx} x2={xx} y1={y + h - (major ? 8 : 4)} y2={y + h} stroke={major ? D.t3 : D.t4} />;
    })}
    {Array.from({ length: bars }, (_, i) => (
      <Label key={i} x={x + (i / bars) * w + 3} y={y + 10} size={9.5} color={D.t3}>{first + i}</Label>
    ))}
    <line x1={x} x2={x + w} y1={y + h - 0.5} y2={y + h - 0.5} stroke={D.primary} strokeOpacity={0.6} />
  </g>
);

/** Pure-black bed with bar and beat lines. */
export const Bed = ({ x, y, w, h, bars, beats = true, quiet = false }: { x: number; y: number; w: number; h: number; bars: number; beats?: boolean; quiet?: boolean }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={D.bed} />
    {Array.from({ length: bars * 4 + 1 }, (_, i) => {
      const major = i % 4 === 0;
      if (!major && !beats) return null;
      const xx = x + (i / (bars * 4)) * w;
      return <line key={i} x1={xx} x2={xx} y1={y} y2={y + h} stroke={major ? (quiet ? "#1c1a17" : "#2a2622") : quiet ? "#0f0e0d" : "#161412"} />;
    })}
  </g>
);

export const Playhead = ({ x, y, h, color = D.t1 }: { x: number; y: number; h: number; color?: string }) => (
  <g>
    <line x1={x} x2={x} y1={y} y2={y + h} stroke={color} strokeWidth={1.2} />
    <path d={`M${x - 5} ${y}h10l-5 7z`} fill={color} />
  </g>
);

/** A timeline clip in the DAW's clip rule. */
export const Clip = ({ x, y, w, h, slot, label, shape = "vox", seed = 1, sel = false, ghost = false, rec = false, from = 0, to = 1, waveOpacity = 1, notes, dim = 0, cols }: {
  x: number; y: number; w: number; h: number; slot: number; label?: string; shape?: Shape; seed?: number; sel?: boolean;
  ghost?: boolean; rec?: boolean; from?: number; to?: number; waveOpacity?: number; notes?: [number, number, number][]; dim?: number;
  /** Fixed column count, so a stretched clip stretches its waveform instead of redrawing it. */
  cols?: number;
}) => {
  const c = tone(slot);
  const body = rec ? "#5c1a1d" : c.body;
  const ink = rec ? "#ff8a7a" : c.ink;
  const n = cols ?? Math.max(8, Math.round(w / 1.5));
  const all = peaks(Math.round(n / Math.max(0.05, to - from)), seed, shape);
  const p = all.slice(Math.floor(from * all.length), Math.floor(from * all.length) + n);
  return (
    <g opacity={ghost ? 0.35 : 1 - dim * 0.6}>
      <rect x={x} y={y} width={w} height={h} fill={body} />
      <rect x={x} y={y} width={w} height={1} fill="#fff" opacity={0.18} />
      {label && h >= 22 && w >= 24 && (
        <g>
          <path d={`M${x + 5} ${y + 5}h6M${x + 5} ${y + 7.5}h6M${x + 5} ${y + 10}h6`} stroke={c.label} strokeWidth={1} />
          {/* the name only when it fits inside the clip (about 5.4px a letter at this size) */}
          {w >= 22 + label.length * 5.4 && <Label x={x + 15} y={y + 11} size={9.5} weight={600} color={c.label}>{label}</Label>}
        </g>
      )}
      {notes ? (
        notes.map(([s, l, row], i) => (
          <rect key={i} x={x + 3 + s * (w - 6)} y={y + (label ? 16 : 4) + row * 3.2} width={Math.max(2, l * (w - 6))} height={2.4} fill={ink} />
        ))
      ) : (
        <path d={wavePath(p, x + 2, y + (label && h >= 22 ? 14 : 3), w - 4, h - (label && h >= 22 ? 17 : 6))} fill={ink} opacity={0.85 * waveOpacity} />
      )}
      {sel && <rect x={x + 0.75} y={y + 0.75} width={w - 1.5} height={h - 1.5} fill="none" stroke={D.t1} strokeWidth={1.5} />}
      {dim > 0 && <rect x={x} y={y} width={w} height={h} fill="#000" opacity={dim * 0.45} />}
    </g>
  );
};

/** Track header in the DAW: stripe, number, name, M/S/R keys. */
export const TrackHead = ({ x, y, w, h, n, name, slot, mute = false, solo = false, arm = false, extra }: {
  x: number; y: number; w: number; h: number; n: number; name: string; slot: number;
  mute?: boolean; solo?: boolean; arm?: boolean; extra?: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={D.chrome} />
    <line x1={x} x2={x + w} y1={y + h - 0.5} y2={y + h - 0.5} stroke={D.divider} />
    <rect x={x} y={y + 2} width={2.5} height={h - 4} fill={tone(slot).lane} />
    <Label x={x + 9} y={y + h / 2 + 4} size={9} color={D.t4}>{n}</Label>
    <Label x={x + 24} y={y + h / 2 + 4} size={11.5} color={D.t1}>{name}</Label>
    {extra}
    {(["M", "S", "R"] as const).map((l, i) => {
      const on = l === "M" ? mute : l === "S" ? solo : arm;
      const c = l === "M" ? D.warn : l === "S" ? D.meter : D.error;
      const bx = x + w - 64 + i * 21;
      return (
        <g key={l}>
          <rect x={bx} y={y + h / 2 - 9} width={18} height={18} rx={3} fill={on ? c : D.control} stroke={on ? c : D.borderStrong} />
          <Label x={bx + 9} y={y + h / 2 + 3.5} size={9.5} weight={700} anchor="middle" color={on ? "#100e0d" : D.t3}>{l}</Label>
        </g>
      );
    })}
  </g>
);

/* ── Piano roll ───────────────────────────────────────────────────── */
export type Note = { s: number; l: number; p: number; label?: string; sel?: boolean; o?: number };

/** Piano roll body: keys at left, rows, bar grid, notes in beats. */
export const Roll = ({ x, y, w, h, rows, beats, notes, rowNames, quiet = false, color = D.primary, children }: {
  x: number; y: number; w: number; h: number; rows: number; beats: number; notes: Note[];
  rowNames?: Record<number, string>; quiet?: boolean; color?: string; children?: React.ReactNode;
}) => {
  const kw = 34;
  const rh = h / rows;
  const bx = (b: number) => x + kw + (b / beats) * (w - kw);
  const black = [1, 3, 6, 8, 10];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={D.bed} />
      {Array.from({ length: rows }, (_, r) => {
        const pitch = rows - 1 - r;
        const isBlack = black.includes(pitch % 12);
        return (
          <g key={r}>
            <rect x={x + kw} y={y + r * rh} width={w - kw} height={rh} fill={isBlack ? (quiet ? "#050505" : "#0b0a09") : "#000"} />
            <rect x={x} y={y + r * rh + 0.5} width={kw - 2} height={rh - 1} fill={isBlack ? D.control : D.raised} />
            {rowNames?.[pitch] && <Label x={x + kw - 5} y={y + r * rh + rh / 2 + 3.5} size={8.5} anchor="end" color={D.t2}>{rowNames[pitch]}</Label>}
          </g>
        );
      })}
      {Array.from({ length: beats * 4 + 1 }, (_, i) => {
        const bar = i % 16 === 0;
        const beat = i % 4 === 0;
        return <line key={i} x1={bx(i / 4)} x2={bx(i / 4)} y1={y} y2={y + h}
          stroke={bar ? (quiet ? "#24211e" : "#34302b") : beat ? (quiet ? "#151311" : "#221f1c") : quiet ? "#0a0909" : "#141210"} />;
      })}
      <Crop x={x + kw} y={y} w={w - kw} h={h}>
      {notes.map((n, i) => {
        const nx = bx(n.s);
        const nw = Math.max(3, bx(n.s + n.l) - nx - 1);
        const ny = y + (rows - 1 - n.p) * rh + 1;
        return (
          <g key={i} opacity={n.o ?? 1}>
            <rect x={nx} y={ny} width={nw} height={rh - 2} rx={1.5} fill={n.sel ? "#b597ff" : color} stroke={n.sel ? "#fff" : "none"} strokeWidth={1.2} />
            {n.label && nw > 18 && <Label x={nx + 4} y={ny + rh - 5.5} size={8.5} weight={600} color={n.sel ? "#1b0f33" : "#ede6ff"}>{n.label}</Label>}
          </g>
        );
      })}
      </Crop>
      {children}
    </g>
  );
};
/** Helper to place things on a Roll's time axis. */
export const rollX = (x: number, w: number, beats: number) => (b: number) => x + 34 + (b / beats) * (w - 34);

/* ── Arsenal ──────────────────────────────────────────────────────── */
/** One Arsenal unit row: stripe, name, number chip, M/S and its step lane. */
export const Unit = ({ x, y, w, name, n, color, steps, on, playing = -1, sel = [], hit = [], active = false }: {
  x: number; y: number; w: number; name: string; n: number; color: string; steps: number; on: boolean[];
  playing?: number; sel?: number[]; hit?: number[]; active?: boolean;
}) => {
  const lx = x + 128;
  const lw = w - 134;
  const sw = lw / steps;
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={3} fill={active ? "#1a1612" : D.panel} stroke={active ? "#6b4a14" : D.border} />
      <rect x={x + 3} y={y + 4} width={2.5} height={26} fill={color} />
      <Label x={x + 14} y={y + 21} size={11.5} color={D.t1}>{name}</Label>
      <rect x={x + 62} y={y + 9} width={22} height={16} rx={2} fill="none" stroke={active ? "#b98524" : "#6b2a24"} />
      <Label x={x + 73} y={y + 20.5} size={9} anchor="middle" color={active ? "#f3c35b" : "#e0786a"}>{n}</Label>
      <Button x={x + 88} y={y + 9} w={16} h={16} label="M" size={8.5} />
      <Button x={x + 107} y={y + 9} w={16} h={16} label="S" size={8.5} />
      {Array.from({ length: steps }, (_, i) => {
        const isOn = on[i];
        const isSel = sel.includes(i);
        const isHit = hit.includes(i);
        const group = Math.floor(i / 4) % 2 === 0;
        return (
          <rect key={i} x={lx + i * sw + 1} y={y + 6} width={sw - 2} height={22} rx={2}
            fill={isOn ? (isHit ? "#fff" : color) : group ? "#1d1a17" : "#171513"}
            stroke={isSel ? D.t1 : i === playing ? D.t2 : "none"} strokeWidth={isSel ? 1.5 : 1} />
        );
      })}
    </g>
  );
};

/* ── Controls ─────────────────────────────────────────────────────── */
const polar = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
export const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${x0} ${y0}A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${x1} ${y1}`;
};
const A0 = Math.PI * 0.75;
const A1 = Math.PI * 2.25;

/** Plugin-style knob. `v` is 0..1, or -1..1 when bipolar (arc grows from the top detent). */
export const Knob = ({ cx, cy, r, v, bipolar = false, color, track = "#2a2d30", label, value, sub, labelColor = "#c9ccd0" }: {
  cx: number; cy: number; r: number; v: number; bipolar?: boolean; color: string; track?: string;
  label?: string; value?: string; sub?: string; labelColor?: string;
}) => {
  const mid = (A0 + A1) / 2;
  const a = bipolar ? mid + v * (A1 - mid) : lerp(A0, A1, v);
  const [px, py] = polar(cx, cy, r * 0.62, a);
  const [ex, ey] = polar(cx, cy, r * 0.78, a);
  return (
    <g>
      <path d={arc(cx, cy, r, A0, A1)} stroke={track} strokeWidth={r * 0.16} fill="none" strokeLinecap="butt" />
      {Math.abs(bipolar ? v : v) > 0.001 && (
        <path d={bipolar ? arc(cx, cy, r, Math.min(mid, a), Math.max(mid, a)) : arc(cx, cy, r, A0, a)}
          stroke={color} strokeWidth={r * 0.16} fill="none" />
      )}
      {bipolar && <line x1={cx} x2={cx} y1={cy - r - r * 0.12} y2={cy - r + r * 0.12} stroke="#e8eaec" strokeWidth={2} />}
      <circle cx={cx} cy={cy} r={r * 0.34} fill="#111416" stroke="#23282b" />
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#e8eaec" strokeWidth={2} strokeLinecap="round" />
      <circle cx={px + (ex - px)} cy={py + (ey - py)} r={2.6} fill="#e8eaec" />
      {label && <Label x={cx} y={cy + r + 17} size={11} anchor="middle" color={labelColor}>{label}</Label>}
      {value && <Label x={cx} y={cy + r + 31} size={11} anchor="middle" color={color}>{value}</Label>}
      {sub && <Label x={cx} y={cy + r + 44} size={9.5} anchor="middle" color="#7d8288">{sub}</Label>}
    </g>
  );
};

/** Vertical meter, level 0..1. */
export const Meter = ({ x, y, h, level, w = 5, peak }: { x: number; y: number; h: number; level: number; w?: number; peak?: number }) => {
  const lv = clamp(level);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#0a0908" stroke={D.border} strokeWidth={0.5} />
      <rect x={x} y={y + h * (1 - lv)} width={w} height={h * lv} fill={lv > 0.9 ? D.warn : D.meter} />
      {peak !== undefined && <rect x={x} y={y + h * (1 - clamp(peak))} width={w} height={1.5} fill={D.t1} />}
    </g>
  );
};

/** Mixer fader, v 0..1. */
export const Fader = ({ x, y, h, v }: { x: number; y: number; h: number; v: number }) => {
  const cy = y + h * (1 - v);
  return (
    <g>
      <rect x={x - 1.5} y={y} width={3} height={h} rx={1.5} fill="#0a0908" stroke={D.border} strokeWidth={0.5} />
      <rect x={x - 11} y={cy - 6} width={22} height={12} rx={2} fill={D.raised} stroke={D.borderStrong} />
      <line x1={x - 8} x2={x + 8} y1={cy} y2={cy} stroke={D.t1} />
    </g>
  );
};

/** A mixer channel strip, compact. */
export const Strip = ({ x, y, h, name, slot, v = 0.72, level = 0, inserts = [], sel = false, children }: {
  x: number; y: number; h: number; name: string; slot: number; v?: number; level?: number; inserts?: string[]; sel?: boolean; children?: React.ReactNode;
}) => (
  <g>
    <rect x={x} y={y} width={70} height={h} fill={D.panel} stroke={sel ? D.violet : D.border} />
    <rect x={x} y={y} width={70} height={3} fill={tone(slot).lane} />
    <Label x={x + 35} y={y + 18} size={10.5} anchor="middle" color={D.t1}>{name}</Label>
    {Array.from({ length: 3 }, (_, i) => (
      <g key={i}>
        <rect x={x + 6} y={y + 26 + i * 17} width={58} height={14} rx={2} fill={inserts[i] ? D.raised : "#100e0c"} stroke={D.border} />
        {inserts[i] && <Label x={x + 11} y={y + 36.5 + i * 17} size={9} color={D.t1}>{inserts[i]}</Label>}
      </g>
    ))}
    <Fader x={x + 26} y={y + 86} h={h - 100} v={v} />
    <Meter x={x + 48} y={y + 86} h={h - 100} level={level} w={4} />
    <Meter x={x + 54} y={y + 86} h={h - 100} level={level * 0.94} w={4} />
    {children}
  </g>
);

export const Check = ({ x, y, color = D.success, p = 1 }: { x: number; y: number; color?: string; p?: number }) => (
  <path d={`M${x} ${y}l4 4l8 -9`} stroke={color} strokeWidth={2} fill="none" strokeDasharray={20} strokeDashoffset={20 * (1 - clamp(p))} strokeLinecap="round" />
);

/** A centred caption on its own plate, so it never sits loose over clips or notes. */
export const Caption = ({ x, y, w = 200, opacity = 1, children }: { x: number; y: number; w?: number; opacity?: number; children: React.ReactNode }) => (
  <g opacity={opacity}>
    <rect x={x - w / 2} y={y - 16} width={w} height={26} rx={3} fill="#0b0a09" stroke={D.border} />
    <Label x={x} y={y + 1} size={11} anchor="middle" mono color={D.t2}>{children}</Label>
  </g>
);

/** A tag in the corner telling before from after. */
export const Era = ({ x = W - 16, y = 22, now }: { x?: number; y?: number; now: boolean }) => (
  <g>
    <rect x={x - 60} y={y - 12} width={60} height={17} rx={2} fill={now ? D.primary : D.control} stroke={now ? D.primary : D.borderStrong} />
    <Label x={x - 30} y={y + 0.5} size={9.5} anchor="middle" mono weight={600} color={now ? "#fff" : D.t3}>{now ? "NOW" : "BEFORE"}</Label>
  </g>
);
