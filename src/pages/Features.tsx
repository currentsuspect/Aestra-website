import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FadeIn } from "../components/ui";
import { SessionProvider } from "../features/session";
import { Turntable } from "../features/Turntable";
import { NowPlaying } from "../features/NowPlaying";
import { LoopDemo } from "../features/demos/LoopDemo";
import { RoutingDemo } from "../features/demos/RoutingDemo";
import { AuditionDemo } from "../features/demos/AuditionDemo";
import { HistoryDemo } from "../features/demos/HistoryDemo";
import { EngineDemo } from "../features/demos/EngineDemo";
import { ReopenDemo } from "../features/demos/ReopenDemo";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   Features, as the inside of a record. The hero is a turntable; scroll
   and you go into the grooves, where each feature is a track with a live
   demo you can touch. All the demos share one loop, so what you change in
   one is heard and seen in the rest.

   The copy for each track is plain description; the demo is the proof.
   Each demo says what it is: an illustration (a browser stand-in), or a
   preview of a design that isn't shipped yet.
   ───────────────────────────────────────────────────────────────── */

type Track = {
  id: string;
  side: "A" | "B" | "C";
  n: number;
  title: string;
  tag: string;
  desc: string;
  points: [string, string][];
  demo: React.ReactNode;
};

const SIDES = {
  A: { name: "Create", line: "Go from a first loop to a project you can keep building on." },
  B: { name: "Understand", line: "See what the engine and the signal path are doing underneath." },
  C: { name: "Finish", line: "Check how the mix sounds elsewhere, compare versions, keep the best one." },
} as const;

const TRACKS: Track[] = [
  {
    id: "a1", side: "A", n: 1, title: "Opens into your project", tag: "Startup",
    desc: "The longer it takes to start, the more ideas you lose on the way. Aestra opens straight to your project.",
    points: [
      ["No rescan every launch", "The plugin list is prepared ahead of time instead of rebuilt each time you open the app."],
      ["Project first", "No splash screen to sit through."],
      ["Back where you were", "Same project, same view, same spot in the song."],
    ],
    demo: <ReopenDemo />,
  },
  {
    id: "a2", side: "A", n: 2, title: "Start with a loop", tag: "Workflow",
    desc: "Most beats start as a loop, not as bar one of a timeline. So Aestra starts there too, and you build the song around it.",
    points: [
      ["Reuse a loop anywhere", "Copy it, change one copy, drop it into the second verse."],
      ["Sketch first", "Get the idea down in the loop view before you think about song structure."],
      ["Notes are one click away", "Open a loop and its notes are right there. No digging through the timeline."],
    ],
    demo: <LoopDemo />,
  },
  {
    id: "b1", side: "B", n: 1, title: "Written in C++, readable on GitHub", tag: "Engine",
    desc: "The app and its audio engine are one program, written in C++. All the code is on GitHub, so you can see what runs on your computer.",
    points: [
      ["One native program", "No browser or Java layer underneath. The app and the audio engine are built together."],
      ["Audio on its own thread", "Drawing the screen never gets in the way of playing sound."],
      ["Source-available", "You can read it and build it. It's not open source, and the license says what you can do."],
    ],
    demo: <EngineDemo />,
  },
  {
    id: "b2", side: "B", n: 2, title: "See where the sound goes", tag: "Mixing",
    desc: "A lot of mix problems are really routing problems you can't see. Aestra draws the signal path and lights it up while the music plays.",
    points: [
      ["Watch it move", "Follow the sound from each track, through your buses, to the master."],
      ["Easy to tell apart", "Instruments, buses and outputs have their own colours, even in a busy project."],
      ["Change it on the map", "Re-route by dragging, instead of hunting through menus."],
    ],
    demo: <RoutingDemo />,
  },
  {
    id: "c1", side: "C", n: 1, title: "Check the mix before you share it", tag: "Monitoring",
    desc: "A mix that sounds great in your headphones can fall apart on a phone. Audition lets you hear it the way other people will, while you can still fix it.",
    points: [
      ["Phone, earbuds, car", "Switch between listening profiles for the places people actually listen."],
      ["Hear the difference", "Compare how the balance changes without leaving the project or exporting a file."],
      ["Fix it now", "Catch a thin low end while the project is still open."],
    ],
    demo: <AuditionDemo />,
  },
  {
    id: "c2", side: "C", n: 2, title: "Keep the version that worked", tag: "History",
    desc: "Save checkpoints with names you'll recognise next week, try something risky, and go back if it doesn't work.",
    points: [
      ["Names, not final_final_v7", "Save checkpoints you can actually identify later."],
      ["Try the weird idea", "Take the project somewhere new without losing the mix you already like."],
      ["Compare and keep one", "Play two versions against each other and keep the better one."],
    ],
    demo: <HistoryDemo />,
  },
];

