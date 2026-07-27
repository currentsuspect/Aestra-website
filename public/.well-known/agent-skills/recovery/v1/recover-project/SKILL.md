---
name: recover-project
description: Salvage a damaged Aestra DAW project by working against a copy, using the engine's own load-report model, and reporting everything recovered, omitted, modified or uncertain. Use when an Aestra project will not open, crashes on load, or loads with missing content.
license: Proprietary. See https://aestra.studio/terms
metadata:
  protocol: aestra-agent-protocol/v1
  revision: "2026-07-27"
  status: active
  publisher: Aestra Studios
---

# Recover an Aestra project

    Protocol:       aestra-agent-protocol/v1
    Skill:          recover-project
    Artifact:       https://aestra.studio/.well-known/agent-skills/recovery/v1/recover-project/SKILL.md
    Frozen:         2026-07-27 — this artifact is immutable
    Base protocol:  https://aestra.studio/.well-known/agent-skills/recovery/v1/aestra-agent-protocol/SKILL.md

Your goal is **recovery, not repair of Aestra itself.** Preserve as much musical
information as possible. Work against a copy. Never discard unknown data merely
because the current Aestra version does not understand it. Prefer isolating
damaged state over reconstructing healthy state. Produce a report of everything
recovered, omitted, modified, or uncertain.

A "successful recovery" must never quietly mean *we made the project open by
deleting half of it.*

**Halt condition:** when investigation reaches code or implementation
unavailable in the checked-out repository, stop at that boundary and report it.
Do not infer or recreate the unavailable implementation.

---

## Step 1 — Preserve evidence

Before anything else:

```text
MySong.aestra
  ├── MySong-recovery-original.aestra   ← never modified, never opened for edit
  └── MySong-recovery-working.aestra    ← all work happens here
```

If you cannot make a copy, stop. Do not proceed on the only copy under any
circumstance, including when the user asks you to.

## Step 2 — Read what Aestra already told you

**Do not invent a diagnosis Aestra has already produced.** The loader is
non-destructive by design: it preserves objects it cannot resolve rather than
dropping them, and it reports what it could not resolve.

`ProjectSerializer` returns a `ProjectLoadReport` containing `LoadIssue` entries:

```cpp
struct LoadIssue {
    LoadIssueSeverity severity;  // Warning | Error
    std::string category;
    std::string message;
    uint64_t    objectId;
    std::string referenceId;
    std::string context;
};
```

Structured categories currently emitted:

| Category | Meaning |
| --- | --- |
| `integrity` | Content checksum mismatch — the file changed since it was saved. Loaded non-destructively; verify the session before overwriting backups. |
| `clip` | A clip references a missing or unresolved pattern. The clip is preserved with a placeholder. |
| `unit` | A MIDI note references a missing Arsenal unit. The note is preserved; the unit reference is unresolved. |

The load result also carries `missingAssets` — deduplicated paths to audio files
that were referenced but are missing or unreadable.

A broader warning taxonomy is emitted to the log rather than the structured
report: `ReferenceClip`, `ReferenceUnit`, `MissingAsset`, `MissingAssetDecode`,
`LaneCreate`, `LaneCreateChannel`, `EffectChain`, `AutomationTarget`,
`DroppedClip`, `SendRoute`. Warnings are rate-limited per category, so a log
line saying further warnings were suppressed means *more of the same*, not *only
one occurrence*.

Read the log and the load report before touching the file. Most of the
diagnosis is already done.

## Step 3 — Classify the failure

```text
Does Aestra launch at all?
  ├── No ──────────────────────────► application / environment path.
  │                                   Not a project recovery. Use investigate-bug.
  └── Yes
       ├── Every project fails ────► application / environment path.
       └── Only this project fails ► continue below.
```

## Step 4 — Inspect the file

Aestra project files are **JSON**, versioned by a top-level numeric `version`
field. This means the file is directly inspectable — you do not need Aestra
running to enumerate its contents.

Check, in order, against the **working copy**:

1. Is the file valid JSON at all? Truncation and encoding damage show up here.
2. Does a top-level `version` exist and is it a finite number? The loader
   rejects the file outright if not.
3. Is `version` within the supported range? The loader refuses files newer than
   `PROJECT_VERSION_CURRENT` and older than `MIN_SUPPORTED`. A newer file is not
   corrupt — it needs a newer Aestra.
4. Are the required top-level sections present?
5. Do referenced media paths exist on disk?
6. Do clip → pattern and note → unit references resolve?
7. Do send/route destinations name existing targets?

## Step 5 — Isolate, do not reconstruct

Work on the smallest possible edit to the working copy. Remove or neutralize the
*damaged* region; never rebuild a healthy region you think is missing. If
removing a section makes the project load, you have identified the damage — that
is the finding. Record the removed content verbatim in the report so the user
can decide whether it mattered.

Do not delete keys the current Aestra version does not recognize. Forward
compatibility depends on unknown data surviving a round trip.

## Step 6 — Report

Use the same model the engine uses. Do not invent a parallel vocabulary.

```text
PROJECT RECOVERY

Protocol:        aestra-agent-protocol/v1
Skill:           recover-project
Artifact:        .../recovery/v1/recover-project/SKILL.md
Digest:          sha256:9f2c...  (verified against the index)
Aestra version:  0.6.0-alpha
Project version: 4

✓ Loads
⚠ 3 warnings
✕ 1 unrecoverable object

integrity
  ⚠ Content checksum mismatch — file modified since save. Verify before
    overwriting backups.

clip
  ⚠ Clip 4192 references unresolved pattern 88 — preserved with placeholder.

media
  ⚠ 17/18 referenced files found.
    Missing: samples/vox_take3.wav

plugin
  ✕ Could not restore state for instance 72 (Serum). Instance preserved,
    parameters at defaults.

MODIFIED BY RECOVERY
  ⚠ Removed malformed "automation" block on track 6 (recorded below).
```

Every entry must fall into exactly one of: **recovered**, **could not restore**,
**modified by recovery**, or **uncertain**. Anything you changed goes under
"modified by recovery" even if you are confident it was correct.

## Step 7 — Hand back

The user keeps `-recovery-original` untouched. Tell them explicitly which file
is safe to work from and what was lost.

If Aestra itself produced the damage — as opposed to disk failure, an
interrupted save, or an external edit — that is a separate defect. Open an issue
with `investigate-bug` and attach this report.
