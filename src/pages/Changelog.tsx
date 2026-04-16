import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { ChevronRight, Activity } from "lucide-react";
import { cn } from "../lib";
import { Button, Badge } from "../components/ui";

export const Changelog = memo(({ setPage }: any) => {
  const versions = useMemo(() => [
    {
      ver: "Phase 2",
      date: "March – April 2026",
      type: "In Progress",
      changes: [
        { type: "new", text: "Recording pipeline: armed capture, take commit, monitoring modes, project-relative recordings." },
        { type: "new", text: "Offline export: full-song render through live engine path with DC blocking, soft clipping, and TPDF dither." },
        { type: "new", text: "Piano Roll: double-click pattern clips to open editor, unit routing, auto-save on note changes." },
        { type: "new", text: "Arsenal panel: unit selection, removal, group labels (Synth/Drums/Audio), progress header." },
        { type: "new", text: "Clip editing: Cut/Copy/Paste/Delete wired to Ctrl+X/C/V, split tool via S key, all through CommandHistory." },
        { type: "new", text: "Routing: main output rerouting, audible sends, pre/post tap, sidechain-only sends." },
        { type: "new", text: "Routing: send gain smoothing (LinearSmoothedParamD), cycle detection, unified constant-power pan law." },
        { type: "new", text: "Device resilience: driver health monitor, hot-plug detection, WASAPI telemetry, SCHED_FIFO on Linux." },
        { type: "new", text: "Audition Mode: DSP presets (Spotify, Apple Music, YouTube, SoundCloud, Car, AirPods), A/B toggle, queue playback." },
        { type: "new", text: "Aestra Rumble: internal 808 synth plugin with verified state, render, and Arsenal integration tests." },
        { type: "fix", text: "Fixed audio engine dropout on high buffer sizes (>2048 samples)." },
        { type: "fix", text: "Fixed Linux audio, transport, text rendering, and pattern browser issues." },
        { type: "fix", text: "Fixed FLAC cover art crash and audition drop safety." },
        { type: "fix", text: "Fixed timeline clip loading and UI refresh." },
        { type: "fix", text: "Fixed mixer channels not showing — ChannelSlotMap now rebuilt on addChannel." },
        { type: "fix", text: "Fixed timeline playback — AudioEngine setTransportPlaying now wired correctly." },
        { type: "fix", text: "Fixed clip split: patternId, name, and colorRGBA now copied to new clip half." },
        { type: "fix", text: "Fixed Piano Roll dropdown hit-testing (local vs global bounds mismatch)." },
        { type: "ci", text: "CI: Fixed Linux, macOS, and Windows build issues (include paths, linker, MSVC)." },
        { type: "ci", text: "CI: Added AESTRA_HEADLESS mode for audio tests on headless CI runners." },
        { type: "perf", text: "Low-memory build preset for 4GB RAM laptops — 2 parallel jobs, no LTO, -O2." },
        { type: "docs", text: "Docs: Comprehensive overhaul — eliminated nomad references, fixed stale content." },
      ]
    },
    {
      ver: "Phase 3",
      date: "Jul – Sep 2026",
      type: "Planned",
      changes: [
        { type: "new", text: "Group bus tracks and return/aux tracks for signal routing." },
        { type: "new", text: "PDC (plugin delay compensation) through the full routing graph." },
        { type: "new", text: "Solo/mute/cue semantics through groups, returns, sends, and sidechain paths." },
        { type: "new", text: "Route-state serialization: save, reopen, render, and reopen on another machine." },
        { type: "new", text: "Multitrack recording validation and device stress tests." },
        { type: "new", text: "Version control (Takes): git-inspired branching with musical naming." },
      ]
    },
    {
      ver: "Phase 1",
      date: "Jan 1, 2026",
      type: "Complete",
      changes: [
        { type: "new", text: "Core audio engine: 64-bit multi-threaded, C++17." },
        { type: "new", text: "Pattern-based production with clip launcher." },
        { type: "new", text: "VST3 plugin hosting." },
        { type: "new", text: "VST3 + CLAP plugin hosting." }
      ]
    }
  ], []);

  const getTypeColor = useCallback((type: string) => {
    switch(type) {
      case "new": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "fix": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "perf": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "ci": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "docs": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  }, []);

  return (
    <div className="content-defer pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">Changelog</h1>
        <div className="flex items-center text-xs sm:text-sm text-[#8891a7]">
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span className="w-2 h-2 bg-[#61d5ff] rounded-full mr-2 animate-pulse" />
          Phase 2 of 6 — Active Development
        </div>
      </div>

      <div className="relative border-l border-[#31384a] ml-3 space-y-8 sm:space-y-12">
        {versions.map((release, i) => (
          <div key={i} className="relative pl-10 sm:pl-12">
            {/* Timeline Dot */}
            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#8f82df] ring-4 ring-[#09090b]" />

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">v{release.ver}</h2>
              <div className="flex items-center gap-2 sm:gap-3">
                 <span className="text-xs sm:text-sm text-[#7f879b] font-mono">{release.date}</span>
                 <Badge variant="outline" className="uppercase text-[9px] sm:text-[10px] tracking-wider">{release.type}</Badge>
              </div>
            </div>

            <ul className="space-y-3 sm:space-y-4">
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
    </div>
  );
});
