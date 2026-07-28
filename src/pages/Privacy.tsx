import React, { memo } from "react";
import { ArrowRight } from "lucide-react";
import type { PageProps } from "../types";

const LAST_UPDATED = "2026-07-28";
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
            <li><span className="text-fg-muted">Waitlist details</span> — your email address and, where the form asks for them, your name and current DAW.</li>
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
            Waitlist submissions go through our server-side endpoint and are stored as contacts by{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline underline-offset-4 hover:text-fg"
            >
              Resend
            </a>
            , our email delivery and contact-management provider. We use those details solely for the list you joined and the related launch or access notifications.
            We will not sell or share your email, or add you to an unrelated marketing list.
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
            Email{" "}
            <a href="mailto:legal@aestra.studio" className="text-fg underline underline-offset-4 hover:text-fg">
              legal@aestra.studio
            </a>
            {" "}— use email rather than a public issue tracker, since making the request usually means
            telling us which address is yours. We aim to respond to verified requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Governing law</h2>
          <p className="text-muted">
            This policy is provided in good faith. Where local consumer or data-protection law (such as the EU GDPR, UK GDPR, or California CCPA) grants you additional rights, those rights apply in addition to anything stated here.
            Disputes will be handled in the jurisdiction of Aestra Studios' registered place of business, without prejudice to your mandatory local protections.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Contact</h2>
          <p className="text-muted">
            Privacy questions, data requests, and anything else about this policy go to{" "}
            <a href="mailto:legal@aestra.studio" className="text-fg underline underline-offset-4 hover:text-fg">
              legal@aestra.studio
            </a>
            . Found a security problem? That has its own address —{" "}
            <a href="mailto:security@aestra.studio" className="text-fg underline underline-offset-4 hover:text-fg">
              security@aestra.studio
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  </div>
));
