export interface PageProps {
  setPage: (page: string) => void;
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
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
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
  once?: boolean;
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
  | "404";

export const VALID_PAGES: PageId[] = [
  "features", "pricing", "changelog", "docs",
  "download", "login", "account", "privacy", "terms", "about",
];

export const PAGE_TITLES: Record<string, string> = {
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
  "404": "Not Found — Aestra",
};

export const PAGE_DESCRIPTIONS: Record<string, string> = {
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
  "404": "Page not found — Aestra",
};
