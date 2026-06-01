import React, { memo } from "react";
import { Github, Twitter } from "lucide-react";
import type { PageProps } from "../types";

export const Footer = memo(({ setPage }: PageProps) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#0a0a0b]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Aestra logo" width="28" height="28" className="w-7 h-7 rounded-md" />
              <span className="text-[15px] font-semibold text-zinc-50 tracking-tight">Aestra</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
              A native digital audio workstation built for producers who want flow. Free, fast, and stable.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/aestrastudios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                aria-label="X (Twitter) (opens in new tab)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/currentsuspect/Aestra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                aria-label="GitHub (opens in new tab)"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[13px] font-medium text-zinc-50 mb-3.5">Product</h4>
            <nav aria-label="Product links">
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><button onClick={() => setPage("features")} className="hover:text-zinc-100 transition-colors">Features</button></li>
                <li><button onClick={() => setPage("pricing")} className="hover:text-zinc-100 transition-colors">Pricing</button></li>
                <li><button onClick={() => setPage("changelog")} className="hover:text-zinc-100 transition-colors">Changelog</button></li>
                <li><button onClick={() => setPage("download")} className="hover:text-zinc-100 transition-colors">Download</button></li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[13px] font-medium text-zinc-50 mb-3.5">Resources</h4>
            <nav aria-label="Resources links">
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><button onClick={() => setPage("docs")} className="hover:text-zinc-100 transition-colors">Documentation</button></li>
                <li><button onClick={() => setPage("about")} className="hover:text-zinc-100 transition-colors">About</button></li>
                <li>
                  <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors">
                    Source
                  </a>
                </li>
                <li><button onClick={() => setPage("privacy")} className="hover:text-zinc-100 transition-colors">Privacy</button></li>
                <li><button onClick={() => setPage("terms")} className="hover:text-zinc-100 transition-colors">Terms</button></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            © 2026 Aestra Studios
          </div>
          <div className="text-xs text-zinc-400">
            Built by Dylan Makori
          </div>
        </div>
      </div>
    </footer>
  );
});
