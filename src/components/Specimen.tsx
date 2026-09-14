import React, { memo } from "react";

/* ── Specimen ──────────────────────────────────────────────────────
   A small DAW-styled display beside the home Details ledger. Each
   scene acts out one ledger line, so the claim is shown rather than
   asserted. Scenes are indexed 1:1 with DETAILS in pages/Home.tsx —
   reorder both together.

   Colours are the DAW's own (see MockTimeline / NUIThemeSystem.cpp),
   and the display is dark in both site themes, like the mock.

   Motion rule: every scene's *static* state is the correct outcome
   (playhead at 1, take on the grid, cycle refused…). Animation only
   plays the "before" into it, so prefers-reduced-motion still reads.
   Decorative: aria-hidden, the ledger text carries the meaning.
   ──────────────────────────────────────────────────────────────── */

const C = {
  lane: "#0d0d0d",
  raised: "#212121",
  surface: "#191919",
  border: "#2b2b2b",
  gridBar: "rgba(255,255,255,0.10)",
  gridBeat: "rgba(255,255,255,0.04)",
  text: "rgba(255,255,255,0.90)",
  textDim: "rgba(255,255,255,0.50)",
  textOff: "rgba(255,255,255,0.25)",
  primary: "#7c3aed",
  primaryHi: "#9257ff",
  teal: "#00C9A7",
  purple: "#7B6FD4",
  amber: "#F0A500",
  error: "#e85454",
  success: "#3dbb6e",
};

const X0 = 24;
const X1 = 336;
const BAR = (X1 - X0) / 4;

/* Deterministic waveform: vertical strokes under a soft envelope. */
const wave = (x: number, y: number, w: number, h: number, seed = 1) => {
  let d = "";
  const n = Math.floor(w / 2.5);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const env = Math.pow(Math.sin(Math.PI * t), 0.5);
    const a = Math.abs(Math.sin(i * 0.9 * seed) + 0.6 * Math.sin(i * 2.3 + seed)) / 1.6;
    const amp = a * env * h * 0.45 + 0.6;
    const px = (x + i * 2.5).toFixed(1);
    d += `M${px} ${(y + h / 2 - amp).toFixed(1)}V${(y + h / 2 + amp).toFixed(1)}`;
  }
  return d;
};

const Grid = ({ top, bottom }: { top: number; bottom: number }) => (
  <g>
    <rect x={X0} y={top} width={X1 - X0} height={bottom - top} fill={C.lane} />
    {Array.from({ length: 17 }, (_, i) => {
      const x = X0 + (i * (X1 - X0)) / 16;
      const bar = i % 4 === 0;
      return (
        <line key={i} x1={x} x2={x} y1={bar ? top - 8 : top} y2={bottom} stroke={bar ? C.gridBar : C.gridBeat} />
      );
    })}
    {Array.from({ length: 4 }, (_, b) => (
      <text key={b} x={X0 + b * BAR + 4} y={top - 3}>{b + 1}</text>
    ))}
  </g>
);

