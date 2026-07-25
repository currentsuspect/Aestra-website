import React, { useState } from "react";
import { Play, Music2, Layers, Cpu, Wand2, Timer, ArrowUpRight, Waves, Flame, BarChart3, Activity, Gauge } from "lucide-react";
import { FadeIn, Button } from "../components/ui";
import { PianoGrid } from "../components/PianoGrid";
import { VideoModal } from "../components/VideoModal";
import type { PageProps } from "../types";

/* "Available" means it's in the current tagged release (v0.6.0-alpha).
   "In alpha builds" means merged and running, but not yet in a tagged
   release — early-access testers have it, everyone else doesn't yet. */
type PluginStatus = "Available" | "In alpha builds" | "Coming soon";

type Plugin = {
  name: string;
  kind: string;
  desc: string;
  status: PluginStatus;
  icon: React.ComponentType<{ className?: string }>;
};

const PLUGINS: Plugin[] = [
  {
    name: "AestraEQ",
    kind: "Equalizer",
    desc: "Grab a frequency and hear it before you commit. Ghost bands preview the move, so you stop guessing and start carving.",
    status: "Available",
    icon: Layers,
  },
  {
    name: "AestraVerb",
    kind: "Reverb",
    desc: "Plate, hall and room that put a vocal in a space without drowning it. Big tails, and your CPU meter barely moves.",
    status: "Available",
    icon: Music2,
  },
  {
    name: "AestraComp",
    kind: "Compressor",
    desc: "Glues a drum bus without pumping the life out of it. You can see exactly how hard it's working, in real time.",
    status: "Available",
    icon: Cpu,
  },
  {
    name: "AestraDelay",
    kind: "Delay",
    desc: "Locks to your tempo and ducks under the vocal on its own. Slap, tape, ping-pong — anything that repeats.",
    status: "Available",
    icon: Timer,
  },
  {
    name: "AestraDrift",
    kind: "Pitch Shifter",
    desc: "Stacked harmonies off a single take, plus the shimmer you'd normally chase with three plugins and a bus.",
    status: "Available",
    icon: Wand2,
  },
  {
    name: "AestraFilter",
    kind: "Filter",
    desc: "The cutoff chases how hard you hit it — up to four octaves either way. Auto-wah, reverse ducks, brightness that moves with the take.",
    status: "Available",
    icon: Waves,
  },
  {
    name: "AestraSat",
    kind: "Saturator",
    desc: "Tape, tube, or hard clip. Push a lifeless sample until it has some grit — oversampled, so it dirties up without going brittle.",
    status: "In alpha builds",
    icon: Flame,
  },
  {
    name: "AestraOTT",
    kind: "Multiband",
    desc: "The over-the-top squash. Pulls the loud parts down and the quiet parts up across three bands — instant density on drums and synths.",
    status: "In alpha builds",
    icon: BarChart3,
  },
  {
    name: "AestraLFO",
    kind: "Modulator",
    desc: "Rhythmic gating, auto-pan, and filter wobble locked to your tempo. Drop it on a flat pad and it starts breathing in time.",
    status: "In alpha builds",
    icon: Activity,
  },
  {
    name: "AestraLimit",
    kind: "Limiter",
    desc: "Brickwall for the master, with a release that reads how dense the material is. Catches the peaks without the pumping.",
    status: "In alpha builds",
    icon: Gauge,
  },
];

const statusStyles: Record<PluginStatus, string> = {
  "Available":       "text-emerald-400",
  "In alpha builds": "text-amber-400",
  "Coming soon":     "text-dim",
};

const VIDEO_SRC = "/aestra-eq-intro.mp4";

export const Plugins = ({ setPage }: PageProps) => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative text-center pt-32 sm:pt-40 pb-14 px-5 sm:px-6">
        <PianoGrid />
        <div className="relative max-w-3xl mx-auto">
          <p className="kicker mb-4">Plugins</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-5">
            You already own the good ones.
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Most DAWs hand you an empty rack and point at a plugin store. Aestra
            comes with ten — EQ, reverb, compression, delay, pitch, filter,
            saturation, multiband, modulation and a limiter — running light
            enough that you can stack them.
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
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 mb-1">Intro · 30s</div>
                    <div className="text-white text-lg sm:text-xl font-semibold tracking-tight">AestraEQ</div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 border border-white/15 bg-white/5 rounded px-2 py-1">
                    Click to play
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-fg-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-1.5">Equalizer</div>
                  <h3 className="text-[17px] font-semibold text-fg tracking-tight mb-1.5">AestraEQ</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Grab a frequency and hear it before you commit. Ghost bands preview the move, so you stop guessing and start carving.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 readout text-emerald-400 shrink-0">
                  <span aria-hidden="true" className="led" />
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
              const Icon = p.icon;
              return (
                <FadeIn key={p.name} delay={i * 0.05}>
                  <div className="rounded-xl bg-bg border border-border/80 panel-sheen p-6 sm:p-7 h-full hover:border-border-2 transition-colors flex flex-col">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center mb-5" aria-hidden="true">
                      <Icon className="w-5 h-5 text-fg-muted" />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-1.5">{p.kind}</div>
                    <h3 className="text-[17px] font-semibold text-fg tracking-tight mb-2">{p.name}</h3>
                    <p className="text-[14px] text-muted leading-relaxed mb-5 flex-1">{p.desc}</p>
                    <span className={`inline-flex items-center gap-2 readout w-fit ${statusStyles[p.status]}`}>
                      <span aria-hidden="true" className="led" />
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
            <div className="rounded-xl border border-border/80 bg-bg panel-sheen p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted mb-2">Native Suite</div>
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
          All built-in plugins ship with the free core — no add-on purchases required.
          The four marked <span className="text-amber-400">in alpha builds</span> are
          finished and running; they reach everyone at the next release, and early
          access has them now.
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
