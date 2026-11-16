#!/usr/bin/env node
// The Content-Security-Policy lives in vercel.json (a header, so it can carry
// frame-ancestors and applies before any HTML is parsed). script-src has no
// 'unsafe-inline': each executable inline <script> is allowed by its SHA-256 hash.
// If someone edits the inline theme bootstrap in index.html, its hash changes and
// the page would silently stop working in production, so this check runs after
// the build, reads every built HTML file, and fails with the hash to paste in.
//
//   node scripts/check-csp.mjs          check dist/ against vercel.json
//   node scripts/check-csp.mjs --print  print the hashes the built pages need
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const DIST = join(ROOT, "dist");

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) htmlFiles.push(p);
  }
};
walk(DIST);

// Executable inline scripts only: JSON-LD and other data blocks are not governed by script-src.
const EXECUTABLE = /^(|module|text\/javascript|application\/javascript)$/i;
const needed = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue;
    const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs) || [, ""])[1];
    if (!EXECUTABLE.test(type) || m[2].trim() === "") continue;
    const hash = "sha256-" + createHash("sha256").update(m[2], "utf8").digest("base64");
    (needed.get(hash) || needed.set(hash, []).get(hash)).push(file.replace(DIST, "dist"));
  }
}

if (process.argv.includes("--print")) {
  for (const h of needed.keys()) console.log(`'${h}'`);
  process.exit(0);
}

const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
const csp = config.headers
  .flatMap((h) => (h.source === "/(.*)" ? h.headers : []))
  .find((h) => h.key === "Content-Security-Policy")?.value;
if (!csp) { console.error("check-csp: no Content-Security-Policy header for /(.*) in vercel.json"); process.exit(1); }

const directive = (name) => csp.split(";").map((s) => s.trim()).find((s) => s.startsWith(name + " "))?.split(/\s+/).slice(1) ?? [];
const scriptSrc = directive("script-src");
const problems = [];
if (scriptSrc.includes("'unsafe-inline'")) problems.push("script-src allows 'unsafe-inline'");
if (scriptSrc.includes("'unsafe-eval'")) problems.push("script-src allows 'unsafe-eval'");
for (const [hash, files] of needed) {
  if (!scriptSrc.includes(`'${hash}'`)) problems.push(`inline script in ${[...new Set(files)].slice(0, 3).join(", ")} is not allowed: add '${hash}' to script-src`);
}
const allowed = scriptSrc.filter((s) => s.startsWith("'sha256-"));
for (const a of allowed) if (!needed.has(a.slice(1, -1))) problems.push(`script-src lists ${a}, which no built page uses (stale hash: remove it)`);
for (const need of ["frame-ancestors", "base-uri", "object-src", "form-action"]) if (directive(need).length === 0) problems.push(`missing ${need}`);

if (problems.length) {
  console.error("check-csp:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`check-csp: ${htmlFiles.length} pages, ${needed.size} inline script hash(es), no unsafe-inline in script-src`);
