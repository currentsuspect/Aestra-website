import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { cn, prefersReducedMotion } from "../lib";
import { SessionLanes } from "./mock/SessionLanes";
import { SESSION_TRACKS, SESSION_LANES_HEIGHT } from "./mock/session";
import { TitleBar, TransportBar, LibraryPanel, ToolRow, TrackButtons } from "./mock/Chrome";

/* ── Native palette — mirrored 1:1 from the DAW ──────────────────
   Source: AestraUI/Core/NUIThemeSystem.cpp (dark theme, July 2026).
   These were previously blue-tinged (#0a0a0a / #191919 / #212121),
   which reproduced a theme the DAW has since abandoned — see
   "fix(ui): neutralize blue-tinged dark chrome to pure greys" and
   "feat(ui): timeline visual pass — pure-black grid". Every surface
   here is a pure grey now, and the timeline backdrop is #0a0a0a.
   Keep this table in sync with NUIThemeSystem.cpp. ─────────────── */
const C = {
  bg: "#0a0a0a",          // backgroundPrimary — "deeper void for timeline backdrop"
  bgSoft: "#111111",      // backgroundSecondary
  surface: "#191919",     // surfaceTertiary
  raised: "#212121",      // surfaceRaised
  border: "#2b2b2b",      // border / borderSubtle
  outline: "#333333",     // outline
  divider: "#252525",     // divider
  meterBg: "#080808",     // meterBackground
  mixerStrip: "#141414",  // mixerStripBg
  buttonBg: "#111111",    // buttonBgDefault
  buttonHover: "#171717", // buttonBgHover
  sliderTrack: "#232323", // sliderTrack
  text: "rgba(255,255,255,0.90)",     // textPrimary
  textDim: "rgba(255,255,255,0.50)",  // textSecondary
  textMuted: "rgba(255,255,255,0.38)",// textMuted
  textOff: "rgba(255,255,255,0.25)",  // textDisabled
  primary: "#7c3aed",
  primaryHover: "#9257ff",
  primaryDim: "#6d28d9",
  cyan: "#00e5cc",
  error: "#e85454",
  success: "#3dbb6e",
  warning: "#e8a838",
  gridBar: "rgba(255,255,255,0.07)",
  gridBeat: "rgba(255,255,255,0.04)",
  hover: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.08)",
};

/* The DAW's 8-entry track palette, cycled by (trackId - 1) % 8.
   Source: AestraUI/Widgets/TrackColorPalette.h. The mock previously
   pinned all 11 tracks to violet, which is exactly the bug fixed by
   "fix(ui): restore per-track palette cycling for track colors". */
const TRACK_PALETTE = [
  "#00C9A7", // 0 — Aestra Teal
  "#7B6FD4", // 1 — Soft Purple
  "#F0A500", // 2 — Amber
  "#FF5757", // 3 — Coral
  "#4FB3FF", // 4 — Sky Blue
  "#A3D977", // 5 — Sage Green
  "#FF7AC6", // 6 — Pink
  "#5C7CFA", // 7 — Indigo
];
const TRACK_COLORS = TRACK_PALETTE;

type Tool = "select" | "cut" | "loop" | "paint" | "arrow" | "erase";

/* A session with music in it (see ./mock/session.ts), not an empty project. */
const TRACK_LAYOUT = SESSION_TRACKS.map((name) => ({ name }));

const NAV_TREE: { section: string; items: { name: string; color?: string; type?: "leaf" | "folder" }[] }[] = [
  { section: "Collections", items: [
    { name: "Favorites",   color: C.primary },
    { name: "Purple",      color: "#a855f7" },
    { name: "Drums",       color: "#f97316" },
    { name: "Instruments", color: "#22c55e" },
    { name: "Vocals",      color: "#3b82f6" },
  ]},
  { section: "Categories", items: [
    { name: "Sounds",    type: "folder" },
    { name: "Drums",     type: "folder" },
    { name: "Instruments", type: "folder" },
    { name: "Effects",   type: "folder" },
    { name: "Plugins",   type: "folder" },
    { name: "Patterns",  type: "folder" },
    { name: "Clips",     type: "folder" },
    { name: "Samples",   type: "folder" },
  ]},
  { section: "Places", items: [
    { name: "Packs",          type: "folder" },
    { name: "User Library",   type: "folder" },
    { name: "Current Project", type: "folder" },
    { name: "+ Add Folder...", type: "leaf" },
  ]},
];

