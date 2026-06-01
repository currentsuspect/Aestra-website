import React, { memo } from "react";
import { ArrowRight } from "lucide-react";
import type { PageProps } from "../types";

export const Privacy = memo(({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setPage("home")}
        className="text-zinc-400 hover:text-zinc-100 mb-10 flex items-center text-sm transition-colors"
      >
        <ArrowRight className="rotate-180 w-4 h-4 mr-1.5" /> Back to home
      </button>
      <p className="kicker mb-4">Privacy</p>
      <h1 className="display text-4xl sm:text-5xl md:text-6xl text-zinc-50 mb-3">Privacy policy</h1>
      <p className="text-zinc-400 text-sm mb-12">Last updated: April 12, 2026</p>

      <div className="space-y-10 text-zinc-300 text-[15px] leading-relaxed">
        <section>
          <h2 className="text-[15px] font-medium text-zinc-50 mb-3">What we collect</h2>
          <ul className="space-y-2 list-disc list-inside text-zinc-400">
            <li><span className="text-zinc-200">Email address</span> — when you join the Founder waitlist via our form.</li>
            <li><span className="text-zinc-200">Usage analytics</span> — anonymous, aggregated data about how the website is used (page views, referrers). No personal identification.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-zinc-50 mb-3">What we don't collect</h2>
          <ul className="space-y-2 list-disc list-inside text-zinc-400">
            <li>No cookies for tracking or advertising.</li>
            <li>No sale of personal data to third parties. Ever.</li>
            <li>No access to your music, projects, or files.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-zinc-50 mb-3">Waitlist emails</h2>
          <p className="text-zinc-400">
            Emails collected via the Founder waitlist are stored by Formspree, our form processor.
            We use these emails solely to notify you when Founder cards become available.
            We will not send marketing emails, share your email, or add you to any list you didn't sign up for.
            You can request removal at any time.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-zinc-50 mb-3">Aestra desktop app</h2>
          <p className="text-zinc-400">
            The Aestra desktop application does not collect or transmit any personal data.
            All audio processing, project files, and settings are stored locally on your machine.
            If you opt into telemetry for improving the product, it is anonymous and can be disabled at any time in settings.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-zinc-50 mb-3">Muse AI (future)</h2>
          <p className="text-zinc-400">
            When Muse AI launches, all predictions run locally on your machine.
            No audio, MIDI, or project data is sent to the cloud.
            Optional anonymous telemetry for model improvement can be disabled without affecting Muse's functionality.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-zinc-50 mb-3">Your rights</h2>
          <p className="text-zinc-400">
            You can request access to, correction of, or deletion of any personal data we hold about you.
            Open an issue on{" "}
            <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-zinc-100 underline underline-offset-4 hover:text-zinc-50">
              GitHub
            </a>{" "}
            or reach out through the community channels.
          </p>
        </section>
      </div>
    </div>
  </div>
));
