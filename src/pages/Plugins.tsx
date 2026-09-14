import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "../components/ui";
import { VideoModal } from "../components/VideoModal";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   Plugins — the eleven built-in effects, shown as they are.

   Sources of truth (keep in sync when an effect ships or changes):
   - The list: BuiltInPlugins::registerCoreBuiltIns() in
     ~/Dev/Aestra/AestraAudio/src/Plugin/BuiltInPlugins.cpp.
   - "Since": the first release tag whose BuiltInPlugins.cpp registers
     the effect (v0.4.0-alpha is the oldest tag that has the file).
   - Descriptions and facts: each effect's header comment in
     AestraAudio/include/Plugin/Aestra*.h plus what its editor shows.
   - Screenshots: captured from the running app (Sep 2026), cropped to
     the editor window's exact border and masked to its 14px corners
     (AestraPanelWindow::kRadius) so the page adds no frame of its own.
     Files live in public/plugins/; w/h below are their pixel sizes.
   A plugin with no `shot` renders as text until it's captured.
   ───────────────────────────────────────────────────────────────── */

type Shot = { src: string; w: number; h: number };

type Plugin = {
  id: string;
  name: string;
  kind: string;
  since: string;
  desc: string;
  facts: [string, string][];
  shot?: Shot;
};

const shot = (file: string, w: number, h: number): Shot => ({ src: `/plugins/${file}`, w, h });

const PLUGINS: Plugin[] = [
  {
    id: "eq",
    name: "Aestra EQ",
    kind: "Equalizer",
    since: "v0.4.0",
    desc: "A parametric EQ with a live analyzer behind the curve. Add bands where you need them, drag them on the graph, and compare two settings with A/B.",
    facts: [["Compare", "A / B"], ["Analyzer", "Live"], ["Polarity", "Flip"]],
    shot: shot("aestra-eq", 820, 500),
  },
  {
    id: "comp",
    name: "Aestra Compressor",
    kind: "Dynamics",
    since: "v0.4.0",
    desc: "Feed-forward compression drawn as a transfer curve over the live spectrum, with input, output and gain-reduction meters alongside.",
    facts: [["Modes", "Clean · Classic · Optical"], ["Latency", "Zero, oversampling off"], ["Detector", "High-pass filter"]],
    shot: shot("aestra-comp", 680, 555),
  },
  {
    id: "verb",
    name: "Aestra Verb",
    kind: "Reverb",
    since: "v0.4.0",
    desc: "A modulated stereo reverb with predelay and pre-diffusion. Start from the preset library, then shape decay, size, tone and motion.",
    facts: [["Spaces", "Room · Hall · Plate"], ["Engine", "Modulated FDN"], ["Freeze", "Yes"]],
    shot: shot("aestra-verb", 880, 600),
  },
  {
    id: "delay",
    name: "Aestra Delay",
    kind: "Delay",
    since: "v0.4.0",
    desc: "Echoes in stereo or ping-pong, free or locked to tempo, with damping, low cut and gentle modulation on the repeats.",
    facts: [["Time", "Free · Sync"], ["Routing", "Stereo · Ping-pong"], ["Divisions", "Straight · Dotted · Triplet"]],
    shot: shot("aestra-delay", 760, 480),
  },
  {
    id: "limit",
    name: "Aestra Limit",
    kind: "Limiter",
    since: "v0.7.0",
    desc: "A brickwall limiter for the end of the chain. Its automatic release follows how dense the material is, or you can set it yourself.",
    facts: [["Release", "Auto · Manual"], ["Ceiling", "Adjustable"], ["Meters", "In · Out · GR"]],
    shot: shot("aestra-limit", 520, 400),
  },
  {
    id: "ott",
    name: "Aestra OTT",
    kind: "Multiband",
    since: "v0.7.0",
    desc: "Upward and downward compression across three bands at once. Loud parts come down, quiet parts come up, and everything gets denser.",
    facts: [["Bands", "3"], ["Crossovers", "Adjustable"], ["Depth", "0–100%"]],
    shot: shot("aestra-ott", 560, 340),
  },
  {
    id: "transient",
    name: "Aestra Transient",
    kind: "Transient shaper",
    since: "v0.7.1",
    desc: "Turn the attack of a hit up or down, and the body after it, independently. The sketch between the knobs shows the envelope you're making.",
    facts: [["Controls", "Attack · Sustain"], ["Latency", "Zero"], ["Mix", "0–100%"]],
    shot: shot("aestra-transient", 560, 360),
  },
  {
    id: "sat",
    name: "Aestra Sat",
    kind: "Saturator",
    since: "v0.7.0",
    desc: "Drive a sound into tape, tube or hard clipping. The distortion runs oversampled, and the dry signal is time-aligned so the mix control stays clean.",
    facts: [["Modes", "Tape · Tube · Hard"], ["Oversampling", "4×"], ["Mix", "Latency-aligned dry"]],
    shot: shot("aestra-sat", 480, 300),
  },
  {
    id: "filter",
    name: "Aestra Filter",
    kind: "Filter",
    since: "v0.7.0",
    desc: "A resonant low, band or high pass whose cutoff can follow the audio, for auto-wah sweeps, ducking filters and brightness that moves with the performance.",
    facts: [["Types", "Low · Band · High pass"], ["Envelope", "Up to ±4 octaves"], ["Latency", "Zero"]],
  },
  {
    id: "drift",
    name: "Aestra Drift",
    kind: "Pitch shifter",
    since: "v0.4.0",
    desc: "Real-time pitch shifting by semitone or cent, with grain, texture and spread controls for anything from clean shifts to wide, moving layers.",
    facts: [["Intervals", "−12 to +12"], ["Fine", "Cents"], ["Blend", "0–100%"]],
    shot: shot("aestra-drift", 720, 440),
  },
  {
    id: "lfo",
    name: "Aestra LFO",
    kind: "Modulation",
    since: "v0.7.0",
    desc: "Tempo-synced movement for the audio passing through: rhythmic volume, auto-pan, or a filter that opens and closes in time.",
    facts: [["Targets", "Volume · Pan · Cutoff"], ["Shapes", "Sine · Tri · Saw · Ramp · Square · S&H"], ["Rate", "Free · Sync"]],
    shot: shot("aestra-lfo", 560, 320),
  },
];

