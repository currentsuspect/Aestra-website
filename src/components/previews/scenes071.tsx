import React from "react";
import {
  D, tone, type Scene, W, H, k, ek, keys, path2, lerp, clamp, within,
  Label, Panel, PluginWindow, Button, Keycap, Cursor, Menu, Toast, Ruler, Bed, Playhead, Clip, TrackHead,
  Crop, Roll, rollX, grid, Unit, Knob, Meter, Fader, Strip, Check, Era, peaks, wavePath, type Note,
} from "./kit";

/* v0.7.1-alpha, the trust sprint. One scene per entry. */

/* Shared timeline geometry: a panel with a ruler and lanes, bars from 1. */
const TX = 20;
const TW = 560;

const TRANSIENT = "#4fb3e0";
const pct = (v: number) => `${v >= 0 ? "+" : ""}${Math.round(v * 100)}%`;

/* ── new ───────────────────────────────────────────────────────────── */

const fitToBars: Scene = {
  title: "Tempo-fit an audio clip", dur: 5.2,
  draw: (t) => {
    const g = grid(6);
    const p = ek(t, 2.6, 3.4);
    const len = lerp(3.4, 4, p);
    const menu = k(t, 1.1, 1.35) * (t < 2.5 ? 1 : 0);
    const c = path2(t, [[0, 420, 200], [0.9, 250, 120], [1.1, 250, 120], [1.8, 300, 170], [2.4, 300, 170], [3.4, 420, 205]]);
    const speed = 3.4 / len;
    const st = 12 * Math.log2(speed);
    return (
      <Panel title="Timeline">
        <Ruler x={TX} y={40} w={TW} bars={6} />
        <Bed x={TX} y={58} w={TW} h={120} bars={6} />
        <line x1={g(5)} x2={g(5)} y1={58} y2={178} stroke={D.violet} strokeOpacity={0.25 + 0.5 * k(t, 1.9, 2.4) * (1 - k(t, 3.6, 4.2))} strokeDasharray="3 3" />
        <Clip x={g(1)} y={84} w={g(1 + len) - g(1)} h={58} slot={2} label="Guitar loop" shape="keys" seed={12} cols={180} sel={t > 1 && t < 4} />
        <Menu x={250} y={128} w={170} open={menu} hover={t > 1.8 ? 2 : -1}
          items={["Split at cursor", "Speed…", { label: "Fit to 4 bars", hint: "tempo-fit" }, { label: "Delete", danger: true }]} />
        <g opacity={k(t, 3.3, 3.7)}>
          <rect x={TX} y={190} width={330} height={24} rx={3} fill={D.panel} stroke={D.border} />
          <Label x={TX + 10} y={206} size={11} color={D.t2}>Varispeed</Label>
          <Label x={TX + 78} y={206} size={11} mono color={D.t1}>{speed.toFixed(3)}×</Label>
          <Label x={TX + 150} y={206} size={11} color={D.t2}>Pitch follows tempo</Label>
          <Label x={TX + 285} y={206} size={11} mono color={D.violet}>{st.toFixed(1)} st</Label>
        </g>
        <Cursor x={c.x} y={c.y} down={within(t, 0.9, 1.2) ? k(t, 0.9, 1.2) : within(t, 2.4, 2.7) ? k(t, 2.4, 2.7) : 0} />
      </Panel>
    );
  },
};

const envelope = (x: number, y: number, w: number, h: number, a: number, s: number) => {
  const rise = 0.1 - 0.06 * a;
  const peak = 0.64 + 0.33 * a;
  const tail = clamp(0.22 + 0.3 * s, 0.04, 0.6);
  const rate = 6 - 3.5 * s;
  let d = "";
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const v = u < rise ? Math.pow(u / rise, 1.2) * peak : tail + (peak - tail) * Math.exp(-(u - rise) * rate);
    d += `${i ? "L" : "M"}${(x + u * w).toFixed(1)} ${(y + h - v * h).toFixed(1)}`;
  }
  return d;
};

const transient: Scene = {
  title: "Aestra Transient", dur: 6.2, still: 2,
  draw: (t) => {
    const a = keys(t, [[0.6, 0], [1.6, 0.45], [2.4, 0.45], [3.1, -0.5], [3.5, -0.5], [3.8, 0]]);
    const s = keys(t, [[4.2, 0], [4.9, 0.43], [5.3, 0.43], [5.9, -0.55]]);
    const c = path2(t, [[0, 300, 230], [0.5, 128, 110], [1.6, 128, 70], [2.4, 128, 70], [3.1, 128, 140], [3.8, 128, 110], [4.1, 472, 110], [4.9, 472, 72], [5.3, 472, 72], [5.9, 472, 145]]);
    const detent = Math.abs(a) < 0.001 && t > 3.8 && t < 4.3;
    return (
      <PluginWindow x={40} y={8} w={520} h={224} name="Aestra Transient" tag="Transient Shaper" accent="#5cc98a">
        <Knob cx={128} cy={100} r={44} v={a} bipolar color={TRANSIENT} label="Attack" value={pct(a)} sub="± 100%" />
        <Knob cx={472} cy={100} r={44} v={s} bipolar color={TRANSIENT} label="Sustain" value={pct(s)} sub="± 100%" />
        {detent && <circle cx={128} cy={52} r={6} fill="none" stroke="#e8eaec" strokeOpacity={1 - k(t, 3.8, 4.3)} />}
        <rect x={205} y={44} width={190} height={112} rx={6} fill="#121517" stroke="#23282b" />
        <line x1={220} x2={380} y1={126} y2={126} stroke="#23282b" />
        <line x1={244} x2={244} y1={52} y2={140} stroke="#2e3438" />
        <path d={envelope(220, 58, 160, 68, a, s)} stroke={TRANSIENT} strokeWidth={2.2} fill="none" />
        <Label x={222} y={148} size={9.5} color="#7d8288">attack</Label>
        <Label x={300} y={148} size={9.5} color="#7d8288">sustain</Label>
        <Label x={214} y={196} size={10} color="#c9ccd0">Mix</Label>
        <rect x={214} y={202} width={180} height={12} rx={3} fill="#1d4452" />
        <Label x={394} y={196} size={10} anchor="end" color={TRANSIENT}>100%</Label>
        <Cursor x={c.x} y={c.y} hand={t > 0.5 && t < 6} />
      </PluginWindow>
    );
  },
};

const pluginDropdown: Scene = {
  title: "Plugin dropdown in the mixer", dur: 5,
  draw: (t) => {
    const open = t > 1.1 && t < 3.3 ? k(t, 1.1, 1.4) : 0;
    const placed = t >= 3.3;
    const c = path2(t, [[0, 330, 220], [0.9, 176, 61], [1.1, 176, 61], [1.8, 230, 104], [2.4, 230, 104], [2.9, 230, 104], [3.8, 330, 200]]);
    const hover = t > 1.8 ? 2 : t > 1.5 ? 1 : -1;
    return (
      <Panel title="Mixer">
        <Strip x={24} y={40} h={188} name="Drums" slot={3} level={0.6 + 0.1 * Math.sin(t * 9)} inserts={["EQ"]} />
        <Strip x={100} y={40} h={188} name="Kick" slot={3} level={0.7 + 0.15 * Math.sin(t * 12)} inserts={placed ? ["Comp", "Transient"] : ["Comp"]} sel={t > 1} />
        <Strip x={176} y={40} h={188} name="Bass" slot={4} level={0.5} inserts={[]} />
        {placed && <rect x={106} y={83} width={58} height={14} rx={2} fill="none" stroke={TRANSIENT} strokeOpacity={1 - k(t, 3.3, 4.3)} />}
        <Menu x={176} y={66} w={190} open={open} hover={hover}
          items={[{ label: "AESTRA", head: true }, "EQ", "Transient", "Comp · Verb · Delay …", { label: "VST3", head: true }, { label: "Every installed VST3", hint: "▸" }, { label: "CLAP", head: true }, { label: "Every installed CLAP", hint: "▸" }]} />
        <g opacity={k(t, 1.4, 1.8) * (1 - k(t, 3.2, 3.4))}>
          <Label x={390} y={84} size={10.5} color={D.t3}>Opens where you clicked,</Label>
          <Label x={390} y={100} size={10.5} color={D.t3}>from the plugin catalog.</Label>
        </g>
        <Cursor x={c.x} y={c.y} down={within(t, 0.9, 1.2) ? k(t, 0.9, 1.2) : within(t, 2.9, 3.2) ? k(t, 2.9, 3.2) : 0} />
      </Panel>
    );
  },
};

