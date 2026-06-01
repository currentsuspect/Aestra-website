import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { cn } from "../lib";

/* ── Native Palette (from NUIThemeSystem.cpp) ───────────────────── */
const C = {
  bg: "#0d0d12",
  bgSoft: "#111116",
  surface: "#16161e",
  raised: "#1e1e28",
  border: "#1e1e28",
  outline: "#2a2a36",
  text: "rgba(255,255,255,0.90)",
  textDim: "rgba(255,255,255,0.50)",
  textMuted: "rgba(255,255,255,0.25)",
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

const TRACK_COLORS = [
  "#7c3aed", // Track 1 - violet (primary)
  "#2dd4bf", // Track 2 - teal (the audio track)
  "#71717a", "#71717a", "#71717a", // pattern tracks (muted)
  "#71717a", "#71717a", "#71717a", "#71717a", "#71717a", "#71717a",
];

type Tool = "select" | "cut" | "loop" | "paint" | "arrow" | "erase";

const TRACK_LAYOUT: { name: string; kind: "pattern" | "audio" }[] = [
  { name: "Track1",  kind: "pattern" },
  { name: "Track2",  kind: "audio" },
  { name: "Track3",  kind: "pattern" },
  { name: "Track4",  kind: "pattern" },
  { name: "Track5",  kind: "pattern" },
  { name: "Track6",  kind: "pattern" },
  { name: "Track7",  kind: "pattern" },
  { name: "Track8",  kind: "pattern" },
  { name: "Track9",  kind: "pattern" },
  { name: "Track10", kind: "pattern" },
  { name: "Track11", kind: "pattern" },
];

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
  ]},
];

const FILES = [
  { name: "Baby Keem - Ca$ino.flac", kind: "FLAC", size: "28 MB" },
  { name: "Bktherula - CODE.flac", kind: "FLAC", size: "19 MB" },
  { name: "Che - Promoting Violence.flac", kind: "FLAC", size: "17 MB" },
  { name: "PlaqueBoyMax - Super Wrong.flac", kind: "FLAC", size: "12 MB" },
  { name: "PlaqueBoyMax - Yellow Lamb Truck.flac", kind: "FLAC", size: "10 MB" },
  { name: "Rapsody - Black Popstar.flac", kind: "FLAC", size: "14 MB" },
  { name: "SLAYR - Flashout Freestyle.flac", kind: "FLAC", size: "23 MB" },
  { name: "SoFaygo - MM3.flac", kind: "FLAC", size: "19 MB" },
  { name: "Travis Scott - HOUSTONFORNICATION.flac", kind: "FLAC", size: "24 MB" },
  { name: "Travis Scott - NO BYSTANDERS.flac", kind: "FLAC", size: "25 MB" },
  { name: "Travis Scott - SHYNE.flac", kind: "FLAC", size: "21 MB" },
  { name: "Yeat - Purpose General.flac", kind: "FLAC", size: "21 MB" },
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
const fmt = (t: number) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const cs = Math.floor((t % 1) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

// Deterministic waveform generator (per-track seed)
const wavePoints = (seed: number, count: number, amp = 10) => {
  return Array.from({ length: count }, (_, i) => {
    const x = (i / (count - 1)) * 200;
    const y = 14 + Math.sin(i * 0.42 + seed) * amp * Math.cos(i * 0.13 + seed * 0.7) * (0.6 + Math.sin(i * 0.08 + seed) * 0.4);
    return `${x},${y}`;
  }).join(" ");
};

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
      active && !isError && "bg-zinc-800 text-zinc-100",
      isError && "bg-rose-500/15 text-rose-400",
      !active && !isError && "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60",
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
      active ? "" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
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
      active ? "bg-[rgba(124,58,237,0.18)] text-violet-300" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
    )}
  >
    {children}
  </button>
));

