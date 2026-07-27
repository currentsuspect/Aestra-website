---
name: prepare-pr
description: Get a fix to the Aestra DAW into reviewable shape: issue first, topic branch off develop, scoped change, and verification against the original failure rather than a green build. Use when a working Aestra fix needs to reach the maintainers.
license: Proprietary. See https://aestra.studio/terms
metadata:
  protocol: aestra-agent-protocol/v1
  revision: "2026-07-27"
  status: active
  publisher: Aestra Studios
---

# Prepare an Aestra pull request

    Protocol:       aestra-agent-protocol/v1
    Skill:          prepare-pr
    Artifact:       https://aestra.studio/.well-known/agent-skills/recovery/v1/prepare-pr/SKILL.md
    Frozen:         2026-07-27 — this artifact is immutable
    Base protocol:  https://aestra.studio/.well-known/agent-skills/recovery/v1/aestra-agent-protocol/SKILL.md

You have a fix. This skill gets it into a state a maintainer can review.

**The repository is the source of truth.** `CONTRIBUTING.md`,
`docs/developer/contributing.md`, and `.github/pull_request_template.md` in the
checked-out repository override anything here. If they disagree with this
document, follow the repository and say so in your report.

**Halt condition:** if the fix requires touching code unavailable in the
checked-out repository, stop. Do not recreate the unavailable implementation.
Route to <support@aestra.studio>.

---

## 1. The issue comes first

The issue is the canonical record; the PR is the change. Open the issue before
the PR, using the repository's `.github/ISSUE_TEMPLATE/bug_report.md`. Link them:

```text
Fixes #123
```

## 2. Branch from `develop`

```bash
git checkout develop
git pull
git checkout -b fix/project-loader-corruption
```

Topic branch off `develop` unless a maintainer directs otherwise.

## 3. Keep the change scoped

Smallest defensible change. If you found three defects, that is three PRs.
Reviewers cannot separate a bug fix from a refactor once they are in the same
diff, and the fix is what needs the scrutiny.

Preserve the real-time audio invariants in base protocol §3.

## 4. Verify — properly

```bash
ctest --test-dir build --output-on-failure     # code changes
scripts/docs-check.sh                          # docs or Markdown changes
```

> **A passing build is not proof that the bug is fixed.** The original failure
> must be reproduced and shown to stop occurring. Report the before-state and
> the after-state, not just the after-state.

## 5. Update the surrounding record

- Add a short entry to the `Unreleased` section of `CHANGELOG.md` for notable
  changes.
- Update docs when behavior, build flow, or contributor workflow changes.
- Update Doxygen comments if you added public API surface.

## 6. PR body

Follow `.github/pull_request_template.md`. If your investigation produced a
report under this protocol, attach it — including its provenance header, so a
reader six months from now knows which revision of these instructions the
investigation ran under.

Cover, at minimum: the problem, the reproduction, the root cause, the fix, the
regression coverage, how you verified, and the risks or questions you did not
resolve. That last one is not optional — an agent-authored PR with no stated
uncertainty is a PR that reviewers have to re-derive from scratch.

## 7. CI and review are different things

Green CI establishes certain mechanical properties: it compiles, the tests that
exist pass. It does not establish that the change is correct, minimal, or
appropriate. **Green CI is not automatic mergeability.** Review establishes
whether the change makes sense. Expect to answer questions rather than expecting
a merge.

If CI is green but you never reproduced the original failure, say so plainly in
the PR. A false green that nobody flags is worse than a red build.

## Output

Provenance header per base protocol §6, plus: branch name, issue link, files
touched, tests added, commands run with their results, and unresolved risks.
