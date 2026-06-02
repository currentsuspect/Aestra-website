import React, { memo } from "react";
import { Github, Twitter } from "lucide-react";
import type { PageProps } from "../types";

const stripLeading = (p: string) => p.replace(/^\//, "");

const InternalLink = ({
  to,
  setPage,
  className,
  children,
}: {
  to: string;
  setPage: (p: string) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <a
    href={to}
    onClick={(e) => {
      e.preventDefault();
      setPage(stripLeading(to));
    }}
    className={className}
  >
    {children}
  </a>
);

export const Footer = memo(({ setPage }: PageProps) => {
  return (
    <footer className="border-t border-border/80 bg-bg">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
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
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/currentsuspect/Aestra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2 transition-colors"
                aria-label="GitHub (opens in new tab)"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-medium text-fg mb-3.5">Product</h4>
            <nav aria-label="Product links">
              <ul className="space-y-2 text-sm text-muted">
                <li><InternalLink to="/features" setPage={setPage} className="hover:text-fg transition-colors">Features</InternalLink></li>
                <li><InternalLink to="/pricing" setPage={setPage} className="hover:text-fg transition-colors">Pricing</InternalLink></li>
                <li><InternalLink to="/changelog" setPage={setPage} className="hover:text-fg transition-colors">Changelog</InternalLink></li>
                <li><InternalLink to="/download" setPage={setPage} className="hover:text-fg transition-colors">Download</InternalLink></li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="text-[13px] font-medium text-fg mb-3.5">Resources</h4>
            <nav aria-label="Resources links">
              <ul className="space-y-2 text-sm text-muted">
                <li><InternalLink to="/docs" setPage={setPage} className="hover:text-fg transition-colors">Documentation</InternalLink></li>
                <li><InternalLink to="/about" setPage={setPage} className="hover:text-fg transition-colors">About</InternalLink></li>
                <li>
                  <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">
                    Source
                  </a>
                </li>
                <li><InternalLink to="/privacy" setPage={setPage} className="hover:text-fg transition-colors">Privacy</InternalLink></li>
                <li><InternalLink to="/terms" setPage={setPage} className="hover:text-fg transition-colors">Terms</InternalLink></li>
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
