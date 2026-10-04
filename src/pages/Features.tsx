import React, { memo } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FadeIn } from "../components/ui";
import { SignalFlowDiagram } from "../components/SignalFlowDiagram";
import { TRACKS, CLIPS, BARS, tone } from "../components/mock/emberSession";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   Features, set as an album's liner notes. The three chapters are the
   sides (Create, Understand, Finish), each feature is a track, and its
   three points are the credits. The cover is the Home mock's session with
   the interface taken away: the arrangement itself as artwork.
   ───────────────────────────────────────────────────────────────── */

const sections = [
  {
    title: "Written in C++, readable on GitHub",
    tag: "Engine",
    desc: "The app and its audio engine are one program, written in C++. All the code is on GitHub, so you can see what runs on your computer.",
    points: [
      ["One native program", "No browser or Java layer underneath. The app and the audio engine are built together."],
      ["Audio on its own thread", "Drawing the screen never gets in the way of playing sound."],
      ["Source-available", "You can read it and build it. It's not open source, and the license says what you can do."],
    ],
  },
  {
    title: "Opens into your project",
    tag: "Startup",
    desc: "The longer it takes to start, the more ideas you lose on the way. Aestra opens straight to your project.",
    points: [
      ["No rescan every launch", "The plugin list is prepared ahead of time instead of rebuilt each time you open the app."],
      ["Project first", "No splash screen to sit through."],
      ["Back where you were", "Same project, same view, same spot in the song."],
    ],
  },
  {
    title: "Start with a loop",
    tag: "Workflow",
    desc: "Most beats start as a loop, not as bar one of a timeline. So Aestra starts there too, and you build the song around it.",
    points: [
      ["Reuse a loop anywhere", "Copy it, change one copy, drop it into the second verse."],
      ["Sketch first", "Get the idea down in the loop view before you think about song structure."],
      ["Notes are one click away", "Open a loop and its notes are right there. No digging through the timeline."],
    ],
  },
  {
    title: "See where the sound goes",
    tag: "Mixing",
    desc: "A lot of mix problems are really routing problems you can't see. Aestra draws the signal path and lights it up while the music plays.",
    points: [
      ["Watch it move", "Follow the sound from each track, through your buses, to the master."],
      ["Easy to tell apart", "Instruments, buses and outputs have their own colours, even in a busy project."],
      ["Change it on the map", "Re-route by dragging, instead of hunting through menus."],
    ],
  },
  {
    title: "Check the mix before you share it",
    tag: "Monitoring",
    desc: "A mix that sounds great in your headphones can fall apart on a phone. Audition lets you hear it the way other people will, while you can still fix it.",
    points: [
      ["Phone, earbuds, car", "Switch between listening profiles for the places people actually listen."],
      ["Hear the difference", "Compare how the balance changes without leaving the project or exporting a file."],
      ["Fix it now", "Catch a thin low end while the project is still open."],
    ],
  },
  {
    title: "Keep the version that worked",
    tag: "History",
    desc: "Save checkpoints with names you'll recognise next week, try something risky, and go back if it doesn't work.",
    points: [
      ["Names, not final_final_v7", "Save checkpoints you can actually identify later."],
      ["Try the weird idea", "Take the project somewhere new without losing the mix you already like."],
      ["Compare and keep one", "Play two versions against each other and keep the better one."],
    ],
  },
];

const chapters = [
  {
    name: "Create",
    number: "01",
    description: "Go from a first loop to a project you can keep building on.",
    featureIndexes: [1, 2],
  },
  {
    name: "Understand",
    number: "02",
    description: "See what the engine and the signal path are doing underneath.",
    featureIndexes: [0, 3],
  },
  {
    name: "Finish",
    number: "03",
    description: "Check how the mix sounds elsewhere, compare versions, keep the best one.",
    featureIndexes: [4, 5],
  },
];


