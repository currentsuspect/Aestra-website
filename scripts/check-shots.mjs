#!/usr/bin/env node
// Every release screenshot ships as PNG (the fallback) plus a WebP sibling
// (what browsers actually download, about a third of the size). The changelog
// <picture> points at the .webp, and a <picture> source does not fall back to
// the <img> when it 404s, so a missing sibling would be a broken image.
//
//   node scripts/check-shots.mjs          check
//   node scripts/check-shots.mjs --write  make the missing WebPs (needs ImageMagick)
import { readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = new URL("../public/changelog/", import.meta.url).pathname;
const write = process.argv.includes("--write");

const pngs = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".png")) pngs.push(p);
  }
};
if (existsSync(ROOT)) walk(ROOT);

const missing = pngs.filter((p) => !existsSync(p.replace(/\.png$/, ".webp")));
if (missing.length && write) {
  for (const p of missing) {
    execFileSync("magick", [p, "-quality", "82", "-define", "webp:method=6", "-define", "webp:sns-strength=70", p.replace(/\.png$/, ".webp")]);
    console.log(`wrote ${p.replace(/\.png$/, ".webp").replace(ROOT, "")}`);
  }
  process.exit(0);
}
if (missing.length) {
  console.error(`check-shots: ${missing.length} changelog screenshot(s) have no .webp sibling:`);
  for (const p of missing) console.error(`  ${p.replace(ROOT, "public/changelog/")}`);
  console.error("Run: node scripts/check-shots.mjs --write");
  process.exit(1);
}
console.log(`check-shots: ${pngs.length} screenshots, all have a WebP`);
