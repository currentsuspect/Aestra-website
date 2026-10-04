import React, { useRef, useState } from "react";
import { useSession } from "../session";
import { useFrame, useVisible } from "../hooks";
import { Panel, PlayDot } from "./shared";

/* The audio thread, shown for real. In a browser, sound is made on a thread
   of its own, which is what Aestra's engine does natively. Freeze the screen
   and watch the audio clock keep moving. Both lanes are measured live. */

const N = 90;
const CW = 560, CH = 150;
const CAP = 220;

export const EngineDemo = () => {
  const { playing, toggle, engine } = useSession();
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const visible = useVisible(box);
  const ui = useRef<number[]>([]);
  const au = useRef<number[]>([]);
  const lastAudio = useRef<number | null>(null);
  const [stall, setStall] = useState<{ ui: number; audio: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const lastNow = useRef<number | null>(null);
  useFrame(() => {
    // Read both clocks at the same instant so the two lanes are comparable.
    const now = performance.now();
    const t = engine.ctx?.currentTime ?? 0;
    const dt = lastNow.current === null ? 16.7 : now - lastNow.current;
    const ad = lastAudio.current === null ? dt : (t - lastAudio.current) * 1000;
    lastNow.current = now;
    lastAudio.current = t;
    ui.current.push(dt);
    au.current.push(ad);
    if (ui.current.length > N) { ui.current.shift(); au.current.shift(); }
    if (dt > 80) setStall({ ui: Math.round(dt), audio: Math.round(ad) });

    const c = cv.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== CW * dpr) { c.width = CW * dpr; c.height = CH * dpr; }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, CW, CH);
    const lane = (data: number[], y0: number, h: number, ok: string, bad: string) => {
      const bw = CW / N;
      data.forEach((v, i) => {
        const bh = Math.max(2, (Math.min(v, CAP) / CAP) * h);
        g.fillStyle = v > 50 ? bad : ok;
        g.fillRect(i * bw + 0.5, y0 + h - bh, Math.max(1, bw - 1.5), bh);
      });
      g.fillStyle = "#25221f";
      g.fillRect(0, y0 + h, CW, 1);
    };
    lane(ui.current, 8, 56, "#57514a", "#ff6b4f");
    lane(au.current, 84, 56, "#3fd6ad", "#3fd6ad");
  }, visible && playing);

  const choke = () => {
    if (busy) return;
    setBusy(true);
    let left = 3;
    const run = () => {
      const t = performance.now();
      while (performance.now() - t < 110) { /* hold the screen thread on purpose */ }
      left -= 1;
      if (left > 0) setTimeout(run, 320); else setBusy(false);
    };
    run();
  };

  return (
    <Panel title="Threads · screen and audio" tag="Illustration" right={<PlayDot playing={playing} onClick={() => { void toggle(); }} />}>
      <div ref={box} className="p-3 sm:p-4">
        <div className="relative" style={{ width: "100%", maxWidth: CW, aspectRatio: `${CW} / ${CH}` }}>
          <canvas ref={cv} className="absolute inset-0 w-full h-full" aria-hidden="true" />
          <span className="dcap absolute" style={{ left: 0, top: 0 }}>Screen · drawing the interface</span>
          <span className="dcap absolute" style={{ left: 0, top: 76, color: "#3fd6ad" }}>Audio · making the sound</span>
          {!playing && <div className="absolute inset-0 grid place-items-center text-center dnote" style={{ background: "rgba(20,18,16,0.82)" }}>Press play to start measuring.</div>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="dbtn" onClick={choke} disabled={!playing || busy}>{busy ? "Choking the screen…" : "Make the screen choke"}</button>
          <p className="m-0 text-[13px]" style={{ color: stall ? "#eee9e1" : "#857d72", minHeight: 20 }} role="status">
            {stall
              ? `The screen froze for ${stall.ui} ms. The audio clock kept moving: ${stall.audio} ms of sound went out on time.`
              : "It holds the screen still for a moment while the loop plays."}
          </p>
        </div>
        <p className="dnote mt-3 mb-0">This is the browser's own audio thread. Aestra's engine keeps audio on a separate thread the same way, so drawing the screen never gets in the way of sound.</p>
      </div>
    </Panel>
  );
};