const overview: Scene = {
  title: "Timeline overview and snapping", dur: 5.6,
  draw: (t) => {
    const show = ek(t, 0.3, 1);
    const scroll = keys(t, [[1.2, 0], [2.4, 1.6]]);
    const bars = 8;
    const g = (b: number) => TX + ((b - 1 - scroll) / bars) * TW;
    const lanes = [[1, 1, 4, "Drums", 3, "drum"], [2, 3, 7, "Bass", 4, "bass"], [3, 2, 6, "Keys", 1, "keys"], [4, 5, 9, "Vocal", 6, "vox"]] as const;
    const drag = keys(t, [[2.8, 5], [3.6, 6.37], [3.9, 6.37], [4.1, 6]]);
    const snapped = t > 4.1;
    return (
      <Panel title="Timeline">
        <g opacity={show} transform={`translate(0 ${(1 - show) * -6})`}>
          <rect x={TX} y={38} width={TW} height={16} fill="#0a0908" stroke={D.border} />
          {lanes.map(([row, a, b, , slot]) => (
            <rect key={row} x={TX + ((a - 1) / 10) * TW} y={40 + (row - 1) * 3.2} width={((b - a) / 10) * TW} height={2.4} fill={tone(slot).lane} />
          ))}
          <rect x={TX + (scroll / 10) * TW} y={38} width={(bars / 10) * TW} height={16} fill="rgba(168,141,251,.1)" stroke={D.violet} />
        </g>
        <g transform={`translate(0 ${show * 20})`}>
          <Crop x={TX} y={38} w={TW} h={160}>
            <Ruler x={TX - (scroll / bars) * TW} y={38} w={TW * 2} bars={16} />
            <Bed x={TX - (scroll / bars) * TW} y={56} w={TW * 2} h={140} bars={16} />
            {snapped && <line x1={g(6)} x2={g(6)} y1={56} y2={196} stroke={D.violet} strokeOpacity={1 - k(t, 4.1, 5)} strokeWidth={1.5} />}
            {lanes.map(([row, a, b, name, slot, shape]) => {
              const s = row === 4 && t > 2.8 ? drag : a;
              return <Clip key={row} x={g(s)} y={60 + (row - 1) * 34} w={g(s + (b - a)) - g(s)} h={30} slot={slot} label={name} shape={shape} seed={row * 5} sel={row === 4 && t > 2.8} />;
            })}
          </Crop>
        </g>
        {t > 2.6 && <Cursor x={g(drag) + 30} y={186} hand />}
        <Label x={W - 30} y={33} size={9.5} anchor="end" mono color={D.t3} opacity={show}>OVERVIEW · CROPPED TO TRACKS</Label>
      </Panel>
    );
  },
};

const boxSelect: Scene = {
  title: "Box-select on the timeline", dur: 5.2,
  draw: (t) => {
    const g = grid(12);
    const a = { x: 110, y: 62 };
    const drag = path2(t, [[0.4, 110, 62], [1.8, 300, 180]]);
    const box = t > 0.4 && t < 2.1;
    const clips = [[1, 2, 3.5, 1, "drum"], [1, 4, 5.5, 1, "drum"], [2, 1.5, 4, 4, "bass"], [2, 10, 11.5, 4, "bass"], [3, 3, 5, 6, "vox"], [3, 10.5, 12, 6, "vox"]] as const;
    const dup = ek(t, 2.9, 3.4);
    const inBox = (x0: number, x1: number, y: number) => x1 > a.x && x0 < drag.x && y + 30 > a.y && y < drag.y;
    return (
      <Panel title="Timeline">
        <Ruler x={TX} y={38} w={TW} bars={12} />
        <Bed x={TX} y={56} w={TW} h={140} bars={12} />
        {clips.map(([row, s, e, slot, shape], i) => {
          const y = 62 + (row - 1) * 40;
          const sel = t > 0.5 && inBox(g(s), g(e), y);
          return (
            <g key={i}>
              <Clip x={g(s)} y={y} w={g(e) - g(s)} h={32} slot={slot} shape={shape} seed={i} label="" sel={sel} />
              {sel && dup > 0 && <g opacity={dup}><Clip x={g(s + 5)} y={y} w={g(e) - g(s)} h={32} slot={slot} shape={shape} seed={i} sel /></g>}
            </g>
          );
        })}
        {box && <rect x={a.x} y={a.y} width={drag.x - a.x} height={drag.y - a.y} fill="rgba(168,141,251,.12)" stroke={D.violet} strokeDasharray="4 3" />}
        <Keycap x={430} y={206} label="Ctrl" on={within(t, 2.8, 3.3)} />
        <Keycap x={470} y={206} label="D" on={within(t, 2.8, 3.3)} />
        <Label x={520} y={221} size={10} color={D.t3} opacity={k(t, 2.8, 3.1)}>duplicate</Label>
        <Cursor x={drag.x} y={drag.y} />
      </Panel>
    );
  },
};

const STEPS = 16;
const pattern = (s: string) => s.split("").map((c) => c === "x");

const arsenalJump: Scene = {
  title: "Arsenal progress bar", dur: 6,
  draw: (t) => {
    const playing = t < 3.6;
    const jumpAt = 1.8;
    let pos: number;
    if (t < jumpAt) pos = t * 5.3;
    else if (t < 3.6) pos = 8 + (t - jumpAt) * 5.3;
    else pos = t < 4.6 ? 8 + (3.6 - jumpAt) * 5.3 : 12;
    pos = pos % STEPS;
    const px = 158 + (pos / STEPS) * 400;
    const c = path2(t, [[0, 300, 220], [1.5, 358, 60], [1.8, 358, 60], [4.2, 458, 60], [4.6, 458, 60], [5.4, 380, 210]]);
    return (
      <Panel title="Arsenal">
        <Label x={24} y={52} size={12} color={D.t1} weight={600}>Drums</Label>
        <Label x={24} y={66} size={9.5} color={D.t3}>{playing ? "▶ playing" : "■ stopped"}</Label>
        <rect x={158} y={48} width={400} height={20} fill="#0a0908" stroke={D.border} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={158 + i * 100} x2={158 + i * 100} y1={48} y2={68} stroke={D.borderStrong} />
            <Label x={162 + i * 100} y={62} size={9.5} color={D.t3}>{i + 1}</Label>
          </g>
        ))}
        <rect x={158} y={48} width={(pos / STEPS) * 400} height={20} fill="rgba(124,58,237,.25)" />
        <Unit x={24} y={80} w={540} name="Kick" n={1} color={tone(3).lane} steps={STEPS} on={pattern("x...x...x...x...")} playing={Math.floor(pos)} />
        <Unit x={24} y={120} w={540} name="Snare" n={2} color={tone(3).lane} steps={STEPS} on={pattern("....x.......x...")} playing={Math.floor(pos)} />
        <Unit x={24} y={160} w={540} name="Hat" n={3} color={tone(3).lane} steps={STEPS} on={pattern("x.x.x.x.x.x.x.xx")} playing={Math.floor(pos)} />
        <line x1={px} x2={px} y1={48} y2={196} stroke={D.t1} strokeWidth={1.2} />
        <Cursor x={c.x} y={c.y} down={within(t, 1.8, 2.1) ? k(t, 1.8, 2.1) : within(t, 4.6, 4.9) ? k(t, 4.6, 4.9) : 0} />
      </Panel>
    );
  },
};

