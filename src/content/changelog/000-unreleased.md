---
version: Unreleased
date: Jun – Jul 2026
status: active
order: 0
---
The biggest stretch since we started. Muse woke up, five new plugins moved in, and you can finally plug a keyboard in and play.

- **new**: Muse is awake. Ask for a groove and it writes one into the pattern. Ask it to mix and it moves real faders. Ask for the beat back and it renders you audio — no menu diving, just say the thing.
- **new**: Five new plugins moved into the free rack: AestraSat (tape and tube warmth), AestraOTT (the 3-band squash you know), AestraFilter (envelope-chasing multimode), AestraLFO (tempo-locked movement on anything), AestraLimit (brickwall with auto-release that reads the density of the material).
- **new**: AestraRumble rebuilt from the ground up — the 808 that actually holds up on a phone speaker and in a car.
- **new**: Plug in a MIDI keyboard and play. Don't have one nearby? Your QWERTY row is now a keyboard — musical typing plays whatever instrument is loaded, live.
- **new**: Lights-on, lights-out. A full theme system that switches live, across the shell and every editor, without restarting the session.
- **new**: Playlist lanes are no longer welded to mixer channels. Arrange clips wherever they make sense, then point each one at any mixer insert from a searchable picker — and open a clip to work on it directly instead of bouncing out to fix one bad bar.
- **new**: Takes and History finally got their own panels, so the version you liked is one click away instead of buried.
- **new**: Draw automation on internal plugins. Curves follow playback in the beat domain, so they stay put when you change tempo.
- **new**: Piano roll editing overhaul — drawing notes feels smoother and lands where you meant it.
- **new**: The Arsenal step sequencer got a full pass. Steps behave — left-click toggles, right-click deletes, nothing draws itself in by accident — the grid spans the whole loop and follows the playhead, and notes light up as they pass. Time signature stopped being decoration: it now drives the metronome accent, the bar grouping and how long a pattern is.
- **new**: A redesigned plugin browser with real filters, and a scan that doesn't block you while it runs.
- **new**: Knobs got a proper grip: infinite drag everywhere, hold Shift for fine control, and the cursor stays where you grabbed it.
- **fix**: AestraVerb got a full service. Low Cut and High Cut work, freeze actually sustains, the tremolo wobble is calmed, stereo stays mono-compatible, and the predelay readout finally tells the truth.
- **fix**: AestraDrift and AestraDelay both overhauled — smoother transitions, better pitch quality, editors that make sense.
- **fix**: Hitting pause no longer rewinds you. The playhead stays exactly where it was, even if you mash the spacebar.
- **fix**: Patterns loop dead on the grid. The next downbeat gets queued before the wrap, so the per-bar drift is gone — and a note you place while the loop is running keeps playing instead of sounding once and going quiet.
- **fix**: New sampler units play at the pitch you loaded them at. Every fresh one used to come up an octave down at half speed, and Arsenal steps ignored the unit's root note entirely.
- **fix**: Undo a deleted track and you get that track back — same volume, pan, mute, solo and effect chain, in the same slot, still feeding whatever was routed through it. It used to hand you an empty track wearing the same name.
- **fix**: A bad plugin can no longer poison the mix — anything non-finite gets caught at the mix boundary instead of turning the master into silence or noise.
- **fix**: Save, reopen, save again and the file is byte-identical. Your project stops drifting every time you touch it.
- **fix**: One-shots shorter than their release are audible again, and sliced audio survives a save/load round trip.
- **fix**: Timeline reads properly at any zoom — honest waveforms, stable grid, per-track colours, and crisp small text instead of grey mush.
- **perf**: Idle reverbs go to sleep instead of burning CPU on silence, and the interface holds 60 FPS while you're actually dragging things.
- **security**: Projects carry a content checksum written on save and verified on load, so a corrupted file tells you instead of quietly loading wrong.
- **ci**: Engine internals split into testable pieces with a research bench for measuring audio quality — groundwork so the next stretch breaks less.
