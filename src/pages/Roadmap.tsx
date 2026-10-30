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
    blurb: "In the current alpha, v0.8.1 (19 October 2026).",
    items: [
      { title: "Native audio engine",          desc: "Written in C++. Steady timing and low delay, built to run on old laptops." },
      { title: "The Arsenal",                  desc: "A step sequencer you play: kits, swing, per-step chance and ratchets, sound sets, pattern scenes." },
      { title: "Mixer",                        desc: "Meters first, grouped by output, with a loudness readout on the master." },
      { title: "Routing graph",                desc: "See where every sound goes, and only the routes that matter." },
      { title: "Audition",                     desc: "Compare your mix with a reference track, level-matched: tone, dynamics, stereo and sections." },
      { title: "Versions",                     desc: "Your project's history as versions you can name, branch and go back to." },
      { title: "Eleven built-in effects",      desc: "EQ, compressor, reverb, delay, saturation, OTT and more. Free." },
      { title: "Automation and export",        desc: "Automation clips, bounce in place, and 16, 24 or 32-bit export." },
    ],
  },
  {
    status: "active",
    label: "Now",
    blurb: "Built and being finished for the next alpha, v0.8.2.",
    items: [
      { title: "VST3 and CLAP plugins",        desc: "Your own plugins load in a separate safe process on Linux and Windows, with their windows, parameters and automation." },
      { title: "New timeline and piano roll",  desc: "Clips in track colours, clips that repeat their pattern, automation in a lane under its track, and an FL-style duplicate in the piano roll." },
      { title: "In-app updates",               desc: "Aestra tells you when a new version is out and installs it for you." },
      { title: "Lighter on old laptops",       desc: "An idle Aestra no longer redraws itself, and the audio code does less work per sample." },
      { title: "Muse",                         desc: "An AI agent can drive Aestra with text commands: arrange, mix and master. You saw it in Made in Aestra 03." },
    ],
  },
  {
    status: "next",
    label: "Next",
    blurb: "Before 25 December.",
    items: [
      { title: "Show Me",                      desc: "Ask how to do something and Aestra lights up the real control, in the real app." },
      { title: "Collaboration, version 1",     desc: "Send a version of your project to someone over the network. Nothing is stored in the cloud." },
      { title: "Finish-a-track pass",          desc: "Takes, automation and detailed export checked end to end, so you can always finish a song." },
      { title: "Tested by producers",          desc: "Real producers make tracks in it on Windows and Linux before release." },
      { title: "Public beta",                  desc: "25 December 2026, on Windows and Linux." },
    ],
  },
  {
    status: "later",
    label: "Later",
    blurb: "After the beta. Not planned in detail yet.",
    items: [
      { title: "More Aestra plugins",          desc: "Free, like the rest, starting with the Rumble 808 synth. Also planned as VST3 and CLAP plugins for other DAWs." },
      { title: "Muse as a creative partner",   desc: "Help with composing, mixing and mastering, once Show Me is out." },
      { title: "macOS",                        desc: "Planned for 2027." },
      { title: "Theme and accessibility",      desc: "A high-contrast theme, full keyboard control and better screen reader support." },
      { title: "MIDI learn",                   desc: "Link a knob on your controller to any control in Aestra." },
      { title: "Mobile companion",             desc: "A phone app to control playback and take notes." },
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

      <FadeIn delay={0.03}>
        <div className="mb-10 rounded-2xl border border-accent/40 bg-bg panel-sheen p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
            <span className="led text-accent" aria-hidden="true" />
            Public beta
          </span>
          <p className="text-fg text-[15px] sm:text-base leading-relaxed m-0">
            <span className="font-semibold">25 December 2026</span>, on Windows and Linux. Free, like the rest of Aestra.
          </p>
        </div>
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
