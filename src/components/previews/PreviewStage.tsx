import React, { memo, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { D } from "../mock/emberSession";
import type { Scene } from "./kit";
import { loadPreview } from ".";
import { W, H } from "./size";

/* ── PreviewStage ────────────────────────────────────────────────────
   Plays one changelog scene: it runs while on screen, holds on its last
   frame, then loops. Reduced motion gets the scene's still frame. */

const HOLD = 1.6;

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Plays `scene`; until it has loaded, holds the same box so opening a row never shifts the page. */
const PlayScene = memo(({ scene, id }: { scene?: Scene; id: string }) => {
  const still = reduced();
  const [t, setT] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const origin = useRef(0);

  useEffect(() => {
    if (!scene) return;
    if (still) { setT(scene.still ?? scene.dur); return; }
    let raf = 0;
    let running = false;
    let elapsed = 0;
    const loop = (now: number) => {
      const s = ((now - origin.current) / 1000) % (scene.dur + HOLD);
      elapsed = s;
      setT(Math.min(s, scene.dur));
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      origin.current = performance.now() - elapsed * 1000;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.2 });
    if (box.current) io.observe(box.current);
    return () => { stop(); io.disconnect(); };
  }, [scene, still]);

  const replay = () => { origin.current = performance.now(); setT(0); };

  return (
    <div ref={box} className="pvs" id={id} aria-busy={scene ? undefined : true}>
      <div className="pvs-bar">
        <span className="pvs-title">Preview{scene ? ` · ${scene.title}` : ""}</span>
        <span className="pvs-note">Illustration</span>
        {scene && !still && (
          <button type="button" className="pvs-replay" onClick={replay} aria-label="Replay preview">
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
          </button>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="pvs-svg" role={scene ? "img" : undefined} aria-hidden={scene ? undefined : true}
        aria-label={scene ? `Animated illustration: ${scene.title}` : undefined} style={{ background: D.bed }}>
        {scene?.draw(t)}
      </svg>
      <div className="pvs-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${scene ? (still ? 1 : t / scene.dur) : 0})` }} />
      </div>
    </div>
  );
});

/** The stage for one changelog entry: opens at once, and plays when the scene's code has arrived. */
export const EntryPreview = ({ version, text, id }: { version: string; text: string; id: string }) => {
  const [scene, setScene] = useState<Scene>();
  useEffect(() => {
    let live = true;
    loadPreview(version, text).then((s) => live && setScene(s)).catch(() => {});
    return () => { live = false; };
  }, [version, text]);
  return <PlayScene scene={scene} id={id} />;
};
