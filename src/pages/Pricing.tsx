import React, { useState, memo } from "react";
import { Check, ArrowRight, Star } from "lucide-react";
import { cn } from "../lib";
import { Button } from "../components/ui";

const FlipCard = memo(({ tier, front, back, className }: {
  tier: "core" | "supporter" | "founder";
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) => {
  const [flipped, setFlipped] = useState(false);
  const cardClass = tier === "core" ? "card-core" : tier === "supporter" ? "card-supporter" : "card-founder";

  return (
    <div className={cn("flip-card", flipped && "flipped", className)} onClick={() => setFlipped(!flipped)}>
      <div className="flip-card-inner" style={{ minHeight: "480px" }}>
        <div className={cn("flip-card-front", cardClass)}>{front}</div>
        <div className={cn("flip-card-back", cardClass)}>{back}</div>
      </div>
    </div>
  );
});

export const Pricing = ({ setPage }: any) => {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Free forever. Support if you believe.</h1>
        <p className="text-base sm:text-xl text-[#98a1b7]">The full DAW is free. Always.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">

        {/* Core — Free */}
        <FlipCard
          tier="core"
          front={
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Aestra Core</h3>
                <div className="text-4xl font-bold text-white mb-1">$0</div>
                <p className="text-[#98a1b7] text-sm">Free forever. Full DAW. No gates.</p>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {["Full DAW — unlimited tracks", "Pattern-based workflow", "Routing visualizer", "Audition mode", "Version control (Takes)", "Basic plugins included"].map((feat, i) => (
                  <li key={i} className="flex items-start text-[#d2d8e6] text-sm">
                    <Check className="w-4 h-4 text-[#6b7280] mr-3 mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" onClick={(e: any) => { e.stopPropagation(); setPage("download"); }}>Download Free</Button>
              <div className="flip-hint">Click to see why it's free</div>
            </>
          }
          back={
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-6">∞</div>
              <h3 className="text-xl font-bold text-white mb-3">No catch. Ever.</h3>
              <p className="text-[#98a1b7] text-sm leading-relaxed max-w-xs">
                No trial. No watermark. No track limits. No "upgrade to export."
                The full DAW — free forever. We make money from people who want more, not from locking what you need.
              </p>
              <div className="flip-hint mt-6">Click to flip back</div>
            </div>
          }
        />

        {/* Supporter — $5/mo */}
        <FlipCard
          tier="supporter"
          className="relative"
          front={
            <>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t-[16px]" />
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium text-white">Aestra Supporter</h3>
                  <span className="text-[9px] font-bold tracking-wider uppercase text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">Popular</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">$5<span className="text-lg text-[#6b8abf]">/mo</span></div>
                <p className="text-[#7dadf2] text-sm">Support the craft. Get more.</p>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {["Everything in Core", "Premium plugins (AestraRumble + more)", "Muse AI — predictive creative assistant", "Cloud storage for Takes", "Monthly sound packs", "Silver card identity"].map((feat, i) => (
                  <li key={i} className="flex items-start text-white text-sm">
                    <Check className="w-4 h-4 text-blue-400 mr-3 mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-500 border-blue-500/40" onClick={(e: any) => { e.stopPropagation(); setPage("changelog"); }}>Coming Soon</Button>
              <div className="flip-hint">Click to see what's coming</div>
            </>
          }
          back={
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Built for believers.</h3>
              <p className="text-[#98a1b7] text-sm leading-relaxed max-w-xs">
                Premium plugins. AI that learns your sound. Cloud Takes so you never lose a mix.
                This is how we stay funded — people who love the craft paying for what makes it better.
              </p>
              <div className="flip-hint mt-6">Click to flip back</div>
            </div>
          }
        />

        {/* Founder — $129 once */}
        <FlipCard
          tier="founder"
          className="relative"
          front={
            <>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-t-[16px]" />
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium text-white">Aestra Founder</h3>
                  <span className="text-[9px] font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">500 only</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">$129<span className="text-lg text-[#a08640]"> once</span></div>
                <p className="text-[#d4a843] text-sm">You believed first. This is your legacy.</p>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                {["Everything in Supporter, forever", "Physical metal Founder card", "Name in the app credits permanently", "Beta access to new platforms", "Vote on feature priorities"].map((feat, i) => (
                  <li key={i} className="flex items-start text-[#d2d8e6] text-sm">
                    <Check className="w-4 h-4 text-amber-400 mr-3 mt-0.5 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                className="w-full bg-gradient-to-b from-amber-500 to-amber-700 border-amber-500/40 hover:brightness-105 shadow-[0_0_20px_rgba(217,181,73,0.2)]"
                onClick={(e: any) => { e.stopPropagation(); setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
              >
                Join the Waitlist
              </Button>
              <div className="flip-hint">Click to see the legacy</div>
            </>
          }
          back={
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-6">👑</div>
              <h3 className="text-xl font-bold text-white mb-3">500 will ever exist.</h3>
              <p className="text-[#98a1b7] text-sm leading-relaxed max-w-xs">
                Your name ships with every download. A metal card in your hand. Lifetime access from day one.
                No subscription. No renewal. You believed first — that's forever.
              </p>
              <div className="flip-hint mt-6">Click to flip back</div>
            </div>
          }
        />
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#7f879b] text-sm mb-4">
          Students get free Supporter access via Campus. <button className="text-[#61d5ff] hover:underline">Contact us</button>.
        </p>
      </div>
    </div>
  );
};
