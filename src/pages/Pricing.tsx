import React, { useState, useEffect, memo } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button, FadeIn } from "../components/ui";
import type { PageProps } from "../types";

const CheckIcon = ({ accent = "emerald" }: { accent?: "emerald" | "violet" | "amber" }) => {
  const ring =
    accent === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
    accent === "violet"  ? "bg-violet-500/15 text-violet-400"  :
                           "bg-amber-500/15 text-amber-400";
  return (
    <span className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full shrink-0 ${ring}`}>
      <Check className="w-2.5 h-2.5" />
    </span>
  );
};

const tiers = [
  {
    name: "Core",
    price: "$0",
    sub: "forever",
    tagline: "Everything you need to make a full record.",
    cta: "Request early access",
    ctaVariant: "secondary" as const,
    accent: "emerald" as const,
    features: [
      "Unlimited tracks & patterns",
      "Pattern-based sequencer",
      "Visual routing map",
      "Audition mode — preview without breaking flow",
      "Takes — git-style session versioning",
      "Built-in plugin suite — Verb, EQ, Comp, Drift, Delay",
    ],
  },
  {
    name: "Supporter",
    price: "$5",
    sub: "/ month",
    tagline: "The full Aestra experience — and the reason we can keep building it.",
    cta: "Coming soon",
    ctaVariant: "primary" as const,
    accent: "violet" as const,
    highlighted: true,
    features: [
      "Everything in Core",
      "Muse — tell your DAW what you need. It handles the rest.",
      "Native Suite plugins + monthly drops",
      "100GB Aestra Cloud included",
      "Monthly sound packs",
      "Direct support from the team",
    ],
  },
];

const AnimatedCounter = ({ target = 31, total = 500 }: { target?: number; total?: number }) => {
  const [count, setCount] = useState(0);
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setFillWidth((target / total) * 100);
      let c = 0;
      interval = setInterval(() => {
        c = Math.min(target, c + 1);
        setCount(c);
        if (c >= target) clearInterval(interval);
      }, 40);
    }, 200);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [target, total]);

  return (
    <div className="flex items-center gap-4">
      <div className="progress-track flex-1">
        <div className="progress-fill" style={{ width: `${fillWidth}%` }} />
      </div>
      <div className="text-[13px] text-muted whitespace-nowrap">
        <span className="text-amber-300 font-mono font-semibold">{count}</span> / {total} claimed
      </div>
    </div>
  );
};

const compareGroups: { label: string; rows: [string, boolean, boolean, boolean][] }[] = [
  {
    label: "Engine",
    rows: [
      ["C++17 audio engine",               true, true, true],
      ["Unlimited tracks & patterns",      true, true, true],
      ["VST3 & CLAP plugin hosting",       true, true, true],
      ["Routing visualizer",               true, true, true],
      ["Audition mode (all platforms)",    true, true, true],
      ["Offline export & rendering",       true, true, true],
    ],
  },
  {
    label: "Workflow",
    rows: [
      ["Pattern-first (Arsenal)",          true, true, true],
      ["Piano Roll editor",                true, true, true],
      ["Version control (Takes)",          true, true, true],
      ["Multi-track recording",            true, true, true],
      ["Mixer with sends & buses",         true, true, true],
    ],
  },
  {
    label: "Plugins & sound",
    rows: [
      ["Built-in plugin suite",            true, true, true],
      ["AestraRumble (808 synth)",         false, true, true],
      ["Premium plugins (monthly drops)",  false, true, true],
      ["Monthly sound packs",              false, true, true],
    ],
  },
  {
    label: "AI & cloud",
    rows: [
      ["Muse AI (runs locally)",           false, true, true],
      ["Cloud storage for Takes",          false, true, true],
      ["Cross-device sync (future)",       false, true, true],
    ],
  },
  {
    label: "Identity & lifetime",
    rows: [
      ["100GB Aestra Cloud",               false, true, true],
      ["Exclusive Founder card (digital)", false, false, true],
      ["Name in app credits (permanent)",  false, false, true],
      ["Beta access — mobile & tablet",    false, false, true],
      ["Vote on feature priorities",       false, false, true],
      ["Lifetime access — no subscription",false, false, true],
    ],
  },
  {
    label: "Support",
    rows: [
      ["Direct support from the team",     false, true, true],
    ],
  },
];

const Cell = ({ on, accent }: { on: boolean; accent: "emerald" | "violet" | "amber" }) => {
  if (!on) return <span className="text-dim" aria-label="Not included">—</span>;
  const color =
    accent === "emerald" ? "text-emerald-400" :
    accent === "violet"  ? "text-violet-400"  :
                           "text-amber-400";
  return <Check className={`w-4 h-4 ${color}`} aria-label="Included" role="img" />;
};

export const Pricing = ({ setPage }: PageProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="text-center pt-32 sm:pt-40 pb-14 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="kicker mb-4">Pricing</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-5">
            Aestra is free to use.<br />
            <span className="text-muted">Fully.</span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            No export lock. No time limits. No artificial walls.
            Supporter keeps the project alive and unlocks the extras.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <div className="px-5 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          {tiers.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.05}>
              <div
                className={`rounded-2xl p-7 sm:p-8 h-full flex flex-col transition-all duration-300 ${
                  t.highlighted
                    ? "border border-violet-500/30 bg-bg shadow-[0_0_0_0_rgba(139,92,246,0)] hover:border-violet-500/60 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.45)]"
                    : "border border-border/80 bg-bg"
                }`}
              >
                <div className="mb-6">
                  <div className="text-[12px] uppercase tracking-wider text-muted mb-3">{t.name}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-semibold tracking-tight text-fg">{t.price}</span>
                    {t.sub && <span className="text-muted text-base">{t.sub}</span>}
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{t.tagline}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-fg-muted">
                      <CheckIcon accent={t.accent} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={t.ctaVariant}
                  size="md"
                  className="w-full"
                  disabled={t.name === "Supporter"}
                  onClick={() => setPage("home")}
                >
                  {t.cta}
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-20">
        <p className="text-center text-[13px] text-muted max-w-2xl mx-auto">
          No card required for Core. Cancel Supporter anytime. Founder is a one-time purchase, never restocked.
        </p>
      </div>

      {/* Founder section */}
      <div className="px-5 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-surface-3/80" />
            <span className="text-[12px] text-muted tracking-wider">Founder · 500 exist, ever</span>
            <div className="flex-1 h-px bg-surface-3/80" />
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-7 sm:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-14 items-start mb-10">
              <div>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Limited to 500 — never reproduced
                </span>
                <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4">
                  You believed <span className="text-amber-300">first.</span>
                </h2>
                <p className="text-muted text-base sm:text-lg leading-relaxed max-w-lg">
                  Not a tier. A record. Your name ships inside every copy of Aestra, permanently.
                  The card is your proof of being first.
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-semibold text-fg tracking-tight">$129</div>
                <div className="text-muted text-sm mt-1">one-time</div>
              </div>
            </div>

            <div className="mb-8">
              <AnimatedCounter target={31} total={500} />
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {[
                "Everything in Supporter, forever",
                "100GB Aestra Cloud for life",
                "Exclusive Founder card — your number forever",
                "Name in app credits, permanent",
                "Beta access — mobile & tablet",
                "Vote on feature priorities",
                "No subscription. Ever.",
              ].map((f) => (
                <span key={f} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg border border-border/80 text-fg-muted text-[13px]">
                  <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                size="lg"
                onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
                className="bg-amber-400 text-on-accent hover:bg-amber-300"
              >
                Join the waitlist <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-muted text-[13px] max-w-sm">
                Founder access activates when beta launches in December 2026. Waitlist locks your slot number.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="px-5 sm:px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-surface-3/80" />
            <span className="text-[12px] text-muted tracking-wider">What you get at each level</span>
            <div className="flex-1 h-px bg-surface-3/80" />
          </div>

          {/* Mobile: stacked cards per group */}
          <div className="md:hidden space-y-6">
            {compareGroups.map((group) => (
              <div key={group.label} className="rounded-2xl border border-border/80 bg-bg overflow-hidden">
                <div className="px-4 py-2.5 bg-surface-2/50 border-b border-border/80 text-[11px] uppercase tracking-wider text-muted font-medium">
                  {group.label}
                </div>
                <ul>
                  {group.rows.map(([feat, core, sup, found], i) => (
                    <li key={i} className="px-4 py-3 border-b border-border/80 last:border-b-0">
                      <div className="text-[13.5px] text-fg-muted mb-2.5">{feat}</div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-muted">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted">Core</span>
                          <Cell on={core} accent="emerald" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted">Supporter</span>
                          <Cell on={sup} accent="violet" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted">Founder</span>
                          <Cell on={found} accent="amber" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Desktop: full grid */}
          <div className="hidden md:block rounded-2xl border border-border/80 overflow-hidden">
            <div className="grid grid-cols-[1fr_140px_160px_160px] bg-surface-2/50 border-b border-border/80">
              <div className="p-5 text-[11px] uppercase tracking-wider text-muted">Feature</div>
              <div className="p-5 text-center">
                <div className="text-fg-muted text-sm font-medium">Core</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">$0</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-violet-300 text-sm font-medium">Supporter</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">$5/mo</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-amber-300 text-sm font-medium">Founder</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">$129</div>
              </div>
            </div>

            {compareGroups.map((group) => (
              <div key={group.label}>
                <div className="px-5 py-2.5 bg-surface-2/30 border-y border-border/80 text-[11px] uppercase tracking-wider text-muted font-medium">
                  {group.label}
                </div>
                {group.rows.map(([feat, core, sup, found], i) => (
                  <div key={i} className="grid grid-cols-[1fr_140px_160px_160px] border-b border-border/80 last:border-b-0 hover:bg-surface-2/30 transition-colors">
                    <div className="p-4 text-[13.5px] text-fg-muted">{feat}</div>
                    <div className="p-4 flex items-center justify-center"><Cell on={core} accent="emerald" /></div>
                    <div className="p-4 flex items-center justify-center"><Cell on={sup} accent="violet" /></div>
                    <div className="p-4 flex items-center justify-center"><Cell on={found} accent="amber" /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
