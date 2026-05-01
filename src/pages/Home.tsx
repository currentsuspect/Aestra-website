import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { Download, ChevronRight, Check } from "lucide-react";
import { cn } from "../lib";
import { Button, Badge, FeatureCard, FadeIn } from "../components/ui";
import { MockTimeline } from "../components/MockTimeline";
import type { PageProps } from "../types";

const Hero = ({ setPage }: PageProps) => {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-8 h-64 sm:h-80 lg:h-[560px] bg-[radial-gradient(circle_at_top,rgba(97,213,255,0.09),transparent_44%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn
          className="flex justify-start mb-4 sm:mb-8"
        >
          <Badge variant="outline">v1 Beta — December 2026</Badge>
        </FadeIn>

        <div className="grid gap-8 sm:gap-10">
          <div>
            <FadeIn
              delay={0.1}
            >
              <h1
                className="editorial-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6"
              >
                Make music.<br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#61d5ff,#b6a8ff_48%,#d9b549)]">
                  Not excuses.
                </span>
              </h1>
            </FadeIn>

            <FadeIn
              delay={0.2}
            >
              <p
                className="text-base sm:text-lg text-[#a4abc0] max-w-2xl mb-6 sm:mb-10 leading-relaxed"
              >
                You shouldn't need a high-end PC to make good music. Aestra opens instantly, runs on whatever you've got, and gets out of your way. No plugin scanning. No load times. Just make the beat.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.3}
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4"
            >
              <Button size="lg" onClick={() => setPage("download")} icon={Download} className="w-full sm:w-auto">
                Download Beta
              </Button>
              <Button variant="secondary" size="lg" onClick={() => { const daw = document.querySelector("[data-daw-mockup]"); if (daw) daw.scrollIntoView({ behavior: "smooth" }); else setPage("features"); }} className="w-full sm:w-auto">
                Open Signal Flow <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>

      <MockTimeline />
      
    </section>
  );
};


