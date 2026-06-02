import React, { memo, useEffect, useRef } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui";

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
      <div className="max-w-md w-full text-center">
        <p className="text-[13px] font-mono text-muted uppercase tracking-wider mb-6">404</p>
        <h1
          ref={headingRef}
          id="not-found-title"
          tabIndex={-1}
          className="display text-5xl sm:text-6xl text-fg mb-4 outline-none"
        >
          Page not found
        </h1>
        <p className="text-muted text-base sm:text-lg leading-relaxed mb-10">
          The page you're looking for doesn't exist, or it was moved.
          Your session is still running — head back to the home page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => setPage("home")} icon={Home}>
            Take me home
          </Button>
          <Button size="lg" variant="secondary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Go back
          </Button>
        </div>
      </div>
    </div>
  );
});
