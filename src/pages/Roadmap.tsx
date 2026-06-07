import React, { memo } from "react";
import { ArrowRight, GitBranch } from "lucide-react";
import { FadeIn, Button } from "../components/ui";
import type { PageProps } from "../types";

type Status = "shipped" | "active" | "next" | "later";
type Item = { title: string; desc: string };
type Column = {
  status: Status;
  label: string;
  blurb: string;
  items: Item[];
};

const COLUMNS: Column[] = [
  {
    status: "shipped",
    label: "Shipped",
    blurb: "Live in current builds.",
    items: [
      { title: "Native C++17 audio engine",     desc: "Stable callback loop, low latency, no JVM." },
      { title: "Pattern-first workflow",         desc: "Loops, takes, and patterns woven into one session model." },
      { title: "VST3 + CLAP plugin hosting",     desc: "Native host with plugin sandbox and crash isolation." },
      { title: "Built-in plugin suite",          desc: "Aestra Verb, EQ, and Comp — all native, all shipping." },
      { title: "Live signal routing",            desc: "Animated, color-coded signal flow across the graph." },
      { title: "Audition (translation preview)", desc: "Hear your mix on phone, earbuds, car, laptop." },
      { title: "Takes & history",                desc: "Versioned project snapshots with named, recoverable takes." },
      { title: "Offline export",                 desc: "16/24/32-bit, playlist-aware, sample-accurate position." },
    ],
  },
  {
    status: "active",
    label: "Now",
    blurb: "In progress for the next release.",
    items: [
      { title: "Multi-take recording",     desc: "Record, slice, and commit takes with snapshot manifest." },
      { title: "Full clip editing",        desc: "Cut, copy, paste, split, undo/redo across the timeline." },
      { title: "Piano Roll ↔ Sequencer",   desc: "Two-way sync between pattern clips and the piano roll." },
      { title: "Device resilience",        desc: "Hot-plug, health polling, RT-safe audio thread under failure." },
      { title: "ASIO driver support",      desc: "Native COM integration with dual-tier startup failover." },
    ],
  },
  {
    status: "next",
    label: "Next",
    blurb: "Targeted for the next milestone.",
    items: [
      { title: "Stem export & batch render", desc: "Per-track export with parallel offline render workers." },
      { title: "MIDI learn & mapping",       desc: "Map any control to any parameter across plugins and the engine." },
      { title: "Arrangement view",           desc: "Linear timeline on top of patterns — sketches to song structure." },
      { title: "Cloud sync (Supporter tier)", desc: "Project-level sync with conflict resolution and take-level history." },
      { title: "Theme + accessibility pass", desc: "High-contrast theme, full keyboard nav, screen reader polish." },
    ],
  },
  {
    status: "later",
    label: "Later",
    blurb: "On the radar, not yet scoped.",
    items: [
      { title: "Muse — sound suggestions",    desc: "On-device model that proposes sounds and helps finish tracks." },
      { title: "Mobile companion",            desc: "iOS / Android remote for transport, takes, and notes." },
      { title: "Live performance mode",       desc: "Low-latency session view, scene launching, hands-on control." },
      { title: "Plugin marketplace",          desc: "Vetted third-party plugins, native installer, no scan required." },
    ],
  },
];

const statusStyles: Record<Status, { dot: string; badge: string; ring: string }> = {
  shipped: { dot: "bg-emerald-400", badge: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10", ring: "ring-emerald-500/10" },
  active:  { dot: "bg-amber-400",   badge: "text-amber-300   border-amber-500/20   bg-amber-500/10",   ring: "ring-amber-500/10"   },
  next:    { dot: "bg-violet-400",  badge: "text-violet-300  border-violet-500/20  bg-violet-500/10",  ring: "ring-violet-500/10"  },
  later:   { dot: "bg-blue-400",    badge: "text-blue-300    border-blue-500/20    bg-blue-500/10",    ring: "ring-blue-500/10"    },
};

const statusLabel: Record<Status, string> = {
  shipped: "Shipped",
  active: "Active",
  next: "Next",
  later: "Later",
};

export const Roadmap = memo(({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-4">Roadmap</p>
        <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-6 max-w-3xl">
          What shipped.<br />
          <span className="text-muted">What's next.</span>
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mb-14">
          We build Aestra in public. This is the live plan — what we've
          shipped, what we're working on now, what's targeted next, and
          what's still on the radar.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {COLUMNS.map((col, i) => (
          <FadeIn key={col.status} delay={i * 0.05}>
            <div className={`rounded-2xl border border-border/80 bg-bg overflow-hidden h-full flex flex-col`}>
              <div className="p-5 border-b border-border/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-wider text-fg-muted">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[col.status].dot}`} aria-hidden="true" />
                    {statusLabel[col.status]}
                  </span>
                  <span className="text-[11px] text-dim font-mono">{col.items.length}</span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">{col.blurb}</p>
              </div>
              <ul className="divide-y divide-border/80 flex-1">
                {col.items.map((item) => (
                  <li key={item.title} className="p-5">
                    <div className="text-[13.5px] font-medium text-fg leading-snug mb-1">
                      {item.title}
                    </div>
                    <div className="text-[12.5px] text-muted leading-relaxed">
                      {item.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.1}>
        <div className="mt-16 rounded-2xl border border-border/80 bg-bg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-violet-400" aria-hidden="true" />
              <span className="text-[12px] font-mono uppercase tracking-wider text-violet-300">Have a say</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-fg mb-2 tracking-tight">
              Vote on what ships next.
            </h2>
            <p className="text-muted text-[14px] sm:text-[15px] leading-relaxed max-w-xl">
              Roadmaps change. The fastest way to influence what we build
              is to file an issue on GitHub or join the mailing list.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open("https://github.com/currentsuspect/Aestra/issues", "_blank", "noopener,noreferrer")}
              aria-label="Open GitHub issues (opens in a new tab)"
            >
              Open GitHub
            </Button>
            <Button
              size="lg"
              onClick={() => setPage("changelog")}
              icon={ArrowRight}
              iconPosition="right"
            >
              See changelog
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  </div>
));
