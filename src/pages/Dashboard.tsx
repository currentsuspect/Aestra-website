import React, { memo } from "react";
import { FadeIn } from "../components/ui";
import type { PageProps } from "../types";

/* Accounts, licenses and downloads aren't built. This page used to be a
   mock sign-in that accepted any email. It says what's true instead. */
export const Dashboard = memo(({ setPage }: PageProps) => (
  <div className="pt-32 sm:pt-40 pb-24 sm:pb-32 min-h-screen px-5 sm:px-6">
    <div className="max-w-[1320px] mx-auto">
      <FadeIn>
        <p className="readout mb-5">Accounts</p>
        <h1 className="display text-[clamp(3rem,1.6rem+5vw,7rem)] max-w-[14ch]">Not built yet.</h1>
        <p className="mt-8 text-muted text-base sm:text-[17px] leading-relaxed max-w-xl">
          There are no accounts on Aestra yet, so there's nothing to sign in to. No
          licenses, no downloads page, no Supporter dashboard. The core app doesn't
          need one: it's free, and your projects stay on your computer.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[15px]">
          <a href="/pricing" onClick={(e) => { e.preventDefault(); setPage("pricing"); }} className="quiet-link">What Supporter will include</a>
          <a href="/download" onClick={(e) => { e.preventDefault(); setPage("download"); }} className="quiet-link">Build it from source</a>
          <a href="/" onClick={(e) => { e.preventDefault(); setPage("home"); }} className="quiet-link">Back to home</a>
        </div>
      </FadeIn>
    </div>
  </div>
));
