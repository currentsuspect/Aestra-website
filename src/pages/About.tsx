import React, { memo } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FadeIn } from "../components/ui";
import type { PageProps } from "../types";

export const About = ({ setPage }: PageProps) => (
  <>
    <Navbar activePage="" setPage={setPage} />
    <main className="pt-24 sm:pt-32 pb-16 sm:pb-20 min-h-screen">
      <div className="page-hero px-4 sm:px-8 max-w-[700px]">
        <div className="page-hero-tag">About</div>
        <h1>
          Building the DAW<br />
          <span className="text-[#7c3aed]">producers deserve.</span>
        </h1>
        <p>
          Aestra is an accessible, premium native digital audio workstation for producers.
        </p>
      </div>

      <div className="max-w-3xl px-4 sm:px-8 mt-12 space-y-8">
        <FadeIn>
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-3">Short Description</h2>
            <p className="text-[#a4abc0] text-sm leading-relaxed">
              Aestra is an accessible, premium native DAW for producers. Built around speed, stability, and creative focus.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-3">Long Description</h2>
            <p className="text-[#a4abc0] text-sm leading-relaxed">
              Aestra is being built by Aestra Studios to reduce friction in music production through native performance, stable sessions, clear workflows, and built-in creative tools. The goal is to make music creation feel direct, reliable, and personal — without the crashes, routing confusion, and creative interruptions that plague existing DAWs.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.15}>
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-3">Founder</h2>
            <p className="text-[#a4abc0] text-sm leading-relaxed mb-4">
              Aestra is built by Dylan Makori under Aestra Studios.
            </p>
            <div className="flex items-center gap-3 text-[#7a82a0] text-xs">
              <span>GitHub: </span>
              <a
                href="https://github.com/currentsuspect/Aestra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00e5cc] hover:underline"
              >
                currentsuspect/Aestra
              </a>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.2}>
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-3">Brand Line</h2>
            <p className="text-2xl font-bold text-white editorial-title">
              Make music, not excuses.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.25}>
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-3">Key Terminology</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Aestra DAW", "The core digital audio workstation application."],
                ["Aestra Studios", "The studio and team building Aestra."],
                ["Aestra Verb", "Built-in algorithmic reverb plugin."],
                ["Aestra EQ", "Built-in parametric equalizer plugin."],
                ["Arsenal", "Pattern engine and source module rack within Aestra."],
                ["Timeline", "Arrangement and editing view in Aestra."],
                ["Audition", "Translation listening and monitoring mode."],
              ].map(([term, desc]) => (
                <div key={term} className="flex gap-3">
                  <span className="text-[#7c3aed] font-mono text-xs whitespace-nowrap">{term}</span>
                  <span className="text-[#7a82a0]">{desc}</span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      </div>
    </main>
    <Footer setPage={setPage} />
  </>
);
