import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  BARS, BEATS, HEADER_W, RIGHT_PAD, ROW_H, OVERVIEW_H, RULER_H,
  SESSION_CLIPS, tone, rgba, lightened, clipLevel,
  type SessionClip,
} from "./session";

/* ── SessionLanes ───────────────────────────────────────────────────
   Overview strip, tool row + ruler, track lanes with clips, and the
   playhead for the hero MockTimeline. Layout follows the running app
   (overview above the ruler — v0.7.1 — tools left of the ruler, purple
   beat baseline, pure-black lanes). Playback runs on rAF and writes
   straight to the DOM (playhead, overview head, clip "hot" attribute,
   master meters, scope, time) so a playing preview never re-renders
   React at 60 fps. Clip drawing rules are documented in ./session.ts. */

export type LaneTrack = {
  id: number;
  name: string;
  color: string;
  muted: boolean;
  soloed: boolean;
};

type Props = {
  playing: boolean;
  bpm: number;
  tracks: LaneTrack[];
  selectedTrack: number;
  onSelectTrack: (index: number) => void;
  headerControls: (track: LaneTrack) => React.ReactNode;
  toolbar: React.ReactNode;
  resetToken: number;
  timeTextRef: React.RefObject<HTMLSpanElement>;
  masterRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scopeRef: React.RefObject<SVGPolylineElement>;
};

const pct = (beats: number) => `${(beats / BEATS) * 100}%`;
const LANES_TOP = OVERVIEW_H + RULER_H;

const Hamburger = () => (
  <svg width="7" height="6" viewBox="0 0 7 6" className="absolute left-[6px] top-1/2 -translate-y-1/2" aria-hidden="true">
    <path d="M0 .5h7M0 3h7M0 5.5h7" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
  </svg>
);

/* drawSampleClipForClip + drawSampleClipHeader + drawChannelWaveform */
const AudioClipBody = memo(({ clip, color }: { clip: SessionClip; color: string }) => {
  const body = tone.body(color);
  const ink = tone.ink(color);
  const gid = `wf-${clip.id}`;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(${rgba(body, 0.8)}, ${rgba(body, 0.8)}), #0a0a0a` }} />
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${clip.cols} 100`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={rgba(ink, 1)} stopOpacity="0.52" />
            <stop offset="1" stopColor={rgba(ink, 1)} stopOpacity="0.38" />
          </linearGradient>
        </defs>
        <line x1="0" x2={clip.cols} y1="50" y2="50" stroke={rgba(ink, 0.22)} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d={clip.env} fill={`url(#${gid})`} />
        <path d={clip.rms} fill={rgba(ink, 0.95)} />
      </svg>
      <div
        className="absolute left-px right-px top-px h-[15px] rounded-[2px]"
        style={{ background: "rgba(10,10,10,0.68)", borderBottom: "1px solid rgba(255,255,255,0.16)" }}
      >
        <Hamburger />
        <span className="absolute left-[21px] right-1 top-0 h-full flex items-center text-[9px] leading-none truncate" style={{ color: "rgba(255,255,255,0.93)" }}>
          {clip.name}
        </span>
      </div>
    </>
  );
});

