import React, { useState, memo } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import type { PageProps } from "../types";

const tagColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  teal: { text: "text-[#00e5cc]", bg: "bg-[#00e5cc]/10", border: "border-[#00e5cc]/20", dot: "#00e5cc" },
  amber: { text: "text-[#e8a838]", bg: "bg-[#e8a838]/10", border: "border-[#e8a838]/20", dot: "#e8a838" },
  purple: { text: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10", border: "border-[#7c3aed]/20", dot: "#7c3aed" },
  blue: { text: "text-[#9257ff]", bg: "bg-[#9257ff]/10", border: "border-[#9257ff]/20", dot: "#9257ff" },
  green: { text: "text-[#3dbb6e]", bg: "bg-[#3dbb6e]/10", border: "border-[#3dbb6e]/20", dot: "#3dbb6e" },
  coral: { text: "text-[#e85454]", bg: "bg-[#e85454]/10", border: "border-[#e85454]/20", dot: "#e85454" },
};

const EngineVisual = memo(() => (
  <div className="vis-engine w-full max-w-[320px]">
    {[["CPU", 18, "#00e5cc", "18%"], ["RAM", 22, "#00e5cc90", "340mb"], ["Latency", 8, "#00e5cc60", "8ms"], ["Dropouts", 0, "#3dbb6e", "0"]].map(([label, width, color, value]) => (
      <div className="meter-row" key={String(label)}>
        <div className="meter-label">{label}</div>
        <div className="meter-track"><div className="meter-fill" style={{ width: `${width}%`, background: color as string }} /></div>
        <div className="meter-val" style={{ color: color as string }}>{value}</div>
      </div>
    ))}
    <div className="vis-readout">
      <div className="readout-item"><div className="readout-val" style={{ color: "#00e5cc" }}>8ms</div><div className="readout-label">Latency</div></div>
      <div className="readout-item"><div className="readout-val" style={{ color: "#3dbb6e" }}>0</div><div className="readout-label">Dropouts</div></div>
      <div className="readout-item"><div className="readout-val" style={{ color: "#f0f0f0" }}>18%</div><div className="readout-label">CPU</div></div>
    </div>
  </div>
));

const TerminalVisual = memo(() => (
  <div className="vis-terminal w-full max-w-[340px]">
    <div className="terminal-bar">
      <div className="t-dot" style={{ background: "#ff5f57" }} />
      <div className="t-dot" style={{ background: "#ffbd2e" }} />
      <div className="t-dot" style={{ background: "#28ca42" }} />
      <span style={{ fontSize: 11, color: "#2a2f42", marginLeft: 8, fontFamily: "Geist Mono, monospace" }}>aestra — launch</span>
    </div>
    <div className="terminal-body">
      <div className="t-line skip">› scanning VST folders...</div>
      <div className="t-line skip">› loading splash screen...</div>
      <div className="t-line skip">› negotiating audio device...</div>
      <div style={{ height: 10 }} />
      <div className="t-line done">✓ audio engine ready</div>
      <div className="t-line done">✓ last session restored</div>
      <div className="t-line done">✓ plugins loaded</div>
      <div className="t-line active">› ready <div className="t-cursor" /></div>
      <div className="t-time">1.4s <span>from launch to beat</span></div>
    </div>
  </div>
));

const PatternVisual = memo(() => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="vis-pattern w-full max-w-[340px]">
      <div className="pattern-header">
        <span className="pattern-name">PATTERN_03 — main loop</span>
        <span className="pattern-bpm">140 BPM</span>
      </div>
      {[["KICK", [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], "kick"], ["SNARE", [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], "snare"], ["HAT", [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1], "hat"], ["808", [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0], ""]].map(([rowLabel, pattern, type]) => (
        <div className="pattern-row" key={String(rowLabel)}>
          <div className="row-label">{rowLabel}</div>
          <div className="cells">
            {(pattern as number[]).map((on, idx) => {
              const t = type as string;
              return <div key={idx} className={`cell ${on === 1 ? `on ${t}` : ""}`} />;
            })}
          </div>
        </div>
      ))}
      <div className="pattern-footer">
        <button className="play-btn" onClick={() => setPlaying(!playing)}>
          {playing
            ? <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><rect x="1" y="1" width="3" height="10" rx="1"/><rect x="6" y="1" width="3" height="10" rx="1"/></svg>
            : <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><path d="M1 1l8 5-8 5V1z"/></svg>
          }
        </button>
        <div className="pattern-pos">1.1.0</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, color: "#3a4060", fontFamily: "Geist Mono, monospace" }}>16 steps</div>
      </div>
    </div>
  );
});

