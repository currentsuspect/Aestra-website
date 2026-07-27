# Investigate an Aestra bug

    Protocol:       aestra-agent-protocol/v1
    Skill:          investigate-bug
    Skill revision: 2026-07-27
    Base protocol:  https://aestra.studio/.well-known/agent-skills/recovery/aestra-agent-protocol.md

You are investigating a bug in the Aestra DAW. Your objective is to determine
the root cause and produce the smallest correct fix.

Read the base protocol first. It defines the real-time audio invariants, the
change discipline, and the report format this skill assumes.

**Halt condition:** when investigation reaches code or implementation
unavailable in the checked-out repository, stop at that boundary. Record the
last observable public operation, its inputs, expected behavior, actual
behavior, and relevant diagnostics. Do not infer or recreate the unavailable
implementation. Produce a boundary report and route to <support@aestra.studio>.

---

## Procedure

**1. Reproduce before you read.**
Reproduce the reported failure before modifying any production code. Record the
exact steps that work. If you cannot reproduce it, characterize what you tried —
which OS, which build type, which audio backend, which project — and stop there.
An honest "not reproducible under these conditions" is a result.

**2. Classify the failure.**
Reproducible / intermittent / not reproducible; environment-, project-, or
plugin-specific; regression or pre-existing. If you suspect a regression, find
the last build that worked before bisecting — a bisect against an unverified
"good" commit wastes hours.

**3. Inspect the architecture before changing it.**
Aestra separates concerns across `AestraCore` (engine primitives), `AestraAudio`,
`AestraUI`, `AestraPlat` (platform), `AestraPlugins`, and `Source/Core`
(session model, including `ProjectSerializer`). Establish which layer owns the
behavior before you edit. A fix applied one layer above the defect is how a
symptom gets suppressed instead of removed.

**4. Do not trust the reporter's diagnosis.**
It is evidence about the symptom. Treat it as a hypothesis to test, not a
starting position to defend.

**5. Determine the root cause.**
State it as a causal chain from trigger to observable failure. If you can only
narrow it to a subsystem, say that — a bounded uncertainty is more useful than a
confident guess.

**6. Write a regression test.**
It must fail before the fix and pass after it. Build and run:

```bash
cmake -S . -B build -DAestra_CORE_MODE=ON -DAESTRA_ENABLE_TESTS=ON -DCMAKE_BUILD_TYPE=RelWithDebInfo
cmake --build build --parallel
ctest --test-dir build --output-on-failure
```

Run the narrowest relevant test first (`ctest -R <name>`), then the full suite.
If the subsystem cannot reasonably be tested — real-time timing, device
hot-plug, GPU-dependent UI — state why instead of skipping silently.

**7. Make the smallest defensible change.**
Preserve the real-time audio invariants in the base protocol §3. Do not
introduce allocations, blocking operations, locks, filesystem access, or logging
into real-time audio paths. Do not change unrelated behavior.

**8. Verify against the original failure.**
A passing build is not proof. Re-run the reproduction from step 1 and show that
it no longer fails.

## Output

Produce the report in base protocol §6: provenance header, root cause, affected
subsystem, failure classification, fix, tests, remaining uncertainty.

If the trail crossed the public/private boundary, produce a boundary report
instead and stop.