const arsenalUndo: Scene = {
  title: "Undo in the Arsenal", dur: 6.4,
  draw: (t) => {
    const base = pattern("x.......x.......");
    const painted = [2, 3, 4, 5].filter((_, i) => t > 0.6 + i * 0.18);
    const undo1 = t > 2.2 && t < 3.2;
    const on = base.map((v, i) => v || (painted.includes(i) && !undo1));
    const sel = t > 3.6 ? [2, 3, 4, 5] : [];
    const moved = ek(t, 4.6, 4.9) > 0.5;
    const final = on.map((v, i) => (moved ? (i >= 2 && i <= 5 ? false : v) || (i >= 6 && i <= 9) : v));
    const c = path2(t, [[0, 300, 220], [0.5, 216, 110], [1.4, 318, 110], [2, 360, 210]]);
    return (
      <Panel title="Arsenal">
        <Unit x={24} y={50} w={540} name="Kick" n={1} color={tone(3).lane} steps={STEPS} on={pattern("x...x...x...x...")} />
        <Unit x={24} y={92} w={540} name="Perc" n={4} color={tone(2).lane} steps={STEPS} on={t > 3.6 ? final : on} sel={moved ? [6, 7, 8, 9] : sel} active />
        <g transform="translate(24 150)">
          <Keycap x={0} y={0} label="Ctrl" on={within(t, 2.2, 2.5) || within(t, 3.2, 3.5)} />
          <Keycap x={40} y={0} label="Z" on={within(t, 2.2, 2.5)} />
          <Keycap x={70} y={0} label="Y" on={within(t, 3.2, 3.5)} />
          <Keycap x={104} y={0} label="→" on={within(t, 4.5, 4.8)} />
          <Label x={150} y={15} size={11} color={D.t2}>
            {t < 2.2 ? "Paint steps" : t < 3.2 ? "Undo" : t < 3.6 ? "Redo" : t < 4.5 ? "Select steps" : "Move them with the keyboard"}
          </Label>
        </g>
        {t < 2.1 && <Cursor x={c.x} y={c.y} down={within(t, 0.5, 1.4) ? 0.3 : 0} />}
      </Panel>
    );
  },
};

const takeLanes: Scene = {
  title: "Take lanes", dur: 6.4,
  draw: (t) => {
    const g = grid(6, 190, 390);
    const warn = t > 0.4 && t < 2 ? k(t, 0.4, 0.7) * (1 - k(t, 1.7, 2)) : 0;
    const armed = t > 2.4;
    const gone = t > 3.8 && t < 5 ? 1 - k(t, 3.8, 4.1) : 1;
    const lanes = t > 5 ? 3 : t > 4.1 ? 2 : 3;
    const c = path2(t, [[0, 90, 38], [0.3, 90, 38], [2, 150, 76], [2.3, 157, 76], [3.4, 300, 160], [3.8, 300, 160], [4.4, 300, 200]]);
    return (
      <Panel title="Timeline">
        <g transform="translate(24 32)">
          <Button x={0} y={0} w={24} h={20} label="▶" size={9} />
          <Button x={28} y={0} w={24} h={20} label="■" size={9} />
          <Button x={56} y={0} w={24} h={20} label="●" size={10} on={within(t, 0.3, 0.6)} color={D.error} ink="#fff" />
        </g>
        <Toast x={120} y={30} w={290} text="Nothing is armed. Arm a track to record." kind="warn" show={warn} />
        <TrackHead x={20} y={62} w={168} h={42} n={3} name="Vocal" slot={6} arm={armed}
          extra={<Label x={44} y={98} size={8.5} mono color={D.t3}>{lanes} LANES</Label>} />
        <Bed x={190} y={62} w={390} h={150} bars={6} />
        <Clip x={g(1.5)} y={66} w={g(5) - g(1.5)} h={32} slot={6} label="Vocal" shape="vox" seed={3} />
        {[0, 1, 2].map((i) => {
          const y = 106 + i * 34;
          const isGone = i === 1;
          return (
            <g key={i} opacity={isGone ? gone : 1}>
              <rect x={20} y={y} width={168} height={32} fill="#0a0908" />
              <Label x={44} y={y + 20} size={10.5} color={D.t3}>Take {i + 1}</Label>
              <Clip x={g(1.5 + i * 0.25)} y={y + 2} w={g(4.8) - g(1.5 + i * 0.25)} h={28} slot={6} shape="vox" seed={10 + i} sel={isGone && t > 3.4 && t < 3.9} />
            </g>
          );
        })}
        <Keycap x={460} y={30} label="Del" on={within(t, 3.8, 4.1)} />
        <Keycap x={500} y={30} label="Ctrl+Z" on={within(t, 5, 5.3)} />
        <Cursor x={c.x} y={c.y} down={within(t, 0.3, 0.6) ? k(t, 0.3, 0.6) : within(t, 2.3, 2.6) ? k(t, 2.3, 2.6) : 0} />
      </Panel>
    );
  },
};

const relink: Scene = {
  title: "Relink missing files", dur: 5.4,
  draw: (t) => {
    const fixed = [t > 2.6, t > 3];
    const done = t > 3.6;
    const g = grid(6);
    const c = path2(t, [[0, 300, 230], [1.6, 420, 164], [2.2, 420, 164], [3.8, 420, 230]]);
    return (
      <g>
        <Panel title="Timeline">
          <Bed x={TX} y={40} w={TW} h={180} bars={6} />
          {[[1, 5, 6, "Vocal.wav", 60], [2, 4, 1, "Pad.wav", 110], [1.5, 6, 3, "Drums.wav", 160]].map(([s, e, slot, name, y], i) => (
            (i === 2 || fixed[i]) ? (
              <Clip key={i} x={g(s as number)} y={y as number} w={g(e as number) - g(s as number)} h={36} slot={slot as number} label={String(name).replace(".wav", "")} seed={i} shape={i === 2 ? "drum" : i === 1 ? "pad" : "vox"} />
            ) : (
              <g key={i}>
                <rect x={g(s as number)} y={y as number} width={g(e as number) - g(s as number)} height={36} fill="#1a0c0b" stroke={D.error} strokeOpacity={0.5} strokeDasharray="4 3" />
                <Label x={g(s as number) + 8} y={(y as number) + 22} size={10} color={D.error}>{name} · missing</Label>
              </g>
            )
          ))}
        </Panel>
        <g opacity={done ? 1 - k(t, 3.6, 4) : k(t, 0.2, 0.5)}>
          <rect x={150} y={60} width={300} height={130} rx={5} fill={D.panel} stroke={D.borderStrong} />
          <Label x={166} y={84} size={12} color={D.t1} weight={600}>2 audio files moved</Label>
          <Label x={166} y={100} size={10.5} color={D.t3}>Point Aestra at them and the clips come back.</Label>
          {["Vocal.wav", "Pad.wav"].map((n, i) => (
            <g key={n}>
              <Label x={166} y={126 + i * 18} size={11} mono color={fixed[i] ? D.t1 : D.error}>{n}</Label>
              {fixed[i] ? <Check x={286} y={120 + i * 18} p={k(t, 2.6 + i * 0.4, 2.9 + i * 0.4)} /> : <Label x={286} y={126 + i * 18} size={10} color={D.t3}>not found</Label>}
            </g>
          ))}
          <Button x={370} y={160} w={66} h={22} label="Relink…" on color={D.primary} ink="#fff" pressed={within(t, 2, 2.3) ? 1 : 0} />
        </g>
        <Cursor x={c.x} y={c.y} down={within(t, 2, 2.3) ? k(t, 2, 2.3) : 0} />
      </g>
    );
  },
};

