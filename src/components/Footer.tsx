import React, { memo } from "react";
import { Github, Twitter } from "lucide-react";
import type { PageProps } from "../types";

export const Footer = memo(({ setPage }: PageProps) => {
  return (
    <footer className="border-t border-border/80 bg-bg">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Aestra logo" width="28" height="28" className="w-7 h-7 rounded-md" />
              <span className="text-[15px] font-semibold text-fg tracking-tight">Aestra</span>
            </div>
            <p className="text-sm text-muted max-w-sm leading-relaxed mb-6">
              A native digital audio workstation built for producers who want flow. Free, fast, and stable.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/aestrastudios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2 transition-colors"
                aria-label="X (Twitter) (opens in new tab)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/currentsuspect/Aestra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2 transition-colors"
                aria-label="GitHub (opens in new tab)"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[13px] font-medium text-fg mb-3.5">Product</h4>
            <nav aria-label="Product links">
              <ul className="space-y-2 text-sm text-muted">
                <li><button onClick={() => setPage("features")} className="hover:text-fg transition-colors">Features</button></li>
                <li><button onClick={() => setPage("pricing")} className="hover:text-fg transition-colors">Pricing</button></li>
                <li><button onClick={() => setPage("changelog")} className="hover:text-fg transition-colors">Changelog</button></li>
                <li><button onClick={() => setPage("download")} className="hover:text-fg transition-colors">Download</button></li>
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[13px] font-medium text-fg mb-3.5">Resources</h4>
            <nav aria-label="Resources links">
              <ul className="space-y-2 text-sm text-muted">
                <li><button onClick={() => setPage("docs")} className="hover:text-fg transition-colors">Documentation</button></li>
                <li><button onClick={() => setPage("about")} className="hover:text-fg transition-colors">About</button></li>
                <li>
                  <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">
                    Source
                  </a>
                </li>
                <li><button onClick={() => setPage("privacy")} className="hover:text-fg transition-colors">Privacy</button></li>
                <li><button onClick={() => setPage("terms")} className="hover:text-fg transition-colors">Terms</button></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-xs text-muted">
          <div>© 2026 Aestra Studios · Built by Dylan Makori</div>
          <div className="text-dim">Native C++ · v0.1.1</div>
        </div>
      </div>
    </footer>
  );
});
