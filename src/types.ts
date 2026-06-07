export interface PageProps {
  setPage: (page: string) => void;
  topOffset?: number;
  onEarlyAccess?: () => void;
}

export interface NavbarProps extends PageProps {
  activePage: string;
  topOffset?: number;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: "left" | "right";
}

export interface FeatureCardProps {
  label: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  color?: "teal" | "amber" | "purple" | "blue" | "green" | "coral";
  delay?: number;
}

export interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export type PageId =
  | "home"
  | "features"
  | "pricing"
  | "changelog"
  | "docs"
  | "download"
  | "login"
  | "account"
  | "privacy"
  | "terms"
  | "about"
  | "roadmap"
  | "404";

type SEOConstants = Record<PageId, string>;

const asSEO = <T extends SEOConstants>(c: T): T => c;

export const PAGE_PATHS = asSEO({
  home: "/",
  features: "/features",
  pricing: "/pricing",
  changelog: "/changelog",
  docs: "/docs",
  download: "/download",
  login: "/login",
  account: "/account",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  roadmap: "/roadmap",
  "404": "/404",
});

export const PAGE_TITLES = asSEO({
  home: "Aestra — Make music, not excuses.",
  features: "Features — Aestra",
  pricing: "Pricing — Aestra",
  changelog: "Changelog — Aestra",
  docs: "Documentation — Aestra",
  download: "Download — Aestra",
  login: "Login — Aestra",
  account: "Account — Aestra",
  privacy: "Privacy Policy — Aestra",
  terms: "Terms of Service — Aestra",
  about: "About — Aestra",
  roadmap: "Roadmap — Aestra",
  "404": "Not Found — Aestra",
});

export const PAGE_DESCRIPTIONS = asSEO({
  home: "Aestra is an accessible, premium native digital audio workstation built around speed, stability, and producer-first workflow. Make music, not excuses.",
  features: "Explore Aestra's core features: native performance, instant startup, pattern-first workflow, visual routing, audition mode, and version control.",
  pricing: "Aestra pricing: free core DAW, Supporter tier at $5/month, and Founder Gold Card at $129 one-time. Open access, no feature gates.",
  changelog: "Track Aestra's development progress. New features, bug fixes, and improvements across every release.",
  docs: "Aestra documentation: patch recipes, signal flow guides, persona tracks, troubleshooting, and command palette reference.",
  download: "Download Aestra DAW for Windows, macOS, and Linux. Free core, no strings attached.",
  login: "Sign in to your Aestra account.",
  account: "Manage your Aestra account, licenses, and plugins.",
  privacy: "Aestra privacy policy: how we handle your data, no cookies, transparent practices.",
  terms: "Aestra terms of service: ASSAL v1.1 license, your music is yours, Supporter and Founder tier details.",
  about: "About Aestra Studios: building a native DAW for producers who want flow, not friction.",
  roadmap: "Aestra's public roadmap. What's shipped, what's in progress, what we're targeting next, and what's on the radar.",
  "404": "Page not found — Aestra",
});

export const PAGE_KEYWORDS = asSEO({
  home: "DAW, digital audio workstation, free DAW, music production software, native DAW, producer workflow, VST3, CLAP, beat making, mixing, recording, Aestra",
  features: "DAW features, native audio engine, pattern workflow, signal routing, audition mode, version control, music production tools",
  pricing: "DAW pricing, free DAW, music software subscription, lifetime license, founder edition, supporter tier",
  changelog: "DAW changelog, release notes, Aestra updates, music software updates, version history",
  docs: "Aestra documentation, signal flow, patch recipes, command palette, troubleshooting, getting started",
  download: "download Aestra, free DAW download, Windows DAW, macOS DAW, Linux DAW, native audio workstation",
  login: "Aestra login, sign in, Aestra account",
  account: "Aestra account, manage subscription, license keys, plugins",
  privacy: "Aestra privacy policy, data handling, no telemetry, transparent practices",
  terms: "Aestra terms of service, ASSAL license, source available, your music is yours",
  about: "about Aestra Studios, Dylan Makori, founder, mission, Aestra team",
  roadmap: "Aestra roadmap, Aestra public roadmap, upcoming features, DAW development, what we're building",
  "404": "page not found, 404, Aestra",
});

export const PAGE_OG_TYPES = asSEO({
  home: "website",
  features: "website",
  pricing: "product",
  changelog: "article",
  docs: "article",
  download: "website",
  login: "website",
  account: "website",
  privacy: "article",
  terms: "article",
  about: "profile",
  roadmap: "article",
  "404": "website",
});

export const PAGE_OG_IMAGES = asSEO({
  home: "/og-image.png",
  features: "/og-image.png",
  pricing: "/og-image.png",
  changelog: "/og-image.png",
  docs: "/og-image.png",
  download: "/og-image.png",
  login: "/og-image.png",
  account: "/og-image.png",
  privacy: "/og-image.png",
  terms: "/og-image.png",
  about: "/og-image.png",
  roadmap: "/og-image.png",
  "404": "/og-image.png",
});

export const PAGE_ROBOTS = asSEO({
  home: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  features: "index, follow, max-snippet:-1, max-image-preview:large",
  pricing: "index, follow, max-snippet:-1",
  changelog: "index, follow, max-snippet:-1, max-image-preview:large",
  docs: "index, follow, max-snippet:-1",
  download: "index, follow",
  login: "noindex, nofollow",
  account: "noindex, nofollow",
  privacy: "index, follow, max-snippet:-1",
  terms: "index, follow, max-snippet:-1",
  about: "index, follow",
  roadmap: "index, follow, max-snippet:-1",
  "404": "noindex, nofollow",
});

export const PAGE_SECTION_TITLES = asSEO({
  home: "Home",
  features: "Features",
  pricing: "Pricing",
  changelog: "Changelog",
  docs: "Documentation",
  download: "Download",
  login: "Login",
  account: "Account",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  about: "About",
  roadmap: "Roadmap",
  "404": "Not Found",
});
