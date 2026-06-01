import React, { useState, useEffect, useMemo, memo } from "react";
import { Download, Menu, X, Github, Twitter } from "lucide-react";
import { cn } from "../lib";
import { Button } from "./ui";
import type { NavbarProps } from "../types";

export const Navbar = memo(({ activePage, setPage, topOffset = 0 }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const navLinks = useMemo(() => [
    { name: "Features", id: "features" },
    { name: "Docs", id: "docs" },
    { name: "Pricing", id: "pricing" },
    { name: "Changelog", id: "changelog" },
  ], []);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200",
        isScrolled
          ? "bg-[#0a0a0b]/80 backdrop-blur-md border-b border-zinc-800/80"
          : "border-b border-transparent"
      )}
      style={{ top: topOffset }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2.5 group"
          aria-label="Aestra — home"
        >
          <img
            src="/logo.png"
            alt="Aestra logo"
            className="w-7 h-7 rounded-md"
          />
          <span className="text-[15px] font-semibold text-zinc-50 tracking-tight">Aestra</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              className={cn(
                "px-3 h-8 text-sm rounded-md transition-colors",
                activePage === link.id
                  ? "text-zinc-50 bg-zinc-900"
                  : "text-zinc-400 hover:text-zinc-100"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="https://x.com/aestrastudios"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            aria-label="X (Twitter) (opens in new tab)"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/currentsuspect/Aestra"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
            aria-label="GitHub repository (opens in new tab)"
          >
            <Github className="w-4 h-4" />
          </a>
          <div className="w-px h-5 bg-zinc-800 mx-1" />
          <Button size="sm" onClick={() => setPage("download")} icon={Download}>
            Download
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-zinc-100 p-2 -mr-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-[#0a0a0b] border-b border-zinc-800 overflow-hidden transition-[max-height,opacity] duration-200",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="px-5 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setPage(link.id); setMobileOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors min-h-[40px] flex items-center",
                activePage === link.id
                  ? "text-zinc-50 bg-zinc-900"
                  : "text-zinc-300 hover:text-zinc-50 hover:bg-zinc-900/60"
              )}
            >
              {link.name}
            </button>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <a
              href="https://x.com/aestrastudios"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 text-sm text-zinc-300 hover:text-zinc-50 hover:bg-zinc-900"
              aria-label="X (Twitter) (opens in new tab)"
            >
              <Twitter className="w-4 h-4" /> X
            </a>
            <a
              href="https://github.com/currentsuspect/Aestra"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 text-sm text-zinc-300 hover:text-zinc-50 hover:bg-zinc-900"
              aria-label="GitHub (opens in new tab)"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <Button size="md" onClick={() => { setPage("download"); setMobileOpen(false); }} icon={Download} className="col-span-2">
              Download
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
});
