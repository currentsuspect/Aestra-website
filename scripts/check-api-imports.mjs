#!/usr/bin/env node
// Fails the build when a file that ships inside a Vercel Function imports a
// relative path without an explicit file extension.
//
// Why this exists: package.json sets "type": "module", and Vercel transpiles
// api/ per-file rather than bundling it. Node's ESM resolver therefore needs
// the extension at runtime. tsconfig uses moduleResolution "bundler", which
// accepts the extensionless form, so `tsc --noEmit` reports nothing and the
// build succeeds -- the function then throws ERR_MODULE_NOT_FOUND on every
// invocation. That happened in production once; this check is why it will not
// happen again quietly.
//
// Run `npm run check:function` for the heavier end-to-end version, which
// builds the real artifact and imports it.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

// Directories whose files are transpiled into the function output as-is.
const ROOTS = ["api", "shared"];
const SOURCE = /\.(ts|tsx|mts|js|mjs|jsx)$/;
const HAS_EXTENSION = /\.(js|mjs|cjs|json|node)$/;

// import x from "y" / export * from "y" / import("y")
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*)(["'])([^"']+)\1/g;

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // root does not exist yet; nothing to check
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (SOURCE.test(entry.name)) yield path;
  }
}

const problems = [];

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const source = stripComments(await readFile(file, "utf8"));
    for (const [, , specifier] of source.matchAll(SPECIFIER)) {
      if (!specifier.startsWith(".")) continue; // bare specifiers resolve via node_modules
      if (HAS_EXTENSION.test(specifier)) continue;
      problems.push({ file: relative(process.cwd(), file), specifier });
    }
  }
}

if (problems.length > 0) {
  console.error("\nRelative imports in Vercel Function code must include a file extension.");
  console.error("Without it the build still succeeds and every invocation fails at runtime.\n");
  for (const { file, specifier } of problems) {
    console.error(`  ${file}`);
    console.error(`    "${specifier}"  ->  "${specifier}.js"\n`);
  }
  process.exit(1);
}

console.log(`api imports ok (${ROOTS.join(", ")})`);