/* drawPatternClipForClip */
const PatternClipBody = memo(({ clip, color }: { clip: SessionClip; color: string }) => {
  const base = tone.raw(color);
  const rows = clip.rows ?? 12;
  const steps = Math.max(4, Math.round(clip.len * 2));
  const guides = Math.min(8, rows);
  const noteFill = rgba(lightened(base, 0.35), 0.92);
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(${rgba(base, 0.28)}, ${rgba(base, 0.28)}), rgba(25,25,25,0.96)` }} />
      <div className="absolute left-px right-px top-px h-[14px] rounded-[2px]" style={{ background: rgba(base, 0.34) }} />
      <div className="absolute left-[1.5px] top-[1.5px] bottom-[1.5px] w-1 rounded-[2px]" style={{ background: rgba(lightened(base, 0.2), 0.95) }} />
      <div className="absolute left-[6px] right-[6px] top-[15px] h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
      <span className="absolute left-[25px] right-1 top-0 h-[15px] flex items-center text-[9.5px] leading-none truncate text-white">
        {clip.name}
      </span>
      <svg
        className="absolute left-[7px] top-[17px]"
        style={{ width: "calc(100% - 11px)", height: "calc(100% - 19px)" }}
        viewBox={`0 0 ${clip.len * 4} ${rows}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {Array.from({ length: guides - 1 }, (_, i) => {
          const y = (rows / guides) * (i + 1);
          return <line key={`g${i}`} x1="0" x2={clip.len * 4} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
        })}
        {Array.from({ length: steps - 1 }, (_, i) => {
          const x = ((i + 1) / steps) * clip.len * 4;
          return (
            <line key={`s${i}`} x1={x} x2={x} y1="0" y2={rows} stroke={(i + 1) % 4 === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.035)"} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          );
        })}
        {clip.notes?.map((n, i) => (
          <rect key={i} x={n.at * 4} y={n.row + 0.1} width={Math.max(0.5, n.len * 4 - 0.25)} height={0.8} fill={noteFill} />
        ))}
      </svg>
    </>
  );
});

