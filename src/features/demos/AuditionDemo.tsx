import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "../session";
import { PROFILES, PROFILE_ORDER, profileCurve, type Profile } from "../engine";
import { useFrame, useVisible } from "../hooks";
import { Panel } from "./shared";

/* Audition: hear the loop the way it lands elsewhere. The list follows the
   "Listen on" design for v0.8.1; the filters behind it are illustrative. */

const FMIN = 20, FMAX = 20000, DB = 12;
const CW = 440, CH = 190;
const fx = (f: number) => (Math.log10(f / FMIN) / Math.log10(FMAX / FMIN)) * CW;
const dy = (db: number) => CH / 2 - (Math.max(-DB, Math.min(DB, db)) / DB) * (CH / 2 - 8);

const ICON: Record<Profile, React.ReactNode> = {
  studio: <><rect x="4" y="2" width="10" height="14" /><circle cx="9" cy="11" r="2.5" /><circle cx="9" cy="5.5" r="1" /></>,
  streaming: <path d="M2 9 H4 L6 4 L8 14 L10 6 L12 11 L14 9 H16" />,
  car: <><path d="M3 12 V9 L5 5 H13 L15 9 V12 Z M3 12 V14 M15 12 V14" /><circle cx="6" cy="10" r=".8" /><circle cx="12" cy="10" r=".8" /></>,
  earbuds: <path d="M5 4 A2.5 2.5 0 0 1 7 8 V14 M13 4 A2.5 2.5 0 0 0 11 8 V14" />,
  phone: <><rect x="5" y="2" width="8" height="14" rx="1" /><path d="M8 13.5 H10" /></>,
};