const RoutingVisual = memo(() => (
  <div className="vis-routing w-full max-w-[340px]">
    <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 320 }}>
      <path d="M 60 60 C 120 60 100 100 160 100" stroke="#9257ff22" strokeWidth="2" fill="none"/>
      <path d="M 60 140 C 120 140 100 100 160 100" stroke="#9257ff22" strokeWidth="2" fill="none"/>
      <path d="M 60 100 L 160 100" stroke="#9257ff33" strokeWidth="2" fill="none"/>
      <path d="M 200 100 L 260 100" stroke="#9257ff44" strokeWidth="2.5" fill="none"/>
      <circle r="3" fill="#9257ff" opacity="0.8"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 60 C 120 60 100 100 160 100" /></circle>
      <circle r="3" fill="#9257ff" opacity="0.5"><animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s" path="M 60 140 C 120 140 100 100 160 100" /></circle>
      <circle r="3" fill="#9257ff" opacity="0.6"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.3s" path="M 60 100 L 160 100" /></circle>
      <circle r="4" fill="#9257ff" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s" path="M 200 100 L 260 100" /></circle>
      <rect x="20" y="46" width="40" height="28" rx="7" fill="#9257ff15" stroke="#9257ff40" strokeWidth="1"/>
      <text x="40" y="64" textAnchor="middle" fontSize="9" fill="#9257ff" fontFamily="Geist Mono, monospace">KICK</text>
      <rect x="20" y="86" width="40" height="28" rx="7" fill="#7c3aed15" stroke="#7c3aed40" strokeWidth="1"/>
      <text x="40" y="104" textAnchor="middle" fontSize="9" fill="#7c3aed" fontFamily="Geist Mono, monospace">808</text>
      <rect x="20" y="126" width="40" height="28" rx="7" fill="#00e5cc15" stroke="#00e5cc40" strokeWidth="1"/>
      <text x="40" y="144" textAnchor="middle" fontSize="9" fill="#00e5cc" fontFamily="Geist Mono, monospace">SYNTH</text>
      <rect x="140" y="80" width="60" height="40" rx="8" fill="#9257ff10" stroke="#9257ff60" strokeWidth="1.5"/>
      <text x="170" y="97" textAnchor="middle" fontSize="9" fill="#9257ffaa" fontFamily="Geist Mono, monospace">FX BUS</text>
      <text x="170" y="110" textAnchor="middle" fontSize="8" fill="#9257ff60" fontFamily="Geist Mono, monospace">EQ + VERB</text>
      <rect x="240" y="78" width="60" height="44" rx="8" fill="#9257ff20" stroke="#9257ff" strokeWidth="1.5"/>
      <text x="270" y="97" textAnchor="middle" fontSize="9" fill="#9257ff" fontFamily="Geist Mono, monospace">MASTER</text>
      <text x="270" y="111" textAnchor="middle" fontSize="8" fill="#9257ffaa" fontFamily="Geist Mono, monospace">−3.2 dB</text>
      <circle cx="290" cy="168" r="4" fill="#3dbb6e"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
      <text x="300" y="172" fontSize="9" fill="#3dbb6e60" fontFamily="Geist Mono, monospace">LIVE</text>
    </svg>
  </div>
));