const Clip = ({ x, y, w, h, color, seed }: { x: number; y: number; w: number; h: number; color: string; seed: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={2} fill={color} fillOpacity={0.16} stroke={color} strokeOpacity={0.7} />
    <path d={wave(x + 4, y + 4, w - 8, h - 8, seed)} stroke={color} strokeOpacity={0.75} strokeWidth={1} />
  </g>
);

/* 01 · Stop returns the playhead to the top */
const StopScene = () => (
  <g>
    <g transform="translate(24 12)">
      <rect width={58} height={18} rx={3} fill={C.raised} stroke={C.border} />
      <path d="M10 5 L16 9 L10 13Z" fill={C.textDim} />
      <rect className="sp1-stop" x={25} y={5.5} width={7} height={7} rx={1} fill={C.textDim} />
      <circle cx={46} cy={9} r={3.5} fill={C.textOff} />
    </g>
    <text x={X1} y={25} textAnchor="end">stop → bar 1</text>
    <Grid top={52} bottom={178} />
    <Clip x={X0 + 2} y={62} w={BAR * 2 - 4} h={30} color={C.teal} seed={1} />
    <Clip x={X0 + BAR + 2} y={100} w={BAR * 2 - 4} h={30} color={C.purple} seed={1.7} />
    <Clip x={X0 + BAR * 2 + 2} y={138} w={BAR - 4} h={30} color={C.amber} seed={2.3} />
    <g className="sp1-ph">
      <line x1={X0} x2={X0} y1={44} y2={178} stroke={C.primaryHi} strokeWidth={1.5} />
      <path d={`M${X0 - 5} 42 h10 l-5 6z`} fill={C.primaryHi} />
    </g>
  </g>
);

/* 02 · Takes land on the grid, compensated for device latency */
const LatencyScene = () => {
  const gx = X0 + BAR;
  const late = 24;
  return (
    <g>
      <Grid top={52} bottom={170} />
      <line x1={gx} x2={gx} y1={44} y2={170} stroke={C.primaryHi} strokeDasharray="3 3" />
      <g>
        <line x1={gx} x2={gx + late} y1={70} y2={70} stroke={C.textDim} />
        <line x1={gx} x2={gx} y1={66} y2={74} stroke={C.textDim} />
        <line x1={gx + late} x2={gx + late} y1={66} y2={74} stroke={C.textDim} />
        <text x={gx + late + 6} y={73}>input + output latency</text>
      </g>
      <rect className="sp2-ghost" x={gx + late} y={86} width={BAR * 1.6} height={52} rx={2} fill="none" stroke={C.error} strokeDasharray="3 3" />
      <g className="sp2-take">
        <Clip x={gx} y={86} w={BAR * 1.6} h={52} color={C.teal} seed={1.3} />
      </g>
      <text x={X0} y={25}>recorded take</text>
      <text className="sp2-on t-strong" x={X1} y={25} textAnchor="end">on the grid</text>
    </g>
  );
};

/* 03 · Edits while the loop plays are heard immediately */
const STEPS = [1, 0, 1, 0, 1, 1, 0, 1];
const STEP_W = (X1 - X0) / 8;
const LiveEditScene = () => (
  <g>
    <text x={X0} y={25}>pattern · looping</text>
    <text className="t-strong" x={X1} y={25} textAnchor="end">deleted mid-loop → silent now</text>
    {STEPS.map((on, i) => {
      const x = X0 + i * STEP_W + 3;
      const deleted = i === 5;
      return (
        <g key={i}>
          <rect x={x} y={70} width={STEP_W - 6} height={56} rx={2} fill={C.surface} stroke={C.border} />
          {on === 1 && !deleted && (
            <>
              <rect x={x} y={70} width={STEP_W - 6} height={56} rx={2} fill={C.amber} fillOpacity={0.55} />
              <rect
                className="sp3-hit"
                x={x}
                y={70}
                width={STEP_W - 6}
                height={56}
                rx={2}
                fill="#fff"
                style={{ animationDelay: `${(i / 8) * 3.2}s` }}
              />
            </>
          )}
          {deleted && (
            <rect className="sp3-del" x={x} y={70} width={STEP_W - 6} height={56} rx={2} fill={C.amber} fillOpacity={0.55} />
          )}
          <text x={x + (STEP_W - 6) / 2} y={142} textAnchor="middle">{i + 1}</text>
        </g>
      );
    })}
    <path className="sp3-mark" d={`M${X0 + 5 * STEP_W + 10} 92 l${STEP_W - 26} 12 M${X0 + 5 * STEP_W + 10} 104 l${STEP_W - 26} -12`} stroke={C.textDim} strokeWidth={1.2} />
    <g className="sp3-ph">
      <line x1={X0} x2={X0} y1={60} y2={134} stroke={C.primaryHi} strokeWidth={1.5} />
    </g>
  </g>
);

/* 04 · A mixer channel hop costs no level */
const METER_TOP = 46;
const METER_BOTTOM = 156;
const Meter = ({ x, label }: { x: number; label: string }) => (
  <g>
    <rect x={x} y={METER_TOP} width={30} height={METER_BOTTOM - METER_TOP} rx={2} fill="#080808" stroke={C.border} />
    <rect
      className="sp4-level"
      x={x + 3}
      y={METER_TOP + 3}
      width={24}
      height={METER_BOTTOM - METER_TOP - 6}
      fill={C.teal}
      fillOpacity={0.75}
      style={{ transformOrigin: `0px ${METER_BOTTOM - 3}px` }}
    />
    <text x={x + 15} y={174} textAnchor="middle">{label}</text>
  </g>
);
const GainScene = () => (
  <g>
    <text x={X0} y={25}>same source, two routes</text>
    <text className="t-strong" x={X1} y={25} textAnchor="end">equal level</text>
    {["0", "-6", "-12", "-24"].map((db, i) => (
      <g key={db}>
        <line x1={96} x2={264} y1={METER_TOP + 3 + i * 30} y2={METER_TOP + 3 + i * 30} stroke={C.gridBeat} />
        <text x={88} y={METER_TOP + 6 + i * 30} textAnchor="end">{db}</text>
      </g>
    ))}
    <Meter x={118} label="direct" />
    <Meter x={214} label="via channel" />
  </g>
);

/* 05 · A solo bounce includes the send return */
const Node = ({ x, y, label, hi = false }: { x: number; y: number; label: string; hi?: boolean }) => (
  <g>
    <rect x={x} y={y} width={72} height={24} rx={3} fill={C.surface} stroke={hi ? C.primary : C.border} />
    <text className="t-strong" x={x + 36} y={y + 15} textAnchor="middle">{label}</text>
  </g>
);
const BounceScene = () => (
  <g>
    <Node x={24} y={40} label="Track 1" hi />
    <Node x={144} y={40} label="Send" />
    <Node x={144} y={96} label="Return" />
    <Node x={264} y={68} label="Bounce" />
    <path className="sp-flow" d="M96 52 C 180 52, 190 80, 264 80" stroke={C.teal} fill="none" />
    <path className="sp-flow" d="M96 52 H 144" stroke={C.purple} fill="none" />
    <path className="sp-flow" d="M180 64 V 96" stroke={C.purple} fill="none" />
    <path className="sp-flow" d="M216 108 C 240 108, 244 80, 264 80" stroke={C.purple} fill="none" />
    <text x={X0} y={146}>solo bounce</text>
    <rect x={X0} y={152} width={X1 - X0} height={18} rx={2} fill={C.lane} stroke={C.border} />
    <g className="sp5-fill" style={{ transformOrigin: `${X0}px 0px` }}>
      <path d={wave(X0 + 4, 154, X1 - X0 - 8, 14, 1.1)} stroke={C.teal} strokeOpacity={0.8} />
      <path d={wave(X0 + 4, 156, X1 - X0 - 8, 10, 2.9)} stroke={C.purple} strokeOpacity={0.8} />
    </g>
    <text className="t-strong" x={X1} y={146} textAnchor="end">track + return</text>
  </g>
);

/* 06 · A routing cycle is refused, and the change is undoable */
const CycleScene = () => (
  <g>
    <Node x={24} y={64} label="Track 1" />
    <Node x={144} y={64} label="Bus" />
    <Node x={264} y={64} label="Master" />
    <line x1={96} x2={144} y1={76} y2={76} stroke={C.teal} />
    <line x1={216} x2={264} y1={76} y2={76} stroke={C.teal} />
    <path className="sp6-try" d="M300 88 C 300 150, 60 150, 60 88" stroke={C.error} fill="none" strokeDasharray="4 4" />
    <g className="sp6-x">
      <circle cx={180} cy={134} r={9} fill="#1a0f0f" stroke={C.error} />
      <path d="M176 130 l8 8 M184 130 l-8 8" stroke={C.error} strokeWidth={1.4} />
    </g>
    <text x={X0} y={25}>master → track 1</text>
    <text className="sp6-label t-strong" x={X1} y={25} textAnchor="end">cycle refused</text>
    <text x={180} y={172} textAnchor="middle">Ctrl+Z undoes any reroute</text>
  </g>
);

/* 07 · Missing files are named on open, then relinked */
const FILES = [
  { name: "kick_808.wav", state: "found" },
  { name: "vox_take3.wav", state: "missing" },
  { name: "pad_loop.wav", state: "found" },
];
const RelinkScene = () => (
  <g>
    <rect x={24} y={14} width={312} height={164} rx={4} fill={C.surface} stroke={C.border} />
    <text className="t-strong" x={38} y={34}>Missing audio files</text>
    <text x={322} y={34} textAnchor="end">project.aestra</text>
    <line x1={24} x2={336} y1={44} y2={44} stroke={C.border} />
    {FILES.map((f, i) => {
      const y = 52 + i * 28;
      return (
        <g key={f.name}>
          {f.state === "missing" && (
            <>
              <rect className="sp7-bad" x={30} y={y} width={300} height={22} rx={2} fill={C.error} fillOpacity={0.12} />
              <rect className="sp7-good" x={30} y={y} width={300} height={22} rx={2} fill={C.success} fillOpacity={0.12} />
            </>
          )}
          <text className="t-strong" x={40} y={y + 14}>{f.name}</text>
          {f.state === "missing" ? (
            <>
              <text className="sp7-bad" x={320} y={y + 14} textAnchor="end" style={{ fill: C.error }}>missing</text>
              <text className="sp7-good" x={320} y={y + 14} textAnchor="end" style={{ fill: C.success }}>relinked</text>
            </>
          ) : (
            <text x={320} y={y + 14} textAnchor="end">found</text>
          )}
        </g>
      );
    })}
    <rect className="sp7-btn" x={256} y={148} width={66} height={20} rx={3} fill={C.primary} />
    <text x={289} y={161} textAnchor="middle" style={{ fill: "#fff" }}>Relink…</text>
  </g>
);

/* 08 · Realtime code is checked by the compiler.
   The diagnostic below is Clang's actual output for this code
   (clang++ -fsyntax-only -Wfunction-effects), not a paraphrase. */
const CODE = [
  "void render(float* out, int n)",
  "    [[clang::nonblocking]] {",
  "  for (int i = 0; i < n; ++i) out[i] *= 0.5f;",
  "  history.push_back(out[0]);",
  "}",
];
const CompilerScene = () => (
  <g>
    <rect x={24} y={14} width={312} height={164} rx={4} fill="#0b0b0b" stroke={C.border} />
    {CODE.map((line, i) => (
      <g key={i}>
        <text x={40} y={36 + i * 16} textAnchor="end">{i + 1}</text>
        <text className="t-strong" x={50} y={36 + i * 16} style={{ whiteSpace: "pre" }}>{line}</text>
      </g>
    ))}
    <path
      className="sp8-squig"
      d={`M58 ${36 + 3 * 16 + 3} ${Array.from({ length: 34 }, (_, k) => `l3 ${k % 2 ? -2 : 2}`).join(" ")}`}
      stroke={C.error}
      fill="none"
    />
    <g className="sp8-err">
      <line x1={24} x2={336} y1={112} y2={112} stroke={C.border} />
      {[
        "rt.cpp:5:3: warning: function with 'nonblocking'",
        "attribute must not call non-'nonblocking' function",
        "'std::vector<float>::push_back' [-Wfunction-effects]",
      ].map((l, i) => (
        <text key={i} x={38} y={128 + i * 12} style={{ fill: C.error, whiteSpace: "pre" }}>{l}</text>
      ))}
      <circle cx={300} cy={165} r={3} fill={C.error} />
      <text x={322} y={168} textAnchor="end" style={{ fill: C.error }}>CI</text>
    </g>
  </g>
);

const SCENES: { Draw: () => React.ReactElement; caption: string }[] = [
  { Draw: StopScene, caption: "stop → playhead at bar 1" },
  { Draw: LatencyScene, caption: "take start − (input + output latency)" },
  { Draw: LiveEditScene, caption: "edit while playing → rescheduled now" },
  { Draw: GainScene, caption: "direct = via channel · no level lost per hop" },
  { Draw: BounceScene, caption: "solo bounce = track + its send return" },
  { Draw: CycleScene, caption: "cycle refused · reroutes are undoable" },
  { Draw: RelinkScene, caption: "missing on open → named, then relinked" },
  { Draw: CompilerScene, caption: "[[clang::nonblocking]] · enforced in CI" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export const Specimen = memo(({ index, tag }: { index: number; tag: string }) => {
  const i = Math.max(0, Math.min(index, SCENES.length - 1));
  const { Draw, caption } = SCENES[i];
  return (
    <figure className="specimen" aria-hidden="true">
      <div className="specimen-bar">
        <span>Detail {pad(i + 1)} / {pad(SCENES.length)}</span>
        <span>{tag}</span>
      </div>
      <svg key={i} viewBox="0 0 360 190" className="specimen-scene">
        <Draw />
      </svg>
      <figcaption key={`c${i}`} className="specimen-cap">{caption}</figcaption>
    </figure>
  );
});
