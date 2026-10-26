// Post a released changelog entry to the Discord #changelog channel through
// its webhook (DISCORD_CHANGELOG_WEBHOOK). Same source as the site's changelog.
//   node scripts/changelog-discord.mjs <file…>         post these files
//   node scripts/changelog-discord.mjs --since <sha>   post files that became
//                                                      "released" since <sha>
//   add --dry-run to print the message instead of posting.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const DIR = "src/content/changelog";
const LINK = "https://www.aestra.studio/changelog";
const AVATAR = "https://www.aestra.studio/favicon-512.png";
const LIMIT = 2000; // Discord message cap
const HEADINGS = { new: "New", fix: "Fixed", perf: "Faster", security: "Security" }; // docs and ci stay on the site

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sinceAt = args.indexOf("--since");
const since = sinceAt >= 0 ? args[sinceAt + 1] : null;
const named = args.filter((a, i) => !a.startsWith("--") && (sinceAt < 0 || i !== sinceAt + 1));

const parse = (source) => {
  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fm) return null;
  const fields = Object.fromEntries(
    fm[1].split(/\r?\n/).filter(Boolean).map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]),
  );
  const lines = source.slice(fm[0].length).trim().split(/\r?\n/);
  const first = lines.findIndex((l) => l.startsWith("- **"));
  const summary = lines.slice(0, first).join(" ").trim();
  const entries = lines.slice(first).map((l) => l.match(/^- \*\*([a-z]+)\*\*:\s+(.+)$/)).filter(Boolean)
    .map((m) => ({ type: m[1], text: m[2] }));
  return { ...fields, summary, entries };
};

const statusAt = (rev, path) => {
  try {
    return parse(execFileSync("git", ["show", `${rev}:${path}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }))?.status;
  } catch {
    return undefined; // file did not exist at rev
  }
};

// The first sentence keeps each line short enough for one Discord message.
const short = (text) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;

const format = (r) => {
  const head = `# ${r.version} (${r.date})\n${r.summary}\n`;
  const tail = `\nFull notes: <${LINK}>`;
  const lines = [];
  for (const [type, heading] of Object.entries(HEADINGS)) {
    const items = r.entries.filter((e) => e.type === type);
    if (items.length) lines.push(`\n**${heading}**`, ...items.map((e) => `- ${short(e.text)}`));
  }
  let body = "";
  for (let i = 0; i < lines.length; i++) {
    const more = `\n…and ${lines.slice(i).filter((l) => l.startsWith("- ")).length} more`;
    if ((head + body + lines[i] + "\n" + more + tail).length > LIMIT) return head + body + more + tail;
    body += lines[i] + "\n";
  }
  return (head + body + tail).slice(0, LIMIT);
};

let files = named;
if (since) {
  const changed = execFileSync("git", ["diff", "--name-only", since, "HEAD", "--", DIR], { encoding: "utf8" })
    .split("\n").filter((f) => f.endsWith(".md"));
  files = changed.filter((f) => statusAt("HEAD", f) === "released" && statusAt(since, f) !== "released");
}
if (files.length === 0) {
  console.log("No newly released changelog entries.");
  process.exit(0);
}

const webhook = process.env.DISCORD_CHANGELOG_WEBHOOK;
if (!dryRun && !webhook) throw new Error("DISCORD_CHANGELOG_WEBHOOK is not set");

for (const file of files) {
  const release = parse(readFileSync(file, "utf8"));
  if (!release || release.status !== "released") {
    console.log(`Skipping ${file}: not released`);
    continue;
  }
  const content = format(release);
  if (dryRun) {
    console.log(`--- ${file} (${content.length} chars)\n${content}`);
    continue;
  }
  const res = await fetch(`${webhook}?wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, username: "Aestra Changelog", avatar_url: AVATAR, allowed_mentions: { parse: [] } }),
  });
  console.log(`Discord: ${res.status} ${res.statusText} for ${release.version}`);
  if (res.status >= 400) process.exit(1);
}
