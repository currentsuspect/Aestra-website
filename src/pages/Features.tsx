import React, { useState, memo } from "react";
import { Check } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FadeIn } from "../components/ui";
import type { PageProps } from "../types";

const EngineVisual = memo(() => (
  <div className="w-full max-w-xs">
    <div className="space-y-2.5">
      {[
        ["CPU",      18, "bg-teal-500/70",  "18%"],
        ["RAM",      22, "bg-teal-500/60",  "340mb"],
        ["Latency",   8, "bg-teal-500/50",  "8ms"],
        ["Dropouts",  0, "bg-emerald-500",  "0"],
      ].map(([label, w, c, v]) => (
        <div key={String(label)} className="flex items-center gap-3">
          <div className="w-14 text-[11px] text-muted uppercase tracking-wider shrink-0">{label}</div>
          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c}`} style={{ width: `${w}%` }} />
          </div>
          <div className="w-12 text-right text-[11px] font-mono text-fg-muted">{v}</div>
        </div>
      ))}
    </div>
    <div className="mt-6 grid grid-cols-3 divide-x divide-border/80 rounded-lg border border-border/80 bg-bg">
      {[
        { v: "8ms",  l: "Latency",  c: "text-teal-400" },
        { v: "0",    l: "Dropouts", c: "text-emerald-400" },
        { v: "18%",  l: "CPU",      c: "text-fg" },
      ].map((s) => (
        <div key={s.l} className="text-center py-4">
          <div className={`text-xl font-semibold tracking-tight ${s.c}`}>{s.v}</div>
          <div className="text-[10px] text-muted uppercase tracking-wider mt-1">{s.l}</div>
        </div>
      ))}
    </div>
  </div>
));

const TerminalVisual = memo(() => (
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
      <div className="text-emerald-400">✓ audio engine ready</div>
      <div className="text-emerald-400">✓ last session restored</div>
      <div className="text-emerald-400">✓ plugins loaded</div>
      <div className="text-amber-400">› ready</div>
    </div>
    <div className="px-4 py-3 border-t border-border/80 flex items-baseline gap-2">
      <span className="text-xl font-semibold text-amber-400 font-mono tracking-tight">1.4s</span>
      <span className="text-[11px] text-muted">from launch to beat</span>
    </div>
  </div>
));

const PatternVisual = memo(() => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted font-mono">PATTERN_03 — main loop</span>
        <span className="text-[11px] text-violet-400 font-mono">140 BPM</span>
      </div>
      <div className="space-y-1.5">
        {[
          ["KICK",  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], "bg-amber-400"],
          ["SNARE", [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], "bg-teal-400"],
          ["HAT",   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1], "bg-violet-400"],
          ["808",   [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0], "bg-fg"],
        ].map(([label, pattern, color]) => (
          <div key={String(label)} className="flex items-center gap-2">
            <div className="w-10 text-[9px] tracking-wider text-muted font-mono uppercase">{label}</div>
            <div className="grid grid-cols-16 gap-1 flex-1">
              {(pattern as number[]).map((on, i) => (
                <div
                  key={i}
                  className={`h-3.5 rounded-sm ${on ? color : "bg-surface-2"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-7 h-7 rounded-md bg-violet-500 text-white flex items-center justify-center hover:bg-violet-400 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="9" height="9" viewBox="0 0 10 12" fill="currentColor"><rect x="1" y="1" width="3" height="10" rx="1"/><rect x="6" y="1" width="3" height="10" rx="1"/></svg>
          ) : (
            <svg width="9" height="9" viewBox="0 0 10 12" fill="currentColor"><path d="M1 1l8 5-8 5V1z"/></svg>
          )}
        </button>
        <span className="text-[10px] text-muted font-mono">1.1.0</span>
        <span className="ml-auto text-[10px] text-muted font-mono">16 steps</span>
      </div>
    </div>
  );
});

