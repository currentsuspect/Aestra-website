import React, { useState, useEffect, useMemo, memo } from "react";
import { Download, ChevronRight, Check, Music2, Cpu, Layers, Workflow, Headphones, GitBranch, Sparkles } from "lucide-react";
import { Button, Badge, FeatureCard, FadeIn } from "../components/ui";
import { MockTimeline } from "../components/MockTimeline";
import type { PageProps } from "../types";

/* ── Hero ─────────────────────────────────────────────────────── */
const FEATURE_LIST = [
  { icon: Headphones, name: "Audition",        desc: "Hear your mix through phones, cars, laptops and club systems — instantly." },
  { icon: Workflow,   name: "Node Routing",    desc: "Visual signal flow. No hidden sends. No routing mysteries." },
  { icon: GitBranch,  name: "Session History", desc: "Git-inspired versioning. Never lose a session again." },
  { icon: Layers,     name: "Takes",           desc: "Record freely. Every take stays recoverable." },
  { icon: Sparkles,   name: "Muse",            desc: "Suggests sounds, fixes workflow friction, and helps you finish tracks.", badge: "Coming soon" },
];

const Hero = ({ setPage }: PageProps) => {
  return (
    <section className="relative pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <FadeIn>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[12px] text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Beta · source-available · cross-platform
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1 className="display text-[40px] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[72px] text-zinc-50 mb-6 max-w-xl">
                A native DAW for<br className="hidden sm:block" />
                producers who want flow.
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mb-10 leading-relaxed">
                Make music, not excuses.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button size="lg" onClick={() => setPage("download")} icon={Download}>
                  Download for free
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setPage("features")}>
                  See features <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-zinc-400">
                <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Windows · macOS · Linux</span>
                <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> VST3 &amp; CLAP</span>
                <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Source available</span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.25}>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-2">
              <div className="divide-y divide-zinc-800/80">
                {FEATURE_LIST.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.name} className="flex items-center gap-4 px-4 py-3.5">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <Icon className="w-[18px] h-[18px] text-zinc-300" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[14px] font-medium text-zinc-100 leading-snug">{f.name}</span>
                          {f.badge && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 border border-amber-500/20 bg-amber-500/10 rounded px-1.5 py-0.5">
                              {f.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[12px] text-zinc-400 leading-snug">{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <ScrollHint />

      <MockTimeline />
    </section>
  );
};

