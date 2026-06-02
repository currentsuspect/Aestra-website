import React, { memo } from "react";
import { Github, Twitter, ArrowUpRight, Code2, Music, Mic } from "lucide-react";
import { FadeIn, Button } from "../components/ui";
import type { PageProps } from "../types";

const SocialLink = ({ href, icon: Icon, label, handle }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; handle: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-3 p-4 rounded-xl border border-border/80 bg-bg hover:border-border-2 transition-colors"
  >
    <span className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-fg-muted group-hover:text-fg transition-colors shrink-0">
      <Icon className="w-4 h-4" />
    </span>
    <div className="min-w-0 flex-1">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="text-sm text-fg truncate">{handle}</div>
    </div>
    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-fg-muted transition-colors shrink-0" />
  </a>
);

const Fact = ({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-bg">
    <span className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-fg-muted shrink-0">
      <Icon className="w-4 h-4" />
    </span>
    <div className="min-w-0">
      <div className="text-sm text-fg font-medium">{title}</div>
      <div className="text-[13px] text-muted mt-0.5 leading-relaxed">{body}</div>
    </div>
  </div>
);

export const About = ({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-5xl mx-auto">
      {/* Hero — wider so the headline doesn't feel lost on desktop */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start mb-16 sm:mb-20">
        <div>
          <FadeIn>
            <p className="kicker mb-5">About</p>
            <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-8">
              Building the DAW<br />
              <span className="text-muted">producers deserve.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.05}>
            <p className="text-2xl sm:text-3xl text-fg leading-snug tracking-tight mb-8 max-w-xl">
              Music production should feel effortless.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-muted text-[16px] sm:text-[17px] leading-relaxed max-w-xl">
              Too often, producers spend more time fighting crashes, digging through
              menus, fixing routing mistakes, and recovering lost work than actually
              making music. Aestra exists to change that.
            </p>
          </FadeIn>
        </div>

        {/* Sidebar — gives the page visual weight on wide screens */}
        <FadeIn delay={0.15} className="lg:pt-16">
          <div className="space-y-3">
            <Fact icon={Code2} title="Native C++ engine" body="No JVM, no Electron, no plugin scan. Built for speed from the first commit." />
            <Fact icon={Music} title="Pattern-first" body="Ideas start as loops. Sketches become tracks. The workflow matches the work." />
            <Fact icon={Mic} title="Built by one" body="Designed, engineered, and shipped solo — by a producer who needed it." />
          </div>
        </FadeIn>
      </div>

      {/* Story */}
      <FadeIn delay={0.15}>
        <div className="grid md:grid-cols-[180px_1fr] gap-6 md:gap-12 mb-16 sm:mb-20">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted sticky top-28">The story</div>
          </div>
          <div className="space-y-6 text-fg-muted text-[16px] sm:text-[17px] leading-relaxed max-w-2xl">
            <p>
              Built natively from the ground up, Aestra focuses on speed, stability,
              and creative flow. Every decision is guided by a simple idea: technology
              should support creativity, not interrupt it.
            </p>
            <p>
              Whether you're sketching an idea, building a beat, recording a vocal, or
              finishing a release, Aestra aims to stay out of the way and let the work
              happen.
            </p>
            <p className="text-fg-muted">
              Because making music is hard enough already.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Closing line */}
      <FadeIn delay={0.2}>
        <p className="display text-3xl sm:text-4xl md:text-5xl text-fg mb-16 sm:mb-20 max-w-2xl">
          Make music,<br />
          <span className="text-muted">not excuses.</span>
        </p>
      </FadeIn>

      {/* Socials + signoff */}
      <FadeIn delay={0.25}>
        <div className="pt-10 border-t border-border/80">
          <div className="flex flex-wrap items-center justify-between gap-y-3 mb-6">
            <div className="text-muted text-[13px]">
              Built by Dylan Makori · Aestra Studios
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPage("home")}>
              Back to home
            </Button>
          </div>

          <p className="text-[11px] uppercase tracking-[0.18em] text-muted mb-3">Find us</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <SocialLink
              href="https://x.com/aestrastudios"
              icon={Twitter}
              label="X (Twitter)"
              handle="@aestrastudios"
            />
            <SocialLink
              href="https://github.com/currentsuspect/Aestra"
              icon={Github}
              label="Source · GitHub"
              handle="currentsuspect/Aestra"
            />
          </div>
        </div>
      </FadeIn>
    </div>
  </div>
);
