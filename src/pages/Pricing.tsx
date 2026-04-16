import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { Star, CreditCard, Check, ArrowRight, Shield } from "lucide-react";
import { cn } from "../lib";
import { Button, Card } from "../components/ui";

export const Pricing = ({ setPage }: any) => {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Free forever. Support if you believe.</h1>
        <p className="text-base sm:text-xl text-[#9ca5bb]">The full DAW is free. Always.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <Card className="p-5 sm:p-8 flex flex-col relative">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Aestra Core</h3>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">$0</div>
            <p className="text-[#9ca5bb] text-xs sm:text-sm">Free forever. Full DAW. No gates.</p>
          </div>
          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
            {["Full DAW — unlimited tracks", "Pattern-based workflow", "Routing visualizer", "Audition mode", "Version control (Takes)", "Basic plugins included"].map((feat, i) => (
              <li key={i} className="flex items-start text-[#d2d8e6] text-xs sm:text-sm">
                <Check className="w-4 h-4 text-[#61d5ff] mr-3 mt-0.5 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="w-full" onClick={() => setPage("download")}>Download Free</Button>
        </Card>

        {/* Paid Tier */}
        <Card className="p-5 sm:p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#8f82df] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
          <div className="absolute inset-0 bg-[#8f82df]/5 pointer-events-none" />

          <div className="mb-6 sm:mb-8 relative z-10">
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Aestra Supporter</h3>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">$5<span className="text-base sm:text-lg text-zinc-400">/mo</span></div>
            <p className="text-[#c7bbff] text-xs sm:text-sm">Support the craft. Get more.</p>
          </div>
          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1 relative z-10">
            {["Everything in Core", "Premium plugins (AestraRumble + more)", "Muse AI — predictive creative assistant", "Cloud storage for Takes", "Monthly sound packs", "Silver card identity"].map((feat, i) => (
              <li key={i} className="flex items-start text-white text-xs sm:text-sm">
                <Check className="w-4 h-4 text-[#c7bbff] mr-3 mt-0.5 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
          <Button variant="primary" className="w-full relative z-10" onClick={() => setPage("changelog")}>Coming Soon — Follow Progress</Button>
        </Card>
      </div>

      {/* Founder Tier */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="section-frame panel-glow rounded-[18px] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,181,73,0.06),transparent)] pointer-events-none" />
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d9b549]/30 bg-[#d9b549]/10 text-[#f6de8d] text-xs font-medium mb-4 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d9b549] animate-pulse" />
            Limited to 500 — never reproduced
          </span>
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Aestra Founder</h3>
          <div className="text-4xl font-bold text-white mb-2 relative z-10">$129<span className="text-lg text-[#9ca5bb]"> once</span></div>
          <p className="text-[#c7bbff] text-sm mb-6 relative z-10">You believed first. This is your legacy.</p>
          <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto relative z-10">
            {["Everything in Supporter, forever — no subscription", "Physical metal Founder card shipped to you", "Name in the app credits permanently", "Beta access to new platforms (mobile, tablet)", "Vote on feature priorities"].map((feat, i) => (
              <li key={i} className="flex items-center text-[#d2d8e6] text-sm">
                <Check className="w-4 h-4 text-[#d9b549] mr-3 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
            className="relative z-10 bg-[linear-gradient(180deg,#d9b549,#a7802c)] border-[#d9b549]/40 hover:brightness-105 shadow-[0_0_20px_rgba(217,181,73,0.26)] w-full"
          >
            Join the Waitlist
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-[#7f879b] text-sm mb-4">
          Students get free Supporter access via Campus. <button className="text-[#61d5ff] hover:underline">Contact us</button>.
        </p>
        <button
          onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
          className="text-[#d9b549] hover:text-[#f6de8d] text-sm underline underline-offset-4 transition-colors"
        >
          See Founder countdown →
        </button>
      </div>
    </div>
  );
};
