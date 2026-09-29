import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button, FadeIn } from "../components/ui";
import { RELEASES } from "../changelogData";
import type { Release } from "../changelogData";
import {
  ChangelogArrangement, CHANGELOG_SELECT_KEY, type ArrangementSelection, type LaneKey,
} from "../components/ChangelogArrangement";
import { ClipEditor, type Take } from "../components/ClipEditor";
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

/** Where the page opens: a clip handed over from Home (which then plays), a shared link, or the latest release. */
const initialSelection = (releases: Release[]): { sel: ArrangementSelection; handoff: boolean } => {
  try {
    const raw = sessionStorage.getItem(CHANGELOG_SELECT_KEY);
    if (raw) {
      sessionStorage.removeItem(CHANGELOG_SELECT_KEY);
      const s = JSON.parse(raw) as ArrangementSelection;
      if (releases.some((r) => r.version === s.version)) return { sel: s, handoff: true };
    }
  } catch { /* storage may be unavailable; fall through */ }
  const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  const byHash = releases.find((r) => releaseAnchor(r.version) === hash);
  return { sel: { version: (byHash ?? LATEST).version, lane: null }, handoff: false };
};

export const Changelog = memo(({ setPage }: PageProps) => {
  const oldestFirst = useMemo<Release[]>(() => [...RELEASES].reverse(), []);
  const [initial] = useState(() => initialSelection(oldestFirst));
  const [sel, setSel] = useState<ArrangementSelection>(initial.sel);
  // Arriving from Home, give the page a moment to land before the clip moves.
  const [take, setTake] = useState<Take>({ n: 0, motion: initial.handoff, wait: 320 });
  const arrangement = useRef<HTMLDivElement>(null);

  const release = oldestFirst.find((r) => r.version === sel.version) ?? LATEST;

  const open = useCallback((s: ArrangementSelection) => {
    setSel(s);
    setTake((t) => ({ n: t.n + 1, motion: true }));
    try { window.history.replaceState(null, "", `#${releaseAnchor(s.version)}`); } catch { /* cosmetic */ }
  }, []);
  const onLane = useCallback((lane: LaneKey | null) => open({ version: release.version, lane }), [open, release.version]);

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
              marks are entries. Open a clip or a locator and it plays below.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.08} className="mt-12">
          <div ref={arrangement}>
            <ChangelogArrangement releases={oldestFirst} selection={sel} onSelect={open} />
          </div>
          <ClipEditor release={release} lane={sel.lane} take={take} arrangement={arrangement} onLane={onLane} />
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
