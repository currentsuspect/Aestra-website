import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import process from "node:process";

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const DIST_DIR = resolve("dist");
const CANONICAL_ORIGIN = "https://www.aestra.studio";
const CONTENT_TIMEOUT_MS = 60_000;

const routes = [
  { path: "/", output: "index.html", threshold: 500 },
  { path: "/features", output: "features/index.html", threshold: 500 },
  { path: "/pricing", output: "pricing/index.html", threshold: 500 },
  { path: "/changelog", output: "changelog/index.html", threshold: 3_000 },
  { path: "/docs", output: "docs/index.html", threshold: 500 },
  { path: "/download", output: "download/index.html", threshold: 500 },
  { path: "/plugins", output: "plugins/index.html", threshold: 500 },
  { path: "/privacy", output: "privacy/index.html", threshold: 500 },
  { path: "/terms", output: "terms/index.html", threshold: 500 },
  { path: "/about", output: "about/index.html", threshold: 500 },
  { path: "/roadmap", output: "roadmap/index.html", threshold: 500 },
  { path: "/404", output: "404/index.html", threshold: 500 },
];

const excludedRoutes = ["/login", "/account", "/recovery"];

const launchBrowser = async () =>
  puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }),
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const normalizedTextLength = (html) => {
  const body = html.match(/<body[^>]*>(.*)<\/body>/s)?.[1] ?? "";
  const withoutCode = body.replace(/<(script|style)[^>]*>.*?<\/\1>/gs, " ");
  const withoutTags = withoutCode.replace(/<[^>]+>/g, " ");
  return withoutTags.split(/\s+/).filter(Boolean).join(" ").length;
};

const canonicalFor = (path) =>
  `${CANONICAL_ORIGIN}${path === "/" ? "/" : path}`;

const serveDist = async () => {
  const fallback = await readFile(join(DIST_DIR, "index.html"));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url ?? "/", "http://localhost").pathname,
      );
      const candidate = resolve(DIST_DIR, `.${pathname}`);
      const insideDist =
        candidate === DIST_DIR || candidate.startsWith(`${DIST_DIR}${sep}`);

      if (insideDist) {
        const staticCandidate = extname(candidate)
          ? candidate
          : join(candidate, "index.html");
        try {
          const body = await readFile(staticCandidate);
          response.writeHead(200, {
            "Content-Type":
              mimeTypes[extname(staticCandidate)] ?? "application/octet-stream",
          });
          response.end(body);
          return;
        } catch (error) {
          if (error?.code !== "ENOENT") throw error;
        }
      }

      response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
      response.end(fallback);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(String(error));
    }
  });

  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Prerender server did not expose a TCP port");
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolveClose, reject) => {
      server.close((error) => error ? reject(error) : resolveClose());
    }),
  };
};

const assertHead = async (page, route) => {
  const head = await page.evaluate(() => ({
    title: document.title,
    description:
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    canonical:
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    ogTitle:
      document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
    ogDescription:
      document.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? "",
    ogUrl:
      document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "",
    robots:
      document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
  }));

  const expectedCanonical = canonicalFor(route.path);
  if (
    !head.title ||
    !head.description ||
    head.canonical !== expectedCanonical ||
    head.ogTitle !== head.title ||
    head.ogDescription !== head.description ||
    head.ogUrl !== expectedCanonical
  ) {
    throw new Error(
      `${route.path}: invalid route head ${JSON.stringify(head)}`,
    );
  }

  if (route.path === "/" && !head.title.includes("Make music, not excuses.")) {
    throw new Error("/: homepage title lost the required tagline");
  }

  if (route.path === "/404" && head.robots !== "noindex, nofollow") {
    throw new Error(`/404: expected noindex, nofollow, got "${head.robots}"`);
  }

  return head;
};

const assertDownloadAnchors = async (page) => {
  const actions = await page.evaluate(() =>
    [...document.querySelectorAll("a")].flatMap((anchor) => {
      const text = anchor.textContent?.replace(/\s+/g, " ").trim() ?? "";
      if (!text.includes("Find build in CI") && !text.includes("View source")) {
        return [];
      }
      return [{ text, href: anchor.getAttribute("href") ?? "" }];
    }),
  );

  if (actions.length !== 4) {
    throw new Error(`/download: expected 4 download anchors, found ${actions.length}`);
  }

  for (const action of actions) {
    let url;
    try {
      url = new URL(action.href, CANONICAL_ORIGIN);
    } catch {
      throw new Error(`/download: invalid href for "${action.text}": ${action.href}`);
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error(`/download: unresolvable href for "${action.text}": ${action.href}`);
    }
  }
};