const AuditionVisual = memo(() => {
  const [active, setActive] = useState(0);
  const devices: [string, string, string, string][] = [
    ["Laptop Speaker", "Most unforgiving reference", "#3dbb6e15", "#3dbb6e"],
    ["AirPods Pro", "Consumer earbuds + spatial", "#3a4060", "#7a8099"],
    ["Car Audio", "Midrange-heavy simulation", "#3a4060", "#7a8099"],
    ["Spotify Loudness", "−14 LUFS normalization preview", "#00e5cc15", "#00e5cc"],
  ];
  return (
    <div className="vis-audition w-full max-w-[320px]">
      {devices.map(([name, sub, bg, stroke], idx) => (
        <div key={name} className={`audition-device ${active === idx ? "active" : ""}`} onClick={() => setActive(idx)}>
          <div className="device-icon" style={{ background: bg }}>
            {idx === 0 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke={stroke} strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke={stroke} strokeWidth="1.2"/></svg>}
            {idx === 1 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="8" r="3" stroke={stroke} strokeWidth="1.2"/><circle cx="11" cy="8" r="3" stroke={stroke} strokeWidth="1.2"/><path d="M8 5v6" stroke={stroke} strokeWidth="1.2"/></svg>}
            {idx === 2 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 5h14v6a2 2 0 01-2 2H3a2 2 0 01-2-2V5z" stroke={stroke} strokeWidth="1.2"/><circle cx="5" cy="8.5" r="1.5" stroke={stroke} strokeWidth="1"/><circle cx="11" cy="8.5" r="1.5" stroke={stroke} strokeWidth="1"/></svg>}
            {idx === 3 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={stroke} strokeWidth="1.2"/><path d="M6 8l2-1.5V9.5L6 8z" fill={stroke} /></svg>}
          </div>
          <div className="device-info">
            <div className="device-name">{name}</div>
            <div className="device-sub">{sub}</div>
          </div>
          <div className={`device-check ${active === idx ? "active" : ""}`}>
            {active === idx && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
          </div>
        </div>
      ))}
    </div>
  );
});

const VersionVisual = memo(() => (
  <div className="vis-version w-full max-w-[320px]">
    {[["rough_bounce", "3 days ago · starting point", "#3a4060", ""], ["with_808_rewrite", "yesterday · branched from rough", "#e8a838", "saved"], ["final_mix_v3", "2 hours ago · current", "#e85454", "active"], ["alt_intro_idea", "1 hour ago · experiment", "#3dbb6e", "branch"]].map(([name, meta, dot, tag]) => (
      <div key={String(name)} className={`branch-item ${tag === "active" ? "current" : ""}`}>
        <div className="branch-dot" style={{ background: dot as string }} />
        <div className="branch-info">
          <div className="branch-name">{name}</div>
          <div className="branch-meta">{meta}</div>
        </div>
        {tag ? <div className="branch-tag" style={{ background: `${dot}15`, color: dot as string }}>{tag}</div> : null}
      </div>
    ))}
    <button className="compare-btn">Compare takes →</button>
  </div>
));

const iconMap: Record<string, React.ReactNode[]> = {
  ENGINE: [
    <svg key="e1" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M5 19c3-5 5-10 9-10s6 5 9 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="14" cy="14" r="2.2" stroke="currentColor" strokeWidth="1.3"/></svg>,
    <svg key="e2" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="5" y="7" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M10 11h8M10 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    <svg key="e3" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="7" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 20h20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  ],
  STARTUP: [
    <svg key="s1" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.3"/><path d="M14 10v5l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    <svg key="s2" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M9 9h10v10H9z" stroke="currentColor" strokeWidth="1.2"/><path d="M6 13h3M19 13h3M14 6v3M14 19v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    <svg key="s3" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M14 6v8l5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.3"/></svg>,
  ],
  WORKFLOW: [
    <svg key="w1" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="6" y="6" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M6 14h16M14 6v16" stroke="currentColor" strokeWidth="1.1"/></svg>,
    <svg key="w2" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M8 11l-3 3 3 3M20 17l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 14h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    <svg key="w3" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="5" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M10 7v14M14 7v14M18 7v14" stroke="currentColor" strokeWidth="1.1"/></svg>,
  ],
  MIXING: [
    <svg key="m1" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="21" cy="20" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9.5l10 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    <svg key="m2" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M14 5c5 0 8 4 8 8a3 3 0 01-3 3h-2.5a2 2 0 00-2 2V20a3 3 0 01-3 3c-4 0-7-3-7-7 0-6 5-11 9.5-11z" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>,
    <svg key="m3" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M7 7h6v6H7zM15 15h6v6h-6z" stroke="currentColor" strokeWidth="1.2"/><path d="M13 10h2v2M15 13v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  ],
  MONITORING: [
    <svg key="mo1" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="4" y="8" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><rect x="15" y="10" width="9" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/></svg>,
    <svg key="mo2" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.2"/><path d="M10 14h8M10 17h6M10 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    <svg key="mo3" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.2"/><path d="M9 14l3 3 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ],
  HISTORY: [
    <svg key="h1" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M8 7h12v14H8z" stroke="currentColor" strokeWidth="1.2"/><path d="M11 11h6M11 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    <svg key="h2" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M9 7v14M9 14h6a4 4 0 004-4V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="9" cy="7" r="1.6" fill="currentColor"/><circle cx="19" cy="7" r="1.6" fill="currentColor"/><circle cx="9" cy="21" r="1.6" fill="currentColor"/></svg>,
    <svg key="h3" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M6 8h7v12H6zM15 8h7v12h-7z" stroke="currentColor" strokeWidth="1.2"/><path d="M13 14h2" stroke="currentColor" strokeWidth="1.2"/></svg>,
  ],
};

const sections = [
  {
    title: "Realtime by Default",
    tag: "ENGINE",
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
    title: "Instant Launch",
    tag: "STARTUP",
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
    title: "Pattern-Centric Workflow",
    tag: "WORKFLOW",
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
    title: "Visual Signal Routing",
    tag: "MIXING",
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
    title: "Translation Preview",
    tag: "MONITORING",
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
    title: "Mix History",
    tag: "HISTORY",
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
  const icons = iconMap[feature.tag] || [];

  return (
    <section className={`feature-block ${reverse ? "reverse" : ""}`}>
      <div className={`feature-copy acc-${feature.tagColor}`}>
        <div className="feature-tag">
          <div className="feature-tag-dot" style={{ background: tc.dot }} />
          {feature.tag}
        </div>
        <h2>{feature.title}</h2>
        <p className="lead">{feature.desc}</p>
        <div className="proof-points">
          {feature.points.map(([strong, body], i) => (
            <div key={i} className="proof-point">
              <div className="proof-icon" style={{ color: tc.dot, background: `${tc.dot}15` }}>
                {icons[i] || <svg viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.2"/></svg>}
              </div>
              <div className="proof-text">
                <strong>{strong}</strong>
                <span>{body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="feature-visual">
        <feature.Visual />
      </div>
    </section>
  );
});

export const Features = ({ setPage }: PageProps) => {
  return (
    <>
      <Navbar activePage="features" setPage={setPage} />
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20 min-h-screen">
        <div className="page-hero px-4 sm:px-8 max-w-[700px]">
          <div className="page-hero-tag">Feature Tour</div>
          <h1>
            Built for the way<br />producers <span className="text-[#7c3aed]">actually work.</span>
          </h1>
          <p>Six things that separate Aestra from every other DAW you've closed out of frustration.</p>
        </div>

        <div className="mt-4 border-t border-[#13161e]">
          {sections.map((feature, index) => (
            <FeatureBlock key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </main>
      <Footer setPage={setPage} />
    </>
  );
};
