import React from "react";
import { ArrowRight } from "lucide-react";
import { Button, FadeIn } from "../components/ui";
import type { PageProps } from "../types";

/* Pricing, set like the rest of the site: heavy rules, ledger rows, no cards.
   The data below is the single source for the tiers and the comparison. */

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

export const Pricing = ({ setPage, onEarlyAccess }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-[1320px] mx-auto">
      {/* Header */}
      <FadeIn className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-end">
        <div className="lg:col-span-8">
          <p className="readout mb-5">Pricing</p>
          <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)]">The whole DAW is free.</h1>
        </div>
        <p className="lg:col-span-4 m-0 text-muted text-[16px] leading-relaxed max-w-[34rem]">
          No export limit, no time limit, no watermark, and you don't need a plugin to make
          music. Supporter is for people who want to pay for the ecosystem around Aestra
          and the work that keeps it going.
        </p>
      </FadeIn>

      {/* Tiers */}
      <section className="mt-16 sm:mt-24 grid md:grid-cols-2 border-t-2 border-fg">
        {tiers.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.05} className={`py-8 grid gap-6 content-start ${i > 0 ? "md:pl-10 md:border-l border-border border-t md:border-t-0" : "md:pr-10"}`}>
            <div>
              <span className="readout">{t.name}</span>
              <div className="flex items-baseline gap-3 mt-2">
                <strong className="display text-[4.5rem] leading-none">{t.price}</strong>
                <span className="text-muted text-[15px]">{t.sub}</span>
              </div>
              {t.annual && <p className="readout mt-2 !text-accent">{t.annual}</p>}
              <p className="mt-4 mb-0 text-muted text-[15px] leading-relaxed max-w-md">{t.tagline}</p>
            </div>
            <ul className="m-0 p-0 border-t border-border">
              {t.features.map((f) => (
                <li key={f} className="list-none py-3 border-b border-border text-fg text-[15px] leading-snug">{f}</li>
              ))}
            </ul>
            <div>
              <p className="readout mb-2">Not built yet</p>
              <ul className="m-0 p-0">
                {t.planned.map((f) => (
                  <li key={f} className="list-none py-1.5 text-muted text-[14.5px]">{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <Button
                size="lg"
                variant={t.name === "Supporter" ? "primary" : "secondary"}
                onClick={() => onEarlyAccess?.(t.name === "Supporter" ? "supporter-notify" : "early-access")}
                className="justify-between w-full sm:w-auto sm:min-w-[19rem]"
              >
                {t.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </FadeIn>
        ))}
      </section>
      <p className="mt-2 mb-0 text-muted text-[13.5px] leading-relaxed max-w-2xl">
        Core needs no card. Supporter isn't on sale yet. Collaboration isn't built yet, so there's no storage
        amount to promise, and nothing online will ever touch the projects on your own computer.
      </p>

      {/* Founder */}
      <section className="mt-20 sm:mt-28 grid lg:grid-cols-12 gap-8 lg:gap-6" id="founder">
        <FadeIn className="lg:col-span-4">
          <p className="readout mb-4">Founder · 500 cards, ever</p>
          <h2 className="display-2 text-[clamp(2.2rem,1.2rem+3.2vw,4rem)]">Five hundred, once.</h2>
          <div className="mt-6 flex items-baseline gap-3">
            <strong className="display text-[3.4rem] leading-none">$129</strong>
            <span className="text-muted text-[15px]">one-time, digital</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.05} className="lg:col-span-8 border-t-2 border-fg">
          <p className="m-0 pt-6 text-muted text-base sm:text-[17px] leading-relaxed max-w-xl">
            A numbered digital card for the first 500 people, a plugin bundle you keep, and two
            years of Supporter. Nothing is shipped.
          </p>
          <ul className="m-0 p-0 mt-6 border-t border-border">
            {FOUNDER_POINTS.map((f, i) => (
              <li key={f} className="list-none grid grid-cols-[40px_1fr] gap-3 py-3.5 border-b border-border">
                <span className="font-mono text-[11px] font-semibold text-accent pt-[4px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-fg text-[16px] leading-snug">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              size="lg"
              onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
              className="justify-between"
            >
              Join the waitlist <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
            <p className="m-0 text-muted text-[13.5px] leading-relaxed max-w-sm">
              Founder cards go on sale at public beta. The waitlist only emails you when they do. It doesn't hold a card for you.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Comparison */}
      <section className="mt-20 sm:mt-28">
        <p className="readout mb-4">What each offer includes</p>
        <div className="border-t-2 border-fg">
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
