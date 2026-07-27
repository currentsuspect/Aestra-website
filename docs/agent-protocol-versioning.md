# Aestra agent protocol — versioning and compatibility policy

This is **governance material for Aestra maintainers.** It is deliberately not
part of any published skill: an agent recovering someone's damaged project does
not need to know how we decide semantic compatibility, and putting it in a
runtime artifact would burn context to no purpose.

The published skills state only what an operating agent needs:

```text
Protocol: aestra-agent-protocol/v1
Skill:    recover-project
```

## What is published

```text
public/.well-known/agent-skills/
├── index.json                  ← the definition of "current"
└── recovery/
    └── v1/
        ├── aestra-agent-protocol/SKILL.md
        ├── investigate-bug/SKILL.md
        ├── reproduce-crash/SKILL.md
        ├── recover-project/SKILL.md
        ├── prepare-pr/SKILL.md
        └── collect-diagnostics/SKILL.md
```

Conformance targets:

- Discovery index — [agent-skills-discovery-rfc](https://github.com/cloudflare/agent-skills-discovery-rfc) v0.2.0
- `SKILL.md` format — <https://agentskills.io/specification>

## The two rules that matter

### 1. Artifacts under a version directory are immutable

Once `recovery/v1/<name>/SKILL.md` is published, **it is never edited again** —
not for typos, not for clarifications, not for formatting. Reports produced
under v1 cite that exact URL and digest as evidence. Editing it retroactively
invalidates every report that ever referenced it, silently.

To change a skill, publish `recovery/v2/<name>/SKILL.md` and repoint the index.

### 2. There is no `latest/` alias

The index **is** the definition of current. It points at immutable artifacts:

```text
index → recovery/v1/recover-project/SKILL.md      (today)
index → recovery/v2/recover-project/SKILL.md      (after v2 ships)
```

Old reports keep resolving to v1 forever. Current agents discover v2
automatically. There is no duplicated alias directory to fall out of sync,
because there is no alias.

## When to bump the protocol version

The intuition from ordinary API versioning **inverts** here. In a REST API,
adding a field is safe. In a protocol that instructs behaviour, adding a
*constraint* is the breaking move, because agent behaviour that was compliant
yesterday becomes non-compliant today.

| Change | Compatibility |
| --- | --- |
| Remove a rule | **Breaking** — callers relied on the behaviour it produced |
| Add a prohibition | **Breaking** — previously valid agent behaviour becomes invalid |
| Tighten an existing rule's scope | **Breaking** |
| Change the required report format | **Breaking** — it breaks *us*, the consumer |
| Rename or remove a skill | **Breaking** — the name is a URL |
| Add a permission or an option | Additive |
| Clarify wording without changing what is required | Additive |
| Add a new skill | Additive |

Breaking changes require a new protocol version *and* a new artifact directory.
Additive changes still require a new artifact directory — artifacts are
immutable — but may keep the same protocol version.

Tightening a rule feels conservative, which is exactly why it gets shipped as a
patch by accident. It is not a patch.

## Deprecation

A published URL cannot be withdrawn. Once someone has pasted it into an agent
config it is load-bearing indefinitely.

- Deprecated skills **keep serving their bytes unchanged.**
- Removal from `index.json` is what makes a skill no longer *current*; the
  artifact stays reachable.
- Aestra-specific status lives in the SKILL.md `metadata` block
  (`status: active | deprecated | superseded`), which is the spec-sanctioned
  place for publisher extensions. It is **not** part of the discovery RFC —
  clients are required to ignore fields they do not recognise, so this is
  Aestra metadata, not standard metadata.

## Enforcement

`scripts/agent-skills.mjs` runs on every build (`npm run build`) and fails it on:

- a digest that disagrees with the bytes on disk
- an index `url` that does not resolve to a real `SKILL.md`
- a `type` outside `skill-md` / `archive`
- a wrong `$schema`
- a malformed `digest` (must be `sha256:` + 64 lowercase hex)
- a frontmatter `name` that does not match its parent directory
- a missing or over-long `description`
- a skill on disk that is missing from the index

```bash
npm run skills:check    # verify
npm run skills:write    # regenerate index.json from disk
```

The build gate exists because a stale digest does not degrade gracefully. A
conforming client refuses a download whose bytes do not match the advertised
digest, so the skill does not become *slightly wrong* — it disappears entirely,
and only for the well-behaved clients you most wanted to reach.

The upstream [`skills-ref`](https://github.com/agentskills/agentskills/tree/main/skills-ref)
library also offers `skills-ref validate ./my-skill` for the SKILL.md format
alone. It is not currently installed here; the script above covers the same
frontmatter rules plus the discovery-index rules that `skills-ref` does not.

## Release checklist

1. Create `recovery/v<n>/<name>/SKILL.md`. Never touch a previous version.
2. Set `metadata.protocol` in the frontmatter to the protocol version it assumes.
3. Mark superseded skills `status: superseded` in their **new** copy — not by
   editing the old artifact.
4. `npm run skills:write`, then `npm run skills:check`.
5. Update the compatibility table above if the rules themselves changed.
6. Update the copy-paste prompts in `src/pages/Recovery.tsx` to the new URLs.
