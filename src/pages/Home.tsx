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
   Sections are numbered because a manual's are: 01 is the figure.
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
        <p className="readout mb-4">{n.padStart(2, "0")}</p>
        <h2 className="display-2 text-[clamp(2.2rem,1.2rem+3.2vw,4rem)]">{title}</h2>
        {aside}
      </FadeIn>
      <FadeIn delay={0.05} className="lg:col-span-8 border-t-2 border-fg">
        {children}
      </FadeIn>
    </Wrap>
  </section>
);

/* ── 1 · Hero + Fig. 1 ────────────────────────────────────────── */
const PARTS: { part: MockPart; title: string; body: string }[] = [
  { part: "views", title: "Views", body: "Arsenal for loops, Timeline for the song, Audition for checking the mix. One window." },
  { part: "transport", title: "Transport", body: "Play, stop, record. Play lights up while it plays, record goes red when armed." },
  { part: "position", title: "Position", body: "Bars and beats first, clock time next to it. Press stop once and you're back at the start." },
  { part: "record", title: "Record", body: "Count-in, metronome, loop record and wait-for-input. Each has a lamp so you can see it's on." },
  { part: "output", title: "Output", body: "A live scope and level meter, right in the transport bar." },
  { part: "library", title: "Library", body: "Your sounds, one drag from the timeline. Long pack names are trimmed so you can read the file." },
  { part: "tracks", title: "Tracks", body: "Mute, solo and arm are lettered keys on every track, each lit in its own colour." },
  { part: "clip", title: "Clip", body: "A flat block of colour, a name, and the waveform of what you recorded." },
];

const Hero = ({ setPage, onEarlyAccess }: PageProps) => {
  const [part, setPart] = useState<MockPart | null>(null);
  const [tip, setTip] = useState<{ part: MockPart; x: number; y: number; w: number } | null>(null);
  const figure = useRef<HTMLDivElement>(null);
  // Badges on the mock report hover/focus/tap; the tooltip is drawn here, in page
  // coordinates, so the mock's own overflow clipping can't cut it off.
  const onPartHover = (p: MockPart | null, el: HTMLElement | null) => {
    setPart(p);
    const box = figure.current;
    if (!p || !el || !box) { setTip(null); return; }
    const a = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    setTip({ part: p, x: a.left - b.left + a.width / 2, y: a.bottom - b.top + 8, w: b.width });
  };
  const tipPart = tip ? PARTS.find((p) => p.part === tip.part) : null;
  return (
    <section className="px-5 sm:px-6 pt-24 sm:pt-28 lg:pt-32">
      <Wrap>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-end pb-10 sm:pb-12">
          <FadeIn className="lg:col-span-8">
            <h1 className="display hero-title">Less distance between an idea and its sound.</h1>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 xl:col-span-3 xl:col-start-10 grid gap-5">
            <p className="text-[16px] leading-relaxed text-muted max-w-[34rem]">
              Aestra is a free app for making music. Record, sequence and mix beats and
              songs on a laptop that isn't new. It's in alpha, and it runs on Linux today.
            </p>
            <Button size="lg" onClick={() => onEarlyAccess?.()} className="justify-between">
              Request early access <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
            <PageLink to="changelog" setPage={setPage} className="text-[14px] justify-self-start">
              What changed in {LATEST.version}
            </PageLink>
            <PageLink to="download" setPage={setPage} className="text-[14px] justify-self-start">
              Build it from source
            </PageLink>
          </FadeIn>
        </div>

        <figure className="m-0">
          <div ref={figure} className="relative border border-fg" onMouseLeave={() => onPartHover(null, null)} onClick={() => onPartHover(null, null)}>
            <Suspense fallback={<div className="aspect-[1280/543] bg-[#000]" aria-hidden="true" />}>
              <EmberMock activePart={part} onPartHover={onPartHover} />
            </Suspense>
            {tip && tipPart && (
              <div
                role="tooltip"
                className="absolute z-20 pointer-events-none w-[250px] max-w-[calc(100%-16px)] px-3.5 py-3 bg-[#eee9e1] text-[#121110] text-[13.5px] leading-snug shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                style={{ left: Math.min(Math.max(tip.x - 125, 8), tip.w - 258), top: tip.y }}
              >
                <span className="block font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1 text-[#6a4de4]">
                  {String(PARTS.indexOf(tipPart) + 1).padStart(2, "0")} · {tipPart.title}
                </span>
                {tipPart.body}
              </div>
            )}
          </div>
          <figcaption className="readout flex flex-wrap justify-between gap-x-6 gap-y-1 py-3 border-b border-border">
            <span>Fig. 1 — Timeline view · 15 tracks · 112 BPM</span>
            <span>Recreated from the development build · hover the numbers · press play, mute, solo</span>
          </figcaption>
        </figure>
      </Wrap>
    </section>
  );
};

