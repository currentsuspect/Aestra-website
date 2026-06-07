import React, { useState, useEffect, memo, lazy, Suspense } from "react";
import { ChevronRight, Check, Music2, Cpu, Layers, Workflow, Headphones, Sparkles, Plus, Minus, ArrowRight, CalendarDays, Activity } from "lucide-react";
import { Button, FeatureCard, FadeIn } from "../components/ui";
import { useToast } from "../components/Toast";
import { prefersReducedMotion } from "../lib";
import { RELEASES } from "../changelogData";
import type { PageProps } from "../types";

const MockTimeline = lazy(() =>
  import("../components/MockTimeline").then((m) => ({ default: m.MockTimeline }))
);

const mockFallback = <div className="h-px" aria-hidden="true" />;

const SingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 -0.19 122.88 122.88" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M82.07,40.62c4.82,4.82,7.23,11.14,7.23,17.45c0,6.32-2.41,12.63-7.23,17.45c-1.24,1.24-2.59,2.33-4.01,3.25 c-6.91-0.5-14.59-5.59-20.9-12.23c-6.52-6.86-11.52-15.29-12.75-22.09c-0.03-0.15-0.05-0.29-0.07-0.44 c0.83-1.19,1.77-2.33,2.84-3.39c4.82-4.82,11.14-7.23,17.45-7.23C70.94,33.39,77.25,35.8,82.07,40.62L82.07,40.62z M108.73,37.6 h4.4v1.47c11.01,2.52,12.27,7.81,5.88,16.14c0.68-8.27-0.15-10.04-5.88-10.43v20.9c0.01,0.11,0.02,0.22,0.02,0.33 c0,2.72-2.85,5.41-6.37,6.02c-3.52,0.61-6.37-1.1-6.37-3.82c0-3.71,5.09-6.92,8.32-5.79L108.73,37.6L108.73,37.6z M94.99,85.23 c2.92,0,5.28,2.36,5.28,5.28c0,2.92-2.36,5.28-5.28,5.28c-2.92,0-5.28-2.36-5.28-5.28C89.71,87.59,92.07,85.23,94.99,85.23 L94.99,85.23z M72.7,10.71h2.08v0.69c5.19,1.19,5.79,3.68,2.78,7.61c0.32-3.9-0.07-4.74-2.78-4.92v9.86 c0.01,0.05,0.01,0.1,0.01,0.16c0,1.28-1.35,2.55-3,2.84c-1.66,0.29-3-0.52-3-1.8c0-1.75,2.4-3.27,3.92-2.73V10.71L72.7,10.71z M31.99,21.89c0.77-0.13,1.49-0.11,2.13,0.04V6.96l-15.83,4.55v17.38c0.01,0.09,0.01,0.19,0.01,0.29c0,0,0,0,0,0 c0,2.34-2.46,4.66-5.48,5.19c-3.03,0.52-5.48-0.95-5.48-3.29c0-2.34,2.46-4.66,5.48-5.19c1.14-0.2,2.2-0.11,3.08,0.2l0-21.39h0.13 L36.51,0v24.1c0.04,0.18,0.05,0.36,0.05,0.54c0,0,0,0,0,0c0,1.95-2.05,3.9-4.58,4.33c-2.53,0.44-4.58-0.79-4.58-2.75 C27.4,24.27,29.46,22.33,31.99,21.89L31.99,21.89L31.99,21.89z M6.72,119.07c-1.16,1.08-2.49,1.92-3.95,2.54 c-2.96,1.27-3.39,1.49-2.02-1.49c0.72-1.56,1.63-2.99,2.77-4.26c-1.27-1.36-1.92-2.64-2.11-4.11c-0.19-1.51,0.14-3.03,0.8-4.96 c2.16-6.28,19.88-27.95,30.92-41.44c2.83-3.46,5.2-6.36,6.84-8.43c0.12-2.58,0.64-5.14,1.56-7.58c2.42,6.59,7.1,13.78,12.82,19.79 c5.28,5.56,11.49,10.17,17.69,12.48c-2.16,0.68-4.4,1.06-6.65,1.13c-1.79,1.41-4.35,3.48-7.46,6c-13.58,11-37.3,30.2-42.31,31.72 c-1.79,0.54-3.28,0.84-4.74,0.67C9.39,120.95,8.07,120.33,6.72,119.07L6.72,119.07L6.72,119.07z M40.36,62.58 c-1.23,1.51-2.67,3.28-4.25,5.21c-10.86,13.27-28.3,34.59-30.24,40.25c-0.48,1.4-0.73,2.42-0.63,3.21 c0.09,0.69,0.51,1.38,1.38,2.24l2.57,2.57c0.78,0.78,1.48,1.21,2.19,1.29c0.63,0.07,1.37-0.15,2.35-0.61 l14.44-6.79c-1.48-1.48-3.92-4.61-6.36-8.05C39.85,67.3,39.53,64.69,40.36,62.58L40.36,62.58L40.36,62.58z M58.56,84.94 c3.06,3.22,5.3,6.56,6.68,9.98C61.37,94.23,59.28,90.85,58.56,84.94L58.56,84.94z" />
  </svg>
);

