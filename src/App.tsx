import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "./components/ui";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FounderBanner } from "./components/FounderBanner";

import { Hero, Features, FounderCountdown } from "./pages/Home";

// Lazy load non-critical pages
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
  // Read initial page from URL
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (!path || path === "") return "home";
    const validPages = ["features", "pricing", "changelog", "docs", "download", "login", "account", "privacy", "terms"];
    return validPages.includes(path) ? path : "404";
  };

  const [page, setPage] = useState(getInitialPage);
  const [showBanner, setShowBanner] = useState(true);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
      const validPages = ["features", "pricing", "changelog", "docs", "download", "login", "account", "privacy", "terms"];
      setPage(validPages.includes(path) ? path : "404");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Scroll to top on page change
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

  // Handle hash clicks (anchor links within SPA)
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

  // Simple Router
  const renderPage = () => {
    switch(page) {
      case "home":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="home" setPage={handleSetPage} topOffset={showBanner ? 40 : 0} />
            <Hero setPage={handleSetPage} />
            <Features />
            <FounderCountdown />
            <Footer setPage={handleSetPage} />
          </>
        );
      case "features":
        return (
           <>
            <Navbar activePage="features" setPage={handleSetPage} />
            <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen">
              <button onClick={() => handleSetPage("home")} className="text-[#98a1b7] hover:text-white mb-6 sm:mb-8 flex items-center text-sm">
                <ArrowRight className="rotate-180 mr-2 w-4 h-4" /> Back to Home
              </button>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">What Aestra does.</h1>
              <p className="text-[#98a1b7] mb-16 max-w-2xl">Six systems. No filler. Every one built to work.</p>

              <div className="space-y-16">
                {[
                  { title: "Brutally Optimized", tag: "ENGINE", tagColor: "teal", desc: "Runs on a 5-year-old laptop without breaking a sweat. C++17, lock-free real-time processing. No garbage collection pauses. No runtime overhead.", details: ["<10ms audio latency target", "Lock-free SPSC ring buffers for UI-to-audio commands", "No memory allocation in the audio callback", "SIMD-optimized DSP (SSE/AVX runtime dispatch)", "RtAudio cross-platform I/O with WASAPI/ALSA/PulseAudio"] },
                  { title: "Instant Startup", tag: "PERFORMANCE", tagColor: "amber", desc: "Open Aestra and you're making music. No scanning. No splash screens. Plugin database is cached — first scan, instant after.", details: ["Plugin cache persists between sessions", "No startup audio device scan", "Lazy-load non-critical subsystems"] },
                  { title: "Pattern-First Workflow", tag: "DESIGN", tagColor: "purple", desc: "Built around how beats are actually made — not how software thinks you should make them. Patterns are first-class citizens.", details: ["Arsenal: pattern unit grid with synth/sampler/drum slots", "C|E|A mode switch: Clips, Editor, Automation on the same data", "Pattern clips on the timeline with double-click piano roll edit", "Loop-to-project: patterns become arrangements seamlessly"] },
                  { title: "Routing Visualizer", tag: "SIGNAL FLOW", tagColor: "blue", desc: "See exactly where your sound goes. Color-coded signal paths, live — so you can hear and see your mix at the same time.", details: ["Color-coded connections by source track", "Thick solid = main output, thin solid = audible sends, dotted = sidechain", "Animated signal dots when audio is playing", "Drag-to-route: connect nodes to create sends", "Left-to-right signal flow hierarchy: sources → buses → master"] },
                  { title: "Audition Mode", tag: "MONITORING", tagColor: "green", desc: "Hear your mix the way your listeners will — before you ever export. DSP presets simulate Spotify, Apple Music, AirPods, car speakers, and more.", details: ["Spotify: -14 LUFS, -1dB true peak", "Apple Music: -16 LUFS, Sound Check simulation", "YouTube: Opus compression artifacts", "SoundCloud: 128kbps MP3 degradation", "Car Speakers: Harman curve, bass boost, treble roll-off", "AirPods Pro: Adaptive EQ simulation", "A/B wet/dry toggle for instant comparison", "Queue-based playback — listen like a listener, not a producer"] },
                  { title: "Version Control", tag: "HISTORY", tagColor: "coral", desc: "Save mix versions with musical names. Come back, compare, blend the best parts. Never lose a good take again.", details: ["Takes (branches) — diverge a mix at any point", "Snapshots (commits) — full project state at a point in time", "Blends (merges) — combine changes from two Takes", "Auto-snapshots before destructive operations", "Cloud sync planned for v1.2+"] },
                ].map((feature, i) => {
                  const tagColors: Record<string, { text: string; bg: string; border: string }> = {
                    teal:   { text: "text-[#1db4a6]", bg: "bg-[#1db4a6]/10", border: "border-[#1db4a6]/20" },
                    amber:  { text: "text-[#e8a230]", bg: "bg-[#e8a230]/10", border: "border-[#e8a230]/20" },
                    purple: { text: "text-[#8b7de8]", bg: "bg-[#8b7de8]/10", border: "border-[#8b7de8]/20" },
                    blue:   { text: "text-[#4a9eff]", bg: "bg-[#4a9eff]/10", border: "border-[#4a9eff]/20" },
                    green:  { text: "text-[#4caf6e]", bg: "bg-[#4caf6e]/10", border: "border-[#4caf6e]/20" },
                    coral:  { text: "text-[#e06a4e]", bg: "bg-[#e06a4e]/10", border: "border-[#e06a4e]/20" },
                  };
                  const tc = tagColors[feature.tagColor] || tagColors.blue;
                  return (
                  <div key={i} className="section-frame panel-glow rounded-[16px] p-5 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[9px] font-bold ${tc.text} ${tc.bg} border ${tc.border} px-2 py-0.5 rounded`}>{feature.tag}</span>
                      <h2 className="text-2xl font-bold text-white">{feature.title}</h2>
                    </div>
                    <p className="text-[#98a1b7] mb-6 leading-relaxed">{feature.desc}</p>
                    <ul className="space-y-2">
                      {feature.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#cfd5e4]">
                          <span className="text-[#61d5ff] mt-0.5">›</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  );
                })}
              </div>
            </div>
            <Footer setPage={handleSetPage} />
           </>
        );
      case "pricing":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="pricing" setPage={handleSetPage} topOffset={showBanner ? 40 : 0} />
            <LazyPage><Pricing setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "changelog":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="changelog" setPage={handleSetPage} topOffset={showBanner ? 40 : 0} />
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
            <Navbar activePage="download" setPage={handleSetPage} topOffset={showBanner ? 40 : 0} />
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
