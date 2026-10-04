import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import type { Change, Release } from "../changelogData";
import { LANES, laneOf, clipVars, type LaneKey } from "./ChangelogArrangement";
import { tone } from "./mock/emberSession";
import { hasPreview } from "./previews";
import { EntryPreview } from "./previews/PreviewStage";
import { useOpenTake, type Take } from "./useOpenTake";

export type { Take };

/* ── ClipEditor ──────────────────────────────────────────────────────
   The editor for one release: the zoomed clip, and the entry rows. How it opens
   (the clip leaving the arrangement, the playhead sweep) lives in useOpenTake.
   Everything is rendered up front, so prerendered HTML, screen readers and
   reduced motion all get the finished list. */

type Row = { e: Change; key: string; mark: string };
type Group = { key: LaneKey; name: string; slot: number; rows: Row[] };

export const ClipEditor = memo(({
  release, lane, take, arrangement, onLane,
}: {
  release: Release;
  lane: LaneKey | null;
  take: Take;
  arrangement: React.RefObject<HTMLElement | null>;
  onLane: (lane: LaneKey | null) => void;
}) => {
  const root = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [hot, setHot] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setOpen(null), [release.version, lane]);
  const recording = release.status === "active";

  const groups = useMemo<Group[]>(() => {
    const all = LANES.map((l) => ({
      key: l.key, name: l.name, slot: l.slot,
      rows: release.entries
        .filter((e) => laneOf(e.type) === l.key)
        .map((e, i) => ({ e, key: `${release.version}:${l.key}:${i}`, mark: `${l.key}:${i}` })),
    })).filter((g) => g.rows.length > 0);
    return lane ? all.filter((g) => g.key === lane) : all;
  }, [release, lane]);

  const counts = useMemo(
    () => LANES.map((l) => ({ ...l, n: release.entries.filter((e) => laneOf(e.type) === l.key).length })).filter((l) => l.n > 0),
    [release],
  );
  const total = groups.reduce((n, g) => n + g.rows.length, 0);
  const single = groups.length === 1;

  useOpenTake(root, readout, arrangement, release.version, take);

  const laneName = lane ? LANES.find((l) => l.key === lane)?.name : null;

  return (
    <section
      ref={root}
      className="cle border border-t-0 border-fg scroll-mt-24"
      aria-live="polite"
      aria-label={`${release.version} release notes`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-surface border-b border-border">
        <span className="readout !text-fg">
          Clip editor — {recording ? "Unreleased" : release.version}
          {laneName ? ` · ${laneName}` : ""} · {release.date}
        </span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter this release by kind of change">
          <button type="button" aria-pressed={!lane} onClick={() => onLane(null)} className="cle-chip">
            All {release.entries.length}
          </button>
          {counts.map((l) => (
            <button key={l.key} type="button" aria-pressed={lane === l.key} onClick={() => onLane(l.key)} className="cle-chip">
              {l.name} {l.n}
            </button>
          ))}
        </div>
      </div>

      {/* The clip, zoomed to the editor's width */}
      <div className="cle-strip" aria-hidden="true" data-single={single ? "" : undefined}>
        <div className="cle-names">
          <div className="cle-ruler-name">
            <span ref={readout}>{String(total).padStart(2, "0")} entries</span>
          </div>
          {groups.map((g) => (
            <div key={g.key} className="cle-name" style={{ ["--c" as string]: tone(g.slot).lane }}>{g.name}</div>
          ))}
        </div>
        <div className="cle-track">
          <div className="cle-ruler" />
          {groups.map((g) => (
            <div key={`${release.version}:${g.key}`} className="cle-cell" data-cle-lane={g.key}>
              <div className={recording ? "clx-clip clx-rec cle-clip" : "clx-clip cle-clip"} style={clipVars(recording, g.slot)}>
                <span className="clx-h">{g.rows.length} {g.name.toLowerCase()}</span>
                <span className="clx-w">
                  {g.rows.map((r, i) => (
                    <i
                      key={r.key}
                      data-cle-mark={r.mark}
                      data-hot={hot === r.mark ? "" : undefined}
                      style={{ left: `${((i + 0.5) / g.rows.length) * 100}%` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          ))}
          <div className="cle-ph" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 px-4 py-6">
        <p className="lg:col-span-4 m-0 text-muted text-[15px] leading-relaxed">{release.summary}</p>
        <ul className="lg:col-span-8 m-0 p-0 list-none">
          {groups.map((g) => (
            <React.Fragment key={g.key}>
              {!single && (
                <li className="cle-group" style={{ ["--c" as string]: tone(g.slot).lane }}>
                  {g.name} · {g.rows.length}
                </li>
              )}
              {g.rows.map((r) => {
                const previewable = hasPreview(release.version, r.e.text);
                const isOpen = open === r.key;
                const body = (
                  <>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-muted pt-1 flex flex-col gap-1.5">
                      <span className="flex items-baseline gap-2">
                        <span className="w-[7px] h-[7px] shrink-0 self-center" style={{ background: "var(--c)" }} />
                        {r.e.type}
                      </span>
                      {previewable && <span className="cle-play">{isOpen ? "■ Close" : "▶ Preview"}</span>}
                    </span>
                    <span>{r.e.text}</span>
                  </>
                );
                return (
                  <li
                    key={r.key}
                    data-cle-row={r.mark}
                    data-open={isOpen ? "" : undefined}
                    onMouseEnter={() => setHot(r.mark)}
                    onMouseLeave={() => setHot(null)}
                    className="cle-row border-b border-border text-[15px] leading-relaxed text-fg"
                    style={{ ["--c" as string]: tone(g.slot).lane }}
                  >
                    <span className="cle-hit" aria-hidden="true" />
                    {previewable ? (
                      <button
                        type="button"
                        className="cle-entry cle-entry-btn"
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? `pv-${r.mark}` : undefined}
                        onClick={(ev) => {
                          setOpen(isOpen ? null : r.key);
                          if (!isOpen) {
                            const li = (ev.currentTarget as HTMLElement).parentElement;
                            requestAnimationFrame(() => li?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
                          }
                        }}
                      >
                        {body}
                      </button>
                    ) : (
                      <div className="cle-entry">{body}</div>
                    )}
                    {isOpen && previewable && <EntryPreview version={release.version} text={r.e.text} id={`pv-${r.mark}`} />}
                  </li>
                );
              })}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
});
