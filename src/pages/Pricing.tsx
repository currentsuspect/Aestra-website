import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, FadeIn } from "../components/ui";
import { SleeveArt } from "../components/SleeveArt";
import type { PageProps } from "../types";

/* Pricing, set as a record: the sleeve up top, Side A (Core), Side B
   (Supporter), a numbered limited pressing (Founder) and the credits
   (what each offer includes). The tiers and comparison data below are
   the single source; the layout is only dressing. */

const tiers = [
  {
    name: "Core",
    price: "$0",
    sub: "forever",
    annual: "",
    tagline: "The whole DAW. Nothing is locked.",
    cta: "Request early access",
    features: [
      "Unlimited tracks and loops",
      "Loop-based sequencer and piano roll",
      "Routing drawn as a map",
      "Audition: hear your mix on phone, earbuds and car",
      "Takes: named versions of your project",
      "Eleven built-in effects, including reverb, EQ, compressor and delay",
    ],
    planned: ["Join projects you're invited to"],
  },
  {
    name: "Supporter",
    price: "$5",
    sub: "/ month",
    annual: "or $50 / year",
    tagline: "Pay for the ecosystem around the DAW: extra plugins, new tools and the work behind them.",
    cta: "Notify me when Supporter launches",
    features: [
      "Everything in Core",
      "The Native Suite: extra plugins, while you're subscribed",
      "New plugins as they're released",
      "A feedback channel and development updates",
    ],
    planned: ["Muse, local help that runs on your machine", "Host a shared project for others to join"],
  },
];

const compareGroups: { label: string; rows: [string, boolean, boolean, boolean][] }[] = [
  {
    label: "Engine",
    rows: [
      ["Use your own VST3 and CLAP plugins (Linux only, unfinished)", true, true, true],
      ["Routing map",               true, true, true],
      ["Audition (hear your mix on phone, earbuds, car)",    true, true, true],
      ["Export to audio files",       true, true, true],
    ],
  },
  {
    label: "Workflow",
    rows: [
      ["Loop-based sequencer (Arsenal)",          true, true, true],
      ["Piano Roll editor",                true, true, true],
      ["Named versions (Takes)",          true, true, true],
      ["Record multiple tracks",            true, true, true],
      ["Mixer with sends and buses",         true, true, true],
    ],
  },
  {
    label: "Plugins & sound",
    rows: [
      ["Eleven built-in effects",            true, true, true],
      ["AestraRumble 808 synth (in development)", false, true, true],
      ["The Native Suite, while subscribed", false, true, true],
      ["New plugins as they're released",  false, true, true],
      ["Founder Collection plugin bundle, kept permanently", false, false, true],
    ],
  },
  {
    label: "Planned: not built yet",
    rows: [
      ["Muse, local help on your machine",   false, true, true],
      ["Join an invited shared project",    true, true, true],
      ["Host a shared project",             false, true, true],
    ],
  },
  {
    label: "Founder extras",
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
      ["Development updates and feedback channel", false, true, true],
    ],
  },
];


const FOUNDER_POINTS = [
  "24 months of Supporter from public beta",
  "A plugin bundle (the Founder Collection) that you keep",
  "A numbered digital Founder card, yours permanently",
  "Your name in the app credits, if you want it",
  "25% off Supporter after the 24 months",
];

const Mark = ({ on }: { on: boolean }) =>
  on
    ? <span className="font-mono text-[13px] font-semibold text-fg" aria-label="Included">Yes</span>
    : <span className="font-mono text-[13px] text-faint" aria-label="Not included">—</span>;

const GRID = "grid grid-cols-[minmax(0,1fr)_64px_84px_72px] sm:grid-cols-[minmax(0,1fr)_110px_130px_130px]";

const SIDE = { Core: "A", Supporter: "B" } as const;

/* A record sliding out of the sleeve: grooves, and a label with the two sides. */
const Record = () => (
  <div
    aria-hidden="true"
    className="hidden lg:block absolute z-0 top-[4%] -right-[50%] w-[92%] aspect-square rounded-full border border-fg"
    style={{ background: "repeating-radial-gradient(circle at center, #0c0b0a 0 2px, #1a171d 2px 3px)" }}
  >
    <div className="absolute left-[34%] top-[34%] w-[32%] h-[32%] rounded-full bg-accent font-mono text-[10px] font-semibold leading-[1.6] uppercase tracking-[0.1em] text-[#0c0b0a]">
      <span className="hidden xl:block absolute left-1/2 top-1/2 -translate-y-1/2 pl-2.5 whitespace-nowrap">Side A<br />Side B</span>
    </div>
    <span className="absolute left-1/2 top-1/2 w-[6px] h-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0c0b0a] ring-1 ring-[#eee9e1]/50" />
  </div>
);

