import React, { useState, useEffect, useMemo, memo } from "react";
import { Download, ChevronRight, Check, Zap, Layout, Shield, Music, Eye, GitBranch } from "lucide-react";
import { cn } from "../lib";
import { Button, Badge, FeatureCard, FadeIn } from "../components/ui";
import { MockTimeline } from "../components/MockTimeline";
import type { PageProps } from "../types";

/* ── Hero ───────────────────────────────────────────────────────── */
const Hero = ({ setPage }: PageProps) => {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-8 h-64 sm:h-80 lg:h-[560px] bg-[radial-gradient(circle_at_top,rgba(0,229,204,0.07),transparent_44%)] pointer-events-none" />

      {/* Prism accent lines */}
      <div className="absolute top-32 left-8 w-48 prism-line hidden lg:block" style={{ transform: "rotate(-12deg)" }} />
      <div className="absolute top-48 right-12 w-32 prism-line hidden lg:block" style={{ transform: "rotate(8deg)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid gap-8 sm:gap-10">
          <div>
            <FadeIn delay={0.1}>
              <h1 className="editorial-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
                A native DAW for<br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#00e5cc,#9257ff_48%,#e8a838)]">
                  producers who want flow.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-[#a4abc0] max-w-2xl mb-6 sm:mb-10 leading-relaxed">
                Aestra is an accessible, premium digital audio workstation built around speed, stability, and producer-first workflow. Make music, not excuses.
              </p>
            </FadeIn>

            <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
              <Button size="lg" onClick={() => setPage("download")} icon={Download} className="w-full sm:w-auto">
                Download Beta
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setPage("features")} className="w-full sm:w-auto">
                Explore Features <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>

      <MockTimeline />
    </section>
  );
};

/* ── Why Aestra Exists ──────────────────────────────────────────── */
const WhySection = memo(() => (
  <section className="content-defer py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      <div className="section-divider mb-12 sm:mb-16" />
      <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-start">
        <FadeIn>
          <span className="eyebrow mb-4 block">Why Aestra</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white editorial-title mb-4 sm:mb-6">
            Existing DAWs are powerful.<br />
            <span className="text-[#a4abc0]">Producers still fight them.</span>
          </h2>
          <p className="text-[#7a82a0] text-sm sm:text-base leading-relaxed max-w-md">
            Crashes mid-session. Routing confusion. Slow export and debug cycles. Creative interruptions that kill momentum. Aestra&apos;s goal is to make music creation feel direct, reliable, and personal.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="space-y-3">
            {[
              ["Crashes and plugin conflicts", "Aestra runs a native engine with stable sessions from the start."],
              ["Slow startup and scanning", "Open Aestra and you're making music. No scanning, no splash screen."],
              ["Opaque routing and export paths", "Visual signal routing shows exactly where your sound goes."],
              ["Creative interruptions", "Pattern-first workflow keeps you in the loop, not in menus."],
            ].map(([problem, solution], i) => (
              <div key={i} className="glass-panel rounded-xl p-4 sm:p-5 flex gap-4">
                <div className="w-1 rounded-full bg-[#7c3aed] flex-shrink-0" />
                <div>
                  <div className="text-[#e85454] text-xs font-mono uppercase tracking-wider mb-1">Problem</div>
                  <div className="text-white text-sm font-medium mb-2">{problem}</div>
                  <div className="text-[#7a82a0] text-xs leading-relaxed">{solution}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── Feature Pillars ────────────────────────────────────────────── */
const Features = memo(() => (
  <section className="content-defer py-16 sm:py-20 lg:py-28 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 sm:mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow mb-3 block">Core Pillars</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Built different. Literally.</h2>
          <p className="text-base sm:text-lg text-[#a4abc0] max-w-3xl">
            We built the engine, the interface, every pixel — so the only thing you feel is the music.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <FeatureCard
          label="Performance"
          color="teal"
          title="Brutally Optimized"
          description="Runs on a 5-year-old laptop without breaking a sweat. Built for the hardware you have."
          visual={
            <div className="flex items-end gap-1 h-full">
              {[72, 55, 83, 60, 45, 70, 50, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-[#1e2230] rounded-[3px] relative overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 right-0 rounded-[3px] bg-[#00e5ccaa] transition-all duration-300 group-hover:h-[20%]" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          }
          delay={0}
        />
        <FeatureCard
          label="Startup"
          color="amber"
          title="Instant Startup"
          description="Open Aestra and you're making music. No scanning. No waiting. Nothing in your way."
          visual={
            <div className="flex flex-col justify-center h-full gap-2">
              <div className="flex items-center justify-between text-[11px] text-[#4a5068]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4a5068] group-hover:bg-[#3dbb6e] transition-colors" />
                  Aestra
                </span>
              </div>
              <div className="h-1 bg-[#1e2230] rounded-full overflow-hidden">
                <div className="h-full bg-[#e8a838] rounded-full w-0 group-hover:w-full transition-[width] duration-[80ms]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#4a5068]">
                <span>No plugins scanned</span>
                <span>No splash screen</span>
              </div>
            </div>
          }
          delay={0.1}
        />
        <FeatureCard
          label="Workflow"
          color="purple"
          title="Pattern-First Workflow"
          description="Built around how beats are actually made — not how software thinks you should make them."
          visual={
            <div className="grid grid-cols-8 grid-rows-3 gap-1 h-full">
              {[
                1,0,0,1,0,1,0,0,
                0,1,0,0,1,0,1,1,
                1,0,1,0,0,1,0,0
              ].map((on, i) => (
                <div key={i} className={`rounded-[3px] transition-all duration-150 ${on ? 'bg-[#7c3aed]' : 'bg-[#1e2230]'} group-hover:${on ? 'bg-[#9257ff]' : 'opacity-60'}`} />
              ))}
            </div>
          }
          delay={0.2}
        />
        <FeatureCard
          label="Signal Flow"
          color="blue"
          title="Routing Visualizer"
          description="See exactly where your sound goes — color-coded, live, as you mix."
          visual={
            <svg className="w-full h-full" viewBox="0 0 220 64">
              <circle cx="20" cy="32" r="8" fill="#9257ff22" stroke="#9257ff" strokeWidth="1.5"/>
              <text x="20" y="36" textAnchor="middle" fontSize="8" fill="#9257ff">IN</text>
              <line x1="28" y1="32" x2="70" y2="20" stroke="#9257ff44" strokeWidth="1"/>
              <line x1="28" y1="32" x2="70" y2="44" stroke="#9257ff44" strokeWidth="1"/>
              <rect x="70" y="12" width="36" height="16" rx="4" fill="#9257ff15" stroke="#9257ff66" strokeWidth="1"/>
              <text x="88" y="23" textAnchor="middle" fontSize="7" fill="#9257ffaa">EQ</text>
              <rect x="70" y="36" width="36" height="16" rx="4" fill="#9257ff15" stroke="#9257ff66" strokeWidth="1"/>
              <text x="88" y="47" textAnchor="middle" fontSize="7" fill="#9257ffaa">VERB</text>
              <line x1="106" y1="20" x2="148" y2="32" stroke="#9257ff44" strokeWidth="1"/>
              <line x1="106" y1="44" x2="148" y2="32" stroke="#9257ff44" strokeWidth="1"/>
              <rect x="148" y="24" width="44" height="16" rx="4" fill="#9257ff22" stroke="#9257ff" strokeWidth="1.5"/>
              <text x="170" y="35" textAnchor="middle" fontSize="7" fill="#9257ff">MASTER</text>
              <circle cx="200" cy="32" r="6" fill="#9257ff33" stroke="#9257ff" strokeWidth="1"/>
              <line x1="192" y1="32" x2="194" y2="32" stroke="#9257ff" strokeWidth="1.5"/>
              <circle cx="14" cy="32" r="2" fill="#9257ff">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          }
          delay={0.3}
        />
        <FeatureCard
          label="Monitoring"
          color="green"
          title="Audition Mode"
          description="Hear your mix the way your listeners will — before you ever export."
          visual={
            <div className="flex flex-wrap gap-1.5 content-center h-full">
              {["Spotify", "Apple Music", "AirPods", "Car speakers", "Phone speaker", "Earbuds"].map((p) => (
                <span key={p} className="bg-[#1e2230] border border-[#2a2f42] rounded-full px-2.5 py-1 text-[11px] text-[#5a6080] group-hover:text-[#3dbb6e] group-hover:border-[#3dbb6e40] group-hover:bg-[#3dbb6e10] transition-all">
                  {p}
                </span>
              ))}
            </div>
          }
          delay={0.4}
        />
        <FeatureCard
          label="History"
          color="coral"
          title="Version Control"
          description="Save mix versions with musical names. Come back, compare, blend the best takes."
          visual={
            <svg className="w-full h-full" viewBox="0 0 220 64">
              <line x1="20" y1="32" x2="200" y2="32" stroke="#e8545433" strokeWidth="1.5"/>
              <circle cx="20" cy="32" r="5" fill="#1e2230" stroke="#e85454" strokeWidth="1.5"/>
              <circle cx="60" cy="32" r="5" fill="#1e2230" stroke="#e8545466" strokeWidth="1.5"/>
              <line x1="60" y1="32" x2="90" y2="16" stroke="#e8545444" strokeWidth="1"/>
              <circle cx="90" cy="16" r="4" fill="#1e2230" stroke="#e8545455" strokeWidth="1"/>
              <circle cx="120" cy="16" r="4" fill="#1e2230" stroke="#e8545455" strokeWidth="1"/>
              <line x1="90" y1="16" x2="120" y2="16" stroke="#e8545433" strokeWidth="1"/>
              <line x1="120" y1="16" x2="150" y2="32" stroke="#e8545444" strokeWidth="1"/>
              <circle cx="150" cy="32" r="5" fill="#1e2230" stroke="#e8545466" strokeWidth="1.5"/>
              <circle cx="190" cy="32" r="6" fill="#e8545422" stroke="#e85454" strokeWidth="1.5"/>
              <text x="34" y="26" fontSize="7" fill="#e8545466">rough mix</text>
              <text x="155" y="26" fontSize="7" fill="#e8545466">final</text>
              <text x="80" y="11" fontSize="7" fill="#e8545466">vox take</text>
              <text x="182" y="36" fontSize="7" fill="#e85454aa">v3</text>
            </svg>
          }
          delay={0.5}
        />
      </div>
    </div>
  </section>
));

/* ── Plugin Highlights ──────────────────────────────────────────── */
const Plugins = memo(() => (
  <section className="content-defer py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      <div className="section-divider mb-12 sm:mb-16" />
      <FadeIn>
        <span className="eyebrow mb-4 block">Built-in Tools</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white editorial-title mb-3 sm:mb-4">
          Creative tools that ship with the DAW.
        </h2>
        <p className="text-[#7a82a0] text-sm sm:text-base max-w-xl mb-10 sm:mb-14">
          No hunting for third-party plugins to get started. Aestra ships with essential production tools built natively for the engine.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <FadeIn delay={0}>
          <div className="glass-panel rounded-2xl p-6 sm:p-8 h-full group hover:border-[#7c3aed]/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#7c3aed] font-medium mb-2">Reverb</div>
            <h3 className="text-lg font-semibold text-white mb-2">Aestra Verb</h3>
            <p className="text-[13px] text-[#7a82a0] leading-relaxed">
              Algorithmic reverb with plate, hall, and room modes. Low CPU, high character. Built for the Aestra engine.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3dbb6e]/10 text-[#3dbb6e] border border-[#3dbb6e]/20">Available</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass-panel rounded-2xl p-6 sm:p-8 h-full group hover:border-[#9257ff]/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#9257ff]/15 border border-[#9257ff]/25 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9257ff" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 20h16M4 20V10M8 20v-6M12 20V8M16 20v-4M20 20V6" />
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#9257ff] font-medium mb-2">Equalizer</div>
            <h3 className="text-lg font-semibold text-white mb-2">Aestra EQ</h3>
            <p className="text-[13px] text-[#7a82a0] leading-relaxed">
              Parametric EQ with spectrum analyzer. Clean curves, transparent sound. The kind of EQ you reach for first.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3dbb6e]/10 text-[#3dbb6e] border border-[#3dbb6e]/20">Available</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass-panel rounded-2xl p-6 sm:p-8 h-full group hover:border-[#e8a838]/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#e8a838]/15 border border-[#e8a838]/25 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#e8a838" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 14h4v6H4zM10 10h4v10h-4zM16 6h4v14h-4z" />
              </svg>
            </div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#e8a838] font-medium mb-2">Compressor</div>
            <h3 className="text-lg font-semibold text-white mb-2">Aestra Comp</h3>
            <p className="text-[13px] text-[#7a82a0] leading-relaxed">
              Bus and channel compression with visual gain reduction metering. Clean dynamics control.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8a838]/10 text-[#e8a838] border border-[#e8a838]/20">In Progress</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── Free Core / Supporter ──────────────────────────────────────── */
const FreeCore = memo(({ setPage }: PageProps) => (
  <section className="content-defer py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto">
      <div className="section-divider mb-12 sm:mb-16" />
      <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
        <FadeIn>
          <span className="eyebrow mb-4 block">Open Access</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white editorial-title mb-4 sm:mb-6">
            Free core.<br />
            <span className="text-[#7c3aed]">Pay what you want to go further.</span>
          </h2>
          <p className="text-[#7a82a0] text-sm sm:text-base leading-relaxed mb-6">
            The full DAW is free. No feature gates. No export limits. Supporter tiers fund development without locking access behind high prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={() => setPage("download")} icon={Download} className="w-full sm:w-auto">
              Download Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => setPage("pricing")} className="w-full sm:w-auto">
              View Pricing <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-3">
            {[
              { tier: "Core", price: "$0", desc: "Full DAW. Forever free.", accent: "#3dbb6e" },
              { tier: "Supporter", price: "$5/mo", desc: "Priority builds + supporter badge.", accent: "#7c3aed" },
              { tier: "Founder", price: "$129", desc: "One-time. Lifetime access. Your name in the product.", accent: "#e8a838" },
            ].map(({ tier, price, desc, accent }) => (
              <div key={tier} className="glass-panel rounded-xl p-5 flex items-center gap-5">
                <div className="w-1 rounded-full flex-shrink-0" style={{ background: accent }} />
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">{tier}</div>
                  <div className="text-[#7a82a0] text-xs">{desc}</div>
                </div>
                <div className="text-lg font-bold text-white font-mono">{price}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── Closing CTA ────────────────────────────────────────────────── */
const ClosingCTA = memo(({ setPage }: PageProps) => (
  <section className="content-defer py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
    <div className="max-w-3xl mx-auto text-center">
      <div className="section-divider mb-12 sm:mb-16" />
      <FadeIn>
        <span className="eyebrow mb-4 block">Get Started</span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white editorial-title mb-4 sm:mb-6">
          Make music,<br />
          <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#00e5cc,#9257ff_48%,#e8a838)]">not excuses.</span>
        </h2>
        <p className="text-[#7a82a0] text-sm sm:text-base max-w-md mx-auto mb-8 sm:mb-10">
          Download Aestra and start making music today. Free core, no strings attached.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button size="lg" onClick={() => setPage("download")} icon={Download} className="w-full sm:w-auto">
            Download Beta
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setPage("features")} className="w-full sm:w-auto">
            Explore Features <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </FadeIn>
    </div>
  </section>
));

/* ── Founder Countdown (kept from original) ─────────────────────── */
const FounderCountdown = () => {
  const targetDate = new Date("2026-12-25T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [spotsLeft] = useState(500);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const totalSeconds = Math.floor(diff / 1000);
      const months = Math.floor(totalSeconds / (30.44 * 24 * 3600));
      const remaining = totalSeconds - months * Math.floor(30.44 * 24 * 3600);
      const days = Math.floor(remaining / (24 * 3600));
      const hours = Math.floor((remaining % (24 * 3600)) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setTimeLeft({ months, days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("https://formspree.io/f/xnjlaqqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "founder-waitlist" }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="section-frame rounded-[18px] px-3 sm:px-5 py-3 sm:py-4 min-w-[72px] sm:min-w-[92px] flex-1">
      <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white font-mono tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] sm:text-[11px] text-[#8b94aa] uppercase tracking-[0.18em] mt-1 sm:mt-2">{label}</div>
    </div>
  );

  return (
    <section id="founder-section" className="content-defer py-16 sm:py-20 lg:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,168,56,0.06),transparent_40%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 section-frame panel-glow rounded-[16px] sm:rounded-[20px] p-5 sm:p-8 md:p-12">
        <div className="max-w-3xl">
          <FadeIn className="flex justify-start mb-4 sm:mb-8">
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#e8a838]/30 bg-[#e8a838]/10 text-[#f6de8d] text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#e8a838] animate-pulse" />
              <span className="hidden sm:inline">Founder Gold Card Window</span>
              <span className="sm:hidden">Founder Gold</span>
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 editorial-title">
              <span className="sm:hidden">No second runs</span>
              <span className="hidden sm:inline">
                Some things
                <br />
              </span>
              <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#e8a838,#f1d88b_55%,#9257ff)]">
                don&apos;t get a second run.
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg text-[#a4abc0] mb-6 sm:mb-12 max-w-2xl">
              Not a subscription. Not a tier. A piece of history — your name in the product, your Founder number forever, and lifetime access from day one.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-base text-[#e8a838] font-mono font-bold">{500 - spotsLeft} / 500 claimed</span>
            <span className="text-xs text-[#8b94aa]">{spotsLeft} spots left</span>
          </div>
          <div className="w-full h-3 sm:h-4 rounded-full bg-[#1a1f2e] border border-[#343c4d] overflow-hidden">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#e8a838,#f1d88b)] transition-all duration-500"
              style={{ width: `${((500 - spotsLeft) / 500) * 100}%` }}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.mail"
                required
                aria-label="Email address for waitlist"
                className="flex-1 h-12 px-4 rounded-[14px] bg-[#141924] border border-[#343c4d] text-white text-sm placeholder-[#6f778d] focus:outline-none focus:ring-2 focus:ring-[#e8a838]/35 focus:border-[#e8a838]/45"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-12 px-6 rounded-[14px] border border-[#e8a838]/40 bg-[linear-gradient(180deg,#e8a838,#a7802c)] text-white font-medium text-sm hover:brightness-105 transition-all shadow-[0_0_22px_rgba(232,168,56,0.22)] disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[#e8a838]">
                <Check className="w-5 h-5" />
                <span className="font-medium">You&apos;re on the list.</span>
              </div>
              <p className="text-[#8b94aa] text-sm">
                We&apos;ll email you when Founder cards open. Watch the countdown.
              </p>
            </div>
          )}
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </FadeIn>
      </div>
    </section>
  );
};

export { Hero, Features, FounderCountdown, WhySection, Plugins, FreeCore, ClosingCTA };