const FILES = [
  { name: "Baby Keem - Ca$ino.flac", kind: "FLAC", size: "28 MB" },
  { name: "Bktherula - CODE.flac", kind: "FLAC", size: "19 MB" },
  { name: "Che - Promoting Violence.flac", kind: "FLAC", size: "17 MB" },
  { name: "CurrentSuspect - ANSWERS.flac", kind: "FLAC", size: "22 MB" },
  { name: "North West - Aishite (愛).flac", kind: "FLAC", size: "16 MB" },
  { name: "North West - W0ah.flac", kind: "FLAC", size: "13 MB" },
  { name: "PlaqueBoyMax - Super Wrong.flac", kind: "FLAC", size: "12 MB" },
  { name: "PlaqueBoyMax - Yellow Lamb.flac", kind: "FLAC", size: "10 MB" },
  { name: "Rapsody - Black Popstar.flac", kind: "FLAC", size: "14 MB" },
  { name: "SLAYR - Flashout Freestyle.flac", kind: "FLAC", size: "23 MB" },
  { name: "SoFaygo - MM3.flac", kind: "FLAC", size: "19 MB" },
  { name: "Travis Scott - HOUSTONFORNICATION.flac", kind: "FLAC", size: "24 MB" },
  { name: "Travis Scott - NO BYSTANDERS.flac", kind: "FLAC", size: "25 MB" },
  { name: "Travis Scott - SHYNE.flac", kind: "FLAC", size: "21 MB" },
  { name: "Yeat - Purpose General.flac", kind: "FLAC", size: "21 MB" },
  { name: "prettifun - #FreePretti.flac", kind: "FLAC", size: "18 MB" },
];

type Track = {
  id: number; name: string; color: string;
  meter: number; db: string; muted: boolean; soloed: boolean; recording: boolean;
};

const initialTracks: Track[] = TRACK_LAYOUT.map((t, i) => ({
  id: i + 1, name: t.name, color: TRACK_COLORS[i % TRACK_COLORS.length],
  meter: i === 0 ? 72 : 4, db: i === 0 ? "-8.0 dB" : "-60.0 dB",
  muted: false, soloed: false, recording: false,
}));

/* ── Utility ────────────────────────────────────────────────────── */
const audioPoints = (seed: number, count: number, amp = 6) => {
  return Array.from({ length: count }, (_, i) => {
    const x = (i / (count - 1)) * 200;
    const env = Math.sin((i / count) * Math.PI);
    const y = 14 + (Math.sin(i * 0.31 + seed) * amp + Math.cos(i * 0.17 + seed * 1.3) * 4) * env;
    return `${x},${y}`;
  }).join(" ");
};

