import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FounderBanner } from "./components/FounderBanner";

import { Hero, FounderCountdown } from "./pages/Home";

const Downloads = lazy(() => import("./pages/Downloads").then(m => ({ default: m.Downloads })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.Pricing })));
const Changelog = lazy(() => import("./pages/Changelog").then(m => ({ default: m.Changelog })));
const Docs = lazy(() => import("./pages/Docs").then(m => ({ default: m.Docs })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-2 h-2 rounded-full bg-[#61d5ff] animate-bounce" />
  </div>
);

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const App = () => {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (!path) return "home";
    const validPages = ["features", "pricing", "changelog", "docs", "download", "login", "account", "privacy", "terms"];
    return validPages.includes(path) ? path : "404";
  };

  const [page, setPage] = useState(getInitialPage);
  const [showBanner, setShowBanner] = useState(true);
  const [patternPlaying, setPatternPlaying] = useState(false);
  const [auditionDevice, setAuditionDevice] = useState(0);

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
      const validPages = ["features", "pricing", "changelog", "docs", "download", "login", "account", "privacy", "terms"];
      setPage(validPages.includes(path) ? path : "404");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (target) {
        e.preventDefault();
        const hash = target.getAttribute("href");
        if (hash) {
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSetPage = useCallback((newPage: string) => {
    setPage(newPage);
    const path = newPage === "home" ? "/" : `/${newPage}`;
    window.history.pushState(null, "", path);
  }, []);

  const handleDismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const renderFeaturesPage = () => {
    const tagColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
      teal: { text: "text-[#1db4a6]", bg: "bg-[#1db4a6]/10", border: "border-[#1db4a6]/20", dot: "#1db4a6" },
      amber: { text: "text-[#e8a230]", bg: "bg-[#e8a230]/10", border: "border-[#e8a230]/20", dot: "#e8a230" },
      purple: { text: "text-[#8b7de8]", bg: "bg-[#8b7de8]/10", border: "border-[#8b7de8]/20", dot: "#8b7de8" },
      blue: { text: "text-[#4a9eff]", bg: "bg-[#4a9eff]/10", border: "border-[#4a9eff]/20", dot: "#4a9eff" },
      green: { text: "text-[#4caf6e]", bg: "bg-[#4caf6e]/10", border: "border-[#4caf6e]/20", dot: "#4caf6e" },
      coral: { text: "text-[#e06a4e]", bg: "bg-[#e06a4e]/10", border: "border-[#e06a4e]/20", dot: "#e06a4e" },
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
        visual: (
          <div className="vis-engine w-full max-w-[320px]">
            {[["CPU", 18, "#1db4a6", "18%"], ["RAM", 22, "#1db4a690", "340mb"], ["Latency", 8, "#1db4a660", "8ms"], ["Dropouts", 0, "#4caf6e", "0"]].map(([label, width, color, value]) => (
              <div className="meter-row" key={String(label)}>
                <div className="meter-label">{label}</div>
                <div className="meter-track"><div className="meter-fill" style={{ width: `${width}%`, background: color as string }} /></div>
                <div className="meter-val" style={{ color: color as string }}>{value}</div>
              </div>
            ))}
            <div className="vis-readout">
              <div className="readout-item"><div className="readout-val" style={{ color: "#1db4a6" }}>8ms</div><div className="readout-label">Latency</div></div>
              <div className="readout-item"><div className="readout-val" style={{ color: "#4caf6e" }}>0</div><div className="readout-label">Dropouts</div></div>
              <div className="readout-item"><div className="readout-val" style={{ color: "#f0f0f0" }}>18%</div><div className="readout-label">CPU</div></div>
            </div>
          </div>
        ),
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
        visual: (
          <div className="vis-terminal w-full max-w-[340px]">
            <div className="terminal-bar">
              <div className="t-dot" style={{ background: "#ff5f57" }} />
              <div className="t-dot" style={{ background: "#ffbd2e" }} />
              <div className="t-dot" style={{ background: "#28ca42" }} />
              <span style={{ fontSize: 11, color: "#2a2f42", marginLeft: 8, fontFamily: "DM Mono, monospace" }}>aestra — launch</span>
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
        ),
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
        visual: (
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
                    const isOn = on === 1;
                    return <div key={idx} className={`cell ${isOn ? `on ${t}` : ""}`} />;
                  })}
                </div>
              </div>
            ))}
            <div className="pattern-footer">
              <button className="play-btn" onClick={() => setPatternPlaying(!patternPlaying)}>
                {patternPlaying ? <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><rect x="1" y="1" width="3" height="10" rx="1"/><rect x="6" y="1" width="3" height="10" rx="1"/></svg> : <svg width="10" height="12" viewBox="0 0 10 12" fill="white"><path d="M1 1l8 5-8 5V1z"/></svg>}
              </button>
              <div className="pattern-pos">1.1.0</div>
              <div style={{ flex: 1 }} />
              <div style={{ fontSize: 11, color: "#3a4060", fontFamily: "DM Mono, monospace" }}>16 steps</div>
            </div>
          </div>
        ),
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
        visual: (
          <div className="vis-routing w-full max-w-[340px]">
            <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 320 }}>
              <path d="M 60 60 C 120 60 100 100 160 100" stroke="#4a9eff22" strokeWidth="2" fill="none"/>
              <path d="M 60 140 C 120 140 100 100 160 100" stroke="#4a9eff22" strokeWidth="2" fill="none"/>
              <path d="M 60 100 L 160 100" stroke="#4a9eff33" strokeWidth="2" fill="none"/>
              <path d="M 200 100 L 260 100" stroke="#4a9eff44" strokeWidth="2.5" fill="none"/>
              <circle r="3" fill="#4a9eff" opacity="0.8"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 60 C 120 60 100 100 160 100" /></circle>
              <circle r="3" fill="#4a9eff" opacity="0.5"><animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s" path="M 60 140 C 120 140 100 100 160 100" /></circle>
              <circle r="3" fill="#4a9eff" opacity="0.6"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.3s" path="M 60 100 L 160 100" /></circle>
              <circle r="4" fill="#4a9eff" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s" path="M 200 100 L 260 100" /></circle>
              <rect x="20" y="46" width="40" height="28" rx="7" fill="#4a9eff15" stroke="#4a9eff40" strokeWidth="1"/>
              <text x="40" y="64" textAnchor="middle" fontSize="9" fill="#4a9eff" fontFamily="DM Mono, monospace">KICK</text>
              <rect x="20" y="86" width="40" height="28" rx="7" fill="#8b7de815" stroke="#8b7de840" strokeWidth="1"/>
              <text x="40" y="104" textAnchor="middle" fontSize="9" fill="#8b7de8" fontFamily="DM Mono, monospace">808</text>
              <rect x="20" y="126" width="40" height="28" rx="7" fill="#1db4a615" stroke="#1db4a640" strokeWidth="1"/>
              <text x="40" y="144" textAnchor="middle" fontSize="9" fill="#1db4a6" fontFamily="DM Mono, monospace">SYNTH</text>
              <rect x="140" y="80" width="60" height="40" rx="8" fill="#4a9eff10" stroke="#4a9eff60" strokeWidth="1.5"/>
              <text x="170" y="97" textAnchor="middle" fontSize="9" fill="#4a9effaa" fontFamily="DM Mono, monospace">FX BUS</text>
              <text x="170" y="110" textAnchor="middle" fontSize="8" fill="#4a9eff60" fontFamily="DM Mono, monospace">EQ + VERB</text>
              <rect x="240" y="78" width="60" height="44" rx="8" fill="#4a9eff20" stroke="#4a9eff" strokeWidth="1.5"/>
              <text x="270" y="97" textAnchor="middle" fontSize="9" fill="#4a9eff" fontFamily="DM Mono, monospace">MASTER</text>
              <text x="270" y="111" textAnchor="middle" fontSize="8" fill="#4a9effaa" fontFamily="DM Mono, monospace">−3.2 dB</text>
              <circle cx="290" cy="168" r="4" fill="#4caf6e"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></circle>
              <text x="300" y="172" fontSize="9" fill="#4caf6e60" fontFamily="DM Mono, monospace">LIVE</text>
            </svg>
          </div>
        ),
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
        visual: (
          <div className="vis-audition w-full max-w-[320px]">
            {[["Laptop Speaker", "Most unforgiving reference", true, "#4caf6e15", "#4caf6e"], ["AirPods Pro", "Consumer earbuds + spatial", false, "#3a4060", "#7a8099"], ["Car Audio", "Midrange-heavy simulation", false, "#3a4060", "#7a8099"], ["Spotify Loudness", "−14 LUFS normalization preview", false, "#1db4a615", "#1db4a6"]].map((d, idx) => {
              const [name, sub, active, bg, stroke] = d as [string, string, boolean, string, string];
              return (
                <div key={name} className={`audition-device ${active || auditionDevice === idx ? "active" : ""}`} onClick={() => setAuditionDevice(idx)}>
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
                  <div className="device-check">{active || auditionDevice === idx ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg> : null}</div>
                </div>
              );
            })}
          </div>
        ),
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
        visual: (
          <div className="vis-version w-full max-w-[320px]">
            {[["rough_bounce", "3 days ago · starting point", "#3a4060", ""], ["with_808_rewrite", "yesterday · branched from rough", "#e8a230", "saved"], ["final_mix_v3", "2 hours ago · current", "#e06a4e", "active"], ["alt_intro_idea", "1 hour ago · experiment", "#4caf6e", "branch"]].map(([name, meta, dot, tag]) => (
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
        ),
      },
    ];

    return (
      <>
        <Navbar activePage="features" setPage={handleSetPage} />
        <main id="main-content" className="pt-24 sm:pt-32 pb-16 sm:pb-20 min-h-screen">
          <div className="page-hero px-4 sm:px-8 max-w-[700px]">
            <div className="page-hero-tag">Feature Tour</div>
            <h1>
              Powerful enough for<br />release work, <em>fast enough for ideas.</em>
            </h1>
            <p>Six core systems that keep sessions quick, clear, and reliable from first loop to final bounce.</p>
          </div>

          <div className="mt-4 border-t border-[#13161e]">
            {sections.map((feature, index) => {
              const tc = tagColors[feature.tagColor] || tagColors.blue;
              const reverse = index % 2 === 1;
              return (
                <section key={feature.title} className={`feature-block ${reverse ? "reverse" : ""}`}>
                  <div className={`feature-copy acc-${feature.tagColor}`}>
                    <div className="feature-tag">
                      <div className="feature-tag-dot" style={{ background: tc.dot }} />
                      {feature.tag}
                    </div>
                    <h2>{feature.title}</h2>
                    <p className="lead">{feature.desc}</p>
                    <div className="proof-points">
                      {feature.points.map(([strong, body], i) => {
                        const iconMap: Record<string, JSX.Element[]> = {
                          ENGINE: [
                            <svg key="engine-latency" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M5 19c3-5 5-10 9-10s6 5 9 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="14" cy="14" r="2.2" stroke="currentColor" strokeWidth="1.3"/></svg>,
                            <svg key="engine-memory" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="5" y="7" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M10 11h8M10 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                            <svg key="engine-device" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="7" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 20h20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
                          ],
                          STARTUP: [
                            <svg key="startup-speed" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.3"/><path d="M14 10v5l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
                            <svg key="startup-plugin" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M9 9h10v10H9z" stroke="currentColor" strokeWidth="1.2"/><path d="M6 13h3M19 13h3M14 6v3M14 19v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                            <svg key="startup-recover" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M14 6v8l5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.3"/></svg>,
                          ],
                          WORKFLOW: [
                            <svg key="workflow-pattern" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="6" y="6" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.3"/><path d="M6 14h16M14 6v16" stroke="currentColor" strokeWidth="1.1"/></svg>,
                            <svg key="workflow-loop" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M8 11l-3 3 3 3M20 17l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 14h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                            <svg key="workflow-roll" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="5" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M10 7v14M14 7v14M18 7v14" stroke="currentColor" strokeWidth="1.1"/></svg>,
                          ],
                          MIXING: [
                            <svg key="mixing-flow" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="21" cy="20" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9.5l10 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                            <svg key="mixing-color" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M14 5c5 0 8 4 8 8a3 3 0 01-3 3h-2.5a2 2 0 00-2 2V20a3 3 0 01-3 3c-4 0-7-3-7-7 0-6 5-11 9.5-11z" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>,
                            <svg key="mixing-rewire" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M7 7h6v6H7zM15 15h6v6h-6z" stroke="currentColor" strokeWidth="1.2"/><path d="M13 10h2v2M15 13v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                          ],
                          MONITORING: [
                            <svg key="monitor-device" viewBox="0 0 28 28" width="16" height="16" fill="none"><rect x="4" y="8" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><rect x="15" y="10" width="9" height="8" rx="2" stroke="currentColor" strokeWidth="1.2"/></svg>,
                            <svg key="monitor-stream" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.2"/><path d="M10 14h8M10 17h6M10 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                            <svg key="monitor-check" viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.2"/><path d="M9 14l3 3 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                          ],
                          HISTORY: [
                            <svg key="history-snap" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M8 7h12v14H8z" stroke="currentColor" strokeWidth="1.2"/><path d="M11 11h6M11 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
                            <svg key="history-branch" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M9 7v14M9 14h6a4 4 0 004-4V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="9" cy="7" r="1.6" fill="currentColor"/><circle cx="19" cy="7" r="1.6" fill="currentColor"/><circle cx="9" cy="21" r="1.6" fill="currentColor"/></svg>,
                            <svg key="history-compare" viewBox="0 0 28 28" width="16" height="16" fill="none"><path d="M6 8h7v12H6zM15 8h7v12h-7z" stroke="currentColor" strokeWidth="1.2"/><path d="M13 14h2" stroke="currentColor" strokeWidth="1.2"/></svg>,
                          ],
                        };
                        const icon = iconMap[feature.tag]?.[i] || <svg viewBox="0 0 28 28" width="16" height="16" fill="none"><circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.2"/></svg>;
                        return (
                          <div key={i} className="proof-point">
                            <div className="proof-icon" style={{ color: tc.dot, background: `${tc.dot}15` }}>{icon}</div>
                            <div className="proof-text">
                              <strong>{strong}</strong>
                              <span>{body}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="feature-visual">{feature.visual}</div>
                </section>
              );
            })}
          </div>
        </main>
        <Footer setPage={handleSetPage} />
      </>
    );
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="home" setPage={handleSetPage} topOffset={showBanner ? 68 : 0} />
            <Hero setPage={handleSetPage} />
            <div id="features"><Features /></div>
            <FounderCountdown />
            <Footer setPage={handleSetPage} />
          </>
        );
      case "features":
        return renderFeaturesPage();
      case "pricing":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="pricing" setPage={handleSetPage} topOffset={showBanner ? 68 : 0} />
            <LazyPage><Pricing setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "changelog":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="changelog" setPage={handleSetPage} topOffset={showBanner ? 68 : 0} />
            <LazyPage><Changelog setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "docs":
        return (
          <>
            <Navbar activePage="docs" setPage={handleSetPage} />
            <LazyPage><Docs setPage={handleSetPage} /></LazyPage>
          </>
        );
      case "download":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="download" setPage={handleSetPage} topOffset={showBanner ? 68 : 0} />
            <LazyPage><Downloads setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "login":
      case "account":
        return <LazyPage><Dashboard setPage={handleSetPage} /></LazyPage>;
      case "privacy":
        return (
          <>
            <Navbar activePage="" setPage={handleSetPage} />
            <LazyPage><Privacy setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "terms":
        return (
          <>
            <Navbar activePage="" setPage={handleSetPage} />
            <LazyPage><Terms setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      default:
        return <LazyPage><NotFound setPage={handleSetPage} /></LazyPage>;
    }
  };

  return (
    <div className="site-shell min-h-screen text-zinc-100 font-sans selection:bg-[#8f82df]/30" role="document">
      <div className="page-enter" role="main" id="main-content" aria-label="Main content">
        {renderPage()}
      </div>
    </div>
  );
};
