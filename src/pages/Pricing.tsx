import React, { useState, useEffect, memo } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib";
import { Button } from "../components/ui";

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardVisual = ({ tier, label, num, accent }: { tier: string; label: string; num?: string; accent: string }) => {
  const [flipped, setFlipped] = useState(false);

  const gradients: Record<string, string> = {
    core: "linear-gradient(135deg, #3a3f55 0%, #6b7280 30%, #4a5068 60%, #8a9098 100%)",
    supporter: "linear-gradient(135deg, #1e3a6e 0%, #3b82f6 30%, #2563eb 60%, #60a5fa 100%)",
    founder: "linear-gradient(135deg, #c8a84b 0%, #f5d980 30%, #a87c20 60%, #e8c060 100%)",
  };

  const logoStroke = tier === "founder" ? "#3a2800" : tier === "supporter" ? "#1a2a50" : "#1a1e2a";
  const textColor = tier === "founder" ? "#3a2800" : tier === "supporter" ? "#c8d8ff" : "#c0c4d0";

  return (
    <div className="card-visual-wrap" onClick={(e) => { e.stopPropagation(); setFlipped(!flipped); }}>
      <div className={cn("card-visual-inner", flipped && "flipped")}>
        <div className="card-visual-face card-visual-front" style={{ background: gradients[tier] }}>
          <div className="card-visual-shine" />
          <div className="card-visual-logo">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L8 3L13 8L8 13Z" stroke={logoStroke} strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.7"/>
              <circle cx="8" cy="8" r="2" fill={logoStroke} opacity="0.7"/>
            </svg>
            <span style={{ fontSize: "9px", fontWeight: 700, color: logoStroke, opacity: 0.7, letterSpacing: "0.05em" }}>AESTRA</span>
          </div>
          <div className="card-visual-label" style={{ color: textColor }}>{label}</div>
          {num && <div className="card-visual-num" style={{ color: textColor }}>{num}</div>}
        </div>
        <div className="card-visual-face card-visual-back" style={{ background: gradients[tier] }}>
          <div className="card-visual-shine" />
          <div className="card-back-content" style={{ color: tier === "founder" ? "#3a2800" : "#fff" }}>
            {tier === "core" && (
              <>
                <svg className="card-back-svg" viewBox="0 0 40 24" fill="none">
                  <path d="M4 12C4 7 8 4 12 4C16 4 18 7 20 10C22 7 24 4 28 4C32 4 36 7 36 12C36 17 28 22 20 22C12 22 4 17 4 12Z" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
                  <circle cx="20" cy="12" r="3" stroke="currentColor" strokeWidth="1" opacity="0.8"/>
                  <circle cx="20" cy="12" r="1" fill="currentColor" opacity="0.5"/>
                </svg>
                <div className="card-back-text">No limits.<br/>No catch.<br/>No compromise.</div>
              </>
            )}
            {tier === "supporter" && (
              <>
                <svg className="card-back-svg" viewBox="0 0 32 32" fill="none">
                  <path d="M18 4L8 18H16L14 28L24 14H16L18 4Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8"/>
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 3"/>
                </svg>
                <div className="card-back-text">Your sound.<br/>Your AI.<br/>Your plugins.</div>
              </>
            )}
            {tier === "founder" && (
              <>
                <svg className="card-back-svg" viewBox="0 0 36 28" fill="none">
                  <path d="M4 24L8 10L14 16L18 4L22 16L28 10L32 24H4Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.7" fill="currentColor" fillOpacity="0.08"/>
                  <line x1="4" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                </svg>
                <div className="card-back-text">Your name.<br/>Every copy.<br/>Forever.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
    }, 600);
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
          Aestra is free to use.<br/><em>Fully.</em>
        </h1>
        <p className="pricing-hero-sub">No export lock. No time limits. No artificial walls. Supporter keeps the project alive and unlocks the extras.</p>
      </section>

      {/* Core + Supporter */}
      <div className="tiers-grid">
        {/* Core */}
        <div className="tier-card tier-core">
          <div className="supporter-badge-top supporter-badge-hidden">.</div>
          <div className="tier-card-header">
            <div className="tier-card-info">
              <div className="tier-label tier-label-default">Core</div>
              <div className="tier-price">$0 <span className="free-label">forever</span></div>
              <div className="tier-tagline">Full DAW. No time limits.<br/>No export lock.</div>
            </div>
            <CardVisual tier="core" label="Core" accent="grey" />
          </div>
          <ul className="feature-list">
            {["Unlimited tracks & patterns", "Pattern-based workflow", "Routing visualizer", "Audition mode", "Version control (Takes)", "Built-in plugin suite"].map((feat, i) => (
              <li key={i}>
                <span className="check check-free"><CheckIcon /></span>
                {feat}
              </li>
            ))}
          </ul>
          <button className="tier-btn btn-free" onClick={() => setPage("download")}>Download Free</button>
          <div className="supporter-proof supporter-proof-hidden">
            <span>No lock-in on your projects</span>
            <span>·</span>
            <span>Funds core development</span>
            <span>·</span>
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Supporter */}
        <div className="tier-card tier-supporter tier-supporter-highlight">
          <div className="supporter-badge-top">Best way to support Aestra</div>
          <div className="tier-card-header">
            <div className="tier-card-info">
              <div className="tier-label tier-label-purple">Supporter</div>
              <div className="tier-price">$5 <sub>/mo</sub></div>
              <div className="tier-tagline">Back Aestra.<br/>Fund the future.</div>
            </div>
            <CardVisual tier="supporter" label="Supporter" accent="blue" />
          </div>
          <ul className="feature-list">
            {["Everything in Core", "Muse — AI assistant, runs on your machine", "Premium plugins (Rumble, more dropping monthly)", "100GB Aestra Cloud included", "Monthly sound packs"].map((feat, i) => (
              <li key={i}>
                <span className="check check-sup"><CheckIcon /></span>
                {feat}
              </li>
            ))}
          </ul>
          <button className="tier-btn btn-supporter" onClick={() => setPage("changelog")}>Coming Soon — Follow Progress</button>
          <div className="supporter-proof">
            <span>No lock-in on your projects</span>
            <span>·</span>
            <span>Funds core development</span>
            <span>·</span>
            <span>Cancel anytime</span>
          </div>
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
            <CardVisual tier="founder" label="Founder" num="#0001" accent="gold" />
          </div>

          <AnimatedCounter target={31} total={500} />

          <div className="founder-features">
            {["Everything in Supporter, forever", "100GB Aestra Cloud for life", "Physical metal card shipped to you", "Name in app credits, permanent", "Beta access — mobile & tablet", "Vote on feature priorities", "No subscription. Ever."].map((feat, i) => (
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

      {/* Comparison Table */}
      <div className="founder-section" style={{ maxWidth: "900px" }}>
        <div className="tier-divider" style={{ maxWidth: "100%", padding: "0", marginBottom: "48px" }}>
          <div className="div-line" />
          <div className="div-label">What you get at each level</div>
          <div className="div-line" />
        </div>

        <div className="compare-table">
          <div className="compare-header">
            <div className="compare-feature-header">Feature</div>
            <div className="compare-tier-header compare-tier-core">Core<span className="compare-price">$0</span></div>
            <div className="compare-tier-header compare-tier-sup">Supporter<span className="compare-price">$5/mo</span></div>
            <div className="compare-tier-header compare-tier-found">Founder<span className="compare-price">$129</span></div>
          </div>

          <div className="compare-category">Engine</div>
          {[
            ["C++17 audio engine", true, true, true],
            ["Unlimited tracks & patterns", true, true, true],
            ["VST3 & CLAP plugin hosting", true, true, true],
            ["Routing visualizer", true, true, true],
            ["Audition mode (all platforms)", true, true, true],
            ["Offline export & rendering", true, true, true],
          ].map(([feat, core, sup, found], i) => (
            <div key={i} className="compare-row">
              <div className="compare-feature">{feat}</div>
              <div className="compare-cell compare-tier-core">{core && <span className="compare-check">✓</span>}</div>
              <div className="compare-cell compare-tier-sup">{sup && <span className="compare-check compare-check-sup">✓</span>}</div>
              <div className="compare-cell compare-tier-found">{found && <span className="compare-check compare-check-found">✓</span>}</div>
            </div>
          ))}

          <div className="compare-category">Workflow</div>
          {[
            ["Pattern-first (Arsenal)", true, true, true],
            ["Piano Roll editor", true, true, true],
            ["Version control (Takes)", true, true, true],
            ["Multi-track recording", true, true, true],
            ["Mixer with sends & buses", true, true, true],
          ].map(([feat, core, sup, found], i) => (
            <div key={i} className="compare-row">
              <div className="compare-feature">{feat}</div>
              <div className="compare-cell compare-tier-core">{core && <span className="compare-check">✓</span>}</div>
              <div className="compare-cell compare-tier-sup">{sup && <span className="compare-check compare-check-sup">✓</span>}</div>
              <div className="compare-cell compare-tier-found">{found && <span className="compare-check compare-check-found">✓</span>}</div>
            </div>
          ))}

          <div className="compare-category">Plugins & Sound</div>
          {[
            ["Built-in plugin suite", true, true, true],
            ["AestraRumble (808 synth)", false, true, true],
            ["Premium plugins (monthly drops)", false, true, true],
            ["Monthly sound packs", false, true, true],
          ].map(([feat, core, sup, found], i) => (
            <div key={i} className="compare-row">
              <div className="compare-feature">{feat}</div>
              <div className="compare-cell compare-tier-core">{core ? <span className="compare-check">✓</span> : <span className="compare-dash">—</span>}</div>
              <div className="compare-cell compare-tier-sup">{sup && <span className="compare-check compare-check-sup">✓</span>}</div>
              <div className="compare-cell compare-tier-found">{found && <span className="compare-check compare-check-found">✓</span>}</div>
            </div>
          ))}

          <div className="compare-category">AI & Cloud</div>
          {[
            ["Muse AI (runs locally)", false, true, true],
            ["Cloud storage for Takes", false, true, true],
            ["Cross-device sync (future)", false, true, true],
          ].map(([feat, core, sup, found], i) => (
            <div key={i} className="compare-row">
              <div className="compare-feature">{feat}</div>
              <div className="compare-cell compare-tier-core">{core ? <span className="compare-check">✓</span> : <span className="compare-dash">—</span>}</div>
              <div className="compare-cell compare-tier-sup">{sup && <span className="compare-check compare-check-sup">✓</span>}</div>
              <div className="compare-cell compare-tier-found">{found && <span className="compare-check compare-check-found">✓</span>}</div>
            </div>
          ))}

          <div className="compare-category">Cloud & Identity</div>
          {[
            ["Silver card identity", false, true, true],
            ["100GB Aestra Cloud", false, true, true],
            ["Extra storage add-ons", false, true, true],
            ["Physical metal Founder card", false, false, true],
            ["Name in app credits (permanent)", false, false, true],
            ["Beta access — mobile & tablet", false, false, true],
            ["Vote on feature priorities", false, false, true],
            ["Lifetime access — no subscription", false, false, true],
          ].map(([feat, core, sup, found], i) => (
            <div key={i} className="compare-row">
              <div className="compare-feature">{feat}</div>
              <div className="compare-cell compare-tier-core">{core ? <span className="compare-check">✓</span> : <span className="compare-dash">—</span>}</div>
              <div className="compare-cell compare-tier-sup">{sup ? <span className="compare-check compare-check-sup">✓</span> : <span className="compare-dash">—</span>}</div>
              <div className="compare-cell compare-tier-found">{found && <span className="compare-check compare-check-found">✓</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
