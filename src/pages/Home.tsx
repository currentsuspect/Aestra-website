import React, { useState, useEffect, useRef, memo, lazy, Suspense } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button, FadeIn } from "../components/ui";
import { useToast } from "../components/Toast";
import { EMAIL_RE } from "../../shared/waitlist";
import { RELEASES } from "../changelogData";
import { ChangelogArrangement, CHANGELOG_SELECT_KEY, type ArrangementSelection } from "../components/ChangelogArrangement";
import type { MockPart } from "../components/mock/EmberMock";
import type { PageProps } from "../types";
import { useStructuredData } from "../seo";

/* ─────────────────────────────────────────────────────────────────
   Home — the first encounter with Aestra, set as a manual.

   The page does not describe care; it demonstrates it. Every section
   is either the product itself (Fig. 1, the recreated timeline), something
   that shipped and can be found in the changelog, a principle quoted
   from philosophy.md in ~/Dev/Aestra, or a plain statement of status.
   Nothing here should need an asterisk. If a line can't be traced to
   a commit, a release note or that document, it doesn't belong.
   Sections are numbered because a manual's are: § 1 is the figure.
   ───────────────────────────────────────────────────────────────── */

const EmberMock = lazy(() => import("../components/mock/EmberMock").then((m) => ({ default: m.EmberMock })));

/* The newest shipped release, not the in-progress "Unreleased" line. */
const LATEST = RELEASES.find((r) => r.status !== "active") ?? RELEASES[0];

