import React, { memo, useCallback, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bug,
  CheckCircle2,
  Copy,
  FileJson,
  LifeBuoy,
  Lock,
  Search,
  ShieldAlert,
} from "lucide-react";
import { FadeIn, Button, Card, Badge } from "../components/ui";
import { GitHubIcon } from "../components/Icons";
import { useToast } from "../components/Toast";
import { cn, detectOS } from "../lib";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   The Recovery Center orchestrates. The repositories own truth.

   Nothing on this page redefines the bug report format, the PR
   requirements, the contribution rules, or the project-load
   diagnostics. Those live in the Aestra repo and in
   ProjectSerializer respectively. This page makes the correct
   existing machinery obvious and easy to invoke, and hands agents a
   versioned, machine-discoverable copy of the operating procedure.
   ───────────────────────────────────────────────────────────────── */

const REPO = "https://github.com/currentsuspect/Aestra";
const SKILLS = "https://www.aestra.studio/.well-known/agent-skills/recovery/v1";
const SUPPORT = "support@aestra.studio";
const SECURITY = "security@aestra.studio";
const PROTOCOL = "aestra-agent-protocol/v1";

/* ── Signal path ──────────────────────────────────────────────────
   The triage tree as a patchbay rather than an ASCII block. Three
   sources, one boundary, two destinations, one bus. Decorative —
   the same routing is stated in prose beneath it for anyone who
   can't see it. ───────────────────────────────────────────────── */
const SignalPath = memo(() => (
  <svg
    viewBox="0 0 840 372"
    className="w-full h-auto"
    role="img"
    aria-label="Routing diagram: Report, Investigate and Recover all feed a public–private boundary, which routes to either a GitHub issue or the maintainer, and both resolve."
  >
    <defs>
      {/* userSpaceOnUse: a horizontal <line> has a zero-height bounding
          box, which makes the default objectBoundingBox units degenerate
          and the stroke render as nothing. */}
      <linearGradient id="rc-bus" gradientUnits="userSpaceOnUse" x1="240" y1="0" x2="600" y2="0">
        <stop offset="0%" stopColor="var(--color-border-2)" />
        <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.6" />
        <stop offset="100%" stopColor="var(--color-border-2)" />
      </linearGradient>
    </defs>

    {/* sources */}
    {[
      { x: 140, label: "REPORT", sub: "Say what broke" },
      { x: 420, label: "INVESTIGATE", sub: "Find the cause" },
      { x: 700, label: "RECOVER", sub: "Rescue a project" },
    ].map((s) => (
      <g key={s.label}>
        <rect
          x={s.x - 96}
          y={18}
          width={192}
          height={54}
          rx={8}
          fill="var(--color-bg-elev)"
          stroke="var(--color-border-2)"
        />
        <circle cx={s.x - 78} cy={38} r={3} fill="var(--color-accent)" />
        <text
          x={s.x - 66}
          y={42}
          fill="var(--color-fg)"
          fontSize="12"
          fontFamily="var(--font-mono)"
          letterSpacing="1.6"
        >
          {s.label}
        </text>
        <text x={s.x - 66} y={60} fill="var(--color-dim)" fontSize="11">
          {s.sub}
        </text>
      </g>
    ))}

    {/* patch cables into the bus */}
    <path d="M140 72 C140 110 420 108 420 140" fill="none" stroke="var(--color-border-3)" strokeWidth="1.5" />
    <path d="M420 72 L420 140" fill="none" stroke="var(--color-border-3)" strokeWidth="1.5" />
    <path d="M700 72 C700 110 420 108 420 140" fill="none" stroke="var(--color-border-3)" strokeWidth="1.5" />

    {/* the boundary */}
    <rect x={252} y={140} width={336} height={48} rx={8} fill="var(--color-surface)" stroke="var(--color-accent)" strokeOpacity="0.45" />
    <line x1={252} y1={188} x2={588} y2={188} stroke="url(#rc-bus)" strokeWidth="2" />
    <text
      x={420}
      y={170}
      fill="var(--color-fg-muted)"
      fontSize="12"
      fontFamily="var(--font-mono)"
      letterSpacing="1.4"
      textAnchor="middle"
    >
      PUBLIC / PRIVATE BOUNDARY
    </text>

    {/* split to destinations */}
    <path d="M420 188 C420 222 240 218 240 250" fill="none" stroke="var(--color-border-3)" strokeWidth="1.5" />
    <path d="M420 188 C420 222 600 218 600 250" fill="none" stroke="var(--color-border-3)" strokeWidth="1.5" />

    {[
      { x: 240, label: "GITHUB", sub: "Issue → PR → review" },
      { x: 600, label: "MAINTAINER", sub: "Private investigation" },
    ].map((d) => (
      <g key={d.label}>
        <rect x={d.x - 96} y={250} width={192} height={52} rx={8} fill="var(--color-bg-elev)" stroke="var(--color-border-2)" />
        <text
          x={d.x - 78}
          y={274}
          fill="var(--color-fg)"
          fontSize="12"
          fontFamily="var(--font-mono)"
          letterSpacing="1.6"
        >
          {d.label}
        </text>
        <text x={d.x - 78} y={291} fill="var(--color-dim)" fontSize="11">
          {d.sub}
        </text>
      </g>
    ))}

    {/* both resolve — dropped onto a shared bus rather than crossed back */}
    <path d="M240 302 L240 318" fill="none" stroke="var(--color-border-2)" strokeWidth="1.5" />
    <path d="M600 302 L600 318" fill="none" stroke="var(--color-border-2)" strokeWidth="1.5" />
    <line x1={240} y1={318} x2={600} y2={318} stroke="url(#rc-bus)" strokeWidth="1.5" />
    <path d="M420 318 L420 332" fill="none" stroke="var(--color-border-2)" strokeWidth="1.5" />
    <circle cx={420} cy={338} r={4} fill="var(--color-success)" />
    <text
      x={420}
      y={360}
      fill="var(--color-muted)"
      fontSize="11"
      fontFamily="var(--font-mono)"
      letterSpacing="1.2"
      textAnchor="middle"
    >
      RESOLVED
    </text>
  </svg>
));

