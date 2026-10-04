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
    blurb: "Works in the source today.",
    items: [
      { title: "Native audio engine",     desc: "Written in C++. Steady timing and low delay." },
      { title: "Pattern-first workflow",         desc: "Start from a loop, then build the song around it." },
      { title: "Eleven built-in effects",          desc: "Reverb, EQ, compressor, delay and more. Free." },
      { title: "Live signal routing",            desc: "See the sound move through your project, colour-coded." },
      { title: "Audition", desc: "Hear your mix on a phone, earbuds, a car or a laptop." },
      { title: "Takes",                desc: "Save named versions of your project and go back to any of them." },
      { title: "Offline export",                 desc: "16, 24 and 32-bit files, lined up exactly with the timeline." },
    ],
  },
  {
    status: "active",
    label: "Now",
    blurb: "Being built for the next release.",
    items: [
      { title: "Multi-take recording",     desc: "Record several takes, slice them up and keep the best." },
      { title: "Full clip editing",        desc: "Cut, copy, paste, split and undo on the timeline." },
      { title: "Piano roll and sequencer in sync",   desc: "Edit a loop in either one and the other follows." },
      { title: "VST3 + CLAP plugin hosting", desc: "Works partly on Linux. Some CLAP features aren't built, and nothing loads on Windows yet. Required before public beta." },
      { title: "Windows desktop build",    desc: "The audio engine passes its tests on Windows. The app doesn't build there yet." },
      { title: "Audio device recovery",        desc: "Unplug your interface and Aestra keeps running instead of crashing." },
      { title: "ASIO driver support",      desc: "Low-delay audio on Windows." },
          ],
  },
  {
    status: "next",
    label: "Next",
    blurb: "Planned for after that.",
    items: [
      { title: "Stem export & batch render", desc: "Export every track as its own file, in one go." },
      { title: "MIDI learn & mapping",       desc: "Link a knob on your controller to any control in Aestra." },
      { title: "Arrangement view",           desc: "A timeline on top of your loops, for turning sketches into songs." },
      { title: "Versioned collaboration", desc: "Share a project through Takes. A Supporter hosts it and invited free users can join. Projects on your computer stay editable. There's no server yet, and storage limits will be decided before it ships." },
      { title: "Native Suite — first drop",  desc: "Optional extra plugins, released one at a time, starting with the Rumble 808 synth. Included with Supporter, or buy them individually." },
      { title: "Theme + accessibility pass", desc: "A high-contrast theme, full keyboard control and better screen reader support." },
    ],
  },
  {
    status: "later",
    label: "Later",
    blurb: "Ideas, not planned in detail yet.",
    items: [
      { title: "Muse — local assistance",     desc: "Help that runs on your computer: controlling the project, picking sounds, finishing tracks." },
      { title: "Mobile companion",            desc: "A phone app to control playback, takes and notes." },
      { title: "Live performance mode",       desc: "Launch loops live, with low delay and hands-on control." },
      { title: "Plugin marketplace",          desc: "Checked third-party plugins you can install without a scan." },
    ],
  },
];

/* Only the LED colour is read — the `badge` and `ring` entries this map
   used to carry were never rendered. Statuses run shipped → later as
   emerald → amber → accent → dim, so the column reads as a progression
   rather than four unrelated hues. */
const statusStyles: Record<Status, { dot: string }> = {
  shipped: { dot: "text-emerald-400" },
  active:  { dot: "text-amber-400"   },
  next:    { dot: "text-accent"      },
  later:   { dot: "text-dim"         },
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
          Aestra is built in public. This is the plan: what works, what's being
          built, what comes after, and what's still just an idea.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {COLUMNS.map((col, i) => (
          <FadeIn key={col.status} delay={i * 0.05}>
            <div className={`rounded-2xl border border-border/80 bg-bg panel-sheen overflow-hidden h-full flex flex-col`}>
              <div className="p-5 border-b border-border/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted">
                    <span className={`led ${statusStyles[col.status].dot}`} aria-hidden="true" />
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
        <div className="mt-16 rounded-2xl border border-border/80 bg-bg panel-sheen p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-[12px] font-mono uppercase tracking-wider text-accent">Have a say</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-fg mb-2 tracking-tight">
              Tell me what's missing.
            </h2>
            <p className="text-muted text-[14px] sm:text-[15px] leading-relaxed max-w-xl">
              Plans change. The best way to change this one is to open an
              issue on GitHub and say what you need.
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
