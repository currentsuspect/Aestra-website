# Collect Aestra diagnostics

    Protocol:       aestra-agent-protocol/v1
    Skill:          collect-diagnostics
    Skill revision: 2026-07-27
    Base protocol:  https://aestra.studio/.well-known/agent-skills/recovery/aestra-agent-protocol.md

Your objective is to assemble the ground truth an investigation needs, from
Aestra and the host system — not from guesses, and not from the browser.

---

## The rule that matters

**Audio configuration must come from Aestra, not from inference.**

A web page can read `navigator.hardwareConcurrency`, the user-agent platform
string, and an `AudioContext` sample rate. None of those tell you what Aestra is
running. The browser's audio configuration is not Aestra's audio backend,
Aestra's device, or Aestra's sample rate, and treating it as such produces
confidently wrong bug reports.

If you cannot obtain a field from Aestra or from the user directly, record it as
`unknown`. An honest `unknown` costs one round trip. A wrong value costs an
investigation.

## Fields

Collect what is available. Mark the rest `unknown` — do not omit the key.

```text
version              Aestra version string
commit               build commit, if the build reports one
buildType            Release / RelWithDebInfo / Debug
os                   name and version
arch                 x64 / ARM64
cpu                  model
ram                  total, GB
audioBackend         from Aestra (e.g. ASIO, WASAPI, CoreAudio, ALSA/JACK)
audioDevice          from Aestra
sampleRate           from Aestra
bufferSize           from Aestra
pluginInventory      hosted VST3/CLAP plugins, with versions
recentLoadReport     the ProjectLoadReport from the failing load, if any
recentCrashMetadata  faulting thread, stack, signal/exception, if any
projectVersion       top-level "version" field of the project file, if relevant
```

Where a value is user-supplied rather than read from Aestra, mark it as such.
The distinction matters when the report is later contradicted by a log.

## Sources, in order of trust

1. **Aestra's own diagnostics output**, where available. Ground truth.
2. **Aestra's log file** — the load report and warning categories are written
   here. Note that per-category warnings are rate-limited, so a "further
   warnings suppressed" line means more occurrences, not one.
3. **The project file** — plain JSON; `version` is directly readable.
4. **The operating system** — reliable for OS, CPU, RAM.
5. **The user** — reliable for what they were doing; unreliable for buffer size,
   backend, and sample rate unless they are reading them off Aestra's screen.
6. **The browser** — reliable for nothing in this list.

## Handling the project file

If a project is attached to the report, the base protocol's copy rule applies:
never operate on the user's only copy. Note also that a project file may embed
file paths that identify the user; mention this to the user before they attach
it to a public issue.

## Security

If the diagnostics suggest a security vulnerability rather than a defect, stop
and route to <security@aestra.studio> per `/.well-known/security.txt`. Do not
open a public issue and do not include the details in a public report.

## Output

Emit a single JSON object with every field above present, plus the provenance
header from base protocol §6 as a `protocol` block. Follow it with a short
plain-language summary for the human reading the issue.
