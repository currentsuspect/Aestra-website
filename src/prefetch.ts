import { routeLoaders, type RoutePath } from "./routes";

// Fetch a page's chunk when someone is about to click, so the click feels
// instant. Delegated on the document: no per-link wiring, nothing for the
// nav or footer to know about.

const seen = new Set<string>();

function prefetch(path: string): void {
  const key = path.replace(/^\/+|\/+$/g, "") as RoutePath;
  if (seen.has(key) || !(key in routeLoaders)) return;
  seen.add(key);
  // A failed prefetch must never surface: the real navigation retries it.
  routeLoaders[key]().catch(() => seen.delete(key));
}

function sameOriginPath(target: EventTarget | null): string | null {
  const a = (target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || a.origin !== location.origin || a.target === "_blank") return null;
  return a.pathname;
}

function saveData(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ""));
}

export function installPrefetch(): void {
  if (saveData()) return;
  const onIntent = (e: Event) => {
    const p = sameOriginPath(e.target);
    if (p) prefetch(p);
  };
  document.addEventListener("pointerover", onIntent, { passive: true });
  document.addEventListener("focusin", onIntent, { passive: true });
  document.addEventListener("touchstart", onIntent, { passive: true });

  // After the page has settled, quietly warm the two places most visitors go
  // next. Idle time only; never competes with the first paint.
  const warm = () => ["/features", "/download"].forEach(prefetch);
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
  if (ric) ric(warm, { timeout: 4000 });
  else setTimeout(warm, 2500);
}