export const Pricing = ({ setPage, onEarlyAccess }: PageProps) => (
  <div className="pt-28 sm:pt-32 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-[1320px] mx-auto">
      {/* Sleeve */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-end">
        <FadeIn className="lg:col-span-4 relative">
          <Record />
          <div className="relative z-10">
            <SleeveArt label="Pricing · 2 sides" />
          </div>
        </FadeIn>
        <FadeIn delay={0.08} className="lg:col-span-6 lg:col-start-7 grid gap-6 pb-2">
          <p className="readout m-0">Pricing</p>
          <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)] m-0">The whole DAW is free.</h1>
          <p className="m-0 text-muted text-[17px] leading-relaxed max-w-[46ch]">
            No export limit, no time limit, no watermark, and you don't need a plugin to make
            music. Side A is the app. Side B is for people who want to pay for the ecosystem
            around it and the work that keeps it going.
          </p>
        </FadeIn>
      </div>

      {/* Sides */}
      {tiers.map((t) => {
        const side = SIDE[t.name as keyof typeof SIDE];
        return (
          <section key={t.name} className="pt-20 sm:pt-24" aria-labelledby={`side-${side}`}>
            <div className="border-t-2 border-fg grid lg:grid-cols-12 gap-3 lg:gap-6 py-5 border-b border-border items-baseline">
              <span className="readout lg:col-span-2 !text-accent">Side {side}</span>
              <h2 id={`side-${side}`} className="display-2 lg:col-span-4 text-[clamp(1.8rem,1.2rem+1.8vw,2.6rem)] m-0">{t.name}</h2>
              <p className="lg:col-span-6 m-0 text-muted text-[15px] leading-relaxed">{t.tagline}</p>
            </div>

            <FadeIn className="grid lg:grid-cols-12 gap-x-6 gap-y-8 py-8">
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-3">
                  <strong className="display text-[5.5rem] leading-none">{t.price}</strong>
                  <span className="text-muted text-[15px]">{t.sub}</span>
                </div>
                {t.annual && <p className="readout mt-2 !text-accent">{t.annual}</p>}
                <div className="mt-7">
                  <Button
                    size="lg"
                    variant={t.name === "Supporter" ? "primary" : "secondary"}
                    onClick={() => onEarlyAccess?.(t.name === "Supporter" ? "supporter-notify" : "early-access")}
                    className="justify-between w-full sm:w-auto sm:min-w-[19rem]"
                  >
                    {t.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <ol className="lg:col-span-7 m-0 p-0 list-none border-t border-border">
                {t.features.map((f, i) => (
                  <li key={f} className="grid grid-cols-[44px_1fr_auto] gap-3 py-3.5 border-b border-border items-baseline">
                    <span className="font-mono text-[11px] font-semibold text-dim">{side}{i + 1}</span>
                    <span className="text-fg text-[16px] leading-snug">{f}</span>
                    <span className="readout">On the record</span>
                  </li>
                ))}
                {t.planned.map((f, i) => (
                  <li key={f} className="grid grid-cols-[44px_1fr_auto] gap-3 py-3.5 border-b border-border items-baseline">
                    <span className="font-mono text-[11px] font-semibold text-faint">{side}{t.features.length + i + 1}</span>
                    <span className="text-muted text-[16px] leading-snug">{f}</span>
                    <span className="readout !text-faint">Not built yet</span>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </section>
        );
      })}
      <p className="mt-2 mb-0 text-muted text-[13.5px] leading-relaxed max-w-2xl">
        Core needs no card. Supporter isn't on sale yet. Collaboration isn't built yet, so there's no storage
        amount to promise, and nothing online will ever touch the projects on your own computer.
      </p>

      {/* Limited pressing */}
      <section className="mt-24 sm:mt-32" id="founder" aria-labelledby="pressing">
        <div className="border-t-2 border-fg grid lg:grid-cols-12 gap-3 lg:gap-6 py-5 border-b border-border items-baseline">
          <span className="readout lg:col-span-2 !text-accent">Limited pressing</span>
          <h2 id="pressing" className="display-2 lg:col-span-4 text-[clamp(1.8rem,1.2rem+1.8vw,2.6rem)] m-0">Five hundred, once.</h2>
          <p className="lg:col-span-6 m-0 text-muted text-[15px] leading-relaxed">
            A numbered digital card for the first 500 people, a plugin bundle you keep, and two years of Supporter. Nothing is shipped.
          </p>
        </div>
        <FadeIn className="grid lg:grid-cols-12 gap-x-6 gap-y-8 py-8">
          <div className="lg:col-span-5">
            {/* The card itself: a numbered sleeve sticker. */}
            <div className="border-2 border-fg bg-black text-[#eee9e1] p-6 sm:p-7 max-w-[26rem]" role="img" aria-label="A Founder card, numbered out of 500">
              <div className="flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#857d72]">
                <span>aestra · founder</span>
                <span>digital</span>
              </div>
              <div className="mt-10 whitespace-nowrap font-mono text-[clamp(1.5rem,1rem+1.6vw,2.25rem)] font-semibold tracking-tight leading-none">
                No. <span className="text-accent">001</span><span className="text-[#857d72]"> / 500</span>
              </div>
              <div className="mt-10 flex items-end justify-between gap-4">
                <strong className="display text-[3.2rem] leading-none" style={{ color: "#eee9e1" }}>$129</strong>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#857d72] pb-1">one-time</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                size="lg"
                onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
                className="justify-between"
              >
                Join the waitlist <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
              <p className="m-0 text-muted text-[13.5px] leading-relaxed max-w-xs">
                Cards go on sale at public beta. The waitlist only emails you when they do. It doesn't hold a card for you.
              </p>
            </div>
          </div>
          <ol className="lg:col-span-7 m-0 p-0 list-none border-t border-border self-start">
            {FOUNDER_POINTS.map((f, i) => (
              <li key={f} className="grid grid-cols-[44px_1fr] gap-3 py-3.5 border-b border-border items-baseline">
                <span className="font-mono text-[11px] font-semibold text-dim">L{i + 1}</span>
                <span className="text-fg text-[16px] leading-snug">{f}</span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </section>

      {/* Credits */}
      <section className="mt-24 sm:mt-32">
        <div className="border-t-2 border-fg grid lg:grid-cols-12 gap-3 lg:gap-6 py-5 items-baseline">
          <span className="readout lg:col-span-2 !text-accent">Credits</span>
          <h2 className="display-2 lg:col-span-4 text-[clamp(1.8rem,1.2rem+1.8vw,2.6rem)] m-0">Who gets what</h2>
          <p className="lg:col-span-6 m-0 text-muted text-[15px] leading-relaxed">Every offer side by side.</p>
        </div>
        <div className="border-t border-border">
          <div className={`${GRID} border-b border-border py-3 items-baseline`}>
            <span className="readout">Feature</span>
            <span className="text-center"><span className="block text-fg text-[14px] font-semibold">Core</span><span className="readout !text-[10px]">$0</span></span>
            <span className="text-center"><span className="block text-fg text-[14px] font-semibold">Supporter</span><span className="readout !text-[10px]">$5/mo</span></span>
            <span className="text-center"><span className="block text-fg text-[14px] font-semibold">Founder</span><span className="readout !text-[10px]">$129</span></span>
          </div>
          {compareGroups.map((group) => (
            <div key={group.label}>
              <div className="readout !text-accent pt-6 pb-2 border-b border-border">{group.label}</div>
              {group.rows.map(([feat, core, sup, found]) => (
                <div key={feat} className={`${GRID} py-3 border-b border-border items-baseline`}>
                  <span className="text-fg text-[14.5px] leading-snug pr-3">{feat}</span>
                  <span className="text-center"><Mark on={core} /></span>
                  <span className="text-center"><Mark on={sup} /></span>
                  <span className="text-center"><Mark on={found} /></span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-muted text-[13px] mt-5 leading-relaxed max-w-3xl">
          Founder includes Supporter for 24 months from public beta. After that you keep the Founder
          Collection and your numbered card, and Supporter extras need a Supporter plan at 25% off for good.
          If Supporter ends, only an online shared project becomes read-only, and you get at least 30 days to
          download it. Projects on your computer stay editable and exportable in free Core.
        </p>
      </section>
    </div>
  </div>
);
