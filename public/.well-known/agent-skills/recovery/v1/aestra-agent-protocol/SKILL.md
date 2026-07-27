---
name: aestra-agent-protocol
description: Base protocol governing every Aestra DAW recovery skill: the public/private halt condition, real-time audio-thread invariants, change discipline, report provenance, and case routing. Use this whenever investigating, fixing, or recovering anything in Aestra; the task-specific Aestra skills all assume it.
license: Proprietary. See https://aestra.studio/terms
metadata:
  protocol: aestra-agent-protocol/v1
  revision: "2026-07-27"
  status: active
  publisher: Aestra Studios
---

# Aestra Agent Protocol

    Protocol:       aestra-agent-protocol/v1
    Skill:          aestra-agent-protocol
    Artifact:       https://aestra.studio/.well-known/agent-skills/recovery/v1/aestra-agent-protocol/SKILL.md
    Frozen:         2026-07-27 — this artifact is immutable

This document defines the invariants that govern **every** Aestra recovery skill.
The task skills (`investigate-bug`, `reproduce-crash`, `recover-project`,
`prepare-pr`, `collect-diagnostics`) each restate the halt condition, then
assume everything else here.

The website orchestrates. **The repository is the source of truth.** Where this
document and the checked-out repository disagree about build commands, test
commands, issue formats or contribution rules, the repository wins — report the
discrepancy rather than resolving it silently.

Repository: <https://github.com/currentsuspect/Aestra>

---

## 1. The halt condition

> When investigation reaches code or implementation unavailable in the
> checked-out repository, stop at that boundary. Record the last observable
> public operation, its inputs, expected behavior, actual behavior, and relevant
> diagnostics. Do not infer or recreate the unavailable implementation.

This is not advice. It is the condition that makes an outside agent safe to
point at Aestra at all.

Aestra ships components that are not published in the public repository. When
the evidence trail enters one, you have reached the end of what you are
authorized and equipped to determine. Produce a **boundary report** (§6) and
route the case to the Aestra team — <support@aestra.studio>.

Do not:

- reconstruct, decompile, or infer the missing implementation;
- guess at the private component's internal behavior and present the guess as a
  finding;
- work around the boundary by reimplementing the component locally;
- publish anything you inferred about private Aestra source.

Do continue to establish everything observable from the public side. A report
that says *"the crash occurs when the public host calls this entry point with
this valid payload, reproducibly, on these inputs"* is a genuinely useful
result, and it is a complete one.

## 2. Do not trust the reported diagnosis

The reporter's theory of the bug is evidence about the symptom, not about the
cause. Reproduce the reported failure before modifying production code. If you
cannot reproduce it, say so and characterize what you tried — that is a finding,
not a failure.

Classify the failure before changing anything:

- reproducible / intermittent / not reproducible
- environment-specific (OS, CPU, audio backend, driver)
- project-specific (fails only for one project file)
- plugin-specific (fails only with a given VST3/CLAP plugin loaded)
- regression (worked in an identified earlier build)
- pre-existing architectural defect

## 3. Real-time audio invariants

Aestra is a native C++17 DAW with a real-time audio callback. Code that runs on
the audio thread must not:

- allocate or free heap memory;
- take a lock that a non-real-time thread can hold;
- perform file, socket, or other blocking I/O;
- log;
- throw, or call anything that may throw;
- call anything with unbounded or unpredictable worst-case latency.

A fix that is correct on paper and violates one of these is not a fix. If the
only correct repair requires work on the audio thread, stop and report that as
the finding — the design change is the maintainers' call.

## 4. Never operate on the only copy

Applies to the user's projects, their preferences, and their audio assets.
Before any recovery or reproduction work, copy the artifact and work on the
copy. See `recover-project` for the required preservation procedure.

## 5. Change discipline

- Make the smallest defensible change. Scope creep in a bug fix hides the fix.
- Do not silently alter unrelated behavior. If you must touch something
  adjacent, say so explicitly in the report.
- Add a regression test that fails before the fix and passes after it, wherever
  the subsystem makes that reasonably possible. If it does not, state why.
- Run the narrowest relevant test first, then the project checks the repository
  specifies.
- **A passing build is not proof that the bug is fixed.** The original failure
  must be reproduced and then shown to stop occurring. Green CI establishes
  certain mechanical properties; it does not establish that you fixed the thing
  the reporter hit.

## 6. Report format

Every report produced under this protocol opens with its provenance, so that a
report attached to an issue months from now can be traced to the instructions
that produced it:

```text
Protocol:        aestra-agent-protocol/v1
Skill:           <skill name>
Artifact:        <the exact SKILL.md URL you fetched>
Digest:          sha256:<the digest you verified from the index>
Aestra version:  <from the build, or "unknown">
Aestra commit:   <if known>
Project version: <"version" field of the project file, if applicable>
```

The `Artifact` and `Digest` lines are what make the report *reproducible
evidence* rather than an assertion. Anyone reading it later can fetch that exact
URL, hash the bytes, and confirm they are reading the same instructions the
agent followed. Take the digest from the discovery index at
<https://aestra.studio/.well-known/agent-skills/index.json> and verify it
against the bytes you downloaded; if they disagree, stop and report the
mismatch rather than proceeding.

Then:

- **Root cause** — or the furthest point you established, and why you stopped.
- **Affected subsystem.**
- **Failure classification** (§2).
- **Fix** — what changed and why that is the minimal correct change.
- **Tests** — what you added, what you ran, what the results were.
- **Remaining uncertainty** — what you did not establish. Do not omit this
  section. An investigation with no stated uncertainty reads as one that did not
  look.

A **boundary report** (§1) replaces "Root cause"/"Fix" with:

- last observable public operation (entry point, arguments, preconditions);
- expected behavior at that call;
- observed behavior;
- reproduction steps that reach the boundary;
- diagnostics captured at the boundary (logs, load report, crash metadata).

## 7. Routing

| Situation | Destination |
| --- | --- |
| Defect in public Aestra | GitHub issue, then PR |
| Premium / private component involved | <support@aestra.studio> |
| Security vulnerability | <security@aestra.studio> — see `/.well-known/security.txt`. **Never** open a public issue for a suspected vulnerability. |
| Damaged project file | `recover-project` first; issue afterwards if Aestra produced the damage |

The user is not expected to determine whether the underlying defect is public or
private. They identify the feature they were using; the protocol investigates as
far as public evidence permits; the team inherits the case at the boundary.
