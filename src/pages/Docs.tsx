import React, { memo } from "react";
import { FadeIn } from "../components/ui";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   Docs — a map, not a manual.

   The documentation lives in the Aestra repository next to the code, and
   the site never restates it ("the website orchestrates, the repos own
   truth"). Every entry here links to a file that exists on main; when a
   file moves, fix the link rather than copying its text onto the site.
   The earlier version of this page described patch recipes, persona
   tracks and in-page sandboxes. None of those existed, so they're gone.
   ───────────────────────────────────────────────────────────────── */

const REPO = "https://github.com/currentsuspect/Aestra/blob/main";

type Entry = { title: string; note: string; href: string; page?: string };
type Group = { n: string; title: string; lede: string; entries: Entry[] };

const GROUPS: Group[] = [
  {
    n: "01",
    title: "Build it",
    lede: "There's no installer yet, so this is where you start.",
    entries: [
      { title: "Building Aestra", note: "The build guide for Linux and Windows.", href: `${REPO}/docs/getting-started/building.md` },
      { title: "Quickstart", note: "Your first session, once it's built.", href: `${REPO}/docs/getting-started/quickstart.md` },
      { title: "Check your build", note: "A quick test that the public build works on your machine.", href: `${REPO}/docs/getting-started/validate-core-build.md` },
    ],
  },
  {
    n: "02",
    title: "How it works",
    lede: "For when you want to know what's running on your computer.",
    entries: [
      { title: "Architecture overview", note: "The core, audio, UI and platform layers.", href: `${REPO}/docs/architecture/overview.md` },
      { title: "Threading model", note: "Which thread does what, and why audio gets its own.", href: `${REPO}/docs/technical/THREADING_MODEL.md` },
      { title: "Glossary", note: "The audio and programming terms used in the code.", href: `${REPO}/docs/technical/glossary.md` },
      { title: "FAQ", note: "Questions from people building and contributing.", href: `${REPO}/docs/technical/faq.md` },
    ],
  },
  {
    n: "03",
    title: "Something broke",
    lede: "Start with the Recovery Center. It builds a report the maintainers can use.",
    entries: [
      { title: "Recovery Center", note: "Recover a project, or write a bug report with the details filled in.", href: "/recovery", page: "recovery" },
      { title: "Bug reports guide", note: "What a useful report contains.", href: `${REPO}/docs/developer/bug-reports.md` },
      { title: "Debugging guide", note: "Reproduce a bug and gather logs before you file it.", href: `${REPO}/docs/developer/debugging.md` },
      { title: "Security", note: "How to report a vulnerability privately.", href: `${REPO}/SECURITY.md` },
    ],
  },
  {
    n: "04",
    title: "Help build it",
    lede: "Aestra is source-available and one person reads every issue.",
    entries: [
      { title: "Contributing", note: "How to set up and send a change.", href: `${REPO}/CONTRIBUTING.md` },
      { title: "Coding style", note: "How the C++ is written.", href: `${REPO}/docs/developer/coding-style.md` },
      { title: "Design rules", note: "The visual language the app follows.", href: `${REPO}/DESIGN.md` },
    ],
  },
  {
    n: "05",
    title: "Reference",
    lede: "What's decided, what's shipped and what the license says.",
    entries: [
      { title: "Changelog", note: "Every release, with a preview of each change.", href: "/changelog", page: "changelog" },
      { title: "Roadmap", note: "What works, what's being built, what's next.", href: "/roadmap", page: "roadmap" },
      { title: "Philosophy", note: "What Aestra is for, in its own words.", href: `${REPO}/philosophy.md` },
      { title: "License", note: "ASSAL v1.1: what you can do with the software. Your music is always yours.", href: `${REPO}/LICENSING.md` },
    ],
  },
];

export const Docs = memo(({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-[1320px] mx-auto">
      <FadeIn>
        <p className="readout mb-5">Docs</p>
        <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)] max-w-[16ch]">The docs live with the code.</h1>
        <p className="mt-8 text-muted text-base sm:text-[17px] leading-relaxed max-w-xl">
          Aestra doesn't have a user manual yet. Its documentation sits in the repository
          next to the code it describes, so the two change together. This page is a map to it.
        </p>
      </FadeIn>

      {GROUPS.map((g) => (
        <section key={g.n} className="pt-16 sm:pt-24 grid lg:grid-cols-12 gap-8 lg:gap-6">
          <FadeIn className="lg:col-span-4">
            <p className="readout mb-4">{g.n}</p>
            <h2 className="display-2 text-[clamp(2rem,1.2rem+2.6vw,3.2rem)]">{g.title}</h2>
            <p className="mt-5 text-muted text-[15px] leading-relaxed max-w-sm">{g.lede}</p>
          </FadeIn>
          <FadeIn delay={0.05} className="lg:col-span-8 border-t-2 border-fg">
            <ul className="m-0 p-0">
              {g.entries.map((e) => {
                const internal = Boolean(e.page);
                return (
                  <li key={e.title} className="list-none border-b border-border">
                    <a
                      href={e.href}
                      {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      onClick={internal ? (ev) => {
                        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
                        ev.preventDefault();
                        setPage(e.page!);
                      } : undefined}
                      className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-x-6 gap-y-1 py-4 items-baseline group"
                    >
                      <span className="text-fg text-[17px] font-semibold group-hover:text-accent transition-colors">{e.title}</span>
                      <span className="text-muted text-[15px] leading-relaxed">{e.note}</span>
                      <span className="readout">{internal ? "On this site" : "GitHub"}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </section>
      ))}
    </div>
  </div>
));
