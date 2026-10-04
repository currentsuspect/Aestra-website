import React, { memo } from "react";
import { cn, useInView, prefersReducedMotion } from "../lib";
import type { ButtonProps, BadgeProps, CardProps, FeatureCardProps, FadeInProps } from "../types";

/* ── Loading fallback ───────────────────────────────────────────
   The Aestra mark, animated the way the logo sting draws it (aestra-studio,
   src/templates/LogoSting.tsx): a hairline outline draws on, the violet floods
   in, a light travels along the cut, and the shard slides into the gap. The
   geometry is the sting's own traced path, and the beats keep its timing
   (outline 0.3-1.1s, fill 0.9-1.3s, cut light 1.25-1.7s, shard 1.45s), run about
   1.6x faster and looped with a short rest, because a loading screen is only seen
   for a moment. Reduced motion shows the finished mark. */
const MAIN = "M270.4 106.5 L313.2 240.2 L390.5 251.6 C231.7 310.9 284.0 279.1 151.0 403.2 L191.2 289.8 L120.8 252.2 L214.0 239.2 Z";
const SHARD = "M304.6 306.2 L276.0 328.0 L345.2 403.4 Z";
const CUT = "M390.5 251.6 C231.7 310.9 284.0 279.1 151.0 403.2";

const loaderCss = `
.ald-outline { stroke-dasharray: 1 1; stroke-dashoffset: 0; opacity: 0.12; }
.ald-fill { opacity: 1; }
.ald-shard { opacity: 1; }
.ald-cut { opacity: 0; stroke-dasharray: 0.18 1; stroke-dashoffset: 0.18; }
@media (prefers-reduced-motion: no-preference) {
  .ald-mark { transform-box: fill-box; transform-origin: center; animation: ald-settle 2s ease-in-out infinite; }
  .ald-outline { animation: ald-outline 2s cubic-bezier(.65,0,.35,1) infinite; }
  .ald-fill { animation: ald-fill 2s ease-in-out infinite; }
  .ald-shard { animation: ald-shard 2s cubic-bezier(.22,.8,.3,1) infinite; }
  .ald-cut { animation: ald-cut 2s cubic-bezier(.65,0,.35,1) infinite; }
}
@keyframes ald-outline { 0% { stroke-dashoffset: 1; opacity: 1; } 25% { stroke-dashoffset: 0; opacity: 1; } 31% { stroke-dashoffset: 0; opacity: .12; } 76% { stroke-dashoffset: 0; opacity: .12; } 90% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }
@keyframes ald-fill { 0%, 19% { opacity: 0; } 31% { opacity: 1; } 76% { opacity: 1; } 90%, 100% { opacity: 0; } }
@keyframes ald-shard { 0%, 34% { opacity: 0; transform: translate(26px, 30px); } 50% { opacity: 1; transform: translate(0, 0); } 76% { opacity: 1; transform: translate(0, 0); } 90%, 100% { opacity: 0; transform: translate(0, 0); } }
@keyframes ald-cut { 0%, 28% { opacity: 0; stroke-dashoffset: .18; } 30% { opacity: 1; stroke-dashoffset: .18; } 46% { opacity: 1; stroke-dashoffset: -.82; } 55%, 100% { opacity: 0; stroke-dashoffset: -.82; } }
@keyframes ald-settle { 0%, 30% { transform: scale(1); } 80%, 100% { transform: scale(1.03); } }
`;

export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh] text-fg" role="status" aria-live="polite">
    <style>{loaderCss}</style>
    <span className="sr-only">Loading</span>
    <svg width="56" height="61" viewBox="104 90 304 330" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <filter id="ald-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <g className="ald-mark">
        <path className="ald-outline" d={MAIN} pathLength={1} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path className="ald-fill" d={MAIN} fill="#7B53E8" stroke="#7B53E8" strokeWidth="1" strokeLinejoin="round" />
        <path className="ald-shard" d={SHARD} fill="#7B53E8" stroke="#7B53E8" strokeWidth="1" strokeLinejoin="round" />
        <g>
          <path className="ald-cut" d={CUT} pathLength={1} fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" filter="url(#ald-glow)" />
          <path className="ald-cut" d={CUT} pathLength={1} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
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
      : "bg-accent/10 border border-accent/20 text-accent";

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium", styles, className)}>
      {children}
    </span>
  );
});

/* ── Card ─────────────────────────────────────────────────────── */
export const Card = memo(({ children, className }: CardProps) => (
  <div className={cn("rounded-xl bg-bg border border-border/80 panel-sheen", className)}>
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

/* ── FeatureCard (home grid) ───────────────────────────────────
   Deliberately monochrome. These cards previously carried one hue
   each (teal/amber/purple/blue/green/coral) which made the grid read
   as a colour swatch rather than a rack of modules. The only colour
   that survives is the accent inside each visual, where it stands
   for signal. Index numbers do the differentiating work instead. ── */
export const FeatureCard = memo(({ label, title, description, visual, index, delay }: FeatureCardProps) => (
  <FadeIn delay={delay}>
    <div className="rounded-xl bg-bg border border-border/80 panel-sheen p-5 sm:p-6 hover:border-border-2 transition-colors h-full flex flex-col">
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{label}</span>
        {index !== undefined && (
          <span className="font-mono text-[10px] text-faint tabular-nums" aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <div className="h-20 mb-5" aria-hidden="true">{visual}</div>
      <h3 className="text-[15px] font-semibold text-fg mb-1.5 tracking-tight">{title}</h3>
      <p className="text-[13.5px] text-muted leading-relaxed">{description}</p>
    </div>
  </FadeIn>
));

