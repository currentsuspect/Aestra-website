import React, { useState } from "react";
import { Play, Music2, Layers, Cpu, Wand2, Timer, ArrowUpRight } from "lucide-react";
import { FadeIn, Button } from "../components/ui";
import { VideoModal } from "../components/VideoModal";
import type { PageProps } from "../types";

type PluginStatus = "Available" | "Ships next" | "Coming soon";

type Plugin = {
  name: string;
  kind: string;
  desc: string;
  status: PluginStatus;
  icon: React.ComponentType<{ className?: string }>;
  accent: "violet" | "blue" | "amber" | "emerald" | "rose";
};

const PLUGINS: Plugin[] = [
  {
    name: "AestraEQ",
    kind: "Equalizer",
    desc: "Contextual inspector with ghost band preview and a floating toolbar. Surgical moves, transparent signal.",
    status: "Available",
    icon: Layers,
    accent: "blue",
  },
  {
    name: "AestraVerb",
    kind: "Reverb",
    desc: "8-line modulated FDN with a Householder mixing matrix. Plate, hall, and room modes — character without the CPU tax.",
    status: "Available",
    icon: Music2,
    accent: "violet",
  },
  {
    name: "AestraComp",
    kind: "Compressor",
    desc: "RMS detection with parameter smoothing. Bus and channel compression with full visual gain reduction.",
    status: "Ships next",
    icon: Cpu,
    accent: "amber",
  },
  {
    name: "AestraDrift",
    kind: "Pitch Shifter",
    desc: "Pitch-shifting effect with character. Two voices, modulation, and feedback for harmonizer and shimmer textures.",
    status: "Coming soon",
    icon: Wand2,
    accent: "emerald",
  },
  {
    name: "AestraDelay",
    kind: "Delay",
    desc: "Tempo-locked delay with filter feedback and ducking. Slap, tape, ping-pong — anything that repeats.",
    status: "Coming soon",
    icon: Timer,
    accent: "rose",
  },
];

const accentStyles = {
  violet:  { ring: "border-violet-500/30",  bg: "bg-violet-500/10",  text: "text-violet-300",  dot: "bg-violet-400" },
  blue:    { ring: "border-blue-500/30",    bg: "bg-blue-500/10",    text: "text-blue-300",    dot: "bg-blue-400" },
  amber:   { ring: "border-amber-500/30",   bg: "bg-amber-500/10",   text: "text-amber-300",   dot: "bg-amber-400" },
  emerald: { ring: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-300", dot: "bg-emerald-400" },
  rose:    { ring: "border-rose-500/30",    bg: "bg-rose-500/10",    text: "text-rose-300",    dot: "bg-rose-400" },
};

const statusStyles: Record<PluginStatus, string> = {
  "Available":    "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  "Ships next":   "text-amber-400 border-amber-500/20 bg-amber-500/5",
  "Coming soon":  "text-muted border-border bg-surface-2",
};

const VIDEO_SRC = "/aestra-eq-intro.mp4";

export const Plugins = ({ setPage }: PageProps) => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="text-center pt-32 sm:pt-40 pb-14 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="kicker mb-4">Plugins</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-5">
            Built into the engine.<br />
            <span className="text-muted">Free with Aestra.</span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Most DAWs give you the engine and leave you to find the fuel. Aestra ships with a full suite of studio-grade plugins — built natively, tuned for low-CPU machines.
          </p>
        </div>
      </section>

      {/* EQ hero card with embedded video */}
      <section className="px-5 sm:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <button
              onClick={() => setVideoOpen(true)}
              className="group block w-full text-left rounded-2xl border border-border/80 bg-bg overflow-hidden hover:border-border-2 transition-all"
              aria-label="Play AestraEQ intro video"
            >
              <div className="relative aspect-video bg-black">
                <video
                  src={VIDEO_SRC}
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60 mb-1">Intro · 30s</div>
                    <div className="text-white text-lg sm:text-xl font-semibold tracking-tight">AestraEQ</div>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-white/80 border border-white/15 bg-white/5 rounded px-2 py-0.5">
                    Click to play
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] text-muted mb-1">Equalizer</div>
                  <h3 className="text-[17px] font-semibold text-fg tracking-tight mb-1.5">AestraEQ</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Contextual inspector with ghost band preview and a floating toolbar. Surgical moves, transparent signal.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shrink-0">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Available
                </span>
              </div>
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Other plugins grid */}
      <section className="px-5 sm:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PLUGINS.filter((p) => p.name !== "AestraEQ").map((p, i) => {
              const a = accentStyles[p.accent];
              const Icon = p.icon;
              return (
                <FadeIn key={p.name} delay={i * 0.05}>
                  <div className="rounded-xl bg-bg border border-border/80 p-6 sm:p-7 h-full hover:border-border-2 transition-colors flex flex-col">
                    <div className={`w-10 h-10 rounded-lg ${a.bg} border ${a.ring} flex items-center justify-center mb-5`} aria-hidden="true">
                      <Icon className={`w-5 h-5 ${a.text}`} />
                    </div>
                    <div className="text-[12px] text-muted mb-1.5">{p.kind}</div>
                    <h3 className="text-[17px] font-semibold text-fg tracking-tight mb-2">{p.name}</h3>
                    <p className="text-[14px] text-muted leading-relaxed mb-5 flex-1">{p.desc}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border w-fit ${statusStyles[p.status]}`}>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.status === "Available" ? "bg-emerald-400" :
                          p.status === "Ships next" ? "bg-amber-400" : "bg-dim"
                        }`}
                      />
                      {p.status}
                    </span>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Native Suite teaser */}
      <section className="px-5 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="rounded-xl border border-border/80 bg-bg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="text-[12px] uppercase tracking-wider text-muted mb-2">Native Suite</div>
                <h3 className="text-fg text-lg sm:text-xl font-semibold tracking-tight mb-1.5">
                  More on the way.
                </h3>
                <p className="text-muted text-[14px] leading-relaxed max-w-xl">
                  A separate collection of specialist plugins, dropping monthly with Supporter. Individual plugins available for one-time purchase.
                </p>
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setPage("pricing")}
                icon={ArrowUpRight}
                iconPosition="right"
              >
                See pricing
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="px-5 sm:px-6 pb-24">
        <p className="text-center text-[13px] text-muted max-w-2xl mx-auto">
          All built-in plugins ship with the free core. No add-on purchases required.
        </p>
      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src={VIDEO_SRC}
        title="AestraEQ — Intro"
      />
    </div>
  );
};
