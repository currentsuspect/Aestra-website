export type ChangeType = "new" | "fix" | "security" | "ci" | "perf" | "docs";

export type Change = {
  type: ChangeType;
  text: string;
};

export type Release = {
  version: string;
  date: string;
  status: "active" | "landed" | "released";
  summary: string;
  entries: Change[];
};

const releaseFiles = import.meta.glob("./content/changelog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const changeTypes = new Set<ChangeType>([
  "new",
  "fix",
  "security",
  "ci",
  "perf",
  "docs",
]);
const statuses = new Set<Release["status"]>(["active", "landed", "released"]);

type ParsedRelease = Release & { order: number };

const parseRelease = (path: string, source: string): ParsedRelease => {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) {
    throw new Error(`${path}: missing changelog frontmatter`);
  }

  const fields = Object.fromEntries(
    frontmatter[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator < 1) throw new Error(`${path}: invalid frontmatter line "${line}"`);
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );

  const version = fields.version;
  const date = fields.date;
  const status = fields.status as Release["status"];
  const order = Number(fields.order);
  if (!version || !date || !statuses.has(status) || !Number.isFinite(order)) {
    throw new Error(`${path}: frontmatter requires version, date, status, and numeric order`);
  }

  const body = source.slice(frontmatter[0].length).trim();
  const lines = body.split(/\r?\n/);
  const firstEntry = lines.findIndex((line) => line.startsWith("- **"));
  if (firstEntry < 1) {
    throw new Error(`${path}: expected a summary followed by changelog entries`);
  }

  const summary = lines.slice(0, firstEntry).join(" ").trim();
  const entries = lines.slice(firstEntry).filter(Boolean).map((line) => {
    const match = line.match(/^- \*\*([a-z]+)\*\*:\s+(.+)$/);
    if (!match || !changeTypes.has(match[1] as ChangeType)) {
      throw new Error(`${path}: invalid changelog entry "${line}"`);
    }
    return { type: match[1] as ChangeType, text: match[2] };
  });

  if (!summary || entries.length === 0) {
    throw new Error(`${path}: summary and entries must not be empty`);
  }

  return { version, date, status, summary, entries, order };
};

export const RELEASES: Release[] = Object.entries(releaseFiles)
  .map(([path, source]) => parseRelease(path, source))
  .sort((a, b) => a.order - b.order)
  .map(({ order: _order, ...release }) => release);