const countIn: Scene = {
  title: "Count-in", dur: 5.6,
  draw: (t) => {
    const beat = 0.42;
    const start = 0.6;
    const n = Math.floor((t - start) / beat);
    const counting = t > start && n < 4;
    const rec = t > start + 4 * beat;
    const g = grid(4, 150, 420);
    const head = rec ? g(1) + ((t - start - 4 * beat) / (beat * 16)) * 420 : g(1);
    return (
      <Panel title="Transport">
        <g transform="translate(24 40)">
          <Label x={0} y={10} size={9} mono color={D.t3}>RECORD</Label>
          <Button x={0} y={18} w={76} h={22} label="● Count-in" on color="#3a2a12" ink={D.warn} />
          <Button x={80} y={18} w={50} h={22} label="Wait" />
        </g>
        <g transform="translate(24 104)">
          {[0, 1, 2, 3].map((i) => {
            const lit = counting && n === i;
            const past = t > start + (i + 1) * beat || rec;
            return (
              <g key={i}>
                <rect x={i * 28} y={0} width={24} height={24} rx={3} fill={lit ? D.warn : past ? "#3a2a12" : D.control} stroke={D.borderStrong} />
                <Label x={i * 28 + 12} y={16} size={11} anchor="middle" weight={700} color={lit ? "#100e0d" : past ? D.warn : D.t3}>{i + 1}</Label>
              </g>
            );
          })}
          <Label x={0} y={44} size={10.5} color={D.t3}>{rec ? "Recording" : counting ? "Counting you in" : "Press record"}</Label>
        </g>
        <Ruler x={150} y={40} w={420} bars={4} />
        <Bed x={150} y={58} w={420} h={150} bars={4} />
        {rec && <Clip x={g(1)} y={100} w={Math.max(2, head - g(1))} h={50} slot={0} rec label="Take 1" shape="vox" seed={4} cols={140} to={clamp((head - g(1)) / 420, 0.05, 1)} />}
        <Playhead x={head} y={40} h={168} color={rec ? D.error : D.t1} />
        {counting && <circle cx={g(1)} cy={125} r={10 + 20 * ((t - start) % beat) / beat} fill="none" stroke={D.warn} strokeOpacity={1 - ((t - start) % beat) / beat} />}
      </Panel>
    );
  },
};

const trimRemembers: Scene = {
  title: "Trim survives reopen", dur: 6,
  draw: (t) => {
    const trim = keys(t, [[0.4, 0.5], [1.4, 0.32]]);
    const db = (trim - 0.5) * 25;
    const reopen = t > 2 && t < 3.2;
    const fade = reopen ? 1 - Math.sin(k(t, 2, 3.2) * Math.PI) : 1;
    const g = grid(8, 260, 320);
    const ph = keys(t, [[3.6, 3], [6, 8.2]]);
    const dupOn = t > 3.6;
    const lit = ph > 5 && ph < 7;
    return (
      <g>
        <g opacity={fade}>
          <Panel x={8} y={8} w={236} h={224} title="Mixer · Kick">
            <Knob cx={126} cy={100} r={36} v={trim} color={D.violet} track={D.control} label="Trim" value={`${db >= 0 ? "+" : ""}${db.toFixed(1)} dB`} labelColor={D.t2} />
            <Label x={30} y={214} size={9.5} color={D.t3}>Pan and width are kept too</Label>
          </Panel>
          <Panel x={252} y={8} w={340} h={224} title="Timeline">
            <Bed x={260} y={40} w={320} h={150} bars={8} />
            <Clip x={g(1)} y={80} w={g(5) - g(1)} h={40} slot={1} label="Pattern 1" notes={[[0, 0.1, 1], [0.25, 0.1, 3], [0.5, 0.1, 2], [0.75, 0.1, 4]]} />
            {dupOn && <g opacity={ek(t, 3.6, 3.9)}><Clip x={g(5)} y={80} w={g(9) - g(5)} h={40} slot={1} label="Pattern 1" sel={lit} notes={[[0, 0.1, 1], [0.25, 0.1, 3], [0.5, 0.1, 2], [0.75, 0.1, 4]]} /></g>}
            {t > 3.6 && <Playhead x={g(ph)} y={40} h={150} />}
            {lit && <Label x={g(5) + 6} y={140} size={10} color={D.meter}>plays on the first pass</Label>}
          </Panel>
        </g>
        {reopen && <Label x={W / 2} y={H / 2} size={12} anchor="middle" mono color={D.t2} opacity={1 - fade}>SAVE · CLOSE · REOPEN</Label>}
      </g>
    );
  },
};

const rightClickDelete: Scene = {
  title: "Right-click delete, drop into Arsenal", dur: 5.6,
  draw: (t) => {
    const g = grid(6, 20, 300);
    const gone = k(t, 1.1, 1.3);
    const drag = path2(t, [[2.2, 380, 60], [3.4, 430, 150]]);
    const dropped = t > 3.5;
    const c = t < 2 ? path2(t, [[0, 200, 220], [0.8, 130, 100], [2, 200, 200]]) : drag;
    return (
      <g>
        <Panel x={8} y={8} w={320} h={224} title="Timeline">
          <Bed x={20} y={40} w={300} h={180} bars={6} />
          <Clip x={g(1)} y={60} w={g(3) - g(1)} h={34} slot={3} label="Kick" shape="drum" seed={2} />
          <g opacity={1 - gone} transform={`translate(${g(3.5)} 94) scale(${1 - gone * 0.1}) translate(${-g(3.5)} -94)`}>
            <Clip x={g(2)} y={100} w={g(5) - g(2)} h={34} slot={4} label="Bass" shape="bass" seed={5} sel={t > 0.8} />
          </g>
          <Clip x={g(3)} y={140} w={g(6) - g(3)} h={34} slot={6} label="Vocal" shape="vox" seed={8} />
        </Panel>
        <Panel x={336} y={8} w={256} h={224} title="Arsenal">
          <rect x={346} y={42} width={236} height={24} fill={D.panel} stroke={D.border} />
          <Label x={354} y={58} size={10.5} color={D.t2}>Kick.wav</Label>
          {!dropped && (
            <g>
              <rect x={350} y={110} width={228} height={80} rx={4} fill="none" stroke={t > 2.4 ? D.violet : D.border} strokeDasharray="5 4" />
              <Label x={464} y={154} size={11} anchor="middle" color={D.t3}>Empty · drop a sample</Label>
            </g>
          )}
          {dropped && <g opacity={ek(t, 3.5, 3.8)}><Unit x={346} y={110} w={236} name="Kick" n={1} color={tone(3).lane} steps={8} on={pattern("x...x...")} active /></g>}
        </Panel>
        {t > 2.2 && t < 3.5 && (
          <g opacity={0.9}>
            <rect x={drag.x + 10} y={drag.y + 10} width={80} height={20} rx={3} fill={D.raised} stroke={D.violet} />
            <Label x={drag.x + 18} y={drag.y + 24} size={10} color={D.t1}>Kick.wav</Label>
          </g>
        )}
        <Cursor x={c.x} y={c.y} down={within(t, 0.8, 1.1) ? k(t, 0.8, 1.1) : 0} />
        {within(t, 0.8, 1.2) && <Label x={140} y={96} size={9.5} mono color={D.t2}>RIGHT-CLICK</Label>}
      </g>
    );
  },
};

/* ── fix ───────────────────────────────────────────────────────────── */

