import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { EarlyAccessModal } from "./components/EarlyAccessModal";
import { ToastProvider } from "./components/Toast";
import { Cursor } from "./components/Cursor";
import { Footer } from "./components/Footer";
import { LoadingFallback } from "./components/ui";
import { Hero, Features as HomeFeatures, FounderCountdown, WhySection, Plugins, FreeCore, ClosingCTA, FAQ as HomeFAQ, ChangelogTeaser } from "./pages/Home";
import { Features } from "./pages/Features";
import { resolvePage, prefersReducedMotion } from "./lib";
import type { PageProps } from "./types";
import type { EarlyAccessPurpose } from "./components/EarlyAccessModal";
import {
  PAGE_TITLES,
  PAGE_DESCRIPTIONS,
  PAGE_KEYWORDS,
  PAGE_PATHS,
  PAGE_OG_TYPES,
  PAGE_OG_IMAGES,
  PAGE_ROBOTS,
  PAGE_SECTION_TITLES,
} from "./types";
import { buildPageStructuredData, updateMetaTag } from "./seo";
import { useTheme } from "./hooks/useTheme";

const Downloads = lazy(() => import("./pages/Downloads").then(m => ({ default: m.Downloads })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.Pricing })));
const Changelog = lazy(() => import("./pages/Changelog").then(m => ({ default: m.Changelog })));
const Docs = lazy(() => import("./pages/Docs").then(m => ({ default: m.Docs })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Roadmap = lazy(() => import("./pages/Roadmap").then(m => ({ default: m.Roadmap })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const PageLoader = () => <LoadingFallback />;

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const scrollOpts: ScrollIntoViewOptions = prefersReducedMotion() ? { behavior: "auto" } : { behavior: "smooth" };

export const App = () => {
  const [page, setPage] = useState(() => resolvePage(window.location.pathname));
  useTheme();

  // Enable native browser scroll restoration. We only force scrollTo(0, 0)
  // for top-level page transitions, not for popstate (back/forward) which
  // should restore the user's previous scroll position automatically.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Update document title, SEO meta, and per-page structured data on navigation
  useEffect(() => {
    const pageId = (page in PAGE_TITLES ? page : "404") as keyof typeof PAGE_TITLES;
    const title = PAGE_TITLES[pageId] || PAGE_TITLES["404"];
    const desc = PAGE_DESCRIPTIONS[pageId] || PAGE_DESCRIPTIONS["home"];
    const keywords = PAGE_KEYWORDS[pageId] || PAGE_KEYWORDS["home"];
    const path = PAGE_PATHS[pageId] || "/";
    const url = `https://aestra.studio${path === "/" ? "/" : path}`;
    const ogType = PAGE_OG_TYPES[pageId] || "website";
    const ogImage = PAGE_OG_IMAGES[pageId] || "/og-image.svg";
    const ogImageAbs = `https://aestra.studio${ogImage}`;
    const robots = PAGE_ROBOTS[pageId] || "index, follow";
    const sectionTitle = PAGE_SECTION_TITLES[pageId] || "Home";

    document.title = title;
    document.documentElement.lang = "en";

    updateMetaTag("description", desc, true);
    updateMetaTag("keywords", keywords, true);
    updateMetaTag("robots", robots, true);
    updateMetaTag("author", "Aestra Studios", true);

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setOg("og:title", title);
    setOg("og:description", desc);
    setOg("og:url", url);
    setOg("og:type", ogType);
    setOg("og:image", ogImageAbs);
    setOg("og:image:secure_url", ogImageAbs);
    setOg("og:site_name", "Aestra");

    const setTwitter = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setTwitter("twitter:title", title);
    setTwitter("twitter:description", desc);
    setTwitter("twitter:image", ogImageAbs);
    setTwitter("twitter:card", "summary_large_image");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Only inject per-page structured data when not on the home page,
    // because index.html already provides the full home graph (@graph).
    // This avoids the duplicate BreadcrumbList / WebPage that previously
    // appeared on the home page.
    if (pageId !== "home") {
      const pageStructuredData = buildPageStructuredData(pageId, sectionTitle, url);
      let ldScript = document.getElementById("page-structured-data") as HTMLScriptElement | null;
      if (!ldScript) {
        ldScript = document.createElement("script");
        ldScript.type = "application/ld+json";
        ldScript.id = "page-structured-data";
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(pageStructuredData);
    } else {
      const existing = document.getElementById("page-structured-data");
      if (existing) existing.remove();
    }
  }, [page]);

  // Track whether the next page change is the result of a popstate (back/forward).
  // If so, we don't force scrollTo(0, 0) — let the browser restore position.
  const isPopState = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isPopState.current = true;
      setPage(resolvePage(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Handle hash scrolling + scroll-to-top on page change
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      // Retry until the lazy-loaded target exists.
      let attempts = 0;
      const tryScroll = () => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView(scrollOpts);
          (target as HTMLElement).focus?.({ preventScroll: true });
        } else if (attempts++ < 20) {
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
    } else if (!isPopState.current) {
      window.scrollTo(0, 0);
    }
    isPopState.current = false;
  }, [page]);

  // Handle anchor clicks (in-page navigation)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (!target) return;
      const hash = target.getAttribute("href");
      if (!hash || hash === "#") return;
      e.preventDefault();
      const dest = document.querySelector(hash);
      if (dest) {
        dest.scrollIntoView(scrollOpts);
        (dest as HTMLElement).focus?.({ preventScroll: true });
      }
      window.history.pushState(null, "", hash);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSetPage = useCallback((newPage: string) => {
    setPage(newPage);
    const path = newPage === "home" ? "/" : `/${newPage}`;
    window.history.pushState(null, "", path);
  }, []);

  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [earlyAccessPurpose, setEarlyAccessPurpose] = useState<EarlyAccessPurpose>("early-access");
  const handleEarlyAccess = useCallback((purpose?: EarlyAccessPurpose) => {
    setEarlyAccessPurpose(purpose ?? "early-access");
    setEarlyAccessOpen(true);
  }, []);

  const withShell = (content: React.ReactNode, navPage: string) => (
    <>
      <Navbar activePage={navPage} setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
      {content}
      <Footer setPage={handleSetPage} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <>
            <Navbar activePage="home" setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <Hero setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <WhySection />
            <ChangelogTeaser setPage={handleSetPage} />
            <div id="features"><HomeFeatures /></div>
            <Plugins />
            <FreeCore setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <HomeFAQ setPage={handleSetPage} />
            <FounderCountdown />
            <ClosingCTA setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <Footer setPage={handleSetPage} />
          </>
        );
      case "features":
        return (
          <>
            <Features setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
          </>
        );
      case "pricing":
        return withShell(<LazyPage><Pricing setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} /></LazyPage>, "pricing");
      case "changelog":
        return withShell(<LazyPage><Changelog setPage={handleSetPage} /></LazyPage>, "changelog");
      case "docs":
        return (
          <>
            <Navbar activePage="docs" setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <LazyPage><Docs setPage={handleSetPage} /></LazyPage>
          </>
        );
      case "download":
        return withShell(<LazyPage><Downloads setPage={handleSetPage} /></LazyPage>, "download");
      case "login":
      case "account":
        return <LazyPage><Dashboard setPage={handleSetPage} /></LazyPage>;
      case "privacy":
        return (
          <>
            <Navbar activePage="" setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <LazyPage><Privacy setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "terms":
        return (
          <>
            <Navbar activePage="" setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
            <LazyPage><Terms setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "about":
        return withShell(<LazyPage><About setPage={handleSetPage} /></LazyPage>, "");
      case "roadmap":
        return withShell(<LazyPage><Roadmap setPage={handleSetPage} /></LazyPage>, "roadmap");
      default:
        return (
          <LazyPage>
            <div className="flex flex-col min-h-screen">
              <Navbar activePage="" setPage={handleSetPage} onEarlyAccess={handleEarlyAccess} />
              <div className="flex-1">
                <NotFound setPage={handleSetPage} />
              </div>
              <Footer setPage={handleSetPage} />
            </div>
          </LazyPage>
        );
    }
  };

  return (
    <ToastProvider>
      <div className="site-shell min-h-screen text-fg font-sans selection:bg-accent-soft">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Cursor />
        <EarlyAccessModal open={earlyAccessOpen} onClose={() => setEarlyAccessOpen(false)} purpose={earlyAccessPurpose} />
        <main className="page-enter" id="main-content">
          {renderPage()}
        </main>
      </div>
    </ToastProvider>
  );
};
