import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FounderBanner } from "./components/FounderBanner";
import { Hero, Features as HomeFeatures, FounderCountdown } from "./pages/Home";
import { Features } from "./pages/Features";
import { resolvePage } from "./lib";
import type { PageProps } from "./types";
import { PAGE_TITLES } from "./types";

const Downloads = lazy(() => import("./pages/Downloads").then(m => ({ default: m.Downloads })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.Pricing })));
const Changelog = lazy(() => import("./pages/Changelog").then(m => ({ default: m.Changelog })));
const Docs = lazy(() => import("./pages/Docs").then(m => ({ default: m.Docs })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-2 h-2 rounded-full bg-[#61d5ff] animate-bounce" />
  </div>
);

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const App = () => {
  const [page, setPage] = useState(() => resolvePage(window.location.pathname));
  const [showBanner, setShowBanner] = useState(true);

  // Update document title on navigation
  useEffect(() => {
    document.title = PAGE_TITLES[page] || PAGE_TITLES["404"];
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
            <div id="features"><HomeFeatures /></div>
            <FounderCountdown />
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
      default:
        return <LazyPage><NotFound setPage={handleSetPage} /></LazyPage>;
    }
  };

  return (
    <div className="site-shell min-h-screen text-zinc-100 font-sans selection:bg-[#8f82df]/30" role="document">
      <div className="page-enter" role="main" id="main-content" aria-label="Main content">
        {renderPage()}
      </div>
    </div>
  );
};
