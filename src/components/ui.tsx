import React, { memo } from "react";
import { cn, useInView, prefersReducedMotion } from "../lib";
import type { ButtonProps, BadgeProps, CardProps, FeatureCardProps, FadeInProps } from "../types";

/* ── Loading fallback ─────────────────────────────────────────── */
export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex items-center gap-2 text-sm text-muted">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-surface-3 animate-pulse" />
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-surface-3 animate-pulse [animation-delay:120ms]" />
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-surface-3 animate-pulse [animation-delay:240ms]" />
    </div>
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

