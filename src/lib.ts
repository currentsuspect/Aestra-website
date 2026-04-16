import { useEffect, useRef, useState } from "react";

export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// DAW mockup constants
export const TRACK_HEIGHT = 72;
export const HEADER_WIDTH = 180;
export const RULER_HEIGHT = 32;
export const SNAP_GRID_PX = 20;

// Intersection Observer hook — replaces framer-motion's whileInView
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
