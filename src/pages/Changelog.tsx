import React, { memo, useMemo, useState, useCallback } from "react";
import { Activity, CalendarDays } from "lucide-react";

import { cn } from "../lib";
import { Badge, Button } from "../components/ui";

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

export const Changelog = memo(({ setPage }: any) => {
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

  const getTypeColor = useCallback((type: ChangeType) => {
    switch (type) {
      case "new":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "fix":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "security":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      case "ci":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
      case "perf":
        return "bg-sky-500/10 text-sky-300 border-sky-500/20";
      case "docs":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  }, []);

  const getStatusBadge = useCallback((status: Release["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#00e5cc]/15 text-[#00e5cc] border-[#00e5cc]/30";
      case "landed":
        return "bg-[#7c3aed]/15 text-[#b6abff] border-[#7c3aed]/35";
      case "released":
        return "bg-[#3dbb6e]/15 text-[#79d996] border-[#3dbb6e]/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  }, []);

  const visibleReleases = useMemo(() => {
    return releases
      .map((release) => ({
        ...release,
        changes: activeType === "all" ? release.changes : release.changes.filter((change) => change.type === activeType),
      }))
      .filter((release) => release.changes.length > 0);
  }, [activeType, releases]);

  const filters: Array<{ label: string; value: "all" | ChangeType }> = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "Fixes", value: "fix" },
    { label: "Security", value: "security" },
    { label: "CI", value: "ci" },
    { label: "Performance", value: "perf" },
    { label: "Docs", value: "docs" },
  ];

  return (
    <div className="content-defer pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Changelog</h1>
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-[#8891a7]">
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Source synced from Dev/Aestra history through Apr 11, 2026</span>
          </div>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-[#8891a7]">
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span className="w-2 h-2 bg-[#00e5cc] rounded-full mr-2 animate-pulse" />
          Unreleased line actively moving
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveType(filter.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs border transition-colors",
              activeType === filter.value
                ? "border-[#00e5cc] bg-[#00e5cc]/15 text-[#00e5cc]"
                : "border-[#2f3648] text-[#98a1b7] hover:text-white"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="relative border-l border-[#31384a] ml-3 space-y-8 sm:space-y-10">
        {visibleReleases.map((release, i) => (
          <div key={`${release.ver}-${release.date}-${i}`} className="relative pl-10 sm:pl-12">
            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#7c3aed] ring-4 ring-[#09090b]" />

            <div className="mb-3 sm:mb-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{release.ver}</h2>
                <Badge variant="outline" className={cn("uppercase text-[9px] sm:text-[10px] tracking-wider border", getStatusBadge(release.status))}>
                  {release.status}
                </Badge>
              </div>
              <div className="text-xs sm:text-sm text-[#7f879b] font-mono">{release.date}</div>
              <p className="text-sm text-[#b8c0d4] mt-2">{release.summary}</p>
            </div>

            <ul className="space-y-3 sm:space-y-3.5">
              {release.changes.map((change, j) => (
                <li key={j} className="flex items-start gap-2 sm:gap-3">
                  <span className={cn("text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase mt-0.5 shrink-0", getTypeColor(change.type))}>
                    {change.type}
                  </span>
                  <span className="text-[#cfd5e4] text-xs sm:text-sm leading-relaxed">{change.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-[#2f3646] flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setPage("docs")}>Open docs</Button>
        <a
          href="https://github.com/currentsuspect/Aestra/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-[10px] border border-[#2f3648] px-4 py-2 text-sm text-[#9aa5bd] hover:text-white hover:border-[#00e5cc]/35 transition-colors"
        >
          Open canonical CHANGELOG.md
        </a>
      </div>
    </div>
  );
});
