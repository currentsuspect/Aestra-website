import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback, memo } from "react";
import { Menu, X } from "lucide-react";
import { GitHubIcon } from "./Icons";
import { cn } from "../lib";
import { ThemePicker } from "./ThemePicker";
import { Mark } from "./Mark";
import type { NavbarProps } from "../types";

const MENU_ID = "mobile-menu";

/* Real links, so crawlers and middle-clicks can follow them; a plain left
   click still navigates in place without a reload. */
const spaNavigate = (e: React.MouseEvent<HTMLAnchorElement>, go: () => void) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  go();
};

/* The page switch is the app's view switch (Arsenal | Timeline | Audition):
   a sunk pill track whose lit thumb slides to the current page. */
const SegNav = ({ links, activePage, setPage }: { links: { name: string; id: string }[]; activePage: string; setPage: (p: string) => void }) => {
  const track = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  const place = useCallback(() => {
    const el = track.current?.querySelector<HTMLElement>('[aria-current="page"]');
    setThumb(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, []);
  useLayoutEffect(place, [activePage, place]);
  useEffect(() => {
    if (typeof ResizeObserver === "undefined" || !track.current) return;
    const ro = new ResizeObserver(place);
    ro.observe(track.current);
    return () => ro.disconnect();
  }, [place]);
  return (
    <div ref={track} className="seg" data-thumb={thumb ? "" : undefined}>
      <span
        className="seg-thumb"
        aria-hidden="true"
        style={{ width: thumb?.w ?? 0, transform: `translateX(${thumb?.x ?? 0}px)`, opacity: thumb ? 1 : 0 }}
      />
      {links.map((link) => (
        <a
          key={link.id}
          href={`/${link.id}`}
          onClick={(e) => spaNavigate(e, () => setPage(link.id))}
          aria-current={activePage === link.id ? "page" : undefined}
          className="seg-item"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
};

export const Navbar = memo(({ activePage, setPage, onEarlyAccess }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { name: "Plugins", id: "plugins" },
    { name: "Docs", id: "docs" },
    { name: "Pricing", id: "pricing" },
    { name: "Changelog", id: "changelog" },
  ], []);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-[background-color,box-shadow] duration-200",
        isScrolled || mobileOpen
          ? "bg-bg shadow-[inset_0_-1px_0_var(--color-border)]"
          : "bg-bg/0"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-14 sm:h-16 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <a
          href="/"
          onClick={(e) => spaNavigate(e, () => setPage("home"))}
          className="flex items-center gap-2.5 justify-self-start rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          aria-label="Aestra — home"
        >
          <Mark className="w-6 h-6 text-accent-fill" />
          <span className="text-[16px] font-extrabold text-fg lowercase tracking-[-0.01em] [font-stretch:125%]">aestra</span>
        </a>

        <div className="hidden md:block">
          <SegNav links={navLinks} activePage={activePage} setPage={setPage} />
        </div>

        <div className="flex items-center justify-self-end gap-1.5">
          <a
            href="https://github.com/currentsuspect/Aestra"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-quiet h-8 w-8 hidden sm:inline-flex"
            aria-label="GitHub repository (opens in new tab)"
          >
            <GitHubIcon className="w-4 h-4" aria-hidden="true" />
          </a>
          <ThemePicker />
          <button
            type="button"
            onClick={() => onEarlyAccess?.()}
            className="btn btn-accent h-8 px-3.5 text-[12.5px] hidden md:inline-flex"
          >
            Early access
          </button>
          <button
            ref={toggleRef}
            type="button"
            className="md:hidden btn btn-quiet w-10 h-10 -mr-1.5"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={MENU_ID}
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        id={MENU_ID}
        className={cn(
          "md:hidden bg-bg overflow-hidden transition-[max-height,opacity] duration-200",
          mobileOpen ? "max-h-[480px] opacity-100 shadow-[inset_0_-1px_0_var(--color-border)]" : "max-h-0 opacity-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="px-5 py-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/${link.id}`}
              tabIndex={mobileOpen ? undefined : -1}
              onClick={(e) => spaNavigate(e, () => { setPage(link.id); closeMobile(false); })}
              aria-current={activePage === link.id ? "page" : undefined}
              className={cn(
                "w-full text-left px-4 rounded-full text-[15px] transition-colors min-h-[44px] flex items-center",
                activePage === link.id
                  ? "text-fg bg-surface-2"
                  : "text-fg-muted hover:text-fg hover:bg-[var(--color-hover)]"
              )}
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://github.com/currentsuspect/Aestra"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={mobileOpen ? undefined : -1}
            className="w-full px-4 rounded-full text-[15px] min-h-[44px] flex items-center gap-2 text-fg-muted hover:text-fg sm:hidden"
          >
            <GitHubIcon className="w-4 h-4" aria-hidden="true" /> GitHub
          </a>
          <div className="flex pt-3 pb-2">
            <button type="button" tabIndex={mobileOpen ? undefined : -1} onClick={() => { onEarlyAccess?.(); closeMobile(false); }} className="btn btn-accent w-full h-11 text-[15px]">
              Request early access
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
});
