import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  D, TRACKS, CLIPS, FILES, BARS, BPM, tone, waveform, levelAt, barBeatSixteenth, clockTime,
} from "./emberSession";

/* ── EmberMock ───────────────────────────────────────────────────────
   The Timeline view of the running app (design/ember-palette, Sep 2026):
   title bar with project status, the module transport, the library with
   its rail, lettered M / S / R track keys, and the session. It is laid out
   at the app's own desktop proportions (1280 design px) and scaled to fit,
   so a phone sees it the way it sees a screenshot instead of a cramped
   re-layout.

   Playback runs on rAF and writes straight to the DOM (playhead, position,
   clock, scope, meters); React never re-renders at 60 fps. It autoplays in
   view, respects reduced motion, and stays stopped once a visitor stops it.

   Every region a visitor might ask about carries data-part, so a parts list
   outside the mock can light it up (see Home). */

export type MockPart = "views" | "transport" | "position" | "record" | "output" | "library" | "tracks" | "clip";

const W = 1280;
const TITLE_H = 34;
const TRANSPORT_H = 56;
const LIB_W = 214;
const HEAD_W = 176;
const OVERVIEW_H = 22;
const RULER_H = 26;
const ROW_H = 27;
const RIGHT_PAD = 10;
const LANES_W = W - LIB_W - HEAD_W - RIGHT_PAD;
const BODY_H = OVERVIEW_H + RULER_H + TRACKS.length * ROW_H;
const H = TITLE_H + TRANSPORT_H + BODY_H;

const barX = (bar: number) => (bar / BARS) * LANES_W;