/* ── SVG Icons (matching native transport bar) ──────────────────── */
const Icon = {
  Play: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3.5 2.2a.5.5 0 0 1 .77-.42l8 5.3a.5.5 0 0 1 0 .84l-8 5.3A.5.5 0 0 1 3 12.8V2.2z"/></svg>,
  Pause: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="3" y="2" width="3" height="10" rx="0.8"/><rect x="8" y="2" width="3" height="10" rx="0.8"/></svg>,
  Stop: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.2"/></svg>,
  Record: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="7" r="4.5"/></svg>,
  Metronome: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M7 2v8M5 10l2-5 2 5M4.5 12h5"/></svg>,
  Mixer: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><line x1="3" y1="3" x2="3" y2="11"/><line x1="7" y1="5" x2="7" y2="11"/><line x1="11" y1="2" x2="11" y2="11"/><circle cx="3" cy="6" r="1.2" fill="currentColor"/><circle cx="7" cy="8" r="1.2" fill="currentColor"/><circle cx="11" cy="4" r="1.2" fill="currentColor"/></svg>,
  Arsenal: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="2" width="3" height="3" rx="0.6"/><rect x="5.5" y="2" width="3" height="3" rx="0.6"/><rect x="9" y="2" width="3" height="3" rx="0.6"/><rect x="2" y="5.5" width="3" height="3" rx="0.6"/><rect x="5.5" y="5.5" width="3" height="3" rx="0.6"/><rect x="9" y="5.5" width="3" height="3" rx="0.6"/><rect x="2" y="9" width="3" height="3" rx="0.6"/><rect x="5.5" y="9" width="3" height="3" rx="0.6"/><rect x="9" y="9" width="3" height="3" rx="0.6"/></svg>,
  Timeline: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="10" height="2" rx="0.5"/><rect x="2" y="6" width="7" height="2" rx="0.5"/><rect x="2" y="9" width="10" height="2" rx="0.5"/></svg>,
  PianoRoll: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="2" width="10" height="10" rx="1"/><line x1="5" y1="2" x2="5" y2="12"/><line x1="8" y1="2" x2="8" y2="12"/><line x1="11" y1="2" x2="11" y2="12"/><rect x="3.5" y="2" width="1.5" height="5" rx="0.3" fill="currentColor"/><rect x="6.5" y="2" width="1.5" height="5" rx="0.3" fill="currentColor"/><rect x="9.5" y="2" width="1.5" height="5" rx="0.3" fill="currentColor"/></svg>,
  Search: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="5" cy="5" r="3.5"/><line x1="7.5" y1="7.5" x2="10.5" y2="10.5"/></svg>,
  Folder: () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M2 4.5V11a1 1 0 001 1h8a1 1 0 001-1V5.5a1 1 0 00-1-1H7L5.5 3H3a1 1 0 00-1 1z"/></svg>,
  Audio: () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><circle cx="7" cy="7" r="4"/><path d="M7 4v6M5 6l2-2 2 2M5 10l2 2 2-2"/></svg>,
  ChevronRight: () => <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><path d="M2 1l4 3-4 3z"/></svg>,
  Plus: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M6 2v8M2 6h8"/></svg>,
  Cursor: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l1.5 8L5 7l2.5 2L8.5 8 6 5.5l2.5-1.5z"/></svg>,
  Scissors: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1"><circle cx="3" cy="3" r="1.5"/><circle cx="3" cy="9" r="1.5"/><path d="M4 4l6 5M4 8l6-5"/></svg>,
  Loop: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5a3 3 0 013-3h4l-1.5-1.5M10 7a3 3 0 01-3 3H3l1.5 1.5"/></svg>,
  Paint: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M9 2L4 7l1 1 5-5zM3 8l-1 3 3-1z"/></svg>,
  Arrow: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h8M7 3l3 3-3 3"/></svg>,
  Eraser: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M2 8l4-4 4 4-3 3H3z"/></svg>,
  Minimize: () => <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2 5h6"/></svg>,
  Maximize: () => <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2.5" y="2.5" width="5" height="5"/></svg>,
  Close: () => <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg>,
  Curve: () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 9c1.5-4 3.5-4 5 0s3.5 4 6 0"/></svg>,
  Dots: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="3" cy="7" r="1.1"/><circle cx="7" cy="7" r="1.1"/><circle cx="11" cy="7" r="1.1"/></svg>,
  Hourglass: () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"><path d="M4 2h6M4 12h6M4 2c0 2.5 1.2 3.5 3 5 1.8-1.5 3-2.5 3-5M4 12c0-2.5 1.2-3.5 3-5 1.8 1.5 3 2.5 3 5"/></svg>,
  Sliders: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><line x1="3" y1="2" x2="3" y2="12"/><line x1="7" y1="2" x2="7" y2="12"/><line x1="11" y1="2" x2="11" y2="12"/><circle cx="3" cy="5" r="1.3" fill="currentColor"/><circle cx="7" cy="9" r="1.3" fill="currentColor"/><circle cx="11" cy="4" r="1.3" fill="currentColor"/></svg>,
  Grid: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><rect x="2" y="2" width="4" height="4" rx="0.6"/><rect x="8" y="2" width="4" height="4" rx="0.6"/><rect x="2" y="8" width="4" height="4" rx="0.6"/><rect x="8" y="8" width="4" height="4" rx="0.6"/></svg>,
  Monitor: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"><rect x="2" y="3" width="10" height="6.5" rx="1"/><path d="M5 12h4M7 9.5V12"/></svg>,
  TimelineView: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><rect x="2" y="3" width="10" height="2.2" rx="0.5"/><rect x="2" y="6.4" width="7" height="2.2" rx="0.5"/><rect x="2" y="9.8" width="10" height="0.1" rx="0.5"/><line x1="2" y1="9.8" x2="12" y2="9.8"/></svg>,
  Menu: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><line x1="2.5" y1="4" x2="11.5" y2="4"/><line x1="2.5" y1="7" x2="11.5" y2="7"/><line x1="2.5" y1="10" x2="11.5" y2="10"/></svg>,
  Marquee: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="2 1.4"><rect x="2" y="2" width="8" height="8" rx="1"/></svg>,
  Pencil: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round"><path d="M8.5 1.5l2 2-6 6-2.5.5.5-2.5z"/></svg>,
  Knob: () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><circle cx="7" cy="7" r="4.5"/><path d="M7 3v2.5" strokeLinecap="round"/></svg>,
};