/* The session as sleeve art: every clip in its lane colour on black. */
export const SleeveArt = memo(({ label }: { label: string }) => (
  <div className="relative aspect-square w-full max-w-full bg-black border border-fg overflow-hidden" aria-hidden="true">
    <div className="absolute left-[8%] right-[8%] top-[10%] bottom-[28%]">
      {CLIPS.map((c) => (
        <span
          key={c.id}
          className="absolute"
          style={{
            left: `${(c.start / BARS) * 100}%`,
            width: `calc(${((c.end - c.start) / BARS) * 100}% - 2px)`,
            top: `${(c.track / TRACKS.length) * 100}%`,
            height: `calc(${100 / TRACKS.length}% - 2px)`,
            background: tone(TRACKS[c.track].slot).body,
            boxShadow: `inset 0 1px 0 ${tone(TRACKS[c.track].slot).edge}`,
          }}
        />
      ))}
    </div>
    <div className="absolute left-[8%] right-[8%] bottom-[7%] flex items-end justify-between text-[#eee9e1]">
      <span className="font-extrabold lowercase [font-stretch:125%] text-[clamp(1.1rem,2.2vw,1.8rem)] tracking-[-0.01em]">aestra</span>
      <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#857d72]">{label}</span>
    </div>
  </div>
));

const SIDES = ["A", "B", "C"];

export const Features = ({ setPage, topOffset = 0, onEarlyAccess }: PageProps) => (
  <>
    <Navbar activePage="features" setPage={setPage} topOffset={topOffset} onEarlyAccess={onEarlyAccess} />
    <div className="pt-28 sm:pt-32 pb-20 sm:pb-28 min-h-screen px-5 sm:px-6">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-end">
          <FadeIn className="lg:col-span-5">
            <SleeveArt label="Features · 3 sides" />
          </FadeIn>
          <FadeIn delay={0.08} className="lg:col-span-6 lg:col-start-7 grid gap-6 pb-2">
            <p className="readout m-0">Features</p>
            <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)] m-0">Create. Understand. Finish.</h1>
            <p className="m-0 text-muted text-[17px] leading-relaxed max-w-[46ch]">
              Aestra is a music-making app. These are the six things it's built around,
              in the order you'd use them: start a loop, see what's happening, finish the mix.
            </p>
          </FadeIn>
        </div>

        {chapters.map((chapter, ci) => (
          <section key={chapter.name} className="pt-20 sm:pt-24" aria-labelledby={`side-${ci}`}>
            <div className="border-t-2 border-fg grid lg:grid-cols-12 gap-3 lg:gap-6 py-5 border-b border-border items-baseline">
              <span className="readout lg:col-span-2 !text-accent">Side {SIDES[ci]}</span>
              <h2 id={`side-${ci}`} className="display-2 lg:col-span-4 text-[clamp(1.8rem,1.2rem+1.8vw,2.6rem)] m-0">{chapter.name}</h2>
              <p className="lg:col-span-6 m-0 text-muted text-[15px] leading-relaxed">{chapter.description}</p>
            </div>
            {chapter.featureIndexes.map((fi, ti) => {
              const f = sections[fi];
              return (
                <FadeIn key={f.title} className="grid lg:grid-cols-12 gap-x-6 gap-y-3 py-7 border-b border-border">
                  <span className="lg:col-span-2 font-mono text-[11px] font-semibold text-dim pt-2">{SIDES[ci]}{ti + 1}</span>
                  <h3 className="display-2 lg:col-span-4 text-[clamp(1.5rem,1.1rem+1.2vw,2.1rem)] m-0">{f.title}</h3>
                  <p className="lg:col-span-5 m-0 text-fg text-[17px] leading-relaxed">{f.desc}</p>
                  <span className="lg:col-span-1 readout lg:text-right pt-2">{f.tag}</span>
                  <dl className="lg:col-span-6 lg:col-start-7 m-0 mt-2 grid sm:grid-cols-3 gap-4">
                    {f.points.map(([strong, rest]) => (
                      <div key={strong} className="grid gap-1 content-start">
                        <dt className="text-fg text-[13.5px] font-semibold">{strong}</dt>
                        <dd className="m-0 text-muted text-[13.5px] leading-relaxed">{rest}</dd>
                      </div>
                    ))}
                  </dl>
                  {/* The routing map is this track's figure: the diagram Aestra draws of the signal path. */}
                  {f.tag === "Mixing" && (
                    <figure className="lg:col-span-6 lg:col-start-7 m-0 mt-4 border border-border p-4 sm:p-6">
                      <SignalFlowDiagram variant="detailed" />
                    </figure>
                  )}
                </FadeIn>
              );
            })}
          </section>
        ))}
      </div>
      <ComparisonTable />
    </div>
    <Footer setPage={setPage} />
  </>
);

/* ── Comparison table ────────────────────────────────────────── */
type Cell = "yes" | "no" | "limited" | "na";

