import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero, Features as HomeFeatures, FounderCountdown, WhySection, Plugins, FreeCore, ClosingCTA } from "./pages/Home";
import { Features } from "./pages/Features";
import { resolvePage } from "./lib";
import type { PageProps } from "./types";
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
    <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-bounce" />
  </div>
);

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const App = () => {
  const [page, setPage] = useState(() => resolvePage(window.location.pathname));

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
    setTwitter("twitter:card", ogType === "article" ? "summary_large_image" : "summary_large_image");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Inject per-page BreadcrumbList JSON-LD
    const pageStructuredData = buildPageStructuredData(pageId, sectionTitle, url);
    let ldScript = document.getElementById("page-structured-data") as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      ldScript.id = "page-structured-data";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(pageStructuredData);
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

  const withShell = (content: React.ReactNode, navPage: string) => (
    <>
      <Navbar activePage={navPage} setPage={handleSetPage} />
      {content}
      <Footer setPage={handleSetPage} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <>
            <Navbar activePage="home" setPage={handleSetPage} />
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
        return (
          <>
            <Features setPage={handleSetPage} />
          </>
        );
      case "pricing":
        return withShell(<LazyPage><Pricing setPage={handleSetPage} /></LazyPage>, "pricing");
      case "changelog":
        return withShell(<LazyPage><Changelog setPage={handleSetPage} /></LazyPage>, "changelog");
      case "docs":
        return (
          <>
            <Navbar activePage="docs" setPage={handleSetPage} />
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
        return withShell(<LazyPage><About setPage={handleSetPage} /></LazyPage>, "");
      default:
        return <LazyPage><NotFound setPage={handleSetPage} /></LazyPage>;
    }
  };

  return (
    <div className="site-shell min-h-screen text-zinc-100 font-sans selection:bg-[#7c3aed]/30">
      <main className="page-enter" id="main-content">
        {renderPage()}
      </main>
    </div>
  );
};
