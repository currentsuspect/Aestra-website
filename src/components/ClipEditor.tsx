import React, { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Change, Release } from "../changelogData";
import { LANES, laneOf, clipVars, type LaneKey } from "./ChangelogArrangement";
import { tone } from "./mock/emberSession";
import { previewFor } from "./previews";
import { PreviewStage } from "./previews/PreviewStage";

/* ── ClipEditor ──────────────────────────────────────────────────────
   Opening a clip works the way it does in the DAW: the clip leaves the
   arrangement and lands in the editor, zoomed to the full width, then
   plays once. A playhead crosses it, and each entry comes in as the
   playhead reaches its mark, so the list reads in the order the clip
   draws it. Opening a locator plays every lane of that release at once.

   Everything is rendered up front. The motion is Web Animations with
   backwards fill, so prerendered HTML, screen readers and reduced
   motion all get the finished list; the take only decides how it
   arrives. */

/** One opening of the editor. `wait` lets a page finish arriving before the clip moves. */
export type Take = { n: number; motion: boolean; wait?: number };

type Row = { e: Change; key: string; mark: string };
type Group = { key: LaneKey; name: string; slot: number; rows: Row[] };

const NAV_CLEARANCE = 80;
const LAND_MS = 460;
const SWEEP_MS = 1100;
const EASE_LAND = "cubic-bezier(.2,.8,.1,1)";
const EASE_ROW = "cubic-bezier(.2,.7,.2,1)";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Move the page so the arrangement and the editor share the screen. Resolves when the scroll stops. */
const frame = (arrangement: HTMLElement | null, editor: HTMLElement) =>
  new Promise<void>((resolve) => {
    const y = window.scrollY;
    const room = window.innerHeight - NAV_CLEARANCE - 16;
    const editorTop = editor.getBoundingClientRect().top + y;
    const arrTop = arrangement ? arrangement.getBoundingClientRect().top + y : editorTop;
    // Arrangement, the zoomed clip and the first rows together, when they fit; otherwise
    // the editor first, with the arrangement's last lane still showing above it.
    const target = editorTop + 300 - arrTop <= room ? arrTop - NAV_CLEARANCE : editorTop - NAV_CLEARANCE - 56;
    const top = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight));
    if (Math.abs(top - y) < 24) return resolve();
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    window.addEventListener("scrollend", finish, { once: true });
    setTimeout(finish, 800);
    window.scrollTo({ top, behavior: "smooth" });
  });

