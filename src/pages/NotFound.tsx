import React, { memo, useEffect, useRef } from "react";
import { ArrowLeft, Home, FileQuestion, BookOpen, Layers, Workflow, Cpu } from "lucide-react";
import { Button } from "../components/ui";

const QUICK_LINKS: { label: string; page: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Features",  page: "features",  Icon: Workflow },
  { label: "Pricing",   page: "pricing",   Icon: Layers },
  { label: "Docs",      page: "docs",      Icon: BookOpen },
  { label: "Changelog", page: "changelog", Icon: Cpu },
];

export const NotFound = memo(({ setPage }: { setPage: (p: string) => void }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = "404 — Aestra";
    headingRef.current?.focus();
    return () => { document.title = prev; };
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      setPage("home");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 sm:px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mx-auto mb-10 w-32 h-32 sm:w-40 sm:h-40" aria-hidden="true">
          <div className="absolute inset-0 rounded-2xl border border-border/80 bg-bg flex items-center justify-center">
            <FileQuestion className="w-12 h-12 sm:w-14 sm:h-14 text-muted" strokeWidth={1.25} />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-mono text-rose-300 text-sm font-semibold">
            404
          </div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
        </div>

        <p className="text-[13px] font-mono text-muted uppercase tracking-wider mb-4">
          Lost in the mix
        </p>
        <h1
          ref={headingRef}
          id="not-found-title"
          tabIndex={-1}
          className="display text-5xl sm:text-6xl text-fg mb-5 outline-none"
        >
          Page not found.
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist, or it was moved.
          Your session is still running — head back to the home page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Button size="lg" onClick={() => setPage("home")} icon={Home}>
            Take me home
          </Button>
          <Button size="lg" variant="secondary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Go back
          </Button>
        </div>

        <div>
          <p className="text-[12px] font-mono text-muted uppercase tracking-wider mb-4">
            Or jump to
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_LINKS.map((l) => {
              const Icon = l.Icon;
              return (
                <button
                  key={l.page}
                  onClick={() => setPage(l.page)}
                  className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg border border-border bg-bg text-fg text-[13px] hover:bg-surface-2 hover:border-border-2 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