/* ── 2 · Operating notes — behaviour, stated as plainly as a release note ── */
const DETAILS: { line: string; where: string }[] = [
  { line: "Press stop once and the playhead goes back to the start.", where: "v0.7.1" },
  { line: "Recordings line up with the grid. They're not late by your audio interface's delay.", where: "v0.7.1" },
  { line: "Split, mute or delete while a loop is playing and you hear it straight away, not on the next pass.", where: "v0.7.1" },
  { line: "Sending a track through a mixer channel doesn't make it quieter than sending it straight to the master.", where: "v0.7.0" },
  { line: "Bounce a track on its own and its reverb and delay sends come with it, just like in the full mix.", where: "v0.7.0" },
  { line: "Routing changes can be undone. If you patch a feedback loop, Aestra refuses it instead of breaking your audio.", where: "v0.7.0" },
  { line: "Move your audio files and the project tells you which ones are missing, then lets you point it at the new place.", where: "v0.7.1" },
  { line: "The code that runs the audio is checked automatically. If it tries to do something slow or blocking, the build fails.", where: "engine" },
];

const Details = memo(({ setPage }: PageProps) => (
  <Section
    n="2"
    id="details"
    title="Small things"
    aside={
      <p className="mt-6 text-muted text-[15px] leading-relaxed max-w-sm">
        The little behaviours that decide whether a DAW gets in your way. Each one has shipped, and each is in the changelog.
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

/* ── 3 · Recent sessions — the changelog, arranged ── */
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
      title="Recent work"
      aside={
        <p className="mt-6 text-muted text-[15px] leading-relaxed max-w-sm">
          The last three releases, laid out like a song. Each lane is a type of change and each
          block is one change. Click one to see it play. The one on the right is still being made.
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

/* ── 4 · Specifications — the honest table. Mirrors the FAQ and the
   5 Aug truth pass (835a2af); update both together. ── */
type State = "ready" | "partial" | "absent";
const STATUS: { area: string; state: State; note: React.ReactNode }[] = [
  { area: "Linux", state: "ready", note: "Built and tested here. Use this one." },
  { area: "Windows", state: "partial", note: "The audio engine builds and passes its tests. The app itself doesn't build yet." },
  { area: "macOS", state: "absent", note: "Not supported. Deferred to 2027." },
  { area: "VST3 · CLAP", state: "partial", note: "Loads on Linux, but unfinished. Some CLAP features aren't built yet." },
  { area: "Built-in effects", state: "ready", note: "Eleven effects, including reverb, EQ, compressor and delay. Free." },
  { area: "Installers", state: "absent", note: "None yet. You build it yourself from the source." },
  { area: "Collaboration", state: "absent", note: "Doesn't exist yet. No server, no accounts." },
];
const STATE_TAG: Record<State, { label: string; cls: string }> = {
  ready: { label: "Works", cls: "text-success" },
  partial: { label: "Partial", cls: "text-warn" },
  absent: { label: "Not yet", cls: "text-faint" },
};

const Status = memo(({ setPage }: PageProps) => (
  <Section
    n="4"
    title="What works today"
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

/* ── 5 · Principles — quoted from philosophy.md, not invented ── */
const PRINCIPLES = [
  { title: "Sound first.", body: "Steady timing, and an export that sounds like what you heard in the session. Every time." },
  { title: "Flow over features.", body: "A quick, rough idea beats a perfect one you got interrupted on. So: good defaults, few pop-ups, easy undo." },
  { title: "Work doesn't disappear.", body: "Your projects stay safe. Old projects open in new versions, and recovery is built in." },
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

/* ── 6 · Cost ─────────────────────────────────────────────────── */
const Cost = memo(({ setPage }: PageProps) => (
  <Section
    n="6"
    title="Cost"
    aside={
      <p className="mt-6 text-muted text-[15px] leading-relaxed max-w-sm">
        The whole DAW is free: no export limits, no watermark, no time limit. What you make
        is yours, with no royalties. You don't need to pay to make music. Paying gets you extra
        plugins you may want later, and helps fund the work.
      </p>
    }
  >
    <div className="grid sm:grid-cols-3">
      {[
        ["Core", "$0", "The whole DAW."],
        ["Supporter", "$5/mo", "Extra plugins (the Native Suite), Muse when it's ready, and collaboration once it exists."],
        ["Founder", "$129", "A numbered Founder card, your own plugin bundle, and 24 months of Supporter."],
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

/* ── 7 · Questions ────────────────────────────────────────────── */
const FAQ = memo(({ setPage }: PageProps) => {
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "Is Aestra really free?",
      a: (
        <>
          Yes. The whole DAW is free, with no limit on exports or session length. You can
          also pay for extra plugins and to support the work. That's the{" "}
          <PageLink to="pricing" setPage={setPage} className="text-fg">Supporter and Founder offers</PageLink>.
        </>
      ),
    },
    {
      q: "What's free, and what costs money?",
      a: (
        <div className="space-y-3">
          <p>
            The DAW comes with eleven effects: reverb, EQ, compressor, delay, limiter,
            filter, saturation and more. They're free.
          </p>
          <p>
            The Native Suite is a separate set of extra plugins, released one at a time. You don't
            need them to make music. They're there if you want more, and they come with Supporter
            ($5/month) or you can buy them one by one.
          </p>
        </div>
      ),
    },
    {
      q: "Can I work on a project with other people?",
      a: "Not yet. There's no server, no accounts and no sync. The plan: free users can join projects they're invited to, and a Supporter hosts the shared workspace. If a Supporter stops paying, only the online copy becomes read-only. Projects on your own computer are always yours.",
    },
    {
      q: "What platforms does Aestra support?",
      a: "Linux, and only Linux for now. That's what Aestra is built and tested on. On Windows the audio engine builds and passes its tests, but the app doesn't build yet. macOS isn't supported and is planned for 2027. There's no installer on any platform yet: you build Aestra from the source.",
    },
    {
      q: "Can I use my own VST3 and CLAP plugins?",
      a: "Partly, and only on Linux. Plugins load, but it's unfinished: some CLAP features aren't built yet, and on Windows no outside plugin loads at all. Don't rely on it today. The built-in effects are the safe choice. Full plugin support on both systems is required before public beta.",
    },
    {
      q: "Can I use Aestra commercially?",
      a: "Yes. Beats, mixes, stems and full projects are yours to release, sell or make for clients, with no royalties, fees or credit required. The license only limits using the Aestra software itself commercially, for example repackaging it or building a competing DAW.",
    },
    {
      q: "Why not open source Aestra?",
      a: (
        <div className="space-y-3">
          <p>
            You can read all of Aestra's code, so you can see exactly what it does on your
            computer, and you can suggest changes. What the license doesn't allow is
            repackaging it and selling it as your own.
          </p>
          <p>
            Fully open source would make it hard to pay for the work. This way the code stays
            visible and the project can keep going.
          </p>
        </div>
      ),
    },
    {
      q: "When will Aestra be ready?",
      a: "It's in alpha. If you can build it from source on Linux, you can make a track in it today, but expect rough edges. Public beta ships when the main workflow, making a track from start to finish, is solid. There's no date yet. Join early access and I'll email you when there are builds.",
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

/* ── 8 · Founder waitlist ─────────────────────────────────────── */
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
        toast.success("You're on the Founder list.", "We'll email you when Founder cards go on sale.");
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
          500 Founder cards, and that's all there will ever be. Each one is numbered and
          digital, and comes with a plugin bundle you keep and 24 months of Supporter from public
          beta. Sales open at public beta. This list only emails you when they do. It doesn't hold a card for you.
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
          Early access gets you an email when there are builds, and a direct line to tell me
          what's wrong with them. I read all of it.
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