const rescheduleLive: Scene = {
  title: "Edits while playing", dur: 5.6,
  draw: (t) => {
    const g = grid(8, 150, 400);
    const ph = 1 + ((t * 1.3) % 8);
    const muted = t > 1.6;
    const split = t > 3.4;
    const lvl = (on: boolean, s: number) => (on ? 0.55 + 0.25 * Math.abs(Math.sin(t * 7 + s)) : 0);
    const c = path2(t, [[0, 300, 220], [1.3, 124, 128], [1.6, 124, 128], [2.8, 300, 60], [3.4, 300, 60]]);
    return (
      <Panel title="Timeline">
        <Ruler x={150} y={38} w={400} bars={8} />
        <Bed x={150} y={56} w={400} h={150} bars={8} />
        {[["Drums", 3, "drum"], ["Bass", 4, "bass"], ["Keys", 1, "keys"]].map(([name, slot, shape], i) => {
          const y = 60 + i * 48;
          const isMuted = i === 1 && muted;
          return (
            <g key={i}>
              <TrackHead x={20} y={y} w={128} h={44} n={i + 1} name={name as string} slot={slot as number} mute={isMuted} />
              {i === 0 && split ? (
                <g>
                  <Clip x={g(1)} y={y + 4} w={g(3.5) - g(1) - 1} h={36} slot={3} shape="drum" seed={1} cols={120} to={0.31} />
                  <Clip x={g(3.5) + 1} y={y + 4} w={g(9) - g(3.5) - 1} h={36} slot={3} shape="drum" seed={1} cols={120} from={0.31} />
                </g>
              ) : (
                <Clip x={g(1)} y={y + 4} w={g(9) - g(1)} h={36} slot={slot as number} shape={shape as "drum"} seed={i + 1} cols={120} dim={isMuted ? 1 : 0} />
              )}
              <Meter x={560} y={y + 6} h={32} level={lvl(!isMuted, i)} w={6} />
            </g>
          );
        })}
        {split && <line x1={g(3.5)} x2={g(3.5)} y1={56} y2={110} stroke={D.t1} strokeOpacity={1 - k(t, 3.4, 4.2)} strokeWidth={2} />}
        <Playhead x={g(ph)} y={38} h={168} />
        <Keycap x={24} y={210} label="S" on={within(t, 3.3, 3.6)} />
        <Label x={56} y={225} size={10} color={D.t3}>Heard on the very next beat, not the next loop.</Label>
        <Cursor x={c.x} y={c.y} down={within(t, 1.6, 1.9) ? k(t, 1.6, 1.9) : 0} />
      </Panel>
    );
  },
};

const stopOnce: Scene = {
  title: "Stop returns to the top", dur: 4.4,
  draw: (t) => {
    const g = grid(8, 20, 560);
    const stopAt = 2;
    const ph = t < stopAt ? 5 + t * 0.9 : 1;
    const bar = Math.floor(ph);
    const beat = Math.floor((ph - bar) * 4) + 1;
    return (
      <Panel title="Timeline">
        <g transform="translate(20 34)">
          <Button x={0} y={0} w={30} h={26} label="▶" size={11} on={t < stopAt} color={D.meter} ink="#100e0d" />
          <Button x={34} y={0} w={30} h={26} label="■" size={11} pressed={within(t, stopAt, stopAt + 0.2) ? 1 : 0} />
          <Label x={80} y={9} size={9} mono color={D.t3}>POSITION</Label>
          <Label x={80} y={27} size={18} weight={600} mono color={D.t1}>{`${bar}.${beat}.1`}</Label>
        </g>
        <Keycap x={500} y={36} label="Stop" on={within(t, stopAt, stopAt + 0.25)} />
        <Ruler x={20} y={72} w={560} bars={8} />
        <Bed x={20} y={90} w={560} h={120} bars={8} />
        <Clip x={g(1)} y={100} w={g(9) - g(1)} h={40} slot={4} label="Bass" shape="bass" seed={3} cols={200} />
        <Clip x={g(3)} y={150} w={g(9) - g(3)} h={40} slot={1} label="Keys" shape="keys" seed={6} cols={160} />
        <Playhead x={g(ph)} y={72} h={138} />
        <Label x={300} y={228} size={10.5} anchor="middle" color={D.t3} opacity={k(t, stopAt, stopAt + 0.3)}>One press. Back to 1.1.1.</Label>
      </Panel>
    );
  },
};

const takesOnGrid: Scene = {
  title: "Takes land on the grid", dur: 5,
  draw: (t) => {
    const g = grid(4, 150, 420);
    const late = 14 * (1 - ek(t, 2.2, 3));
    const hits = (x0: number, y: number, h: number, color: string) =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = x0 + g(1 + i * 0.5) - g(1);
        return <path key={i} d={wavePath(peaks(24, i + 1, "hit"), x, y, 36, h)} fill={color} />;
      });
    return (
      <Panel title="Timeline">
        <Era now={t > 2.2} />
        <Ruler x={150} y={38} w={420} bars={4} />
        <Bed x={150} y={56} w={420} h={150} bars={4} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={g(1 + i * 0.5)} x2={g(1 + i * 0.5)} y1={56} y2={206} stroke={D.violet} strokeOpacity={0.25} />)}
        <TrackHead x={20} y={64} w={128} h={50} n={1} name="Click" slot={7} />
        <TrackHead x={20} y={124} w={128} h={50} n={2} name="Drums" slot={3} arm />
        <rect x={g(1)} y={68} width={420} height={42} fill={tone(7).body} />
        {hits(g(1), 70, 38, tone(7).ink)}
        <rect x={g(1) + late} y={128} width={420 - late} height={42} fill="#5c1a1d" />
        {hits(g(1) + late, 130, 38, "#ff8a7a")}
        <Label x={150} y={225} size={10.5} color={t > 2.2 ? D.meter : D.warn}>
          {t > 2.2 ? "Interface latency compensated: the take sits on the beat." : "The take lands late by your interface's latency."}
        </Label>
      </Panel>
    );
  },
};

const waveOnDrop: Scene = {
  title: "Waveforms on drop", dur: 5.4,
  draw: (t) => {
    const g = grid(6, 150, 420);
    const now = t > 2.7;
    const tt = now ? t - 2.7 : t;
    const drag = path2(tt, [[0.2, 70, 80], [1.1, 250, 120]]);
    const dropped = tt > 1.2;
    const touched = !now && tt > 2.3;
    return (
      <g>
        <Panel title="Timeline">
          <Era now={now} />
          <rect x={20} y={40} width={124} height={170} fill={D.panel} stroke={D.border} />
          {["Pad.wav", "Vocal.wav", "Snare.wav"].map((f, i) => <Label key={f} x={30} y={62 + i * 22} size={10.5} color={i === 1 ? D.t1 : D.t2}>{f}</Label>)}
          <Bed x={150} y={40} w={420} h={170} bars={6} />
          <Clip x={g(1)} y={60} w={g(4) - g(1)} h={40} slot={1} label="Pad" shape="pad" seed={2} />
          {dropped && (now || touched ? (
            <Clip x={g(2.5)} y={110} w={g(6) - g(2.5)} h={40} slot={6} label="Vocal" shape="vox" seed={7} />
          ) : (
            <g>
              <rect x={g(2.5)} y={110} width={g(6) - g(2.5)} height={40} fill={tone(6).body} />
              <Label x={g(2.5) + 15} y={121} size={9.5} weight={600} color={tone(6).label}>Vocal</Label>
            </g>
          ))}
          {!dropped && tt > 0.2 && (
            <g>
              <rect x={drag.x + 8} y={drag.y + 8} width={78} height={20} rx={3} fill={D.raised} stroke={D.violet} />
              <Label x={drag.x + 16} y={drag.y + 22} size={10} color={D.t1}>Vocal.wav</Label>
            </g>
          )}
          <Cursor x={dropped ? 250 : drag.x} y={dropped ? 120 : drag.y} />
        </Panel>
      </g>
    );
  },
};