/* Which track is on screen, for the tracklist beside them. */
const useActiveTrack = () => {
  const [active, setActive] = useState(TRACKS[0].id);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit) setActive((hit.target as HTMLElement).id);
    }, { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.1, 0.5, 1] });
    TRACKS.forEach((t) => { const el = document.getElementById(t.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
};

const Tracklist = ({ active }: { active: string }) => (
  <nav aria-label="Tracks" className="hidden lg:block">
    <div className="sticky top-24">
      <p className="dcap m-0 mb-4">Tracklist</p>
      <ol className="m-0 p-0 list-none">
        {TRACKS.map((t, i) => {
          const first = i === 0 || TRACKS[i - 1].side !== t.side;
          const on = t.id === active;
          return (
            <li key={t.id}>
              {first && <p className="dcap m-0 mt-5 mb-2" style={{ color: "#a88dfb" }}>Side {t.side} · {SIDES[t.side].name}</p>}
              <a
                href={`#${t.id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                className="flex items-baseline gap-3 py-1.5 text-[13px] no-underline"
                style={{ color: on ? "#eee9e1" : "#857d72", borderLeft: `2px solid ${on ? "#a88dfb" : "#2e2a26"}`, paddingLeft: 10, transition: "color .2s" }}
                aria-current={on ? "true" : undefined}
              >
                <span className="font-mono text-[11px]" style={{ color: on ? "#a88dfb" : "#57514a" }}>{t.side}{t.n}</span>
                {t.title}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  </nav>
);

const TrackSection = ({ t, first }: { t: Track; first: boolean }) => (
  <section id={t.id} className="scroll-mt-20 pt-16 sm:pt-24 pb-6" aria-labelledby={`${t.id}-h`}>
    {first && (
      <div className="mb-14" style={{ borderTop: "2px solid #eee9e1", paddingTop: 20 }}>
        <p className="dcap m-0" style={{ color: "#a88dfb" }}>Side {t.side}</p>
        <h2 className="m-0 mt-2 text-[clamp(2.4rem,1.4rem+3.4vw,4.4rem)] leading-[0.95]" style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontStretch: "62%", textTransform: "uppercase", letterSpacing: "-0.01em" }}>{SIDES[t.side].name}</h2>
        <p className="m-0 mt-3 text-[15px]" style={{ color: "#aca397" }}>{SIDES[t.side].line}</p>
      </div>
    )}
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[13px] font-semibold" style={{ color: "#a88dfb" }}>{t.side}{t.n}</span>
      <span className="dcap">{t.tag}</span>
    </div>
    <h3 id={`${t.id}-h`} className="m-0 mt-2 text-[clamp(1.7rem,1.1rem+1.8vw,2.6rem)] leading-[1.02]" style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontStretch: "62%", textTransform: "uppercase", letterSpacing: "-0.005em" }}>{t.title}</h3>
    <p className="m-0 mt-4 max-w-[58ch] text-[17px] leading-relaxed" style={{ color: "#eee9e1" }}>{t.desc}</p>
    <dl className="m-0 mt-5 grid sm:grid-cols-3 gap-4 max-w-[900px]">
      {t.points.map(([strong, rest]) => (
        <div key={strong} className="grid gap-1 content-start">
          <dt className="text-[13.5px] font-semibold" style={{ color: "#eee9e1" }}>{strong}</dt>
          <dd className="m-0 text-[13.5px] leading-relaxed" style={{ color: "#857d72" }}>{rest}</dd>
        </div>
      ))}
    </dl>
    <div className="mt-7">{t.demo}</div>
  </section>
);

export const Features = ({ setPage, topOffset = 0, onEarlyAccess }: PageProps) => {
  const active = useActiveTrack();
  return (
    <>
      <Navbar activePage="features" setPage={setPage} topOffset={topOffset} onEarlyAccess={onEarlyAccess} />
      <SessionProvider>
        <Turntable>
          <p className="readout m-0 mb-3">Features · 3 sides, 6 tracks</p>
          <h1 className="display m-0 text-[clamp(2.6rem,1.4rem+4.4vw,6.2rem)] max-w-[14ch]">Step inside the record.</h1>
        </Turntable>

        <div className="inside">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-6 pb-16 grid lg:grid-cols-[210px_minmax(0,1fr)] gap-x-12">
            <Tracklist active={active} />
            <div className="min-w-0">
              {TRACKS.map((t, i) => (
                <TrackSection key={t.id} t={t} first={i === 0 || TRACKS[i - 1].side !== t.side} />
              ))}
            </div>
          </div>
          <NowPlaying />
        </div>
      </SessionProvider>

      <div className="pt-24 pb-20 sm:pb-28 px-5 sm:px-6">
        <FadeInTable />
      </div>
      <Footer setPage={setPage} />
    </>
  );
};

const FadeInTable = () => <FadeIn><ComparisonTable /></FadeIn>;

/* ── Comparison table ────────────────────────────────────────── */
type Cell = "yes" | "no" | "limited" | "na";

const cellDisplay: Record<Cell, { mark: string; color: string; label: string }> = {
  yes:     { mark: "✓",  color: "text-emerald-400", label: "Yes" },
  no:      { mark: "—",  color: "text-dim",         label: "No" },
  limited: { mark: "~",  color: "text-amber-400",   label: "Limited" },
  na:      { mark: "—",  color: "text-dim",         label: "—" },
};

/* Only rows that can be checked against the other products' own documentation.
   Checked Oct 2026: Ableton Live 12 hosts VST3 but not CLAP; Logic Pro hosts Audio Units only;
   FL Studio hosts VST3 and CLAP (CLAP since 24.1) on Windows and macOS; Ableton, Logic and
   FL all offer a time-limited or save-limited trial rather than a free product (Live and Logic:
   90 days; FL: unlimited time but a trial can't reopen saved projects). */
const COMPARISON_ROWS: { label: string; aestra: Cell; ableton: Cell; logic: Cell; fl: Cell; }[] = [
  { label: "Free, with no trial limits",     aestra: "yes",     ableton: "no",  logic: "no", fl: "limited" },
  { label: "Runs on Linux",                  aestra: "yes",     ableton: "no",  logic: "no", fl: "no"      },
  { label: "Loop-based workflow",            aestra: "yes",     ableton: "yes", logic: "limited", fl: "yes" },
  { label: "VST3 plugin hosting",            aestra: "limited", ableton: "yes", logic: "no", fl: "yes"     },
  { label: "CLAP plugin hosting",            aestra: "limited", ableton: "no",  logic: "no", fl: "yes"     },
  { label: "You can read the code",          aestra: "yes",     ableton: "no",  logic: "no", fl: "no"      },
];

const ComparisonTable = () => {
  const columns: { key: keyof typeof COMPARISON_ROWS[0]; label: string; sub: string; highlight: boolean }[] = [
    { key: "aestra",  label: "Aestra",    sub: "Alpha",  highlight: true  },
    { key: "ableton", label: "Live",      sub: "Win · Mac", highlight: false },
    { key: "logic",   label: "Logic Pro", sub: "macOS",  highlight: false },
    { key: "fl",      label: "FL Studio", sub: "Win · Mac", highlight: false },
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
          Based on each product's own documentation as of October 2026. "Limited" means
          partly there: Aestra's plugin hosting is unfinished, Logic has Live Loops but is
          timeline-first, and FL's free trial can't reopen saved projects. Aestra is in alpha, so
          check the changelog for what works today.
        </p>
      </div>
    </section>
  );
};
