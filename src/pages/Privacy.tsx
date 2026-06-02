import React, { memo } from "react";
import { ArrowRight } from "lucide-react";
import type { PageProps } from "../types";

const LAST_UPDATED = "2026-04-12";
const formattedDate = new Date(LAST_UPDATED).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const Privacy = memo(({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setPage("home")}
        className="text-muted hover:text-fg mb-10 flex items-center text-sm transition-colors"
      >
        <ArrowRight className="rotate-180 w-4 h-4 mr-1.5" aria-hidden="true" /> Back to home
      </button>
      <p className="kicker mb-4">Privacy</p>
      <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-3">Privacy policy</h1>
      <p className="text-muted text-sm mb-12">
        Last updated: <time dateTime={LAST_UPDATED}>{formattedDate}</time>
      </p>

      <div className="space-y-10 text-fg-muted text-[15px] leading-relaxed">
        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">What we collect</h2>
          <ul className="space-y-2 list-disc list-inside text-muted">
            <li><span className="text-fg-muted">Email address</span> — when you join the Founder waitlist via our form.</li>
            <li><span className="text-fg-muted">Usage analytics</span> — anonymous, aggregated data about how the website is used (page views, referrers). No personal identification.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">What we don't collect</h2>
          <ul className="space-y-2 list-disc list-inside text-muted">
            <li>No cookies for tracking or advertising.</li>
            <li>No sale of personal data to third parties. Ever.</li>
            <li>No access to your music, projects, or files.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Waitlist emails</h2>
          <p className="text-muted">
            Emails collected via the Founder waitlist are stored by{" "}
            <a
              href="https://formspree.io/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline underline-offset-4 hover:text-fg"
            >
              Formspree
            </a>
            , our form processor. We use these emails solely to notify you when Founder cards become available.
            We will not send marketing emails, share your email, or add you to any list you didn't sign up for.
            You can request removal at any time.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Aestra desktop app</h2>
          <p className="text-muted">
            The Aestra desktop application does not collect or transmit any personal data.
            All audio processing, project files, and settings are stored locally on your machine.
            If you opt into telemetry for improving the product, it is anonymous and can be disabled at any time in settings.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Muse AI (planned)</h2>
          <p className="text-muted">
            Our current plan for Muse AI is to run all predictions locally on your machine.
            Subject to change before launch, but our intent is: no audio, MIDI, or project data sent to the cloud.
            Optional anonymous telemetry for model improvement, if introduced, would be opt-in and can be disabled without affecting Muse's functionality.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Your rights</h2>
          <p className="text-muted">
            You can request access to, correction of, or deletion of any personal data we hold about you.
            Open an issue on{" "}
            <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4 hover:text-fg">
              GitHub
            </a>
            {" "}or reach out through the community channels. We aim to respond to verified requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Governing law</h2>
          <p className="text-muted">
            This policy is provided in good faith. Where local consumer or data-protection law (such as the EU GDPR, UK GDPR, or California CCPA) grants you additional rights, those rights apply in addition to anything stated here.
            Disputes will be handled in the jurisdiction of Aestra Studios' registered place of business, without prejudice to your mandatory local protections.
          </p>
        </section>
      </div>
    </div>
  </div>
));
