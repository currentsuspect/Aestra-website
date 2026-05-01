import React, { useState, memo } from "react";
import { cn } from "../lib";
import type { PageProps } from "../types";

export const Footer = memo(({ setPage }: PageProps) => {
  const [easterEgg, setEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount(c => c + 1);
    if (clickCount >= 4) setEasterEgg(true);
  };

  return (
    <footer className="relative border-t border-[#2f3646]" role="contentinfo" aria-label="Site footer">
      {/* Signal Chain — visual routing map */}
      <div className="bg-[#0c0f16] border-b border-[#1a1f2b] px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-0">
            <span className="text-[8px] font-mono text-[#61d5ff] mr-2 shrink-0">Signal Path</span>
            {[
              { name: "React", color: "#61dafb", bg: "rgba(97,218,251,0.1)", border: "rgba(97,218,251,0.25)" },
              { name: "Vite", color: "#646cff", bg: "rgba(100,108,255,0.1)", border: "rgba(100,108,255,0.25)" },
              { name: "Vercel", color: "#ffffff", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.15)" },
              { name: "Your Eyes", color: "#d9b549", bg: "rgba(217,181,73,0.1)", border: "rgba(217,181,73,0.25)" },
            ].map((node, i, arr) => (
              <div key={node.name} className="flex items-center">
                {i > 0 && (
                  <div className="flex items-center w-6 sm:w-8">
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${arr[i-1].color}40, ${node.color}40)` }} />
                    <div className="w-1 h-1 rounded-full mx-0.5" style={{ background: node.color, opacity: 0.5 }} />
                    <div className="h-px flex-1" style={{ background: `${node.color}30` }} />
                  </div>
                )}
                <div
                  className="px-2 py-0.5 rounded-full text-[8px] font-mono font-medium border"
                  style={{ color: node.color, background: node.bg, borderColor: node.border }}
                >
                  {node.name}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[8px] font-mono text-[#5a6275]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span>All channels routed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#090c12]/92 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 cursor-pointer select-none" onClick={handleLogoClick}>
              <img src="/aestra_icon.svg" alt="" width="20" height="20" className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg font-bold text-white">Aestra</span>
            </div>
            {!easterEgg ? (
              <p className="text-[#8b94aa] text-xs sm:text-sm max-w-sm mb-4 sm:mb-6">
                The DAW for people who actually live inside their music.
                Built by obsessed engineers for obsessed producers.
              </p>
            ) : (
              <div className="text-[#8b94aa] text-xs sm:text-sm max-w-sm mb-4 sm:mb-6">
                <p className="mb-2">You found the secret. Here{"'"}s what nobody tells you:</p>
                <p className="text-[#d9b549] italic">
                  "The best DAW is the one that disappears while you{"'"}re using it."
                </p>
                <p className="mt-2 text-[#6f778d] text-[10px]">
                  — Dylan, building Aestra at 3am in Kenya, probably
                </p>
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <svg className="w-full h-4 opacity-20" viewBox="0 0 200 16" preserveAspectRatio="none">
                <polyline
                  points={Array.from({length: 100}, (_, i) => {
                    const x = (i / 99) * 200;
                    const y = 8 + Math.sin(i * 0.15) * 5 * Math.cos(i * 0.08);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8f82df"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div className="text-[#6f778d] text-[10px] sm:text-xs">
              © 2026 Dylan Makori / Aestra Studios
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-medium mb-3 sm:mb-4 text-xs sm:text-sm">Product</h4>
            <nav aria-label="Product links">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#98a1b7] list-none">
                <li><button onClick={() => setPage("features")} className="hover:text-[#61d5ff]">Features</button></li>
                <li><button onClick={() => setPage("pricing")} className="hover:text-[#61d5ff]">Pricing</button></li>
                <li><button onClick={() => setPage("changelog")} className="hover:text-[#61d5ff]">Changelog</button></li>
                <li><button onClick={() => setPage("download")} className="hover:text-[#61d5ff]">Download</button></li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium mb-3 sm:mb-4 text-xs sm:text-sm">Resources</h4>
            <nav aria-label="Resources links">
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#98a1b7] list-none">
                <li><button onClick={() => setPage("docs")} className="hover:text-[#61d5ff]">Documentation</button></li>
                <li><a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="hover:text-[#61d5ff]">Source Code</a></li>
                <li><button onClick={() => setPage("privacy")} className="hover:text-[#61d5ff]">Privacy</button></li>
                <li><button onClick={() => setPage("terms")} className="hover:text-[#61d5ff]">Terms</button></li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#1a1f2b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#5a6275]">
            <span>Aestra v0.x-prebeta</span>
            <span className="text-[#2a2f3e]">·</span>
            <span>ASSAL v1.1</span>
            <span className="text-[#2a2f3e]">·</span>
            <span className="text-[#61d5ff]">Linux-first</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#5a6275]">
            <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="hover:text-[#98a1b7] transition-colors">
              GitHub
            </a>
            <span className="text-[#2a2f3e]">·</span>
            <span className="hidden sm:inline">Made with late nights and questionable amounts of coffee</span>
            <span className="sm:hidden">Made with ☕</span>
          </div>
        </div>
      </div>
    </footer>
  );
});
