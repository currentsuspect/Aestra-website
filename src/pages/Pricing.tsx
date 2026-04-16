import React, { useState, useEffect, memo } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib";
import { Button } from "../components/ui";

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MetalCard = () => (
  <div className="metal-card">
    <div className="metal-shine" />
    <div className="metal-card-logo">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L8 3L13 8L8 13Z" stroke="#3a2800" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.6"/>
        <circle cx="8" cy="8" r="2" fill="#3a2800" opacity="0.6"/>
      </svg>
      <span className="metal-card-brand">AESTRA</span>
    </div>
    <div className="metal-card-name">Founder</div>
    <div className="metal-card-num">#0001</div>
  </div>
);

const AnimatedCounter = ({ target = 31, total = 500 }: { target?: number; total?: number }) => {
  const [count, setCount] = useState(0);
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFillWidth((target / total) * 100);
      let c = 0;
      const interval = setInterval(() => {
        c = Math.min(target, c + 1);
        setCount(c);
        if (c >= target) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timeout);
  }, [target, total]);

  return (
    <div className="founder-counter">
      <div className="counter-track">
        <div className="counter-fill" style={{ width: `${fillWidth}%` }} />
      </div>
      <div className="counter-text"><b>{count}</b> / {total} claimed</div>
    </div>
  );
};

export const Pricing = ({ setPage }: any) => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="text-center pt-18 sm:pt-24 pb-12 px-6">
        <h1 className="pricing-hero-title">
          Pay for what<br/>you <em>actually use.</em>
        </h1>
        <p className="pricing-hero-sub">The full DAW is free. Always. Supporting Aestra just means going deeper.</p>
      </section>

      {/* Core + Supporter */}
      <div className="tiers-grid">
        {/* Core */}
        <div className="tier-card tier-core">
          <div className="tier-label tier-label-default">Core</div>
          <div className="tier-price">$0 <span className="free-label">forever</span></div>
          <div className="tier-tagline">Full DAW. No time limits.<br/>No "export to unlock."</div>
          <ul className="feature-list">
            {["Unlimited tracks & patterns", "Pattern-based workflow", "Routing visualizer", "Audition mode", "Version control (Takes)", "Built-in plugin suite"].map((feat, i) => (
              <li key={i}>
                <span className="check check-free"><CheckIcon /></span>
                {feat}
              </li>
            ))}
          </ul>
          <button className="tier-btn btn-free" onClick={() => setPage("download")}>Download Free</button>
        </div>

        {/* Supporter */}
        <div className="tier-card tier-supporter">
          <div className="tier-label tier-label-purple">Supporter</div>
          <div className="tier-price">$5 <sub>/mo</sub></div>
          <div className="tier-tagline">Back the build.<br/>Get the extras.</div>
          <ul className="feature-list">
            {["Everything in Core", "Muse — AI assistant, runs on your machine", "Premium plugins (Rumble, more dropping monthly)", "Cloud storage for Takes", "Monthly sound packs"].map((feat, i) => (
              <li key={i}>
                <span className="check check-sup"><CheckIcon /></span>
                {feat}
              </li>
            ))}
          </ul>
          <button className="tier-btn btn-supporter" onClick={() => setPage("changelog")}>Coming Soon — Follow Progress</button>
        </div>
      </div>

      <p className="tiers-note">No card required for Core. Cancel Supporter anytime. Founder is a one-time purchase, never restocked.</p>

      {/* Divider */}
      <div className="tier-divider">
        <div className="div-line" />
        <div className="div-label">Founder — 500 exist, ever</div>
        <div className="div-line" />
      </div>

      {/* Founder */}
      <div className="founder-section">
        <div className="founder-card">
          <div className="founder-top">
            <div className="founder-left">
              <div className="founder-badge">
                <div className="founder-badge-dot" />
                Limited to 500 — never reproduced
              </div>
              <h2 className="founder-title">You believed<br/><em>first.</em></h2>
              <p className="founder-subline">Not a tier. A record. Your name ships inside every copy of Aestra, permanently. The card is physical proof.</p>
            </div>
            <MetalCard />
          </div>

          <AnimatedCounter target={31} total={500} />

          <div className="founder-features">
            {["Everything in Supporter, forever", "Physical metal card shipped to you", "Name in app credits, permanent", "Beta access — mobile & tablet", "Vote on feature priorities", "No subscription. Ever."].map((feat, i) => (
              <div key={i} className="f-chip">
                <div className="f-chip-dot" />
                {feat}
              </div>
            ))}
          </div>

          <div className="founder-bottom">
            <div className="founder-price">$129 <span>once</span></div>
            <button
              className="btn-founder"
              onClick={() => { setPage("home"); setTimeout(() => { document.getElementById("founder-section")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
            >
              Join the Waitlist →
            </button>
          </div>
          <div className="founder-fine">Shipped when beta launches — December 2026. Waitlist locks your slot number.</div>
        </div>
      </div>
    </div>
  );
};
