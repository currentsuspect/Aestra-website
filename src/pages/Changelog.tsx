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
      date: "Mar – Jun 2026",
      status: "active",
      summary: "Multi-take recording, CLAP parameter support, audio plugin improvements, device resilience, full export rewrite, and clip editing with undo/redo.",
      changes: [
        { type: "new", text: "Multi-take recording system with manifest, snapshots, and transactional switching." },
        { type: "new", text: "CLAP parameter enumeration and hosting support with null paramsExt crash fix." },
        { type: "new", text: "AudioExporter rewritten from scratch — uses proven offline render path, playlist-aware duration, sample-accurate position, master output stage, 16/24/32-bit export." },
        { type: "new", text: "Device resilience: driver telemetry wiring, health polling (500ms), hot-plug detection via IMMNotificationClient, RT-safe audio threads." },
        { type: "new", text: "Wired Cut/Copy/Paste/Delete to edit menu and keyboard shortcuts with full undo/redo support." },
        { type: "new", text: "Split tool via blade tool click and S key, routed through SplitClipCommand." },
        { type: "new", text: "Double-click pattern clips on timeline to open in Piano Roll. Piano Roll ↔ Sequencer sync." },
        { type: "new", text: "Arsenal panel: unit selection, remove units, redesigned unit rows with group/source labels." },
        { type: "new", text: "Low-memory build preset (lowmem) for 4GB RAM laptops." },
        { type: "fix", text: "Piano Roll dropdown menus (Scale, Snap, Root Key) now respond to clicks — bounds check was wrong." },
        { type: "fix", text: "AestraComp: replaced peak detection with RMS for hardware-style compressor behavior." },
        { type: "fix", text: "Rumble: smooth GlideCurve parameter during active glide to prevent audible discontinuities." },
        { type: "fix", text: "Clip split bug: second half now correctly inherits patternId, name, and color." },
        { type: "fix", text: "Project serialization bug: playlist clips no longer serialize with invalid patternId: 0." },
        { type: "security", text: "Take snapshot paths confined within project .takes directory." },
        { type: "security", text: "Scanned/cache plugins can no longer shadow registered internal plugin IDs." },
        { type: "security", text: "Production key required for premium leases; dev account API fallback removed." },
        { type: "perf", text: "K-weight race fix, ARM64 denormal handling, send gain smoother coefficient fix, audition queue deadlock fix." },
        { type: "ci", text: "Nightly build workflow with ASan/UBSan, auto-issue on failure. TSan CI for callback-safety regression." },
        { type: "docs", text: "README and core technical docs updated to reflect verified March 2026 state." },
      ],
    },
    {
      ver: "v0.6.0-alpha",
      date: "May 29, 2026",
      status: "released",
      summary: "26 PRs merged. Security hardening across plugin host, license gate, and project loader. RT-safety fixes and callback-safety architecture.",
      changes: [
        { type: "security", text: "Full security audit — 11 findings, 8 fixed. Project load path hardened, crash recovery hardened, archive extraction path traversal protection." },
        { type: "security", text: "Take snapshot path traversal, plugin ID shadowing, dev account fallback removal, production key enforcement." },
        { type: "new", text: "Triple-buffer EngineState with GraphReadHandle protecting RT graph access. TSan CI added." },
        { type: "new", text: "VST3 host crash handling hardened. Non-finite plugin output quarantined (NaN/Inf detected and reported)." },
        { type: "fix", text: "Stale waveform source callbacks eliminated. Async preview decodes bounded. Audition decode worker lifetime fixed." },
        { type: "fix", text: "Pattern restore and timeline persistence fixed. BPM changes synced through playlist/timeline/pattern playback." },
        { type: "perf", text: "Master safety limiter reshaped to transparent cubic Hermite knee. Mixer lane state clamped before cast." },
        { type: "ci", text: "LeakSanitizer advisory CI job. GitHub Pages deploy gate changed to opt-out." },
      ],
    },
    {
      ver: "v0.5.0-alpha",
      date: "May 23, 2026",
      status: "released",
      summary: "11 PRs merged. Multi-take recording system, CLAP parameter support, audio quality fixes, CI hardening.",
      changes: [
        { type: "new", text: "Multi-take recording with manifest, snapshots, transactional switching. Path traversal guards on take snapshot paths." },
        { type: "new", text: "ClapParamInfo and ClapPluginParams for CLAP parameter enumeration. Null paramsExt crash fix." },
        { type: "fix", text: "K-weight race fix, ARM64 denormal handling, send gain smoother fix, audition queue deadlock fix, autosave atomic rename." },
        { type: "ci", text: "Removed jwlawson/actions-setup-cmake from all CI. DelayLine off-by-one fix. 13 unregistered test files added." },
      ],
    },
    {
      ver: "v0.4.0-alpha",
      date: "May 20, 2026",
      status: "released",
      summary: "Hardening milestone. Full security audit, BS.1770 metering, RT safety improvements, and nightly CI.",
      changes: [
        { type: "security", text: "Full security audit — 11 findings, 8 fixed, 3 deferred. Parser safeguards, crash recovery hardening, archive path traversal protection." },
        { type: "new", text: "BS.1770 K-weighting for true-peak metering. Proper TPDF dither for 16-bit/24-bit export." },
        { type: "fix", text: "GarbageCollector::flush() lock-free. GC retirement from audio thread via SPSC ring buffer. Mixer effect chain race fixed." },
        { type: "ci", text: "Nightly build workflow with ASan/UBSan, auto-issue on failure. Versioning/tagging policy documented." },
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
              <span>Source synced from Aestra CHANGELOG.md through Jun 2026</span>
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
