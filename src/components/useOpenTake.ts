import { useLayoutEffect, type RefObject } from "react";

/* ── useOpenTake ─────────────────────────────────────────────────────
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

export const useOpenTake = (
  root: RefObject<HTMLElement | null>,
  readout: RefObject<HTMLElement | null>,
  arrangement: RefObject<HTMLElement | null>,
  version: string,
  take: Take,
) => {
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
          `.clx-clip[data-clx-v="${version}"][data-clx-lane="${target.dataset.cleLane}"]`,
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
};