/* ── Copyable block ───────────────────────────────────────────── */
const CopyBlock = memo(({ label, text }: { label: string; text: string }) => {
  const { success, error } = useToast();
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => success("Copied", label),
      () => error("Couldn't copy", "Your browser blocked clipboard access.")
    );
  }, [text, label, success, error]);

  return (
    <div className="relative group">
      <pre className="rounded-lg bg-surface border border-border/80 panel-sheen p-4 pr-12 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-fg-muted">
        {text}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="absolute top-2.5 right-2.5 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
});

/* ── Section heading, console-strip style ─────────────────────── */
const Mark = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <div className="sec-mark">
    <p className="kicker">
      <span className="text-faint tabular-nums">{n}</span>
      <span>{children}</span>
    </p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   Door 1 — Report

   Builds the payload; it does not own the format. The canonical
   form is .github/ISSUE_TEMPLATE/bug_report.md in the repo, and the
   deep link targets it directly so the two cannot drift apart.
   ───────────────────────────────────────────────────────────────── */

type Repro = "Always" | "Sometimes" | "Once";
type Route = "public" | "premium";

const REPRO: Repro[] = ["Always", "Sometimes", "Once"];

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block text-[13px] font-medium text-fg-muted mb-1.5">{label}</span>
    {hint && <span className="block text-[12px] text-dim mb-1.5 leading-relaxed">{hint}</span>}
    {children}
  </label>
);

const inputCls =
  "w-full rounded-lg bg-surface border border-border px-3 py-2 text-[13.5px] text-fg placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus:border-border-2 transition-colors";