/* ── Early Access modal ─────────────────────────────────────── */
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

const EarlyAccessButton = ({ onEarlyAccess }: { onEarlyAccess?: () => void }) => {
  return (
    <Button size="lg" onClick={onEarlyAccess}>
      Request early access
    </Button>
  );
};

/* ── Hero ─────────────────────────────────────────────────────── */
const FEATURE_LIST = [
  { icon: SingIcon,  name: "Takes",           desc: "Work freely. Nothing is lost." },
  { icon: Workflow,   name: "Node Routing",    desc: "Visual signal flow. No hidden sends. No routing mysteries." },
  { icon: Headphones, name: "Audition",        desc: "Reference across devices without leaving your session." },
  { icon: Sparkles,   name: "Muse",            desc: "Tell your DAW what you need. It handles the rest.", badge: "Coming soon" },
];

const Hero = ({ setPage, onEarlyAccess }: PageProps) => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("features");
    if (target) {
      target.scrollIntoView({ block: "start" });
    } else {
      setPage("features");
    }
  };

  return (
    <section className="relative pt-[68px] sm:pt-20 lg:pt-[88px] pb-12 sm:pb-24 lg:pb-28 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <FadeIn>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-2 border border-border text-[12px] text-fg-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                  Alpha
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1 className="display text-[32px] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[72px] text-fg mb-6">
                A native DAW for<br />
                producers who want flow.
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-base sm:text-lg font-medium text-fg max-w-xl mb-10 leading-relaxed">
                Make music, not excuses.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <EarlyAccessButton onEarlyAccess={onEarlyAccess} />
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={scrollToFeatures}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  See features
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted list-none">
                <li className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Windows · macOS · Linux</li>
                <li className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> VST3 &amp; CLAP</li>
                <li className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> Source available</li>
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={0.25}>
            <div className="hidden lg:block">
              <ul
              aria-label="Core capabilities"
              className="rounded-2xl border border-border/80 bg-bg/40 divide-y divide-border/80 overflow-hidden"
            >
              {FEATURE_LIST.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.name} className="flex items-center gap-4 px-3 py-2.5 sm:px-4 sm:py-3.5">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0" aria-hidden="true">
                      <Icon className="w-[18px] h-[18px] text-fg-muted" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[14px] font-medium text-fg leading-snug">{f.name}</span>
                        {f.badge && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium text-amber-400 border border-amber-500/20 bg-amber-500/10">
                            {f.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-muted leading-snug">{f.desc}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
            </div>
          </FadeIn>
        </div>
      </div>

      <ScrollHint />

      <div className="mt-32 sm:mt-10 lg:mt-12">
        <div className="lg:hidden mb-6">
          <ul
            aria-label="Core capabilities"
            className="rounded-2xl border border-border/80 bg-bg/40 divide-y divide-border/80 overflow-hidden"
          >
            {FEATURE_LIST.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.name} className="flex items-center gap-4 px-3 py-2.5 sm:px-4 sm:py-3.5">
                  <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0" aria-hidden="true">
                    <Icon className="w-[18px] h-[18px] text-fg-muted" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-medium text-fg leading-snug">{f.name}</span>
                      {f.badge && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium text-amber-400 border border-amber-500/20 bg-amber-500/10">
                          {f.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-muted leading-snug">{f.desc}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <Suspense fallback={mockFallback}>
          <MockTimeline />
        </Suspense>
      </div>
    </section>
  );
};

/* ── Why Aestra ───────────────────────────────────────────────── */
const WhySection = memo(() => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-4">Why Aestra</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-12 max-w-3xl">
          Existing DAWs are powerful.<br />
          <span className="text-muted">Producers still fight them.</span>
        </h2>
      </FadeIn>

      <div className="grid sm:grid-cols-2 gap-px bg-surface-3/80 rounded-2xl overflow-hidden border border-border/80">
        {[
          ["Crashes and plugin conflicts", "A native C++ engine for stable sessions, and a plugin host that isolates misbehaving VSTs."],
          ["Slow startup and scanning", "Open Aestra and you're making music. No scanning, no splash screen."],
          ["Opaque routing and export paths", "Visual signal routing shows exactly where your sound goes."],
          ["Creative interruptions", "Aestra gets out of your way — no modal dialogs, no scanning popups mid-session."],
        ].map(([problem, solution], i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="bg-bg p-6 sm:p-7 h-full">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-fg font-medium mb-1.5">{problem}</div>
                  <div className="text-muted text-sm leading-relaxed">{solution}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
));

/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQ = memo(({ setPage }: PageProps) => {
  const go = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPage(page);
  };
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "Is Aestra really free?",
      a: (
        <>
          Yes. Aestra's core DAW is free forever with no feature gates, no export limits,
          and no time limits. Optional <a href="/pricing" onClick={go("pricing")} className="text-fg underline underline-offset-4 hover:text-fg-muted">Supporter and Founder tiers</a> fund
          development without locking anything behind a paywall.
        </>
      ),
    },
    {
      q: "What's the difference between the free DAW and the paid plugins?",
      a: (
        <div className="space-y-3">
          <p>
            Aestra ships with a genuinely premium set of plugins out of the box — reverb, a
            parametric EQ that holds its own against anything on the market, compressor, pitch
            shifting, and delay. These are free, forever, no asterisk.
          </p>
          <p>
            The Native Suite is a separate collection of specialist plugins that would
            individually cost you anywhere from $100–300 elsewhere. We can't give those away
            and keep the project alive, so we bundled them into a $5/month Supporter tier —
            which, frankly, is less than a single plugin costs anywhere else. If you'd rather
            own than subscribe, individual plugins are available for one-time purchase on the site.
          </p>
          <p>
            Nothing in the free tier is hobbled to nudge you toward paying. You can make a full
            record with what comes included.
          </p>
        </div>
      ),
    },
    {
      q: "What platforms does Aestra support?",
      a: "Aestra is a native cross-platform DAW that runs on Windows, macOS (Apple Silicon), and Linux (Ubuntu / Debian / Fedora). The engine is built in C++17 for low latency and minimal resource use — no Electron, no JVM.",
    },
    {
      q: "Does Aestra support VST3 and CLAP plugins?",
      a: "Yes. Aestra hosts VST3 and CLAP plugins natively, with a plugin sandbox that isolates misbehaving instruments. The built-in suite (Aestra Verb, Aestra EQ, Aestra Comp) ships with the DAW so you can start making music without hunting for third-party plugins.",
    },
    {
      q: "Can I use Aestra commercially?",
      a: "Yes. Anything you create with Aestra — beats, mixes, stems, full projects — belongs entirely to you. There are no royalties, licensing fees, or attribution requirements on your output.",
    },
    {
      q: "Why not open source Aestra?",
      a: (
        <div className="space-y-3">
          <p>
            Source-available is the honest middle ground. You can read every line of the codebase,
            audit what's running on your machine, and contribute back changes through a fork — but
            we retain ownership and you can't redistribute or commercialize the source.
          </p>
          <p>
            Why? Because Aestra is a long-term project built by a small team, and going fully
            open-source creates real risks: forks that undercut the product, commercial use of our
            work without contribution, and loss of the ownership that lets us keep building. ASSAL
            (the Aestra Source-Available Software License) is how we keep the source open while
            keeping the project sustainable.
          </p>
          <p>
            If you want to see something changed, fork it and send a PR. That's the deal.
          </p>
        </div>
      ),
    },
    {
      q: "When will Aestra be ready?",
      a: "We're currently in alpha with a working native engine, pattern workflow, and built-in plugin suite. Public beta is targeted for late 2026. Join the early-access list to test builds as they ship.",
    },
  ];
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <p className="kicker mb-4">Questions</p>
          <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4">
            Frequently asked.
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-12">
            The short answers to the things producers ask most.
          </p>
        </FadeIn>

        <div className="rounded-2xl border border-border/80 bg-bg divide-y divide-border/80 overflow-hidden">
          {faqs.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.04}>
              <details className="group">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-4 sm:py-5 hover:bg-surface-2/40 transition-colors">
                  <span className="text-fg text-[15px] sm:text-base font-medium pr-4">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="w-6 h-6 rounded-md flex items-center justify-center text-muted group-hover:text-fg shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4 group-open:hidden" />
                    <Minus className="w-4 h-4 hidden group-open:block" />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 -mt-1 text-muted text-[14px] sm:text-[15px] leading-relaxed">
                  {item.a}
                </div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ── Changelog teaser ─────────────────────────────────────────── */
const typeColor: Record<string, string> = {
  new:      "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  fix:      "text-rose-300    bg-rose-500/10    border-rose-500/20",
  security: "text-amber-300   bg-amber-500/10   border-amber-500/20",
  ci:       "text-blue-300    bg-blue-500/10    border-blue-500/20",
  perf:     "text-sky-300     bg-sky-500/10     border-sky-500/20",
  docs:     "text-fg-muted    bg-surface-3      border-border-2",
};

const ChangelogTeaser = memo(({ setPage }: PageProps) => {
  const top = RELEASES.slice(0, 3);
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="kicker mb-4">Changelog</p>
              <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg">
                Built in public.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" aria-hidden="true" />
              Unreleased line actively moving
            </div>
          </div>
        </FadeIn>

        <div className="rounded-2xl border border-border/80 bg-bg divide-y divide-border/80 overflow-hidden">
          {top.map((r) => (
            <FadeIn key={r.ver} delay={0}>
              <button
                onClick={() => setPage("changelog")}
                className="w-full text-left p-5 sm:p-6 hover:bg-surface-2/40 transition-colors group"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <span className="text-fg font-semibold text-[15px] tracking-tight">{r.ver}</span>
                  <span className="text-muted text-[12px] flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3" aria-hidden="true" />
                    {r.date}
                  </span>
                  {r.status === "active" && (
                    <span className="text-[11px] uppercase tracking-wider text-emerald-300 border border-emerald-500/20 bg-emerald-500/10 rounded-md px-2 py-0.5">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-muted text-[14px] leading-relaxed mb-3">{r.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(r.changes.map((c) => c.type))).slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className={`text-[11px] uppercase tracking-wider rounded-md px-2 py-0.5 border ${typeColor[t]}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setPage("changelog")}
              icon={ArrowRight}
              iconPosition="right"
            >
              See full changelog
            </Button>
            <span className="text-dim text-xs hidden sm:inline">·</span>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setPage("roadmap")}
              icon={ArrowRight}
              iconPosition="right"
            >
              See roadmap
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
});

/* ── Feature pillars ─────────────────────────────────────────── */
const Features = memo(() => (
  <section id="features" className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-4">Core pillars</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4 max-w-3xl">
          Built different. Literally.
        </h2>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed mb-14">
          From the audio engine to the interface — built from scratch, in C++,
          for producers.
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
                <div key={i} className="relative flex-1 h-full bg-surface-2 rounded-sm overflow-hidden">
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
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Cold start</span>
                <span className="font-mono text-amber-400">1.4s</span>
              </div>
              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "92%" }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted">
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
                <div key={i} className={`rounded-sm ${on ? 'bg-violet-500/80' : 'bg-surface-2'}`} />
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
            <svg
              className="w-full h-full routing-svg"
              viewBox="0 0 220 60"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Live routing diagram: input splits to two processors, joins a bus, then to master output"
            >
              <circle cx="20" cy="30" r="6" className="fill-blue-400/15 stroke-blue-400" strokeWidth="1.2"/>
              <rect x="60" y="14" width="32" height="14" rx="3" className="fill-blue-400/10 stroke-blue-400/40" strokeWidth="1"/>
              <rect x="60" y="32" width="32" height="14" rx="3" className="fill-blue-400/10 stroke-blue-400/40" strokeWidth="1"/>
              <rect x="130" y="22" width="40" height="16" rx="3" className="fill-blue-400/20 stroke-blue-400" strokeWidth="1.2"/>
              <circle cx="195" cy="30" r="5" className="fill-blue-400/15 stroke-blue-400" strokeWidth="1.2"/>
              <line x1="26" y1="30" x2="60" y2="21" className="stroke-blue-400/40" strokeWidth="1"/>
              <line x1="26" y1="30" x2="60" y2="39" className="stroke-blue-400/40" strokeWidth="1"/>
              <line x1="92" y1="21" x2="130" y2="30" className="stroke-blue-400/40" strokeWidth="1"/>
              <line x1="92" y1="39" x2="130" y2="30" className="stroke-blue-400/40" strokeWidth="1"/>
              <line x1="170" y1="30" x2="190" y2="30" className="stroke-blue-400" strokeWidth="1.2"/>
              <circle cx="16" cy="30" r="1.5" className="fill-blue-400">
                {!prefersReducedMotion() && (
                  <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                )}
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
                <span key={p} className="bg-surface-2 border border-border rounded-md px-2 py-0.5 text-[11px] text-muted">
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
                  <span className={b.active ? "text-fg font-medium" : "text-muted"}>{b.name}</span>
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
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4 max-w-3xl">
          Professional tools.<br />
          <span className="text-muted">Zero extra cost.</span>
        </h2>
        <p className="text-muted text-base sm:text-lg max-w-2xl leading-relaxed mb-14">
          Most DAWs give you the engine and leave you to find the fuel. Aestra
          ships with a full suite of studio-grade plugins — reverb, EQ,
          compression — built natively for the engine and tuned for
          low-CPU machines.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: Music2,
            color: "violet",
            name: "AestraVerb",
            kind: "Reverb",
            desc: "8-line modulated FDN with a Householder mixing matrix. Plate, hall, and room modes — character without the CPU tax.",
            status: "Available",
            statusColor: "emerald",
          },
          {
            icon: Layers,
            color: "blue",
            name: "AestraEQ",
            kind: "Equalizer",
            desc: "Contextual inspector with ghost band preview and a floating toolbar. Surgical moves, transparent signal.",
            status: "Available",
            statusColor: "emerald",
          },
          {
            icon: Cpu,
            color: "amber",
            name: "AestraComp",
            kind: "Compressor",
            desc: "RMS detection with parameter smoothing. Bus and channel compression with full visual gain reduction.",
            status: "Ships next",
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
              <div className="rounded-xl bg-bg border border-border/80 p-6 sm:p-7 h-full hover:border-border-2 transition-colors flex flex-col">
                <div className={`w-10 h-10 rounded-lg ${dotBg} border flex items-center justify-center mb-5`} aria-hidden="true">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[12px] text-muted mb-1.5">{p.kind}</div>
                <h3 className="text-[17px] font-semibold text-fg tracking-tight mb-2">{p.name}</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-5 flex-1">{p.desc}</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                    p.statusColor === "emerald"
                      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                      : "text-amber-400 border-amber-500/20 bg-amber-500/5"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.statusColor === "emerald" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  {p.status}
                 </span>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.15}>
        <p className="mt-8 text-center text-muted text-[14px] sm:text-[15px]">
          Plus <span className="text-fg font-medium">AestraDrift</span> and <span className="text-fg font-medium">AestraDelay</span> — both shipping through the beta period.
        </p>
      </FadeIn>
    </div>
  </section>
));

/* ── Free core / supporter ───────────────────────────────────── */
const FreeCore = memo(({ setPage, onEarlyAccess }: PageProps) => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <FadeIn>
          <p className="kicker mb-4">Open access</p>
          <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-6">
            Free core.<br />
            <span className="text-muted">Pay what you want to go further.</span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8">
            The full DAW is free. No feature gates. No export limits.
            Supporter tiers fund development without locking anything behind a paywall.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <EarlyAccessButton onEarlyAccess={onEarlyAccess} />
            <Button variant="outline" size="lg" onClick={() => setPage("pricing")}>
              See pricing <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-border/80 bg-bg divide-y divide-border/80">
            {[
              { tier: "Core",       price: "$0",     desc: "Full DAW. Forever free.",     accent: "emerald" },
              { tier: "Supporter",  price: "$5/mo",  desc: "Priority builds + cloud sync.", accent: "violet" },
              { tier: "Founder",    price: "$129",   desc: "One-time. Lifetime. Your name in the product.", accent: "amber" },
            ].map(({ tier, price, desc, accent }) => (
              <div key={tier} className="flex items-center gap-5 p-5 sm:p-6">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full shrink-0 ${
                  accent === "emerald" ? "bg-emerald-400" :
                  accent === "violet"  ? "bg-violet-400"  :
                                         "bg-amber-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-fg font-medium">{tier}</div>
                  <div className="text-muted text-sm">{desc}</div>
                </div>
                <div className="text-[15px] font-mono text-fg">{price}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── Closing CTA ─────────────────────────────────────────────── */
const ClosingCTA = memo(({ setPage, onEarlyAccess }: PageProps) => (
  <section className="py-24 sm:py-32 px-5 sm:px-6">
    <div className="max-w-3xl mx-auto text-center">
      <FadeIn>
        <p className="kicker mb-4">Get started</p>
        <h2 className="display text-3xl sm:text-5xl md:text-6xl text-fg mb-6">
          Make music,<br />not excuses.
        </h2>
        <p className="text-muted text-base sm:text-lg max-w-md mx-auto mb-10">
          Aestra is in active development. Get early access and be part of the journey.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <EarlyAccessButton onEarlyAccess={onEarlyAccess} />
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setPage("features")}
            icon={ChevronRight}
            iconPosition="right"
          >
            See features
          </Button>
        </div>
      </FadeIn>
    </div>
  </section>
));

/* ── Scroll hint (bottom-center, fades on scroll) ────────────── */
const ScrollHint = () => {
  const [opacity, setOpacity] = useState(1);
  const reduced = prefersReducedMotion();

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
        className="text-muted"
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
        <circle cx="10" cy="8" r="1.6" fill="currentColor">
          {!reduced && (
            <>
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
            </>
          )}
        </circle>
      </svg>
      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted">
        Scroll
      </span>
    </div>
  );
};

/* ── Founder Countdown ───────────────────────────────────────── */
const FOUNDER_TOTAL = 500;
const FOUNDER_CLAIMED = 31;
const FOUNDER_TARGET = new Date("2026-12-25T00:00:00").getTime();

const isLaunched = () => Date.now() >= FOUNDER_TARGET;

const computeTimeLeft = () => {
  const now = Date.now();
  const diff = Math.max(0, FOUNDER_TARGET - now);
  const totalSeconds = Math.floor(diff / 1000);
  const months = Math.floor(totalSeconds / (30.44 * 24 * 3600));
  const remaining = totalSeconds - months * Math.floor(30.44 * 24 * 3600);
  const days = Math.floor(remaining / (24 * 3600));
  const hours = Math.floor((remaining % (24 * 3600)) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return { months, days, hours, minutes, seconds };
};

const FounderCountdown = () => {
  const toast = useToast();
  const [timeLeft, setTimeLeft] = useState(computeTimeLeft);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [launched, setLaunched] = useState(isLaunched);

  useEffect(() => {
    const update = () => {
      setTimeLeft(computeTimeLeft());
      if (Date.now() >= FOUNDER_TARGET) setLaunched(true);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email", "Please enter a valid email address.");
      return;
    }
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
        toast.success("Slot reserved.", "We'll email you when your Founder number is ready.");
      } else {
        setError("Something went wrong. Try again.");
        toast.error("Couldn't join waitlist", "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
      toast.error("Network error", "Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div
      className="flex-1 min-w-0 flex flex-col gap-1.5 px-2 first:pl-0 last:pr-0"
      role="timer"
      aria-label={`${value} ${label.toLowerCase()}`}
    >
      <div
        className="text-2xl sm:text-[28px] font-semibold text-fg font-mono tabular-nums tracking-tight leading-none"
        aria-live="off"
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] sm:text-[11px] text-muted uppercase tracking-wider">{label}</div>
    </div>
  );

  const spotsLeft = FOUNDER_TOTAL - FOUNDER_CLAIMED;
  const formId = "founder-waitlist-email";
  const errorId = "founder-waitlist-error";
  const successId = "founder-waitlist-success";

  return (
    <section id="founder-section" className="py-24 sm:py-32 px-5 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 sm:p-10 md:p-14">
            <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-14 items-start">
              <div>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] mb-6">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Founder window · 500 cards
                </span>
                <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-5">
                  Some things don't get a second run.
                </h2>
                <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed mb-8">
                  Not a subscription. Not a tier. A piece of history — your name
                  in the product, your Founder number forever, and lifetime access from day one.
                </p>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-fg-muted">
                      <span className="text-amber-300 font-mono font-semibold">{FOUNDER_CLAIMED}</span> / {FOUNDER_TOTAL} claimed
                      <span className="text-dim ml-2">(illustrative)</span>
                    </span>
                    <span className="text-muted text-[13px]">{spotsLeft} spots left</span>
                  </div>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-valuenow={FOUNDER_CLAIMED}
                    aria-valuemin={0}
                    aria-valuemax={FOUNDER_TOTAL}
                    aria-label="Founder cards claimed (illustrative)"
                  >
                    <div className="progress-fill" style={{ width: `${(FOUNDER_CLAIMED / FOUNDER_TOTAL) * 100}%` }} />
                  </div>
                </div>

                {launched ? (
                  <div className="rounded-lg border border-border bg-bg p-4 max-w-md">
                    <p className="text-fg font-medium mb-1">The waitlist is closed.</p>
                    <p className="text-muted text-sm leading-relaxed">
                      Beta launched on December 25, 2026. Visit the <a href="/download" className="text-fg underline underline-offset-4 hover:text-fg-muted">download page</a> to get Aestra, or <a href="/pricing" className="text-fg underline underline-offset-4 hover:text-fg-muted">see pricing</a> for current tiers.
                    </p>
                  </div>
                ) : !submitted ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-2.5 max-w-md"
                    aria-label="Founder waitlist signup"
                    noValidate
                  >
                    <label htmlFor={formId} className="sr-only">Email address</label>
                    <input
                      id={formId}
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                      placeholder="you@studio.email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? errorId : undefined}
                      className="flex-1 h-11 px-3.5 rounded-lg bg-bg border border-border text-fg text-sm placeholder-dim focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-busy={submitting}
                      className="h-11 px-5 rounded-lg bg-fg text-on-accent font-medium text-sm hover:bg-fg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {submitting ? "Joining..." : "Join waitlist"}
                    </button>
                    {error && (
                      <p id={errorId} role="alert" className="text-rose-400 text-sm mt-2 sm:basis-full">
                        {error}
                      </p>
                    )}
                  </form>
                ) : (
                  <div id={successId} role="status" aria-live="polite" className="flex items-center gap-2 text-fg">
                    <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <span className="font-medium">You're on the list.</span>
                  </div>
                )}
              </div>

              <div className="lg:w-72" aria-live="polite">
                <p className="kicker mb-4">Beta launch</p>
                {launched ? (
                  <p className="text-fg text-sm leading-relaxed border-y border-border/80 py-3">
                    Beta launched. Time is up.
                  </p>
                ) : (
                  <div
                    className="flex items-stretch divide-x divide-border/80 border-y border-border/80 py-3"
                    role="timer"
                    aria-label={`Time until beta launch: ${timeLeft.months} months, ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes`}
                  >
                    <CountdownUnit value={timeLeft.months} label="Mo" />
                    <CountdownUnit value={timeLeft.days} label="Days" />
                    <CountdownUnit value={timeLeft.hours} label="Hrs" />
                    <CountdownUnit value={timeLeft.minutes} label="Min" />
                    <CountdownUnit value={timeLeft.seconds} label="Sec" />
                  </div>
                )}
                <p className="text-muted text-[12px] mt-4 leading-relaxed">
                  {launched
                    ? "Founder access is now active for all Founder card holders."
                    : "Founder access activates when beta launches in December 2026. Waitlist locks your slot number."}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { Hero, Features, FounderCountdown, WhySection, Plugins, FreeCore, ClosingCTA, FAQ, ChangelogTeaser };
