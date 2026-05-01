import { useEffect, useRef, useState } from "react";

export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// DAW mockup constants
export const TRACK_HEIGHT = 72;
export const HEADER_WIDTH = 180;
export const RULER_HEIGHT = 32;
export const SNAP_GRID_PX = 20;

// Shared IntersectionObserver — one observer for all FadeIn instances
const observerCallbacks = new Map<Element, (entry: IntersectionObserverEntry) => void>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = observerCallbacks.get(entry.target);
          if (cb) cb(entry);
        });
      },
      { threshold: 0.1 }
    );
  }
  return sharedObserver;
}

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = getSharedObserver();
    observerCallbacks.set(el, (entry) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
        observerCallbacks.delete(el);
      }
    });
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observerCallbacks.delete(el);
    };
  }, [inView]);

  return { ref, inView };
}

// Resolve page from URL path
export function resolvePage(path: string): string {
  const clean = path.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "home";
  const VALID = ["features", "pricing", "changelog", "docs", "download", "login", "account", "privacy", "terms", "about"];
  return VALID.includes(clean) ? clean : "404";
}
