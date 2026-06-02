import React, { memo } from "react";
import { ArrowRight } from "lucide-react";
import type { PageProps } from "../types";

export const Terms = memo(({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-6 min-h-screen">
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setPage("home")}
        className="text-muted hover:text-fg mb-10 flex items-center text-sm transition-colors"
      >
        <ArrowRight className="rotate-180 w-4 h-4 mr-1.5" /> Back to home
      </button>
      <p className="kicker mb-4">Terms</p>
      <h1 className="display text-4xl sm:text-5xl md:text-6xl text-fg mb-3">Terms of service</h1>
      <p className="text-muted text-sm mb-12">Last updated: April 12, 2026</p>

      <div className="space-y-10 text-fg-muted text-[15px] leading-relaxed">
        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">The short version</h2>
          <p className="text-muted">
            Aestra is free to use for personal and educational purposes. Use it to make music.
            Don't sue us if it crashes during a take. We're building this in public, and it's in
            active development. Things will break. We'll fix them.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">License</h2>
          <p className="text-muted">
            Aestra is licensed under the Aestra Studios Source-Available License (ASSAL) v1.1.
            You may use, modify, and distribute Aestra for personal and educational purposes.
            Commercial use requires a separate agreement. See the full license in the{" "}
            <a href="https://github.com/currentsuspect/Aestra" target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4 hover:text-fg">
              GitHub repository
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Your music is yours</h2>
          <p className="text-muted">
            Anything you create with Aestra — beats, mixes, stems, projects — belongs entirely to you.
            We have no claim on your creative output. We don't collect royalties, licensing fees,
            or attribution requirements. Your music is yours. Period.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Supporter &amp; Founder tiers</h2>
          <ul className="space-y-2 list-disc list-inside text-muted">
            <li><span className="text-fg-muted">Supporter ($5/mo):</span> Subscription can be cancelled anytime. Access to premium features continues until the end of the billing period.</li>
            <li><span className="text-fg-muted">Founder ($129 one-time):</span> Lifetime access to Supporter features. Physical card shipping subject to availability. Founder tier is limited and will not be reopened after the window closes.</li>
            <li><span className="text-fg-muted">Refunds:</span> Supporter subscriptions can be refunded within 7 days of first purchase. Founder purchases are non-refundable once the card is produced.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Beta disclaimer</h2>
          <p className="text-muted">
            Aestra is in active development. Features may change, break, or be removed.
            We recommend saving your projects frequently and keeping backups.
            We are not responsible for lost work, corrupted projects, or audio dropouts during the beta period.
            This is software built by humans who care deeply about it — but it is still beta software.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Third-party plugins</h2>
          <p className="text-muted">
            Aestra supports VST3 and CLAP plugins. We are not responsible for third-party plugin behavior,
            stability, or licensing. Plugin crashes are sandboxed where possible, but we cannot
            guarantee isolation for all plugin formats.
          </p>
        </section>

        <section>
          <h2 className="text-[15px] font-medium text-fg mb-3">Changes to these terms</h2>
          <p className="text-muted">
            We may update these terms as Aestra evolves. Material changes will be announced on
            the website and through community channels. Continued use after changes constitutes acceptance.
          </p>
        </section>
      </div>
    </div>
  </div>
));
