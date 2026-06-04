import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";
import { Download, Menu, X } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { cn, detectOS } from "../lib";
import { Button } from "./ui";
import { ThemeToggle } from "./ThemeToggle";
import type { NavbarProps } from "../types";

const MENU_ID = "mobile-menu";

export const Navbar = memo(({ activePage, setPage }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentOS = useMemo(() => detectOS(), []);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

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

  const closeMobile = useCallback((returnFocus = false) => {
    setMobileOpen(false);
    if (returnFocus) {
      requestAnimationFrame(() => toggleRef.current?.focus());
    }
  }, []);

  // Body scroll lock + Escape + focus trap when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile(true);
        return;
      }
      if (e.key === "Tab" && menuRef.current) {
        // Simple focus trap: cycle within the menu's focusable descendants.
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus to the first link inside the menu
    requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      first?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches && mobileOpen) {
        setMobileOpen(false);
        // restore focus to toggle
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mobileOpen]);

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
          ? "bg-bg/80 backdrop-blur-md border-b border-border/80"
          : "border-b border-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-6">
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
          <span className="text-[15px] font-semibold text-fg tracking-tight">Aestra</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              aria-current={activePage === link.id ? "page" : undefined}
              className={cn(
                "px-3 h-8 text-sm rounded-md transition-colors",
                activePage === link.id
                  ? "text-fg bg-surface-2"
                  : "text-muted hover:text-fg"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <a
            href="https://github.com/currentsuspect/Aestra"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2 transition-colors"
            aria-label="GitHub repository (opens in new tab)"
          >
            <GitHubIcon className="w-4 h-4" aria-hidden="true" />
          </a>
          <ThemeToggle />
          <div className="w-px h-5 bg-surface-3 mx-1" />
          <Button size="sm" onClick={() => setPage("download")} icon={Download}>
            {currentOS ? `Download for ${currentOS}` : "Download"}
          </Button>
        </div>

        <button
          ref={toggleRef}
          className="md:hidden text-muted hover:text-fg p-2 -mr-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls={MENU_ID}
        >
          {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        ref={menuRef}
        id={MENU_ID}
        className={cn(
          "md:hidden bg-bg border-b border-border overflow-hidden transition-[max-height,opacity] duration-200",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="px-5 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setPage(link.id); closeMobile(false); }}
              aria-current={activePage === link.id ? "page" : undefined}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors min-h-[40px] flex items-center",
                activePage === link.id
                  ? "text-fg bg-surface-2"
                  : "text-fg-muted hover:text-fg hover:bg-surface-2/60"
              )}
            >
              {link.name}
            </button>
          ))}
          <div className="flex gap-2 pt-3">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <a
                href="https://github.com/currentsuspect/Aestra"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 inline-flex items-center justify-center gap-2 rounded-md border border-border text-sm text-fg-muted hover:text-fg hover:bg-surface-2"
                aria-label="GitHub (opens in new tab)"
              >
                <GitHubIcon className="w-4 h-4" aria-hidden="true" /> GitHub
              </a>
              <div className="h-10 inline-flex items-center justify-center rounded-md border border-border">
                <ThemeToggle />
              </div>
            </div>
            <Button size="md" onClick={() => { setPage("download"); closeMobile(false); }} icon={Download}>
              {currentOS ? `Download for ${currentOS}` : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
});
