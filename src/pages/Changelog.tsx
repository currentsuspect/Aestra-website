import React, { memo, useMemo, useState, useCallback } from "react";
import { Activity, CalendarDays, ArrowRight } from "lucide-react";

import { cn } from "../lib";
import { Badge, Button } from "../components/ui";
import type { PageProps } from "../types";

type ChangeType = "new" | "fix" | "security" | "ci" | "perf" | "docs";

type Change = {
  type: ChangeType;
  text: string;
};

type Release = {
  ver: string;
  date: string;
  status: "active" | "landed" | "released";
  summary: string;
  changes: Change[];
};

const typeColors: Record<ChangeType, string> = {
  new:      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  fix:      "bg-rose-500/10 text-rose-300 border-rose-500/20",
  security: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  ci:       "bg-blue-500/10 text-blue-300 border-blue-500/20",
  perf:     "bg-sky-500/10 text-sky-300 border-sky-500/20",
  docs:     "bg-zinc-800 text-zinc-300 border-zinc-700",
};

const statusColors: Record<Release["status"], string> = {
  active:   "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  landed:   "bg-violet-500/10 text-violet-300 border-violet-500/20",
  released: "bg-zinc-800 text-zinc-300 border-zinc-700",
};

export const Changelog = memo(({ setPage }: PageProps) => {
  const releases = useMemo<Release[]>(() => [
    {
      ver: "Unreleased",
      date: "Apr 08 – Apr 11, 2026",
      status: "active",
      summary: "Routing trust pass, security hardening sprint, and CI stability updates validated on develop.",
      changes: [
        { type: "new", text: "Routing trust pass: live sends, sidechain semantics, and solo/mute behavior tightened across real playback paths." },
        { type: "new", text: "Routing inspector polish and hot-path cleanup for send behavior (trust-focused April sprint)." },
        { type: "security", text: "Security hardening sprint landed with parser safeguards and dedicated red-team coverage." },
        { type: "security", text: "SEC-004 and SEC-008 follow-up fixes completed with reproducible validation paths." },
        { type: "ci", text: "MSVC scanner/build fixes landed; pipeline reliability improved for Windows CI gates." },
        { type: "ci", text: "Discord webhook payload handling fix to stabilize CI notifications." },
        { type: "fix", text: "Runtime review cleanup merged, including UI consistency and follow-up debt from prior review cycles." },
      ],
    },
    {
      ver: "Unreleased",
      date: "Apr 02 – Apr 05, 2026",
      status: "landed",
      summary: "Device resilience epic, export path fixes, and piano-roll/UI stabilization pass.",
      changes: [
        { type: "new", text: "Device resilience milestone: driver telemetry wiring, health polling, and hot-plug detection across audio backends." },
        { type: "new", text: "Offline export path reworked onto the proven render path to match real playback behavior." },
        { type: "fix", text: "Piano Roll interaction and minimap behavior polished for safer editing flow." },
        { type: "fix", text: "Code review findings fixed across export, RT audio, and headless test paths." },
        { type: "docs", text: "Technical docs and roadmap notes updated to reflect verified implementation state." },
        { type: "perf", text: "Low-memory build preset path reinforced for constrained development environments." },
      ],
    },
    {
      ver: "v0.1.1",
      date: "Dec 28, 2025",
      status: "released",
      summary: "ASIO support and major engine optimizations for callback stability and CPU load reduction.",
      changes: [
        { type: "new", text: "ASIO driver support with dual-tier startup failover and native COM integration." },
        { type: "perf", text: "Mixing-loop pan-law optimization and precomputed sinc interpolation tables for lower callback cost." },
        { type: "fix", text: "Master silence and routing-pointer invalidation issues fixed in engine graph compilation path." },
      ],
    },
    {
      ver: "v0.1.0",
      date: "Dec 23, 2025",
      status: "released",
      summary: "Initial public line with preview scrubbing, panel UX improvements, and foundational stability fixes.",
      changes: [
        { type: "new", text: "Real-time waveform scrubbing with seek/playhead UX and expanded preview duration flow." },
        { type: "new", text: "File preview panel improvements with richer metadata and empty-state UX." },
        { type: "fix", text: "Critical short-sample scrubbing crash/silence issues resolved in preview/audio handling path." },
        { type: "docs", text: "Project walkthrough index and early documentation structure added." },
      ],
    },
  ], []);

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

  return (
    <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div>
            <p className="kicker mb-3">Changelog</p>
            <h1 className="display text-4xl sm:text-5xl md:text-6xl text-zinc-50 mb-3">
              What shipped, what's coming.
            </h1>
            <div className="flex items-center gap-2 text-[13px] text-zinc-400">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Source synced from Aestra history through Apr 11, 2026</span>
            </div>
          </div>
          <div className="flex items-center text-[13px] text-zinc-400">
            <Activity className="w-3.5 h-3.5 mr-2" />
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
            Unreleased line actively moving
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveType(filter.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] border transition-colors",
                activeType === filter.value
                  ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative border-l border-zinc-800 ml-2 space-y-12">
          {visibleReleases.map((release, i) => (
            <div key={`${release.ver}-${release.date}-${i}`} className="relative pl-8 sm:pl-10">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700 ring-4 ring-[#0a0a0b]" />

              <div className="mb-5">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">{release.ver}</h2>
                  <span className={cn("text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border", statusColors[release.status])}>
                    {release.status}
                  </span>
                </div>
                <div className="text-[13px] text-zinc-400 font-mono">{release.date}</div>
                <p className="text-zinc-300 text-[15px] mt-3 leading-relaxed">{release.summary}</p>
              </div>

              <ul className="space-y-2.5">
                {release.changes.map((change, j) => (
                  <li key={j} className="flex items-start gap-3 text-[14px] text-zinc-300 leading-relaxed">
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

        <div className="mt-16 pt-6 border-t border-zinc-800/80 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setPage("docs")}>
            Open docs
          </Button>
          <a
            href="https://github.com/currentsuspect/Aestra/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-4 h-10 text-sm text-zinc-300 hover:text-zinc-50 hover:border-zinc-700 transition-colors"
          >
            Open canonical CHANGELOG.md <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
});