const ReportBuilder = memo(() => {
  const { success, error, info } = useToast();
  const [route, setRoute] = useState<Route>("public");
  const [f, setF] = useState(() => ({
    version: "",
    os: detectOS(),
    cpu: "",
    ram: "",
    backend: "",
    device: "",
    sampleRate: "",
    bufferSize: "",
    plugin: "",
    component: "",
    doing: "",
    expected: "",
    actual: "",
    repro: "Always" as Repro,
    steps: "",
    logs: "",
  }));

  const set = useCallback(
    (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value })),
    []
  );

  const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;

  const body = useMemo(() => {
    const v = (s: string) => (s.trim() ? s.trim() : "unknown");
    const lines = [
      "## Description",
      "",
      v(f.actual),
      "",
      "## Environment",
      "",
      `- Aestra version: ${v(f.version)}`,
      `- Build type: unknown`,
      `- OS: ${v(f.os)}`,
      `- CPU: ${v(f.cpu)}${cores ? ` (${cores} logical cores reported by browser)` : ""}`,
      `- RAM: ${v(f.ram)}`,
      "",
      "Audio configuration — read from Aestra, not from the browser:",
      "",
      `- Audio backend: ${v(f.backend)}`,
      `- Audio device: ${v(f.device)}`,
      `- Sample rate: ${v(f.sampleRate)}`,
      `- Buffer size: ${v(f.bufferSize)}`,
      `- Plugin involved: ${v(f.plugin)}`,
      "",
      "## Steps to Reproduce",
      "",
      v(f.steps),
      "",
      `Reproducible: ${f.repro}`,
      "",
      "## Expected Behavior",
      "",
      v(f.expected),
      "",
      "## Actual Behavior",
      "",
      v(f.actual),
      "",
      "## What I was doing",
      "",
      v(f.doing),
      "",
      "## Logs/Output",
      "",
      "```",
      f.logs.trim() || "(paste logs, load report, or crash output)",
      "```",
      "",
      "## Screenshots",
      "",
      "(attach if applicable)",
      "",
      "## Additional Context",
      "",
      // GitHub's body param overrides the Markdown template's body, so
      // these two carry over by hand. They are checkbox groups in
      // .github/ISSUE_TEMPLATE/bug_report.md — left unticked for the
      // reporter rather than guessed at here.
      "**Affected Layer:**",
      "- [ ] AestraCore",
      "- [ ] AestraPlat",
      "- [ ] AestraUI",
      "- [ ] AestraAudio",
      "- [ ] AestraSDK",
      "- [ ] Build System",
      "- [ ] Other: ___________",
      "",
      "**Severity:**",
      "- [ ] Critical (crashes, data loss)",
      "- [ ] High (major functionality broken)",
      "- [ ] Medium (feature partially broken)",
      "- [ ] Low (minor issue, workaround exists)",
      "",
      "---",
      "",
      `Prepared via the Aestra Recovery Center · ${PROTOCOL}`,
    ];
    return lines.join("\n");
  }, [f, cores]);

  const premiumBody = useMemo(
    () =>
      [
        `Native Suite plugin: ${f.component.trim() || "unknown"}`,
        "",
        body,
      ].join("\n"),
    [body, f.component]
  );

  const openIssue = useCallback(() => {
    const url = `${REPO}/issues/new?template=bug_report.md&labels=bug&title=${encodeURIComponent(
      `[BUG] ${f.actual.trim().slice(0, 80) || "Describe the failure"}`
    )}&body=${encodeURIComponent(body)}`;

    // GitHub rejects very long prefilled URLs. Rather than silently
    // truncating the report, fall back to the clipboard and send the
    // user to the blank template.
    if (url.length > 7500) {
      navigator.clipboard.writeText(body).then(
        () => {
          info("Report copied", "It's too long to prefill. Paste it into the issue.");
          window.open(`${REPO}/issues/new?template=bug_report.md`, "_blank", "noopener,noreferrer");
        },
        () => error("Report too long to prefill", "Copy it manually below.")
      );
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [body, f.actual, info, error]);

  const emailSupport = useCallback(() => {
    const subject = `Native Suite: ${f.component.trim() || "plugin"} — ${f.actual.trim().slice(0, 60) || "issue"}`;
    const url = `mailto:${SUPPORT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(premiumBody)}`;
    if (url.length > 1800) {
      navigator.clipboard.writeText(premiumBody).then(
        () => {
          info("Report copied", `Paste it into an email to ${SUPPORT}.`);
          window.location.href = `mailto:${SUPPORT}?subject=${encodeURIComponent(subject)}`;
        },
        () => error("Couldn't copy", `Email ${SUPPORT} manually.`)
      );
      return;
    }
    window.location.href = url;
  }, [premiumBody, f.component, f.actual, info, error]);

  const copyReport = useCallback(() => {
    navigator.clipboard.writeText(route === "premium" ? premiumBody : body).then(
      () => success("Report copied"),
      () => error("Couldn't copy", "Your browser blocked clipboard access.")
    );
  }, [route, body, premiumBody, success, error]);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
      <Card className="p-5 sm:p-7">
        {/* routing selector */}
        <fieldset className="mb-7">
          <legend className="readout text-dim mb-3">Which part of Aestra?</legend>
          <div className="inline-flex rounded-lg border border-border bg-surface p-1 gap-1">
            {([
              ["public", "Public Aestra"],
              ["premium", "Native Suite"],
            ] as [Route, string][]).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRoute(id)}
                aria-pressed={route === id}
                className={cn(
                  "px-3.5 h-8 text-[13px] rounded-md transition-colors",
                  route === id ? "bg-surface-3 text-fg" : "text-muted hover:text-fg"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[12.5px] text-dim mt-3 leading-relaxed max-w-prose">
            You don't need to know whether the problem is in the public code. Just say what
            you were using. Public problems become a GitHub issue. Native Suite problems come
            to me by email.
          </p>
        </fieldset>

        {route === "premium" && (
          <div className="mb-6">
            <Field
              label="Which Native Suite plugin?"
              hint="The plugin you were using when it went wrong."
            >
              <input className={inputCls} value={f.component} onChange={set("component")} placeholder="e.g. AestraRumble" />
            </Field>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <Field label="Aestra version">
            <input className={inputCls} value={f.version} onChange={set("version")} placeholder="e.g. 0.7.1-alpha" />
          </Field>
          <Field label="Operating system">
            <input className={inputCls} value={f.os} onChange={set("os")} placeholder="e.g. Arch Linux" />
          </Field>
          <Field label="CPU">
            <input className={inputCls} value={f.cpu} onChange={set("cpu")} placeholder="e.g. Intel Core i5-6200U" />
          </Field>
          <Field label="RAM">
            <input className={inputCls} value={f.ram} onChange={set("ram")} placeholder="e.g. 4 GB" />
          </Field>
        </div>

        <div className="rounded-lg border border-border/80 bg-surface/50 p-4 mb-6">
          <p className="readout text-dim mb-1.5">Audio configuration</p>
          <p className="text-[12.5px] text-muted leading-relaxed mb-4 max-w-prose">
            Copy these from Aestra's audio settings. Your browser can report its own sample
            rate, but that isn't necessarily what Aestra is using, so this page doesn't guess.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Audio backend">
              <input className={inputCls} value={f.backend} onChange={set("backend")} placeholder="ALSA / ASIO / WASAPI" />
            </Field>
            <Field label="Audio device">
              <input className={inputCls} value={f.device} onChange={set("device")} placeholder="e.g. Focusrite Scarlett 2i2" />
            </Field>
            <Field label="Sample rate">
              <input className={inputCls} value={f.sampleRate} onChange={set("sampleRate")} placeholder="e.g. 48000" />
            </Field>
            <Field label="Buffer size">
              <input className={inputCls} value={f.bufferSize} onChange={set("bufferSize")} placeholder="e.g. 256" />
            </Field>
          </div>
        </div>

        <div className="space-y-5 mb-6">
          <Field label="Plugin involved, if any">
            <input className={inputCls} value={f.plugin} onChange={set("plugin")} placeholder="VST3 / CLAP plugin name and version" />
          </Field>
          <Field label="What were you doing?">
            <textarea rows={2} className={inputCls} value={f.doing} onChange={set("doing")} placeholder="Opening a project, recording a take, loading a plugin…" />
          </Field>
          <Field label="What did you expect?">
            <textarea rows={2} className={inputCls} value={f.expected} onChange={set("expected")} />
          </Field>
          <Field label="What happened instead?">
            <textarea rows={2} className={inputCls} value={f.actual} onChange={set("actual")} placeholder="Be specific. This becomes the issue title." />
          </Field>

          <fieldset>
            <legend className="block text-[13px] font-medium text-fg-muted mb-1.5">Can you reproduce it?</legend>
            <div className="inline-flex rounded-lg border border-border bg-surface p-1 gap-1">
              {REPRO.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setF((prev) => ({ ...prev, repro: r }))}
                  aria-pressed={f.repro === r}
                  className={cn(
                    "px-3.5 h-8 text-[13px] rounded-md transition-colors",
                    f.repro === r ? "bg-surface-3 text-fg" : "text-muted hover:text-fg"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          <Field label="Steps to reproduce" hint="Numbered, starting from opening Aestra fresh.">
            <textarea rows={4} className={inputCls} value={f.steps} onChange={set("steps")} placeholder={"1.\n2.\n3."} />
          </Field>
          <Field label="Logs, load report or crash output">
            <textarea rows={4} className={cn(inputCls, "font-mono text-[12.5px]")} value={f.logs} onChange={set("logs")} />
          </Field>
        </div>

        <div className="flex flex-wrap gap-3 mt-2 pt-5 border-t border-border/80">
          {route === "public" ? (
            <Button onClick={openIssue} icon={GitHubIcon}>Open a prefilled GitHub issue</Button>
          ) : (
            <Button onClick={emailSupport} icon={LifeBuoy}>Email the report</Button>
          )}
          <Button variant="outline" onClick={copyReport} icon={Copy}>Copy report</Button>
        </div>
      </Card>

      <div className="space-y-5 lg:sticky lg:top-24">
        <Card className="p-5">
          <p className="kicker mb-3">What a good report looks like</p>
          <div className="space-y-4 text-[13px] leading-relaxed">
            <div>
              <p className="text-dim mb-1">Weak</p>
              <p className="text-muted italic">"Aestra crashed when I opened my project."</p>
            </div>
            <div>
              <p className="text-emerald-400 mb-1">Strong</p>
              <p className="text-fg-muted">
                "Opening this project crashes Aestra every time, once the loading dialog
                reaches <span className="font-mono text-[12px]">Restoring mixer state</span>.
                A blank project opens fine. Removing section X of the project file stops it."
              </p>
            </div>
            <p className="text-dim pt-1 border-t border-border/80">
              The difference is narrowing it down. Saying what <em>doesn't</em> fail helps more
              than only saying what does.
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[13px] leading-relaxed">
              <p className="text-fg-muted font-medium mb-1">Found a vulnerability?</p>
              <p className="text-muted">
                Don't use this form or open a public issue. Email it privately to{" "}
                <a href={`mailto:${SECURITY}`} className="text-accent hover:text-accent-hover">{SECURITY}</a>.
                More in{" "}
                <a href="/.well-known/security.txt" className="text-accent hover:text-accent-hover">security.txt</a>.
              </p>
            </div>
          </div>
        </Card>

        <p className="text-[12.5px] text-dim leading-relaxed">
          The canonical bug format is{" "}
          <a
            href={`${REPO}/blob/main/.github/ISSUE_TEMPLATE/bug_report.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-fg underline decoration-border underline-offset-2"
          >
            bug_report.md
          </a>{" "}
          in the repository. This form fills that template in. It doesn't replace it.
        </p>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────
   Door 2 — Investigate (the Agent Toolkit)
   ───────────────────────────────────────────────────────────────── */

const TOOLKIT = [
  {
    name: "recover-project",
    title: "Rescue a damaged song",
    icon: FileJson,
    blurb: "Work on a copy, keep every note it can, and say plainly what survived and what didn't.",
  },
  {
    name: "investigate-bug",
    title: "Find out what's breaking Aestra",
    icon: Bug,
    blurb: "Find the real cause, make the smallest change that fixes it, and show that it worked.",
  },
  {
    name: "reproduce-crash",
    title: "Pin down a crash",
    icon: AlertTriangle,
    blurb: "Turn \"it crashes sometimes\" into exact steps that make it crash every time.",
  },
  {
    name: "collect-diagnostics",
    title: "Gather the technical details",
    icon: Search,
    blurb: "Collect the version, audio setup and log info a bug report needs, so you don't have to hunt for it.",
  },
  {
    name: "prepare-pr",
    title: "Send a fix to Aestra",
    icon: GitHubIcon,
    blurb: "Package a working fix the way the maintainer needs it to review and merge it.",
  },
] as const;

/* ── Situations, not skills ───────────────────────────────────────
   A producer doesn't arrive knowing which skill they want; they
   arrive knowing their song won't open. Each path states plainly
   what it costs to walk it — crucially, that rescuing a song needs
   no source code at all — and hands over a prompt that is complete
   on its own, URLs included. ─────────────────────────────────── */

type PathId = "song" | "bug" | "fix";

type AgentPath = {
  id: PathId;
  tab: string;
  headline: string;
  needsCode: boolean;
  need: string;
  where: string;
  setup?: string;
  prompt: string;
};

const PATHS: AgentPath[] = [
  {
    id: "song",
    tab: "My song won't open",
    headline: "You don't need Aestra's source code for this one.",
    needsCode: false,
    need: "Just the song file that's giving you trouble.",
    where:
      "Point the agent at the folder your song file is in. No downloading, no setup.",
    prompt: `My Aestra project won't open properly and I'd like to recover as much of it as possible.

Before you touch anything, read these and follow them exactly:
https://www.aestra.studio/.well-known/agent-skills/recovery/v1/recover-project/SKILL.md
https://www.aestra.studio/.well-known/agent-skills/recovery/v1/aestra-agent-protocol/SKILL.md

The rules that matter most to me:
- Make a copy first and work only on the copy. Never change my original file.
- Don't throw anything away just because it looks unfamiliar to you.
- When you're done, tell me in plain language what you recovered, what you
  couldn't, and anything you changed along the way.

My song file: <drag the file in, or paste where it lives>
What happens when I open it: <e.g. Aestra freezes, then closes by itself>`,
  },
  {
    id: "bug",
    tab: "Aestra is misbehaving",
    headline: "This one needs a copy of Aestra's code on your machine.",
    needsCode: true,
    need: "A copy of Aestra's code for the agent to read. You don't need a GitHub account.",
    where:
      "Run the command below, then point the agent at the Aestra folder it creates.",
    setup: "git clone https://github.com/currentsuspect/Aestra.git",
    prompt: `I've hit a bug in Aestra and I'd like you to work out what's causing it.

Read these first and follow them exactly:
https://www.aestra.studio/.well-known/agent-skills/recovery/v1/investigate-bug/SKILL.md
https://www.aestra.studio/.well-known/agent-skills/recovery/v1/aestra-agent-protocol/SKILL.md

The rules that matter most:
- Make the problem happen yourself before you change any code.
- Don't assume my explanation of the cause is right — I'm guessing.
- Aestra is a real-time audio app, so respect the audio-thread rules in the
  base protocol.
- If the trail leads into code that isn't in this folder, stop there and write
  up what you found instead of guessing at the rest.

Here's what's happening:
<paste the report you built in step 1 of the Recovery Center>`,
  },
  {
    id: "fix",
    tab: "I have a fix to send",
    headline: "You have a fix. Now get it to the maintainer.",
    needsCode: true,
    need: "The same Aestra folder from the previous path, with your fix in it.",
    where: "Point the agent at the Aestra folder containing your change.",
    prompt: `I have a fix for an Aestra bug and I'd like to send it to the maintainers properly.

Read these first and follow them exactly:
https://www.aestra.studio/.well-known/agent-skills/recovery/v1/prepare-pr/SKILL.md
https://www.aestra.studio/.well-known/agent-skills/recovery/v1/aestra-agent-protocol/SKILL.md

Treat the files already in this folder as the authority — CONTRIBUTING.md and
the pull request template override anything the web page says.

Before you tell me it's ready, confirm the original problem actually stops
happening. Tests passing is not the same thing as the bug being fixed.

Explain each step to me in plain language as you go — I'm a producer, not a
developer, and I want to understand what I'm sending.`,
  },
];

const HALT = `When investigation reaches code or implementation unavailable in the
checked-out repository, stop at that boundary. Record the last observable
public operation, its inputs, expected behavior, actual behavior, and
relevant diagnostics. Do not infer or recreate the unavailable
implementation.`;

const PROVENANCE = `Protocol:        ${PROTOCOL}
Skill:           <skill name>
Artifact:        <the exact SKILL.md URL you fetched>
Digest:          sha256:<the digest you verified from the index>
Aestra version:  <from the build>
Aestra commit:   <if known>
Project version: <"version" field of the project file>`;

const STEP_LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-faint mb-1.5";

const AgentToolkit = memo(() => {
  const { success, error } = useToast();
  const [pathId, setPathId] = useState<PathId>("song");
  const [showRef, setShowRef] = useState(false);
  const path = PATHS.find((p) => p.id === pathId)!;

  const copyInvocation = useCallback(
    (name: string, title: string) => {
      const text = `Please read the instructions at ${SKILLS}/${name}/SKILL.md and the base rules at ${SKILLS}/aestra-agent-protocol/SKILL.md, then follow them exactly for the task below. If the trail leads into code you don't have access to, stop there and write up what you found rather than guessing. Explain what you're doing in plain language as you go.

My situation: `;
      navigator.clipboard.writeText(text).then(
        () => success("Copied", `${title} — paste into your agent`),
        () => error("Couldn't copy", "Your browser blocked clipboard access.")
      );
    },
    [success, error]
  );

  return (
    <>
      {/* Primer — the questions a producer actually has first. */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            q: "Do I need to know how to code?",
            a: "No. You copy a prompt, paste it, and read what comes back in plain English.",
          },
          {
            q: "What counts as an agent?",
            a: "An AI assistant that can open files on your computer, like Claude Code or Cursor.",
          },
          {
            q: "Can it wreck my song?",
            a: "The instructions tell it to copy your file first and work on the copy. Your original is never touched.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-surface/50 border border-border/80 p-5">
            <p className="text-[13.5px] font-medium text-fg mb-1.5">{q}</p>
            <p className="text-[13px] text-muted leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* Path picker */}
      <div className="rounded-xl bg-bg border border-border/80 panel-sheen overflow-hidden mb-10">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6">
          <p className={STEP_LABEL}>Step 1 — which of these is you?</p>
          <div
            className="flex flex-wrap gap-1.5 mb-6"
            role="tablist"
            aria-label="Choose your situation"
          >
            {PATHS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === pathId}
                onClick={() => setPathId(p.id)}
                className={cn(
                  "px-4 h-9 text-[13.5px] rounded-lg border transition-colors",
                  p.id === pathId
                    ? "bg-surface-3 text-fg border-border-2"
                    : "bg-transparent text-muted border-border hover:text-fg hover:border-border-2"
                )}
              >
                {p.tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-6 sm:pb-7">
          <h3 className="text-[16px] font-semibold text-fg tracking-tight mb-4">
            {path.headline}
          </h3>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-lg bg-surface/60 border border-border/80 p-4">
              <p className={STEP_LABEL}>What you need</p>
              <p className="text-[13px] text-muted leading-relaxed mb-2">{path.need}</p>
              <span
                className={cn(
                  "readout inline-flex items-center gap-2",
                  path.needsCode ? "text-amber-400" : "text-emerald-400"
                )}
              >
                <span className="led" aria-hidden="true" />
                {path.needsCode ? "Some setup" : "No setup"}
              </span>
            </div>
            <div className="rounded-lg bg-surface/60 border border-border/80 p-4">
              <p className={STEP_LABEL}>Step 2 — where to point it</p>
              <p className="text-[13px] text-muted leading-relaxed">{path.where}</p>
            </div>
          </div>

          {path.setup && (
            <div className="mb-6">
              <p className={STEP_LABEL}>Run this first</p>
              <CopyBlock label="clone command" text={path.setup} />
              <p className="text-[12.5px] text-dim leading-relaxed mt-2">
                Don't have <span className="font-mono text-[12px]">git</span>? Ask the agent to
                do it for you — pasting that line and saying "run this for me" is enough.
              </p>
            </div>
          )}

          <div>
            <p className={STEP_LABEL}>Step 3 — copy this, paste it to your agent</p>
            <p className="text-[12.5px] text-dim leading-relaxed mb-3">
              Fill in anything inside <span className="font-mono text-[12px]">&lt;angle
              brackets&gt;</span>. Everything else is written for you — including the links the
              agent needs to read.
            </p>
            <CopyBlock label={`${path.tab} prompt`} text={path.prompt} />
          </div>
        </div>
      </div>

      {/* Why this is safe — the halt condition, in plain language first. */}
      <div className="rounded-xl border border-accent/30 bg-accent-soft p-5 sm:p-6 mb-10">
        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-fg mb-1.5">
              The agent knows where to stop
            </p>
            <p className="text-[13.5px] text-muted leading-relaxed max-w-prose mb-4">
              Some parts of Aestra aren't public. When the trail runs into one, the agent is
              told to stop and write down what it found, instead of inventing an explanation for
              code it can't see. That's the difference between a report I can act on and a
              confident guess that wastes everyone's afternoon. You send me what it found and I
              take it from there.
            </p>
            <details className="group">
              <summary className="readout text-dim hover:text-fg cursor-pointer list-none inline-flex items-center gap-2 transition-colors">
                <ArrowUpRight className="w-3 h-3 group-open:rotate-90 transition-transform" aria-hidden="true" />
                Read the exact wording
              </summary>
              <div className="mt-4">
                <CopyBlock label="halt condition" text={HALT} />
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Reference material — folded away by default. */}
      <div className="rounded-xl border border-border/80 bg-surface/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRef((s) => !s)}
          aria-expanded={showRef}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-surface/60 transition-colors"
        >
          <span>
            <span className="block text-[14px] font-medium text-fg">
              All five instruction sets
            </span>
            <span className="block text-[13px] text-muted mt-0.5">
              The full toolkit and how the protocol is versioned. Useful if you're technical or
              building your own tools.
            </span>
          </span>
          <span className="readout text-dim shrink-0">{showRef ? "Hide" : "Show"}</span>
        </button>

        {showRef && (
          <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-border/80">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              {TOOLKIT.map(({ name, title, icon: Icon, blurb }) => (
                <div
                  key={name}
                  className="rounded-xl bg-bg border border-border/80 panel-sheen p-5 flex flex-col hover:border-border-2 transition-colors"
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[13.5px] font-medium text-fg tracking-tight">{title}</span>
                  </div>
                  <p className="font-mono text-[11px] text-faint mb-3">{name}</p>
                  <p className="text-[13px] text-muted leading-relaxed flex-1 mb-4">{blurb}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" icon={Copy} onClick={() => copyInvocation(name, title)}>
                      Copy
                    </Button>
                    <a
                      href={`${SKILLS}/${name}/SKILL.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-fg transition-colors"
                    >
                      Read
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}

              <div className="rounded-xl bg-surface border border-border/80 panel-sheen p-5 flex flex-col">
                <p className="kicker mb-3">Base protocol</p>
                <p className="text-[13px] text-muted leading-relaxed flex-1 mb-4">
                  The rules every set above assumes: what the audio engine can't tolerate, how
                  small a fix should be, what a finished report contains, and where each case
                  gets routed.
                </p>
                <a
                  href={`${SKILLS}/aestra-agent-protocol/SKILL.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12.5px] text-accent hover:text-accent-hover transition-colors"
                >
                  {PROTOCOL}
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-[15px] font-semibold text-fg mb-2 tracking-tight">
                  Every report says what produced it
                </h3>
                <p className="text-[13.5px] text-muted leading-relaxed mb-4 max-w-prose">
                  When an agent's investigation is attached to an issue months later, anyone
                  can fetch the exact instructions it followed, check their hash, and confirm
                  they're the same. Published versions never change, so you don't have to take
                  anyone's word for it.
                </p>
                <CopyBlock label="provenance header" text={PROVENANCE} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-fg mb-2 tracking-tight">
                  Agents can find this on their own
                </h3>
                <p className="text-[13.5px] text-muted leading-relaxed mb-4 max-w-prose">
                  It isn't only copy and paste. Every instruction set is published, versioned
                  and checksummed in Aestra's skills index, so an agent can find the procedure
                  without you pasting anything.
                </p>
                <CopyBlock
                  label="skills index"
                  text={`https://www.aestra.studio/.well-known/agent-skills/index.json`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

/* ─────────────────────────────────────────────────────────────────
   Door 3 — Recover

   The report shape here mirrors ProjectSerializer's LoadIssue model
   exactly. If that model changes, this changes. No parallel
   vocabulary — a translation layer between engine and website is a
   thing that rots.
   ───────────────────────────────────────────────────────────────── */

type IssueRow = { sev: "ok" | "warn" | "err"; category: string; text: string };

const SAMPLE_REPORT: IssueRow[] = [
  { sev: "warn", category: "integrity", text: "Content checksum mismatch — file modified since save. Loaded non-destructively; verify before overwriting backups." },
  { sev: "warn", category: "clip", text: "Clip 4192 references unresolved pattern 88 — preserved with placeholder." },
  { sev: "warn", category: "unit", text: "MIDI note references missing Arsenal unit 1207 — note preserved, reference unresolved." },
  { sev: "warn", category: "media", text: "17 of 18 referenced files found. Missing: samples/vox_take3.wav" },
  { sev: "err", category: "plugin", text: "Could not restore state for instance 72. Instance preserved, parameters at defaults." },
];

const sevStyle: Record<IssueRow["sev"], { mark: string; cls: string }> = {
  ok: { mark: "✓", cls: "text-emerald-400" },
  warn: { mark: "⚠", cls: "text-amber-400" },
  err: { mark: "✕", cls: "text-rose-400" },
};

const RecoverPanel = memo(() => (
  <div className="grid lg:grid-cols-2 gap-8 items-start">
    <div>
      <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-medium text-fg mb-1">
              Never experiment on the only copy of a damaged project.
            </p>
            <p className="text-[13px] text-muted leading-relaxed">
              This holds even when you're sure. Copy first — then everything else is
              reversible.
            </p>
          </div>
        </div>
      </div>

      <CopyBlock
        label="preservation layout"
        text={`MySong.aestra
  ├── MySong-recovery-original.aestra   ← never modified
  └── MySong-recovery-working.aestra    ← all work happens here`}
      />

      <div className="mt-8 space-y-5">
        <div>
          <p className="kicker mb-2">Aestra has already done half the work</p>
          <p className="text-[13.5px] text-muted leading-relaxed max-w-prose">
            When Aestra can't read part of a song, it doesn't throw it away. It keeps it and
            tells you what it couldn't read. So most of the answer exists before anyone touches
            the file. And because songs are saved as readable text, an assistant can look inside
            without Aestra installed.
          </p>
        </div>

        <div>
          <p className="kicker mb-2">Work out what kind of problem it is</p>
          <pre className="rounded-lg bg-surface border border-border/80 panel-sheen p-4 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-fg-muted">{`Does Aestra open at all?
  ├── No ─────────────────────► it's Aestra, not your song
  └── Yes
       ├── Every song fails ──► it's Aestra, not your song
       └── Only this one ─────► it's the song — rescue it`}</pre>
        </div>

        <div className="pt-1">
          <a
            href="#investigate"
            className="inline-flex items-center gap-1.5 text-[13.5px] text-accent hover:text-accent-hover transition-colors"
          >
            Get the prompt for rescuing a song
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <div>
      <p className="kicker mb-3">What you get back</p>
      <p className="text-[13.5px] text-muted leading-relaxed mb-5 max-w-prose">
        A rescue must never mean <em>it opens now because half of it was deleted</em>. So the
        report says what came back, what didn't, and anything that was changed, in the same
        terms Aestra itself uses.
      </p>

      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between gap-3">
          <span className="readout text-dim">Project recovery</span>
          <span className="readout text-faint">{PROTOCOL}</span>
        </div>
        <div className="px-4 py-3 border-b border-border/80 flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="readout text-emerald-400 inline-flex items-center gap-2">
            <span className="led" aria-hidden="true" /> Loads
          </span>
          <span className="readout text-amber-400">4 warnings</span>
          <span className="readout text-rose-400">1 unrecoverable</span>
        </div>
        <ul className="divide-y divide-border/60">
          {SAMPLE_REPORT.map((row) => {
            const s = sevStyle[row.sev];
            return (
              <li key={row.category + row.text} className="px-4 py-3 flex gap-3">
                <span className={cn("font-mono text-[13px] shrink-0", s.cls)} aria-hidden="true">
                  {s.mark}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim mb-1">
                    {row.category}
                  </p>
                  <p className="text-[13px] text-fg-muted leading-relaxed">{row.text}</p>
                </div>
              </li>
            );
          })}
          <li className="px-4 py-3 flex gap-3 bg-surface/40">
            <span className="font-mono text-[13px] shrink-0 text-amber-400" aria-hidden="true">⚠</span>
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim mb-1">
                modified by recovery
              </p>
              <p className="text-[13px] text-fg-muted leading-relaxed">
                Removed malformed automation block on track 6. Contents recorded verbatim in
                the full report.
              </p>
            </div>
          </li>
        </ul>
      </Card>

      <p className="text-[12.5px] text-dim leading-relaxed mt-4">
        Every entry falls into exactly one of: recovered, could not restore, modified by
        recovery, or uncertain. Anything changed goes under <em>modified</em> — even when
        you're confident it was right.
      </p>
    </div>
  </div>
));

/* ─────────────────────────────────────────────────────────────── */

export const Recovery = memo((_: PageProps) => (
  <div className="min-h-screen pt-14 sm:pt-16">
    {/* Hero */}
    <section className="sec-lead">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="kicker mb-5">Recovery Center</p>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Something broke? Start here.
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mb-4">
            Report a bug, rescue a song that won't open, or hand the problem to an AI
            assistant. Describing what went wrong is enough. Do more only if you want to.
          </p>
          <p className="text-[13.5px] text-dim leading-relaxed max-w-2xl">
            No account needed, and nothing here assumes you can code.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-12 rounded-xl bg-bg border border-border/80 panel-sheen p-5 sm:p-8">
            <SignalPath />
          </div>
        </FadeIn>
      </div>
    </section>

    {/* 1 — Report */}
    <section className="sec border-t border-border/60" id="report">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <Mark n="01">Report</Mark>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h2 className="display text-2xl sm:text-3xl">I found a bug. I just want it fixed.</h2>
            <Badge variant="outline">No account needed</Badge>
          </div>
          <p className="text-[14.5px] text-muted leading-relaxed max-w-2xl mb-10">
            Fill this in and it builds the report in the shape the maintainer uses. For most
            people, this is all you need.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <ReportBuilder />
        </FadeIn>
      </div>
    </section>

    {/* 2 — Investigate */}
    <section className="sec border-t border-border/60" id="investigate">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <Mark n="02">Investigate</Mark>
          <h2 className="display text-2xl sm:text-3xl mb-3">
            Let an AI assistant dig into it for you.
          </h2>
          <p className="text-[14.5px] text-muted leading-relaxed max-w-2xl mb-10">
            You don't need to know how Aestra is built or write any code. Pick your situation,
            copy the prompt and paste it. It gives the assistant Aestra's own instructions: how
            to reproduce a problem before changing anything, what it must never break, where to
            stop, and what to tell you at the end.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <AgentToolkit />
        </FadeIn>
      </div>
    </section>

    {/* 3 — Recover */}
    <section className="sec border-t border-border/60" id="recover">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <Mark n="03">Recover</Mark>
          <h2 className="display text-2xl sm:text-3xl mb-3">
            My project is damaged, crashes or won't open.
          </h2>
          <p className="text-[14.5px] text-muted leading-relaxed max-w-2xl mb-10">
            Rescuing a song is different from fixing Aestra. The aim is to keep as much of your
            music as possible, find the damaged part instead of rebuilding around it, and tell
            you exactly what survived.
          </p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <RecoverPanel />
        </FadeIn>
      </div>
    </section>

    {/* Routing / premium */}
    <section className="sec-aside border-t border-border/60" id="routing">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <Mark n="04">Where it goes</Mark>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-start">
            <div>
              <h2 className="display text-2xl sm:text-3xl mb-3">
                Bring me what you found. Fixing it is my job, not yours.
              </h2>
              <p className="text-[14.5px] text-muted leading-relaxed max-w-prose mb-4">
                Some parts of Aestra aren't public, so there's a point past which nobody else
                can follow the trail. Don't try to rebuild those parts to get around it, and
                don't let an assistant try either.
              </p>
              <p className="text-[14.5px] text-muted leading-relaxed max-w-prose">
                Stopping there isn't failing. <em>"It breaks every time, at this exact point,
                and here's what I fed it"</em> is a useful result, often the most useful one I
                get. Send it over and I'll take it from there.
              </p>
            </div>

            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-border/80">
                <span className="readout text-dim">Routing</span>
              </div>
              <ul className="divide-y divide-border/60 text-[13.5px]">
                {[
                  { icon: GitHubIcon, when: "Defect in public Aestra", to: "GitHub issue, then PR", href: `${REPO}/issues/new?template=bug_report.md` },
                  { icon: LifeBuoy, when: "Native Suite or other non-public part", to: SUPPORT, href: `mailto:${SUPPORT}` },
                  { icon: ShieldAlert, when: "Security vulnerability", to: SECURITY, href: `mailto:${SECURITY}` },
                  { icon: FileJson, when: "Damaged project file", to: "recover-project first", href: `${SKILLS}/recover-project/SKILL.md` },
                ].map(({ icon: Icon, when, to, href }) => (
                  <li key={when} className="px-4 py-3.5 flex items-start gap-3">
                    <Icon className="w-4 h-4 text-muted shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-fg-muted mb-0.5">{when}</p>
                      <a
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className="text-[13px] text-accent hover:text-accent-hover break-words"
                      >
                        {to}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-10 rounded-xl bg-surface/50 border border-border/80 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[13.5px] text-fg-muted leading-relaxed mb-3 max-w-prose">
                  Aestra is source-available, so you get the code and the procedure for working on
                  it safely.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 readout text-dim">
                  <a href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">
                    Contributing →
                  </a>
                  <a href={`${REPO}/blob/main/.github/pull_request_template.md`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">
                    PR template →
                  </a>
                  <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">
                    Open issues →
                  </a>
                  <a href="/.well-known/agent-skills/index.json" className="hover:text-fg transition-colors">
                    Skills index →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  </div>
));