/* ── Transport Button ───────────────────────────────────────────── */
const TBtn = memo(({ active, error: isError, onClick, children, title, className }: {
  active?: boolean; error?: boolean; onClick?: () => void; children: React.ReactNode; title?: string; className?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "flex items-center justify-center rounded transition-colors duration-100",
      "w-7 h-7 text-[13px]",
      active && !isError && "bg-neutral-800 text-neutral-100",
      isError && "bg-rose-500/15 text-rose-400",
      !active && !isError && "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60",
      className,
    )}
  >
    {children}
  </button>
));

/* ── MSR Button (Mute/Solo/Record per track) ────────────────────── */
const MSR = memo(({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center rounded text-[9px] font-semibold w-[18px] h-[16px] transition-colors border",
      active ? "" : "border-neutral-800 text-neutral-400 hover:text-neutral-300"
    )}
    style={active ? { background: `${color}1f`, borderColor: `${color}55`, color } : undefined}
  >
    {label}
  </button>
));

/* ── Tool Palette Button ────────────────────────────────────────── */
const ToolBtn = memo(({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "w-7 h-7 flex items-center justify-center rounded transition-colors",
      active ? "bg-[rgba(124,58,237,0.18)] text-violet-300" : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
    )}
  >
    {children}
  </button>
));

/* ── Mobile timeline ────────────────────────────────────────────────
   Phones used to get a placeholder card reading "open on tablet or
   desktop", which put an apology where the product demo should be.
   This is the same DAW, reduced to what still reads at 375px:
   transport, ruler, and five colour-cycled tracks with clips. The
   file browser, mixer strip and tool palette are dropped on purpose —
   at this width they'd be illegible rather than informative. ─────── */
const MOBILE_BARS = 8;

/* [startBar, lengthBars] per lane, 0-indexed bars. */
const MOBILE_CLIPS: [number, number][][] = [
  [[0, 2], [3, 2]],
  [[1, 3], [5, 2]],
  [[0, 1], [2, 1], [4, 1], [6, 1]],
  [[2, 4]],
  [[0, 2], [6, 2]],
];

