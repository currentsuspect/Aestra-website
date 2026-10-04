// Every preview scene must match a changelog entry, or a reworded entry silently loses its preview.
// Mirrors previewKey() in src/components/previews/index.ts; keep the two in step.
import { readdirSync, readFileSync } from "node:fs";

const key = (version, text) =>
  `${version}:${text.toLowerCase().replace(/-/g, " ").replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 6).join("-")}`;

const dir = "src/content/changelog";
const entries = new Map();
const versions = [];
for (const f of readdirSync(dir).filter((n) => n.endsWith(".md")).sort()) {
  const src = readFileSync(`${dir}/${f}`, "utf8");
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
  const version = fm.match(/^version:\s*(.+)$/m)[1].trim();
  versions.push(version);
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(/^- \*\*[a-z]+\*\*:\s+(.+)$/);
    if (m) entries.set(key(version, m[1]), `${version}: ${m[1].slice(0, 60)}`);
  }
}

const sceneDir = "src/components/previews";
const scenes = new Map();
for (const f of readdirSync(sceneDir).filter((n) => /^scenes.*\.tsx$/.test(n))) {
  const src = readFileSync(`${sceneDir}/${f}`, "utf8");
  for (const m of src.matchAll(/^\s*"([^"\n]+:[a-z0-9-]+)":\s*[A-Za-z_$]/gm)) scenes.set(m[1], f);
}

let bad = 0;
for (const [k, f] of scenes) {
  if (!entries.has(k)) {
    console.error(`check-previews: scene "${k}" (${f}) matches no changelog entry — entry reworded?`);
    bad++;
  }
}
// Previews cover v0.7.0 onward; older releases are text only.
const covered = new Set(versions.slice(0, versions.findIndex((v) => v.startsWith("v0.7.0")) + 1));
for (const [k, label] of entries) {
  if (covered.has(k.split(":")[0]) && !scenes.has(k)) console.warn(`check-previews: no preview for ${label}`);
}
if (bad) process.exit(1);
console.log(`check-previews: ${scenes.size} scenes, all match an entry`);