const loopRecord: Scene = {
  title: "Recording over a loop", dur: 5.4,
  draw: (t) => {
    const g = grid(6, 150, 420);
    const a = 2;
    const b = 4;
    const speed = 1.2;
    const elapsed = Math.max(0, t - 0.5) * speed;
    const pass = Math.floor(elapsed / (b - a));
    const ph = a + (elapsed % (b - a));
    return (
      <Panel title="Timeline">
        <Ruler x={150} y={38} w={420} bars={6} />
        <rect x={g(a)} y={38} width={g(b) - g(a)} height={8} fill={D.primary} opacity={0.8} />
        <Bed x={150} y={56} w={420} h={150} bars={6} />
        <rect x={g(a)} y={56} width={g(b) - g(a)} height={150} fill="rgba(124,58,237,.06)" />
        <TrackHead x={20} y={60} w={128} h={44} n={1} name="Drums" slot={3} />
        <TrackHead x={20} y={108} w={128} h={44} n={2} name="Keys" slot={1} />
        <TrackHead x={20} y={156} w={128} h={44} n={3} name="Vocal" slot={6} arm />
        <Clip x={g(1)} y={64} w={g(7) - g(1)} h={36} slot={3} shape="drum" seed={2} cols={160} />
        <Clip x={g(1)} y={112} w={g(7) - g(1)} h={36} slot={1} notes={[[0.05, 0.1, 2], [0.3, 0.12, 4], [0.55, 0.1, 1], [0.8, 0.1, 3]]} />
        {t > 0.5 && (
          <Clip x={g(a)} y={160} w={Math.max(2, g(pass > 0 ? b : ph) - g(a))} h={36} slot={0} rec label={`Take ${pass + 1}`} shape="vox" seed={9 + pass} cols={90} to={pass > 0 ? 1 : clamp((ph - a) / (b - a), 0.05, 1)} />
        )}
        <Playhead x={g(t > 0.5 ? ph : a)} y={38} h={168} color={D.error} />
        <Label x={150} y={225} size={10.5} color={D.t3}>Loop region on, clips and patterns playing: the take still records.</Label>
      </Panel>
    );
  },
};

const marqueeSmooth: Scene = {
  title: "Selection box follows your hand", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const tt = now ? t - 2.8 : t;
    const c = path2(tt, [[0.2, 120, 70], [0.9, 330, 150], [1.5, 260, 190], [2.2, 470, 180]]);
    const lagged = path2(tt - 0.35, [[0.2, 120, 70], [0.9, 330, 150], [1.5, 260, 190], [2.2, 470, 180]]);
    const e = now ? c : lagged;
    const g = grid(8);
    return (
      <Panel title="Timeline">
        <Era now={now} />
        <Bed x={TX} y={40} w={TW} h={180} bars={8} />
        {[[1.5, 3.5, 60, 1], [4, 6, 60, 4], [2.5, 5, 110, 6], [5.5, 8, 110, 2], [1, 4, 160, 3], [6, 8.5, 160, 5]].map(([s, e2, y, slot], i) => {
          const sel = tt > 0.2 && g(e2) > 120 && g(s) < e.x && y + 30 > 70 && y < e.y;
          return <Clip key={i} x={g(s)} y={y} w={g(e2) - g(s)} h={32} slot={slot} seed={i} shape="vox" sel={sel} />;
        })}
        {tt > 0.2 && tt < 2.4 && <rect x={120} y={70} width={Math.max(0, e.x - 120)} height={Math.max(0, e.y - 70)} fill="rgba(168,141,251,.12)" stroke={D.violet} strokeDasharray="4 3" />}
        <Cursor x={c.x} y={c.y} />
      </Panel>
    );
  },
};

const rollPan: Scene = {
  title: "Note pan and the piano-roll playhead", dur: 5.4,
  draw: (t) => {
    const notes: Note[] = [
      { s: 0, l: 1, p: 7, label: "G1" }, { s: 1, l: 1, p: 9, label: "A1", sel: true }, { s: 2, l: 1.5, p: 5, label: "F1" }, { s: 3.5, l: 0.5, p: 7, label: "G1" },
    ];
    const pan = keys(t, [[0.8, 0], [1.8, -0.4]]);
    const ph = 0.2 + ((t * 0.9) % 4);
    const px = rollX(20, 400, 4)(ph);
    return (
      <Panel title="Piano Roll">
        <Roll x={20} y={40} w={400} h={180} rows={12} beats={4} notes={notes} rowNames={{ 7: "G1", 9: "A1", 5: "F1" }} />
        <Playhead x={px} y={40} h={180} />
        <rect x={428} y={40} width={156} height={180} fill={D.panel} stroke={D.border} />
        <Label x={440} y={60} size={9.5} mono color={D.t3}>NOTE · A1</Label>
        <Label x={440} y={88} size={10.5} color={D.t2}>Pan</Label>
        <rect x={440} y={96} width={132} height={6} rx={3} fill={D.control} />
        <line x1={506} x2={506} y1={92} y2={106} stroke={D.t3} />
        <rect x={Math.min(506, 506 + pan * 66)} y={96} width={Math.abs(pan * 66)} height={6} fill={D.violet} />
        <circle cx={506 + pan * 66} cy={99} r={6} fill={D.t1} />
        <Label x={572} y={124} size={11} anchor="end" mono color={D.t1}>{pan < -0.005 ? `L ${Math.round(-pan * 100)}` : "C"}</Label>
        <Label x={440} y={150} size={10} color={D.t3} opacity={k(t, 2, 2.4)}>Kept on the note,</Label>
        <Label x={440} y={164} size={10} color={D.t3} opacity={k(t, 2, 2.4)}>heard on the next pass.</Label>
        {t > 2.2 && <Check x={440} y={190} p={k(t, 2.2, 2.6)} />}
        <Cursor x={506 + pan * 66} y={104} hand={t > 0.6 && t < 2} />
      </Panel>
    );
  },
};

const stepDelete: Scene = {
  title: "Step edits while the loop plays", dur: 6,
  draw: (t) => {
    const pos = (t * 4.2) % STEPS;
    const i = Math.floor(pos);
    const removed = t > 0.8;
    const added = t > 2.2;
    const on = pattern("x...x...x...x...").map((v, s) => (s === 8 && removed ? false : v) || (s === 14 && added));
    const hit = on[i] ? [i] : [];
    const c = path2(t, [[0, 300, 220], [0.6, 158 + 8.5 * 25.5, 106], [1.8, 158 + 14.5 * 25.5, 106], [2.6, 300, 220]]);
    return (
      <Panel title="Arsenal">
        <Unit x={24} y={60} w={540} name="Kick" n={1} color={tone(3).lane} steps={STEPS} on={pattern("x.......x.......")} playing={i} hit={pattern("x.......x.......")[i] ? [i] : []} />
        <Unit x={24} y={100} w={540} name="Clap" n={2} color={tone(6).lane} steps={STEPS} on={on} playing={i} hit={hit} active />
        <g transform="translate(24 160)">
          <circle cx={10} cy={10} r={4 + (hit.length ? 5 : 0)} fill={hit.length ? D.meter : D.control} />
          <Label x={26} y={14} size={10.5} color={D.t2}>Clap sounds only on the steps that are there</Label>
        </g>
        <Label x={24} y={206} size={10} color={D.t3}>
          {t < 2 ? "Delete a step: it's silent from the next pass" : "Place a step: it waits for the playhead"}
        </Label>
        {t < 2.6 && <Cursor x={c.x} y={c.y} down={within(t, 0.8, 1.1) ? k(t, 0.8, 1.1) : within(t, 2.2, 2.5) ? k(t, 2.2, 2.5) : 0} />}
      </Panel>
    );
  },
};

