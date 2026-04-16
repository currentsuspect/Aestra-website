import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import type { LucideIcon } from "lucide-react";
import { cn, useInView } from "../lib";

// --- Loading fallback ---
export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex items-center gap-3 text-[#9ca5bb]">
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
}: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[12px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#61d5ff]/35 disabled:opacity-50 disabled:cursor-not-allowed border";

  const variants = {
    primary: "border-[#7f75cf] bg-[linear-gradient(180deg,#8f82df,#7164bf)] text-white shadow-[0_0_24px_rgba(143,130,223,0.28)] hover:brightness-110",
    secondary: "border-[#3a4152] bg-[#1a1f2b] text-[#e8ebf5] hover:border-[#61d5ff]/45 hover:text-white",
    ghost: "border-transparent text-[#98a1b7] hover:text-white hover:bg-white/5",
    outline: "border-[#4f5668] bg-[#131722] text-[#cfd5e4] hover:border-[#61d5ff]/45 hover:text-white"
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
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
export const Badge = memo(({ children, variant = "default", className }: any) => {
  const styles = variant === "outline"
    ? "border border-[#61d5ff]/30 text-[#bcefff] bg-[#61d5ff]/8"
    : "bg-[#8f82df] text-white";

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles, className)}>
      {variant === "outline" && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mr-2 animate-pulse" />}
      {children}
    </span>
  );
});


// --- Card ---
export const Card = memo(({ children, className }: any) => (
  <div className={cn("section-frame panel-glow rounded-[18px] overflow-hidden", className)}>
    {children}
  </div>
));

// --- Sections ---


// --- FadeIn (replaces motion.div) ---
export const FadeIn = memo(({ children, className, delay = 0, once = true }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) => {
  const { ref, inView } = useInView();
  const delayClass = delay > 0 ? `fade-in-delay-${Math.round(delay * 10)}` : "";
  return (
    <div ref={ref} className={cn("fade-in", inView && "visible", delayClass, className)}>
      {children}
    </div>
  );
});


// --- FeatureCard ---
const colorStyles: Record<string, { label: string; border: string; hoverBg: string }> = {
  teal:   { label: "text-[#1db4a6]", border: "border-transparent hover:border-[#1db4a6]" },
  amber:  { label: "text-[#e8a230]", border: "border-transparent hover:border-[#e8a230]" },
  purple: { label: "text-[#8b7de8]", border: "border-transparent hover:border-[#8b7de8]" },
  blue:   { label: "text-[#4a9eff]", border: "border-transparent hover:border-[#4a9eff]" },
  green:  { label: "text-[#4caf6e]", border: "border-transparent hover:border-[#4caf6e]" },
  coral:  { label: "text-[#e06a4e]", border: "border-transparent hover:border-[#e06a4e]" },
};

export const FeatureCard = memo(({ label, title, description, visual, color = "blue", delay }: any) => {
  const c = colorStyles[color] || colorStyles.blue;
  return (
    <FadeIn delay={delay}>
      <div
        className={cn(
          "bg-[#131620] border rounded-[16px] p-6 transition-all duration-200 hover:-translate-y-0.5 group relative overflow-hidden",
          c.border
        )}
      >
        <div className={cn("text-[10px] tracking-[0.12em] uppercase font-medium mb-4", c.label)}>{label}</div>
        <div className="h-16 mb-5">{visual}</div>
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-[13px] text-[#7a8099] leading-relaxed">{description}</p>
      </div>
    </FadeIn>
  );
});

