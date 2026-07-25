import React, { useState, useEffect, memo } from "react";
import { Check } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FadeIn } from "../components/ui";
import type { PageProps } from "../types";

const EngineVisual = memo(() => {
  const ROWS: [string, number, string, string][] = [
    ["CPU",      18, "bg-accent/70",   "18%"],
    ["RAM",      22, "bg-accent/60",   "340mb"],
    ["Latency",   8, "bg-accent/50",   "8ms"],
    ["Dropouts",  0, "bg-emerald-500", "0"],
  ];
  const [widths, setWidths] = useState([0, 0, 0, 0]);
  useEffect(() => {
    const t = setTimeout(() => setWidths(ROWS.map((r) => r[1])), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-xs">
      <div className="space-y-2.5">
        {ROWS.map(([label, w, c, v], i) => (
          <div
            key={label}
            className="flex items-center gap-3 cursor-default"
            onMouseEnter={() => setWidths((prev) => prev.map((x, j) => j === i ? Math.min(95, w + Math.random() * 12) : x))}
          >
            <div className="w-14 font-mono text-[10px] text-muted uppercase tracking-[0.14em] shrink-0">{label}</div>
            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${c} transition-all duration-700 ease-out`}
                style={{ width: `${widths[i]}%` }}
              />
            </div>
            <div className="w-12 text-right text-[11px] font-mono text-fg-muted">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 divide-x divide-border/80 rounded-lg border border-border/80 bg-bg">
        {[
          { v: "8ms",  l: "Latency",  c: "text-fg" },
          { v: "0",    l: "Dropouts", c: "text-emerald-400" },
          { v: "18%",  l: "CPU",      c: "text-fg" },
        ].map((s) => (
          <div key={s.l} className="text-center py-4">
            <div className={`text-xl font-semibold tracking-tight ${s.c}`}>{s.v}</div>
            <div className="font-mono text-[10px] text-muted uppercase tracking-[0.14em] mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const TerminalVisual = memo(() => {
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = ((now - start) % 2400) / 2400;
      setProgress(Math.min(100, t * 100));
      setTick(Math.floor(t * 4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const checks = [
    "audio engine ready",
    "last session restored",
    "plugins loaded",
  ];

  return (
    <div className="w-full max-w-md rounded-lg border border-border/80 bg-bg overflow-hidden">
      <div className="h-8 px-3 border-b border-border/80 bg-surface-2/50 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-surface-3" />
        <span className="w-2.5 h-2.5 rounded-full bg-surface-3" />
        <span className="w-2.5 h-2.5 rounded-full bg-surface-3" />
        <span className="ml-2 text-[11px] text-muted font-mono">aestra — launch</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-relaxed space-y-1">
        <div className="text-dim line-through">› scanning VST folders…</div>
        <div className="text-dim line-through">› loading splash screen…</div>
        <div className="text-dim line-through">› negotiating audio device…</div>
        <div className="h-2" />
        {checks.map((c, i) => (
          <div
            key={c}
            className={`transition-opacity ${tick > i ? "text-emerald-400 opacity-100" : "text-emerald-400/30"}`}
          >
            ✓ {c}
          </div>
        ))}
        <div className="text-accent">› ready</div>
      </div>
      <div className="px-4 py-3 border-t border-border/80 space-y-1.5">
        <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-fg font-mono tracking-tight">1.4s</span>
          <span className="text-[11px] text-muted">from launch to beat</span>
        </div>
      </div>
    </div>
  );
});

const PatternVisual = memo(() => {
  /* Lanes differ by accent intensity, not hue — the way velocity
     reads on a real step sequencer. Four unrelated colours made this
     look like a swatch board. */
  const PATTERNS: [string, number[], string][] = [
    ["KICK",  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], "bg-accent"],
    ["SNARE", [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], "bg-accent/75"],
    ["HAT",   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1], "bg-accent/45"],
    ["808",   [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0], "bg-fg/85"],
  ];
  const [patterns, setPatterns] = useState(PATTERNS.map(([l, p, c]) => [l, p.slice(), c] as [string, number[], string]));
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setStep((s) => (s + 1) % 16), 86);
    return () => clearInterval(t);
  }, [playing]);

  const toggleCell = (rowIdx: number, colIdx: number) => {
    setPatterns((prev) => {
      const next = prev.slice();
      const [label, pat, color] = next[rowIdx];
      const newPat = pat.slice();
      newPat[colIdx] = newPat[colIdx] ? 0 : 1;
      next[rowIdx] = [label, newPat, color];
      return next;
    });
  };

  const onPlay = () => {
    setPlaying((p) => !p);
    if (!playing) setStep(0);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted font-mono">PATTERN_03 — main loop</span>
        <span className="text-[11px] text-accent font-mono">140 BPM</span>
      </div>
      <div className="space-y-1.5">
        {patterns.map(([label, pattern, color], rowIdx) => (
          <div key={String(label)} className="flex items-center gap-2">
            <div className="w-10 text-[9px] tracking-wider text-muted font-mono uppercase">{label}</div>
            <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1 flex-1">
              {pattern.map((on, i) => (
                <button
                  key={i}
                  onClick={() => toggleCell(rowIdx, i)}
                  aria-label={`${label} step ${i + 1}`}
                  className={`h-3.5 rounded-sm transition-colors ${
                    on ? color : "bg-surface-2"
                  } ${playing && i === step ? "ring-1 ring-fg/40" : ""}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onPlay}
          className={`w-7 h-7 rounded-md text-white flex items-center justify-center transition-colors ${
            playing ? "bg-accent-hover" : "bg-accent hover:bg-accent-hover"
          }`}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="9" height="9" viewBox="0 0 10 12" fill="currentColor"><rect x="1" y="1" width="3" height="10" rx="1"/><rect x="6" y="1" width="3" height="10" rx="1"/></svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 10 12" fill="currentColor"><path d="M1 1l8 5-8 5V1z"/></svg>
          )}
        </button>
        <span className="text-[10px] text-muted font-mono">1.1.0</span>
        <span className="ml-auto text-[10px] text-muted font-mono">{playing ? `step ${step + 1}/16` : "16 steps"}</span>
      </div>
    </div>
  );
});

/* One signal colour, three opacities. Routing graphs read by shape and
   motion, not by hue — three unrelated colours only made it noisier. */
const SIG = "var(--color-accent)";

const RoutingVisual = memo(() => {
  const [hovered, setHovered] = useState<number | null>(null);
  const sources: { id: number; cx: number; cy: number; label: string; path: string }[] = [
    { id: 0, cx: 40, cy: 50,  label: "KICK",  path: "M 54 50 C 100 50 110 90 145 90" },
    { id: 1, cx: 40, cy: 90,  label: "808",   path: "M 54 90 L 145 90" },
    { id: 2, cx: 40, cy: 130, label: "SYNTH", path: "M 54 130 C 100 130 110 90 145 90" },
  ];
  return (
    <div className="w-full max-w-md aspect-[16/9]">
      <svg viewBox="0 0 320 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {sources.map((s) => (
          <path
            key={s.id}
            d={s.path}
            stroke={SIG}
            strokeWidth={hovered === s.id ? 2.5 : 1.5}
            strokeOpacity={hovered === null ? 0.25 : hovered === s.id ? 1 : 0.1}
            fill="none"
            className="transition-all"
          />
        ))}
        <path d="M 195 90 L 240 90" stroke={SIG} strokeOpacity="0.3" strokeWidth="2" fill="none"/>
        {hovered === null && (
          <>
            <circle r="3" fill={SIG} opacity="0.8">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 54 50 C 100 50 110 90 145 90" />
            </circle>
            <circle r="3" fill={SIG} opacity="0.5">
              <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s" path="M 54 130 C 100 130 110 90 145 90" />
            </circle>
            <circle r="3" fill={SIG} opacity="0.65">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.3s" path="M 54 90 L 145 90" />
            </circle>
          </>
        )}
        {hovered !== null && (
          <circle r="4" fill={SIG}>
            <animateMotion dur="1.4s" repeatCount="indefinite" path={sources[hovered].path} />
          </circle>
        )}
        <circle r="4" fill={SIG} opacity="0.9">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s" path="M 195 90 L 240 90" />
        </circle>
        {sources.map((s) => (
          <g key={s.id} onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
            <circle cx={s.cx} cy={s.cy} r="18" fill={SIG} fillOpacity={hovered === s.id ? 0.25 : 0.08} stroke={SIG} strokeOpacity={hovered === s.id ? 0.9 : 0.3} strokeWidth="1" className="transition-all"/>
            <text x={s.cx} y={s.cy + 3} textAnchor="middle" fontSize="8" fill={SIG} fontFamily="Geist Mono, monospace">{s.label}</text>
          </g>
        ))}
        <path d="M 145 90 L 170 70 L 195 90 L 170 110 Z" fill={SIG} fillOpacity="0.08" stroke={SIG} strokeOpacity="0.45" strokeWidth="1"/>
        <text x="170" y="88" textAnchor="middle" fontSize="8" fill={SIG} fontFamily="Geist Mono, monospace">FX BUS</text>
        <text x="170" y="100" textAnchor="middle" fontSize="7" fill={SIG} fillOpacity="0.7" fontFamily="Geist Mono, monospace">EQ + VERB</text>
        <rect x="240" y="68" width="60" height="44" rx="8" fill={SIG} fillOpacity="0.14" stroke={SIG} strokeOpacity="0.55" strokeWidth="1"/>
        <text x="270" y="88" textAnchor="middle" fontSize="8" fill={SIG} fontFamily="Geist Mono, monospace">MASTER</text>
        <text x="270" y="102" textAnchor="middle" fontSize="7" fill={SIG} fillOpacity="0.7" fontFamily="Geist Mono, monospace">−3.2 dB</text>
        <circle cx="260" cy="160" r="3" fill="var(--color-success)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <text x="270" y="163" fontSize="8" fill="var(--color-success)" fontFamily="Geist Mono, monospace">LIVE</text>
      </svg>
    </div>
  );
});