const assertVisualGeometry = async (page, route) => {
  const result = await page.evaluate(() => {
    const flows = [...document.querySelectorAll("[data-signal-flow]")];
    const problems = [];

    for (const flow of flows) {
      const nodes = [...flow.querySelectorAll("[data-signal-node-id]")];
      const indicators = [...flow.querySelectorAll("[data-signal-indicator-for]")];

      for (const indicator of indicators) {
        const id = indicator.getAttribute("data-signal-indicator-for");
        const node = nodes.find((candidate) => candidate.getAttribute("data-signal-node-id") === id);
        if (!node) {
          problems.push(`${flow.getAttribute("data-signal-flow")}: missing node ${id}`);
          continue;
        }

        const nodeX = Number(node.getAttribute("cx"));
        const nodeY = Number(node.getAttribute("cy"));
        const indicatorX = Number(indicator.getAttribute("cx"));
        const indicatorY = Number(indicator.getAttribute("cy"));
        if (nodeX !== indicatorX || nodeY !== indicatorY) {
          problems.push(
            `${flow.getAttribute("data-signal-flow")}:${id} node(${nodeX},${nodeY}) indicator(${indicatorX},${indicatorY})`,
          );
        }
      }
    }

    return {
      flowCount: flows.length,
      indicatorCount: document.querySelectorAll("[data-signal-indicator-for]").length,
      problems,
    };
  });

  if (["/", "/features"].includes(route.path) && result.flowCount === 0) {
    throw new Error(`${route.path}: expected a signal-flow diagram`);
  }
  if (route.path === "/" && result.indicatorCount === 0) {
    throw new Error("/: expected a centered signal-flow input indicator");
  }
  if (result.problems.length > 0) {
    throw new Error(`${route.path}: signal-flow geometry mismatch: ${result.problems.join(" | ")}`);
  }
};