const MobileTimeline = memo(() => {
  const [playing, setPlaying] = useState(false);
  const laneRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (!playing || reduced) return;
    let af = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const width = laneRef.current?.clientWidth ?? 0;
      if (width > 0) {
        // 120 BPM, 4/4 -> one bar every 2s.
        const perBar = width / MOBILE_BARS;
        posRef.current = (posRef.current + (perBar / 2) * dt) % width;
        if (headRef.current) {
          headRef.current.style.transform = `translateX(${posRef.current}px)`;
        }
      }
      af = requestAnimationFrame(tick);
    };
    af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [playing, reduced]);

  const stop = () => {
    setPlaying(false);
    posRef.current = 0;
    if (headRef.current) headRef.current.style.transform = "translateX(0px)";
  };

  return (
    <div
      className="md:hidden rounded-xl border overflow-hidden"
      style={{ borderColor: C.border, background: C.bg }}
    >
      {/* Transport */}
      <div
        className="flex items-center gap-2 px-3 h-11 border-b"
        style={{ borderColor: C.border, background: C.bgSoft }}
      >
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="w-8 h-8 rounded flex items-center justify-center transition-colors"
          style={{
            background: playing ? C.primary : C.buttonBg,
            color: playing ? "#fff" : C.textDim,
          }}
        >
          {playing ? <Icon.Pause /> : <Icon.Play />}
        </button>
        <button
          onClick={stop}
          aria-label="Stop preview"
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ background: C.buttonBg, color: C.textDim }}
        >
          <Icon.Stop />
        </button>
        <span
          aria-hidden="true"
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ background: C.buttonBg, color: C.textOff }}
        >
          <Icon.Record />
        </span>
        <div className="ml-auto flex items-center gap-3 font-mono tabular-nums" style={{ color: C.textDim }}>
          <span className="text-[11px]">4/4</span>
          <span className="text-[11px]" style={{ color: C.text }}>120.00</span>
        </div>
      </div>

      {/* Ruler */}
      <div
        className="flex h-6 border-b"
        style={{ borderColor: C.border, background: C.bgSoft }}
        aria-hidden="true"
      >
        <div className="w-[68px] shrink-0 border-r" style={{ borderColor: C.border }} />
        <div className="flex-1 flex">
          {Array.from({ length: MOBILE_BARS }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-[9px] font-mono flex items-center pl-1.5 border-r last:border-r-0"
              style={{ color: C.textMuted, borderColor: C.divider }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Lanes */}
      <div className="relative">
        {MOBILE_CLIPS.map((clips, row) => {
          const color = TRACK_PALETTE[row % TRACK_PALETTE.length];
          return (
            <div
              key={row}
              className="flex h-11 border-b last:border-b-0"
              style={{ borderColor: C.divider }}
            >
              <div
                className="w-[68px] shrink-0 flex items-center gap-1.5 pl-0 pr-1.5 border-r"
                style={{ borderColor: C.border, background: C.bgSoft }}
              >
                <span className="w-[3px] self-stretch shrink-0" style={{ background: color, opacity: 0.85 }} />
                <span className="text-[10px] font-medium truncate" style={{ color }}>
                  Track {row + 1}
                </span>
              </div>
              <div className="relative flex-1">
                {/* bar grid */}
                <div className="absolute inset-0 flex" aria-hidden="true">
                  {Array.from({ length: MOBILE_BARS }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-r last:border-r-0"
                      style={{
                        borderColor: C.gridBeat,
                        background: i % 2 === 1 ? "rgba(255,255,255,0.018)" : "transparent",
                      }}
                    />
                  ))}
                </div>
                {clips.map(([start, len], i) => (
                  <div
                    key={i}
                    className="absolute top-1 bottom-1 rounded-[3px] overflow-hidden"
                    style={{
                      left: `${(start / MOBILE_BARS) * 100}%`,
                      width: `${(len / MOBILE_BARS) * 100}%`,
                      background: `${color}2e`,
                      borderLeft: `2px solid ${color}`,
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px" style={{ background: `${color}66` }} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Playhead — spans the lane block, offset past the name column */}
        <div className="absolute inset-y-0 left-[68px] right-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div ref={laneRef} className="relative w-full h-full">
            <div
              ref={headRef}
              className="absolute top-0 bottom-0 w-px"
              style={{ background: C.primaryHover, boxShadow: `0 0 6px ${C.primary}` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/* ── Main Component ─────────────────────────────────────────────── */
export const MockTimeline = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [bpm, setBpm] = useState("120.00");
  const [activeView, setActiveView] = useState<"timeline" | "mixer" | "arsenal" | "audition">("timeline");
  const [selectedFile, setSelectedFile] = useState(6);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedNav, setSelectedNav] = useState("Sounds");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["Sounds", "Packs", "User Library"]));
  const [tracks, setTracks] = useState(initialTracks);
  const [faders, setFaders] = useState<number[]>([66, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [selectedTool, setSelectedTool] = useState<Tool>("arrow");
  const [resetToken, setResetToken] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeTextRef = useRef<HTMLSpanElement>(null);
  const masterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scopeRef = useRef<SVGPolylineElement>(null);
  /* Set once the visitor pauses or stops, so scrolling back into view
     doesn't restart playback they deliberately ended. */
  const userPaused = useRef(false);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      userPaused.current = p;
      return !p;
    });
  }, []);

  const stopTransport = useCallback(() => {
    setIsPlaying(false);
    userPaused.current = true;
    setResetToken((n) => n + 1);
  }, []);

  const toggleMute = useCallback((id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, muted: !t.muted } : t));
  }, []);
  const toggleSolo = useCallback((id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, soloed: !t.soloed } : t));
  }, []);
  const toggleRecord = useCallback((id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, recording: !t.recording } : t));
  }, []);

  const toggleFolder = useCallback((name: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // Play while the preview is on screen, pause when it leaves, and never
  // override a visitor who paused it themselves.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mixer view meters (the timeline drives its own from the session)
  useEffect(() => {
    if (!isPlaying || activeView !== "mixer") return;
    const interval = setInterval(() => {
      setTracks(prev => prev.map((t, i) => {
        const isLead = t.soloed || (i === 0 && !prev.some(p => p.soloed));
        return isLead && !t.muted
          ? { ...t, meter: 50 + Math.random() * 35, db: `-${(4 + Math.random() * 5).toFixed(1)} dB` }
          : { ...t, meter: Math.random() * (t.muted ? 0 : 12), db: `-${(40 + Math.random() * 20).toFixed(1)} dB` };
      }));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying, activeView]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      else if (e.key === "r" || e.key === "R") setIsRecording(v => !v);
      else if (e.key === "m" || e.key === "M") {
        const t = tracksRef.current[selectedTrack];
        if (t) toggleMute(t.id);
      }
      else if (e.key === "s" || e.key === "S") {
        const t = tracksRef.current[selectedTrack];
        if (t) toggleSolo(t.id);
      }
      else if (e.key === "1") setSelectedTool("select");
      else if (e.key === "2") setSelectedTool("cut");
      else if (e.key === "3") setSelectedTool("paint");
      else if (e.key === "4") setSelectedTool("erase");
      else if (e.key === "Escape") stopTransport();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedTrack, toggleMute, toggleSolo, togglePlay, stopTransport]);

  return (
    <div ref={rootRef} className="w-full max-w-7xl mx-auto relative px-0 sm:px-2">
      <MobileTimeline />

      {/* Full DAW preview */}
      <div className="hidden md:block w-full">
        <div className="relative w-full overflow-hidden rounded-xl border border-[rgba(124,58,237,0.28)] bg-[#050505] shadow-2xl">
          {/* ── Title bar ── */}
          <TitleBar view={activeView} onView={setActiveView} />

          {/* ── Timeline view: transport, library, lanes ── */}
          {activeView === "timeline" && (
            <div className="flex flex-col">
              <TransportBar
                playing={isPlaying}
                recording={isRecording}
                onPlay={togglePlay}
                onStop={stopTransport}
                onRecord={() => setIsRecording((v) => !v)}
                bpm={bpm}
                onBpm={setBpm}
                onView={setActiveView}
                timeTextRef={timeTextRef}
                masterRefs={masterRefs}
                scopeRef={scopeRef}
              />
              <div className="flex" style={{ height: SESSION_LANES_HEIGHT }}>
                <LibraryPanel />
                <div className="flex-1 min-w-0">
                  <SessionLanes
                    playing={isPlaying}
                    bpm={parseFloat(bpm) || 120}
                    tracks={tracks}
                    selectedTrack={selectedTrack}
                    onSelectTrack={setSelectedTrack}
                    resetToken={resetToken}
                    timeTextRef={timeTextRef}
                    masterRefs={masterRefs}
                    scopeRef={scopeRef}
                    toolbar={<ToolRow tool={selectedTool} onTool={setSelectedTool} />}
                    headerControls={(track) => (
                      <TrackButtons
                        muted={track.muted}
                        soloed={track.soloed}
                        armed={!!tracks.find((t) => t.id === track.id)?.recording}
                        onMute={() => toggleMute(track.id)}
                        onSolo={() => toggleSolo(track.id)}
                        onArm={() => toggleRecord(track.id)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Mixer View ───────────────────────────────────── */}
          {activeView === "mixer" && (
            <div className="h-[440px] lg:h-[560px] bg-[#0a0a0a] flex flex-col">
              <div className="border-b border-[#212121] bg-[#191919] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Mixer
              </div>
              <div className="flex-1 flex overflow-x-auto p-3 gap-1.5">
                {tracks.slice(0, 8).map((track, i) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(i)}
                    className={cn(
                      "flex flex-col rounded-[8px] border bg-[#141414] w-[90px] lg:w-[100px] flex-shrink-0 transition-colors cursor-pointer",
                      selectedTrack === i ? "border-[rgba(124,58,237,0.34)]" : "border-[#212121] hover:border-[#2b2b2b]",
                    )}
                  >
                    <div className="h-1 rounded-t-[8px]" style={{ background: track.color }} />
                    <div className="px-2 py-1.5 text-center">
                      <div className="text-[10px] text-white truncate">{track.name}</div>
                      <div className="text-[8px] text-neutral-400">Out: Master</div>
                    </div>
                    <div className="flex justify-center gap-1 px-2 py-1">
                      <MSR label="M" active={track.muted} color={C.warning} onClick={() => toggleMute(track.id)} />
                      <MSR label="S" active={track.soloed} color={C.success} onClick={() => toggleSolo(track.id)} />
                      <MSR label="R" active={track.recording} color={C.error} onClick={() => toggleRecord(track.id)} />
                    </div>
                    <div className="mx-2 mb-1.5 rounded-md border border-[#2b2b2b] bg-[#0a0a0a] py-1 text-center text-[8px] text-neutral-400">
                      + Insert
                    </div>
                    <div className="flex justify-center py-1">
                      <div className="w-6 h-6 rounded-full border border-[#2b2b2b] bg-[#212121] relative">
                        <div className="absolute top-0.5 left-1/2 w-px h-2 -translate-x-1/2 rounded-full" style={{ background: C.primary }} />
                      </div>
                    </div>
                    <div className="text-center text-[7px] text-neutral-400">0.0</div>
                    <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-2 pt-3">
                      <div className="text-[8px] text-neutral-400 self-end pb-1">{track.db}</div>
                      <div className="relative w-4 h-[140px] rounded-sm overflow-hidden" style={{ background: "rgba(35,35,35,0.60)" }}>
                        <div className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-100" style={{
                          height: `${track.meter}%`,
                          background: `linear-gradient(180deg, ${track.meter > 85 ? C.error : track.meter > 60 ? C.warning : C.primary}, ${C.cyan})`,
                        }} />
                      </div>
                      <div className="relative w-5 h-[140px] rounded-[3px]" style={{ background: "rgba(8,8,8,0.60)" }}>
                        <div
                          className="absolute left-0.5 right-0.5 rounded-sm transition-all"
                          style={{
                            bottom: `${faders[i] || 0}%`,
                            height: 14,
                            background: C.surface,
                            border: `1px solid ${C.outline}`,
                            boxShadow: `0 0 4px ${C.primary}40`,
                          }}
                        >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2.5 h-[2px] rounded-full" style={{ background: C.primary }} />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[rgba(43,43,43,0.36)] py-1 text-center text-[8px] text-neutral-400">
                      {track.id}
                    </div>
                  </div>
                ))}

                {/* Master strip */}
                <div className="flex flex-col rounded-[8px] border border-[rgba(124,58,237,0.34)] bg-[rgba(43,43,43,0.78)] w-[110px] lg:w-[120px] flex-shrink-0 ml-2">
                  <div className="h-1 rounded-t-[8px]" style={{ background: C.primary }} />
                  <div className="px-2 py-1.5 text-center">
                    <div className="text-[11px] font-semibold text-white">MASTER</div>
                    <div className="text-[8px] text-neutral-400">Output</div>
                  </div>
                  <div className="mx-2 mb-1.5 rounded-md border border-[#2b2b2b] bg-[#0a0a0a] py-1 text-center text-[8px] text-neutral-400">
                    + Insert
                  </div>
                  <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-2 pt-3">
                    <div className="text-[8px] text-neutral-400 self-end pb-1">-8.0 dB</div>
                    <div className="relative w-5 h-[160px] rounded-sm overflow-hidden" style={{ background: "rgba(35,35,35,0.60)" }}>
                      <div className="absolute bottom-0 left-0 right-0 rounded-sm" style={{
                        height: "82%",
                        background: `linear-gradient(180deg, ${C.primary}, ${C.cyan})`,
                      }} />
                    </div>
                    <div className="relative w-6 h-[160px] rounded-[3px]" style={{ background: "rgba(8,8,8,0.60)" }}>
                      <div className="absolute left-0.5 right-0.5 rounded-sm" style={{
                        bottom: "66%", height: 14, background: C.surface,
                        border: `1px solid ${C.outline}`, boxShadow: `0 0 4px ${C.primary}40`,
                      }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full" style={{ background: C.primary }} />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[rgba(43,43,43,0.36)] py-1 text-center text-[8px] text-neutral-400">M</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Arsenal View ─────────────────────────────────── */}
          {activeView === "arsenal" && (
            <div className="h-[440px] lg:h-[560px] bg-[#0a0a0a] flex items-center justify-center">
              <div className="w-[90%] max-w-[480px] rounded-[12px] border border-[#2b2b2b] bg-[#191919] p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3 text-white">
                  <Icon.Arsenal />
                  <span className="text-sm tracking-[0.22em] uppercase">Arsenal</span>
                </div>
                <p className="mx-auto mb-5 max-w-sm text-center text-[12px] text-neutral-400">
                  Pattern engines and source modules live here.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {["808", "Hats", "Clap", "Snare", "Keys", "Pad", "Lead", "FX"].map((name, i) => (
                    <div key={name} className="rounded-lg border border-[#2b2b2b] bg-[#0a0a0a] p-2.5 text-center">
                      <div className="mb-1 text-[8px] uppercase tracking-[0.18em]" style={{ color: C.cyan }}>{i < 4 ? "Drum" : "Unit"}</div>
                      <div className="text-[11px] text-white">{name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Audition View ────────────────────────────────── */}
          {activeView === "audition" && (
            <div className="h-[440px] lg:h-[560px] bg-[#0a0a0a] flex flex-col">
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-[420px] rounded-[12px] border border-[#2b2b2b] bg-[#191919] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(124,58,237,0.34)] bg-[rgba(124,58,237,0.10)]">
                    <Icon.PianoRoll />
                  </div>
                  <div className="mb-1.5 text-sm text-white">Audition</div>
                  <p className="mb-4 text-[11px] text-neutral-400">
                    Translation listening — preview your mix through common listening profiles.
                  </p>
                  <div className="rounded-lg border border-[#2b2b2b] bg-[#0a0a0a] p-3">
                    <svg className="h-10 w-full" viewBox="0 0 300 36" preserveAspectRatio="none">
                      <polyline
                        points={audioPoints(7, 100, 12)}
                        fill="none" stroke={C.primary} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {["Studio", "Spotify", "Apple Music", "AirPods", "Car", "Phone"].map(p => (
                      <span key={p} className="rounded-full border border-[#2b2b2b] bg-[#0a0a0a] px-2.5 py-0.5 text-[9px] text-neutral-400">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
