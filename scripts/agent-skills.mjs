#!/usr/bin/env node
/**
 * Agent Skills discovery index — build and verify.
 *
 *   node scripts/agent-skills.mjs           # verify (exit 1 on any problem)
 *   node scripts/agent-skills.mjs --write   # regenerate index.json from disk
 *
 * Once outside agents are told "use Aestra's recovery skills", the published
 * artifacts are a contract. Two things must hold, and neither is self-evident
 * from reading the files:
 *
 *   1. Every digest in index.json matches the bytes actually served. A stale
 *      digest doesn't degrade gracefully — a conforming client refuses the
 *      download, so the skill silently disappears.
 *   2. Every artifact is spec-valid. The discovery RFC says clients MUST skip
 *      entries whose `type` they don't recognise, so a typo there is invisible
 *      locally and total in production.
 *
 * Conformance targets:
 *   discovery index — https://github.com/cloudflare/agent-skills-discovery-rfc (v0.2.0)
 *   SKILL.md format — https://agentskills.io/specification
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const WELL_KNOWN = join(PUBLIC, ".well-known", "agent-skills");
const INDEX = join(WELL_KNOWN, "index.json");
const SKILLS_ROOT = join(WELL_KNOWN, "recovery");

/* Pinned by the v0.2.0 discovery RFC. Not a guess — changing it changes which
   schema clients validate against. */
const SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json";
const VALID_TYPES = new Set(["skill-md", "archive"]);
const NAME_RE = /^(?!-)(?!.*--)[a-z0-9-]{1,64}(?<!-)$/;
const DIGEST_RE = /^sha256:[0-9a-f]{64}$/;
const MAX_DESCRIPTION = 1024;

const write = process.argv.includes("--write");
const problems = [];
const fail = (m) => problems.push(m);

const sha256 = (buf) => "sha256:" + createHash("sha256").update(buf).digest("hex");

/** Every versioned skill directory on disk: recovery/<version>/<name>/SKILL.md */
function discover() {
  const found = [];
  if (!existsSync(SKILLS_ROOT)) return found;
  for (const version of readdirSync(SKILLS_ROOT).sort()) {
    const vdir = join(SKILLS_ROOT, version);
    if (!statSync(vdir).isDirectory()) continue;
    for (const name of readdirSync(vdir).sort()) {
      const sdir = join(vdir, name);
      if (!statSync(sdir).isDirectory()) continue;
      const file = join(sdir, "SKILL.md");
      if (!existsSync(file)) {
        fail(`${version}/${name}: directory has no SKILL.md`);
        continue;
      }
      found.push({ version, name, file });
    }
  }
  return found;
}

/** Minimal YAML frontmatter reader — enough for the fields the spec defines. */
function frontmatter(raw, label) {
  if (!raw.startsWith("---\n")) {
    fail(`${label}: missing YAML frontmatter`);
    return null;
  }
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    fail(`${label}: frontmatter is not terminated`);
    return null;
  }
  const fm = {};
  for (const line of raw.slice(4, end).split("\n")) {
    if (!line.trim() || line.startsWith("  ") || line.startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i === -1) continue;
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return fm;
}

function validateSkill({ version, name, file }) {
  const label = `${version}/${name}/SKILL.md`;
  const bytes = readFileSync(file);
  const fm = frontmatter(bytes.toString("utf8"), label);
  if (!fm) return null;

  if (!NAME_RE.test(name)) fail(`${label}: directory name "${name}" is not a valid skill name`);
  if (fm.name !== name) fail(`${label}: frontmatter name "${fm.name}" != parent directory "${name}"`);
  if (!fm.description) {
    fail(`${label}: frontmatter has no description`);
  } else if (fm.description.length > MAX_DESCRIPTION) {
    fail(`${label}: description is ${fm.description.length} chars (max ${MAX_DESCRIPTION})`);
  }

  return {
    name,
    type: "skill-md",
    description: fm.description ?? "",
    url: "/" + relative(PUBLIC, file).split(/[\\/]/).join("/"),
    digest: sha256(bytes),
  };
}

const skills = discover().map(validateSkill).filter(Boolean);

if (skills.length === 0) fail("no skills discovered under public/.well-known/agent-skills/recovery/");

const built = { $schema: SCHEMA, skills };

if (write) {
  if (problems.length) {
    console.error("Refusing to write an index with unresolved problems:\n");
    for (const p of problems) console.error("  ✗ " + p);
    process.exit(1);
  }
  writeFileSync(INDEX, JSON.stringify(built, null, 2) + "\n");
  console.log(`Wrote ${relative(ROOT, INDEX)} — ${skills.length} skills.`);
  process.exit(0);
}

/* ── Verify the committed index against what is actually on disk ── */
if (!existsSync(INDEX)) {
  fail("index.json does not exist — run with --write");
} else {
  let current;
  try {
    current = JSON.parse(readFileSync(INDEX, "utf8"));
  } catch (e) {
    fail(`index.json is not valid JSON: ${e.message}`);
  }

  if (current) {
    if (current.$schema !== SCHEMA) {
      fail(`index.json $schema is "${current.$schema}", expected "${SCHEMA}"`);
    }
    if (!Array.isArray(current.skills)) {
      fail("index.json has no skills array");
    } else {
      const onDisk = new Map(built.skills.map((s) => [s.url, s]));
      const seen = new Set();

      for (const entry of current.skills) {
        const id = entry.url ?? entry.name ?? "<unnamed>";
        for (const field of ["name", "type", "description", "url", "digest"]) {
          if (!entry[field]) fail(`${id}: missing required field "${field}"`);
        }
        if (entry.type && !VALID_TYPES.has(entry.type)) {
          fail(`${id}: type "${entry.type}" is not one of ${[...VALID_TYPES].join(", ")} — conforming clients will skip this entry`);
        }
        if (entry.name && !NAME_RE.test(entry.name)) fail(`${id}: invalid name "${entry.name}"`);
        if (entry.digest && !DIGEST_RE.test(entry.digest)) {
          fail(`${id}: digest "${entry.digest}" is not sha256:<64 lowercase hex>`);
        }
        if (entry.description && entry.description.length > MAX_DESCRIPTION) {
          fail(`${id}: description exceeds ${MAX_DESCRIPTION} chars`);
        }

        const actual = onDisk.get(entry.url);
        if (!actual) {
          fail(`${id}: url does not resolve to a SKILL.md under public/`);
          continue;
        }
        seen.add(entry.url);
        if (entry.digest !== actual.digest) {
          fail(`${id}: digest is stale\n      index: ${entry.digest}\n      bytes: ${actual.digest}`);
        }
        if (entry.name !== actual.name) fail(`${id}: name "${entry.name}" != skill "${actual.name}"`);
        if (entry.description !== actual.description) {
          fail(`${id}: description differs from the SKILL.md frontmatter`);
        }
      }

      for (const url of onDisk.keys()) {
        if (!seen.has(url)) fail(`${url}: published on disk but absent from index.json`);
      }
    }
  }
}

if (problems.length) {
  console.error(`\nAgent skills index: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error("  ✗ " + p);
  console.error("\nRun `npm run skills:write` to regenerate index.json from disk.\n");
  process.exit(1);
}

console.log(`Agent skills index OK — ${skills.length} skills, digests verified against bytes on disk.`);