const RoutingVisual = memo(() => (
  <div className="w-full max-w-md aspect-[16/9]">
    <svg viewBox="0 0 320 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <path d="M 54 50 C 100 50 110 90 145 90" stroke="#3b82f622" strokeWidth="1.5" fill="none"/>
      <path d="M 54 130 C 100 130 110 90 145 90" stroke="#3b82f622" strokeWidth="1.5" fill="none"/>
      <path d="M 54 90 L 145 90" stroke="#3b82f633" strokeWidth="1.5" fill="none"/>
      <path d="M 195 90 L 240 90" stroke="#3b82f644" strokeWidth="2" fill="none"/>
      <circle r="3" fill="#3b82f6" opacity="0.8">
        <animateMotion dur="2s" repeatCount="indefinite" path="M 54 50 C 100 50 110 90 145 90" />
      </circle>
      <circle r="3" fill="#3b82f6" opacity="0.5">
        <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s" path="M 54 130 C 100 130 110 90 145 90" />
      </circle>
      <circle r="3" fill="#3b82f6" opacity="0.6">
        <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.3s" path="M 54 90 L 145 90" />
      </circle>
      <circle r="4" fill="#3b82f6" opacity="0.9">
        <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s" path="M 195 90 L 240 90" />
      </circle>
      <circle cx="40" cy="50" r="16" fill="#3b82f615" stroke="#3b82f640" strokeWidth="1"/>
      <text x="40" y="53" textAnchor="middle" fontSize="8" fill="#3b82f6" fontFamily="Geist Mono, monospace">KICK</text>
      <circle cx="40" cy="90" r="16" fill="#8b5cf615" stroke="#8b5cf640" strokeWidth="1"/>
      <text x="40" y="93" textAnchor="middle" fontSize="8" fill="#8b5cf6" fontFamily="Geist Mono, monospace">808</text>
      <circle cx="40" cy="130" r="16" fill="#14b8a615" stroke="#14b8a640" strokeWidth="1"/>
      <text x="40" y="133" textAnchor="middle" fontSize="7.5" fill="#14b8a6" fontFamily="Geist Mono, monospace">SYNTH</text>
      <path d="M 145 90 L 170 70 L 195 90 L 170 110 Z" fill="#3b82f610" stroke="#3b82f660" strokeWidth="1"/>
      <text x="170" y="88" textAnchor="middle" fontSize="8" fill="#3b82f6" fontFamily="Geist Mono, monospace">FX BUS</text>
      <text x="170" y="100" textAnchor="middle" fontSize="7" fill="#3b82f6aa" fontFamily="Geist Mono, monospace">EQ + VERB</text>
      <rect x="240" y="68" width="60" height="44" rx="8" fill="#3b82f620" stroke="#3b82f680" strokeWidth="1"/>
      <text x="270" y="88" textAnchor="middle" fontSize="8" fill="#3b82f6" fontFamily="Geist Mono, monospace">MASTER</text>
      <text x="270" y="102" textAnchor="middle" fontSize="7" fill="#3b82f6aa" fontFamily="Geist Mono, monospace">−3.2 dB</text>
      <circle cx="260" cy="160" r="3" fill="#22c55e">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <text x="270" y="163" fontSize="8" fill="#22c55e" fontFamily="Geist Mono, monospace">LIVE</text>
    </svg>
  </div>
));