/* ── Why Aestra ───────────────────────────────────────────────── */
const WhySection = memo(() => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-4">Why Aestra</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-zinc-50 mb-6 max-w-3xl">
          Existing DAWs are powerful.<br />
          <span className="text-zinc-400">Producers still fight them.</span>
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-14">
          Crashes mid-session. Routing confusion. Slow export. Creative interruptions
          that kill momentum. Aestra removes the friction between the idea and the take.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 gap-px bg-zinc-800/80 rounded-2xl overflow-hidden border border-zinc-800/80">
        {[
          ["Crashes and plugin conflicts", "Aestra runs a native C++ engine with stable sessions from the start."],
          ["Slow startup and scanning", "Open Aestra and you're making music. No scanning, no splash screen."],
          ["Opaque routing and export paths", "Visual signal routing shows exactly where your sound goes."],
          ["Creative interruptions", "Pattern-first workflow keeps you in the loop, not in menus."],
        ].map(([problem, solution], i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="bg-zinc-950 p-6 sm:p-7 h-full">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                <div>
                  <div className="text-zinc-50 font-medium mb-1.5">{problem}</div>
                  <div className="text-zinc-400 text-sm leading-relaxed">{solution}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
));

/* ── Feature pillars ─────────────────────────────────────────── */
const Features = memo(() => (
  <section id="features" className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-4">Core pillars</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-zinc-50 mb-4 max-w-3xl">
          Built different. Literally.
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-14">
          We built the engine, the interface, every pixel — so the only thing
          you feel is the music.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <FeatureCard
          label="Performance"
          color="teal"
          title="Native by default"
          description="A C++17 audio engine that runs light on a five-year-old laptop. No JVM, no Electron, no compromise."
          visual={
            <div className="flex items-end gap-1.5 h-full">
              {[72, 55, 83, 60, 45, 70, 50, 65, 58, 75].map((h, i) => (
                <div key={i} className="relative flex-1 h-full bg-zinc-900 rounded-sm overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-teal-500/70 rounded-sm" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          }
          delay={0}
        />
        <FeatureCard
          label="Startup"
          color="amber"
          title="Instant launch"
          description="Open Aestra and you're in the session. No plugin scanning, no splash screen, no waiting."
          visual={
            <div className="flex flex-col justify-center h-full gap-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Cold start</span>
                <span className="font-mono text-amber-400">1.4s</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "92%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>vs. 12s typical</span>
                <span>no plugin scan</span>
              </div>
            </div>
          }
          delay={0.05}
        />
        <FeatureCard
          label="Workflow"
          color="purple"
          title="Pattern-first"
          description="Built around how beats are actually made — patterns, not timelines. Sketches become tracks."
          visual={
            <div className="grid grid-cols-8 grid-rows-3 gap-1 h-full">
              {[
                1,0,0,1,0,1,0,0,
                0,1,0,0,1,0,1,1,
                1,0,1,0,0,1,0,0
              ].map((on, i) => (
                <div key={i} className={`rounded-sm ${on ? 'bg-violet-500/80' : 'bg-zinc-900'}`} />
              ))}
            </div>
          }
          delay={0.1}
        />
        <FeatureCard
          label="Signal flow"
          color="blue"
          title="Live routing"
          description="See exactly where your sound goes — color-coded, animated, as you mix."
          visual={
            <svg className="w-full h-full" viewBox="0 0 220 60" preserveAspectRatio="none">
              <circle cx="20" cy="30" r="6" fill="#3b82f633" stroke="#3b82f6" strokeWidth="1.2"/>
              <rect x="60" y="14" width="32" height="14" rx="3" fill="#3b82f615" stroke="#3b82f680" strokeWidth="1"/>
              <rect x="60" y="32" width="32" height="14" rx="3" fill="#3b82f615" stroke="#3b82f680" strokeWidth="1"/>
              <rect x="130" y="22" width="40" height="16" rx="3" fill="#3b82f622" stroke="#3b82f6" strokeWidth="1.2"/>
              <circle cx="195" cy="30" r="5" fill="#3b82f633" stroke="#3b82f6" strokeWidth="1.2"/>
              <line x1="26" y1="30" x2="60" y2="21" stroke="#3b82f644" strokeWidth="1"/>
              <line x1="26" y1="30" x2="60" y2="39" stroke="#3b82f644" strokeWidth="1"/>
              <line x1="92" y1="21" x2="130" y2="30" stroke="#3b82f644" strokeWidth="1"/>
              <line x1="92" y1="39" x2="130" y2="30" stroke="#3b82f644" strokeWidth="1"/>
              <line x1="170" y1="30" x2="190" y2="30" stroke="#3b82f6" strokeWidth="1.2"/>
              <circle cx="16" cy="30" r="1.5" fill="#3b82f6">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          }
          delay={0.15}
        />
        <FeatureCard
          label="Monitoring"
          color="green"
          title="Translation preview"
          description="Hear your mix through phone speakers, earbuds, and car audio — before you ever export."
          visual={
            <div className="flex flex-wrap gap-1.5 content-center h-full">
              {["Spotify", "AirPods", "Car", "Phone", "Laptop", "Earbuds"].map((p) => (
                <span key={p} className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-0.5 text-[11px] text-zinc-400">
                  {p}
                </span>
              ))}
            </div>
          }
          delay={0.2}
        />
        <FeatureCard
          label="History"
          color="coral"
          title="Takes &amp; branches"
          description="Save mix versions with readable names. Branch alternate ideas, compare, merge the best."
          visual={
            <div className="flex flex-col justify-center h-full gap-1.5 text-[11px]">
              {[
                { name: "rough mix", dot: "#71717a" },
                { name: "with 808 rewrite", dot: "#f43f5e" },
                { name: "v3 — final", dot: "#f43f5e", active: true },
              ].map((b) => (
                <div key={b.name} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: b.dot }} />
                  <span className={b.active ? "text-zinc-50 font-medium" : "text-zinc-400"}>{b.name}</span>
                </div>
              ))}
            </div>
          }
          delay={0.25}
        />
      </div>
    </div>
  </section>
));

/* ── Plugin highlights ───────────────────────────────────────── */
const Plugins = memo(() => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-4">Built-in tools</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-zinc-50 mb-4 max-w-3xl">
          Creative tools that ship with the DAW.
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-14">
          No hunting for third-party plugins to get started. Aestra ships
          with essential production tools built natively for the engine.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: Music2,
            color: "violet",
            name: "Aestra Verb",
            kind: "Reverb",
            desc: "Algorithmic reverb with plate, hall, and room modes. Low CPU, high character.",
            status: "Available",
            statusColor: "emerald",
          },
          {
            icon: Layers,
            color: "blue",
            name: "Aestra EQ",
            kind: "Equalizer",
            desc: "Parametric EQ with spectrum analyzer. Clean curves, transparent sound.",
            status: "Available",
            statusColor: "emerald",
          },
          {
            icon: Cpu,
            color: "amber",
            name: "Aestra Comp",
            kind: "Compressor",
            desc: "Bus and channel compression with visual gain reduction metering.",
            status: "In progress",
            statusColor: "amber",
          },
        ].map((p, i) => {
          const Icon = p.icon;
          const dotBg =
            p.color === "violet" ? "bg-violet-500/10 border-violet-500/20 text-violet-400" :
            p.color === "blue"   ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                   "bg-amber-500/10 border-amber-500/20 text-amber-400";
          return (
            <FadeIn key={p.name} delay={i * 0.05}>
              <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-6 sm:p-7 h-full hover:border-zinc-700 transition-colors">
                <div className={`w-10 h-10 rounded-lg ${dotBg} border flex items-center justify-center mb-5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[12px] text-zinc-400 mb-1.5">{p.kind}</div>
                <h3 className="text-[17px] font-semibold text-zinc-50 tracking-tight mb-2">{p.name}</h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed mb-5">{p.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-[12px] ${
                  p.statusColor === "emerald" ? "text-emerald-400" : "text-amber-400"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    p.statusColor === "emerald" ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  {p.status}
                </span>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  </section>
));

/* ── Free core / supporter ───────────────────────────────────── */
const FreeCore = memo(({ setPage }: PageProps) => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <FadeIn>
          <p className="kicker mb-4">Open access</p>
          <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-zinc-50 mb-6">
            Free core.<br />
            <span className="text-zinc-400">Pay what you want to go further.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8">
            The full DAW is free. No feature gates. No export limits.
            Supporter tiers fund development without locking anything behind a paywall.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={() => setPage("download")} icon={Download}>
              Download free
            </Button>
            <Button variant="outline" size="lg" onClick={() => setPage("pricing")}>
              See pricing <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 divide-y divide-zinc-800/80">
            {[
              { tier: "Core",       price: "$0",     desc: "Full DAW. Forever free.",     accent: "emerald" },
              { tier: "Supporter",  price: "$5/mo",  desc: "Priority builds + cloud sync.", accent: "violet" },
              { tier: "Founder",    price: "$129",   desc: "One-time. Lifetime. Your name in the product.", accent: "amber" },
            ].map(({ tier, price, desc, accent }) => (
              <div key={tier} className="flex items-center gap-5 p-5 sm:p-6">
                <span className={`h-2 w-2 rounded-full shrink-0 ${
                  accent === "emerald" ? "bg-emerald-400" :
                  accent === "violet"  ? "bg-violet-400"  :
                                         "bg-amber-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-50 font-medium">{tier}</div>
                  <div className="text-zinc-400 text-sm">{desc}</div>
                </div>
                <div className="text-[15px] font-mono text-zinc-50">{price}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── Closing CTA ─────────────────────────────────────────────── */
const ClosingCTA = memo(({ setPage }: PageProps) => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-3xl mx-auto text-center">
      <FadeIn>
        <p className="kicker mb-4">Get started</p>
        <h2 className="display text-3xl sm:text-5xl md:text-6xl text-zinc-50 mb-6">
          Make music,<br />not excuses.
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto mb-10">
          Download Aestra and start making music today. Free core, no strings attached.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => setPage("download")} icon={Download}>
            Download for free
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setPage("features")}>
            See features <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </FadeIn>
    </div>
  </section>
));

/* ── Scroll hint (bottom-center, fades on scroll) ────────────── */
const ScrollHint = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = Math.min(1, window.scrollY / 180);
        setOpacity(1 - t);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2.5 pointer-events-none select-none transition-opacity duration-300 ease-out"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        width="20"
        height="34"
        viewBox="0 0 20 34"
        className="text-zinc-400"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="18"
          height="32"
          rx="9"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="10" r="1.6" fill="currentColor">
          <animate
            attributeName="cy"
            values="8;16;8"
            dur="1.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
            keyTimes="0; 0.5; 1"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-400">
        Scroll
      </span>
    </div>
  );
};

/* ── Founder Countdown ───────────────────────────────────────── */
const FOUNDER_TOTAL = 500;
const FOUNDER_CLAIMED = 31;
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || "xnjlaqqr";

const FounderCountdown = () => {
  const targetDate = new Date("2026-12-25T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const spotsLeft = FOUNDER_TOTAL - FOUNDER_CLAIMED;

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
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
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

  const CountdownUnit = ({ value, label, last }: { value: number; label: string; last?: boolean }) => (
    <div className="flex-1 min-w-0 flex flex-col gap-1.5 px-2 first:pl-0 last:pr-0">
      <div className="text-2xl sm:text-[28px] font-semibold text-zinc-50 font-mono tabular-nums tracking-tight leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <section id="founder-section" className="py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 sm:p-10 md:p-14">
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-14 items-start">
              <div>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Founder window · 500 cards
                </span>
                <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-zinc-50 mb-5">
                  Some things don't get a second run.
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
                  Not a subscription. Not a tier. A piece of history — your name
                  in the product, your Founder number forever, and lifetime access from day one.
                </p>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-zinc-300">
                      <span className="text-amber-300 font-mono font-semibold">{FOUNDER_CLAIMED}</span> / {FOUNDER_TOTAL} claimed
                    </span>
                    <span className="text-zinc-400 text-[13px]">{spotsLeft} spots left</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(FOUNDER_CLAIMED / FOUNDER_TOTAL) * 100}%` }} />
                  </div>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@studio.email"
                      required
                      aria-label="Email address for waitlist"
                      className="flex-1 h-11 px-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-50 text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="h-11 px-5 rounded-lg bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {submitting ? "Joining..." : "Join waitlist"}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 text-zinc-100">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">You're on the list.</span>
                  </div>
                )}
                {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
              </div>

              <div className="lg:w-72">
                <p className="kicker mb-4">Beta launch</p>
                <div className="flex items-stretch divide-x divide-zinc-800/80 border-y border-zinc-800/80 py-3">
                  <CountdownUnit value={timeLeft.months} label="Mo" />
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <CountdownUnit value={timeLeft.hours} label="Hrs" />
                  <CountdownUnit value={timeLeft.minutes} label="Min" />
                  <CountdownUnit value={timeLeft.seconds} label="Sec" last />
                </div>
                <p className="text-zinc-400 text-[12px] mt-4 leading-relaxed">
                  Founder access activates when beta launches in December 2026.
                  Waitlist locks your slot number.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { Hero, Features, FounderCountdown, WhySection, Plugins, FreeCore, ClosingCTA };
