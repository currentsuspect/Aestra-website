import React, { useState, useEffect, useRef, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib";

export const Terms = memo(({ setPage }: any) => (
  <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 max-w-3xl mx-auto min-h-screen">
    <button onClick={() => setPage("home")} className="text-[#98a1b7] hover:text-white mb-6 sm:mb-8 flex items-center text-sm">
      <ArrowRight className="rotate-180 mr-2 w-4 h-4" /> Back to Home
    </button>
    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Terms of Service</h1>
    <p className="text-[#7f879b] text-sm mb-12">Last updated: April 12, 2026</p>

    <div className="space-y-8 text-[#cfd5e4] text-sm leading-relaxed">
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">The Short Version</h2>
        <p className="text-[#98a1b7]">
          Aestra is free software. Use it to make music. Don't sue us if it crashes during a take.
          We're building this in public, and it's in active development. Things will break. We'll fix them.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">License</h2>
        <p className="text-[#98a1b7]">
          Aestra is licensed under the Aestra Studios Source-Available License (ASSAL) v1.1.
          You may use, modify, and distribute Aestra for personal and educational purposes.
          Commercial use requires a separate agreement.
          See the full license in the{" "}
          <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-[#61d5ff] hover:underline">GitHub repository</a>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Your Music Is Yours</h2>
        <p className="text-[#98a1b7]">
          Anything you create with Aestra — beats, mixes, stems, projects — belongs entirely to you.
          We have no claim on your creative output. We don't collect royalties, licensing fees, or attribution requirements.
          Your music is yours. Period.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Supporter & Founder Tiers</h2>
        <ul className="space-y-2 list-disc list-inside text-[#98a1b7]">
          <li><strong className="text-[#cfd5e4]">Supporter ($5/mo):</strong> Subscription can be cancelled anytime. Access to premium features continues until the end of the billing period.</li>
          <li><strong className="text-[#cfd5e4]">Founder ($129 one-time):</strong> Lifetime access to Supporter features. Physical card shipping subject to availability. Founder tier is limited and will not be reopened after the window closes.</li>
          <li><strong className="text-[#cfd5e4]">Refunds:</strong> Supporter subscriptions can be refunded within 7 days of first purchase. Founder purchases are non-refundable once the card is produced.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Beta Disclaimer</h2>
        <p className="text-[#98a1b7]">
          Aestra is in active development. Features may change, break, or be removed.
          We recommend saving your projects frequently and keeping backups.
          We are not responsible for lost work, corrupted projects, or audio dropouts during the beta period.
          This is software built by humans who care deeply about it — but it is still beta software.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Third-Party Plugins</h2>
        <p className="text-[#98a1b7]">
          Aestra supports VST3 and CLAP plugins. We are not responsible for third-party plugin behavior,
          stability, or licensing. Plugin crashes are sandboxed where possible, but we cannot guarantee
          isolation for all plugin formats.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Changes to These Terms</h2>
        <p className="text-[#98a1b7]">
          We may update these terms as Aestra evolves. Material changes will be announced on the website
          and through community channels. Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
        <p className="text-[#98a1b7]">
          Legal questions? Open an issue on{" "}
          <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-[#61d5ff] hover:underline">GitHub</a>.
        </p>
      </section>
    </div>
  </div>
));