const prerender = async () => {
  const server = await serveDist();
  let browser;
  const snapshots = [];

  try {
    browser = await launchBrowser();
    for (const route of routes) {
      const page = await browser.newPage();
      const errors = [];
      page.on("console", (message) => {
        const ignoredBrowserPolicyNotice =
          /frame-ancestors.*ignored|X-Frame-Options may only be set via an HTTP header/i;
        if (
          message.type() === "error" &&
          !ignoredBrowserPolicyNotice.test(message.text())
        ) {
          errors.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

      try {
        await page.setUserAgent("Aestra-Prerender/1.0");
        await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
        await page.goto(`${server.origin}${route.path}`, {
          waitUntil: "networkidle0",
          timeout: CONTENT_TIMEOUT_MS,
        });
        await page.waitForFunction(
          (minimum) => {
            const content = document.querySelector("#main-content");
            const text = content?.textContent?.replace(/\s+/g, " ").trim() ?? "";
            return text.length >= minimum;
          },
          { timeout: CONTENT_TIMEOUT_MS },
          route.threshold,
        );

        const head = await assertHead(page, route);
        if (route.path === "/download") await assertDownloadAnchors(page);
        await assertVisualGeometry(page, route);

        // The prerender browser's color preference is a build-machine detail,
        // not a user preference. Leaving its data-theme attribute in the
        // snapshot would force every visitor into that theme before React
        // starts. The inline bootstrap restores a saved or OS-level choice
        // when the static document is parsed in the visitor's browser.
        await page.evaluate(() => {
          document.documentElement.removeAttribute("data-theme");
        });

        const html = await page.content();
        if (/<html[^>]*\sdata-theme=/i.test(html)) {
          throw new Error(`${route.path}: prerender leaked a build-time theme`);
        }
        const textLength = normalizedTextLength(html);
        if (textLength < route.threshold) {
          throw new Error(
            `${route.path}: raw HTML contains ${textLength} visible-text characters; requires ${route.threshold}`,
          );
        }

        if (route.path === "/changelog") {
          const required = [
            "Muse is awake",
            "AestraSat",
            "AestraOTT",
            "AestraFilter",
            "AestraLFO",
            "musical typing",
          ];
          for (const substring of required) {
            if (!html.includes(substring)) {
              throw new Error(`/changelog: missing required substring "${substring}"`);
            }
          }
        }

        if (errors.length > 0) {
          throw new Error(`${route.path}: browser runtime error(s): ${errors.join(" | ")}`);
        }

        snapshots.push({ ...route, html, textLength, head, errors });
        console.log(`prerender ${route.path}: ${textLength} characters`);
      } catch (error) {
        const diagnostic = await page.evaluate(() => {
          const content = document.querySelector("#main-content");
          return {
            mainTextLength:
              content?.textContent?.replace(/\s+/g, " ").trim().length ?? 0,
            rootHTMLLength: document.querySelector("#root")?.innerHTML.length ?? 0,
          };
        }).catch(() => ({ mainTextLength: 0, rootHTMLLength: 0 }));
        throw new Error(
          `${route.path}: ${error?.message ?? error}; diagnostics=${JSON.stringify(diagnostic)}; browser=${JSON.stringify(errors)}`,
          { cause: error },
        );
      } finally {
        await page.close();
      }
    }

    const titles = new Set(snapshots.map(({ head }) => head.title));
    const descriptions = new Set(snapshots.map(({ head }) => head.description));
    if (titles.size !== snapshots.length || descriptions.size !== snapshots.length) {
      throw new Error("Route titles and descriptions must be unique");
    }

    for (const route of excludedRoutes) {
      if (snapshots.some((snapshot) => snapshot.path === route)) {
        throw new Error(`${route}: excluded SPA route was unexpectedly prerendered`);
      }
    }

    // Do not create any route file until every in-memory snapshot has passed.
    for (const snapshot of snapshots) {
      const outputPath = join(DIST_DIR, snapshot.output);
      await mkdir(resolve(outputPath, ".."), { recursive: true });
      await writeFile(outputPath, snapshot.html);
    }

    // Vercel recognizes a root-level 404.html and serves it with an actual
    // 404 status when no static route matches. Keep /404 itself available too.
    const notFoundSnapshot = snapshots.find(({ path }) => path === "/404");
    if (!notFoundSnapshot) throw new Error("Missing /404 snapshot");
    await writeFile(join(DIST_DIR, "404.html"), notFoundSnapshot.html);

    return snapshots;
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
};

const hydrationWarningPattern =
  /hydration|hydrating|did not match|error-decoder\.html\?invariant=(418|423|425)/i;

const assertHydration = async (snapshots) => {
  const server = await serveDist();
  let browser;

  try {
    browser = await launchBrowser();
    for (const snapshot of snapshots) {
      const page = await browser.newPage();
      const warnings = [];
      page.on("console", (message) => {
        if (hydrationWarningPattern.test(message.text())) {
          warnings.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => {
        if (hydrationWarningPattern.test(error.message)) {
          warnings.push(`pageerror: ${error.message}`);
        }
      });

      try {
        await page.setUserAgent("Aestra-Prerender/1.0");
        await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
        await page.goto(`${server.origin}${snapshot.path}`, {
          waitUntil: "networkidle0",
          timeout: CONTENT_TIMEOUT_MS,
        });
        await page.waitForFunction(
          (minimum) => {
            const content = document.querySelector("#main-content");
            const text = content?.textContent?.replace(/\s+/g, " ").trim() ?? "";
            return text.length >= minimum;
          },
          { timeout: CONTENT_TIMEOUT_MS },
          snapshot.threshold,
        );
      } finally {
        await page.close();
      }

      if (warnings.length > 0) {
        throw new Error(
          `${snapshot.path}: hydration emitted ${warnings.length} warning(s): ${warnings.join(" | ")}`,
        );
      }
      console.log(`client ${snapshot.path}: 0 hydration warnings`);
    }
  } finally {
    if (browser) await browser.close();
    await server.close();
  }
};

try {
  const snapshots = await prerender();
  await assertHydration(snapshots);
} catch (error) {
  console.error(`Prerender failed: ${error?.stack ?? error}`);
  process.exitCode = 1;
}
