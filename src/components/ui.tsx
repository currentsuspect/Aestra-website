import React, { memo } from "react";
import { cn, useInView, prefersReducedMotion } from "../lib";
import type { ButtonProps, BadgeProps, CardProps, FeatureCardProps, FadeInProps } from "../types";

/* ── Loading fallback ─────────────────────────────────────────── */
const prismSpin = `
@keyframes prismSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <style>{prismSpin}</style>
    <svg width="48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ animation: "prismSpin 3s linear infinite" }}>
      <defs>
        <linearGradient id="pf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2840"/><stop offset="50%" stopColor="#1a1830"/><stop offset="100%" stopColor="#12101e"/>
        </linearGradient>
        <linearGradient id="pe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4070"/><stop offset="100%" stopColor="#2a2450"/>
        </linearGradient>
        <linearGradient id="bi" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff20"/><stop offset="100%" stopColor="#ffffff90"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <polygon points="100,28 168,152 32,152" fill="url(#pf)" stroke="url(#pe)" strokeWidth="1.5" strokeLinejoin="round"/>
      <polygon points="100,28 168,152 32,152" fill="none" stroke="#8f82df30" strokeWidth="0.5"/>
      <line x1="10" y1="100" x2="66" y2="100" stroke="url(#bi)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="134" y1="100" x2="170" y2="72" stroke="#ff4a6e" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.9"/>
      <line x1="134" y1="100" x2="178" y2="82" stroke="#ff8a4a" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.85"/>
      <line x1="134" y1="100" x2="186" y2="94" stroke="#ffd04a" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.8"/>
      <line x1="134" y1="100" x2="190" y2="106" stroke="#4aff8a" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.8"/>
      <line x1="134" y1="100" x2="184" y2="118" stroke="#4a9eff" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.85"/>
      <line x1="134" y1="100" x2="174" y2="130" stroke="#8f82df" strokeWidth="2" strokeLinecap="round" filter="url(#glow)" opacity="0.9"/>
      <circle cx="66" cy="100" r="3" fill="#ffffff" opacity="0.6"/>
    </svg>
  </div>
);

/* ── Button ───────────────────────────────────────────────────── */
export const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  className,
  icon: Icon,
  iconPosition = "left",
  type = "button",
  ...props
}: ButtonProps) => {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-fg text-on-accent hover:bg-fg-muted",
    secondary:
      "bg-surface-2 text-fg border border-border hover:bg-surface-3 hover:border-border-2",
    ghost:
      "text-muted hover:text-fg",
    outline:
      "bg-transparent text-fg border border-border hover:bg-surface-2 hover:border-border-2",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-3.5 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-11 px-5 text-[15px] gap-2",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4" aria-hidden="true" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
});

/* ── Badge ────────────────────────────────────────────────────── */
export const Badge = memo(({ children, variant = "default", className }: BadgeProps) => {
  const styles =
    variant === "outline"
      ? "border border-border text-fg-muted bg-surface-2/60"
      : "bg-violet-500/10 border border-violet-500/20 text-violet-400";

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium", styles, className)}>
      {children}
    </span>
  );
});

/* ── Card ─────────────────────────────────────────────────────── */
export const Card = memo(({ children, className }: CardProps) => (
  <div className={cn("rounded-xl bg-bg border border-border/80", className)}>
    {children}
  </div>
));

/* ── FadeIn ───────────────────────────────────────────────────── */
const FADE_IN_STEPS = 6;
export const FadeIn = memo(({ children, className, delay = 0 }: FadeInProps) => {
  const { ref, inView } = useInView();
  // Cap the index so we never produce a nonexistent class (e.g. delay > 0.6).
  // For larger delays, use a continuous inline style instead.
  const step = Math.round(delay * 10);
  const delayClass = step > 0 && step <= FADE_IN_STEPS ? `fade-in-delay-${step}` : "";
  const noMotion = prefersReducedMotion();
  return (
    <div
      ref={ref}
      className={cn(
        "fade-in",
        inView && "visible",
        noMotion && "no-motion",
        delayClass,
        className
      )}
      style={step > FADE_IN_STEPS ? { transitionDelay: `${Math.min(delay, 1.2)}s` } : undefined}
    >
      {children}
    </div>
  );
});

/* ── FeatureCard (home grid) ─────────────────────────────────── */
const colorStyles: Record<string, { dot: string; text: string; bg: string }> = {
  teal:   { dot: "#14b8a6", text: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
  amber:  { dot: "#f59e0b", text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  purple: { dot: "#8b5cf6", text: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  blue:   { dot: "#3b82f6", text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  green:  { dot: "#22c55e", text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  coral:  { dot: "#f43f5e", text: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export const FeatureCard = memo(({ label, title, description, visual, color = "blue", delay }: FeatureCardProps) => {
  const c = colorStyles[color] || colorStyles.blue;
  return (
    <FadeIn delay={delay}>
      <div className="rounded-xl bg-bg border border-border/80 p-5 sm:p-6 hover:border-border-2 transition-colors h-full flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <span className={cn("text-xs font-medium", c.text)}>{label}</span>
          <span className={cn("h-1.5 w-1.5 rounded-full", c.bg)} aria-hidden="true" />
        </div>
        <div className="h-20 mb-5" aria-hidden="true">{visual}</div>
        <h3 className="text-[15px] font-semibold text-fg mb-1.5 tracking-tight">{title}</h3>
        <p className="text-[13.5px] text-muted leading-relaxed">{description}</p>
      </div>
    </FadeIn>
  );
});

