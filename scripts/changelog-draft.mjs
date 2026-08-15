#!/usr/bin/env node
/**
 * changelog-draft — build the next changelog entry from merged PRs.
 *
 * The website changelog kept drifting because reconstructing what a
 * producer cares about from 400 engineering commits is a day's work
 * nobody schedules. So PRs carry their own one-line "Producer note"
 * (see .github/pull_request_template.md in the Aestra repo) and this
 * script just collects them.
 *
 * It deliberately does NOT write to changelogData.ts. The output is a
 * draft to read, edit and paste — an automated writer would happily
 * invent a feature or a pricing tier, which is exactly the mistake
 * this is meant to prevent.
 *
 *   node scripts/changelog-draft.mjs
 *   node scripts/changelog-draft.mjs --since 2026-05-29
 *   node scripts/changelog-draft.mjs --repo owner/name --limit 500
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHANGELOG = resolve(HERE, "../src/changelogData.ts");

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const REPO = arg("repo", "currentsuspect/Aestra");
const LIMIT = arg("limit", "400");

/* ── Where to start from ──────────────────────────────────────────
   The newest *released* entry is the boundary: anything merged after it
   belongs to the next release. Entries live as markdown files under
   src/content/changelog/ with frontmatter (version/date/status); the
   changelogData.ts module is just the parser. */
function lastReleaseDate() {
  const dir = resolve(HERE, "../src/content/changelog");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const dateRe = /^date:\s*(.+)$/m;
  const statusRe = /^status:\s*(.+)$/m;
  let newest = null;
  for (const file of files) {
    const src = readFileSync(resolve(dir, file), "utf8");
    const status = (src.match(statusRe) || [])[1]?.trim();
    if (status !== "released") continue;
    const rawDate = (src.match(dateRe) || [])[1]?.trim();
    if (!rawDate) continue;
    const d = new Date(rawDate);
    if (!isNaN(d) && (!newest || d > newest)) newest = d;
  }
  if (!newest) throw new Error("No released entry found in src/content/changelog/");
  // Format from local parts. toISOString() would shift a locally-parsed
  // date back a day in western timezones and widen the window silently.
  const pad = (n) => String(n).padStart(2, "0");
  return `${newest.getFullYear()}-${pad(newest.getMonth() + 1)}-${pad(newest.getDate())}`;
}

const since = arg("since", lastReleaseDate());

/* ── Fetch merged PRs ─────────────────────────────────────────── */
let prs;
try {
  const out = execFileSync("gh", [
    "pr", "list", "--repo", REPO, "--state", "merged",
    "--search", `merged:>=${since}`,
    "--json", "number,title,body,mergedAt,url",
    "--limit", LIMIT,
  ], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  prs = JSON.parse(out);
} catch (e) {
  console.error(`\ngh failed. Is the CLI installed and authenticated?\n  ${e.message}\n`);
  process.exit(1);
}

/* ── Extract the Producer note block ──────────────────────────── */
function producerNote(body = "") {
  const m = body.match(/##\s*Producer note\s*\n([\s\S]*?)(?=\n##\s|\s*$)/i);
  if (!m) return null;
  const text = m[1]
    .replace(/<!--[\s\S]*?-->/g, "")   // strip the template's guidance comment
    .split("\n").map((l) => l.trim())
    .filter(Boolean)
    .join(" ")
    .trim();
  // Reject "None" and its variants ("n/a", "-", "None for …"), which are
  // placeholders, not producer notes. Anything beginning with these is
  // junk that would otherwise ship into the changelog (e.g. "None for
  // 0.5.0-min side of things.").
  if (!text) return null;
  const lowered = text.toLowerCase();
  if (/^none(\b|$)/.test(lowered) || /^n\/?a(\b|$)/.test(lowered) ||
      /^(tbd|todo)(\b|$)/.test(lowered) || /^[-–—…]/.test(text)) {
    return null;
  }
  return text;
}

/* Map the conventional-commit prefix onto the site's ChangeType. */
function changeType(title) {
  const p = (title.match(/^(\w+)/) || [])[1]?.toLowerCase();
  if (p === "feat") return "new";
  if (p === "fix") return "fix";
  if (p === "perf") return "perf";
  if (p === "security" || p === "sec") return "security";
  if (p === "docs") return "docs";
  if (["ci", "build", "chore", "test", "refactor", "style"].includes(p)) return "ci";
  return "new";
}

const noted = [];
const uncovered = [];
for (const pr of prs) {
  const note = producerNote(pr.body);
  if (note) noted.push({ ...pr, note, type: changeType(pr.title) });
  else if (/^(feat|fix|perf|security)/i.test(pr.title)) uncovered.push(pr);
}

/* ── Output ───────────────────────────────────────────────────── */
const ORDER = ["new", "fix", "perf", "security", "ci", "docs"];
noted.sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

console.log(`\n// merged into ${REPO} since ${since} — ${prs.length} PRs, ${noted.length} with a producer note\n`);
console.log(`  {
    ver: "Unreleased",
    date: "${new Date(since).toLocaleDateString("en-US", { month: "short", year: "numeric" })} – present",
    status: "active",
    summary: "TODO — one line on what this stretch is about.",
    changes: [`);
for (const n of noted) {
  console.log(`      { type: "${n.type}", text: "${esc(n.note)}" }, // #${n.number}`);
}
console.log(`    ],
  },`);

if (uncovered.length) {
  console.log(`\n/* ${uncovered.length} feat/fix PRs merged with no producer note.
   Scan these: add a note to anything a producer would notice, or
   confirm it's internal. This bucket is what stops another silent
   drift — five plugins shipped once without the site hearing. */`);
  for (const pr of uncovered) console.log(`   #${pr.number}  ${pr.title}`);
}
console.log("");
