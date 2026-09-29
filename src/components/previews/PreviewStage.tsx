import React, { memo, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { W, H, D, type Scene } from "./kit";

/* ── PreviewStage ────────────────────────────────────────────────────
   Plays one changelog scene: it runs while on screen, holds on its last
   frame, then loops. Reduced motion gets the scene's still frame. */

const HOLD = 1.6;

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const PreviewStage = memo(({ scene, id }: { scene: Scene; id: string }) => {
  const still = reduced();
  const [t, setT] = useState(() => (still ? scene.still ?? scene.dur : 0));
  const box = useRef<HTMLDivElement>(null);
  const origin = useRef(0);

  useEffect(() => {
    if (still) return;
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
    <div ref={box} className="pvs" id={id}>
      <div className="pvs-bar">
        <span className="pvs-title">Preview · {scene.title}</span>
        <span className="pvs-note">Illustration</span>
        {!still && (
          <button type="button" className="pvs-replay" onClick={replay} aria-label="Replay preview">
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
          </button>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="pvs-svg" role="img" aria-label={`Animated illustration: ${scene.title}`}
        style={{ background: D.bed }}>
        {scene.draw(t)}
      </svg>
      <div className="pvs-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${still ? 1 : t / scene.dur})` }} />
      </div>
    </div>
  );
});
