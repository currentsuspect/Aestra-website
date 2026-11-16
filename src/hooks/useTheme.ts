import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, FAMILIES, SWATCH, type FamilyId, type ResolvedMode } from "../theme/themes";

/* The site wears the app's themes: a family (Ember, Obsidian Moss, Solace,
   Monolith) in a mode (dark, light, high contrast, or the system's choice).
   The choice is stored as "<family>-<mode>" under STORAGE_KEY; the inline
   script in index.html reads the same key before first paint and sets
   <html data-theme="<family>-<resolved mode>">. Without a stored choice
   there is no attribute and :root carries the default theme. */

export type Mode = ResolvedMode | "system";
export type ThemeChoice = { family: FamilyId; mode: Mode };

export const STORAGE_KEY = "aestra-theme";
const MODES: Mode[] = ["dark", "light", "hc", "system"];
const FAMILY_IDS = FAMILIES.map((f) => f.id) as FamilyId[];

const split = (id: string): ThemeChoice | null => {
  const m = /^([a-z-]+)-(dark|light|hc|system)$/.exec(id);
  if (!m || !FAMILY_IDS.includes(m[1] as FamilyId)) return null;
  return { family: m[1] as FamilyId, mode: m[2] as Mode };
};

export const DEFAULT_CHOICE: ThemeChoice = split(DEFAULT_THEME)!;

const systemLight = () => {
  try {
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches;
  } catch {
    return false;
  }
};

export const resolve = (c: ThemeChoice): string =>
  `${c.family}-${c.mode === "system" ? (systemLight() ? "light" : "dark") : c.mode}`;

const read = (): ThemeChoice => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const c = stored ? split(stored) : null;
    if (c && MODES.includes(c.mode)) return c;
  } catch {
    // storage blocked: fall through to the default
  }
  return DEFAULT_CHOICE;
};

let current: ThemeChoice = typeof window === "undefined" ? DEFAULT_CHOICE : read();
const listeners = new Set<() => void>();

const apply = (c: ThemeChoice) => {
  if (typeof document === "undefined") return;
  const id = resolve(c);
  document.documentElement.setAttribute("data-theme", id);
  const meta = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  meta.forEach((m) => m.setAttribute("content", SWATCH[id]?.bg ?? ""));
};

export const setTheme = (next: Partial<ThemeChoice>) => {
  const c = { ...current, ...next };
  if (c.family === current.family && c.mode === current.mode) return;
  current = c;
  apply(c);
  try {
    window.localStorage.setItem(STORAGE_KEY, `${c.family}-${c.mode}`);
  } catch {
    // not remembered, still applied
  }
  listeners.forEach((l) => l());
};

/* Follow the system while the choice is "system". */
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  try {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
      if (current.mode === "system") {
        current = { ...current };
        apply(current);
        listeners.forEach((l) => l());
      }
    });
  } catch {
    // older browsers: the choice still applies on the next load
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => current;
const getServerSnapshot = () => DEFAULT_CHOICE;

export const useTheme = () => {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { choice, resolved: resolve(choice), setTheme };
};