/* Internal link that still behaves like a link (middle-click, copy). */
const PageLink = ({
  to, setPage, className = "", children,
}: { to: string; setPage: (p: string) => void; className?: string; children: React.ReactNode }) => (
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

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-[1320px] mx-auto ${className}`}>{children}</div>
);

/* A manual section: number and title on the left, body under a heavy rule. */
const Section = ({
  n, title, id, aside, children,
}: { n: string; title: React.ReactNode; id?: string; aside?: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="px-5 sm:px-6 pt-20 sm:pt-28 scroll-mt-20">
    <Wrap className="grid lg:grid-cols-12 gap-8 lg:gap-6">
      <FadeIn className="lg:col-span-4">
        <p className="readout mb-4">§ {n}</p>
        <h2 className="display-2 text-[clamp(2.2rem,1.2rem+3.2vw,4rem)]">{title}</h2>
        {aside}
      </FadeIn>
      <FadeIn delay={0.05} className="lg:col-span-8 border-t-2 border-fg">
        {children}
      </FadeIn>
    </Wrap>
  </section>
);

/* ── § 1 · Hero + Fig. 1 ────────────────────────────────────────── */
const PARTS: { part: MockPart; title: string; body: string }[] = [
  { part: "views", title: "Views", body: "Arsenal, Timeline, Audition. One window, three jobs." },
  { part: "transport", title: "Transport", body: "Play, stop, record. Play turns violet while it plays; record turns red when armed." },
  { part: "position", title: "Position", body: "Bars, beats and sixteenths first, clock time beside it. Stop once and it's back at the top." },
  { part: "record", title: "Record", body: "Count-in, wait for input, loop record and the metronome, each with a lamp that shows it's on." },
  { part: "output", title: "Output", body: "A live scope and stereo meter, in the transport where you can see them." },
  { part: "library", title: "Library", body: "Your files one drag from the timeline. A pack's shared prefix drops off every row." },
  { part: "tracks", title: "Tracks", body: "Mute, solo and arm as lettered keys on every lane, lit in their own colours." },
  { part: "clip", title: "Clip", body: "Flat colour, a name, and the waveform you recorded." },
];

const Hero = ({ setPage, onEarlyAccess }: PageProps) => {
  const [part, setPart] = useState<MockPart | null>(null);
  return (
    <section className="px-5 sm:px-6 pt-24 sm:pt-28 lg:pt-32">
      <Wrap>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-end pb-10 sm:pb-12">
          <FadeIn className="lg:col-span-8">
            <h1 className="display hero-title">Less distance between an idea and its sound.</h1>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 xl:col-span-3 xl:col-start-10 grid gap-5">
            <p className="text-[16px] leading-relaxed text-muted max-w-[34rem]">
              Aestra is a native digital audio workstation, made for the person with
              something to say and a machine that isn't new. It's free, and it's in alpha.
            </p>
            <Button size="lg" onClick={() => onEarlyAccess?.()} className="justify-between">
              Request early access <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
            <PageLink to="changelog" setPage={setPage} className="text-[14px] justify-self-start">
              What changed in {LATEST.version}
            </PageLink>
          </FadeIn>
        </div>

        <figure className="m-0">
          <div className="border border-fg" onMouseLeave={() => setPart(null)}>
            <Suspense fallback={<div className="aspect-[1280/543] bg-[#000]" aria-hidden="true" />}>
              <EmberMock activePart={part} />
            </Suspense>
          </div>
          <figcaption className="readout flex flex-wrap justify-between gap-x-6 gap-y-1 py-3 border-b border-border">
            <span>Fig. 1 — Timeline view · 15 tracks · 112 BPM</span>
            <span>Recreated from the development build · press play, mute, solo</span>
          </figcaption>
        </figure>

        <ul className="parts-list m-0 p-0 mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-border">
          {PARTS.map((p, i) => (
            <li
              key={p.part}
              tabIndex={0}
              data-hot={part === p.part ? "" : undefined}
              onMouseEnter={() => setPart(p.part)}
              onMouseLeave={() => setPart(null)}
              onFocus={() => setPart(p.part)}
              onBlur={() => setPart(null)}
              className="list-none grid grid-cols-[28px_1fr] gap-x-3 gap-y-1 px-4 py-4 border-r border-b border-border outline-none"
            >
              <span className="font-mono text-[11px] font-semibold text-accent pt-[3px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-fg text-[15px] font-semibold">{p.title}</span>
              <span className="col-start-2 text-muted text-[14px] leading-relaxed">{p.body}</span>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
};

/* ── § 2 · Operating notes — behaviour, stated as plainly as a release note ── */
const DETAILS: { line: string; where: string }[] = [
  { line: "Press stop once. The playhead goes back to the top.", where: "v0.7.1" },
  { line: "Recorded takes land on the grid, not late by your interface's latency.", where: "v0.7.1" },
  { line: "Split, mute or delete while the loop is playing, and you hear the change immediately, not on the next pass.", where: "v0.7.1" },
  { line: "Routing through a mixer channel doesn't make anything quieter than sending it straight to the master.", where: "v0.7.0" },
  { line: "A solo bounce includes the track's send returns, exactly as they sound in the full mix.", where: "v0.7.0" },
  { line: "Routing changes can be undone, and a feedback loop is refused instead of silently breaking the audio.", where: "v0.7.0" },
  { line: "Move your audio files and the project tells you which ones are missing, then lets you relink them.", where: "v0.7.1" },
  { line: "Code marked realtime is checked by the compiler. An allocation or a lock inside it fails CI.", where: "engine" },
];

const Details = memo(({ setPage }: PageProps) => (
  <Section
    n="2"
    id="details"
    title="Operating notes"
    aside={
      <p className="mt-6 text-muted text-[15px] leading-relaxed max-w-sm">
        Small things, done correctly. Each one shipped, and each one is in the changelog.
      </p>
    }
  >
    {/* Kept so old /#features anchors still land somewhere sensible. */}
    <span id="features" className="block -translate-y-24" aria-hidden="true" />
    <ol className="m-0 p-0">
      {DETAILS.map((d, i) => (
        <li key={d.line} className="list-none grid grid-cols-[40px_1fr_auto] gap-3 py-4 border-b border-border">
          <span className="font-mono text-[11px] font-semibold text-accent pt-[5px]">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-fg text-[16px] sm:text-[18px] leading-snug">{d.line}</span>
          <span className="readout pt-[5px]">{d.where}</span>
        </li>
      ))}
    </ol>
    <div className="mt-5 text-[14px]">
      <PageLink to="changelog" setPage={setPage}>Full changelog</PageLink>
    </div>
  </Section>
));

/* ── § 3 · Recent sessions — the changelog, arranged ── */
const Sessions = memo(({ setPage }: PageProps) => {
  const recent = [...RELEASES].reverse().slice(-3);
  // Hand the selection to the changelog page, which opens it in the clip editor.
  const open = (s: ArrangementSelection) => {
    try { sessionStorage.setItem(CHANGELOG_SELECT_KEY, JSON.stringify(s)); } catch { /* opens on the latest */ }
    setPage("changelog");
  };
  return (
    <Section
      n="3"
      title="Recent sessions"
      aside={
        <p className="mt-6 text-muted text-[15px] leading-relaxed max-w-sm">
          The last three cycles, laid out like an arrangement. Each lane is a kind of
          change, each mark is one entry. The one on the right is still recording.
        </p>
      }
    >
      <div className="pt-6">
        <ChangelogArrangement releases={recent} selection={null} onSelect={open} compact />
        <div className="mt-5 text-[14px]">
          <PageLink to="changelog" setPage={setPage}>Every release</PageLink>
        </div>
      </div>
    </Section>
  );
});

/* ── § 4 · Specifications — the honest table. Mirrors the FAQ and the
   5 Aug truth pass (835a2af); update both together. ── */
type State = "ready" | "partial" | "absent";
const STATUS: { area: string; state: State; note: React.ReactNode }[] = [
  { area: "Linux", state: "ready", note: "Built and tested here. This is the platform to use today." },
  { area: "Windows", state: "partial", note: "The audio core compiles and passes tests. The desktop app doesn't build yet." },
  { area: "macOS", state: "absent", note: "Not supported. Deferred to 2027." },
  { area: "VST3 · CLAP", state: "partial", note: "Loads on Linux, unfinished. Some CLAP host callbacks are still stubs." },
  { area: "Built-in effects", state: "ready", note: "Reverb, EQ, delay, filter, a transient shaper and more, free with the DAW." },
  { area: "Installers", state: "absent", note: "None yet. Aestra is source-available; you can build it today." },
  { area: "Collaboration", state: "absent", note: "Doesn't exist yet. No server, no accounts, no sync." },
];
const STATE_TAG: Record<State, { label: string; cls: string }> = {
  ready: { label: "Works", cls: "text-success" },
  partial: { label: "Partial", cls: "text-warn" },
  absent: { label: "Not yet", cls: "text-faint" },
};

const Status = memo(({ setPage }: PageProps) => (
  <Section
    n="4"
    title="Specifications"
    aside={
      <div className="mt-6 max-w-sm">
        <p className="readout mb-2">Latest · {LATEST.version} · {LATEST.date}</p>
        <p className="text-[15px] text-muted leading-relaxed">{LATEST.summary}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          <PageLink to="roadmap" setPage={setPage}>Roadmap</PageLink>
          <PageLink to="download" setPage={setPage}>Build from source</PageLink>
        </div>
      </div>
    }
  >
    <dl className="m-0">
      {STATUS.map((s) => (
        <div key={s.area} className="grid grid-cols-[1fr_auto] sm:grid-cols-[170px_1fr_auto] gap-x-4 gap-y-1 py-3.5 border-b border-border items-baseline">
          <dt className="text-muted text-[15px]">{s.area}</dt>
          <dd className="m-0 col-span-2 sm:col-span-1 row-start-2 sm:row-start-auto text-fg text-[15px] leading-relaxed">{s.note}</dd>
          <dd className="m-0 row-start-1 col-start-2 sm:col-start-auto sm:row-start-auto">
            <span className={`font-mono text-[10.5px] tracking-[0.06em] uppercase px-1.5 py-0.5 border border-current whitespace-nowrap ${STATE_TAG[s.state].cls}`}>
              {STATE_TAG[s.state].label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  </Section>
));

/* ── § 5 · Principles — quoted from philosophy.md, not invented ── */
const PRINCIPLES = [
  { title: "Sound first.", body: "Stable timing, deterministic rendering, accurate latency, realtime-safe execution. An export should sound like the session, every time." },
  { title: "Flow over features.", body: "A fast, incomplete idea is worth more than a perfect, interrupted one. Good defaults, few dialogs, quick recovery from mistakes." },
  { title: "Work doesn't disappear.", body: "Your work is kept safe. Projects made in an older version open in a newer one, and recovery is built in." },
];

const Principles = memo(() => (
  <Section n="5" title="Principles">
    <blockquote className="m-0 pt-6">
      <p className="text-fg text-[clamp(1.35rem,1rem+1.4vw,2.25rem)] leading-[1.22] text-balance max-w-[46rem]">
        The producer on a 4&nbsp;GB laptop. The artist working late in a city
        where gear costs a month's salary.{" "}
        <span className="text-muted">Aestra doesn't assume a studio. It assumes a person with something to say.</span>
      </p>
      <footer className="mt-5 readout">
        From{" "}
        <a href="https://github.com/currentsuspect/Aestra/blob/main/philosophy.md" target="_blank" rel="noopener noreferrer" className="quiet-link normal-case tracking-normal">
          philosophy.md
        </a>
        , in the Aestra repository
      </footer>
    </blockquote>
    <div className="mt-12 grid md:grid-cols-3 border-t border-border">
      {PRINCIPLES.map((p, i) => (
        <div key={p.title} className={`py-5 md:pr-6 ${i > 0 ? "md:pl-6 md:border-l border-border" : ""} ${i < 2 ? "border-b md:border-b-0 border-border" : ""}`}>
          <h3 className="text-fg text-[16px] font-semibold mb-2">{p.title}</h3>
          <p className="text-muted text-[14.5px] leading-relaxed m-0">{p.body}</p>
        </div>
      ))}
    </div>
  </Section>
));

/* ── § 6 · Cost ─────────────────────────────────────────────────── */
const Cost = memo(({ setPage }: PageProps) => (
  <Section
    n="6"
    title="Cost"
    aside={
      <p className="mt-6 text-muted text-[15px] leading-relaxed max-w-sm">
        The whole DAW is the free version. Every feature, no export limits, no watermark.
        What you make is yours, with no royalties. Paying funds the work; it doesn't unlock it.
      </p>
    }
  >
    <div className="grid sm:grid-cols-3">
      {[
        ["Core", "$0", "The full DAW."],
        ["Supporter", "$5/mo", "The Native Suite, local Muse, and collaboration once it exists."],
        ["Founder", "$129", "A numbered digital record and 24 months of Supporter."],
      ].map(([tier, price, desc], i) => (
        <div key={tier} className={`py-5 sm:pr-5 grid gap-2 content-start border-b sm:border-b-0 border-border ${i > 0 ? "sm:pl-5 sm:border-l" : ""}`}>
          <span className="readout">{tier}</span>
          <strong className="display text-[3.4rem] leading-none">{price}</strong>
          <p className="m-0 text-muted text-[14px] leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-5 text-[14px]">
      <PageLink to="pricing" setPage={setPage}>How pricing works</PageLink>
    </div>
  </Section>
));

/* ── § 7 · Questions ────────────────────────────────────────────── */
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
  // FAQ markup is read back from the rendered answers, so it always says
  // exactly what a visitor can read here, links and all flattened to text.
  const list = useRef<HTMLDivElement>(null);
  const [faqData, setFaqData] = useState<object | null>(null);
  useEffect(() => {
    const rows = [...(list.current?.querySelectorAll("details") ?? [])];
    const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    setFaqData({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.aestra.studio/#faq",
      mainEntity: rows.map((row) => ({
        "@type": "Question",
        name: text(row.querySelector("summary")),
        acceptedAnswer: { "@type": "Answer", text: text(row.querySelector("summary + div")) },
      })),
    });
  }, []);
  useStructuredData("faq-structured-data", faqData);
  return (
    <Section n="7" title="Questions">
      <div ref={list}>
        {faqs.map((item) => (
          <details key={item.q} className="group faq-row border-b border-border">
            <summary className="flex items-start justify-between gap-6 cursor-pointer list-none py-4">
              <span className="text-fg text-[15px] sm:text-base font-medium">{item.q}</span>
              <span aria-hidden="true" className="faq-toggle mt-1.5" />
            </summary>
            <div className="pb-6 -mt-1 max-w-2xl text-muted text-[15px] leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>
    </Section>
  );
});

/* ── § 8 · Founder waitlist ─────────────────────────────────────── */
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
    <Section n="8" id="founder-section" title="Five hundred, once.">
      <div className="pt-6">
        <p className="m-0 text-muted text-base sm:text-[17px] leading-relaxed max-w-xl">
          A numbered digital record, a fixed Founder Collection you own, and
          24 months of Supporter from public beta. Sales open when public beta
          meets its release bar. This list sends notice only; it doesn't reserve a card.
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-md" aria-label="Founder waitlist signup" noValidate>
            <label className="sr-only" aria-hidden="true">
              Website
              <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
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
              className="w-full sm:flex-1 h-11 shrink-0 px-3.5 rounded-md bg-bg border border-border-2 text-fg text-sm placeholder-dim focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="h-11 px-5 rounded-md border border-fg text-fg font-medium text-sm hover:bg-fg hover:text-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {submitting ? "Joining..." : "Notify me"}
            </button>
            {error && <p id={errorId} role="alert" className="text-error text-sm mt-2 sm:basis-full">{error}</p>}
          </form>
        ) : (
          <div id={successId} role="status" aria-live="polite" className="mt-8 flex items-center gap-2 text-fg">
            <Check className="w-4 h-4 text-success" aria-hidden="true" />
            <span className="font-medium">You're on the list.</span>
          </div>
        )}
      </div>
    </Section>
  );
};

/* ── Close ────────────────────────────────────────────────────────── */
const ClosingCTA = memo(({ setPage, onEarlyAccess }: PageProps) => (
  <section className="px-5 sm:px-6 pt-28 sm:pt-36 pb-10">
    <Wrap className="border-t-2 border-fg pt-10">
      <FadeIn>
        <h2 className="display text-[clamp(3rem,1.5rem+6vw,8rem)] max-w-[14ch]">Come break it before everyone else does.</h2>
        <p className="mt-8 text-muted text-base sm:text-lg max-w-lg leading-relaxed">
          Early access gets you the builds as they ship, and a direct line for
          telling us what's wrong with them. We read all of it.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7">
          <Button size="lg" onClick={() => onEarlyAccess?.()}>Request early access</Button>
          <PageLink to="recovery" setPage={setPage} className="text-[15px]">
            Found a bug already? Report it properly
          </PageLink>
        </div>
      </FadeIn>
    </Wrap>
  </section>
));

export { Hero, Details, Sessions, Principles, Status, Cost, FAQ, FounderCountdown, ClosingCTA };