/* ── Main Component ─────────────────────────────────────────────── */
export const MockTimeline = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [time, setTime] = useState(0);
  const [bpm, setBpm] = useState("120.00");
  const [activeView, setActiveView] = useState<"timeline" | "mixer" | "arsenal" | "audition">("timeline");
  const [selectedFile, setSelectedFile] = useState(6);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedNav, setSelectedNav] = useState("Sounds");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["Sounds", "Packs", "User Library"]));
  const [tracks, setTracks] = useState(initialTracks);
  const [faders, setFaders] = useState<number[]>([66, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [selectedTool, setSelectedTool] = useState<Tool>("paint");
  const [hoveredClip, setHoveredClip] = useState<string | null>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const playheadPos = useRef(190);
  const containerRef = useRef<HTMLDivElement>(null);
  const tracksContainerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;

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

  // Playhead animation — moves at BPM-synced rate
  useEffect(() => {
    let af = 0;
    let last = 0;
    let lastStateUpdate = 0;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      if (containerRef.current && isPlaying) {
        const w = containerRef.current.offsetWidth;
        const maxX = w - 80;
        // ~94px/s at 120bpm scaled to actual bpm
        const bpmNum = parseFloat(bpm) || 120;
        const speed = 94 * (bpmNum / 120);
        const next = playheadPos.current + speed * dt;
        if (next > maxX) {
          playheadPos.current = 190;
          timeRef.current = 0;
        } else {
          playheadPos.current = next;
          timeRef.current += dt;
        }
        if (playheadRef.current) playheadRef.current.style.transform = `translateX(${playheadPos.current}px)`;
        if (ts - lastStateUpdate > 100) {
          lastStateUpdate = ts;
          setTime(timeRef.current);
        }
        af = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [isPlaying, bpm]);

  // Meter animation when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTracks(prev => prev.map((t, i) => {
        const isLead = t.soloed || (i === 0 && !prev.some(p => p.soloed));
        return isLead && !t.muted
          ? { ...t, meter: 50 + Math.random() * 35, db: `-${(4 + Math.random() * 5).toFixed(1)} dB` }
          : { ...t, meter: Math.random() * (t.muted ? 0 : 12), db: `-${(40 + Math.random() * 20).toFixed(1)} dB` };
      }));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); setIsPlaying(p => !p); }
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
      else if (e.key === "Escape") { setIsPlaying(false); timeRef.current = 0; setTime(0); playheadPos.current = 190; if (playheadRef.current) playheadRef.current.style.transform = "translateX(190px)"; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedTrack, toggleMute, toggleSolo]);

  // Click on ruler/timeline to move playhead
  const onTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tracksContainerRef.current) return;
    const rect = tracksContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + tracksContainerRef.current.scrollLeft;
    const newX = Math.max(190, Math.min(rect.width - 80, x));
    playheadPos.current = newX;
    if (playheadRef.current) playheadRef.current.style.transform = `translateX(${newX}px)`;
  }, []);

  // Clip layout for the arrangement overview (top strip) — uses a vibrant palette for the mini-map
  const OVERVIEW_PALETTE = [
    "#7c3aed", "#2dd4bf", "#3b82f6", "#a78bfa", "#60a5fa",
    "#2dd4bf", "#f472b6", "#fb923c", "#facc15", "#a3e635", "#22d3ee",
  ];
  const overviewClips = useMemo(() => TRACK_LAYOUT.map((t, i) => {
    const segments: { start: number; width: number; color: string }[] = [];
    let x = 4 + (i * 1.3) % 12;
    for (let k = 0; k < 4 + (i % 3); k++) {
      const w = 6 + (i * 3 + k * 5) % 12;
      segments.push({ start: x, width: w, color: OVERVIEW_PALETTE[i % OVERVIEW_PALETTE.length] });
      x += w + 1 + (k % 2);
    }
    return segments;
  }), []);

  // Clip layout for the main tracks
  const trackClips = useMemo(() => TRACK_LAYOUT.map((t, i) => {
    if (t.kind === "audio") {
      return [
        { id: `${i}-a`, start: 1, width: 30, label: "@vagorose — percloop — itsok" },
        { id: `${i}-b`, start: 32, width: 28, label: "@vagorose — percloop — itsok" },
      ];
    }
    return [
      { id: `${i}-p1`, start: 1, width: 12, label: `pattern_${i}` },
      { id: `${i}-p2`, start: 14, width: 14, label: `pattern_${i}` },
      { id: `${i}-p3`, start: 29, width: 11, label: `pattern_${i}` },
      { id: `${i}-p4`, start: 41, width: 9, label: `pattern_${i}` },
    ];
  }), []);

  const selectedFileDuration = "174.3s";
  const selectedFileBase = FILES[selectedFile].name.replace(".flac", "").slice(0, 22);

  return (
    <div className="mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl mx-auto relative px-0 sm:px-2">
      {/* Mobile fallback */}
      <div className="md:hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3 text-zinc-400">
          <Icon.Timeline />
          <span className="text-xs">Aestra preview</span>
        </div>
        <p className="text-sm text-zinc-500">Interactive editor — open on tablet or desktop for the full experience.</p>
      </div>

      {/* Full DAW preview */}
      <div className="hidden md:block w-full">
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          {/* ── Title Bar (File menu | Tabs | Account + Window) ── */}
          <div className="h-10 border-b border-zinc-800 bg-zinc-900/60 px-3 flex items-center justify-between">
            {/* Left: File menu */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-500 min-w-[200px]">
              <button className="hover:text-zinc-200 transition-colors">File</button>
              <button className="hover:text-zinc-200 transition-colors">Edit</button>
              <button className="hover:text-zinc-200 transition-colors">View</button>
              <button className="hover:text-zinc-200 transition-colors">Help</button>
            </div>

            {/* Center: Tabs (Arsenal / Timeline / Audition) */}
            <div className="flex items-center gap-0.5">
              {([
                { id: "arsenal"  as const, label: "Arsenal",  icon: Icon.Arsenal,    key: "F6" },
                { id: "timeline" as const, label: "Timeline", icon: Icon.Timeline,   key: "F5" },
                { id: "audition" as const, label: "Audition", icon: Icon.PianoRoll,  key: "" },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  title={`${tab.label}${tab.key ? ` (${tab.key})` : ""}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] transition-colors",
                    activeView === tab.id
                      ? "bg-violet-500/25 text-violet-200 border border-violet-500/35"
                      : "text-zinc-500 hover:text-zinc-200 border border-transparent"
                  )}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Right: Account + Core + window controls */}
            <div className="flex items-center gap-2 text-[10px] min-w-[200px] justify-end">
              <span className="text-zinc-500">Signed out</span>
              <span className="px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-violet-300 font-medium">Core</span>
              <div className="flex items-center gap-0.5 ml-2">
                <button title="Minimize" className="w-6 h-6 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 flex items-center justify-center">
                  <Icon.Minimize />
                </button>
                <button title="Maximize" className="w-6 h-6 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 flex items-center justify-center">
                  <Icon.Maximize />
                </button>
                <button title="Close" className="w-6 h-6 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 flex items-center justify-center">
                  <Icon.Close />
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────── */}
          {activeView === "timeline" && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Row 1: Transport (left) + view icons + master fader (right) — full width */}
              <div className="h-9 border-b border-[#1e1e28] bg-[#0d0d12] px-2 flex items-center gap-2 shrink-0">
                {/* Transport cluster (left) */}
                <div className="flex items-center h-7 gap-0.5 rounded-md border border-[#2a2a36] bg-[#0a0a0e] px-1.5">
                  <button
                    onClick={() => setIsPlaying(v => !v)}
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center transition-colors",
                      isPlaying ? "bg-violet-500 text-white" : "text-zinc-300 hover:bg-[rgba(255,255,255,0.06)]"
                    )}
                    title="Play / Pause (Space)"
                  >
                    {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      playheadPos.current = 190;
                      timeRef.current = 0;
                      setTime(0);
                      if (playheadRef.current) playheadRef.current.style.transform = "translateX(190px)";
                    }}
                    className="w-7 h-7 rounded flex items-center justify-center text-zinc-300 hover:bg-[rgba(255,255,255,0.06)]"
                    title="Stop"
                  >
                    <Icon.Stop />
                  </button>
                  <button
                    onClick={() => setIsRecording(v => !v)}
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center transition-colors",
                      isRecording ? "bg-red-500 text-white" : "text-zinc-300 hover:bg-[rgba(255,255,255,0.06)]"
                    )}
                    title="Record"
                  >
                    <Icon.Record />
                  </button>
                  <div className="w-px h-4 bg-[#2a2a36] mx-1" />
                  <button
                    onClick={() => setMetronomeOn(v => !v)}
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center text-[12px] font-mono transition-colors",
                      metronomeOn ? "bg-violet-500/20 text-violet-300" : "text-zinc-500 hover:bg-[rgba(255,255,255,0.06)]"
                    )}
                    title="Metronome"
                  >
                    ♩
                  </button>
                  <button
                    className="w-7 h-7 rounded flex items-center justify-center text-zinc-500 hover:bg-[rgba(255,255,255,0.06)]"
                    title="Loop region"
                  >
                    <span className="text-[12px]">⌛</span>
                  </button>
                  <button
                    className="w-7 h-7 rounded flex items-center justify-center text-zinc-500 hover:bg-[rgba(255,255,255,0.06)]"
                    title="Accent"
                  >
                    <span className="text-[12px]">●</span>
                  </button>
                  <div className="w-px h-4 bg-[#2a2a36] mx-1" />
                  <span className="text-[10px] text-zinc-400 font-mono tabular-nums px-1.5">4 / 4</span>
                  <div className="w-px h-4 bg-[#2a2a36] mx-1" />
                  <div className="flex flex-col items-center justify-center h-7 w-[64px] rounded border border-[#2a2a36] bg-[#0a0a0e] px-1">
                    <span className="text-[7px] text-zinc-600 font-mono uppercase tracking-wider leading-none">BPM</span>
                    <input
                      type="number"
                      value={bpm}
                      onChange={e => {
                        const n = Number(e.target.value);
                        if (!Number.isNaN(n)) setBpm(String(Math.max(40, Math.min(300, n))));
                      }}
                      className="w-full bg-transparent text-[10px] text-zinc-200 font-mono tabular-nums outline-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none leading-none"
                    />
                  </div>
                  <div className="flex items-center justify-center h-7 w-[64px] rounded border border-[#2a2a36] bg-[#0a0a0e]">
                    <span className="text-[10px] text-zinc-200 font-mono tabular-nums">0:00.00</span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* View icons (4 small icons matching native DAW) */}
                <div className="flex items-center gap-0.5 rounded-md border border-[#2a2a36] bg-[#0a0a0e] p-0.5">
                  <button
                    className="w-7 h-7 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                    title="Tree"
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="5" rx="0.6" />
                      <rect x="3" y="10" width="18" height="5" rx="0.6" />
                      <rect x="3" y="17" width="18" height="4" rx="0.6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveView("arsenal")}
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center transition-colors",
                      activeView === "arsenal"
                        ? "bg-[rgba(124,58,237,0.20)] text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-[rgba(255,255,255,0.04)]"
                    )}
                    title="Arsenal"
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveView("timeline")}
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center transition-colors",
                      activeView === "timeline"
                        ? "bg-[rgba(124,58,237,0.20)] text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-[rgba(255,255,255,0.04)]"
                    )}
                    title="Timeline"
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="6" x2="4" y2="18" />
                      <line x1="9" y1="6" x2="9" y2="18" />
                      <line x1="14" y1="6" x2="14" y2="18" />
                      <line x1="19" y1="6" x2="19" y2="18" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveView("audition")}
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center transition-colors",
                      activeView === "audition"
                        ? "bg-[rgba(124,58,237,0.20)] text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-[rgba(255,255,255,0.04)]"
                    )}
                    title="List"
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Master fader */}
                <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-[#2a2a36] h-6">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">M</span>
                  <div className="w-16 h-1.5 rounded-full bg-[#1e1e28] relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500" style={{ width: "72%" }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-3 rounded-sm bg-white shadow" style={{ left: "calc(72% - 4px)" }} />
                  </div>
                  <span className="text-[9px] text-zinc-400 font-mono tabular-nums w-7 text-right">-3.2</span>
                </div>
              </div>

              {/* Row 2: Tool palette (full width) */}
              <div className="h-8 border-b border-[#1e1e28] bg-[#0d0d12] px-2 flex items-center gap-1 shrink-0">
                <ToolBtn active={selectedTool === "select"} onClick={() => setSelectedTool("select")} title="Select (1)"><Icon.Cursor /></ToolBtn>
                <ToolBtn active={selectedTool === "cut"}    onClick={() => setSelectedTool("cut")}    title="Cut (2)"><Icon.Scissors /></ToolBtn>
                <ToolBtn active={selectedTool === "loop"}   onClick={() => setSelectedTool("loop")}   title="Loop"><Icon.Loop /></ToolBtn>
                <ToolBtn active={selectedTool === "paint"}  onClick={() => setSelectedTool("paint")}  title="Paint (3)"><Icon.Paint /></ToolBtn>
                <ToolBtn active={selectedTool === "arrow"}  onClick={() => setSelectedTool("arrow")}  title="Arrow"><Icon.Arrow /></ToolBtn>
                <ToolBtn active={selectedTool === "erase"}  onClick={() => setSelectedTool("erase")}  title="Erase (4)"><Icon.Eraser /></ToolBtn>
              </div>

              {/* File browser + tracks row */}
              <div className="flex-1 flex min-h-0">
                {/* File Browser Sidebar (Track Manager) */}
                <div className="w-[220px] lg:w-[260px] border-r border-[#1e1e28] bg-[#0f0f14] flex flex-col shrink-0">
                {/* Search */}
                <div className="p-2">
                  <label className="flex items-center gap-2 rounded-md border border-[#2a2a36] bg-[#0d0d12] px-2.5 py-1.5 text-[11px] text-zinc-500 focus-within:border-[#3a3a46] transition-colors">
                    <Icon.Search />
                    <span>Search library...</span>
                    <span className="ml-auto text-[9px] text-zinc-600 font-mono">⌘K</span>
                  </label>
                </div>

                {/* Nav pane + File list split */}
                <div className="flex flex-1 min-h-0">
                  {/* Navigation pane */}
                  <div className="w-[88px] lg:w-[100px] border-r border-[rgba(30,30,40,0.36)] bg-[rgba(9,10,12,0.5)] overflow-y-auto">
                    {NAV_TREE.map(section => (
                      <div key={section.section}>
                        <div className="px-2 pt-3 pb-1 text-[8px] uppercase tracking-[0.14em] text-zinc-600">{section.section}</div>
                        {section.items.map(item => {
                          const expanded = expandedFolders.has(item.name);
                          return (
                            <button
                              key={item.name}
                              onClick={() => { setSelectedNav(item.name); if (item.type === "folder") toggleFolder(item.name); }}
                              className={cn(
                                "w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-left transition-colors",
                                selectedNav === item.name
                                  ? "bg-[rgba(124,58,237,0.10)] text-white"
                                  : "text-zinc-500 hover:bg-[rgba(255,255,255,0.035)]"
                              )}
                            >
                              {item.type === "folder" ? (
                                <Icon.ChevronRight />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color || "#52525b" }} />
                              )}
                              <span className="truncate">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* File list */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-2.5 py-1.5 border-b border-[rgba(30,30,40,0.36)] flex items-center gap-1 text-[9px] text-zinc-500">
                      <span>Aestra</span>
                      <Icon.ChevronRight />
                      <span className="text-zinc-300">Current Project</span>
                      <span className="ml-auto"><Icon.ChevronRight /></span>
                    </div>
                    <div className="px-2.5 py-1 border-b border-[rgba(30,30,40,0.24)] text-[8px] uppercase tracking-[0.14em] text-zinc-600">Name</div>
                    <div className="flex-1 overflow-y-auto">
                      {/* Show folder children when expanded */}
                      {selectedNav === "Current Project" && (
                        <div className="border-b border-[rgba(30,30,40,0.24)] py-1">
                          {[
                            { name: "01. cycler sample pack", type: "folder" },
                            { name: "02. cycler elements.", type: "folder" },
                            { name: "03. textures + acou...", type: "folder" },
                            { name: "04. midi", type: "folder" },
                            { name: "05. vocals", type: "folder" },
                            { name: "06. percloops", type: "folder" },
                          ].map(sub => {
                            const exp = expandedFolders.has(sub.name);
                            return (
                              <button
                                key={sub.name}
                                onClick={() => toggleFolder(sub.name)}
                                className="w-full flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-zinc-400 hover:bg-[rgba(255,255,255,0.04)] text-left"
                              >
                                <span className={cn("transition-transform", exp && "rotate-90")}><Icon.ChevronRight /></span>
                                <Icon.Folder />
                                <span className="truncate">{sub.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {selectedNav === "Sounds" && (
                        <div className="py-1">
                          <button
                            onClick={() => toggleFolder("Packs")}
                            className={cn(
                              "w-full flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-left transition-colors",
                              "bg-[rgba(124,58,237,0.18)] text-white"
                            )}
                          >
                            <span className={cn("transition-transform", expandedFolders.has("Packs") && "rotate-90")}><Icon.ChevronRight /></span>
                            <Icon.Folder />
                            <span className="truncate">Packs</span>
                          </button>
                          {expandedFolders.has("Packs") && (
                            <div>
                              <button
                                onClick={() => toggleFolder("User Library")}
                                className="w-full flex items-center gap-1.5 pl-6 pr-2.5 py-1 text-[10px] text-zinc-300 hover:bg-[rgba(255,255,255,0.04)] text-left"
                              >
                                <span className={cn("transition-transform", expandedFolders.has("User Library") && "rotate-90")}><Icon.ChevronRight /></span>
                                <Icon.Folder />
                                <span className="truncate">User Library</span>
                              </button>
                              {expandedFolders.has("User Library") && FILES.map((file, i) => (
                                <button
                                  key={file.name}
                                  onClick={() => setSelectedFile(i)}
                                  className={cn(
                                    "w-full flex items-center gap-2 pl-9 pr-2.5 py-1 text-[10px] text-left transition-colors truncate",
                                    selectedFile === i
                                      ? "bg-[rgba(124,58,237,0.14)] text-white"
                                      : "text-zinc-400 hover:bg-[rgba(255,255,255,0.04)]",
                                  )}
                                >
                                  <Icon.Audio />
                                  <span className="truncate flex-1">{file.name}</span>
                                  <span className="text-[8px] text-zinc-600 flex-shrink-0">{file.size}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {selectedNav !== "Current Project" && selectedNav !== "Sounds" && FILES.map((file, i) => (
                        <button
                          key={file.name}
                          onClick={() => setSelectedFile(i)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1 text-[10px] text-left transition-colors truncate",
                            selectedFile === i
                              ? "bg-[rgba(124,58,237,0.14)] text-white"
                              : "text-zinc-400 hover:bg-[rgba(255,255,255,0.04)]",
                          )}
                        >
                          <Icon.Audio />
                          <span className="truncate flex-1">{file.name}</span>
                          <span className="text-[8px] text-zinc-600 flex-shrink-0">{file.size}</span>
                        </button>
                      ))}
                    </div>
                    {/* Now Playing card */}
                    <div className="border-t border-[rgba(30,30,40,0.36)] p-2 bg-[#0a0a0e]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlaying(v => !v)}
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                            isPlaying ? "bg-violet-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          )}
                        >
                          {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] text-zinc-200 truncate leading-tight">{FILES[selectedFile].name}</div>
                          <div className="text-[8px] text-zinc-500 mt-0.5 font-mono">85 BPM · 0:00 / 0:00</div>
                        </div>
                      </div>
                      <div className="mt-1.5 rounded-md border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.06)] p-1.5">
                        <svg className="h-7 w-full" viewBox="0 0 200 28" preserveAspectRatio="none">
                          <polyline
                            points={audioPoints(selectedFile, 80)}
                            fill="none" stroke={C.primary} strokeWidth="1.4" vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrangement Area */}
              <div className="flex-1 flex flex-col min-w-0" ref={containerRef}>
                {/* Arrangement overview (multi-color strip) */}
                <div className="h-5 border-b border-[#1e1e28] bg-[#0a0a0e] px-0 relative">
                  <div className="absolute left-[190px] right-3 top-1 bottom-1">
                    {overviewClips.map((segs, i) => (
                      <div key={i} className="absolute h-1.5" style={{ top: 1 + (i % 3) * 4, left: `${segs[0].start * 1.6}%`, right: 0 }}>
                        {segs.map((s, k) => (
                          <span key={k} className="absolute h-full rounded-[1px]" style={{ left: `${(s.start / 100) * 100}%`, width: `${s.width * 0.6}%`, background: s.color, opacity: 0.65 }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection / loop region bar (purple) */}
                <div className="h-5 border-b border-[#1e1e28] bg-[#0a0a0e] px-0 relative">
                  <div className="absolute left-[190px] right-3 top-1 bottom-1">
                    <div
                      className="absolute h-full rounded-[3px] flex items-center"
                      style={{
                        left: "8%",
                        width: "72%",
                        background: "linear-gradient(180deg, rgba(124,58,237,0.55) 0%, rgba(124,58,237,0.30) 100%)",
                        border: "1px solid rgba(167,139,250,0.55)",
                        boxShadow: "0 0 10px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
                      }}
                    >
                      <span className="absolute left-1.5 top-0.5 text-[7px] text-violet-100/80 font-mono uppercase tracking-wider">Selection · 1. 1. 1 — 11. 1. 1</span>
                      <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-2.5 rounded-[1px] bg-violet-200/90" />
                      <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-2.5 rounded-[1px] bg-violet-200/90" />
                    </div>
                  </div>
                </div>

                {/* Ruler */}
                <div className="relative h-7 border-b border-[rgba(30,30,40,0.64)] bg-[#0f0f14] px-0">
                  <div
                    onClick={onTimelineClick}
                    className="absolute left-[190px] right-3 top-0 bottom-0 flex items-end cursor-pointer"
                  >
                    {Array.from({ length: 13 }, (_, i) => (
                      <div key={i} className="flex-1 relative">
                        <div className={cn(
                          "absolute bottom-0 w-px",
                          i % 4 === 0 ? "h-full" : "h-2"
                        )} style={{ background: i % 4 === 0 ? C.gridBar : C.gridBeat }} />
                        <span className={cn(
                          "absolute bottom-0.5 left-1 text-[9px] font-mono tabular-nums",
                          i % 4 === 0 ? "text-zinc-400" : "text-zinc-600"
                        )}>{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracks + Grid */}
                <div ref={tracksContainerRef} className="flex-1 relative overflow-y-auto bg-[#0a0a0e]" onClick={onTimelineClick}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 left-[190px] right-0 pointer-events-none">
                    {Array.from({ length: 80 }, (_, i) => (
                      <div key={i} className="absolute top-0 bottom-0 w-px" style={{
                        left: `${(i / 80) * 100}%`,
                        background: i % 4 === 0 ? C.gridBar : C.gridBeat,
                      }} />
                    ))}
                  </div>

                      {/* Track rows */}
                  {tracks.map((track, idx) => {
                    const y = idx * 36;
                    const clips = trackClips[idx] || [];
                    const isAudioTrack = TRACK_LAYOUT[idx]?.kind === "audio";
                    const isPrimaryTrack = idx === 0;
                    const trackTextColor = isPrimaryTrack ? "#60a5fa" : isAudioTrack ? "#2dd4bf" : "#a1a1aa";
                    return (
                      <div key={track.id} className="absolute inset-x-0 flex" style={{ top: y, height: 36 }}>
                        {/* Track header */}
                        <div
                          onClick={(e) => { e.stopPropagation(); setSelectedTrack(idx); }}
                          className="w-[190px] border-r border-[rgba(30,30,40,0.48)] bg-[#111118] flex items-center relative flex-shrink-0 cursor-pointer transition-colors hover:bg-[#16161e]"
                          style={selectedTrack === idx ? { background: "rgba(124,58,237,0.08)" } : undefined}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: track.color, opacity: selectedTrack === idx ? 0.9 : 0.4 }} />
                          <div className="flex items-center justify-between w-full px-3 pl-4">
                            <span className="text-[11px] font-medium truncate" style={{ color: trackTextColor }}>{track.name}</span>
                            <div className="flex items-center gap-0.5">
                              <MSR label="M" active={track.muted} color={C.warning} onClick={() => toggleMute(track.id)} />
                              <MSR label="S" active={track.soloed} color={C.success} onClick={() => toggleSolo(track.id)} />
                              <MSR label="R" active={track.recording} color={C.error} onClick={() => toggleRecord(track.id)} />
                              <button
                                className="w-[18px] h-[16px] rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                                title="Automation curve"
                              >
                                <Icon.Curve />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Clip area */}
                        <div className="flex-1 relative pointer-events-none">
                          {clips.map((clip) => {
                            const isAudio = isAudioTrack;
                            const isHover = hoveredClip === clip.id;
                            const bg = isAudio
                              ? `linear-gradient(180deg, ${track.color}35 0%, ${track.color}20 100%)`
                              : `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`;
                            const border = isAudio
                              ? `1px solid ${track.color}${isHover ? "cc" : "65"}`
                              : `1px solid rgba(255,255,255,${isHover ? "0.10" : "0.05"})`;
                            return (
                              <div
                                key={clip.id}
                                onMouseEnter={() => setHoveredClip(clip.id)}
                                onMouseLeave={() => setHoveredClip(null)}
                                className={cn(
                                  "absolute rounded-[3px] pointer-events-auto cursor-pointer transition-shadow",
                                  isHover && "ring-1 ring-violet-400/60 shadow-lg"
                                )}
                                style={{
                                  left: `${(clip.start / 60) * 100}%`,
                                  width: `${(clip.width / 60) * 100}%`,
                                  top: 4, bottom: 4,
                                  background: bg,
                                  border,
                                }}
                              >
                                {isAudio ? (
                                  <svg className="w-full h-full" viewBox="0 0 200 28" preserveAspectRatio="none">
                                    <polyline points={audioPoints(idx, 80, 8)} fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" vectorEffect="non-scaling-stroke" />
                                  </svg>
                                ) : (
                                  <svg className="w-full h-full" viewBox="0 0 200 28" preserveAspectRatio="none">
                                    <polyline points={wavePoints(idx, 50, 4)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                  </svg>
                                )}
                                <span className={cn(
                                  "absolute left-1.5 top-0.5 text-[7px] truncate max-w-[90%]",
                                  isAudio ? "text-white/85 font-medium" : "text-white/35"
                                )}>{clip.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Playhead */}
                  <div ref={playheadRef} className="absolute bottom-0 top-0 z-20 w-px pointer-events-none" style={{ transform: "translateX(190px)" }}>
                    <div className="absolute bottom-0 top-0 w-px" style={{ background: C.primary, boxShadow: `0 0 8px ${C.primary}cc` }} />
                    <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 rotate-45" style={{ background: C.primary }} />
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* ── Mixer View ───────────────────────────────────── */}
          {activeView === "mixer" && (
            <div className="h-[440px] lg:h-[560px] bg-[#0d0d12] flex flex-col">
              <div className="border-b border-[#1e1e28] bg-[#16161e] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Mixer
              </div>
              <div className="flex-1 flex overflow-x-auto p-3 gap-1.5">
                {tracks.slice(0, 8).map((track, i) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(i)}
                    className={cn(
                      "flex flex-col rounded-[8px] border bg-[#13131a] w-[90px] lg:w-[100px] flex-shrink-0 transition-colors cursor-pointer",
                      selectedTrack === i ? "border-[rgba(124,58,237,0.34)]" : "border-[#1e1e28] hover:border-[#2a2a36]",
                    )}
                  >
                    <div className="h-1 rounded-t-[8px]" style={{ background: track.color }} />
                    <div className="px-2 py-1.5 text-center">
                      <div className="text-[10px] text-white truncate">{track.name}</div>
                      <div className="text-[8px] text-zinc-500">Out: Master</div>
                    </div>
                    <div className="flex justify-center gap-1 px-2 py-1">
                      <MSR label="M" active={track.muted} color={C.warning} onClick={() => toggleMute(track.id)} />
                      <MSR label="S" active={track.soloed} color={C.success} onClick={() => toggleSolo(track.id)} />
                      <MSR label="R" active={track.recording} color={C.error} onClick={() => toggleRecord(track.id)} />
                    </div>
                    <div className="mx-2 mb-1.5 rounded-md border border-[#2a2a36] bg-[#0d0d12] py-1 text-center text-[8px] text-zinc-500">
                      + Insert
                    </div>
                    <div className="flex justify-center py-1">
                      <div className="w-6 h-6 rounded-full border border-[#2a2a36] bg-[#1e1e28] relative">
                        <div className="absolute top-0.5 left-1/2 w-px h-2 -translate-x-1/2 rounded-full" style={{ background: C.primary }} />
                      </div>
                    </div>
                    <div className="text-center text-[7px] text-zinc-500">0.0</div>
                    <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-2 pt-3">
                      <div className="text-[8px] text-zinc-500 self-end pb-1">{track.db}</div>
                      <div className="relative w-4 h-[140px] rounded-sm overflow-hidden" style={{ background: "rgba(32,36,49,0.60)" }}>
                        <div className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-100" style={{
                          height: `${track.meter}%`,
                          background: `linear-gradient(180deg, ${track.meter > 85 ? C.error : track.meter > 60 ? C.warning : C.primary}, ${C.cyan})`,
                        }} />
                      </div>
                      <div className="relative w-5 h-[140px] rounded-[3px]" style={{ background: "rgba(5,5,8,0.60)" }}>
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
                    <div className="border-t border-[rgba(30,30,40,0.36)] py-1 text-center text-[8px] text-zinc-500">
                      {track.id}
                    </div>
                  </div>
                ))}

                {/* Master strip */}
                <div className="flex flex-col rounded-[8px] border border-[rgba(124,58,237,0.34)] bg-[rgba(30,30,40,0.78)] w-[110px] lg:w-[120px] flex-shrink-0 ml-2">
                  <div className="h-1 rounded-t-[8px]" style={{ background: C.primary }} />
                  <div className="px-2 py-1.5 text-center">
                    <div className="text-[11px] font-semibold text-white">MASTER</div>
                    <div className="text-[8px] text-zinc-500">Output</div>
                  </div>
                  <div className="mx-2 mb-1.5 rounded-md border border-[#2a2a36] bg-[#0d0d12] py-1 text-center text-[8px] text-zinc-500">
                    + Insert
                  </div>
                  <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-2 pt-3">
                    <div className="text-[8px] text-zinc-500 self-end pb-1">-8.0 dB</div>
                    <div className="relative w-5 h-[160px] rounded-sm overflow-hidden" style={{ background: "rgba(32,36,49,0.60)" }}>
                      <div className="absolute bottom-0 left-0 right-0 rounded-sm" style={{
                        height: "82%",
                        background: `linear-gradient(180deg, ${C.primary}, ${C.cyan})`,
                      }} />
                    </div>
                    <div className="relative w-6 h-[160px] rounded-[3px]" style={{ background: "rgba(5,5,8,0.60)" }}>
                      <div className="absolute left-0.5 right-0.5 rounded-sm" style={{
                        bottom: "66%", height: 14, background: C.surface,
                        border: `1px solid ${C.outline}`, boxShadow: `0 0 4px ${C.primary}40`,
                      }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full" style={{ background: C.primary }} />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[rgba(30,30,40,0.36)] py-1 text-center text-[8px] text-zinc-500">M</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Arsenal View ─────────────────────────────────── */}
          {activeView === "arsenal" && (
            <div className="h-[440px] lg:h-[560px] bg-[#0d0d12] flex items-center justify-center">
              <div className="w-[90%] max-w-[480px] rounded-[12px] border border-[#2a2a36] bg-[#16161e] p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3 text-white">
                  <Icon.Arsenal />
                  <span className="text-sm tracking-[0.22em] uppercase">Arsenal</span>
                </div>
                <p className="mx-auto mb-5 max-w-sm text-center text-[12px] text-zinc-500">
                  Pattern engines and source modules live here.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {["808", "Hats", "Clap", "Snare", "Keys", "Pad", "Lead", "FX"].map((name, i) => (
                    <div key={name} className="rounded-lg border border-[#2a2a36] bg-[#0d0d12] p-2.5 text-center">
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
            <div className="h-[440px] lg:h-[560px] bg-[#0d0d12] flex flex-col">
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-[420px] rounded-[12px] border border-[#2a2a36] bg-[#16161e] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(124,58,237,0.34)] bg-[rgba(124,58,237,0.10)]">
                    <Icon.PianoRoll />
                  </div>
                  <div className="mb-1.5 text-sm text-white">Audition</div>
                  <p className="mb-4 text-[11px] text-zinc-500">
                    Translation listening — preview your mix through common listening profiles.
                  </p>
                  <div className="rounded-lg border border-[#2a2a36] bg-[#0d0d12] p-3">
                    <svg className="h-10 w-full" viewBox="0 0 300 36" preserveAspectRatio="none">
                      <polyline
                        points={audioPoints(7, 100, 12)}
                        fill="none" stroke={C.primary} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {["Studio", "Spotify", "Apple Music", "AirPods", "Car", "Phone"].map(p => (
                      <span key={p} className="rounded-full border border-[#2a2a36] bg-[#0d0d12] px-2.5 py-0.5 text-[9px] text-zinc-500">
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
