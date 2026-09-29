import React, { memo } from "react";
import type { Release, ChangeType } from "../changelogData";
import { tone } from "./mock/emberSession";

/* ── ChangelogArrangement ────────────────────────────────────────────
   The changelog laid out like a session in the DAW: each release is a
   locator on the ruler (oldest left), each kind of change is a lane, each
   mark inside a clip is one entry. The cycle still in progress is a
   clip that is still recording. Clip bodies use the DAW's own clip rule
   (Ember hue, luminance capped at 0.14, ink lifted toward white), so the
   page and the app draw clips the same way. Selecting a clip or a locator
   is reported up; the page decides what to show for it. */

export type LaneKey = "new" | "fix" | "perf" | "security" | "ci";

export const LANES: { key: LaneKey; name: string; slot: number }[] = [
  { key: "new", name: "New", slot: 1 },
  { key: "fix", name: "Fix", slot: 4 },
  { key: "perf", name: "Perf", slot: 2 },
  { key: "security", name: "Security", slot: 3 },
  { key: "ci", name: "CI · Docs", slot: 5 },
];

export const laneOf = (t: ChangeType): LaneKey => (t === "docs" ? "ci" : t);

export type ArrangementSelection = { version: string; lane: LaneKey | null };

/** Home's "Recent sessions" hands its selection to the changelog page through here. */
export const CHANGELOG_SELECT_KEY = "aestra-changelog-select";

const shortVersion = (v: string) => v.replace("-alpha", "");

/** Clip colours, shared with the clip editor so a clip and its zoomed view match. */
export const clipVars = (recording: boolean, slot: number) => {
  const t = tone(slot);
  return { ["--c" as string]: recording ? "#7a1f24" : t.body, ["--ink" as string]: recording ? "#ffd9d2" : t.label };
};

export const ChangelogArrangement = memo(({
  releases, selection, onSelect, compact = false,
}: {
  /** Oldest first. */
  releases: Release[];
  selection: ArrangementSelection | null;
  onSelect: (s: ArrangementSelection) => void;
  compact?: boolean;
}) => (
  <div className="clx-wrap" role="group" aria-label="Releases arranged as a session: lanes are kinds of change, marks are entries">
    <div className={compact ? "clx clx-compact" : "clx"}>
      <div className="clx-lanes" aria-hidden="true">
        <div className="clx-lanes-head">Lanes</div>
        {LANES.map((l) => (
          <div key={l.key} className="clx-lane-name" style={{ ["--c" as string]: tone(l.slot).lane }}>{l.name}</div>
        ))}
      </div>
      <div className="clx-cols">
        {releases.map((r) => {
          const recording = r.status === "active";
          const selected = selection?.version === r.version;
          return (
            <div
              key={r.version}
              className="clx-col"
              data-clx-v={r.version}
              data-sel={selected && !selection?.lane ? "" : undefined}
              style={{ flexGrow: Math.max(recording ? 5 : 0, 3 + r.entries.length * 0.35) }}
            >
              <button
                type="button"
                className="clx-loc"
                onClick={() => onSelect({ version: r.version, lane: null })}
                aria-pressed={selected && !selection?.lane}
                aria-label={`${r.version}, ${r.date}: ${r.entries.length} entries`}
              >
                <span>{recording ? "● Unreleased" : shortVersion(r.version)}</span>
                <small>{recording ? "recording" : r.date}</small>
              </button>
              {LANES.map((l) => {
                const entries = r.entries.filter((e) => laneOf(e.type) === l.key);
                return (
                  <div key={l.key} className="clx-cell">
                    {entries.length > 0 && (
                      <button
                        type="button"
                        className={recording ? "clx-clip clx-rec" : "clx-clip"}
                        data-sel={selected && selection?.lane === l.key ? "" : undefined}
                        data-clx-v={r.version}
                        data-clx-lane={l.key}
                        onClick={() => onSelect({ version: r.version, lane: l.key })}
                        aria-label={`${r.version}: ${entries.length} ${l.name.toLowerCase()}`}
                        style={clipVars(recording, l.slot)}
                      >
                        <span className="clx-h">{entries.length} {l.name.toLowerCase()}</span>
                        <span className="clx-w" aria-hidden="true">
                          {entries.map((e, i) => (
                            <i key={i} title={e.text} style={{ left: `${((i + 0.5) / entries.length) * 100}%` }} />
                          ))}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  </div>
));
