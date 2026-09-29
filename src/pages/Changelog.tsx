import React, { memo, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button, FadeIn } from "../components/ui";
import { RELEASES } from "../changelogData";
import type { Release } from "../changelogData";
import {
  ChangelogArrangement, LANES, laneOf, CHANGELOG_SELECT_KEY, type ArrangementSelection, type LaneKey,
} from "../components/ChangelogArrangement";
import { tone } from "../components/mock/emberSession";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   Changelog — every release, laid out like a session. The arrangement
   is the index; selecting a clip or a locator opens it in the clip
   editor below. The archive underneath keeps every release note in the
   page as plain text, for search, for screen readers, and for anyone who
   just wants to read it top to bottom.
   ───────────────────────────────────────────────────────────────── */

export const releaseAnchor = (version: string) =>
  `release-${version.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const LATEST = RELEASES.find((r) => r.status !== "active") ?? RELEASES[0];

const laneColor = (k: LaneKey) => tone(LANES.find((l) => l.key === k)!.slot).lane;

const initialSelection = (releases: Release[]): ArrangementSelection => {
  try {
    const raw = sessionStorage.getItem(CHANGELOG_SELECT_KEY);
    if (raw) {
      sessionStorage.removeItem(CHANGELOG_SELECT_KEY);
      const s = JSON.parse(raw) as ArrangementSelection;
      if (releases.some((r) => r.version === s.version)) return s;
    }
  } catch { /* storage may be unavailable; fall through */ }
  const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  const byHash = releases.find((r) => releaseAnchor(r.version) === hash);
  return { version: (byHash ?? LATEST).version, lane: null };
};

export const Changelog = memo(({ setPage }: PageProps) => {
  const oldestFirst = useMemo<Release[]>(() => [...RELEASES].reverse(), []);
  const [sel, setSel] = useState<ArrangementSelection>(() => initialSelection(oldestFirst));

  const release = oldestFirst.find((r) => r.version === sel.version) ?? LATEST;
  const entries = sel.lane ? release.entries.filter((e) => laneOf(e.type) === sel.lane) : release.entries;
  const counts = LANES.map((l) => ({ ...l, n: release.entries.filter((e) => laneOf(e.type) === l.key).length })).filter((l) => l.n > 0);

  return (
    <div className="pt-28 sm:pt-32 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <FadeIn className="lg:col-span-7">
            <p className="readout mb-5">Latest · {LATEST.version} · {LATEST.date}</p>
            <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)] m-0">Changelog</h1>
          </FadeIn>
          <FadeIn delay={0.05} className="lg:col-span-4 lg:col-start-9">
            <p className="m-0 text-muted text-[16px] leading-relaxed">
              Every release, laid out like a session. Lanes are kinds of change,
              marks are entries. Select a clip or a locator to open it below.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.08} className="mt-12">
          <ChangelogArrangement releases={oldestFirst} selection={sel} onSelect={setSel} />

          {/* Clip editor */}
          <section className="border border-t-0 border-fg" aria-live="polite" aria-label={`${release.version} release notes`}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-surface border-b border-border">
              <span className="readout !text-fg">
                Clip editor — {release.version}
                {sel.lane ? ` · ${LANES.find((l) => l.key === sel.lane)?.name}` : ""} · {release.date}
              </span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter this release by kind of change">
                <button
                  type="button"
                  aria-pressed={!sel.lane}
                  onClick={() => setSel({ version: release.version, lane: null })}
                  className="font-mono text-[10.5px] uppercase tracking-[0.05em] px-2 py-1 border border-border aria-pressed:bg-fg aria-pressed:text-bg aria-pressed:border-fg"
                >
                  All {release.entries.length}
                </button>
                {counts.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    aria-pressed={sel.lane === l.key}
                    onClick={() => setSel({ version: release.version, lane: l.key })}
                    className="font-mono text-[10.5px] uppercase tracking-[0.05em] px-2 py-1 border border-border aria-pressed:bg-fg aria-pressed:text-bg aria-pressed:border-fg"
                  >
                    {l.name} {l.n}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-6 px-4 py-6">
              <p className="lg:col-span-4 m-0 text-muted text-[15px] leading-relaxed">{release.summary}</p>
              <ul className="lg:col-span-8 m-0 p-0 list-none">
                {entries.map((e, i) => (
                  <li key={i} className="grid grid-cols-[84px_1fr] gap-3 py-2.5 border-b border-border first:pt-0 text-[15px] leading-relaxed text-fg">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-muted pt-1 flex items-baseline gap-2">
                      <span className="w-[7px] h-[7px] shrink-0 self-center" style={{ background: laneColor(laneOf(e.type)) }} />
                      {e.type}
                    </span>
                    <span>{e.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </FadeIn>

        {/* Archive: every release, as text */}
        <section className="mt-24" aria-labelledby="archive-h">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <p className="readout mb-4">Archive</p>
              <h2 id="archive-h" className="display-2 text-[clamp(2rem,1.2rem+2.4vw,3.2rem)] m-0">Every release, in full</h2>
            </div>
            <div className="lg:col-span-8 border-t-2 border-fg">
              {RELEASES.map((r) => (
                <details key={r.version} id={releaseAnchor(r.version)} className="group faq-row border-b border-border scroll-mt-24">
                  <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none py-4">
                    <span className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-fg text-[17px] font-semibold">{r.status === "active" ? "Unreleased" : r.version}</span>
                      <span className="readout">{r.date}</span>
                      <span className="readout">{r.entries.length} entries</span>
                    </span>
                    <span aria-hidden="true" className="faq-toggle" />
                  </summary>
                  <div className="pb-6 max-w-3xl">
                    <p className="m-0 mb-4 text-muted text-[15px] leading-relaxed">{r.summary}</p>
                    <ul className="m-0 p-0 list-none">
                      {r.entries.map((e, i) => (
                        <li key={i} className="grid grid-cols-[84px_1fr] gap-3 py-1.5 text-[14px] leading-relaxed text-fg-muted">
                          <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-dim pt-[3px]">{e.type}</span>
                          <span>{e.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-16 pt-6 border-t border-border flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setPage("docs")}>Open docs</Button>
          <a
            href="https://github.com/currentsuspect/Aestra/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 h-10 text-sm text-fg-muted hover:text-fg hover:border-border-2 transition-colors"
          >
            Open canonical CHANGELOG.md <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
});
