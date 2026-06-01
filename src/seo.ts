export const SITE = {
  name: "Aestra",
  url: "https://aestra.studio",
  description:
    "Aestra is an accessible, premium native digital audio workstation built around speed, stability, and producer-first workflow.",
  twitter: "@aestrastudios",
  twitterUrl: "https://x.com/aestrastudios",
  github: "https://github.com/currentsuspect/Aestra",
  organization: {
    "@context": "https://schema.org",
    "@id": "https://aestra.studio/#organization",
    name: "Aestra Studios",
  },
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
        item: "https://aestra.studio/",
      },
    ],
  };

  if (page !== "home") {
    (breadcrumb.itemListElement as { position: number; name: string; item: string }[]).push({
      position: 2,
      name: sectionTitle,
      item: url,
    });
  }

  base["@graph"].push(breadcrumb);

  if (page === "changelog") {
    base["@graph"].push({
      "@type": "ItemList",
      "@id": `${url}#changelog`,
      name: "Aestra changelog",
      description: "Release history and development progress for the Aestra DAW.",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    });
  }

  if (page === "pricing") {
    base["@graph"].push({
      "@type": "Product",
      "@id": `${url}#product`,
      name: "Aestra",
      description:
        "A native C++ digital audio workstation. Free core, optional Supporter and Founder tiers.",
      brand: { "@id": "https://aestra.studio/#organization" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: 0,
        highPrice: 129,
        offerCount: 3,
        offers: [
          {
            "@type": "Offer",
            name: "Core",
            price: 0,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Supporter",
            price: 5,
            priceCurrency: "USD",
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/PreOrder",
          },
          {
            "@type": "Offer",
            name: "Founder",
            price: 129,
            priceCurrency: "USD",
            availability: "https://schema.org/LimitedAvailability",
          },
        ],
      },
    });
  }

  if (page === "download") {
    base["@graph"].push({
      "@type": "SoftwareApplication",
      "@id": `${url}#download`,
      name: "Aestra",
      operatingSystem: "Windows 10+, macOS 12+, Linux",
      applicationCategory: "MultimediaApplication",
      softwareVersion: "0.1.1",
      downloadUrl: url,
    });
  }

  if (page === "about") {
    base["@graph"].push({
      "@type": "AboutPage",
      "@id": `${url}#about`,
      name: "About Aestra Studios",
      url,
      mainEntity: { "@id": "https://aestra.studio/#organization" },
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
      author: { "@id": "https://aestra.studio/#founder" },
      publisher: { "@id": "https://aestra.studio/#organization" },
      inLanguage: "en-US",
    });
  }

  if (page === "privacy" || page === "terms") {
    base["@graph"].push({
      "@type": "WebPage",
      "@id": url,
      name: sectionTitle,
      url,
      isPartOf: { "@id": "https://aestra.studio/#website" },
      inLanguage: "en-US",
    });
  }

  if (page === "home") {
    base["@graph"].push({
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: "Aestra — Make music, not excuses.",
      isPartOf: { "@id": "https://aestra.studio/#website" },
      inLanguage: "en-US",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://aestra.studio/og-image.svg",
        width: 1200,
        height: 630,
      },
    });
  }

  return base;
};
