import React, { useState, useEffect, useRef, memo, lazy, Suspense } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button, FadeIn } from "../components/ui";
import { PianoGrid } from "../components/PianoGrid";
import { Specimen } from "../components/Specimen";
import { useToast } from "../components/Toast";
import { EMAIL_RE } from "../../shared/waitlist";
import { RELEASES } from "../changelogData";
import type { PageProps } from "../types";

/* ─────────────────────────────────────────────────────────────────
   Home — the first encounter with Aestra.

   The page does not describe care; it demonstrates it. Every section
   is either the product itself (the timeline), something that shipped
   and can be found in the changelog (the ledger), a principle quoted
   from philosophy.md in ~/Dev/Aestra, or a plain statement of status.
   Nothing here should need an asterisk. If a line can't be traced to
   a commit, a release note or that document, it doesn't belong.
   ───────────────────────────────────────────────────────────────── */

const MockTimeline = lazy(() =>
  import("../components/MockTimeline").then((m) => ({ default: m.MockTimeline }))
);

const mockFallback = <div className="h-px" aria-hidden="true" />;

/* The newest shipped release, not the in-progress "Unreleased" line. */
const LATEST = RELEASES.find((r) => r.status !== "active") ?? RELEASES[0];

/* Internal link that still behaves like a link (middle-click, copy). */
const PageLink = ({
  to,
  setPage,
  className = "",
  children,
}: {
  to: string;
  setPage: (p: string) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <a
    href={to === "home" ? "/" : `/${to}`}
    onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      setPage(to);
    }}
    className={`quiet-link ${className}`}
  >
    {children}
  </a>
);

/* ── Hero ─────────────────────────────────────────────────────── */
const Hero = ({ setPage, onEarlyAccess }: PageProps) => (
  <section className="relative pt-28 sm:pt-36 lg:pt-44 pb-10 sm:pb-16 px-5 sm:px-6">
    <PianoGrid />
    <div className="relative max-w-6xl mx-auto w-full">
      <FadeIn>
        <h1 className="display hero-title text-fg max-w-[15ch] text-balance">
          Less distance between an idea and its sound.
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="mt-8 sm:mt-10 max-w-[34rem] text-[17px] sm:text-lg leading-relaxed text-muted">
          Aestra is a native digital audio workstation, made for the person with
          something to say and a machine that isn't new. It's free, and it's in alpha.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7">
          <Button size="lg" onClick={() => onEarlyAccess?.()}>
            Request early access
          </Button>
          <PageLink to="changelog" setPage={setPage} className="text-[15px] inline-flex items-center gap-2">
            Read what changed in {LATEST.version}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </PageLink>
        </div>
      </FadeIn>
    </div>

    <div className="mt-16 sm:mt-20 lg:mt-24">
      <Suspense fallback={mockFallback}>
        <MockTimeline />
      </Suspense>
      <p className="mt-4 px-5 sm:px-6 text-center readout text-faint !text-[10px]">
        Interactive · reproduced from the current desktop alpha
      </p>
    </div>
  </section>
);

/* ── 01 · Details ────────────────────────────────────────────────
   The ledger. Behaviour nobody puts on a feature page, stated as
   plainly as a release note, each tagged with where it shipped. ── */
const DETAILS: { line: string; where: string }[] = [
  { line: "Press stop once. The playhead goes back to the top.", where: "v0.7.1" },
  { line: "Recorded takes land on the grid — not late by your interface's latency.", where: "v0.7.1" },
  { line: "Split, mute or delete while the loop is playing, and you hear the change immediately, not on the next pass.", where: "v0.7.1" },
  { line: "Routing through a mixer channel doesn't make anything quieter than sending it straight to the master.", where: "v0.7.0" },
  { line: "A solo bounce includes the track's send returns, exactly as they sound in the full mix.", where: "v0.7.0" },
  { line: "Routing changes can be undone, and a feedback loop is refused instead of silently breaking the audio.", where: "v0.7.0" },
  { line: "Move your audio files and the project tells you which ones are missing, then lets you relink them.", where: "v0.7.1" },
  { line: "Code marked realtime is checked by the compiler. An allocation or a lock inside it fails CI.", where: "engine" },
];

