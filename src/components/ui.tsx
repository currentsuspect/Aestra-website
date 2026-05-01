import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import type { LucideIcon } from "lucide-react";
import { cn, useInView } from "../lib";
import type { ButtonProps, BadgeProps, CardProps, FeatureCardProps, FadeInProps } from "../types";

// --- Loading fallback ---
export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex items-center gap-3 text-[#98a1b7]">
      <div className="w-2 h-2 rounded-full bg-[#61d5ff] animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 rounded-full bg-[#61d5ff] animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 rounded-full bg-[#61d5ff] animate-bounce" style={{ animationDelay: "300ms" }} />
      <span className="text-sm ml-2">Loading...</span>
    </div>
  </div>
);


// --- Button ---
export const Button = memo(({
  children,
  variant = "primary",
  size = "md",
  className,
  icon: Icon,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[12px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#61d5ff]/35 disabled:opacity-50 disabled:cursor-not-allowed border";

  const variants = {
    primary: "border-[#6d28d9] bg-[linear-gradient(180deg,#7c3aed,#6d28d9)] text-white shadow-[0_0_24px_rgba(124,58,237,0.28)] hover:brightness-110",
    secondary: "border-[#3a4152] bg-[#1a1f2b] text-[#e8ebf5] hover:border-[#61d5ff]/45 hover:text-white",
    ghost: "border-transparent text-[#98a1b7] hover:text-white hover:bg-white/5",
    outline: "border-[#4f5668] bg-[#131722] text-[#cfd5e4] hover:border-[#61d5ff]/45 hover:text-white"
  };

  const sizes = {
    sm: "h-9 sm:h-9 px-3 text-xs min-h-[44px] sm:min-h-[36px]",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-7 text-sm",
    icon: "h-10 w-10 p-0"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className={cn("w-4 h-4", children ? "mr-2" : "")} />}
      {children}
    </button>
  );
});


// --- Badge ---
export const Badge = memo(({ children, variant = "default", className }: BadgeProps) => {
  const styles = variant === "outline"
    ? "border border-[#00e5cc]/30 text-[#bcefff] bg-[#00e5cc]/8"
    : "bg-[#7c3aed] text-white";

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles, className)}>
      {variant === "outline" && <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] mr-2 animate-pulse" />}
      {children}
    </span>
  );
});


// --- Card ---
export const Card = memo(({ children, className }: CardProps) => (
  <div className={cn("section-frame panel-glow rounded-[16px] overflow-hidden", className)}>
    {children}
  </div>
));


// --- FadeIn (shared IntersectionObserver) ---
export const FadeIn = memo(({ children, className, delay = 0 }: FadeInProps) => {
  const { ref, inView } = useInView();
  const delayClass = delay > 0 ? `fade-in-delay-${Math.round(delay * 10)}` : "";
  return (
    <div ref={ref} className={cn("fade-in", inView && "visible", delayClass, className)}>
      {children}
    </div>
  );
});


// --- FeatureCard ---
const colorStyles: Record<string, { label: string; border: string }> = {
  teal:   { label: "text-[#00e5cc]", border: "border-transparent hover:border-[#00e5cc]" },
  amber:  { label: "text-[#e8a838]", border: "border-transparent hover:border-[#e8a838]" },
  purple: { label: "text-[#7c3aed]", border: "border-transparent hover:border-[#7c3aed]" },
  blue:   { label: "text-[#9257ff]", border: "border-transparent hover:border-[#9257ff]" },
  green:  { label: "text-[#3dbb6e]", border: "border-transparent hover:border-[#3dbb6e]" },
  coral:  { label: "text-[#e85454]", border: "border-transparent hover:border-[#e85454]" },
};

export const FeatureCard = memo(({ label, title, description, visual, color = "blue", delay }: FeatureCardProps) => {
  const c = colorStyles[color] || colorStyles.blue;
  return (
    <FadeIn delay={delay}>
      <div
        className={cn(
          "bg-[#131620] border rounded-[16px] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 group relative overflow-hidden",
          c.border
        )}
      >
        <div className={cn("text-[10px] tracking-[0.12em] uppercase font-medium mb-4", c.label)}>{label}</div>
        <div className="h-16 mb-5">{visual}</div>
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-[13px] text-[#98a1b7] leading-relaxed">{description}</p>
      </div>
    </FadeIn>
  );
});
