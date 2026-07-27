# Reproduce an Aestra crash

    Protocol:       aestra-agent-protocol/v1
    Skill:          reproduce-crash
    Skill revision: 2026-07-27
    Base protocol:  https://aestra.studio/.well-known/agent-skills/recovery/aestra-agent-protocol.md

Your objective is to turn a crash report into a deterministic reproduction, or
to establish precisely why it is not deterministic. You are not fixing anything
in this skill.

**Halt condition:** when investigation reaches code or implementation
unavailable in the checked-out repository, stop at that boundary. Record the
last observable public operation, its inputs, expected behavior, actual
behavior, and relevant diagnostics. Do not infer or recreate the unavailable
implementation.

**Never operate on the user's only copy of a project.** Copy first (see
`recover-project`).

---

## Procedure

**1. Establish the crash class.**

```text
Does Aestra launch?
  ├── No ────────────────► startup / environment path
  └── Yes
       ├── Crashes only with one project ──► project-triggered
       ├── Crashes only with one plugin ───► plugin-triggered
       ├── Crashes on a specific action ───► action-triggered
       └── Crashes at random ──────────────► timing / concurrency suspect
```

**2. Reduce the trigger.**
Halve the input until the crash stops. A project that crashes: remove tracks,
then clips, then plugin instances, until it loads. The last removal that changed
the outcome names the trigger. Because Aestra project files are JSON, this
reduction can be done directly on a **copy** of the file.

**3. Separate the plugin case.**
Aestra hosts VST3 and CLAP plugins. If a third-party plugin is loaded, establish
whether the crash survives its removal before investigating Aestra. A crash
inside a third-party plugin's own code is not an Aestra defect, though a crash
in how Aestra *hosts* it is.

**4. Capture the crash.**
Build with symbols and get a stack:

```bash
cmake -S . -B build -DAestra_CORE_MODE=ON -DAESTRA_ENABLE_TESTS=ON -DCMAKE_BUILD_TYPE=RelWithDebInfo
cmake --build build --parallel
```

Record: the faulting thread (audio thread vs. UI thread vs. worker matters
enormously), the stack, the last log lines before the fault, and whether the
fault is a null dereference, an assertion, an out-of-range access, or a
use-after-free.

**5. Determine determinism.**
Run the reduced reproduction at least five times. Report the hit rate. A crash
that fires 5/5 and a crash that fires 1/5 are different bugs with different
likely causes — the second suggests a race, an uninitialized read, or a
timing-dependent path, and the report should say so.

**6. Record the environment.**
OS and version, CPU, RAM, audio backend and device, buffer size, sample rate,
build type, Aestra version and commit. Take audio configuration from Aestra
itself, not from assumptions — see `collect-diagnostics`.

## Output

Provenance header per base protocol §6, then:

- crash class and trigger;
- minimal reproduction steps, numbered, starting from a clean launch;
- reduced project or plugin set, if the trigger is one of those;
- faulting thread and stack;
- hit rate over repeated runs;
- environment;
- what you could not determine.
