import React, { memo } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui";

export const NotFound = memo(({ setPage }: { setPage: (p: string) => void }) => (
  <div className="min-h-[80vh] flex items-center justify-center px-5 sm:px-6 py-24">
    <div className="max-w-md w-full text-center">
      <p className="text-[13px] font-mono text-zinc-500 uppercase tracking-wider mb-6">404</p>
      <h1 className="display text-5xl sm:text-6xl text-zinc-50 mb-4">
        Page not found
      </h1>
      <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-10">
        The page you're looking for doesn't exist, or it was moved.
        Your session is still running — head back to the home page.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button size="lg" onClick={() => setPage("home")} icon={Home}>
          Take me home
        </Button>
        <Button size="lg" variant="secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </Button>
      </div>
    </div>
  </div>
));
