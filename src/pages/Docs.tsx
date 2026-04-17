import React from "react";
import { ArrowRight, Keyboard } from "lucide-react";
import { Button } from "../components/ui";

export const Docs = ({ setPage }: any) => {
  return (
    <main id="main-content" className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto min-h-screen">
      <button onClick={() => setPage("home")} className="text-[#98a1b7] hover:text-white mb-6 sm:mb-8 flex items-center text-sm">
        <ArrowRight className="rotate-180 mr-2 w-4 h-4" /> Back to Home
      </button>

      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="text-[11px] tracking-[0.14em] uppercase text-[#3a3f55] mb-5 font-medium">Documentation</div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-5 leading-[1.05] tracking-[-2px]">
          Learn the DAW.
          <br />
          <span className="text-[#8b7de8]">Skip the nonsense.</span>
        </h1>
        <p className="text-[#5a6080] text-base sm:text-lg leading-7 max-w-[32rem]">
          Aestra is a DAW that gets out of your way. Fast startup, low memory, no bloat — built for producers who want to make music, not manage software.
        </p>
      </div>

      <section className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div className="section-frame panel-glow rounded-[16px] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3 text-[#8b7de8] text-[10px] uppercase tracking-[0.14em] font-semibold">
            <Keyboard className="w-4 h-4" />
            Keyboard
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ctrl + K</h2>
          <p className="text-[#98a1b7] leading-relaxed mb-4">
            Open command palette. Search anything. Jump anywhere. It’s the fastest way to move through the app on Linux and Windows.
          </p>
          <Button variant="secondary" onClick={() => setPage("features")} className="w-full sm:w-auto">See Features</Button>
        </div>

        <div className="section-frame panel-glow rounded-[16px] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3 text-[#e8a230] text-[10px] uppercase tracking-[0.14em] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#e8a230]" />
            Philosophy
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Clear decisions, not clever clutter.</h2>
          <p className="text-[#98a1b7] leading-relaxed mb-4">
            The app should explain itself in motion — one path, one job, no hidden friction.
          </p>
          <Button variant="secondary" onClick={() => setPage("pricing")} className="w-full sm:w-auto">See Pricing</Button>
        </div>
      </section>
    </main>
  );
};
