import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "../components/ui";
import { VideoModal } from "../components/VideoModal";
import type { PageProps } from "../types";
import { ORIGIN, SOFTWARE_ID, useStructuredData } from "../seo";

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
    shot: shot("aestra-filter", 700, 420),
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

/* The suite as a list search engines can read: each effect, what it is and
   its editor as it looks in the current build. */
const PLUGINS_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${ORIGIN}/plugins#suite`,
  name: "Effects included with Aestra",
  numberOfItems: PLUGINS.length,
  itemListElement: PLUGINS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${ORIGIN}/plugins#${p.id}`,
    item: {
      "@type": "SoftwareApplication",
      name: p.name,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: p.kind,
      operatingSystem: "Linux",
      description: p.desc,
      isPartOf: { "@id": SOFTWARE_ID },
      ...(p.shot ? { image: `${ORIGIN}${p.shot.src}.png` } : {}),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  })),
};

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
  useStructuredData("plugins-structured-data", PLUGINS_LD);
  const [videoOpen, setVideoOpen] = useState(false);
  // A liner-notes tracklist: one plugin open at a time, its real editor on the
  // sleeve. Deep links (/plugins#eq) open that track.
  const [openId, setOpenId] = useState(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    return PLUGINS.some((p) => p.id === hash) ? hash : PLUGINS[0].id;
  });
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1);
      if (PLUGINS.some((p) => p.id === h)) setOpenId(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const openIndex = Math.max(0, PLUGINS.findIndex((p) => p.id === openId));
  const current = PLUGINS[openIndex];

  return (
    <div className="min-h-screen px-5 sm:px-6 pt-28 sm:pt-32 pb-24 sm:pb-32">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <FadeIn className="lg:col-span-8">
            <p className="readout mb-5">Plugins · {PLUGINS.length} tracks</p>
            <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)] m-0">Eleven effects, in the box.</h1>
          </FadeIn>
          <FadeIn delay={0.05} className="lg:col-span-4">
            <p className="m-0 text-muted text-[16px] leading-relaxed max-w-[34rem]">
              Every one comes with Aestra, free. The pictures are the editors as
              they look in the current build. Pick one from the list.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 sm:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-6 items-start">
          {/* The sleeve: the open plugin's editor on black (desktop). */}
          <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-24">
            <div className="aspect-square bg-black border border-fg grid place-items-center p-[7%]">
              {current.shot ? <PluginShot plugin={current} key={current.id} /> : <span className="readout">Screenshot coming</span>}
            </div>
            <div className="readout flex justify-between gap-4 py-3 border-b border-border">
              <span>Fig. {String(openIndex + 1).padStart(2, "0")} — {current.name} · {current.kind}</span>
              <span>Captured from the running alpha</span>
            </div>
          </div>

          {/* The tracklist. */}
          <ol className="lg:col-span-5 lg:col-start-8 m-0 p-0 border-t-2 border-fg list-none">
            {PLUGINS.map((p, i) => {
              const open = p.id === openId;
              return (
                <li key={p.id} id={p.id} className="scroll-mt-28 border-b border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(p.id);
                      window.history.replaceState(null, "", `#${p.id}`);
                    }}
                    aria-expanded={open}
                    aria-controls={`${p.id}-notes`}
                    className="w-full grid grid-cols-[32px_1fr_auto] gap-3 items-baseline py-3.5 text-left group"
                  >
                    <span className={`font-mono text-[11px] font-semibold ${open ? "text-accent" : "text-dim"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[17px] font-semibold text-fg group-hover:text-accent transition-colors">
                      {p.name.replace("Aestra ", "")}
                      <span className="ml-2 text-[14px] font-normal text-muted">{p.kind}</span>
                    </span>
                    <span className="readout">{p.since}</span>
                  </button>
                  <div id={`${p.id}-notes`} hidden={!open} className="pb-6 pl-[44px]">
                    <div className="lg:hidden mb-5 bg-black p-4">{p.shot && <PluginShot plugin={p} />}</div>
                    <p className="m-0 mb-4 text-muted text-[15px] leading-relaxed">{p.desc}</p>
                    <dl className="m-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {p.facts.map(([k, v]) => (
                        <div key={k} className="grid gap-1 content-start">
                          <dt className="readout !text-[10px]">{k}</dt>
                          <dd className="m-0 text-fg text-[13.5px]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Closing notes */}
        <FadeIn>
          <div className="mt-20 pt-10 border-t-2 border-fg grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h2 className="display-2 text-[1.9rem] mb-3">More plugins, separately</h2>
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
              <h2 className="display-2 text-[1.9rem] mb-3">Aestra EQ in motion</h2>
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
