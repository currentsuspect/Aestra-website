import React, { memo, useState } from "react";

/* ── Desktop chrome for the hero MockTimeline ──────────────────────
   Title bar, transport row, library panel, tool row and track header
   buttons, laid out after the running app (Sep 2026 screenshot of the
   Timeline view), not after older design mocks. When the app's shell
   changes, compare against a fresh screenshot before touching this. */

export const SIDEBAR_W = 250;

const svg = (children: React.ReactNode, size = 14, extra: React.SVGProps<SVGSVGElement> = {}) => (
  <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" {...extra}>{children}</svg>
);
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const I = {
  Play: () => svg(<path d="M4 2.4v9.2l7.6-4.6z" fill="currentColor" />),
  Pause: () => svg(<><rect x="3.5" y="2.5" width="2.4" height="9" rx=".6" fill="currentColor" /><rect x="8.1" y="2.5" width="2.4" height="9" rx=".6" fill="currentColor" /></>),
  Stop: () => svg(<rect x="3.2" y="3.2" width="7.6" height="7.6" rx="1" fill="currentColor" />),
  Record: () => svg(<circle cx="7" cy="7" r="4.2" fill="currentColor" />),
  Dots: () => svg(<><circle cx="3.5" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="7" r="1" fill="currentColor" /><circle cx="10.5" cy="7" r="1" fill="currentColor" /></>, 12),
  Hourglass: () => svg(<path {...line} d="M4 2h6M4 12h6M4.5 2c0 2.6 1 3.4 2.5 5 1.5-1.6 2.5-2.4 2.5-5M4.5 12c0-2.6 1-3.4 2.5-5 1.5 1.6 2.5 2.4 2.5 5" />, 12),
  Loop: () => svg(<path {...line} d="M2.5 6.5a3 3 0 013-3h5l-1.5-1.5M11.5 7.5a3 3 0 01-3 3h-5l1.5 1.5" />, 12),
  Metronome: () => svg(<><path {...line} d="M5 12.2h4.6L8.3 2H6.3z" /><path {...line} d="M7.3 8.6l3.4-4.2" /></>, 14),
  MixerBars: () => svg(<><path {...line} d="M3.5 2.5v9M7 2.5v9M10.5 2.5v9" /><path d="M2.4 5h2.2M5.9 8.5h2.2M9.4 4h2.2" stroke="currentColor" strokeWidth="2" /></>),
  List: () => svg(<path {...line} d="M5 3.5h6.5M5 7h6.5M5 10.5h6.5M2.5 3.5h.1M2.5 7h.1M2.5 10.5h.1" />),
  Piano: () => svg(<><rect x="2" y="2.5" width="10" height="9" rx="1" {...line} /><path d="M4.8 2.5v5M7 2.5v5M9.2 2.5v5" stroke="currentColor" strokeWidth="1.6" /></>),
  Minimize: () => svg(<path {...line} d="M3 7h8" />, 13),
  Maximize: () => svg(<rect x="3" y="3" width="8" height="8" rx=".5" {...line} />, 13),
  Close: () => svg(<path {...line} d="M3.5 3.5l7 7M10.5 3.5l-7 7" />, 13),
  ChevronRight: () => svg(<path {...line} d="M5 3l4 4-4 4" />, 11),
  ChevronLeft: () => svg(<path {...line} d="M9 3L5 7l4 4" />, 11),
  ArrowUp: () => svg(<path {...line} d="M7 11.5v-9M3.5 6L7 2.5 10.5 6" />, 11),
  Filter: () => svg(<path {...line} d="M2.5 3.5h9M4.5 7h5M6 10.5h2" />, 12),
  Sort: () => svg(<path {...line} d="M2.5 4h4M2.5 7.5h3M2.5 11h2M10 11.5V2.5M8 4.5l2-2 2 2" />, 12),
  Folder: () => svg(<path d="M1.5 3.6c0-.6.4-1 1-1h3l1.3 1.4h4.7c.6 0 1 .4 1 1v5.9c0 .6-.4 1-1 1h-9c-.6 0-1-.4-1-1z" fill="currentColor" />, 13),
  Wave: () => svg(<path {...line} d="M1.5 7h1.2l1-2.5 1.4 5 1.4-7 1.4 9 1.4-6 1 3h2.2" strokeWidth={1} />, 12),
  Star: () => svg(<path d="M7 1.8l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 10l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="currentColor" />, 13),
  Note: () => svg(<><path {...line} d="M5.5 10.5V3l6-1.2v7" /><circle cx="4" cy="10.5" r="1.6" fill="currentColor" /><circle cx="10" cy="9" r="1.6" fill="currentColor" /></>, 13),
  Grid: () => svg(<><rect x="2" y="2" width="4.2" height="4.2" rx="1" fill="currentColor" /><rect x="7.8" y="2" width="4.2" height="4.2" rx="1" fill="currentColor" /><rect x="2" y="7.8" width="4.2" height="4.2" rx="1" fill="currentColor" /><rect x="7.8" y="7.8" width="4.2" height="4.2" rx="1" fill="currentColor" /></>, 13),
  Keys: () => svg(<><rect x="1.5" y="3" width="11" height="8" rx="1" fill="currentColor" /><path d="M4.2 3v5M7 3v5M9.8 3v5" stroke="#000" strokeWidth="1.2" /></>, 13),
  Sliders: () => svg(<><path {...line} d="M3.5 2v10M7 2v10M10.5 2v10" /><path d="M2.3 8.5h2.4M5.8 4.5h2.4M9.3 7h2.4" stroke="currentColor" strokeWidth="2" /></>, 13),
  Mic: () => svg(<><rect x="5" y="1.8" width="4" height="6.5" rx="2" fill="currentColor" /><path {...line} d="M3.5 7a3.5 3.5 0 007 0M7 10.5V12.5" /></>, 13),
  Keyboard: () => svg(<><rect x="1.5" y="3.5" width="11" height="7" rx="1.2" fill="currentColor" /><path d="M3.5 6h1M6 6h1M8.5 6h1M4 8.5h6" stroke="#000" strokeWidth="1" /></>, 13),
  PlayBox: () => svg(<><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" fill="currentColor" /><path d="M5.8 5v4l3.4-2z" fill="#000" /></>, 13),
  Bars: () => svg(<path {...line} d="M2.5 6v2M4.8 4v6M7 2.5v9M9.2 4.5v5M11.5 6v2" />, 13),
  Box: () => svg(<><rect x="2" y="4.5" width="10" height="7.5" rx="1" fill="currentColor" /><path d="M1.5 3h11v2h-11z" fill="currentColor" /><path d="M7 3v9" stroke="#000" strokeWidth="1" /></>, 13),
  Person: () => svg(<><circle cx="7" cy="4.5" r="2.4" fill="currentColor" /><path d="M2.5 12.5c.5-2.6 2.2-4 4.5-4s4 1.4 4.5 4z" fill="currentColor" /></>, 13),
  FolderPlus: () => svg(<><path d="M1.5 3.6c0-.6.4-1 1-1h3l1.3 1.4h4.7c.6 0 1 .4 1 1v5.9c0 .6-.4 1-1 1h-9c-.6 0-1-.4-1-1z" fill="currentColor" /><path d="M7 6v4M5 8h4" stroke="#000" strokeWidth="1.2" /></>, 13),
  Plus: () => svg(<path {...line} d="M7 2.5v9M2.5 7h9" />, 13),
  Cursor: () => svg(<path d="M3.5 1.8l7 5.6-3.3.6 1.9 3.6-1.4.7-1.9-3.6-2.3 2.3z" fill="currentColor" />, 13),
  Split: () => svg(<><rect x="1.8" y="3" width="4.6" height="8" rx=".8" fill="currentColor" /><rect x="7.6" y="3" width="4.6" height="8" rx=".8" fill="currentColor" /></>, 13),
  Marquee: () => svg(<path {...line} d="M2.5 5V2.5H5M9 2.5h2.5V5M11.5 9v2.5H9M5 11.5H2.5V9" />, 13),
  Brush: () => svg(<><path {...line} d="M11.8 2.2L6.4 7.6" /><path d="M5.6 8.1c-1.4-.2-2.6.7-2.8 2.1l-.5 1.9 1.9-.5c1.4-.2 2.3-1.4 2.1-2.8z" fill="currentColor" /></>, 13),
  ArrowRight: () => svg(<path {...line} d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />, 13),
  Menu: () => svg(<path {...line} d="M2.5 4h9M2.5 7h9M2.5 10h9" />, 13),
  Mute: () => svg(<><path d="M2 5.2h2.2L7 3v8L4.2 8.8H2z" fill="currentColor" /><path {...line} d="M9.2 5.4l3 3M12.2 5.4l-3 3" strokeWidth={1.1} /></>, 12),
  Solo: () => svg(<path {...line} d="M2.5 9.5V7a4.5 4.5 0 019 0v2.5M2.5 8.5h1.6v3H2.5zM11.5 8.5H9.9v3h1.6z" />, 12),
  Arm: () => svg(<><circle cx="7" cy="7" r="4.3" {...line} /><circle cx="7" cy="7" r="1.6" fill="currentColor" /></>, 12),
};

/* ── Title bar ─────────────────────────────────────────────────── */
type View = "timeline" | "mixer" | "arsenal" | "audition";

export const TitleBar = memo(({ view, onView }: { view: View; onView: (v: View) => void }) => (
  <div className="h-10 px-4 flex items-center justify-between bg-[#0a0a0a] border-b border-[#161616]">
    <div className="flex items-center gap-6 text-[12px] text-neutral-300 min-w-[220px]" aria-hidden="true">
      <span>File</span><span>Edit</span><span>View</span><span>Help</span>
    </div>
    <div className="flex items-center rounded-full border border-[#2a2a2a] bg-[#0d0d0d] p-[2px]">
      {([["arsenal", "Arsenal"], ["timeline", "Timeline"], ["audition", "Audition"]] as const).map(([id, label]) => (
        <button
          key={id}
          onClick={() => onView(id)}
          className="h-[24px] min-w-[100px] px-4 rounded-full text-[12px] border transition-colors"
          style={
            view === id
              ? { background: "rgba(124,58,237,0.30)", borderColor: "rgba(139,92,246,0.55)", color: "#fff" }
              : { borderColor: "transparent", color: "rgba(255,255,255,0.55)" }
          }
        >
          {label}
        </button>
      ))}
    </div>
    <div className="flex items-center justify-end gap-3 min-w-[220px] text-[12px]">
      <span className="text-neutral-400">Signed out</span>
      <span className="h-[24px] px-6 rounded-full border border-[#2a2a2a] bg-[#0d0d0d] text-neutral-300 flex items-center">Core</span>
      <div className="flex items-center gap-5 ml-4 text-neutral-200" aria-hidden="true">
        <I.Minimize /><I.Maximize /><I.Close />
      </div>
    </div>
  </div>
));

/* ── Transport row ─────────────────────────────────────────────── */
type TransportProps = {
  playing: boolean;
  recording: boolean;
  onPlay: () => void;
  onStop: () => void;
  onRecord: () => void;
  bpm: string;
  onBpm: (v: string) => void;
  onView: (v: View) => void;
  timeTextRef: React.RefObject<HTMLSpanElement>;
  masterRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scopeRef: React.RefObject<SVGPolylineElement>;
};

const Toggle = ({ on, onClick, icon, label }: { on: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className="h-7 px-2 inline-flex items-center gap-1.5 rounded text-[10px] tracking-[0.06em] uppercase whitespace-nowrap transition-colors hover:bg-white/[0.04]"
    style={{ color: on ? "#c4b5fd" : "rgba(255,255,255,0.55)" }}
  >
    {icon}
    {label}
  </button>
);

export const TransportBar = memo(({
  playing, recording, onPlay, onStop, onRecord, bpm, onBpm, onView, timeTextRef, masterRefs, scopeRef,
}: TransportProps) => {
  const [countIn, setCountIn] = useState(false);
  const [wait, setWait] = useState(false);
  const [loopRec, setLoopRec] = useState(false);
  const [metro, setMetro] = useState(false);
  return (
    <div className="h-[52px] flex items-center bg-[#0a0a0a] border-b border-[#161616] pr-3">
      {/* Aligns play with the tool column when there's room; gives way first when there isn't. */}
      <div className="shrink min-w-[16px]" style={{ width: SIDEBAR_W + 12 }} />
      <div className="flex items-center gap-1">
        <button onClick={onPlay} title="Play / Pause (Space)" className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-white/[0.05]" style={{ color: playing ? "#a78bfa" : "rgba(255,255,255,0.88)" }}>
          {playing ? <I.Pause /> : <I.Play />}
        </button>
        <button onClick={onStop} title="Stop (Esc)" className="w-8 h-8 rounded flex items-center justify-center text-white/[0.88] hover:bg-white/[0.05]">
          <I.Stop />
        </button>
        <button onClick={onRecord} title="Record" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/[0.05]" style={{ color: recording ? "#e85454" : "rgba(255,255,255,0.88)" }}>
          <I.Record />
        </button>
      </div>
      <div className="hidden xl:flex items-center gap-1 ml-3 shrink-0">
        <Toggle on={countIn} onClick={() => setCountIn((v) => !v)} icon={<I.Dots />} label="Count in" />
        <Toggle on={wait} onClick={() => setWait((v) => !v)} icon={<I.Hourglass />} label="Wait" />
        <Toggle on={loopRec} onClick={() => setLoopRec((v) => !v)} icon={<I.Loop />} label="Loop record" />
        <button onClick={() => setMetro((v) => !v)} title="Metronome" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/[0.05]" style={{ color: metro ? "#c4b5fd" : "rgba(255,255,255,0.7)" }}>
          <I.Metronome />
        </button>
      </div>

      <div className="flex items-center gap-6 ml-6 shrink-0">
        <span className="text-[15px] text-neutral-200 tabular-nums">4/4</span>
        <label className="flex flex-col items-center leading-none">
          <span className="text-[9px] tracking-[0.08em] text-neutral-400">BPM</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onBpm(String(Math.max(40, Math.min(300, n))));
            }}
            className="mt-1 w-[62px] bg-transparent text-center text-[14px] text-neutral-100 tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>
        <span ref={timeTextRef} className="text-[16px] text-neutral-100 tabular-nums w-[72px]">0:00.00</span>
      </div>

      <div className="flex items-center gap-2 ml-5 shrink-0 text-white/[0.7]">
        <button onClick={() => onView("mixer")} title="Mixer" className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/[0.05]"><I.MixerBars /></button>
        <button onClick={() => onView("timeline")} title="Timeline" className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/[0.05]"><I.List /></button>
        <button onClick={() => onView("arsenal")} title="Arsenal" className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/[0.05]"><I.Piano /></button>
      </div>

      <div className="flex-1" />

      <div className="relative hidden xl:block shrink-0 w-[150px] h-[38px] rounded-md border border-[#1c1c1c] bg-[#0d0d0d] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 36" preserveAspectRatio="none" aria-hidden="true">
          <polyline ref={scopeRef} points="0,18 140,18" fill="none" stroke="#8b5cf6" strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.08em] text-neutral-500">SCOPE</span>
      </div>
      <div className="relative ml-2 shrink-0 w-[60px] h-[38px] rounded-md border border-[#1c1c1c] bg-[#0d0d0d] overflow-hidden">
        <span className="absolute inset-x-0 top-[9px] text-center text-[10px] tracking-[0.08em] text-neutral-500">MASTER</span>
        <div className="absolute left-2 right-2 bottom-[7px] flex flex-col gap-[3px]">
          {[0, 1].map((ch) => (
            <div key={ch} className="h-[2px] rounded-full bg-[#1f1f1f] overflow-hidden">
              <div
                ref={(el) => { masterRefs.current[ch] = el; }}
                className="h-full rounded-full"
                style={{ width: "0%", background: "linear-gradient(90deg, #3dbb6e 0%, #3dbb6e 60%, #e8a838 82%, #e85454 100%)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ── Library panel ─────────────────────────────────────────────── */
const RAIL: { icon: React.ReactNode; color?: string; divider?: boolean }[] = [
  { icon: <I.Star /> },
  { icon: <span className="w-2 h-2 rounded-full" style={{ background: "#7c3aed" }} /> },
  { icon: <span className="w-2 h-2 rounded-full" style={{ background: "#f97316" }} /> },
  { icon: <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} /> },
  { icon: <span className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />, divider: true },
  { icon: <I.Note /> },
  { icon: <I.Grid /> },
  { icon: <I.Keys /> },
  { icon: <I.Sliders /> },
  { icon: <I.Mic /> },
  { icon: <I.Keyboard /> },
  { icon: <I.PlayBox /> },
  { icon: <I.Bars />, divider: true },
  { icon: <I.Box /> },
  { icon: <I.Person /> },
  { icon: <I.Folder /> },
  { icon: <I.FolderPlus /> },
];

const ENTRIES: { name: string; folder?: boolean }[] = [
  { name: "1st Serious Piece.autosave", folder: true },
  { name: "1st Serious Piece.history", folder: true },
  { name: "1st Serious Piece.takes", folder: true },
  { name: "Packs", folder: true },
  { name: "Recordings", folder: true },
  { name: "Renders", folder: true },
  { name: "User Library", folder: true },
  { name: "presets", folder: true },
  { name: "(album) 128 bpm D MIN CurrentSuspect.flac" },
  { name: "Baby Keem - Ca$ino.flac" },
  { name: "Bktherula - CODE.flac" },
  { name: "Che - Promoting Violence.flac" },
  { name: "CurrentSuspect - ANSWERS.flac" },
  { name: "North West - Aishite (愛して).flac" },
  { name: "North West - W0ah.flac" },
  { name: "PlaqueBoyMax - Super Wrong.flac" },
  { name: "PlaqueBoyMax - Yellow Lamb.flac" },
  { name: "Rapsody - Black Popstar.flac" },
];

export const LibraryPanel = memo(() => {
  const [railActive, setRailActive] = useState(5);
  const [selected, setSelected] = useState(0);
  return (
    <div className="shrink-0 flex flex-col bg-[#0a0a0a] border-r border-[#1c1c1c] overflow-hidden" style={{ width: SIDEBAR_W }}>
      <div className="px-2 pt-2 pb-1.5 shrink-0">
        <div className="h-[34px] rounded-md bg-[#111111] border border-[#1a1a1a] flex items-center px-3 text-[12px] text-neutral-500">
          Search library...
        </div>
      </div>
      <div className="h-7 shrink-0 flex items-center gap-2.5 px-2.5 text-neutral-400">
        <span className="text-[11px] w-[34px]">Library</span>
        <I.ChevronLeft /><I.ChevronRight /><I.ArrowUp />
        <span className="text-[11px] text-neutral-300">Aestra</span>
        <span className="ml-auto flex items-center gap-2.5"><I.Filter /><I.Sort /></span>
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="w-[46px] shrink-0 flex flex-col items-center pt-1">
          {RAIL.map((r, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setRailActive(i)}
                className="w-[34px] h-[28px] rounded-md flex items-center justify-center transition-colors"
                style={{
                  color: railActive === i ? "#fff" : "rgba(255,255,255,0.72)",
                  background: railActive === i ? "#1c1c1c" : "transparent",
                }}
              >
                {r.icon}
              </button>
              {r.divider && <div className="w-5 h-px bg-[#222] my-1" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          {ENTRIES.map((e, i) => (
            <button
              key={e.name}
              onClick={() => setSelected(i)}
              className="relative w-full h-[30px] flex items-center gap-2 pr-2 text-left text-[11.5px] transition-colors"
              style={{
                paddingLeft: e.folder ? 6 : 26,
                color: selected === i ? "#fff" : "rgba(255,255,255,0.80)",
                background: selected === i ? "#141414" : "transparent",
              }}
            >
              {selected === i && <span className="absolute left-0 top-[3px] bottom-[3px] w-[2px] rounded-full bg-violet-500" />}
              {e.folder ? (
                <>
                  <span className="text-neutral-300"><I.ChevronRight /></span>
                  <span className="text-neutral-300"><I.Folder /></span>
                </>
              ) : (
                <span className="text-neutral-400"><I.Wave /></span>
              )}
              <span className="truncate">{e.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ── Tool row (sits left of the ruler, above the track headers) ── */
export type ToolId = "select" | "cut" | "loop" | "paint" | "arrow" | "erase";

export const ToolRow = memo(({ tool, onTool }: { tool: ToolId; onTool: (t: ToolId) => void }) => {
  const [follow, setFollow] = useState(true);
  const btn = "w-[26px] h-[24px] rounded-[5px] flex items-center justify-center transition-colors";
  const idle = { color: "rgba(255,255,255,0.78)" };
  const on = { color: "#fff", background: "rgba(124,58,237,0.55)" };
  return (
    <div className="flex items-center gap-[3px] pl-2">
      <button className={btn} style={idle} title="Add track"><I.Plus /></button>
      <button className={btn} style={tool === "select" ? on : idle} onClick={() => onTool("select")} title="Select (1)"><I.Cursor /></button>
      <button className={btn} style={tool === "cut" ? on : idle} onClick={() => onTool("cut")} title="Split (2)"><I.Split /></button>
      <button className={btn} style={tool === "loop" ? on : idle} onClick={() => onTool("loop")} title="Marquee"><I.Marquee /></button>
      <button className={btn} style={tool === "paint" ? on : idle} onClick={() => onTool("paint")} title="Paint (3)"><I.Brush /></button>
      <button
        className={btn}
        onClick={() => setFollow((v) => !v)}
        title="Follow playhead"
        style={follow ? { color: "#fff", border: "1px solid rgba(167,139,250,0.85)", background: "rgba(124,58,237,0.18)" } : idle}
      >
        <I.ArrowRight />
      </button>
      <button className={btn} style={idle} title="Menu"><I.Menu /></button>
    </div>
  );
});

/* ── Track header buttons: mute / solo / record-arm ─────────────── */
export const TrackButtons = memo(({
  muted, soloed, armed, onMute, onSolo, onArm,
}: { muted: boolean; soloed: boolean; armed: boolean; onMute: () => void; onSolo: () => void; onArm: () => void }) => {
  const b = "w-[24px] h-[22px] rounded flex items-center justify-center transition-colors hover:bg-white/[0.05]";
  return (
    <>
      <button className={b} onClick={onMute} title="Mute" style={{ color: muted ? "#e8a838" : "rgba(255,255,255,0.55)" }}><I.Mute /></button>
      <button className={b} onClick={onSolo} title="Solo" style={{ color: soloed ? "#3dbb6e" : "rgba(255,255,255,0.55)" }}><I.Solo /></button>
      <button className={b} onClick={onArm} title="Record arm" style={{ color: armed ? "#e85454" : "rgba(255,255,255,0.55)" }}><I.Arm /></button>
    </>
  );
});
