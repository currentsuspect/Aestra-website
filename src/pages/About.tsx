import React from "react";
import { FadeIn } from "../components/ui";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   About — the founder's story, in the founder's words.

   Facts here are checkable: first commit 2025-10-08 and the commit
   count come from `git log` in ~/Dev/Aestra. "1,900+" was written at
   1,951 commits so it stays true as the number grows; don't swap in an
   exact figure that goes stale.
   ───────────────────────────────────────────────────────────────── */

const CHAPTERS: { mark: string; title: string; body: React.ReactNode }[] = [
  {
    mark: "01",
    title: "Before",
    body: (
      <>
        I learned to make music on FL Studio. I couldn't afford it, so I ran copies
        from download sites I shouldn't have trusted. Some of them came with more
        than a DAW: viruses, broken installers, and the constant feeling that the
        thing I made music on could turn on me.
      </>
    ),
  },
  {
    mark: "02",
    title: "Linux",
    body: (
      <>
        In college I moved to Arch Linux, because I wanted to understand and control
        the machine I worked on. FL Studio doesn't run on Linux. Neither did most of
        my plugins. The tools I'd learned on stopped at the door.
      </>
    ),
  },
  {
    mark: "03",
    title: "The search",
    body: (
      <>
        So I looked up how to build a DAW. Not a copy of the one I'd left, but the
        one I'd wanted the whole time: fast on a laptop without much RAM, honest
        about what it's doing, and never the reason a session ends badly.
      </>
    ),
  },
  {
    mark: "04",
    title: "Now",
    body: (
      <>
        The first commit landed on 8 October 2025. More than 1,900 commits later,
        Aestra is in alpha, built and tested on Linux, and the whole DAW is free.
        Nobody should have to download something shady to make music.
      </>
    ),
  },
];

const FACTS: [string, string][] = [
  ["First commit", "8 Oct 2025"],
  ["Built on", "Arch Linux"],
  ["Engine", "Native C++"],
  ["Commits", "1,900+"],
  ["Team", "One person"],
];

export const About = ({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-6">About</p>
        <h1 className="display hero-title text-fg max-w-[14ch] text-balance">
          Built because nothing else would run here.
        </h1>
      </FadeIn>

      <div className="mt-16 sm:mt-24 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
        <FadeIn delay={0.05}>
          <div className="lg:sticky lg:top-28">
            <p className="text-muted text-base sm:text-[17px] leading-relaxed max-w-md">
              Aestra wasn't planned as a company. It started as one producer's way
              out of a problem a lot of producers have.
            </p>
            {/* Margin on a wrapper: .ledger is unlayered CSS with margin: 0,
                which beats an mt-* utility on the same element. */}
            <div className="mt-10 max-w-md">
              <dl className="ledger">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3 border-b border-border">
                    <dt className="readout">{k}</dt>
                    <dd className="text-fg text-[15px] text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </FadeIn>

        <ol className="list-none m-0 p-0">
          {CHAPTERS.map((c, i) => (
            <FadeIn key={c.mark} delay={Math.min(i * 0.04, 0.16)}>
              <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 pb-10 sm:pb-12 mb-10 sm:mb-12 border-b border-border/70 last:border-b-0 last:mb-0">
                <span className="font-mono text-[11px] text-faint tabular-nums pt-1.5">{c.mark}</span>
                <div>
                  <h2 className="text-fg text-[19px] sm:text-[21px] font-semibold tracking-tight mb-3">{c.title}</h2>
                  <p className="text-fg-muted text-[16px] sm:text-[17px] leading-relaxed max-w-2xl">{c.body}</p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>

      {/* Signature */}
      <FadeIn delay={0.1}>
        <figure className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-border/70 max-w-4xl">
          <blockquote className="display-2 text-2xl sm:text-3xl md:text-[40px] leading-[1.18] text-fg text-balance">
            From a person with not much RAM, high standards and a lot of ambition,{" "}
            <span className="text-muted">to another. With love.</span>
          </blockquote>
          <figcaption className="mt-6 readout">Dylan Makori · Aestra</figcaption>
        </figure>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-16 sm:mt-20 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
          <a
            href="https://github.com/currentsuspect/Aestra/blob/main/philosophy.md"
            target="_blank"
            rel="noopener noreferrer"
            className="quiet-link"
          >
            Read the philosophy
          </a>
          <a
            href="/changelog"
            onClick={(e) => { e.preventDefault(); setPage("changelog"); }}
            className="quiet-link"
          >
            See what's shipped
          </a>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); setPage("home"); }}
            className="quiet-link"
          >
            Back to home
          </a>
        </div>
      </FadeIn>
    </div>
  </div>
);
