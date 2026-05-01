import React, { useState, useEffect, useMemo, memo } from "react";
import { Download, Menu, X } from "lucide-react";
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
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
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
        "fixed left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#0e121a]/86 backdrop-blur-xl border-[#2f3544] py-3"
          : "bg-transparent border-transparent py-5"
      )}
      style={{ top: topOffset }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setPage("home")}
          className="flex items-center gap-2 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setPage("home")}
        >
          <div className="w-9 h-9 rounded-[12px] overflow-hidden flex items-center justify-center bg-[#151a24] border border-[#2a2a36] group-hover:border-[#00e5cc]/45 transition-all">
            <img src="/logo.png" alt="" className="w-8 h-8" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Aestra</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-[#30384a] bg-[#171b26]/90 px-3 py-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activePage === link.id
                  ? "bg-[#7c3aed] text-white"
                  : "text-[#98a1b7] hover:text-white hover:bg-[#2a2f3e]"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/currentsuspect/Aestra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#98a1b7] hover:text-white transition-colors"
            aria-label="GitHub repository (opens in new tab)"
          >
            GitHub
          </a>
          <Button size="sm" onClick={() => setPage("download")} icon={Download}>
            Download Beta
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#98a1b7] hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-[#141924] border-b border-[#27272a] overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setPage(link.id); setMobileOpen(false); }}
              className={cn(
                "text-left py-2.5 px-2 rounded-lg transition-colors min-h-[44px] flex items-center",
                activePage === link.id
                  ? "text-[#9257ff] bg-white/5"
                  : "text-[#d2d8e6] hover:text-[#9257ff] hover:bg-white/5"
              )}
            >
              {link.name}
            </button>
          ))}
          <hr className="border-[#27272a]" />
          <a
            href="https://github.com/currentsuspect/Aestra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-[#d2d8e6] hover:text-[#00e5cc] py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors min-h-[44px] flex items-center"
            aria-label="GitHub (opens in new tab)"
          >
            GitHub
          </a>
          <Button className="w-full" onClick={() => { setPage("download"); setMobileOpen(false); }}>
            Download Free
          </Button>
        </div>
      </div>
    </nav>
  );
});