const VIDEO_SRC = "/aestra-eq-intro.mp4";

const PluginShot = ({ plugin }: { plugin: Plugin }) => {
  if (!plugin.shot) return null;
  const { src, w, h } = plugin.shot;
  return (
    <figure className="plugin-shot mx-auto" style={{ maxWidth: w }}>
      <picture>
        <source srcSet={`${src}.webp`} type="image/webp" />
        <img
          src={`${src}.png`}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          alt={`${plugin.name} editor in Aestra`}
          className="block w-full h-auto"
        />
      </picture>
    </figure>
  );
};

export const Plugins = ({ setPage }: PageProps) => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="min-h-screen px-5 sm:px-6 pt-32 sm:pt-40 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Intro */}
        <FadeIn>
          <p className="kicker mb-6">Plugins</p>
          <h1 className="display hero-title text-fg max-w-[13ch] text-balance">
            Eleven effects, in the box.
          </h1>
          <p className="mt-8 max-w-[34rem] text-[17px] sm:text-lg leading-relaxed text-muted">
            Every one comes with Aestra, free. The pictures below are the editors
            as they look in the current build.
          </p>
        </FadeIn>

        {/* Index */}
        <FadeIn delay={0.05}>
          <nav aria-label="Plugin list" className="mt-14 sm:mt-16">
            <ol className="ledger grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-10 list-none">
              {PLUGINS.map((p, i) => (
                <li key={p.id} className="border-b border-border">
                  <a href={`#${p.id}`} className="group flex items-baseline gap-3 py-3">
                    <span className="font-mono text-[11px] text-faint tabular-nums w-5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-fg text-[15px] group-hover:underline underline-offset-4 decoration-border-3">{p.name}</span>
                    <span className="ml-auto readout !text-[10px] text-dim">{p.kind}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </FadeIn>

        {/* Plugins */}
        <div className="mt-16 sm:mt-24">
          {PLUGINS.map((p, i) => (
            <article
              key={p.id}
              id={p.id}
              className="scroll-mt-28 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-14 items-center py-14 sm:py-20 border-t border-border/70"
            >
              <FadeIn className={p.shot ? "" : "lg:order-last"}>
                {p.shot ? (
                  <PluginShot plugin={p} />
                ) : (
                  <div className="plugin-shot-pending">
                    <span className="readout">Screenshot coming</span>
                  </div>
                )}
              </FadeIn>

              <FadeIn delay={0.05}>
                <p className="readout mb-3">
                  <span className="text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mx-2 text-faint">·</span>
                  {p.kind}
                </p>
                <h2 className="display-2 text-3xl sm:text-4xl text-fg">{p.name}</h2>
                <p className="mt-5 text-muted text-base sm:text-[17px] leading-relaxed">{p.desc}</p>
                <dl className="mt-8">
                  <div className="ledger">
                    {[["Since", p.since] as [string, string], ...p.facts].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-6 py-2.5 border-b border-border">
                        <dt className="readout">{k}</dt>
                        <dd className="text-fg text-[14px] text-right">{v}</dd>
                      </div>
                    ))}
                  </div>
                </dl>
              </FadeIn>
            </article>
          ))}
        </div>

        {/* Closing notes */}
        <FadeIn>
          <div className="pt-12 sm:pt-16 border-t border-border/70 grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h2 className="text-fg text-[19px] font-semibold tracking-tight mb-3">More plugins, separately</h2>
              <p className="text-muted text-[15px] leading-relaxed max-w-md">
                The Native Suite is a separate collection of specialist plugins,
                released one at a time. Supporters get the catalogue while active,
                and each plugin can also be bought outright.
              </p>
              <div className="mt-5 text-[14px]">
                <a
                  href="/pricing"
                  onClick={(e) => { e.preventDefault(); setPage("pricing"); }}
                  className="quiet-link inline-flex items-center gap-2"
                >
                  Pricing
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-fg text-[19px] font-semibold tracking-tight mb-3">Aestra EQ in motion</h2>
              <p className="text-muted text-[15px] leading-relaxed max-w-md">
                A 30-second look at the EQ being used on a real track.
              </p>
              <div className="mt-5 text-[14px]">
                <button onClick={() => setVideoOpen(true)} className="quiet-link inline-flex items-center gap-2">
                  Play the intro
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src={VIDEO_SRC}
        title="Aestra EQ — Intro"
      />
    </div>
  );
};