const Details = memo(({ setPage }: PageProps) => {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const pointerInside = useRef(false);

  /* Scrolling lights the row crossing the middle of the viewport; the
     pointer takes over while it is inside the list. */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (pointerInside.current) return;
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.detail));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    list.querySelectorAll("[data-detail]").forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, []);

  return (
    <section id="details" className="sec-lead">
      {/* Kept so old /#features anchors still land somewhere sensible. */}
      <span id="features" className="block -translate-y-24" aria-hidden="true" />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
          <FadeIn>
            <div className="lg:sticky lg:top-28">
              <p className="kicker mb-6">01 · Details</p>
              <h2 className="display-2 text-3xl sm:text-4xl md:text-[44px] text-fg text-balance">
                Small things, done correctly.
              </h2>
              <p className="mt-6 text-muted text-base sm:text-[17px] leading-relaxed max-w-md">
                Nobody lists these on a feature page. They're the difference between
                software you trust and software you work around.
              </p>
              <div className="hidden lg:block mt-10">
                <Specimen index={active} tag={DETAILS[active].where} />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <ol
              ref={listRef}
              className="ledger ledger-live"
              onMouseEnter={() => { pointerInside.current = true; }}
              onMouseLeave={() => { pointerInside.current = false; }}
            >
              {DETAILS.map((d, i) => (
                <li
                  key={d.line}
                  className="ledger-row"
                  data-detail={i}
                  data-active={i === active ? "" : undefined}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="ledger-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ledger-line">{d.line}</span>
                  <span className="ledger-tag">{d.where}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 text-[14px]">
              <PageLink to="changelog" setPage={setPage} className="inline-flex items-center gap-2">
                Full changelog
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </PageLink>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
});

/* ── 02 · Principles — quoted from philosophy.md, not invented ── */
const PRINCIPLES = [
  {
    title: "Sound first.",
    body: "Stable timing, deterministic rendering, accurate latency, realtime-safe execution. An export should sound like the session, every time.",
  },
  {
    title: "Flow over features.",
    body: "A fast, incomplete idea is worth more than a perfect, interrupted one. Good defaults, few dialogs, quick recovery from mistakes.",
  },
  {
    title: "Work doesn't disappear.",
    body: "Your work is kept safe. Projects made in an older version open in a newer one, and recovery is built in.",
  },
];

const Principles = memo(() => (
  <section className="sec sec-tone border-y border-border/70">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <p className="kicker mb-6">02 · Principles</p>
        <blockquote className="max-w-4xl">
          <p className="display-2 text-2xl sm:text-3xl md:text-[40px] leading-[1.18] text-fg text-balance">
            The producer on a 4&nbsp;GB laptop. The artist working late in a city
            where gear costs a month's salary.{" "}
            <span className="text-muted">
              Aestra doesn't assume a studio. It assumes a person with something to say.
            </span>
          </p>
          <footer className="mt-6 readout">
            From{" "}
            <a
              href="https://github.com/currentsuspect/Aestra/blob/main/philosophy.md"
              target="_blank"
              rel="noopener noreferrer"
              className="quiet-link normal-case tracking-normal"
            >
              philosophy.md
            </a>
            , in the Aestra repository
          </footer>
        </blockquote>
      </FadeIn>

      <div className="mt-16 sm:mt-24 grid md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
        {PRINCIPLES.map((p, i) => (
          <FadeIn key={p.title} delay={i * 0.05}>
            <div className="pt-6 border-t border-border-2 h-full flex flex-col">
              <h3 className="text-fg text-[17px] font-semibold tracking-tight mb-3">{p.title}</h3>
              <p className="text-muted text-[15px] leading-relaxed flex-1">{p.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
));

/* ── 03 · Status — the honest table. Mirrors the FAQ and the
   5 Aug truth pass (835a2af); update both together. ───────────── */
type State = "ready" | "partial" | "absent";
const STATUS: { area: string; state: State; note: React.ReactNode }[] = [
  { area: "Linux", state: "ready", note: "Built and tested here. This is the platform to use today." },
  { area: "Windows", state: "partial", note: "The audio core compiles and passes tests. The desktop app doesn't build yet." },
  { area: "macOS", state: "absent", note: "Not supported. Deferred to 2027." },
  { area: "VST3 · CLAP", state: "partial", note: "Loads on Linux, unfinished — some CLAP host callbacks are still stubs." },
  { area: "Built-in effects", state: "ready", note: "Reverb, EQ, delay, filter, a transient shaper and more, free with the DAW." },
  { area: "Installers", state: "absent", note: "None yet. Aestra is source-available; you can build it today." },
  { area: "Collaboration", state: "absent", note: "Doesn't exist yet. No server, no accounts, no sync." },
];

const STATE_LABEL: Record<State, { label: string; cls: string }> = {
  ready: { label: "Works", cls: "text-emerald-400" },
  partial: { label: "Partial", cls: "text-amber-400" },
  absent: { label: "Not yet", cls: "text-faint" },
};

const Status = memo(({ setPage }: PageProps) => (
  <section className="sec border-t border-border/70">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
        <FadeIn>
          <p className="kicker mb-6">03 · Status</p>
          <h2 className="display-2 text-3xl sm:text-4xl md:text-[44px] text-fg text-balance">
            Where it stands.
          </h2>

          <div className="mt-10 pt-6 border-t border-border/70 max-w-md">
            <p className="readout mb-3">
              Latest · {LATEST.version} · {LATEST.date}
            </p>
            <p className="text-[15px] text-fg-muted leading-relaxed">{LATEST.summary}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
              <PageLink to="changelog" setPage={setPage}>Changelog</PageLink>
              <PageLink to="roadmap" setPage={setPage}>Roadmap</PageLink>
              <PageLink to="download" setPage={setPage}>Build from source</PageLink>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <dl className="ledger">
            {STATUS.map((s) => (
              <div key={s.area} className="status-row">
                <dt className="text-fg text-[15px] font-medium">{s.area}</dt>
                {/* Colour sits on inner spans: .readout is unlayered CSS and
                    would otherwise beat the text-* utility on the same node. */}
                <dd className="readout inline-flex items-center gap-2">
                  <span className={`${s.state === "absent" ? "status-dot-off" : "led"} ${STATE_LABEL[s.state].cls}`} aria-hidden="true" />
                  <span className={STATE_LABEL[s.state].cls}>{STATE_LABEL[s.state].label}</span>
                </dd>
                <dd className="status-note">{s.note}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── 04 · Cost ───────────────────────────────────────────────── */
const Cost = memo(({ setPage }: PageProps) => (
  <section className="sec border-t border-border/70">
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20 items-start">
        <FadeIn>
          <p className="kicker mb-6">04 · Cost</p>
          <h2 className="display-2 text-3xl sm:text-4xl md:text-[44px] text-fg text-balance">
            The whole DAW is the free version.
          </h2>
          <p className="mt-6 text-muted text-base sm:text-[17px] leading-relaxed max-w-md">
            Every feature, no export limits, no watermark. What you make is yours,
            with no royalties. Paying funds the work; it doesn't unlock it.
          </p>
          <div className="mt-6 text-[14px]">
            <PageLink to="pricing" setPage={setPage}>How pricing works</PageLink>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <dl className="ledger">
            {[
              ["Core", "The full DAW.", "$0"],
              ["Supporter", "The Native Suite, local Muse, and collaboration once it exists.", "$5 / mo"],
              ["Founder", "A numbered digital record and 24 months of Supporter.", "$129"],
            ].map(([tier, desc, price]) => (
              <div key={tier} className="price-row">
                <dt className="text-fg text-[15px] font-medium">{tier}</dt>
                <dd className="text-muted text-[14px] leading-relaxed">{desc}</dd>
                <dd className="font-mono text-[14px] text-fg tabular-nums text-right whitespace-nowrap">{price}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </div>
  </section>
));

/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQ = memo(({ setPage }: PageProps) => {
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "Is Aestra really free?",
      a: (
        <>
          Yes — the core DAW is free forever, with every feature unlocked and no
          cap on exports or session length. Optional{" "}
          <PageLink to="pricing" setPage={setPage} className="text-fg">Supporter and Founder offers</PageLink>{" "}
          fund development instead of gating it.
        </>
      ),
    },
    {
      q: "What's the difference between the free DAW and the paid plugins?",
      a: (
        <div className="space-y-3">
          <p>
            Aestra ships with its native effects out of the box — reverb, parametric EQ,
            compressor, delay, pitch shifting, filter, saturation, multiband, an LFO
            and a limiter. Free, forever, no asterisk.
          </p>
          <p>
            The Native Suite is a separate collection of specialist plugins, bundled into the
            $5/month Supporter tier. If you'd rather own than subscribe, individual
            plugins are available for one-time purchase on the site.
          </p>
        </div>
      ),
    },
    {
      q: "Will collaboration require everyone to subscribe?",
      a: "Collaboration does not exist yet — there is no server, no account system and no sync, and no storage amount is promised until there is. The intent when it ships: Core users can join and edit projects they are invited to, a Supporter owns the shared workspace, and if that Supporter lapses only the cloud copy goes read-only. Your local projects are yours regardless, always.",
    },
    {
      q: "What platforms does Aestra support?",
      a: "Linux is the platform Aestra is built and tested on today. Windows is a committed beta platform — the audio core compiles and passes tests there, but the desktop application does not build on Windows yet. macOS is not supported and is deferred to 2027. Note that no platform has a downloadable build yet: Aestra is source-available and pre-alpha.",
    },
    {
      q: "Does Aestra support VST3 and CLAP plugins?",
      a: "Partly, and only on Linux. The host compiles, loads plugins and runs sandbox isolation tests in CI, but it is unfinished — some CLAP host callbacks are still no-ops, and on Windows no third-party plugin loads at all today. The native Aestra effects are the dependable baseline. Full hosting on both platforms is a requirement before public beta, not something you can rely on now.",
    },
    {
      q: "Can I use Aestra commercially?",
      a: "Yes. Anything you create with Aestra — beats, mixes, stems, full projects — belongs entirely to you. There are no royalties, licensing fees, or attribution requirements on your output.",
    },
    {
      q: "Why not open source Aestra?",
      a: (
        <div className="space-y-3">
          <p>
            Source-available is the honest middle ground. Anyone can read exactly what Aestra
            is doing on their machine — no telemetry you can't see, no surprises — and suggest
            changes. What we keep is ownership, so nobody can repackage it and sell it back to you.
          </p>
          <p>
            Going fully open would mean copycat builds and no sustainable way to fund the work.
            This way the project stays transparent and stays alive.
          </p>
        </div>
      ),
    },
    {
      q: "When will Aestra be ready?",
      a: "You can make a track in it today — the engine, the pattern workflow, and the built-in plugins all work. It's alpha, so expect rough edges. Public beta lands late 2026; join early access and you'll get the builds as they ship.",
    },
  ];
  return (
    <section className="sec border-t border-border/70">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
          <FadeIn>
            <p className="kicker mb-6">05 · Questions</p>
            <h2 className="display-2 text-3xl sm:text-4xl md:text-[44px] text-fg">
              Asked often.
            </h2>
          </FadeIn>

          <div className="ledger">
            {faqs.map((item) => (
              <details key={item.q} className="group faq-row">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none py-5">
                  <span className="text-fg text-[15px] sm:text-base font-medium">{item.q}</span>
                  <span aria-hidden="true" className="faq-toggle mt-1.5" />
                </summary>
                <div className="pb-6 -mt-1 max-w-2xl text-muted text-[15px] leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/* ── Founder waitlist ─────────────────────────────────────────── */
const FounderCountdown = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email", "Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, source: "founder-waitlist" }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("You're on the Founder list.", "We'll email you when the digital Founder window opens.");
      } else {
        setError("Something went wrong. Try again.");
        toast.error("Couldn't join waitlist", "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
      toast.error("Network error", "Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formId = "founder-waitlist-email";
  const errorId = "founder-waitlist-error";
  const successId = "founder-waitlist-success";

  return (
    <section id="founder-section" className="sec border-t border-border/70">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
          <FadeIn>
            <p className="kicker mb-6">06 · Founder</p>
            <h2 className="display-2 text-3xl sm:text-4xl md:text-[44px] text-fg text-balance">
              Five hundred, once.
            </h2>
          </FadeIn>

          <FadeIn delay={0.05}>
            <p className="text-muted text-base sm:text-[17px] leading-relaxed max-w-xl">
              A numbered digital record, a fixed Founder Collection you own, and
              24 months of Supporter from public beta. Sales open when public beta
              meets its release bar. This list sends notice only; it doesn't reserve a card.
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-md"
                aria-label="Founder waitlist signup"
                noValidate
              >
                <label className="sr-only" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
                <label htmlFor={formId} className="sr-only">Email address</label>
                <input
                  id={formId}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  placeholder="you@studio.email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  className="w-full sm:flex-1 h-11 shrink-0 px-3.5 rounded-lg bg-bg border border-border-2 text-fg text-sm placeholder-dim focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className="h-11 px-5 rounded-lg border border-border-2 text-fg font-medium text-sm hover:bg-surface-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {submitting ? "Joining..." : "Notify me"}
                </button>
                {error && (
                  <p id={errorId} role="alert" className="text-rose-400 text-sm mt-2 sm:basis-full">
                    {error}
                  </p>
                )}
              </form>
            ) : (
              <div id={successId} role="status" aria-live="polite" className="mt-8 flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="font-medium">You're on the list.</span>
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

/* ── Close ────────────────────────────────────────────────────── */
const ClosingCTA = memo(({ setPage, onEarlyAccess }: PageProps) => (
  <section className="sec-lead border-t border-border/70">
    <div className="max-w-6xl mx-auto">
      <FadeIn>
        <h2 className="display text-4xl sm:text-6xl md:text-7xl text-fg max-w-[16ch] text-balance">
          Come break it before everyone else does.
        </h2>
        <p className="mt-8 text-muted text-base sm:text-lg max-w-lg leading-relaxed">
          Early access gets you the builds as they ship, and a direct line for
          telling us what's wrong with them. We read all of it.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7">
          <Button size="lg" onClick={() => onEarlyAccess?.()}>
            Request early access
          </Button>
          <PageLink to="recovery" setPage={setPage} className="text-[15px]">
            Found a bug already? Report it properly
          </PageLink>
        </div>
      </FadeIn>
    </div>
  </section>
));

export { Hero, Details, Principles, Status, Cost, FAQ, FounderCountdown, ClosingCTA };
