import React, { memo, useMemo, useState, useCallback } from "react";
import { Activity, CalendarDays, ArrowRight } from "lucide-react";

import { cn } from "../lib";
import { Badge, Button } from "../components/ui";
import { RELEASES } from "../changelogData";
import type { ChangeType, Release } from "../changelogData";
import type { PageProps } from "../types";

const typeColors: Record<ChangeType, string> = {
  new:      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  fix:      "bg-rose-500/10 text-rose-300 border-rose-500/20",
  security: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  ci:       "bg-blue-500/10 text-blue-300 border-blue-500/20",
  perf:     "bg-sky-500/10 text-sky-300 border-sky-500/20",
  docs:     "bg-surface-3 text-fg-muted border-border-2",
};

const statusColors: Record<Release["status"], string> = {
  active:   "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  landed:   "bg-violet-500/10 text-violet-300 border-violet-500/20",
  released: "bg-surface-3 text-fg-muted border-border-2",
};

export const Changelog = memo(({ setPage }: PageProps) => {
  const releases = useMemo<Release[]>(() => RELEASES, []);

  const [activeType, setActiveType] = useState<"all" | ChangeType>("all");

  const visibleReleases = useMemo(() => {
    return releases
      .map((release) => ({
        ...release,
        changes: activeType === "all" ? release.changes : release.changes.filter((change) => change.type === activeType),
      }))
      .filter((release) => release.changes.length > 0);
  }, [activeType, releases]);

  const filters: { label: string; value: "all" | ChangeType }[] = [
    { label: "All",         value: "all" },
    { label: "New",         value: "new" },
    { label: "Fixes",       value: "fix" },
    { label: "Security",    value: "security" },
    { label: "CI",          value: "ci" },
    { label: "Performance", value: "perf" },
    { label: "Docs",        value: "docs" },
  ];

  const lastSynced = new Date("2026-06-01T00:00:00Z");

  return (
    <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div>
            <p className="kicker mb-3">Changelog</p>
            <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-3">
              What shipped, what's coming.
            </h1>
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Source synced from Aestra CHANGELOG.md through{" "}
                <time dateTime={lastSynced.toISOString().slice(0, 10)}>
                  {lastSynced.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </time>
              </span>
            </div>
          </div>
          <div className="flex items-center text-[13px] text-muted">
            <Activity className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" aria-hidden="true" />
            Unreleased line actively moving
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12" role="group" aria-label="Filter changes by type">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveType(filter.value)}
              aria-pressed={activeType === filter.value}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] border transition-colors",
                activeType === filter.value
                  ? "border-border-2 bg-surface-3 text-fg"
                  : "border-border text-muted hover:text-fg hover:border-border-2"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative border-l border-border ml-2 space-y-12">
          {visibleReleases.map((release, i) => (
            <div key={`${release.ver}-${release.date}-${i}`} className="relative pl-8 sm:pl-10">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface-3 ring-4 ring-bg" />

              <div className="mb-5">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">{release.ver}</h2>
                  <span className={cn("text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border", statusColors[release.status])}>
                    {release.status}
                  </span>
                </div>
                <div className="text-[13px] text-muted font-mono">{release.date}</div>
                <p className="text-fg-muted text-[15px] mt-3 leading-relaxed">{release.summary}</p>
              </div>

              <ul className="space-y-2.5">
                {release.changes.map((change, j) => (
                  <li key={j} className="flex items-start gap-3 text-[14px] text-fg-muted leading-relaxed">
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider mt-1 shrink-0", typeColors[change.type])}>
                      {change.type}
                    </span>
                    <span>{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-border/80 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setPage("docs")}>
            Open docs
          </Button>
          <a
            href="https://github.com/currentsuspect/Aestra/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 h-10 text-sm text-fg-muted hover:text-fg hover:border-border-2 transition-colors"
          >
            Open canonical CHANGELOG.md <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
});