const armFresh: Scene = {
  title: "Record-arm on a new project", dur: 4.4,
  draw: (t) => {
    const armed = t > 1.6;
    const c = path2(t, [[0, 300, 220], [1.3, 174, 90], [1.6, 174, 90], [2.4, 300, 210]]);
    return (
      <Panel title="Untitled · new project">
        <TrackHead x={20} y={70} w={200} h={40} n={1} name="Audio 1" slot={0} arm={armed} />
        <Bed x={222} y={70} w={358} h={40} bars={4} />
        <TrackHead x={20} y={112} w={200} h={40} n={2} name="Audio 2" slot={1} />
        <Bed x={222} y={112} w={358} h={40} bars={4} />
        <Label x={20} y={190} size={10.5} color={D.t3} opacity={k(t, 1.7, 2)}>Armed on the first click. No setup first.</Label>
        <Cursor x={c.x} y={c.y} down={within(t, 1.6, 1.9) ? k(t, 1.6, 1.9) : 0} />
      </Panel>
    );
  },
};

const monitorUndo: Scene = {
  title: "Input monitoring is a project change", dur: 5,
  draw: (t) => {
    const on = t > 1.2 && t < 3.2;
    const dirty = t > 1.2 && t < 3.2;
    const c = path2(t, [[0, 300, 220], [1, 132, 207], [1.2, 132, 207], [2, 300, 150]]);
    return (
      <g>
        <rect x={0} y={0} width={W} height={26} fill={D.panel} />
        <Label x={W / 2 - 40} y={17} size={11} color={D.t1}>Night Drive</Label>
        <circle cx={W / 2 + 34} cy={13} r={3.5} fill={dirty ? D.warn : D.success} />
        <Label x={W / 2 + 42} y={17} size={10.5} color={D.t2}>{dirty ? "Unsaved" : "Saved"}</Label>
        <Strip x={60} y={36} h={196} name="Guitar" slot={2} level={on ? 0.55 + 0.1 * Math.sin(t * 10) : 0}>
          <Button x={66} y={198} w={26} h={16} size={8.5} label="IN" on={on} color={D.meter} ink="#100e0d" />
        </Strip>
        <g transform="translate(200 80)">
          <Keycap x={0} y={0} label="Ctrl" on={within(t, 3.1, 3.4)} />
          <Keycap x={40} y={0} label="Z" on={within(t, 3.1, 3.4)} />
          <Label x={80} y={15} size={11} color={D.t2}>{t < 3.1 ? "Monitoring on marks the project changed" : "Undo turns it back off"}</Label>
          <Label x={0} y={50} size={10.5} color={D.t3}>And it's still on after you close and reopen.</Label>
        </g>
        <Cursor x={c.x} y={c.y} down={within(t, 1.2, 1.5) ? k(t, 1.2, 1.5) : 0} />
      </g>
    );
  },
};

const fadersWork: Scene = {
  title: "Faders and pans change the sound", dur: 5.6,
  draw: (t) => {
    const v = keys(t, [[0.5, 0.75], [1.8, 0.25], [2.6, 0.62]]);
    const pan = keys(t, [[3.2, 0], [4.4, 0.7]]);
    const base = (0.7 + 0.12 * Math.sin(t * 11)) * (v / 0.75);
    const l = base * Math.min(1, 1 - pan * 0.8);
    const r = base * Math.min(1, 1 + pan * 0.2);
    const c = t < 3 ? { x: 110, y: 126 + (1 - v) * 90 } : { x: 360, y: 96 };
    return (
      <Panel title="Mixer">
        <rect x={60} y={40} width={100} height={188} fill={D.panel} stroke={D.border} />
        <Label x={110} y={58} size={11} anchor="middle" color={D.t1}>Keys</Label>
        <Fader x={96} y={80} h={130} v={v} />
        <Meter x={128} y={80} h={130} level={l} w={6} />
        <Meter x={138} y={80} h={130} level={r} w={6} />
        <Label x={131} y={222} size={9} mono color={D.t3} anchor="middle">L  R</Label>
        <Knob cx={360} cy={96} r={34} v={pan} bipolar color={D.violet} track={D.control} label="Pan" value={pan < 0.01 ? "C" : `R ${Math.round(pan * 100)}`} labelColor={D.t2} />
        <Label x={250} y={200} size={11} color={D.t2}>The meters follow what you move, because the sound does.</Label>
        <Cursor x={c.x} y={c.y} hand />
      </Panel>
    );
  },
};

const pauseResumes: Scene = {
  title: "Pause picks up where it stopped", dur: 5.4,
  draw: (t) => {
    const pauseAt = 2;
    const resume = 3.2;
    const pos = t < pauseAt ? t * 4.5 : t < resume ? pauseAt * 4.5 : pauseAt * 4.5 + (t - resume) * 4.5;
    const i = Math.floor(pos) % STEPS;
    const paused = t >= pauseAt && t < resume;
    return (
      <Panel title="Arsenal">
        <g transform="translate(24 38)">
          <Button x={0} y={0} w={34} h={24} label={paused ? "▶" : "❚❚"} size={10} on={!paused} color={D.meter} ink="#100e0d" pressed={within(t, pauseAt, pauseAt + 0.2) || within(t, resume, resume + 0.2) ? 1 : 0} />
          <Label x={46} y={16} size={12} mono color={D.t1}>{`step ${String(i + 1).padStart(2, "0")} / 16`}</Label>
          <Label x={170} y={16} size={10.5} color={D.t3}>{paused ? "Paused" : t > resume ? "Resumed from here, not from 1" : "Playing"}</Label>
        </g>
        <Unit x={24} y={80} w={540} name="Kick" n={1} color={tone(3).lane} steps={STEPS} on={pattern("x...x...x...x...")} playing={i} />
        <Unit x={24} y={120} w={540} name="Hat" n={2} color={tone(3).lane} steps={STEPS} on={pattern("..x...x...x...x.")} playing={i} />
        <line x1={152 + (pos % STEPS) / STEPS * 406} x2={152 + (pos % STEPS) / STEPS * 406} y1={76} y2={160} stroke={D.t1} />
        {paused && <line x1={152 + (pos % STEPS) / STEPS * 406} x2={152 + (pos % STEPS) / STEPS * 406} y1={76} y2={160} stroke={D.warn} strokeWidth={3} strokeOpacity={0.3 + 0.3 * Math.sin(t * 8)} />}
      </Panel>
    );
  },
};

const slicedPatterns: Scene = {
  title: "Sliced patterns", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const cut = ek(now ? t - 2.8 : t, 0.6, 1.1);
    const g = grid(8);
    const notes: [number, number, number][] = [[0.02, 0.08, 1], [0.15, 0.08, 4], [0.3, 0.1, 2], [0.45, 0.08, 5], [0.58, 0.1, 3], [0.72, 0.08, 1], [0.86, 0.1, 4]];
    const left = notes.filter(([s]) => s < 0.5).map(([s, l, r]) => [s * 2, l * 2, r] as [number, number, number]);
    const right = (now ? notes.filter(([s]) => s >= 0.5).map(([s, l, r]) => [(s - 0.5) * 2, l * 2, r]) : notes.slice(0, 4).map(([s, l, r]) => [s * 2, l * 2, r])) as [number, number, number][];
    return (
      <Panel title="Timeline">
        <Era now={now} />
        <Ruler x={TX} y={38} w={TW} bars={8} />
        <Bed x={TX} y={56} w={TW} h={120} bars={8} />
        {cut < 1 ? (
          <Clip x={g(1)} y={80} w={g(9) - g(1)} h={60} slot={7} label="Pattern 2" notes={notes} />
        ) : (
          <g>
            <Clip x={g(1)} y={80} w={g(5) - g(1) - 2} h={60} slot={7} label="Pattern 2" notes={left} />
            <Clip x={g(5) + 2} y={80} w={g(9) - g(5) - 2} h={60} slot={7} label="Pattern 2" notes={right} />
            {!now && <rect x={g(5) + 2} y={80} width={g(9) - g(5) - 2} height={60} fill="none" stroke={D.warn} strokeDasharray="4 3" />}
          </g>
        )}
        <line x1={g(5)} x2={g(5)} y1={70} y2={150} stroke={D.t1} strokeOpacity={cut > 0 && cut < 1 ? 1 : 0} strokeWidth={2} />
        <Label x={TX} y={200} size={11} color={now ? D.meter : D.warn}>
          {now ? "Each half holds exactly what plays there." : "The right half replays from the pattern's start, with ghost notes."}
        </Label>
      </Panel>
    );
  },
};

