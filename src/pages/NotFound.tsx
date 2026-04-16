import React, { memo, useEffect, useRef } from "react";

const Waveform = memo(() => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wf = ref.current;
    if (!wf) return;
    wf.innerHTML = "";
    const total = 48;
    const aliveStart = 14;
    const aliveEnd = 34;
    const center = (aliveStart + aliveEnd) / 2;
    const maxH = 48;

    for (let i = 0; i < total; i++) {
      const bar = document.createElement("div");
      const alive = i >= aliveStart && i <= aliveEnd;

      if (alive) {
        const dist = Math.abs(i - center);
        const h = Math.max(4, maxH - dist * dist * 0.6 + (Math.random() - 0.5) * 10);
        bar.className = "wave-bar alive";
        bar.style.height = h + "px";
        bar.style.setProperty("--spd", (0.3 + Math.random() * 0.5) + "s");
        bar.style.setProperty("--delay", (i * 0.025) + "s");
      } else {
        bar.className = "wave-bar dead";
      }
      wf.appendChild(bar);
    }
  }, []);

  return <div ref={ref} className="waveform" />;
});

export const NotFound = memo(({ setPage }: { setPage: (p: string) => void }) => (
  <div className="not-found-page">
    <div className="grid-bg" />
    <div className="scanlines" />

    <div className="nf-content">
      <div className="error-badge">
        <div className="err-dot" />
        Track not found
      </div>

      <div className="big-404">
        4<span className="zero">0</span>4
      </div>

      <Waveform />

      <div className="tagline">This page dropped out.</div>
      <div className="sub">
        Like a sample that never loaded. The URL you hit doesn't exist — but your session is still running.
      </div>

      <div className="nf-actions">
        <button className="btn-back" onClick={() => window.history.back()}>← Go back</button>
        <button className="btn-home" onClick={() => setPage("home")}>Take me home</button>
      </div>
    </div>

    <div className="status-strip">
      <div className="status-item">SESSION <b>ACTIVE</b></div>
      <div className="status-item err">PAGE <b>NULL</b></div>
      <div className="status-item">ENGINE <b>RUNNING</b></div>
    </div>
  </div>
));
