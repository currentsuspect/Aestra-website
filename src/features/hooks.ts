import { useEffect, useRef, useState, type RefObject } from "react";

/* Is this element on screen? Used so live visuals only animate while seen. */
export const useVisible = (ref: RefObject<Element | null>, margin = "120px") => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return visible;
};

/* A requestAnimationFrame loop that runs only while `active`. The callback gets the frame
   time and the time since the previous call, in ms. `maxFps` skips frames for visuals that
   don't need 60 (meters, spectrum), which roughly halves their main-thread cost. */
export const useFrame = (cb: (t: number, dt: number) => void, active: boolean, maxFps = 60) => {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (!active) return;
    const minGap = maxFps >= 60 ? 0 : 1000 / maxFps - 2;
    let af = 0;
    let last = 0;
    const tick = (t: number) => {
      af = requestAnimationFrame(tick);
      if (last && t - last < minGap) return;
      saved.current(t, last ? t - last : 16.7);
      last = t;
    };
    af = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(af);
  }, [active, maxFps]);
};

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduced;
};
