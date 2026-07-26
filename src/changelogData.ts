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
    date: "Jun – Jul 2026",
    status: "active",
    summary:
      "The biggest stretch since we started. Muse woke up, five new plugins moved in, and you can finally plug a keyboard in and play.",
    changes: [
      { type: "new", text: "Muse is awake. Ask for a groove and it writes one into the pattern. Ask it to mix and it moves real faders. Ask for the beat back and it renders you audio — no menu diving, just say the thing." },
      { type: "new", text: "Five new plugins moved into the free rack: AestraSat (tape and tube warmth), AestraOTT (the 3-band squash you know), AestraFilter (envelope-chasing multimode), AestraLFO (tempo-locked movement on anything), AestraLimit (brickwall with auto-release that reads the density of the material)." },
      { type: "new", text: "AestraRumble rebuilt from the ground up — the 808 that actually holds up on a phone speaker and in a car." },
      { type: "new", text: "Plug in a MIDI keyboard and play. Don't have one nearby? Your QWERTY row is now a keyboard — musical typing plays whatever instrument is loaded, live." },
      { type: "new", text: "Lights-on, lights-out. A full theme system that switches live, across the shell and every editor, without restarting the session." },
      { type: "new", text: "Playlist lanes are no longer welded to mixer channels. Arrange clips wherever they make sense, then point each one at any mixer insert from a searchable picker — and open a clip to work on it directly instead of bouncing out to fix one bad bar." },
      { type: "new", text: "Takes and History finally got their own panels, so the version you liked is one click away instead of buried." },
      { type: "new", text: "Draw automation on internal plugins. Curves follow playback in the beat domain, so they stay put when you change tempo." },
      { type: "new", text: "Piano roll editing overhaul — drawing notes feels smoother and lands where you meant it." },
      { type: "new", text: "The Arsenal step sequencer got a full pass. Steps behave — left-click toggles, right-click deletes, nothing draws itself in by accident — the grid spans the whole loop and follows the playhead, and notes light up as they pass. Time signature stopped being decoration: it now drives the metronome accent, the bar grouping and how long a pattern is." },
      { type: "new", text: "A redesigned plugin browser with real filters, and a scan that doesn't block you while it runs." },
      { type: "new", text: "Knobs got a proper grip: infinite drag everywhere, hold Shift for fine control, and the cursor stays where you grabbed it." },
      { type: "fix", text: "AestraVerb got a full service. Low Cut and High Cut work, freeze actually sustains, the tremolo wobble is calmed, stereo stays mono-compatible, and the predelay readout finally tells the truth." },
      { type: "fix", text: "AestraDrift and AestraDelay both overhauled — smoother transitions, better pitch quality, editors that make sense." },
      { type: "fix", text: "Hitting pause no longer rewinds you. The playhead stays exactly where it was, even if you mash the spacebar." },
      { type: "fix", text: "Patterns loop dead on the grid. The next downbeat gets queued before the wrap, so the per-bar drift is gone — and a note you place while the loop is running keeps playing instead of sounding once and going quiet." },
      { type: "fix", text: "New sampler units play at the pitch you loaded them at. Every fresh one used to come up an octave down at half speed, and Arsenal steps ignored the unit's root note entirely." },
      { type: "fix", text: "Undo a deleted track and you get that track back — same volume, pan, mute, solo and effect chain, in the same slot, still feeding whatever was routed through it. It used to hand you an empty track wearing the same name." },
      { type: "fix", text: "A bad plugin can no longer poison the mix — anything non-finite gets caught at the mix boundary instead of turning the master into silence or noise." },
      { type: "fix", text: "Save, reopen, save again and the file is byte-identical. Your project stops drifting every time you touch it." },
      { type: "fix", text: "One-shots shorter than their release are audible again, and sliced audio survives a save/load round trip." },
      { type: "fix", text: "Timeline reads properly at any zoom — honest waveforms, stable grid, per-track colours, and crisp small text instead of grey mush." },
      { type: "perf", text: "Idle reverbs go to sleep instead of burning CPU on silence, and the interface holds 60 FPS while you're actually dragging things." },
      { type: "security", text: "Projects carry a content checksum written on save and verified on load, so a corrupted file tells you instead of quietly loading wrong." },
      { type: "ci", text: "Engine internals split into testable pieces with a research bench for measuring audio quality — groundwork so the next stretch breaks less." },
    ],
  },
  {
    ver: "v0.6.0-alpha",
    date: "May 29, 2026",
    status: "released",
    summary:
      "26 PRs. The unglamorous release — the one that makes a long session survivable.",
    changes: [
      { type: "security", text: "Full security audit — 11 findings, 8 fixed. Opening a project, recovering from a crash, and unpacking an archive are all hardened against malformed files." },
      { type: "security", text: "A scanned plugin can no longer impersonate a built-in one, and take snapshots stay inside your project folder where they belong." },
      { type: "new", text: "The engine now reads its state through a triple-buffered handoff, so the audio thread never waits on the interface — fewer clicks and dropouts when the session gets busy." },
      { type: "new", text: "A crashing VST3 gets contained instead of taking your session down, and any plugin spitting out garbage audio is quarantined and reported." },
      { type: "fix", text: "Waveform previews stop firing after you've moved on, and the audition decoder cleans up after itself instead of piling up." },
      { type: "fix", text: "Patterns come back the way you left them, and a tempo change now reaches the playlist, timeline, and pattern playback together." },
      { type: "perf", text: "The master safety limiter was reshaped to a transparent curve — it catches peaks without you hearing it work." },
      { type: "ci", text: "Thread-safety and leak detection added to the nightly build so callback regressions get caught before you do." },
    ],
  },
  {
    ver: "v0.5.0-alpha",
    date: "May 23, 2026",
    status: "released",
    summary: "11 PRs. Takes landed — record until you get it, sort it out after.",
    changes: [
      { type: "new", text: "Multi-take recording. Keep every pass, switch between them cleanly, and nothing gets overwritten while you're chasing the good one." },
      { type: "new", text: "CLAP plugins now expose their parameters properly, including the ones that don't ship a parameter list at all." },
      { type: "fix", text: "A batch of quiet audio bugs that showed up as clicks and stalls: metering state under load, ARM64 denormals, send gain smoothing, and an audition deadlock." },
      { type: "fix", text: "Autosave writes atomically, so a crash mid-save leaves your last good project intact rather than half a file." },
      { type: "ci", text: "13 test files that were never actually running are now wired into the build, plus a delay-line buffer fix they immediately caught." },
    ],
  },
  {
    ver: "v0.4.0-alpha",
    date: "May 20, 2026",
    status: "released",
    summary: "Hardening milestone. Metering you can trust and exports that hold up.",
    changes: [
      { type: "security", text: "First full security audit — 11 findings, 8 fixed, 3 documented and deferred. Project files are now validated before they're trusted." },
      { type: "new", text: "Broadcast-standard loudness metering (BS.1770), so what the meter says matches what streaming platforms will measure." },
      { type: "new", text: "Proper dither on 16- and 24-bit export — quiet tails fade to silence instead of grit." },
      { type: "fix", text: "Memory cleanup moved off the audio thread entirely, removing a class of stutter that hit exactly when the session got heavy." },
      { type: "ci", text: "Nightly builds under memory and undefined-behaviour sanitizers, filing their own issue when something breaks." },
    ],
  },
  {
    ver: "v0.1.1",
    date: "Dec 28, 2025",
    status: "released",
    summary: "ASIO support and the first real pass at keeping the engine light.",
    changes: [
      { type: "new", text: "ASIO driver support on Windows, with a fallback path so a missing driver doesn't leave you with no sound and no explanation." },
      { type: "new", text: "Real-time waveform scrubbing — drag the playhead and hear the material under it." },
      { type: "perf", text: "Pan law and interpolation tables precomputed, cutting per-block cost so more tracks fit before the meter climbs." },
      { type: "fix", text: "Fixed a routing bug that could silence the master output after rebuilding the signal graph." },
    ],
  },
  {
    ver: "v0.1.0",
    date: "Dec 23, 2025",
    status: "released",
    summary: "The first build that could hold a session. Everything since started here.",
    changes: [
      { type: "new", text: "File preview panel with real metadata, so you can audition a sample before committing it to a track." },
      { type: "fix", text: "Short samples no longer crash or fall silent when scrubbed — the first bug that had to die." },
      { type: "docs", text: "Project walkthrough and the beginnings of real documentation." },
    ],
  },
];
