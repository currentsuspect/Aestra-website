import { useEffect, useRef, useState } from "react";

export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// DAW mockup constants
export const TRACK_HEIGHT = 72;
export const HEADER_WIDTH = 180;
export const RULER_HEIGHT = 32;
export const SNAP_GRID_PX = 20;

// Shared IntersectionObserver — one observer for all useInView instances.
// Per-key options are tracked so different configs (different rootMargin,
// thresholds) still share an observer with the union of options.
type ObserverOptions = IntersectionObserverInit;
const observers = new Map<string, { obs: IntersectionObserver; cbs: Map<Element, (entry: IntersectionObserverEntry) => void> }>();
const optionsKey = (o?: ObserverOptions) =>
  `${o?.rootMargin ?? "0px"}|${(o?.threshold as number[] | number | undefined) ?? "0.1"}`;

function getSharedObserver(options?: ObserverOptions) {
  const key = optionsKey(options);
  let entry = observers.get(key);
  if (!entry) {
    const cbs = new Map<Element, (entry: IntersectionObserverEntry) => void>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = cbs.get(entry.target);
          if (cb) cb(entry);
        });
      },
      { threshold: 0.1, ...(options || {}) }
    );
    entry = { obs, cbs };
    observers.set(key, entry);
  }
  return entry;
}

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const { obs, cbs } = getSharedObserver(options);
    cbs.set(el, (entry) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.unobserve(el);
        cbs.delete(el);
      }
    });
    obs.observe(el);

    return () => {
      obs.unobserve(el);
      cbs.delete(el);
    };
  }, [inView, options]);

  return { ref, inView };
}

// Resolve page from URL path
const VALID_PAGES = new Set([
  "features", "pricing", "changelog", "docs", "download",
  "login", "account", "privacy", "terms", "about",
]);

export const resolvePage = (path: string): string => {
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "home";
  return VALID_PAGES.has(clean) ? clean : "404";
};

// prefers-reduced-motion helper. Resolved once at module load because the
// user value rarely changes during a session, and React.useState/useEffect
// would cause a flash of motion for the first frame.
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};
