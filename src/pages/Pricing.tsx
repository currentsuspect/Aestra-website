import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button, FadeIn } from "../components/ui";
import { PianoGrid } from "../components/PianoGrid";
import type { PageProps } from "../types";

const CheckIcon = ({ accent = "emerald" }: { accent?: "emerald" | "violet" | "amber" }) => {
  const ring =
    accent === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
    accent === "violet"  ? "bg-accent/15 text-accent"  :
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
    annual: "",
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
      "Join collaborative projects when invited — when available",
    ],
  },
  {
    name: "Supporter",
    price: "$5",
    sub: "/ month",
    annual: "or $50 / year",
    tagline: "A growing creative catalogue that also keeps Aestra moving.",
    cta: "Notify me when Supporter launches",
    ctaVariant: "primary" as const,
    accent: "violet" as const,
    highlighted: true,
    features: [
      "Everything in Core",
      "Native Suite plugin catalogue while active",
      "New releases included when they're ready",
      "Muse — local on your machine, when ready",
      "Create collaborative projects — when available",
      "10 GB shared-project storage included",
      "Supporter development updates",
      "Supporter feedback channel",
    ],
  },
];

const compareGroups: { label: string; rows: [string, boolean, boolean, boolean][] }[] = [
  {
    label: "Engine",
    rows: [
      ["C++17 audio engine",               true, true, true],
      ["Unlimited tracks & patterns",      true, true, true],
      ["VST3 & CLAP hosting (alpha)",      true, true, true],
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
      ["Native Suite catalogue while active", false, true, true],
      ["New releases when they're ready",  false, true, true],
      ["Founder Collection, owned permanently", false, false, true],
    ],
  },
  {
    label: "Local assistance",
    rows: [
      ["Muse (local, when ready)",         false, true, true],
    ],
  },
  {
    label: "Collaboration — when available",
    rows: [
      ["Join & edit an invited project",     true, true, true],
      ["Create & own shared workspaces",    false, true, true],
      ["10 GB shared-project storage",      false, true, true],
      ["Add more storage separately",       false, true, true],
    ],
  },
  {
    label: "Founder record",
    rows: [
      ["Numbered digital Founder card",    false, false, true],
      ["Name in app credits (opt-in)",     false, false, true],
      ["24 months of Supporter",           false, false, true],
      ["25% Supporter discount thereafter", false, false, true],
    ],
  },
  {
    label: "Support",
    rows: [
      ["Supporter updates & feedback channel", false, true, true],
    ],
  },
];

const Cell = ({ on, accent }: { on: boolean; accent: "emerald" | "violet" | "amber" }) => {
  if (!on) return <span className="text-dim" aria-label="Not included">—</span>;
  const color =
    accent === "emerald" ? "text-emerald-400" :
    accent === "violet"  ? "text-accent"  :
                           "text-amber-400";
  return <Check className={`w-4 h-4 ${color}`} aria-label="Included" role="img" />;
};

export const Pricing = ({ setPage, onEarlyAccess }: PageProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-center pt-32 sm:pt-40 pb-14 px-5 sm:px-6">
        <PianoGrid />
        <div className="relative max-w-3xl mx-auto">
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
                    ? "border border-accent/30 bg-bg panel-sheen hover:border-accent/60 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]"
                    : "border border-border/80 bg-bg panel-sheen"
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`led ${t.accent === "violet" ? "text-accent" : "text-emerald-400"}`} aria-hidden="true" />
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{t.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-semibold tracking-tight text-fg">{t.price}</span>
                    {t.sub && <span className="text-muted text-base">{t.sub}</span>}
                  </div>
                  {t.annual && <div className="font-mono text-[11px] text-accent mb-2">{t.annual}</div>}
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
                  onClick={() => onEarlyAccess?.(t.name === "Supporter" ? "supporter-notify" : "early-access")}
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
          No card required for Core. Cancel Supporter anytime. Collaboration includes 10 GB when it ships; only additional storage is priced separately.
        </p>
      </div>

      {/* Founder section */}
      <div className="px-5 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-surface-3/80" />
            <span className="readout">Founder · 500 digital cards, ever</span>
            <div className="flex-1 h-px bg-surface-3/80" />
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-7 sm:p-10">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-14 items-start mb-10">
              <div>
                <span className="inline-flex items-center gap-2.5 readout text-amber-300 mb-5">
                  <span className="led" aria-hidden="true" />
                  Fully digital · limited to 500
                </span>
                <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4">
                  You believed <span className="text-amber-300">first.</span>
                </h2>
                <p className="text-muted text-base sm:text-lg leading-relaxed max-w-lg">
                  Not a permanent service tier. A numbered digital record of being early,
                  plus a defined collection you own and two years of Supporter.
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-semibold text-fg tracking-tight">$129</div>
                <div className="text-muted text-sm mt-1">one-time</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-px bg-amber-500/15 border border-amber-500/15 rounded-lg overflow-hidden mb-8">
              {[
                ["24 months", "Supporter included"],
                ["25% off", "Supporter after that"],
                ["Digital", "No shipping or physical card"],
              ].map(([value, label]) => (
                <div key={label} className="bg-bg/80 px-4 py-3">
                  <div className="text-fg font-medium">{value}</div>
                  <div className="text-[11px] text-muted mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {[
                "24 months of Supporter from public beta",
                "Founder Collection — a fixed launch bundle you own",
                "Numbered digital Founder card, permanent",
                "Name in app credits, opt-in",
                "25% off Supporter after the included period",
              ].map((f) => (
                <span key={f} className="inline-flex items-center gap-2 text-fg-muted text-[13px]">
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
                Founder sales open at public beta. The waitlist sends launch notice; it does not sell or reserve a numbered card.
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
            <span className="readout">What each offer includes</span>
            <div className="flex-1 h-px bg-surface-3/80" />
          </div>

          {/* Mobile: stacked cards per group */}
          <div className="md:hidden space-y-6">
            {compareGroups.map((group) => (
              <div key={group.label} className="rounded-2xl border border-border/80 bg-bg overflow-hidden">
                <div className="px-4 py-2.5 bg-surface-2/50 border-b border-border/80 font-mono text-[10px] uppercase tracking-[0.14em] text-muted font-medium">
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
              <div className="p-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Feature</div>
              <div className="p-5 text-center">
                <div className="text-fg-muted text-sm font-medium">Core</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">$0</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-accent text-sm font-medium">Supporter</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">$5/mo</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-amber-300 text-sm font-medium">Founder</div>
                <div className="text-muted text-[11px] font-mono mt-0.5">$129 · 24mo</div>
              </div>
            </div>

            {compareGroups.map((group) => (
              <div key={group.label}>
                <div className="px-5 py-2.5 bg-surface-2/30 border-y border-border/80 font-mono text-[10px] uppercase tracking-[0.14em] text-muted font-medium">
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
          <p className="text-muted text-[12px] mt-4 leading-relaxed">
            Founder includes Supporter benefits for 24 months from public beta. After that,
            those recurring benefits require an active Supporter plan at the permanent 25% Founder discount.
            The Founder Collection and numbered digital card remain yours. If Supporter ends, shared workspaces become
            read-only with at least 30 days to download or export them.
          </p>
        </div>
      </div>
    </div>
  );
};