export const AuditionDemo = () => {
  const { state, change, engine, playing, refName, loadReference, clearReference, notice } = useSession();
  const profile = state.profile;
  const { ab, refTrimDb } = state;
  const picker = useRef<HTMLInputElement>(null);
  const hist = useRef<{ t: number; m: number; r: number }[]>([]);
  const tick = useRef(0);
  const [levels, setLevels] = useState<{ mix: number; ref: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const visible = useVisible(box);
  const [bins] = useState(() => new Uint8Array(1024));

  const freqs = useMemo(() => {
    const n = 90;
    const f = new Float32Array(n);
    for (let i = 0; i < n; i++) f[i] = FMIN * Math.pow(FMAX / FMIN, i / (n - 1));
    return f;
  }, []);
  const [paths, setPaths] = useState<Record<string, string>>({});
  useEffect(() => {
    const out: Record<string, string> = {};
    for (const p of PROFILE_ORDER) {
      const c = profileCurve(p, freqs);
      out[p] = Array.from(freqs).map((f, i) => `${i ? "L" : "M"}${fx(f).toFixed(1)} ${dy(c[i]).toFixed(1)}`).join(" ");
    }
    setPaths(out);
  }, [freqs]);

  const draw = () => {
    // Loudness is the average power over exactly one bar of the loop, so it doesn't swing with each hit.
    const now = performance.now();
    const m = engine.rms("mix");
    const r = engine.rms("ref");
    const h = hist.current;
    h.push({ t: now, m: m * m, r: r * r });
    const win = (4 * 60 / state.bpm) * 1000;
    while (h.length > 1 && now - h[0].t > win) h.shift();
    if (now - tick.current > 250) {
      tick.current = now;
      const settled = h.length > 20 && now - h[0].t > win * 0.92;
      if (!settled) { setLevels(null); }
      else {
        const am = h.reduce((a, x) => a + x.m, 0) / h.length;
        const ar = h.reduce((a, x) => a + x.r, 0) / h.length;
        setLevels(am > 1e-10 && ar > 1e-10 ? { mix: 10 * Math.log10(am), ref: 10 * Math.log10(ar) } : null);
      }
    }
    const c = cv.current;
    const g = c?.getContext("2d");
    if (!c || !g) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== CW * dpr) { c.width = CW * dpr; c.height = CH * dpr; }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, CW, CH);
    if (!engine.spectrum(bins)) return;
    const nyq = engine.sampleRate / 2;
    const count = Math.min(bins.length, engine.spectrumBins || 256);
    const bars = 72;
    g.fillStyle = "rgba(63,214,173,0.55)";
    for (let b = 0; b < bars; b++) {
      const f0 = FMIN * Math.pow(FMAX / FMIN, b / bars);
      const f1 = FMIN * Math.pow(FMAX / FMIN, (b + 1) / bars);
      const i0 = Math.min(count - 1, Math.floor((f0 / nyq) * count));
      const i1 = Math.min(count - 1, Math.max(i0, Math.floor((f1 / nyq) * count)));
      let v = 0;
      for (let i = i0; i <= i1; i++) v = Math.max(v, bins[i]);
      const h = (v / 255) * (CH - 24);
      g.fillRect(fx(f0) + 0.5, CH - h, Math.max(1, fx(f1) - fx(f0) - 1.5), h);
    }
  };
  useFrame(draw, visible && playing);
  useEffect(() => { if (!playing) { cv.current?.getContext("2d")?.clearRect(0, 0, CW * 2, CH * 2); setLevels(null); hist.current = []; } }, [playing]);

  const pick = (p: Profile) => change((s) => ({ ...s, profile: p }));
  const setAB = (v: "mix" | "ref") => change((s) => ({ ...s, ab: v }));
  const match = () => {
    if (!levels) return;
    // The reference is measured before its trim, so the gap between the two is the trim to apply.
    const gap = Math.max(-18, Math.min(18, levels.mix - levels.ref));
    change((s) => ({ ...s, refTrimDb: Math.round(gap * 10) / 10 }));
  };
  const fmt = (v: number) => `${v.toFixed(1).replace("-", "−")} dB`;

  return (
    <Panel title="Audition · listen on" tag="Design preview">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-3 sm:px-4 py-3" style={{ background: "#0c0b0a", borderBottom: "1px solid #2e2a26" }}>
        <div className="flex overflow-hidden" style={{ border: "1px solid #2e2a26", borderRadius: 2 }} role="group" aria-label="Compare your mix with a reference">
          <button type="button" aria-pressed={ab === "mix"} onClick={() => setAB("mix")}
            style={{ all: "unset", cursor: "pointer", padding: "7px 14px", fontSize: 11, fontWeight: 700, background: ab === "mix" ? "#7c3aed" : "transparent", color: ab === "mix" ? "#fff" : "#857d72" }}>
            A · Mix
          </button>
          <button type="button" aria-pressed={ab === "ref"} onClick={() => setAB("ref")}
            style={{ all: "unset", cursor: "pointer", padding: "7px 14px", fontSize: 11, fontWeight: 700, background: ab === "ref" ? "#f3a93b" : "transparent", color: ab === "ref" ? "#0c0b0a" : "#857d72" }}>
            B · Ref
          </button>
        </div>
        <span className="text-[12px]" style={{ color: "#aca397", minWidth: 150 }} aria-live="off">
          <b style={{ color: "#eee9e1" }}>{levels ? fmt(ab === "mix" ? levels.mix : levels.ref + refTrimDb) : playing ? "measuring…" : "—"}</b> level
          {levels && Math.abs(levels.mix - (levels.ref + refTrimDb)) > 0.5 && (
            <span style={{ color: "#f3a93b" }}> · B is {fmt(Math.abs(levels.ref + refTrimDb - levels.mix)).replace(" dB", "")} dB {levels.ref + refTrimDb > levels.mix ? "louder" : "quieter"}</span>
          )}
        </span>
        <span className="flex-1" />
        <button type="button" className="dbtn" onClick={match} disabled={!levels}>Match levels</button>
        {refTrimDb !== 0 && <button type="button" className="dbtn" onClick={() => change((s) => ({ ...s, refTrimDb: 0 }))}>Reset {fmt(refTrimDb)}</button>}
        <span className="text-[12px]" style={{ color: "#857d72" }}>
          Reference: <b style={{ color: "#aca397", fontWeight: 600 }}>{refName ?? "built-in loop"}</b>
        </span>
        <button type="button" className="dbtn" onClick={() => picker.current?.click()}>{refName ? "Swap track…" : "Use your own track…"}</button>
        {refName && <button type="button" className="dbtn" onClick={clearReference}>Remove</button>}
        <input ref={picker} type="file" accept="audio/*" hidden tabIndex={-1} onChange={(e) => { const f = e.target.files?.[0]; if (f) void loadReference(f); e.target.value = ""; }} />
      </div>
      {notice && <p className="m-0 px-4 pt-3 text-[12px]" role="status" style={{ color: "#ff6b4f" }}>{notice}</p>}
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="p-2 sm:p-3" role="group" aria-label="Listen on">
          {PROFILE_ORDER.map((p) => {
            const active = p === profile;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => pick(p)}
                style={{ all: "unset", boxSizing: "border-box", width: "100%", display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 12, alignItems: "center", padding: "10px 12px", borderRadius: 2, cursor: "pointer", background: active ? "#25221f" : "transparent" }}
              >
                <span style={{ width: 34, height: 34, borderRadius: "50%", background: active ? "#3fd6ad" : "#25221f", color: active ? "#0c0b0a" : "#aca397", display: "grid", placeItems: "center" }}>
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[p]}</svg>
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: active ? "#3fd6ad" : "#eee9e1" }}>{PROFILES[p].label}</span>
                  <span style={{ display: "block", fontSize: 11, color: "#857d72", marginTop: 2, lineHeight: "15px" }}>{PROFILES[p].note}</span>
                </span>
                {PROFILES[p].gainDb !== 0 && <span style={{ fontSize: 11, color: "#f3a93b", fontWeight: 600 }}>{PROFILES[p].gainDb.toFixed(1).replace("-", "−")} dB</span>}
              </button>
            );
          })}
        </div>

        <div ref={box} className="p-3 sm:p-4" style={{ borderLeft: "1px solid #2e2a26" }}>
          <p className="dcap m-0 mb-2">What it does to the sound</p>
          <div className="relative" style={{ width: "100%", maxWidth: CW, aspectRatio: `${CW} / ${CH}` }}>
            <canvas ref={cv} className="absolute inset-0 w-full h-full" aria-hidden="true" />
            <svg viewBox={`0 0 ${CW} ${CH}`} className="absolute inset-0 w-full h-full" role="img" aria-label={`Frequency response of the ${PROFILES[profile].label} profile`}>
              {[-6, 0, 6].map((d) => <line key={d} x1="0" x2={CW} y1={dy(d)} y2={dy(d)} stroke={d === 0 ? "#3d3833" : "#25221f"} strokeWidth="1" />)}
              {[100, 1000, 10000].map((f) => (
                <g key={f}>
                  <line x1={fx(f)} x2={fx(f)} y1="0" y2={CH} stroke="#25221f" />
                  <text x={fx(f) + 4} y={CH - 5} fill="#57514a" fontSize="9" fontFamily="var(--font-mono, monospace)">{f >= 1000 ? `${f / 1000}k` : f}</text>
                </g>
              ))}
              {paths.studio && <path d={paths.studio} fill="none" stroke="#57514a" strokeWidth="1" strokeDasharray="3 3" />}
              {paths[profile] && <path d={paths[profile]} fill="none" stroke="#a88dfb" strokeWidth="2.2" strokeLinejoin="round" />}
            </svg>
          </div>
          <p className="dnote mt-3 mb-0">
            {playing ? "Green is what's coming out of your speakers. Switch the list, or flip A and B, and watch it change." : "Press play, then flip A and B, and switch the list to hear it on a phone, in earbuds or in a car."}
          </p>
          <p className="dnote mt-2 mb-0" style={{ color: "#57514a" }}>A and B both go through the same Listen on setting. A track you add stays in your browser. These filters illustrate the idea; they aren't a model of real devices.</p>
        </div>
      </div>
    </Panel>
  );
};
