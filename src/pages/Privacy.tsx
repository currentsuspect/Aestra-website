import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib";

export const Privacy = memo(({ setPage }: any) => (
  <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-3xl mx-auto min-h-screen">
    <button onClick={() => setPage("home")} className="text-[#98a1b7] hover:text-white mb-6 sm:mb-8 flex items-center text-sm">
      <ArrowRight className="rotate-180 mr-2 w-4 h-4" /> Back to Home
    </button>
    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
    <p className="text-[#7f879b] text-sm mb-12">Last updated: April 12, 2026</p>

    <div className="space-y-8 text-[#cfd5e4] text-sm leading-relaxed">
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">What We Collect</h2>
        <ul className="space-y-2 list-disc list-inside text-[#98a1b7]">
          <li><strong className="text-[#cfd5e4]">Email address</strong> — when you join the Founder waitlist via our form.</li>
          <li><strong className="text-[#cfd5e4]">Usage analytics</strong> — anonymous, aggregated data about how the website is used (page views, referrers). No personal identification.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">What We Don't Collect</h2>
        <ul className="space-y-2 list-disc list-inside text-[#98a1b7]">
          <li>No cookies for tracking or advertising.</li>
          <li>No sale of personal data to third parties. Ever.</li>
          <li>No access to your music, projects, or files.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Waitlist Emails</h2>
        <p className="text-[#98a1b7]">
          Emails collected via the Founder waitlist are stored by Formspree, our form processor.
          We use these emails solely to notify you when Founder cards become available.
          We will not send marketing emails, share your email, or add you to any list you didn't sign up for.
          You can request removal at any time by emailing us.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Aestra Desktop App</h2>
        <p className="text-[#98a1b7]">
          The Aestra desktop application does not collect or transmit any personal data.
          All audio processing, project files, and settings are stored locally on your machine.
          If you opt into telemetry for improving the product, it is anonymous and can be disabled at any time in settings.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Muse AI (Future)</h2>
        <p className="text-[#98a1b7]">
          When Muse AI launches, all predictions run locally on your machine.
          No audio, MIDI, or project data is sent to the cloud.
          Optional anonymous telemetry for model improvement can be disabled without affecting Muse's functionality.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Your Rights</h2>
        <p className="text-[#98a1b7]">
          You can request access to, correction of, or deletion of any personal data we hold about you.
          Contact us at the email below.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
        <p className="text-[#98a1b7]">
          Questions about this policy? Open an issue on{" "}
          <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">GitHub</a>{" "}
          or reach out through the community channels.
        </p>
      </section>
    </div>
  </div>
));