/* ── Glyphs: the app's own icon set (24-unit grid, solid silhouettes) ── */
const G = ({ d, size = 14, evenodd = false }: { d: string; size?: number; evenodd?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="currentColor" fillRule={evenodd ? "evenodd" : undefined} />
  </svg>
);
const ICON = {
  play: "M7 4.2v15.6a1 1 0 0 0 1.5.86l12.3-7.8a1 1 0 0 0 0-1.72L8.5 3.34A1 1 0 0 0 7 4.2z",
  pause: "M6.5 4h3.6v16H6.5z M13.9 4h3.6v16h-3.6z",
  stop: "M5.5 5.5h13v13h-13z",
  record: "M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14z",
  metronome: "M9.2 3h5.6l4.4 17.2H4.8z M11.1 14.5l5.6-7.2 1.2 1-5.4 6.9z",
  mixer: "M5 3h2v18H5z M11 3h2v18h-2z M17 3h2v18h-2z M3 14h6v3H3z M9 7h6v3H9z M15 11h6v3h-6z",
  arsenal: "M3.5 3.5h7v7h-7z M13.5 3.5h7v7h-7z M3.5 13.5h7v7h-7z M13.5 13.5h7v7h-7z",
  piano: "M3 5h18v14H3z M7.7 5h2.6v7H7.7z M13.7 5h2.6v7h-2.6z",
  spark: "M12 1.9L14.65 9.46L22.65 9.64L15.79 13.8Q11.28 18.94 4.93 21.47L7.72 14.49L1.35 9.64L9.35 9.46Z M16.77 15.18L18.58 22.16L10.47 20.56Q13.97 18.37 16.77 15.18Z",
  note: "M8.4 12.9a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8z M10.4 3.2h2.1v13.6h-2.1z M12.5 3.2c3.5 1.2 5.5 3.1 5.7 6.1-1.2-2.3-3.1-3.4-5.7-3.7z",
  pads: "M3.4 3.8h7.6v7.6H3.4z M13 3.8h7.6v7.6H13z M3.4 13h7.6v7.6H3.4z M13 13h7.6v7.6H13z",
  keys: "M3 6H21V18H3Z M7.7 6H10.3V13H7.7Z M13.7 6H16.3V13H13.7Z M8.55 13H9.45V18H8.55Z M14.55 13H15.45V18H14.55Z",
  sliders: "M4.6 3.2h1.8v17.6H4.6z M11.1 3.2h1.8v17.6h-1.8z M17.6 3.2h1.8v17.6h-1.8z M2.4 6.4h6.2V10H2.4z M8.9 13h6.2v3.6H8.9z M15.4 8.6h6.2v3.6h-6.2z",
  samples: "M2.4 9h2.2v6H2.4z M6.8 5.4H9v13.2H6.8z M11.2 7.8h2.2v8.4h-2.2z M15.6 4h2.2v16h-2.2z M20 8.6h2.2v6.8H20z",
  packs: "M7.4 1.9H16.6A1.3 1.3 0 0 1 17.9 3.2V4.4H6.1V3.2A1.3 1.3 0 0 1 7.4 1.9Z M5.4 5.4H18.6A1.3 1.3 0 0 1 19.9 6.7V7.9H4.1V6.7A1.3 1.3 0 0 1 5.4 5.4Z M4.2 9.2H19.8A1.7 1.7 0 0 1 21.5 10.9V19.3A1.7 1.7 0 0 1 19.8 21H4.2A1.7 1.7 0 0 1 2.5 19.3V10.9A1.7 1.7 0 0 1 4.2 9.2Z M6.4 13.9H8V16.1H6.4Z M9.6 12.3H11.2V17.7H9.6Z M12.8 13.2H14.4V16.8H12.8Z M16 12.8H17.6V17.2H16Z",
  user: "M5 2.5H19A2.5 2.5 0 0 1 21.5 5V19A2.5 2.5 0 0 1 19 21.5H5A2.5 2.5 0 0 1 2.5 19V5A2.5 2.5 0 0 1 5 2.5Z M12 5.6A3.3 3.3 0 1 0 12.01 5.6Z M5.6 19.4C6.3 15.9 8.8 13.9 12 13.9S17.7 15.9 18.4 19.4Z",
  folder: "M2.5 6.3A1.8 1.8 0 0 1 4.3 4.5H9.2L11.2 6.5H19.7A1.8 1.8 0 0 1 21.5 8.3V17.7A1.8 1.8 0 0 1 19.7 19.5H4.3A1.8 1.8 0 0 1 2.5 17.7Z M4.5 9.3H19.5V10.8H4.5Z",
  search: "M10.4 3.2a7.2 7.2 0 1 0 4.55 12.78l4.03 4.03 1.7-1.7-4.03-4.03A7.2 7.2 0 0 0 10.4 3.2Zm0 2.4a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Z",
  select: "M6 2.8 6 19.4 10.3 15.2 13.2 21.5 16 20.2 13.1 14 18.9 14Z",
  split: "M2.4 5.6h8v12.8h-8z M13.6 5.6h8v12.8h-8z M11.3 2.6h1.4v18.8h-1.4z",
  marquee: "M3 3h7v2.1H5.1V10H3V3zm11 0h7v7h-2.1V5.1H14V3zM3 14h2.1v4.9H10V21H3v-7zm15.9 0H21v7h-7v-2.1h4.9V14z",
  pencil: "M15.9 3.1A1.9 1.9 0 0 1 18.6 3.1L20.9 5.4A1.9 1.9 0 0 1 20.9 8.1L9.1 19.9 3.4 20.6 4.1 14.9Z M14.5 6.7L17.3 9.5 18.2 8.6 15.4 5.8Z",
  plus: "M11 4h2v16h-2z M4 11h16v2H4z",
  wave: "M2.1 9.4h1.9v5.2H2.1z M5.2 6.6h1.9v10.8H5.2z M8.3 8.6h1.9v6.8H8.3z M11.4 4.4h1.9v15.2h-1.9z M14.5 7.4h1.9v9.2h-1.9z M17.6 5.8h1.9v12.4h-1.9z M20.7 9.8h1.9v4.4h-1.9z",
};

/* ── Small pieces ─────────────────────────────────────────────────── */
const Cap = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-[9px] font-semibold tracking-[0.08em]" style={{ color: D.t3 }}>{children}</span>
);

