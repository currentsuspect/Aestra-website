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
  | "404";

export const VALID_PAGES: PageId[] = [
  "features", "pricing", "changelog", "docs",
  "download", "login", "account", "privacy", "terms",
];

export const PAGE_TITLES: Record<string, string> = {
  home: "Aestra — Create, anything, anywhere.",
  features: "Features — Aestra",
  pricing: "Pricing — Aestra",
  changelog: "Changelog — Aestra",
  docs: "Documentation — Aestra",
  download: "Download — Aestra",
  login: "Login — Aestra",
  account: "Account — Aestra",
  privacy: "Privacy Policy — Aestra",
  terms: "Terms of Service — Aestra",
  "404": "Not Found — Aestra",
};