export const SessionLanes = memo(({
  playing, bpm, tracks, selectedTrack, onSelectTrack, headerControls, toolbar, resetToken, timeTextRef, masterRefs, scopeRef,
}: Props) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const overviewHeadRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beat = useRef(0);
  const meter = useRef([0, 0]);
  const live = useRef({ playing, bpm, tracks });
  live.current = { playing, bpm, tracks };

  const clipsByTrack = useMemo(() => {
    const byTrack: { clip: SessionClip; index: number }[][] = tracks.map(() => []);
    SESSION_CLIPS.forEach((clip, index) => byTrack[clip.track]?.push({ clip, index }));
    return byTrack;
  }, [tracks.length]);

  const paint = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const { playing: isPlaying, tracks: ts, bpm: tempo } = live.current;
    const laneW = Math.max(1, area.clientWidth - HEADER_W - RIGHT_PAD);
    const b = beat.current;
    const x = HEADER_W + (b / BEATS) * laneW;
    if (headRef.current) headRef.current.style.transform = `translateX(${x}px)`;
    if (overviewHeadRef.current) overviewHeadRef.current.style.transform = `translateX(${x}px)`;

    const anySolo = ts.some((t) => t.soloed);
    let energy = 0;
    SESSION_CLIPS.forEach((c, i) => {
      const t = ts[c.track];
      const audible = !!t && !t.muted && (!anySolo || t.soloed);
      const inside = b >= c.start && b < c.start + c.len;
      const hot = isPlaying && audible && inside;
      if (hot) {
        const l = clipLevel(c, b);
        energy += l * l;
      }
      const node = clipRefs.current[i];
      if (node && hot !== node.hasAttribute("data-hot")) node.toggleAttribute("data-hot", hot);
    });

    const level = Math.min(1, Math.sqrt(energy) * 0.55);
    for (let ch = 0; ch < 2; ch++) {
      const target = ch === 0 ? level : level * 0.94;
      meter.current[ch] = isPlaying ? Math.max(target, meter.current[ch] * 0.86) : 0;
      const el = masterRefs.current[ch];
      if (el) el.style.width = `${(meter.current[ch] * 100).toFixed(1)}%`;
    }

    const scope = scopeRef.current;
    if (scope) {
      const amp = meter.current[0] * 13;
      const phase = b * 5.1;
      let pts = "";
      for (let i = 0; i <= 64; i++) {
        const y = 18 + Math.sin(i * 0.62 + phase) * amp * (0.55 + 0.45 * Math.sin(i * 0.17 + phase * 0.6));
        pts += `${((i * 140) / 64).toFixed(1)},${y.toFixed(1)} `;
      }
      scope.setAttribute("points", pts);
    }

    if (timeTextRef.current) {
      const secs = (b * 60) / tempo;
      timeTextRef.current.textContent = `${Math.floor(secs / 60)}:${(secs % 60).toFixed(2).padStart(5, "0")}`;
    }
  }, [masterRefs, timeTextRef, scopeRef]);

  useEffect(() => {
    if (!playing) {
      paint();
      return;
    }
    let af = 0;
    let last = 0;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
      last = ts;
      const next = beat.current + (dt * live.current.bpm) / 60;
      beat.current = next >= BEATS ? next - BEATS : next;
      paint();
      af = requestAnimationFrame(tick);
    };
    af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [playing, paint]);

  useEffect(() => {
    beat.current = 0;
    paint();
  }, [resetToken, paint]);

  useEffect(() => {
    paint();
  }, [tracks, paint]);

  useEffect(() => {
    const area = areaRef.current;
    if (!area || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => paint());
    ro.observe(area);
    return () => ro.disconnect();
  }, [paint]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const area = areaRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    const x = e.clientX - r.left - HEADER_W;
    if (x < 0) return;
    const laneW = Math.max(1, r.width - HEADER_W - RIGHT_PAD);
    beat.current = Math.max(0, Math.min(BEATS - 0.25, Math.round((x / laneW) * BEATS * 4) / 4));
    paint();
  }, [paint]);

  return (
    <div ref={areaRef} className="relative flex flex-col select-none bg-black" style={{ height: LANES_TOP + tracks.length * ROW_H }}>
      {/* Overview — every lane's clips in its identity colour */}
      <div className="relative shrink-0 bg-[#0a0a0a]" style={{ height: OVERVIEW_H }}>
        <div
          onClick={seek}
          className="absolute top-[5px] bottom-[3px] rounded-[3px] border border-white/30 bg-[#050505] overflow-hidden cursor-pointer"
          style={{ left: HEADER_W, right: RIGHT_PAD }}
        >
          {/* ~16px for 11 lanes leaves ~1.3px each — no gap, or they vanish. */}
          <div className="absolute inset-x-[4px] top-[2px] bottom-[2px]">
            {SESSION_CLIPS.map((c) => {
              const t = tracks[c.track];
              if (!t) return null;
              return (
                <div
                  key={c.id}
                  className="absolute"
                  style={{
                    left: pct(c.start),
                    width: pct(c.len),
                    top: `${(c.track / tracks.length) * 100}%`,
                    height: `${100 / tracks.length}%`,
                    background: rgba(tone.lane(t.color), t.muted ? 0.25 : 0.85),
                  }}
                />
              );
            })}
          </div>
          <span className="absolute left-[1px] top-1/2 -translate-y-1/2 w-[2px] h-[10px] rounded-[1px] bg-neutral-200/80" />
          <span className="absolute right-[1px] top-1/2 -translate-y-1/2 w-[2px] h-[10px] rounded-[1px] bg-neutral-200/80" />
        </div>
        <div
          ref={overviewHeadRef}
          className="absolute left-0 top-[5px] bottom-[3px] w-px bg-violet-300/90 pointer-events-none"
          style={{ transform: `translateX(${HEADER_W}px)` }}
        />
      </div>

      {/* Tools + ruler */}
      <div className="relative shrink-0 flex bg-[#0a0a0a]" style={{ height: RULER_H }}>
        <div className="shrink-0 flex items-center" style={{ width: HEADER_W }}>{toolbar}</div>
        <div onClick={seek} className="relative flex-1 cursor-pointer" style={{ marginRight: RIGHT_PAD }}>
          {Array.from({ length: BARS }, (_, bar) => (
            <React.Fragment key={bar}>
              <span className="absolute top-[3px] text-[10px] tabular-nums text-white/60" style={{ left: `calc(${pct(bar * 4)} + 4px)` }}>
                {bar + 1}
              </span>
              <div
                className="absolute w-px"
                style={{
                  left: pct(bar * 4),
                  top: bar % 4 === 0 ? 2 : 15,
                  bottom: 7,
                  background: bar % 4 === 0 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.16)",
                }}
              />
            </React.Fragment>
          ))}
          <div className="absolute left-0 right-0 h-px" style={{ bottom: 7, background: "rgba(124,58,237,0.75)" }} />
          {Array.from({ length: BEATS + 1 }, (_, i) => (
            <div key={i} className="absolute w-px" style={{ left: pct(i), bottom: 4, height: 7, background: "rgba(139,92,246,0.9)" }} />
          ))}
        </div>
      </div>

      {/* Lanes */}
      <div className="relative flex-1 bg-black" onClick={seek}>
        <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: HEADER_W, right: RIGHT_PAD }}>
          {Array.from({ length: BARS + 1 }, (_, bar) => (
            <div
              key={bar}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: pct(bar * 4), background: bar % 4 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.022)" }}
            />
          ))}
        </div>

        {tracks.map((track, idx) => {
          const selected = selectedTrack === idx;
          return (
            <div key={track.id} className="absolute inset-x-0 flex" style={{ top: idx * ROW_H, height: ROW_H }}>
              <div
                onClick={(e) => { e.stopPropagation(); onSelectTrack(idx); }}
                className="relative shrink-0 flex items-center cursor-pointer transition-colors"
                style={{
                  width: HEADER_W,
                  background: selected ? "#110f15" : "#0a0a0a",
                  borderRight: "1px solid #1c1c1c",
                  borderBottom: "1px solid #141414",
                }}
              >
                <div className="absolute left-0 top-[2px] bottom-[2px] w-[3px] rounded-[1px]" style={{ background: rgba(tone.lane(track.color), 0.95) }} />
                <span className="w-8 pl-3 text-[10px] tabular-nums text-white/40">{track.id}</span>
                {/* nameLabel: textPrimary at 0.864, 0.964 when selected (TrackUIComponent.cpp) */}
                <span className="flex-1 min-w-0 truncate text-[13px]" style={{ color: selected ? "rgba(255,255,255,0.964)" : "rgba(255,255,255,0.864)" }}>
                  {track.name}
                </span>
                <div className="flex items-center gap-0.5 pr-2 shrink-0">{headerControls(track)}</div>
              </div>

              <div className="flex-1 relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div className="absolute top-0 bottom-0 left-0" style={{ right: RIGHT_PAD }}>
                  {clipsByTrack[idx]?.map(({ clip, index }) => {
                    const border =
                      clip.kind === "audio"
                        ? rgba(lightened(tone.body(track.color), 0.1), clip.ghost ? 0.23 : 0.58)
                        : rgba(lightened(tone.raw(track.color), 0.18), clip.ghost ? 0.26 : 0.66);
                    return (
                      <div
                        key={clip.id}
                        ref={(el) => { clipRefs.current[index] = el; }}
                        className="mt-clip absolute rounded-[3px] overflow-hidden"
                        style={{
                          left: `calc(${(clip.start / BEATS) * 100}% + 1px)`,
                          width: `calc(${(clip.len / BEATS) * 100}% - 2px)`,
                          top: 3,
                          height: ROW_H - 7,
                          border: `1px solid ${border}`,
                          opacity: track.muted ? 0.4 : 1,
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        }}
                      >
                        {clip.kind === "audio"
                          ? <AudioClipBody clip={clip} color={track.color} />
                          : <PatternClipBody clip={clip} color={track.color} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical scrollbar thumb, as in the app */}
      <div className="absolute right-[4px] w-[6px] rounded-full bg-[#3a3a3a] pointer-events-none" style={{ top: LANES_TOP + 4, height: "30%" }} />

      {/* Playhead — from the ruler baseline down */}
      <div
        ref={headRef}
        className="absolute left-0 bottom-0 z-20 w-px pointer-events-none"
        style={{ top: LANES_TOP - 8, transform: `translateX(${HEADER_W}px)` }}
      >
        <div className="absolute top-0 bottom-0 w-px bg-[#7c3aed]" />
        <div className="absolute -top-[3px] -left-[3.5px] w-2 h-2 rounded-full bg-[#8b5cf6] ring-1 ring-violet-300/60" />
      </div>
    </div>
  );
});
