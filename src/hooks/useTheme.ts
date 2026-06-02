import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "aestra-theme";

const isTheme = (v: unknown): v is Theme => v === "light" || v === "dark";

const getInitialTheme = (): Theme => {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (isTheme(attr)) return attr;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isTheme(stored)) return stored;
    } catch {
      // ignore
    }
    if (typeof window.matchMedia === "function") {
      try {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
      } catch {
        // ignore
      }
    }
  }
  return "dark";
};

// Module-level store — single source of truth across all useTheme() consumers.
let currentTheme: Theme = getInitialTheme();
const listeners = new Set<() => void>();

const applyTheme = (t: Theme) => {
  if (typeof document !== "undefined") {
    if (t === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore
    }
  }
};

const setThemeGlobal = (t: Theme) => {
  if (currentTheme === t) return;
  currentTheme = t;
  applyTheme(t);
  listeners.forEach((l) => l());
};

const toggleThemeGlobal = () => setThemeGlobal(currentTheme === "dark" ? "light" : "dark");

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getSnapshot = (): Theme => currentTheme;
const getServerSnapshot = (): Theme => "dark";

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggleTheme = useCallback(toggleThemeGlobal, []);
  return { theme, setTheme: setThemeGlobal, toggleTheme };
};

// Kept for compatibility with App.tsx side-effect-only call.
export const useThemeEffect = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
};