const AuditionVisual = memo(() => {
  const [active, setActive] = useState(0);
  const devices: { name: string; sub: string; border: string; eq: number[] }[] = [
    { name: "Laptop speaker",   sub: "The most unforgiving room you own", border: "border-accent/30 bg-accent/5", eq: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "AirPods Pro",      sub: "How most people will hear it",      border: "border-accent/30 bg-accent/5", eq: [-2, -1, 1, 3, 2, -1, -2, -3] },
    { name: "Car audio",        sub: "Where the low end lies to you",     border: "border-accent/30 bg-accent/5", eq: [-4, -2, 4, 5, 2, -1, -3, -4] },
    { name: "Spotify loudness", sub: "After streaming turns it down",     border: "border-accent/30 bg-accent/5", eq: [-3, -2, 0, 1, 1, 0, -2, -3] },
  ];
  const activeDevice = devices[active];
  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="rounded-lg border border-border/80 bg-bg p-3">
        <div className="font-mono text-[10px] text-muted uppercase tracking-[0.14em] mb-2">Frequency response</div>
        <svg viewBox="0 0 200 50" className="w-full h-12" preserveAspectRatio="none">
          {activeDevice.eq.map((v, i) => {
            const x = (i / 7) * 200;
            const y = 25 - v * 4;
            return <line key={i} x1={x} y1={y} x2={x} y2={25} stroke={SIG} strokeWidth="2" opacity="0.55" />;
          })}
          <line x1="0" y1="25" x2="200" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />
        </svg>
        <div className="flex justify-between text-[9px] text-muted mt-1 font-mono">
          <span>20Hz</span><span>1k</span><span>20k</span>
        </div>
      </div>
      <div className="space-y-2">
        {devices.map((d, idx) => (
          <button
            key={d.name}
            onClick={() => setActive(idx)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border bg-bg hover:border-border-2 transition-colors text-left ${
              active === idx ? d.border : "border-border/80"
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${active === idx ? "bg-accent" : "bg-surface-3"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-fg text-sm font-medium truncate">{d.name}</div>
              <div className="text-muted text-xs truncate">{d.sub}</div>
            </div>
            {active === idx && <Check className="w-3.5 h-3.5 text-accent" />}
          </button>
        ))}
      </div>
    </div>
  );
});

const VersionVisual = memo(() => (
  <div className="w-full max-w-xs space-y-2">
    {[
      { name: "rough_bounce",     meta: "3 days ago · where it started",   dot: "bg-border-3" },
      { name: "with_808_rewrite", meta: "yesterday · branched from rough", dot: "bg-border-3" },
      { name: "final_mix_v3",     meta: "2 hours ago · current",           dot: "bg-accent", active: true },
      { name: "alt_intro_idea",   meta: "1 hour ago · experiment",         dot: "bg-border-3" },
    ].map((b) => (
      <div
        key={b.name}
        className={`flex items-center gap-3 p-3 rounded-lg border bg-bg ${
          b.active ? "border-accent/30 bg-accent/[0.05]" : "border-border/80"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${b.active ? "text-fg" : "text-fg-muted"}`}>{b.name}</div>
          <div className="text-[11px] text-muted">{b.meta}</div>
        </div>
      </div>
    ))}
    <button
      type="button"
      aria-label="Compare all takes"
      className="w-full mt-2 h-9 rounded-lg border border-border text-fg-muted text-sm hover:bg-surface-2 transition-colors"
    >
      Compare takes
    </button>
  </div>
));

const sections = [
  {
    title: "Stays smooth when the track gets big",
    tag: "Engine",
    desc: "Forty tracks in and the session still moves. Aestra is built so the project growing doesn't mean the DAW slowing down.",
    points: [
      ["Timing you can play to", "Latency low enough to record parts without fighting the delay in your headphones."],
      ["No mystery slowdowns", "Stacking tracks and drawing automation doesn't gradually choke the session."],
      ["Built for the laptop you have", "Tuned for real machines, not a maxed-out studio desktop."],
    ],
    Visual: EngineVisual,
  },
  {
    title: "Open it and go",
    tag: "Startup",
    desc: "The gap between wanting to make something and being able to is where ideas die. Aestra opens straight into the session.",
    points: [
      ["Up in about a second", "Fast enough that you don't wander off to your phone while it loads."],
      ["Plugins ready before you open", "Your library is sorted in the background, not scanned every launch."],
      ["Picks up where you left off", "Same session, same view, same place in the arrangement."],
    ],
    Visual: TerminalVisual,
  },
  {
    title: "Loops first, arrangement second",
    tag: "Workflow",
    desc: "Nobody starts a beat at bar one of a timeline. You start with a loop that slaps, then figure out the song around it.",
    points: [
      ["Patterns you can reuse anywhere", "Duplicate a loop, twist one copy, drop it in the second verse."],
      ["Sketch fast, commit later", "Get the idea down in pattern view before you think about structure."],
      ["Every pattern has its own roll", "Open a loop and its notes are right there — no hunting the timeline."],
    ],
    Visual: PatternVisual,
  },
  {
    title: "See where your sound is going",
    tag: "Mixing",
    desc: "Most mix problems are routing problems you can't see. Aestra draws the whole signal path and lights it up while it plays.",
    points: [
      ["Watch it move", "Follow the audio from each source through your buses to the master, live."],
      ["Read it at a glance", "Instruments, buses and outputs stay easy to tell apart in a busy session."],
      ["Rewire by dragging", "Change routing on the map instead of digging through nested menus."],
    ],
    Visual: RoutingVisual,
  },
  {
    title: "Know how it lands before you post it",
    tag: "Monitoring",
    desc: "Your mix sounds great in your headphones. Check it against the places people will actually hear it, while you can still fix it.",
    points: [
      ["Phone, earbuds, laptop, car", "Flip between them without leaving the session or bouncing a file."],
      ["Hear what streaming does to it", "Preview the loudness drop before the platform makes the decision for you."],
      ["Fix it now, not after release", "Catch the thin low end while the session is still open."],
    ],
    Visual: AuditionVisual,
  },
  {
    title: "Never lose the version that worked",
    tag: "History",
    desc: "Save a mix under a name you'll recognise next week, try something reckless on a branch, and A/B the two before you commit.",
    points: [
      ["Names, not final_final_v7", "Save checkpoints you can actually identify later."],
      ["Go wild on a branch", "Try the weird idea without risking the mix you already like."],
      ["A/B and keep the winner", "Compare takes side by side and pull the best bits forward."],
    ],
    Visual: VersionVisual,
  },
];

const FeatureBlock = memo(({ feature, index }: { feature: typeof sections[0]; index: number }) => {
  const reverse = index % 2 === 1;
  return (
    <section className="grid lg:grid-cols-2 border-t border-border/80">
      <div className={`p-8 sm:p-12 md:p-16 flex flex-col justify-center ${reverse ? "lg:order-2" : ""}`}>
        <FadeIn>
          <div className="inline-flex items-center gap-2.5 mb-5">
            <span className="font-mono text-[10px] text-faint tabular-nums" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="w-4 h-px bg-accent" aria-hidden="true" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{feature.tag}</span>
          </div>
          <h2 className="display-2 text-2xl sm:text-3xl md:text-4xl text-fg mb-4">
            {feature.title}
          </h2>
          <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
            {feature.desc}
          </p>
          <ul className="space-y-3">
            {feature.points.map(([strong, body], i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                <div>
                  <div className="text-fg text-[15px] font-medium">{strong}</div>
                  <div className="text-muted text-sm leading-relaxed">{body}</div>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
      <div className={`flex items-center justify-center bg-bg/40 p-8 sm:p-12 md:p-16 border-t lg:border-t-0 ${reverse ? "lg:order-1 lg:border-r" : "lg:border-l"} border-border/80`}>
        <feature.Visual />
      </div>
    </section>
  );
});

export const Features = ({ setPage, topOffset = 0, onEarlyAccess }: PageProps) => {
  return (
    <>
      <Navbar activePage="features" setPage={setPage} topOffset={topOffset} onEarlyAccess={onEarlyAccess} />
      <div className="pt-32 sm:pt-40 pb-20 sm:pb-28 min-h-screen">
        <div className="px-5 sm:px-6 max-w-6xl mx-auto">
          <p className="kicker mb-4">Feature tour</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-6 max-w-3xl">
            Built for the way producers<br />
            <span className="text-muted">actually work.</span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
            Six things that separate Aestra from every other DAW you've rage-quit
            at 2am.
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          {sections.map((feature, index) => (
            <FeatureBlock key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <ComparisonTable />
      </div>
      <Footer setPage={setPage} />
    </>
  );
};

/* ── Comparison table ────────────────────────────────────────── */
type Cell = "yes" | "no" | "limited" | "na";

const cellDisplay: Record<Cell, { mark: string; color: string; label: string }> = {
  yes:     { mark: "✓",  color: "text-emerald-400", label: "Yes" },
  no:      { mark: "—",  color: "text-dim",         label: "No" },
  limited: { mark: "~",  color: "text-amber-400",   label: "Limited" },
  na:      { mark: "—",  color: "text-dim",         label: "—" },
};

const COMPARISON_ROWS: { label: string; aestra: Cell; ableton: Cell; logic: Cell; fl: Cell; }[] = [
  { label: "Everything free, nothing gated", aestra: "yes", ableton: "limited", logic: "no",      fl: "limited" },
  { label: "Runs light on an old laptop",   aestra: "yes",  ableton: "no",      logic: "yes",     fl: "no"      },
  { label: "Same DAW on Win / macOS / Linux", aestra: "yes", ableton: "limited", logic: "no",     fl: "limited" },
  { label: "Brings your VST3 collection",   aestra: "yes",  ableton: "yes",     logic: "yes",     fl: "yes"     },
  { label: "CLAP plugin support",           aestra: "yes",  ableton: "yes",     logic: "no",      fl: "no"      },
  { label: "Loop-first, not timeline-first", aestra: "yes", ableton: "limited", logic: "no",      fl: "yes"     },
  { label: "See your routing as a graph",   aestra: "yes",  ableton: "no",      logic: "no",      fl: "no"      },
  { label: "Check the mix on phone / car",  aestra: "yes",  ableton: "no",      logic: "limited", fl: "no"      },
  { label: "Takes & mix history built in",  aestra: "yes",  ableton: "limited", logic: "limited", fl: "limited" },
  { label: "You can read the source",       aestra: "yes",  ableton: "no",      logic: "no",      fl: "no"      },
];

const ComparisonTable = () => {
  const columns: { key: keyof typeof COMPARISON_ROWS[0]; label: string; sub: string; highlight: boolean }[] = [
    { key: "aestra",  label: "Aestra",    sub: "Alpha",  highlight: true  },
    { key: "ableton", label: "Live",      sub: "Suite",  highlight: false },
    { key: "logic",   label: "Logic Pro", sub: "macOS",  highlight: false },
    { key: "fl",      label: "FL Studio", sub: "All",    highlight: false },
  ];
  return (
    <section className="mt-24 sm:mt-32 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="kicker mb-4">How Aestra compares</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4 max-w-3xl">
          Different bets. Same job.
        </h2>
        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
          Ableton, Logic and FL have a twenty-year head start and we're not
          pretending otherwise. We made different bets — free, loop-first,
          light on your machine. Here's where those bets land.
        </p>

        <div className="rounded-2xl border border-border/80 bg-bg overflow-hidden panel-sheen">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/80">
                  <th scope="col" className="px-4 sm:px-5 py-4 font-mono text-[10px] font-medium text-muted uppercase tracking-[0.14em] w-[42%] sm:w-[44%]">
                    Capability
                  </th>
                  {columns.map((c) => (
                    <th
                      key={String(c.key)}
                      scope="col"
                      className={`px-3 sm:px-4 py-4 text-left w-[14.5%] ${
                        c.highlight ? "bg-accent/[0.06]" : ""
                      }`}
                    >
                      <div className={`text-[13px] sm:text-sm font-semibold ${c.highlight ? "text-fg" : "text-fg-muted"}`}>
                        {c.label}
                      </div>
                      <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-0.5">
                        {c.sub}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 1 ? "bg-surface-2/30" : ""}>
                    <th scope="row" className="px-4 sm:px-5 py-3.5 text-[14px] font-medium text-fg text-left">
                      {row.label}
                    </th>
                    {columns.map((c) => {
                      const cell = row[c.key] as Cell;
                      const d = cellDisplay[cell];
                      return (
                        <td
                          key={String(c.key)}
                          className={`px-3 sm:px-4 py-3.5 text-center ${
                            c.highlight ? "bg-accent/[0.06]" : ""
                          }`}
                        >
                          <span
                            className={`inline-block text-base font-semibold ${d.color}`}
                            aria-label={d.label}
                            title={d.label}
                          >
                            {d.mark}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-dim text-[12px] mt-4 leading-relaxed">
          Comparison based on publicly documented features as of 2026.
          Aestra is in alpha — feature availability may differ in current builds.
        </p>
      </div>
    </section>
  );
};