const Lamp = ({ on }: { on: boolean }) => (
  <span
    className="w-[6px] h-[6px] rounded-full shrink-0"
    style={{ background: on ? D.warn : D.t4, boxShadow: on ? `0 0 0 3px ${D.warn}38` : "none" }}
  />
);

const Badge = ({ n }: { n: number }) => (
  <span className="mock-badge" aria-hidden="true">{n}</span>
);

type PartProps = { part: MockPart; active?: MockPart | null; n?: number; className?: string; style?: React.CSSProperties; children: React.ReactNode };
const Part = ({ part, active, n, className = "", style, children }: PartProps) => (
  <div data-part={part} data-hot={active === part ? "" : undefined} className={`relative ${className}`} style={style}>
    {children}
    {n !== undefined && <Badge n={n} />}
  </div>
);

export const PART_NUMBER: Record<MockPart, number> = {
  views: 1, transport: 2, position: 3, record: 4, output: 5, library: 6, tracks: 7, clip: 8,
};

/* ── The mock ─────────────────────────────────────────────────────── */
export const EmberMock = memo(({ activePart = null, showBadges = true }: { activePart?: MockPart | null; showBadges?: boolean }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);
  const [chips, setChips] = useState({ countIn: true, wait: false, loop: false, click: false });
  const [mute, setMute] = useState<Set<number>>(() => new Set([2]));
  const [solo, setSolo] = useState<Set<number>>(() => new Set());
  const [arm, setArm] = useState<Set<number>>(() => new Set([12]));
  const [file, setFile] = useState(3);
  const userStopped = useRef(false);
  const bar = useRef(18.25);

  const playheadRef = useRef<HTMLDivElement>(null);
  const overviewHeadRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const scopeRef = useRef<SVGPolylineElement>(null);
  const meterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const meterLevel = useRef([0, 0]);

  const waves = useMemo(() => CLIPS.map((c, i) => waveform(c, i)), []);
  const n = (p: MockPart) => (showBadges ? PART_NUMBER[p] : undefined);
  const audible = useCallback((t: number) => !mute.has(t) && (solo.size === 0 || solo.has(t)), [mute, solo]);
  const live = useRef({ playing, audible });
  live.current = { playing, audible };

  /* Fit the 1280-px design to the frame. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paint = useCallback(() => {
    const b = bar.current;
    const x = barX(b);
    if (playheadRef.current) playheadRef.current.style.transform = `translateX(${x}px)`;
    if (overviewHeadRef.current) overviewHeadRef.current.style.transform = `translateX(${x}px)`;
    const [bb, beat, six] = barBeatSixteenth(b);
    if (posRef.current) posRef.current.innerHTML = `${bb}<i>.</i>${beat}<i>.</i>${six}`;
    if (clockRef.current) clockRef.current.textContent = clockTime(b);

    const { playing: isPlaying, audible: isAudible } = live.current;
    let energy = 0;
    if (isPlaying) {
      CLIPS.forEach((c, i) => {
        if (!isAudible(c.track)) return;
        const l = levelAt(c, waves[i].peaks, b);
        energy += l * l;
      });
    }
    const level = Math.min(1, Math.sqrt(energy) * 0.42);
    for (let ch = 0; ch < 2; ch++) {
      const target = ch === 0 ? level : level * 0.95;
      meterLevel.current[ch] = isPlaying ? Math.max(target, meterLevel.current[ch] * 0.86) : 0;
      const el = meterRefs.current[ch];
      if (el) el.style.transform = `scaleY(${meterLevel.current[ch].toFixed(3)})`;
    }
    const scope = scopeRef.current;
    if (scope) {
      const a = meterLevel.current[0] * 11;
      const phase = b * 23;
      let pts = "";
      for (let i = 0; i <= 60; i++) {
        const y = 14 + Math.sin(i * 0.55 + phase) * a * (0.55 + 0.45 * Math.sin(i * 0.15 + phase * 0.4));
        pts += `${((i * 150) / 60).toFixed(1)},${y.toFixed(1)} `;
      }
      scope.setAttribute("points", pts);
    }
  }, [waves]);

  /* Transport clock. */
  useEffect(() => {
    paint();
    if (!playing) return;
    let af = 0;
    let last = 0;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
      last = ts;
      bar.current += (dt * BPM) / 60 / 4;
      if (bar.current >= BARS) bar.current -= BARS;
      paint();
      af = requestAnimationFrame(tick);
    };
    af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [playing, paint]);

  useEffect(() => { paint(); }, [mute, solo, paint]);

  /* Autoplay while in view, unless reduced motion or the visitor stopped it. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (userStopped.current) return;
      setPlaying(e.isIntersecting);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    setPlaying((p) => {
      userStopped.current = p;
      return !p;
    });
  };
  const stop = () => {
    userStopped.current = true;
    setPlaying(false);
    bar.current = 0;
    paint();
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const local = (e.clientX - r.left) / scale;
    bar.current = Math.max(0, Math.min(BARS - 0.01, Math.round((local / LANES_W) * BARS * 4) / 4));
    paint();
  };
  const flip = (set: Set<number>, t: number) => {
    const next = new Set(set);
    if (next.has(t)) next.delete(t); else next.add(t);
    return next;
  };

  const clipPart = CLIPS.findIndex((c) => c.track === 4 && c.start === 8);

  return (
    <div
      ref={frameRef}
      className="ember-mock relative w-full overflow-hidden select-none"
      style={{ height: H * scale, background: D.bed }}
      aria-label="Aestra's Timeline view, recreated: press play, mute or solo tracks, click the ruler to move the playhead."
      role="group"
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})`, fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif", color: D.t1 }}>
        {/* ── Title bar ── */}
        <div className="flex items-center justify-between px-3 text-[11.5px]" style={{ height: TITLE_H, background: D.panel, borderBottom: `1px solid ${D.border}` }}>
          <div className="flex gap-4 flex-1" style={{ color: D.t2 }}><span>File</span><span>Edit</span><span>View</span><span>Help</span></div>
          <Part part="views" active={activePart} n={n("views")}>
            <div className="flex p-[2px] rounded-[7px]" style={{ background: D.bed, border: `1px solid ${D.border}` }}>
              {["Arsenal", "Timeline", "Audition"].map((v) => (
                <span
                  key={v}
                  className="px-[18px] h-[22px] flex items-center rounded-[5px]"
                  style={v === "Timeline"
                    ? { background: "rgba(124,58,237,0.32)", color: D.t1, boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.7)" }
                    : { color: D.t3 }}
                >
                  {v}
                </span>
              ))}
            </div>
          </Part>
          <div className="flex items-center justify-end gap-3 flex-1 whitespace-nowrap" style={{ color: D.t2 }}>
            <span style={{ color: D.t1 }}>Night Drive</span>
            <span className="flex items-center gap-1.5"><span className="w-[6px] h-[6px] rounded-full" style={{ background: D.success }} />Saved</span>
            <span className="w-px h-4" style={{ background: D.divider }} />
            <span>Signed out <span style={{ color: D.t4 }}>·</span> Core</span>
            <span className="flex gap-4 pl-2" style={{ color: D.t1 }} aria-hidden="true">
              <span>–</span><span>▢</span><span>✕</span>
            </span>
          </div>
        </div>

        {/* ── Transport ── */}
        <div className="flex" style={{ height: TRANSPORT_H, background: D.panel, borderBottom: `1px solid ${D.border}` }}>
          <Part part="transport" active={activePart} n={n("transport")} className="flex items-center gap-[6px] pl-[10px] pr-[14px]" style={{ borderRight: `1px solid ${D.divider}` }}>
            {[
              { key: "play", on: playing, onClick: togglePlay, icon: playing ? ICON.pause : ICON.play, label: playing ? "Pause" : "Play", color: playing ? "#fff" : D.t2, bg: playing ? D.primary : D.control },
              { key: "stop", on: false, onClick: stop, icon: ICON.stop, label: "Stop", color: D.t2, bg: D.control },
              { key: "rec", on: armed, onClick: () => setArmed((a) => !a), icon: ICON.record, label: "Record", color: armed ? D.chrome : D.error, bg: armed ? D.error : D.control },
            ].map((b) => (
              <button
                key={b.key}
                onClick={b.onClick}
                aria-label={b.label}
                aria-pressed={b.key === "stop" ? undefined : b.on}
                className="w-[34px] h-[30px] rounded-[5px] grid place-items-center transition-colors"
                style={{ background: b.bg, color: b.color, boxShadow: b.on ? "none" : `inset 0 0 0 1px ${D.border}` }}
              >
                <G d={b.icon} size={15} />
              </button>
            ))}
          </Part>

          <Part part="position" active={activePart} n={n("position")} className="w-[164px] px-[14px] pt-[8px]" style={{ borderRight: `1px solid ${D.divider}` }}>
            <Cap>POSITION</Cap>
            <div className="flex items-baseline gap-[9px] mt-[3px]">
              <span ref={posRef} className="mock-pos text-[21px] font-medium tabular-nums leading-none">19<i>.</i>2<i>.</i>1</span>
              <span ref={clockRef} className="text-[11px] tabular-nums" style={{ color: D.t2 }}>0:38.57</span>
            </div>
          </Part>

          <div className="w-[142px] px-[14px] pt-[8px]" style={{ borderRight: `1px solid ${D.divider}` }}>
            <Cap>TEMPO</Cap>
            <div className="flex items-baseline gap-[6px] mt-[4px]">
              <span className="text-[18px] font-medium tabular-nums leading-none">112.00</span>
              <span className="text-[9px]" style={{ color: D.t3 }}>BPM</span>
              <span className="text-[13px] ml-[6px]" style={{ color: D.t2 }}>4/4</span>
            </div>
          </div>

          <Part part="record" active={activePart} n={n("record")} className="px-[14px] pt-[8px]" style={{ borderRight: `1px solid ${D.divider}` }}>
            <Cap>RECORD</Cap>
            <div className="flex gap-[4px] mt-[4px]">
              {([["countIn", "Count-in"], ["wait", "Wait"], ["loop", "Loop record"], ["click", ""]] as const).map(([k, label]) => {
                const on = chips[k];
                return (
                  <button
                    key={k}
                    onClick={() => setChips((c) => ({ ...c, [k]: !c[k] }))}
                    aria-pressed={on}
                    aria-label={label || "Metronome"}
                    className="h-[22px] px-[8px] rounded-[4px] flex items-center gap-[6px] text-[11px] font-medium"
                    style={{ background: on ? D.control : "transparent", color: on ? D.t1 : D.t2, boxShadow: `inset 0 0 0 1px ${on ? D.borderStrong : D.border}` }}
                  >
                    <Lamp on={on} />
                    {label || <G d={ICON.metronome} size={13} evenodd />}
                  </button>
                );
              })}
            </div>
          </Part>

          <div className="px-[14px] pt-[8px]" style={{ borderRight: `1px solid ${D.divider}` }}>
            <Cap>PANELS</Cap>
            <div className="flex gap-[4px] mt-[2px]" style={{ color: D.t2 }}>
              {[ICON.mixer, ICON.arsenal, ICON.piano].map((d, i) => (
                <span key={i} className="w-[28px] h-[24px] grid place-items-center rounded-[4px]"><G d={d} size={14} evenodd={i === 2} /></span>
              ))}
            </div>
          </div>

          <div className="w-[72px] px-[14px] pt-[8px]" style={{ borderRight: `1px solid ${D.divider}` }}>
            <Cap>KEYS</Cap>
            <div className="mt-[5px] text-[13px]" style={{ color: D.violet }}>C3</div>
          </div>

          <div className="flex-1" />

          <Part part="output" active={activePart} n={n("output")} className="px-[14px] pt-[8px]" style={{ borderLeft: `1px solid ${D.divider}` }}>
            <Cap>OUTPUT</Cap>
            <div className="flex gap-[6px] mt-[3px]">
              <svg width="150" height="28" viewBox="0 0 150 28" aria-hidden="true" style={{ background: D.bed, borderRadius: 3 }}>
                <line x1="0" x2="150" y1="14" y2="14" stroke={D.meter} strokeOpacity="0.22" />
                <polyline ref={scopeRef} points="0,14 150,14" fill="none" stroke={D.meter} strokeOpacity="0.85" strokeWidth="1.2" />
              </svg>
              <div className="w-[60px] h-[28px] flex gap-[3px] justify-center rounded-[3px] py-[2px]" style={{ background: D.bed }}>
                {[0, 1].map((ch) => (
                  <div key={ch} className="relative w-[7px] h-full overflow-hidden rounded-[1px]" style={{ background: "#090807" }}>
                    <div
                      ref={(el) => { meterRefs.current[ch] = el; }}
                      className="absolute inset-0 origin-bottom"
                      style={{ transform: "scaleY(0)", background: `linear-gradient(to top, ${D.meter} 0 62%, ${D.warn} 84%, ${D.error})` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Part>
        </div>

        {/* ── Body ── */}
        <div className="flex" style={{ height: BODY_H }}>
          {/* Library */}
          <Part part="library" active={activePart} n={n("library")} className="shrink-0 flex flex-col" style={{ width: LIB_W, background: D.chrome, borderRight: `1px solid ${D.border}` }}>
            <div className="m-[8px] mb-[6px] h-[26px] rounded-[5px] flex items-center gap-[7px] px-[9px] text-[11px]" style={{ background: D.bed, color: D.t3, boxShadow: `inset 0 0 0 1px ${D.border}` }}>
              <G d={ICON.search} size={12} />Search library...
            </div>
            <div className="flex flex-1 min-h-0">
              <div className="w-[34px] shrink-0 flex flex-col items-center gap-[3px] pt-[2px]" style={{ color: D.t2 }}>
                <span style={{ color: D.t1 }}><G d={ICON.spark} size={13} /></span>
                {["#7c3aed", "#f97316", "#22c55e", "#3b82f6"].map((c) => (
                  <span key={c} className="w-[7px] h-[7px] rounded-full my-[4px]" style={{ background: c, opacity: 0.85 }} />
                ))}
                <span className="w-4 h-px my-[3px]" style={{ background: D.divider }} />
                {[ICON.note, ICON.pads, ICON.keys, ICON.sliders, ICON.samples].map((d, i) => (
                  <span key={i} className="h-[20px] grid place-items-center" style={i === 4 ? { color: D.t1 } : undefined}><G d={d} size={13} evenodd={i === 2} /></span>
                ))}
                <span className="w-4 h-px my-[3px]" style={{ background: D.divider }} />
                {[ICON.packs, ICON.user, ICON.folder].map((d, i) => (
                  <span key={i} className="h-[20px] grid place-items-center"><G d={d} size={13} evenodd /></span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="px-[6px] pb-[6px] text-[10.5px]" style={{ color: D.t3 }}>Stems · 14 files</div>
                {FILES.map((f, i) => (
                  <button
                    key={f}
                    onClick={() => setFile(i)}
                    className="relative w-full h-[23px] flex items-center gap-[7px] px-[6px] text-left text-[11px]"
                    style={{ background: file === i ? D.raised : "transparent", color: file === i ? D.t1 : D.t2 }}
                  >
                    {file === i && <span className="absolute left-0 top-[3px] bottom-[3px] w-[2px] rounded-full" style={{ background: D.primary }} />}
                    <span style={{ color: D.t4 }}><G d={ICON.wave} size={11} /></span>
                    <span className="truncate">{f}</span>
                  </button>
                ))}
              </div>
            </div>
          </Part>

          {/* Headers + lanes */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* overview row */}
            <div className="flex shrink-0" style={{ height: OVERVIEW_H, background: D.panel, borderBottom: `1px solid ${D.divider}` }}>
              <div className="shrink-0" style={{ width: HEAD_W, borderRight: `1px solid ${D.border}` }} />
              <div className="relative" style={{ width: LANES_W }}>
                <div className="absolute inset-x-0 top-[3px] bottom-[3px] rounded-[3px] overflow-hidden" style={{ background: D.bed, boxShadow: `inset 0 0 0 1px ${D.borderStrong}` }}>
                  {CLIPS.map((c) => (
                    <span
                      key={c.id}
                      className="absolute"
                      style={{
                        left: barX(c.start), width: Math.max(1, barX(c.end) - barX(c.start) - 1),
                        top: 2 + (c.track / TRACKS.length) * (OVERVIEW_H - 10), height: Math.max(1, (OVERVIEW_H - 10) / TRACKS.length),
                        background: tone(TRACKS[c.track].slot).lane, opacity: audible(c.track) ? 0.9 : 0.25,
                      }}
                    />
                  ))}
                </div>
                <div ref={overviewHeadRef} className="absolute top-[3px] bottom-[3px] w-px" style={{ left: 0, background: D.violet }} />
              </div>
            </div>

            {/* tools + ruler */}
            <div className="flex shrink-0" style={{ height: RULER_H, background: D.panel }}>
              <div className="shrink-0 flex items-center gap-[2px] px-[6px]" style={{ width: HEAD_W, borderRight: `1px solid ${D.border}`, color: D.t2 }}>
                {[ICON.plus, ICON.select, ICON.split, ICON.marquee, ICON.pencil].map((d, i) => (
                  <span
                    key={i}
                    className="w-[24px] h-[21px] grid place-items-center rounded-[4px]"
                    style={i === 1 ? { background: D.raised, color: D.t1, boxShadow: `inset 0 -2px 0 ${D.primary}` } : undefined}
                  >
                    <G d={d} size={13} evenodd={i === 4} />
                  </span>
                ))}
              </div>
              <div className="relative cursor-pointer" style={{ width: LANES_W }} onClick={seek}>
                {Array.from({ length: BARS }, (_, b) => (
                  <React.Fragment key={b}>
                    <span className="absolute w-px" style={{ left: barX(b), top: b % 4 === 0 ? 5 : 13, bottom: 1, background: b % 4 === 0 ? D.t2 : D.t4 }} />
                    {(b % 2 === 0) && (
                      <span className="absolute top-[4px] text-[9.5px] tabular-nums" style={{ left: barX(b) + 3, color: b % 4 === 0 ? D.t1 : D.t3 }}>{b + 1}</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="absolute inset-x-0 bottom-0 h-px" style={{ background: D.primary }} />
              </div>
            </div>

            {/* rows */}
            <div className="relative flex-1">
              {/* grid */}
              <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: HEAD_W, width: LANES_W }}>
                {Array.from({ length: BARS + 1 }, (_, b) => (
                  <span key={b} className="absolute top-0 bottom-0 w-px" style={{ left: barX(b), background: b % 4 === 0 ? "rgba(238,233,225,0.09)" : "rgba(238,233,225,0.045)" }} />
                ))}
              </div>

              {TRACKS.map((t, i) => {
                const toneT = tone(t.slot);
                const on = audible(i);
                return (
                  <div key={t.name} className="absolute inset-x-0 flex" style={{ top: i * ROW_H, height: ROW_H }}>
                    <div className="shrink-0 relative flex items-center" style={{ width: HEAD_W, background: D.chrome, borderRight: `1px solid ${D.border}`, borderBottom: `1px solid ${D.divider}` }}>
                      <span className="absolute left-0 top-[2px] bottom-[2px] w-[2px]" style={{ background: toneT.lane }} />
                      <span className="w-[22px] pl-[8px] text-[8.5px] tabular-nums" style={{ color: D.t4 }}>{i + 1}</span>
                      <span className="flex-1 min-w-0 truncate text-[12px]" style={{ color: on ? D.t1 : D.t3 }}>{t.name}</span>
                      <span className="flex gap-[4px] pr-[7px]">
                        {([["M", mute, setMute, D.warn], ["S", solo, setSolo, D.violet], ["R", arm, setArm, D.error]] as const).map(([k, set, setter, color]) => {
                          const active = set.has(i);
                          return (
                            <button
                              key={k}
                              onClick={() => setter((s: Set<number>) => flip(s, i))}
                              aria-label={`${k === "M" ? "Mute" : k === "S" ? "Solo" : "Arm"} ${t.name}`}
                              aria-pressed={active}
                              className="w-[19px] h-[18px] rounded-[3px] text-[9px] font-semibold grid place-items-center"
                              style={active ? { background: color, color: D.chrome } : { color: D.t2, boxShadow: `inset 0 0 0 1px ${D.border}` }}
                            >
                              {k}
                            </button>
                          );
                        })}
                      </span>
                    </div>
                    <div className="relative cursor-pointer" style={{ width: LANES_W }} onClick={seek}>
                      {CLIPS.map((c, ci) => {
                        if (c.track !== i) return null;
                        const wv = waves[ci];
                        const isPart = ci === clipPart;
                        return (
                          <div
                            key={c.id}
                            data-part={isPart ? "clip" : undefined}
                            data-hot={isPart && activePart === "clip" ? "" : undefined}
                            className="absolute overflow-hidden rounded-[2px]"
                            style={{
                              left: barX(c.start), width: barX(c.end) - barX(c.start) - 1,
                              top: 1, height: ROW_H - 2,
                              background: toneT.body, boxShadow: `inset 0 1px 0 ${toneT.edge}`,
                              opacity: on ? 1 : 0.35,
                            }}
                          >
                            <span className="absolute left-[4px] top-[3px] w-[7px] h-[5px]" style={{ background: `repeating-linear-gradient(${toneT.label} 0 1px, transparent 1px 2px)` }} />
                            <span className="absolute left-[15px] right-[3px] top-[1px] text-[8.5px] font-semibold leading-[10px] truncate" style={{ color: toneT.label }}>{t.name}</span>
                            <svg className="absolute left-0 right-0 bottom-[1px]" style={{ height: ROW_H - 13, width: "100%" }} viewBox={`0 0 ${wv.cols} 100`} preserveAspectRatio="none" aria-hidden="true">
                              <path d={wv.env} fill={toneT.ink} fillOpacity="0.5" />
                              <path d={wv.rms} fill={toneT.ink} fillOpacity="0.95" />
                            </svg>
                            {isPart && showBadges && <span className="mock-badge mock-badge-in" aria-hidden="true">{PART_NUMBER.clip}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <Part part="tracks" active={activePart} n={n("tracks")} className="absolute left-0 top-0 pointer-events-none" style={{ width: HEAD_W, height: TRACKS.length * ROW_H }}>
                <span />
              </Part>

              {/* playhead */}
              <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: HEAD_W, width: LANES_W }}>
                <div ref={playheadRef} className="absolute top-0 bottom-0 w-px" style={{ left: 0, background: "rgba(238,233,225,0.9)" }}>
                  <span className="absolute -top-[7px] -left-[5px] w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid ${D.violet}` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
