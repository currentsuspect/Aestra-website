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
  "#ffcc33", "#33ffcc", "#ff66cc", "#99ff33",
  "#ff9933", "#66ccff", "#ff3366", "#cc66ff",
  "#ffe61a", "#1ae699",
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

const NAV_ITEMS = [
  { section: "Collections", items: [
    { name: "Favorites", color: C.primary },
    { name: "Drums", color: "#f97316" },
    { name: "Instruments", color: "#22c55e" },
    { name: "Vocals", color: "#3b82f6" },
  ]},
  { section: "Categories", items: [
    { name: "Sounds" }, { name: "Drums" }, { name: "Instruments" },
    { name: "Effects" }, { name: "Plugins" }, { name: "Clips" }, { name: "Samples" },
  ]},
  { section: "Places", items: [
    { name: "Packs" }, { name: "User Library" }, { name: "Current Project" },
  ]},
];

type Track = {
  id: number; name: string; color: string;
  meter: number; db: string; muted: boolean; soloed: boolean; recording: boolean;
};

const initialTracks: Track[] = [
  { id: 1, name: "Track 1", color: TRACK_COLORS[0], meter: 72, db: "-8.0 dB", muted: false, soloed: false, recording: false },
  { id: 2, name: "Track 2", color: TRACK_COLORS[1], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
  { id: 3, name: "Track 3", color: TRACK_COLORS[2], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
  { id: 4, name: "Track 4", color: TRACK_COLORS[3], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
  { id: 5, name: "Track 5", color: TRACK_COLORS[4], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
  { id: 6, name: "Track 6", color: TRACK_COLORS[5], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
  { id: 7, name: "Track 7", color: TRACK_COLORS[6], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
  { id: 8, name: "Track 8", color: TRACK_COLORS[7], meter: 4, db: "-60.0 dB", muted: false, soloed: false, recording: false },
];

/* ── Utility ────────────────────────────────────────────────────── */
const fmt = (t: number) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const cs = Math.floor((t % 1) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
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
  Folder: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M2 4.5V11a1 1 0 001 1h8a1 1 0 001-1V5.5a1 1 0 00-1-1H7L5.5 3H3a1 1 0 00-1 1z"/></svg>,
  Audio: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.1"><circle cx="7" cy="7" r="4"/><path d="M7 4v6M5 6l2-2 2 2M5 10l2 2 2-2"/></svg>,
};

/* ── Transport Button ───────────────────────────────────────────── */
const TBtn = memo(({ active, error: isError, onClick, children, title, className }: {
  active?: boolean; error?: boolean; onClick?: () => void; children: React.ReactNode; title?: string; className?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "flex items-center justify-center rounded transition-all duration-100",
      "w-7 h-7 text-[13px]",
      active && !isError && "bg-[rgba(124,58,237,0.18)] border border-[rgba(124,58,237,0.34)] text-white",
      isError && "bg-[rgba(232,84,84,0.16)] border border-[rgba(232,84,84,0.24)] text-[#e85454]",
      !active && !isError && "border border-transparent text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.76)] hover:bg-[rgba(255,255,255,0.06)]",
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
      "flex items-center justify-center rounded-[5px] text-[9px] font-semibold w-[18px] h-[16px] transition-all",
      active ? "text-white" : "text-[rgba(255,255,255,0.50)]",
    )}
    style={active ? { background: `${color}22`, border: `1px solid ${color}55`, color } : { background: "transparent", border: `1px solid ${C.border}` }}
  >
    {label}
  </button>
));

/* ── Main Component ─────────────────────────────────────────────── */
export const MockTimeline = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [bpm, setBpm] = useState("120.00");
  const [activeView, setActiveView] = useState<"timeline" | "mixer" | "arsenal" | "audition">("timeline");
  const [selectedFile, setSelectedFile] = useState(6);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [selectedNav, setSelectedNav] = useState("Current Project");
  const [tracks, setTracks] = useState(initialTracks);
  const [faders, setFaders] = useState<number[]>([66, 0, 0, 0, 0, 0, 0, 0]);
  const playheadRef = useRef<HTMLDivElement>(null);
  const playheadPos = useRef(190);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);

  const toggleMute = useCallback((id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, muted: !t.muted } : t));
  }, []);
  const toggleSolo = useCallback((id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, soloed: !t.soloed } : t));
  }, []);
  const toggleRecord = useCallback((id: number) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, recording: !t.recording } : t));
  }, []);

  // Playhead animation
  useEffect(() => {
    let af = 0;
    let last = 0;
    let lastStateUpdate = 0;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      if (containerRef.current && isPlaying) {
        const maxX = containerRef.current.offsetWidth - 240;
        const next = playheadPos.current + 94 * dt;
        playheadPos.current = next > maxX ? 190 : next;
        if (playheadRef.current) playheadRef.current.style.transform = `translateX(${playheadPos.current}px)`;
        if (ts - lastStateUpdate > 100) {
          lastStateUpdate = ts;
          timeRef.current = next > maxX ? 0 : timeRef.current + dt;
          setTime(timeRef.current);
        }
        af = requestAnimationFrame(tick);
      }
    };
    if (isPlaying) af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [isPlaying]);

  // Meter animation when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTracks(prev => prev.map((t, i) => i === 0
        ? { ...t, meter: 50 + Math.random() * 35, db: `-${Math.floor(8 + Math.random() * 4)}.0 dB` }
        : { ...t, meter: Math.random() * 15, db: `-${Math.floor(40 + Math.random() * 20)}.0 dB` }
      ));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="mt-8 sm:mt-12 lg:mt-16 max-w-7xl mx-auto relative px-0 sm:px-2">
      {/* Mobile fallback */}
      <div className="md:hidden rounded-[12px] border border-[rgba(0,229,204,0.25)] bg-[#0d0d12] p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon.Timeline />
          <span className="text-xs uppercase tracking-[0.2em] text-[#00e5cc]">DAW Preview</span>
        </div>
        <p className="text-sm text-[rgba(255,255,255,0.50)] mb-4">Interactive timeline editor — available on tablet and desktop.</p>
      </div>

      {/* Full DAW preview */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden rounded-[10px] border border-[#2a2a36] bg-[#0d0d12] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          {/* ── Title Bar ────────────────────────────────────── */}
          <div className="h-7 border-b border-[rgba(30,30,40,0.86)] bg-[rgba(30,30,40,0.98)] px-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[rgba(255,255,255,0.50)]">File</span>
              <span className="text-[11px] text-[rgba(255,255,255,0.50)]">Edit</span>
              <span className="text-[11px] text-[rgba(255,255,255,0.50)]">View</span>
            </div>
            {/* Tab bar */}
            <div className="flex items-center gap-1 rounded-full border border-[#2a2a36] bg-[#16161e] p-0.5">
              {([
                { id: "timeline" as const, label: "Timeline", icon: Icon.Timeline, key: "F5" },
                { id: "mixer" as const, label: "Mixer", icon: Icon.Mixer, key: "F3" },
                { id: "arsenal" as const, label: "Arsenal", icon: Icon.Arsenal, key: "F6" },
                { id: "audition" as const, label: "Audition", icon: Icon.PianoRoll, key: "" },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  title={`${tab.label}${tab.key ? ` (${tab.key})` : ""}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] transition-colors",
                    activeView === tab.id
                      ? "bg-[#7c3aed] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-[rgba(255,255,255,0.50)] hover:text-white",
                  )}
                >
                  <tab.icon />
                  <span className="hidden lg:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[rgba(255,255,255,0.50)]">
              <div className="w-3 h-3 rounded-full border border-[rgba(255,255,255,0.15)]" />
              <div className="w-3 h-3 rounded border border-[rgba(255,255,255,0.15)]" />
              <div className="w-3 h-3 text-[10px]">×</div>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────── */}
          {activeView === "timeline" && (
            <div className="flex h-[420px] lg:h-[520px]">
              {/* File Browser Sidebar */}
              <div className="w-[220px] lg:w-[268px] border-r border-[#1e1e28] bg-[#111116] flex flex-col">
                {/* Search */}
                <div className="p-2">
                  <div className="flex items-center gap-2 rounded-md border border-[#2a2a36] bg-[#0d0d12] px-2.5 py-1.5 text-[11px] text-[rgba(255,255,255,0.50)]">
                    <Icon.Search />
                    <span>Search library...</span>
                  </div>
                </div>

                {/* Nav pane + File list split */}
                <div className="flex flex-1 min-h-0">
                  {/* Navigation pane */}
                  <div className="w-[80px] lg:w-[100px] border-r border-[rgba(30,30,40,0.36)] bg-[rgba(9,10,12,0.6)] overflow-y-auto">
                    {NAV_ITEMS.map(section => (
                      <div key={section.section}>
                        <div className="px-2 pt-3 pb-1 text-[8px] uppercase tracking-[0.14em] text-[rgba(255,255,255,0.28)]">{section.section}</div>
                        {section.items.map(item => (
                          <button
                            key={item.name}
                            onClick={() => setSelectedNav(item.name)}
                            className={cn(
                              "w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-left transition-colors",
                              selectedNav === item.name
                                ? "bg-[rgba(124,58,237,0.105)] text-[rgba(255,255,255,0.90)]"
                                : "text-[rgba(255,255,255,0.50)] hover:bg-[rgba(255,255,255,0.035)]",
                            )}
                          >
                            {item.color && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />}
                            <span className="truncate">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* File list */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="px-2.5 py-2 border-b border-[rgba(30,30,40,0.36)]">
                      <div className="text-[9px] text-[rgba(255,255,255,0.35)]">Current Project / Samples</div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {FILES.map((file, i) => (
                        <button
                          key={file.name}
                          onClick={() => setSelectedFile(i)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1 text-[10px] text-left transition-colors truncate",
                            selectedFile === i
                              ? "bg-[rgba(124,58,237,0.12)] text-white"
                              : "text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.04)]",
                          )}
                        >
                          <Icon.Audio />
                          <span className="truncate flex-1">{file.name}</span>
                          <span className="text-[8px] text-[rgba(255,255,255,0.30)] flex-shrink-0">{file.size}</span>
                        </button>
                      ))}
                    </div>
                    {/* Selected file waveform */}
                    <div className="border-t border-[rgba(30,30,40,0.36)] p-2">
                      <div className="text-[9px] text-[rgba(255,255,255,0.72)] truncate">{FILES[selectedFile].name}</div>
                      <div className="text-[8px] text-[rgba(255,255,255,0.35)]">{FILES[selectedFile].size} {FILES[selectedFile].kind}</div>
                      <div className="mt-1.5 rounded-md border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.06)] p-1.5">
                        <svg className="h-8 w-full" viewBox="0 0 200 28" preserveAspectRatio="none">
                          <polyline
                            points={Array.from({ length: 80 }, (_, i) => {
                              const x = (i / 79) * 200;
                              const y = 14 + Math.sin(i * 0.42 + selectedFile) * 6 * Math.cos(i * 0.13);
                              return `${x},${y}`;
                            }).join(" ")}
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
                {/* Toolbar */}
                <div className="border-b border-[#1e1e28] bg-[#111116] px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {["C", "E", "A"].map((m, i) => (
                      <button key={m} className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider",
                        i === 0 ? "border border-[rgba(124,58,237,0.34)] bg-[rgba(124,58,237,0.10)] text-white" : "border border-[#2a2a36] text-[rgba(255,255,255,0.35)]"
                      )}>{m}</button>
                    ))}
                  </div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.35)]">
                    {FILES[selectedFile].name.replace(".flac", "").slice(0, 24)}
                    <span className="ml-2 text-[rgba(255,255,255,0.20)]">174.3s</span>
                  </div>
                </div>

                {/* Ruler */}
                <div className="relative h-7 border-b border-[rgba(30,30,40,0.64)] bg-[#0f0f14] px-0">
                  <div className="absolute left-[190px] right-3 top-1 bottom-1 flex items-end">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="flex-1 relative">
                        {i % 4 === 0 && (
                          <>
                            <div className="absolute bottom-0 w-px h-full" style={{ background: C.gridBar }} />
                            <span className="absolute bottom-0.5 left-1 text-[8px] text-[rgba(255,255,255,0.30)]">{i + 1}</span>
                          </>
                        )}
                        {i % 4 !== 0 && <div className="absolute bottom-0 w-px h-1.5" style={{ background: C.gridBeat }} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracks + Grid */}
                <div className="flex-1 relative overflow-hidden bg-[#0d0d12]">
                  {/* Grid lines */}
                  <div className="absolute inset-0 left-[190px] right-0">
                    {Array.from({ length: 80 }, (_, i) => (
                      <div key={i} className="absolute top-0 bottom-0 w-px" style={{
                        left: `${(i / 80) * 100}%`,
                        background: i % 4 === 0 ? C.gridBar : C.gridBeat,
                      }} />
                    ))}
                  </div>

                  {/* Track rows */}
                  {tracks.map((track, idx) => {
                    const isLead = idx === 0;
                    const y = idx * 43;
                    return (
                      <div key={track.id} className="absolute inset-x-0 flex" style={{ top: y, height: 43 }}>
                        {/* Track header */}
                        <div className="w-[190px] border-r border-[rgba(30,30,40,0.48)] bg-[#16161e] flex items-center relative flex-shrink-0"
                          onClick={() => setSelectedTrack(idx)}
                          style={selectedTrack === idx ? { background: "rgba(124,58,237,0.075)" } : undefined}
                        >
                          {/* Color strip */}
                          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: track.color, opacity: selectedTrack === idx ? 0.86 : 0.52 }} />
                          <div className="flex items-center justify-between w-full px-3 pl-4">
                            <span className="text-[11px] font-medium truncate" style={{ color: track.color }}>{track.name}</span>
                            <div className="flex gap-1">
                              <MSR label="M" active={track.muted} color={C.warning} onClick={() => toggleMute(track.id)} />
                              <MSR label="S" active={track.soloed} color={C.success} onClick={() => toggleSolo(track.id)} />
                              <MSR label="R" active={track.recording} color={C.error} onClick={() => toggleRecord(track.id)} />
                            </div>
                          </div>
                        </div>

                        {/* Clip area */}
                        <div className="flex-1 relative">
                          {isLead && (
                            <div className="absolute left-1 top-[3px] right-2 bottom-[3px] rounded-[4px] border border-[rgba(255,204,51,0.45)]" style={{ background: "rgba(255,204,51,0.12)" }}>
                              <div className="absolute inset-0">
                                <svg className="w-full h-full" viewBox="0 0 500 34" preserveAspectRatio="none">
                                  <polyline
                                    points={Array.from({ length: 100 }, (_, i) => {
                                      const x = (i / 99) * 500;
                                      const y = 17 + Math.sin(i * 0.42) * 6 + Math.cos(i * 0.13) * 3;
                                      return `${x},${y}`;
                                    }).join(" ")}
                                    fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" vectorEffect="non-scaling-stroke"
                                  />
                                </svg>
                              </div>
                              <span className="absolute left-2 top-1 text-[8px] text-[rgba(255,255,255,0.55)]">
                                SLAYR - Flashout Freestyle.flac
                              </span>
                            </div>
                          )}
                          {!isLead && idx < 4 && (
                            <div className="absolute left-1 top-[3px] w-[30%] right-auto bottom-[3px] rounded-[4px]"
                              style={{ background: `${track.color}12`, border: `1px solid ${track.color}28` }}
                            >
                              <span className="absolute left-1.5 top-1 text-[7px] text-[rgba(255,255,255,0.30)]">
                                pattern_{idx}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Playhead */}
                  <div ref={playheadRef} className="absolute bottom-0 top-0 z-20 w-px pointer-events-none" style={{ transform: "translateX(190px)" }}>
                    <div className="absolute bottom-0 top-0 w-px" style={{ background: C.primary, boxShadow: `0 0 10px ${C.primary}cc` }} />
                  </div>
                </div>

                {/* Bottom bar (Clips/Patterns toggle) */}
                <div className="h-7 border-t border-[#1e1e28] bg-[#111116] px-3 flex items-center">
                  <div className="flex rounded-full border border-[#2a2a36] bg-[#16161e] p-0.5 text-[9px]">
                    <button className="rounded-full bg-[#7c3aed] px-3 py-0.5 text-white">Clips</button>
                    <button className="rounded-full px-3 py-0.5 text-[rgba(255,255,255,0.50)]">Patterns</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Mixer View ───────────────────────────────────── */}
          {activeView === "mixer" && (
            <div className="h-[420px] lg:h-[520px] bg-[#0d0d12] flex flex-col">
              <div className="border-b border-[#1e1e28] bg-[#16161e] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.50)]">
                Mixer
              </div>
              <div className="flex-1 flex overflow-x-auto p-3 gap-1.5">
                {/* Channel strips */}
                {tracks.slice(0, 6).map((track, i) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(i)}
                    className={cn(
                      "flex flex-col rounded-[8px] border bg-[#13131a] w-[90px] lg:w-[100px] flex-shrink-0 transition-colors",
                      selectedTrack === i ? "border-[rgba(124,58,237,0.34)]" : "border-[#1e1e28]",
                    )}
                  >
                    {/* Color bar */}
                    <div className="h-1 rounded-t-[8px]" style={{ background: track.color }} />
                    {/* Name */}
                    <div className="px-2 py-1.5 text-center">
                      <div className="text-[10px] text-[rgba(255,255,255,0.90)] truncate">{track.name}</div>
                      <div className="text-[8px] text-[rgba(255,255,255,0.35)]">Out: Master</div>
                    </div>
                    {/* MSR buttons */}
                    <div className="flex justify-center gap-1 px-2 py-1">
                      <MSR label="M" active={track.muted} color={C.warning} onClick={() => toggleMute(track.id)} />
                      <MSR label="S" active={track.soloed} color={C.success} onClick={() => toggleSolo(track.id)} />
                      <MSR label="R" active={track.recording} color={C.error} onClick={() => toggleRecord(track.id)} />
                    </div>
                    {/* Insert slot */}
                    <div className="mx-2 mb-1.5 rounded-md border border-[#2a2a36] bg-[#0d0d12] py-1 text-center text-[8px] text-[rgba(255,255,255,0.30)]">
                      + Insert
                    </div>
                    {/* Pan knob */}
                    <div className="flex justify-center py-1">
                      <div className="w-6 h-6 rounded-full border border-[#2a2a36] bg-[#1e1e28] relative">
                        <div className="absolute top-0.5 left-1/2 w-px h-2 -translate-x-1/2 rounded-full" style={{ background: C.primary }} />
                      </div>
                    </div>
                    <div className="text-center text-[7px] text-[rgba(255,255,255,0.30)]">0.0</div>
                    {/* Fader + Meter */}
                    <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-2 pt-3">
                      {/* dB readout */}
                      <div className="text-[8px] text-[rgba(255,255,255,0.50)] self-end pb-1">{track.db}</div>
                      {/* Meter */}
                      <div className="relative w-4 h-[140px] rounded-sm overflow-hidden" style={{ background: "rgba(32,36,49,0.60)" }}>
                        <div className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-100" style={{
                          height: `${track.meter}%`,
                          background: `linear-gradient(180deg, ${track.meter > 85 ? C.error : track.meter > 60 ? C.warning : C.primary}, ${C.cyan})`,
                        }} />
                      </div>
                      {/* Fader */}
                      <div className="relative w-5 h-[140px] rounded-[3px]" style={{ background: "rgba(5,5,8,0.60)" }}>
                        <div
                          className="absolute left-0.5 right-0.5 rounded-sm transition-all"
                          style={{
                            bottom: `${faders[i]}%`,
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
                    {/* Footer */}
                    <div className="border-t border-[rgba(30,30,40,0.36)] py-1 text-center text-[8px] text-[rgba(255,255,255,0.30)]">
                      {track.id}
                    </div>
                  </div>
                ))}

                {/* Master strip */}
                <div className="flex flex-col rounded-[8px] border border-[rgba(124,58,237,0.34)] bg-[rgba(30,30,40,0.78)] w-[110px] lg:w-[120px] flex-shrink-0 ml-2">
                  <div className="h-1 rounded-t-[8px]" style={{ background: C.primary }} />
                  <div className="px-2 py-1.5 text-center">
                    <div className="text-[11px] font-semibold text-[rgba(255,255,255,0.90)]">MASTER</div>
                    <div className="text-[8px] text-[rgba(255,255,255,0.35)]">Output</div>
                  </div>
                  <div className="mx-2 mb-1.5 rounded-md border border-[#2a2a36] bg-[#0d0d12] py-1 text-center text-[8px] text-[rgba(255,255,255,0.30)]">
                    + Insert
                  </div>
                  <div className="flex-1 flex items-end justify-center gap-2 px-2 pb-2 pt-3">
                    <div className="text-[8px] text-[rgba(255,255,255,0.50)] self-end pb-1">-8.0 dB</div>
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
                  <div className="border-t border-[rgba(30,30,40,0.36)] py-1 text-center text-[8px] text-[rgba(255,255,255,0.30)]">M</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Arsenal View ─────────────────────────────────── */}
          {activeView === "arsenal" && (
            <div className="h-[420px] lg:h-[520px] bg-[#0d0d12] flex items-center justify-center">
              <div className="w-[90%] max-w-[480px] rounded-[12px] border border-[#2a2a36] bg-[#16161e] p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3 text-[rgba(255,255,255,0.90)]">
                  <Icon.Arsenal />
                  <span className="text-sm tracking-[0.22em] uppercase">Arsenal</span>
                </div>
                <p className="mx-auto mb-5 max-w-sm text-center text-[12px] text-[rgba(255,255,255,0.50)]">
                  Pattern engines and source modules live here.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {["808", "Hats", "Clap", "Snare", "Keys", "Pad", "Lead", "FX"].map((name, i) => (
                    <div key={name} className="rounded-lg border border-[#2a2a36] bg-[#0d0d12] p-2.5 text-center">
                      <div className="mb-1 text-[8px] uppercase tracking-[0.18em]" style={{ color: C.cyan }}>{i < 4 ? "Drum" : "Unit"}</div>
                      <div className="text-[11px] text-[rgba(255,255,255,0.90)]">{name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Audition View ────────────────────────────────── */}
          {activeView === "audition" && (
            <div className="h-[420px] lg:h-[520px] bg-[#0d0d12] flex flex-col">
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-[420px] rounded-[12px] border border-[#2a2a36] bg-[#16161e] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(124,58,237,0.34)] bg-[rgba(124,58,237,0.10)]">
                    <Icon.PianoRoll />
                  </div>
                  <div className="mb-1.5 text-sm text-[rgba(255,255,255,0.90)]">Audition</div>
                  <p className="mb-4 text-[11px] text-[rgba(255,255,255,0.50)]">
                    Translation listening — preview your mix through common listening profiles.
                  </p>
                  <div className="rounded-lg border border-[#2a2a36] bg-[#0d0d12] p-3">
                    <svg className="h-10 w-full" viewBox="0 0 300 36" preserveAspectRatio="none">
                      <polyline
                        points={Array.from({ length: 100 }, (_, i) => {
                          const x = (i / 99) * 300;
                          const y = 18 + Math.sin(i * 0.14) * 8 * Math.cos(i * 0.08 + 1);
                          return `${x},${y}`;
                        }).join(" ")}
                        fill="none" stroke={C.primary} strokeWidth="1.6" vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {["Studio", "Spotify", "Apple Music", "AirPods", "Car", "Phone"].map(p => (
                      <span key={p} className="rounded-full border border-[#2a2a36] bg-[#0d0d12] px-2.5 py-0.5 text-[9px] text-[rgba(255,255,255,0.50)]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Transport Bar ────────────────────────────────── */}
          <div className="h-12 border-t border-[rgba(30,30,40,0.92)] bg-[#111116] flex items-center justify-center px-3">
            <div className="flex items-center gap-0 h-9 rounded-lg border border-[#2a2a36] bg-[rgba(22,22,30,0.42)] px-1.5">
              {/* Transport controls */}
              <div className="flex items-center gap-1 px-1">
                <TBtn onClick={() => { setIsPlaying(v => !v); }} active={isPlaying} title="Play (Space)"><Icon.Play /></TBtn>
                <TBtn onClick={() => { setIsPlaying(false); timeRef.current = 0; setTime(0); playheadPos.current = 190; if (playheadRef.current) playheadRef.current.style.transform = "translateX(190px)"; }} title="Stop"><Icon.Stop /></TBtn>
                <TBtn onClick={() => setIsRecording(v => !v)} error={isRecording} active={isRecording} title="Record"><Icon.Record /></TBtn>
              </div>

              <div className="w-px h-5 mx-1.5" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Extras */}
              <div className="flex items-center gap-1 px-1">
                <TBtn title="Metronome"><Icon.Metronome /></TBtn>
              </div>

              <div className="w-px h-5 mx-1.5" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Info display */}
              <div className="flex items-center gap-3 px-2">
                <span className="text-[10px] font-mono text-[rgba(255,255,255,0.50)] rounded border border-[#2a2a36] bg-[#0d0d12] px-1.5 py-0.5">4/4</span>
                <div className="flex items-center gap-1">
                  <input
                    value={bpm}
                    onChange={e => /^[0-9]*\.?[0-9]*$/.test(e.target.value) && setBpm(e.target.value)}
                    className="w-12 bg-transparent text-right outline-none text-[12px] font-mono text-[rgba(255,255,255,0.90)]"
                  />
                  <span className="text-[9px] text-[rgba(255,255,255,0.35)]">BPM</span>
                </div>
                <span className={cn("text-[12px] font-mono tabular-nums", isPlaying ? "text-[#3dbb6e]" : "text-[rgba(255,255,255,0.50)]")}>
                  {fmt(time)}
                </span>
              </div>

              <div className="w-px h-5 mx-1.5" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* View toggles */}
              <div className="flex items-center gap-1 px-1">
                {([
                  { id: "timeline" as const, icon: Icon.Timeline, key: "F5" },
                  { id: "mixer" as const, icon: Icon.Mixer, key: "F3" },
                  { id: "arsenal" as const, icon: Icon.Arsenal, key: "F6" },
                  { id: "audition" as const, icon: Icon.PianoRoll, key: "" },
                ]).map(v => (
                  <TBtn key={v.id} active={activeView === v.id} onClick={() => setActiveView(v.id)} title={`${v.id}${v.key ? ` (${v.key})` : ""}`}>
                    <v.icon />
                  </TBtn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
