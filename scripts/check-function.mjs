#!/usr/bin/env node
// End-to-end check: build the real Vercel Function output and invoke it.
//
// This is deliberately NOT part of `npm run build`. Vercel's own build runs
// `npm run build`, so calling `vercel build` from inside it would recurse.
// Run it locally before merging anything that touches api/:
//
//   npm run check:function
//
// The cheap static guard that does run on every build is
// scripts/check-api-imports.mjs.

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ENTRY = ".vercel/output/functions/api/waitlist.func/api/waitlist.js";

console.log("building function output...");
execFileSync("npx", ["vercel", "build", "--yes"], { stdio: "inherit" });

const url = pathToFileURL(resolve(ENTRY)).href;
console.log(`importing ${ENTRY}`);
const mod = await import(url);

const handler = mod.default?.fetch;
if (typeof handler !== "function") {
  console.error("function does not export a default { fetch } handler");
  process.exit(1);
}

// Exercise the handler. GET short-circuits to 405 before any bot/origin check,
// so this needs no network, no credentials, and no Vercel request context.
const response = await handler(
  new Request("https://www.aestra.studio/api/waitlist", { method: "GET" }),
);

if (response.status !== 405 || response.headers.get("allow") !== "POST") {
  console.error(`unexpected response: ${response.status} allow=${response.headers.get("allow")}`);
  process.exit(1);
}

console.log("function loads and responds (405 + Allow: POST)");
