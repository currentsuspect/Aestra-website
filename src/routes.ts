// One loader per lazily-loaded page. App.tsx wraps these in React.lazy and
// prefetch.ts calls the same functions early, so a page's chunk is fetched
// once and shared between "about to navigate" and "navigating".
export const routeLoaders = {
  features: () => import("./pages/Features"),
  download: () => import("./pages/Downloads"),
  pricing: () => import("./pages/Pricing"),
  changelog: () => import("./pages/Changelog"),
  docs: () => import("./pages/Docs"),
  privacy: () => import("./pages/Privacy"),
  terms: () => import("./pages/Terms"),
  about: () => import("./pages/About"),
  roadmap: () => import("./pages/Roadmap"),
  plugins: () => import("./pages/Plugins"),
  recovery: () => import("./pages/Recovery"),
} as const;

export type RoutePath = keyof typeof routeLoaders;