const AuditionVisual = memo(() => {
  const [active, setActive] = useState(0);
  const devices: { name: string; sub: string; accent: string; border: string }[] = [
    { name: "Laptop speaker",  sub: "Most unforgiving reference",      accent: "text-emerald-400", border: "border-emerald-500/30 bg-emerald-500/5" },
    { name: "AirPods Pro",     sub: "Consumer earbuds + spatial",      accent: "text-muted",    border: "border-border" },
    { name: "Car audio",       sub: "Midrange-heavy simulation",       accent: "text-muted",    border: "border-border" },
    { name: "Spotify loudness", sub: "−14 LUFS normalization preview", accent: "text-teal-400",    border: "border-teal-500/30 bg-teal-500/5" },
  ];
  return (
    <div className="w-full max-w-xs space-y-2">
      {devices.map((d, idx) => (
        <button
          key={d.name}
          onClick={() => setActive(idx)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border bg-bg hover:border-border-2 transition-colors text-left ${
            active === idx ? d.border : "border-border/80"
          }`}
        >
          <div className={`h-2 w-2 rounded-full ${active === idx ? "bg-emerald-400" : "bg-surface-3"}`} />
          <div className="flex-1 min-w-0">
            <div className="text-fg text-sm font-medium truncate">{d.name}</div>
            <div className="text-muted text-xs truncate">{d.sub}</div>
          </div>
          {active === idx && <Check className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      ))}
    </div>
  );
});

const VersionVisual = memo(() => (
  <div className="w-full max-w-xs space-y-2">
    {[
      { name: "rough_bounce",     meta: "3 days ago · starting point",        dot: "bg-faint" },
      { name: "with_808_rewrite", meta: "yesterday · branched from rough",   dot: "bg-amber-400" },
      { name: "final_mix_v3",     meta: "2 hours ago · current",             dot: "bg-rose-400", active: true },
      { name: "alt_intro_idea",   meta: "1 hour ago · experiment",           dot: "bg-emerald-400" },
    ].map((b) => (
      <div
        key={b.name}
        className={`flex items-center gap-3 p-3 rounded-lg border bg-bg ${
          b.active ? "border-rose-500/30 bg-rose-500/[0.04]" : "border-border/80"
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

const tagColors: Record<string, { dot: string; text: string; ring: string }> = {
  teal:   { dot: "bg-teal-400",   text: "text-teal-400",   ring: "ring-teal-500/20"   },
  amber:  { dot: "bg-amber-400",  text: "text-amber-400",  ring: "ring-amber-500/20"  },
  purple: { dot: "bg-violet-400", text: "text-violet-400", ring: "ring-violet-500/20" },
  blue:   { dot: "bg-blue-400",   text: "text-blue-400",   ring: "ring-blue-500/20"   },
  green:  { dot: "bg-emerald-400",text: "text-emerald-400",ring: "ring-emerald-500/20"},
  coral:  { dot: "bg-rose-400",   text: "text-rose-400",   ring: "ring-rose-500/20"   },
};

const sections = [
  {
    title: "Realtime by default",
    tag: "Engine",
    tagColor: "teal",
    desc: "The core engine is built in-house to stay fast under load. Sessions stay responsive even when projects get dense.",
    points: [
      ["Consistent low-latency playback", "Responsive timing that stays usable while recording and arranging."],
      ["Stable memory behavior", "No sudden spikes when tracks stack up or automation gets heavy."],
      ["Runs well on mid-range machines", "Optimized for real-world laptops, not only top-end rigs."],
    ],
    Visual: EngineVisual,
  },
  {
    title: "Instant launch",
    tag: "Startup",
    tagColor: "amber",
    desc: "Boot time is treated as part of the creative flow. Aestra opens directly into work, without ritual waiting screens.",
    points: [
      ["Fast cold start", "Open a project and begin writing without breaking momentum."],
      ["Cached plugin indexing", "Plugins are resolved ahead of time instead of at launch."],
      ["Session recovery on open", "Jump back into the same context you closed."],
    ],
    Visual: TerminalVisual,
  },
  {
    title: "Pattern-centric workflow",
    tag: "Workflow",
    tagColor: "purple",
    desc: "Ideas start as loops and evolve into arrangements. The workflow is designed around that path from the beginning.",
    points: [
      ["Independent pattern objects", "Duplicate, mutate, and reuse patterns without losing structure."],
      ["Loop-first composition", "Sketch quickly in pattern view, then expand into arrangement."],
      ["Dedicated piano roll per pattern", "Each pattern keeps its own note and edit context."],
    ],
    Visual: PatternVisual,
  },
  {
    title: "Visual signal routing",
    tag: "Mixing",
    tagColor: "blue",
    desc: "Routing is visible as a live graph, so you can spot gain and bus issues before they become mix problems.",
    points: [
      ["Realtime path feedback", "Follow signal movement from sources to master while audio plays."],
      ["Channel-type color grouping", "Instruments, buses, and outputs remain easy to parse at a glance."],
      ["Direct graph rewiring", "Adjust routing from the visual map instead of nested menus."],
    ],
    Visual: RoutingVisual,
  },
  {
    title: "Translation preview",
    tag: "Monitoring",
    tagColor: "green",
    desc: "Preview your mix through common listening profiles before exporting, so decisions hold up outside the studio.",
    points: [
      ["Device profile switching", "Check phone, earbuds, laptop, and car perspectives in one place."],
      ["Streaming normalization preview", "Hear platform loudness behavior before publish."],
      ["Fix translation early", "Adjust balance now instead of chasing issues after export."],
    ],
    Visual: AuditionVisual,
  },
  {
    title: "Mix history",
    tag: "History",
    tagColor: "coral",
    desc: "Snapshot and branch your work with readable names, then compare versions to keep what actually improves the track.",
    points: [
      ["Named project snapshots", "Save meaningful checkpoints instead of file-name chaos."],
      ["Branch for experiments", "Try alternate ideas without risking the main version."],
      ["Version comparison workflow", "A/B revisions and merge the strongest decisions."],
    ],
    Visual: VersionVisual,
  },
];

const FeatureBlock = memo(({ feature, index }: { feature: typeof sections[0]; index: number }) => {
  const tc = tagColors[feature.tagColor] || tagColors.blue;
  const reverse = index % 2 === 1;
  return (
    <section className="grid lg:grid-cols-2 border-t border-border/80">
      <div className={`p-8 sm:p-12 md:p-16 flex flex-col justify-center ${reverse ? "lg:order-2" : ""}`}>
        <FadeIn>
          <div className="inline-flex items-center gap-2 mb-5">
            <span className={`h-1.5 w-1.5 rounded-full ${tc.dot}`} />
            <span className={`text-[12px] font-medium ${tc.text}`}>{feature.tag}</span>
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
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${tc.dot} shrink-0`} />
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

export const Features = ({ setPage, topOffset = 0 }: PageProps) => {
  return (
    <>
      <Navbar activePage="features" setPage={setPage} topOffset={topOffset} />
      <div className="pt-32 sm:pt-40 pb-20 sm:pb-28 min-h-screen">
        <div className="px-5 sm:px-6 max-w-6xl mx-auto">
          <p className="kicker mb-4">Feature tour</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-6 max-w-3xl">
            Built for the way producers<br />
            <span className="text-muted">actually work.</span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed">
            Six things that separate Aestra from every other DAW you've closed
            out of frustration.
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          {sections.map((feature, index) => (
            <FeatureBlock key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
      <Footer setPage={setPage} />
    </>
  );
};