const Features = memo(() => (
  <section className="content-defer py-16 sm:py-20 lg:py-28 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 sm:mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Built different. Literally.</h2>
            <p className="text-base sm:text-lg text-[#a4abc0] max-w-3xl">
            We built the engine, the interface, every pixel — so the only thing you feel is the music.
          </p>
        </div>


      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <FeatureCard 
          label="Performance"
          color="teal"
          title="Brutally Optimized"
          description="Runs on a 5-year-old laptop without breaking a sweat. Built for the hardware you have."
          visual={
            <div className="flex items-end gap-1 h-full">
              {[72, 55, 83, 60, 45, 70, 50, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-[#1e2230] rounded-[3px] relative overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 right-0 rounded-[3px] bg-[#1db4a6aa] transition-all duration-300 group-hover:h-[20%]" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          }
          delay={0}
        />
        <FeatureCard 
          label="Startup"
          color="amber"
          title="Instant Startup"
          description="Open Aestra and you're making music. No scanning. No waiting. Nothing in your way."
          visual={
            <div className="flex flex-col justify-center h-full gap-2">
              <div className="flex items-center justify-between text-[11px] text-[#4a5068]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4a5068] group-hover:bg-[#4caf6e] transition-colors" />
                  Aestra
                </span>
              </div>
              <div className="h-1 bg-[#1e2230] rounded-full overflow-hidden">
                <div className="h-full bg-[#e8a230] rounded-full w-0 group-hover:w-full transition-[width] duration-[80ms]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#4a5068]">
                <span>No plugins scanned</span>
                <span>No splash screen</span>
              </div>
            </div>
          }
          delay={0.1}
        />
        <FeatureCard 
          label="Workflow"
          color="purple"
          title="Pattern-First Workflow"
          description="Built around how beats are actually made — not how software thinks you should make them."
          visual={
            <div className="grid grid-cols-8 grid-rows-3 gap-1 h-full">
              {[
                1,0,0,1,0,1,0,0,
                0,1,0,0,1,0,1,1,
                1,0,1,0,0,1,0,0
              ].map((on, i) => (
                <div key={i} className={`rounded-[3px] transition-all duration-150 ${on ? 'bg-[#8b7de8]' : 'bg-[#1e2230]'} group-hover:${on ? 'bg-[#a99ef5]' : 'opacity-60'}`} />
              ))}
            </div>
          }
          delay={0.2}
        />
        <FeatureCard 
          label="Signal Flow"
          color="blue"
          title="Routing Visualizer"
          description="See exactly where your sound goes — color-coded, live, as you mix."
          visual={
            <svg className="w-full h-full" viewBox="0 0 220 64">
              <circle cx="20" cy="32" r="8" fill="#4a9eff22" stroke="#4a9eff" strokeWidth="1.5"/>
              <text x="20" y="36" textAnchor="middle" fontSize="8" fill="#4a9eff">IN</text>
              <line x1="28" y1="32" x2="70" y2="20" stroke="#4a9eff44" strokeWidth="1"/>
              <line x1="28" y1="32" x2="70" y2="44" stroke="#4a9eff44" strokeWidth="1"/>
              <rect x="70" y="12" width="36" height="16" rx="4" fill="#4a9eff15" stroke="#4a9eff66" strokeWidth="1"/>
              <text x="88" y="23" textAnchor="middle" fontSize="7" fill="#4a9effaa">EQ</text>
              <rect x="70" y="36" width="36" height="16" rx="4" fill="#4a9eff15" stroke="#4a9eff66" strokeWidth="1"/>
              <text x="88" y="47" textAnchor="middle" fontSize="7" fill="#4a9effaa">VERB</text>
              <line x1="106" y1="20" x2="148" y2="32" stroke="#4a9eff44" strokeWidth="1"/>
              <line x1="106" y1="44" x2="148" y2="32" stroke="#4a9eff44" strokeWidth="1"/>
              <rect x="148" y="24" width="44" height="16" rx="4" fill="#4a9eff22" stroke="#4a9eff" strokeWidth="1.5"/>
              <text x="170" y="35" textAnchor="middle" fontSize="7" fill="#4a9eff">MASTER</text>
              <circle cx="200" cy="32" r="6" fill="#4a9eff33" stroke="#4a9eff" strokeWidth="1"/>
              <line x1="192" y1="32" x2="194" y2="32" stroke="#4a9eff" strokeWidth="1.5"/>
              <circle cx="14" cy="32" r="2" fill="#4a9eff">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
          }
          delay={0.3}
        />
        <FeatureCard 
          label="Monitoring"
          color="green"
          title="Audition Mode"
          description="Hear your mix the way your listeners will — before you ever export."
          visual={
            <div className="flex flex-wrap gap-1.5 content-center h-full">
              {["Spotify", "Apple Music", "AirPods", "Car speakers", "Phone speaker", "Earbuds"].map((p) => (
                <span key={p} className="bg-[#1e2230] border border-[#2a2f42] rounded-full px-2.5 py-1 text-[11px] text-[#5a6080] group-hover:text-[#4caf6e] group-hover:border-[#4caf6e40] group-hover:bg-[#4caf6e10] transition-all">
                  {p}
                </span>
              ))}
            </div>
          }
          delay={0.4}
        />
        <FeatureCard 
          label="History"
          color="coral"
          title="Version Control"
          description="Save mix versions with musical names. Come back, compare, blend the best takes."
          visual={
            <svg className="w-full h-full" viewBox="0 0 220 64">
              <line x1="20" y1="32" x2="200" y2="32" stroke="#e06a4e33" strokeWidth="1.5"/>
              <circle cx="20" cy="32" r="5" fill="#1e2230" stroke="#e06a4e" strokeWidth="1.5"/>
              <circle cx="60" cy="32" r="5" fill="#1e2230" stroke="#e06a4e66" strokeWidth="1.5"/>
              <line x1="60" y1="32" x2="90" y2="16" stroke="#e06a4e44" strokeWidth="1"/>
              <circle cx="90" cy="16" r="4" fill="#1e2230" stroke="#e06a4e55" strokeWidth="1"/>
              <circle cx="120" cy="16" r="4" fill="#1e2230" stroke="#e06a4e55" strokeWidth="1"/>
              <line x1="90" y1="16" x2="120" y2="16" stroke="#e06a4e33" strokeWidth="1"/>
              <line x1="120" y1="16" x2="150" y2="32" stroke="#e06a4e44" strokeWidth="1"/>
              <circle cx="150" cy="32" r="5" fill="#1e2230" stroke="#e06a4e66" strokeWidth="1.5"/>
              <circle cx="190" cy="32" r="6" fill="#e06a4e22" stroke="#e06a4e" strokeWidth="1.5"/>
              <text x="34" y="26" fontSize="7" fill="#e06a4e66">rough mix</text>
              <text x="155" y="26" fontSize="7" fill="#e06a4e66">final</text>
              <text x="80" y="11" fontSize="7" fill="#e06a4e66">vox take</text>
              <text x="182" y="36" fontSize="7" fill="#e06a4eaa">v3</text>
            </svg>
          }
          delay={0.5}
        />
      </div>


    </div>
  </section>
));


const FounderCountdown = () => {
  const targetDate = new Date("2026-12-25T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [spotsLeft] = useState(500);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const totalSeconds = Math.floor(diff / 1000);
      const months = Math.floor(totalSeconds / (30.44 * 24 * 3600));
      const remaining = totalSeconds - months * Math.floor(30.44 * 24 * 3600);
      const days = Math.floor(remaining / (24 * 3600));
      const hours = Math.floor((remaining % (24 * 3600)) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      setTimeLeft({ months, days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("https://formspree.io/f/xnjlaqqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "founder-waitlist" }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="section-frame rounded-[18px] px-3 sm:px-5 py-3 sm:py-4 min-w-[72px] sm:min-w-[92px] flex-1">
      <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white font-mono tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] sm:text-[11px] text-[#8b94aa] uppercase tracking-[0.18em] mt-1 sm:mt-2">{label}</div>
    </div>
  );

  return (
    <section id="founder-section" className="content-defer py-16 sm:py-20 lg:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,181,73,0.07),transparent_40%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 section-frame panel-glow rounded-[16px] sm:rounded-[20px] p-5 sm:p-8 md:p-12">
        <div className="max-w-3xl">
          <FadeIn
            className="flex justify-start mb-4 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#d9b549]/30 bg-[#d9b549]/10 text-[#f6de8d] text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#d9b549] animate-pulse" />
              <span className="hidden sm:inline">Founder Gold Card Window</span>
              <span className="sm:hidden">Founder Gold</span>
            </span>
          </FadeIn>

          <FadeIn
            delay={0.1}
          >
            <h2
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 editorial-title"
            >
              <span className="sm:hidden">No second runs</span>
              <span className="hidden sm:inline">
                Some things
                <br />
              </span>
              <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#d9b549,#f1d88b_55%,#b6a8ff)]">
                don't get a second run.
              </span>
            </h2>
          </FadeIn>

          <FadeIn
            delay={0.2}
          >
            <p
              className="text-base sm:text-lg text-[#a4abc0] mb-6 sm:mb-12 max-w-2xl"
            >
              Not a subscription. Not a tier. A piece of history — your name in the product, your Founder number forever, and lifetime access from day one.
            </p>
          </FadeIn>
        </div>

        <FadeIn
          delay={0.3}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-base text-[#d9b549] font-mono font-bold">{500 - spotsLeft} / 500 claimed</span>
            <span className="text-xs text-[#8b94aa]">{spotsLeft} spots left</span>
          </div>
          <div className="w-full h-3 sm:h-4 rounded-full bg-[#1a1f2e] border border-[#343c4d] overflow-hidden">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#d9b549,#f1d88b)] transition-all duration-500"
              style={{ width: `${((500 - spotsLeft) / 500) * 100}%` }}
            />
          </div>
        </FadeIn>

        <FadeIn
          delay={0.4}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.mail"
                required
                aria-label="Email address for waitlist"
                className="flex-1 h-12 px-4 rounded-[14px] bg-[#141924] border border-[#343c4d] text-white text-sm placeholder-[#6f778d] focus:outline-none focus:ring-2 focus:ring-[#d9b549]/35 focus:border-[#d9b549]/45"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-12 px-6 rounded-[14px] border border-[#d9b549]/40 bg-[linear-gradient(180deg,#d9b549,#a7802c)] text-white font-medium text-sm hover:brightness-105 transition-all shadow-[0_0_22px_rgba(217,181,73,0.22)] disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-[#d9b549]">
                <Check className="w-5 h-5" />
                <span className="font-medium">You're on the list.</span>
              </div>
              <p className="text-[#8b94aa] text-sm">
                We'll email you when Founder cards open. Watch the countdown.
              </p>
            </div>
          )}
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </FadeIn>



      </div>
    </section>
  );
};


export { Hero, Features, FounderCountdown };
