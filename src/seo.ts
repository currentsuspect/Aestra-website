import { useEffect } from "react";
import { RELEASES } from "./changelogData";

/** The one public origin. The apex redirects here; every absolute URL we emit uses it. */
export const ORIGIN = "https://www.aestra.studio";
export const ORG_ID = `${ORIGIN}/#organization`;
export const SOFTWARE_ID = `${ORIGIN}/#software`;

export const SITE = {
  name: "Aestra",
  url: ORIGIN,
  description:
    "Aestra is a free app for making music, built for old and modest machines: the whole DAW is free, eleven effects come in the box, and it's in alpha on Linux.",
  twitter: "@aestrastudios",
  twitterUrl: "https://x.com/aestrastudios",
  github: "https://github.com/currentsuspect/Aestra",
  organization: {
    "@context": "https://schema.org",
    "@id": ORG_ID,
    name: "Aestra Studios",
  },
};

const LATEST = RELEASES.find((r) => r.status !== "active") ?? RELEASES[0];
/** "Sep 12, 2026" → "2026-09-12", read as a calendar date (no timezone shift). */
const isoDate = (d: string) => {
  const t = new Date(d);
  if (Number.isNaN(t.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
};

/** Aestra itself, with its version and date taken from the newest shipped release. */
export const softwareApplication = () => ({
  "@type": "SoftwareApplication",
  "@id": SOFTWARE_ID,
  name: "Aestra",
  alternateName: "Aestra DAW",
  description: SITE.description,
  url: `${ORIGIN}/`,
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "Digital Audio Workstation",
  operatingSystem: "Linux",
  softwareVersion: LATEST.version.replace(/^v/, ""),
  datePublished: "2025-12-23",
  dateModified: isoDate(LATEST.date),
  downloadUrl: `${ORIGIN}/download`,
  softwareRequirements:
    "Linux, built from source during alpha. Windows: the audio engine builds, the app doesn't yet. macOS is not supported before 2027.",
  screenshot: `${ORIGIN}/og-image.png`,
  featureList: [
    "Runs light on modest hardware",
    "Loop-first workflow with patterns and an Arsenal step sequencer",
    "Visual signal routing",
    "Eleven built-in effects: EQ, Compressor, Verb, Delay, Limit, OTT, Transient, Sat, Filter, Drift and LFO",
    "VST3 and CLAP plugin hosting (partial, Linux only during alpha)",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "The whole DAW is free. Extra plugins are optional.",
    url: `${ORIGIN}/pricing`,
    availability: "https://schema.org/InStock",
  },
  author: { "@id": `${ORIGIN}/#founder` },
  publisher: { "@id": ORG_ID },
});

/**
 * Puts one JSON-LD block in <head> while the calling page is mounted.
 * Pages own their structured data so it always describes what the page
 * shows; the prerender snapshots it into the static HTML.
 */
export const useStructuredData = (id: string, data: object | null) => {
  const json = data ? JSON.stringify(data) : "";
  useEffect(() => {
    if (!json) return;
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = json;
    return () => { document.getElementById(id)?.remove(); };
  }, [id, json]);
};

export const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (el) el.setAttribute(attr, value);
};

export const updateMetaTag = (name: string, content: string, useName: boolean = true) => {
  const selector = useName ? `meta[name="${name}"]` : `meta[property="${name}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    if (useName) el.setAttribute("name", name);
    else el.setAttribute("property", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const buildPageStructuredData = (
  page: string,
  sectionTitle: string,
  url: string
) => {
  const base = {
    "@context": "https://schema.org",
    "@graph": [] as object[],
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${ORIGIN}/`,
      },
    ],
  };

  if (page !== "home") {
    (breadcrumb.itemListElement as { "@type": string; position: number; name: string; item: string }[]).push({
      "@type": "ListItem",
      position: 2,
      name: sectionTitle,
      item: url,
    });
  }

  if (page !== "home") base["@graph"].push(breadcrumb);

  // Note: the changelog ItemList was previously pushed empty (no
  // itemListElement), which Google drops. The full release data lives
  // in Changelog.tsx; not duplicating it here to keep a single source
  // of truth. The static index.html graph already covers the home page.

  if (page === "pricing") {
    base["@graph"].push({
      "@type": "Product",
      "@id": `${url}#product`,
      name: "Aestra",
      description:
        "A free digital audio workstation for producers, with optional Supporter and Founder offers.",
      brand: { "@id": ORG_ID },
      offers: [
        {
          "@type": "Offer",
          "@id": `${url}#core`,
          name: "Core",
          price: "0",
          priceCurrency: "USD",
          description: "The whole DAW, free. Extra plugins are optional.",
          url,
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          "@id": `${url}#supporter`,
          name: "Supporter",
          price: "5",
          priceCurrency: "USD",
          description: "Monthly or annual subscription with the Native Suite catalogue and local Muse when ready.",
          url,
          availability: "https://schema.org/PreOrder",
        },
        {
          "@type": "Offer",
          "@id": `${url}#founder`,
          name: "Founder",
          price: "129",
          priceCurrency: "USD",
          description: "One-time digital Founder card with a fixed Founder Collection, 24 months of Supporter, and an ongoing discount. Limited to 500.",
          url,
          availability: "https://schema.org/LimitedAvailability",
        },
      ],
    });
  }

  if (page === "home" || page === "download") {
    base["@graph"].push(softwareApplication());
  }

  if (page === "about") {
    base["@graph"].push({
      "@type": "AboutPage",
      "@id": `${url}#about`,
      name: "About Aestra Studios",
      url,
      mainEntity: { "@id": ORG_ID },
    });
  }

  if (page === "docs") {
    base["@graph"].push({
      "@type": "TechArticle",
      "@id": `${url}#docs`,
      name: "Aestra documentation",
      headline: "Aestra documentation",
      description:
        "Documentation for the Aestra DAW: patch recipes, signal flow, troubleshooting, and command palette reference.",
      author: { "@id": `${ORIGIN}/#founder` },
      publisher: { "@id": ORG_ID },
      inLanguage: "en-US",
    });
  }

  if (page === "recovery") {
    base["@graph"].push({
      "@type": "TechArticle",
      "@id": `${url}#recovery`,
      name: "Aestra Recovery Center",
      headline: "Report. Investigate. Recover.",
      description:
        "How to report an Aestra bug, investigate it with a coding agent under a versioned protocol, contribute a fix upstream, or recover a damaged project.",
      author: { "@id": `${ORIGIN}/#founder` },
      publisher: { "@id": ORG_ID },
      inLanguage: "en-US",
    });
  }

  if (page === "privacy" || page === "terms" || page === "404") {
    base["@graph"].push({
      "@type": "WebPage",
      "@id": url,
      name: sectionTitle,
      url,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      inLanguage: "en-US",
    });
  }

  return base;
};