const visible = (r: DOMRect) =>
  r.bottom > NAV_CLEARANCE && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth && r.width > 0;

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

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !take.motion || reducedMotion() || typeof el.animate !== "function") return;

    // Hold the new content back until the page has settled; the animations take over from here.
    el.dataset.armed = "";
    let cancelled = false;
    let raf = 0;
    const ghosts: HTMLElement[] = [];

    new Promise((r) => setTimeout(r, take.wait ?? 0)).then(() => (cancelled ? undefined : frame(arrangement.current, el))).then(() => {
      if (cancelled) return;
      const lanes = [...el.querySelectorAll<HTMLElement>("[data-cle-lane]")];
      const track = el.querySelector<HTMLElement>(".cle-track")!.getBoundingClientRect();

      // The clip (or every clip of the release) flies from the arrangement to its lane here.
      let landed = 0;
      lanes.forEach((target, i) => {
        const source = arrangement.current?.querySelector<HTMLElement>(
          `.clx-clip[data-clx-v="${release.version}"][data-clx-lane="${target.dataset.cleLane}"]`,
        );
        const from = source?.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        if (!source || !from || !visible(from)) return;
        const ghost = source.cloneNode(true) as HTMLElement;
        ghost.removeAttribute("data-sel");
        ghost.setAttribute("aria-hidden", "true");
        ghost.classList.add("cle-ghost");
        Object.assign(ghost.style, { left: "0px", top: "0px", width: `${from.width}px`, height: `${from.height}px` });
        document.body.appendChild(ghost);
        ghosts.push(ghost);
        const delay = i * 35;
        const flight = ghost.animate(
          [
            { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, opacity: 1 },
            { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, opacity: 1, offset: 0.86 },
            { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, opacity: 0 },
          ],
          { duration: LAND_MS + 120, delay, easing: EASE_LAND, fill: "both" },
        );
        flight.onfinish = () => ghost.remove();
        landed = Math.max(landed, delay + LAND_MS);
      });
      const start = landed ? landed - 40 : 120;

      // Lanes appear under the landing clips (instantly hidden behind them), or fade in on their own.
      lanes.forEach((l, i) =>
        l.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: landed ? 1 : 260, delay: landed ? start : i * 40, fill: "backwards",
        }),
      );

      // The playhead crosses once; every mark it reaches brings in its entry.
      const ph = el.querySelector<HTMLElement>(".cle-ph");
      const sweep = ph?.animate(
        [{ left: "0%", opacity: 1 }, { left: "100%", opacity: 1, offset: 0.94 }, { left: "100%", opacity: 0 }],
        { duration: SWEEP_MS + 80, delay: start, easing: "linear", fill: "backwards" },
      );

      const hits: number[] = [];
      el.querySelectorAll<HTMLElement>("[data-cle-row]").forEach((row) => {
        const mark = el.querySelector<HTMLElement>(`[data-cle-mark="${row.dataset.cleRow}"]`);
        const m = mark?.getBoundingClientRect();
        const x = m ? (m.left + m.width / 2 - track.left) / track.width : 0;
        const at = start + SWEEP_MS * Math.min(1, Math.max(0, x));
        hits.push(at);
        row.animate(
          [
            { opacity: 0, transform: "translateX(-10px)", clipPath: "inset(0 100% 0 0)" },
            { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)" },
          ],
          { duration: 360, delay: at, easing: EASE_ROW, fill: "backwards" },
        );
        row.querySelector<HTMLElement>(".cle-hit")?.animate(
          [{ opacity: 0 }, { opacity: 0.2, offset: 0.06 }, { opacity: 0 }],
          { duration: 900, delay: at, easing: "ease-out" },
        );
        mark?.animate(
          [
            { transform: "scaleY(1)", background: "var(--ink)", boxShadow: "0 0 0 0 transparent" },
            { transform: "scaleY(1.35)", background: "#ffffff", boxShadow: "0 0 8px 1px rgba(255,255,255,.55)", offset: 0.12 },
            { transform: "scaleY(1)", background: "var(--ink)", boxShadow: "0 0 0 0 transparent" },
          ],
          { duration: 520, delay: at },
        );
      });
      delete el.dataset.armed;

      // POSITION readout, counting entries as they play.
      // Driven by the playhead's own clock, so the count never runs ahead of it.
      const t0 = performance.now();
      const pad = (n: number) => String(n).padStart(2, "0");
      const tick = () => {
        const t = sweep ? Number(sweep.currentTime ?? Infinity) : performance.now() - t0;
        const played = hits.filter((h) => h <= t).length;
        if (readout.current) readout.current.textContent = `▶ ${pad(played)} / ${pad(hits.length)}`;
        if (t < start + SWEEP_MS + 120) raf = requestAnimationFrame(tick);
        else if (readout.current) readout.current.textContent = `${pad(hits.length)} entries`;
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ghosts.forEach((g) => g.remove());
      el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      delete el.dataset.armed;
    };
  }, [take]); // eslint-disable-line react-hooks/exhaustive-deps

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
                const scene = previewFor(release.version, r.e.text);
                const isOpen = open === r.key;
                const body = (
                  <>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-muted pt-1 flex flex-col gap-1.5">
                      <span className="flex items-baseline gap-2">
                        <span className="w-[7px] h-[7px] shrink-0 self-center" style={{ background: "var(--c)" }} />
                        {r.e.type}
                      </span>
                      {scene && <span className="cle-play">{isOpen ? "■ Close" : "▶ Preview"}</span>}
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
                    {scene ? (
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
                    {isOpen && scene && <PreviewStage scene={scene} id={`pv-${r.mark}`} />}
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
