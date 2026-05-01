import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FounderBanner } from "./components/FounderBanner";
import { Hero, Features as HomeFeatures, FounderCountdown, WhySection, Plugins, FreeCore, ClosingCTA } from "./pages/Home";
import { Features } from "./pages/Features";
import { resolvePage } from "./lib";
import type { PageProps } from "./types";
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from "./types";

const Downloads = lazy(() => import("./pages/Downloads").then(m => ({ default: m.Downloads })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.Pricing })));
const Changelog = lazy(() => import("./pages/Changelog").then(m => ({ default: m.Changelog })));
const Docs = lazy(() => import("./pages/Docs").then(m => ({ default: m.Docs })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-2 h-2 rounded-full bg-[#00e5cc] animate-bounce" />
  </div>
);

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const App = () => {
  const [page, setPage] = useState(() => resolvePage(window.location.pathname));
  const [showBanner, setShowBanner] = useState(true);

  // Update document title and SEO meta on navigation
  useEffect(() => {
    const title = PAGE_TITLES[page] || PAGE_TITLES["404"];
    const desc = PAGE_DESCRIPTIONS[page] || PAGE_DESCRIPTIONS["home"];
    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDesc) ogDesc.setAttribute("content", desc);
    if (ogUrl) ogUrl.setAttribute("content", `https://aestra.studio/${page === "home" ? "" : page}`);

    // Update Twitter tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twTitle) twTitle.setAttribute("content", title);
    if (twDesc) twDesc.setAttribute("content", desc);

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", `https://aestra.studio/${page === "home" ? "" : page}`);
  }, [page]);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => setPage(resolvePage(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Handle hash scrolling
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [page]);

  // Handle anchor clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^='#']");
      if (target) {
        e.preventDefault();
        const hash = target.getAttribute("href");
        if (hash) {
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSetPage = useCallback((newPage: string) => {
    setPage(newPage);
    const path = newPage === "home" ? "/" : `/${newPage}`;
    window.history.pushState(null, "", path);
  }, []);

  const handleDismissBanner = useCallback(() => setShowBanner(false), []);

  const withBanner = (content: React.ReactNode, navPage: string) => (
    <>
      {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
      <Navbar activePage={navPage} setPage={handleSetPage} topOffset={showBanner ? 68 : 0} />
      {content}
      <Footer setPage={handleSetPage} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <>
            {showBanner && <FounderBanner onDismiss={handleDismissBanner} />}
            <Navbar activePage="home" setPage={handleSetPage} topOffset={showBanner ? 68 : 0} />
            <Hero setPage={handleSetPage} />
            <WhySection />
            <div id="features"><HomeFeatures /></div>
            <Plugins />
            <FreeCore setPage={handleSetPage} />
            <FounderCountdown />
            <ClosingCTA setPage={handleSetPage} />
            <Footer setPage={handleSetPage} />
          </>
        );
      case "features":
        return <Features setPage={handleSetPage} />;
      case "pricing":
        return withBanner(<LazyPage><Pricing setPage={handleSetPage} /></LazyPage>, "pricing");
      case "changelog":
        return withBanner(<LazyPage><Changelog setPage={handleSetPage} /></LazyPage>, "changelog");
      case "docs":
        return (
          <>
            <Navbar activePage="docs" setPage={handleSetPage} />
            <LazyPage><Docs setPage={handleSetPage} /></LazyPage>
          </>
        );
      case "download":
        return withBanner(<LazyPage><Downloads setPage={handleSetPage} /></LazyPage>, "download");
      case "login":
      case "account":
        return <LazyPage><Dashboard setPage={handleSetPage} /></LazyPage>;
      case "privacy":
        return (
          <>
            <Navbar activePage="" setPage={handleSetPage} />
            <LazyPage><Privacy setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "terms":
        return (
          <>
            <Navbar activePage="" setPage={handleSetPage} />
            <LazyPage><Terms setPage={handleSetPage} /></LazyPage>
            <Footer setPage={handleSetPage} />
          </>
        );
      case "about":
        return withBanner(<LazyPage><About setPage={handleSetPage} /></LazyPage>, "");
      default:
        return <LazyPage><NotFound setPage={handleSetPage} /></LazyPage>;
    }
  };

  return (
    <div className="site-shell min-h-screen text-zinc-100 font-sans selection:bg-[#7c3aed]/30" role="document">
      <div className="page-enter" role="main" id="main-content" aria-label="Main content">
        {renderPage()}
      </div>
    </div>
  );
};
