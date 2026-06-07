export type ChangeType = "new" | "fix" | "security" | "ci" | "perf" | "docs";

export type Change = {
  type: ChangeType;
  text: string;
};

export type Release = {
  ver: string;
  date: string;
  status: "active" | "landed" | "released";
  summary: string;
  changes: Change[];
};

export const RELEASES: Release[] = [
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
];