const cellDisplay: Record<Cell, { mark: string; color: string; label: string }> = {
  yes:     { mark: "✓",  color: "text-emerald-400", label: "Yes" },
  no:      { mark: "—",  color: "text-dim",         label: "No" },
  limited: { mark: "~",  color: "text-amber-400",   label: "Limited" },
  na:      { mark: "—",  color: "text-dim",         label: "—" },
};

const COMPARISON_ROWS: { label: string; aestra: Cell; ableton: Cell; logic: Cell; fl: Cell; }[] = [
  { label: "The whole DAW is free",       aestra: "yes", ableton: "limited", logic: "no",      fl: "limited" },
  { label: "Same DAW on Windows / Linux",   aestra: "no", ableton: "limited", logic: "no",  fl: "limited" },
  { label: "Third-party VST3 hosting",      aestra: "limited", ableton: "yes",  logic: "yes",     fl: "yes"     },
  { label: "CLAP plugin hosting",           aestra: "limited", ableton: "yes",  logic: "no",      fl: "no"      },
  { label: "Starts from loops", aestra: "yes", ableton: "limited", logic: "no",      fl: "yes"     },
  { label: "Routing drawn as a map",   aestra: "yes",  ableton: "no",      logic: "no",      fl: "no"      },
  { label: "Hear your mix on phone / car",  aestra: "yes",  ableton: "no",      logic: "limited", fl: "no"      },
  { label: "Named versions built in",  aestra: "yes",  ableton: "limited", logic: "limited", fl: "limited" },
  { label: "You can read the code",       aestra: "yes",  ableton: "no",      logic: "no",      fl: "no"      },
];

const ComparisonTable = () => {
  const columns: { key: keyof typeof COMPARISON_ROWS[0]; label: string; sub: string; highlight: boolean }[] = [
    { key: "aestra",  label: "Aestra",    sub: "Alpha",  highlight: true  },
    { key: "ableton", label: "Live",      sub: "Suite",  highlight: false },
    { key: "logic",   label: "Logic Pro", sub: "macOS",  highlight: false },
    { key: "fl",      label: "FL Studio", sub: "All",    highlight: false },
  ];
  return (
    <section className="mt-24 sm:mt-32 px-5 sm:px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="readout mb-4">Side D · How Aestra compares</p>
        <h2 className="display-2 text-3xl sm:text-4xl md:text-5xl text-fg mb-4 max-w-3xl">
          Different bets. Same job.
        </h2>
        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
          Ableton, Logic and FL have a twenty-year head start, and Aestra is an alpha.
          It's making different bets: free, loops first, light on your machine.
          Here's how that looks today.
        </p>

        <div className="border-t-2 border-fg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/80">
                  <th scope="col" className="px-4 sm:px-5 py-4 font-mono text-[10px] font-medium text-muted uppercase tracking-[0.14em] w-[42%] sm:w-[44%]">
                    Capability
                  </th>
                  {columns.map((c) => (
                    <th
                      key={String(c.key)}
                      scope="col"
                      className={`px-3 sm:px-4 py-4 text-left w-[14.5%] ${
                        c.highlight ? "bg-accent/[0.06]" : ""
                      }`}
                    >
                      <div className={`text-[13px] sm:text-sm font-semibold ${c.highlight ? "text-fg" : "text-fg-muted"}`}>
                        {c.label}
                      </div>
                      <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-0.5">
                        {c.sub}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 1 ? "bg-surface-2/30" : ""}>
                    <th scope="row" className="px-4 sm:px-5 py-3.5 text-[14px] font-medium text-fg text-left">
                      {row.label}
                    </th>
                    {columns.map((c) => {
                      const cell = row[c.key] as Cell;
                      const d = cellDisplay[cell];
                      return (
                        <td
                          key={String(c.key)}
                          className={`px-3 sm:px-4 py-3.5 text-center ${
                            c.highlight ? "bg-accent/[0.06]" : ""
                          }`}
                        >
                          <span
                            className={`inline-block text-base font-semibold ${d.color}`}
                            aria-label={d.label}
                            title={d.label}
                          >
                            {d.mark}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-dim text-[12px] mt-4 leading-relaxed">
          Based on publicly documented features as of 2026. Aestra is in alpha, so
          check the changelog for what works in the current source.
        </p>
      </div>
    </section>
  );
};