const recoveryNoDoubles: Scene = {
  title: "Recovery keeps your tracks", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const tt = now ? t - 2.8 : t;
    const restored = tt > 1.1;
    const names = ["Drums", "Bass", "Keys", "Pad", "Vocal"];
    const list = restored ? (now ? names : [...names, ...names]) : [];
    return (
      <g>
        <Panel title="Tracks">
          <Era now={now} />
          {list.map((n, i) => (
            <TrackHead key={i} x={20} y={38 + i * 19} w={200} h={18} n={i + 1} name={n} slot={i % 5} />
          ))}
          {restored && (
            <Label x={240} y={60} size={12} color={now ? D.meter : D.warn} weight={600}>{now ? `${list.length} tracks, as you left them` : `${list.length} tracks: every one twice`}</Label>
          )}
          {restored && <Label x={240} y={80} size={10.5} color={D.t3}>{now ? "No ghost automation on channel 1 either." : "Plus leftover demo automation on channel 1."}</Label>}
        </Panel>
        {!restored && (
          <g opacity={k(tt, 0.1, 0.3)}>
            <rect x={160} y={70} width={280} height={100} rx={5} fill={D.panel} stroke={D.borderStrong} />
            <Label x={176} y={96} size={12} weight={600} color={D.t1}>Recover unsaved work?</Label>
            <Label x={176} y={114} size={10.5} color={D.t3}>Aestra closed before you saved.</Label>
            <Button x={346} y={136} w={80} h={22} label="Restore" on ink="#fff" pressed={within(tt, 0.8, 1.1) ? 1 : 0} />
            <Button x={270} y={136} w={70} h={22} label="Later" />
          </g>
        )}
      </g>
    );
  },
};

const quieterGrid: Scene = {
  title: "Quieter grid, clearer search", dur: 5,
  draw: (t) => {
    const now = t > 2.5;
    const notes: Note[] = [{ s: 0, l: 1, p: 8, label: "G#" }, { s: 1, l: 0.5, p: 5 }, { s: 1.5, l: 1, p: 10, label: "A#" }, { s: 2.5, l: 1.5, p: 3, label: "D#" }];
    return (
      <g>
        <Panel x={8} y={8} w={200} h={224} title="Library">
          {now ? (
            <g>
              <rect x={18} y={40} width={180} height={28} rx={4} fill={D.control} stroke={D.borderStrong} />
              <circle cx={32} cy={53} r={4.5} fill="none" stroke={D.t3} strokeWidth={1.4} />
              <line x1={35.5} y1={56.5} x2={39} y2={60} stroke={D.t3} strokeWidth={1.4} />
              <Label x={46} y={58} size={11} color={D.t3}>Search library…</Label>
            </g>
          ) : (
            <g>
              <rect x={18} y={42} width={180} height={18} rx={3} fill={D.control} stroke={D.borderStrong} />
              <Label x={24} y={55} size={9.5} color={D.t4}>Search</Label>
            </g>
          )}
          {["Drum Loop.wav", "Noise.wav", "Pad.wav", "Vocal.wav"].map((f, i) => <Label key={f} x={24} y={96 + i * 22} size={10.5} color={D.t2}>{f}</Label>)}
        </Panel>
        <Panel x={216} y={8} w={376} h={224} title="Piano Roll" right={<Era x={560} y={20} now={now} />}>
          <Roll x={224} y={40} w={360} h={184} rows={12} beats={4} notes={notes} quiet={now} />
        </Panel>
      </g>
    );
  },
};

const cheapLiveWave: Scene = {
  title: "Live input waveform", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const tt = now ? t - 2.8 : t;
    const len = clamp(tt / 2.6);
    const g = grid(4, 20, 560);
    const frame = (i: number) => {
      const x = i / 60;
      if (x > len) return null;
      return now ? 0.12 + 0.03 * Math.sin(i * 1.7) : 0.15 + x * 0.7 + 0.1 * Math.abs(Math.sin(i * 2.3));
    };
    let d = "";
    for (let i = 0; i <= 60; i++) {
      const v = frame(i);
      if (v === null) break;
      d += `${i ? "L" : "M"}${20 + (i / 60) * 560} ${226 - v * 50}`;
    }
    return (
      <Panel title="Recording">
        <Era now={now} />
        <Bed x={20} y={40} w={560} h={90} bars={4} />
        <Clip x={g(1)} y={50} w={Math.max(2, len * 560)} h={70} slot={0} rec label="Take 1" shape="vox" seed={21} cols={200} to={Math.max(0.02, len)} />
        <Playhead x={g(1) + len * 560} y={40} h={90} color={D.error} />
        <rect x={20} y={170} width={560} height={58} fill={D.panel} stroke={D.border} />
        <Label x={28} y={184} size={9} mono color={D.t3}>UI FRAME COST WHILE RECORDING</Label>
        <path d={d} stroke={now ? D.meter : D.warn} strokeWidth={1.8} fill="none" />
      </Panel>
    );
  },
};

export const V071: Record<string, Scene> = {
  "v0.7.1-alpha:fit-an-audio-clip-to-n": fitToBars,
  "v0.7.1-alpha:aestra-transient-an-internal-envelope-shaper": transient,
  "v0.7.1-alpha:the-mixers-plugin-dropdown-now-shows": pluginDropdown,
  "v0.7.1-alpha:your-timeline-overview-is-back-above": overview,
  "v0.7.1-alpha:drag-a-box-around-any-group": boxSelect,
  "v0.7.1-alpha:you-can-now-click-anywhere-on": arsenalJump,
  "v0.7.1-alpha:ctrlz-now-works-on-arsenal-step": arsenalUndo,
  "v0.7.1-alpha:takes-live-in-lanes-that-belong": takeLanes,
  "v0.7.1-alpha:opening-a-project-with-moved-audio": relink,
  "v0.7.1-alpha:count-in-now-actually-counts-you": countIn,
  "v0.7.1-alpha:mixer-trim-now-remembers-where-you": trimRemembers,
  "v0.7.1-alpha:right-click-a-clip-to-delete": rightClickDelete,
  "v0.7.1-alpha:splitting-clips-or-mutingunmuting-lanes-while": rescheduleLive,
  "v0.7.1-alpha:pressing-stop-once-now-returns-the": stopOnce,
  "v0.7.1-alpha:recorded-takes-now-land-on-the": takesOnGrid,
  "v0.7.1-alpha:clips-dropped-into-the-timeline-now": waveOnDrop,
  "v0.7.1-alpha:recording-inside-a-project-that-already": loopRecord,
  "v0.7.1-alpha:dragging-a-selection-box-on-the": marqueeSmooth,
  "v0.7.1-alpha:panning-notes-from-the-piano-roll": rollPan,
  "v0.7.1-alpha:deleting-a-step-while-the-loop": stepDelete,
  "v0.7.1-alpha:record-arm-now-works-on-a": armFresh,
  "v0.7.1-alpha:toggling-input-monitoring-on-a-mixer": monitorUndo,
  "v0.7.1-alpha:channel-faders-and-pans-now-actually": fadersWork,
  "v0.7.1-alpha:pause-in-the-arsenal-no-longer": pauseResumes,
  "v0.7.1-alpha:sliced-patterns-no-longer-show-ghost": slicedPatterns,
  "v0.7.1-alpha:recovery-no-longer-doubles-your-tracks": recoveryNoDoubles,
  "v0.7.1-alpha:the-piano-roll-grid-is-quieter": quieterGrid,
  "v0.7.1-alpha:the-red-live-input-waveform-while": cheapLiveWave,
};

