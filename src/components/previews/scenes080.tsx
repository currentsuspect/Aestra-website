import React from "react";
import {
  D, tone, type Scene, k, ek, keys, path2, lerp, clamp, within,
  Label, Panel, Keycap, Cursor, Menu, Ruler, Bed, Clip, TrackHead, grid, menuRowY, Meter, Check, Era, Caption,
  Roll, rollX, Playhead, type Note,
} from "./kit";

/* v0.8.0-alpha: automation, clips and export. One scene per entry. These are drawn from the shipped
   behaviour in the release notes, not recorded from the app. */

const TX = 20;
const TW = 560;
const ACCENT = "#a88dfb";

/* An automation lane: bars 1..bars across (x, w), value 0..1 down from the top of (y, h). */
type Pt = { b: number; v: number };
const laneXY = (p: Pt, bars: number, x: number, w: number, y: number, h: number) => ({
  x: x + ((p.b - 1) / bars) * w,
  y: y + h - p.v * h,
});
const polyline = (pts: Pt[], bars: number, x: number, w: number, y: number, h: number) =>
  pts.map((p, i) => { const q = laneXY(p, bars, x, w, y, h); return `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`; }).join("");

const Lane = ({ x, y, w, h, bars }: { x: number; y: number; w: number; h: number; bars: number }) => (
  <g>
    <Bed x={x} y={y} w={w} h={h} bars={bars} quiet />
    <line x1={x} x2={x + w} y1={y + h * 0.25} y2={y + h * 0.25} stroke={D.border} strokeDasharray="2 4" />
  </g>
);

const Point = ({ x, y, hot = false }: { x: number; y: number; hot?: boolean }) => (
  <circle cx={x} cy={y} r={hot ? 5.5 : 4} fill={hot ? ACCENT : D.chrome} stroke={ACCENT} strokeWidth={1.8} />
);

/* ── new ───────────────────────────────────────────────────────────── */

const editCurve: Scene = {
  title: "Edit a curve, undo the edit", dur: 6.4, still: 2.4,
  draw: (t) => {
    const bars = 4, x = TX, w = TW, y = 56, h = 128;
    const pull = ek(t, 1.2, 2.0) * (1 - ek(t, 4.0, 4.8));
    const pts: Pt[] = [{ b: 1, v: 0.45 }, { b: 2, v: 0.62 }, { b: 3, v: 0.3 + pull * 0.42 }, { b: 4, v: 0.55 }, { b: 5, v: 0.4 }];
    const mid = laneXY(pts[2], bars, x, w, y, h);
    const c = path2(t, [[0, 520, 214], [0.8, mid.x, mid.y], [2.0, mid.x, mid.y], [3.2, 520, 214], [3.7, 118, 22], [4.8, 118, 22], [5.6, 520, 214]]);
    const undo = within(t, 3.7, 4.8);
    return (
      <Panel title="Automation · Volume">
        <Ruler x={x} y={34} w={w} bars={bars} />
        <Lane x={x} y={54} w={w} h={132} bars={bars} />
        <path d={polyline(pts, bars, x, w, y, h)} stroke={ACCENT} strokeWidth={2} fill="none" />
        {pts.map((p, i) => { const q = laneXY(p, bars, x, w, y, h); return <Point key={i} x={q.x} y={q.y} hot={i === 2 && within(t, 0.8, 2.2)} />; })}
        <Keycap x={30} y={202} label="Ctrl" on={undo} />
        <Keycap x={76} y={202} label="Z" on={undo} />
        <Label x={116} y={217} size={10.5} color={D.t3}>Every edit is one undo step</Label>
        <Cursor x={c.x} y={c.y} down={within(t, 0.8, 1.2) ? k(t, 0.8, 1.2) : 0} hand={within(t, 1.2, 2.0)} />
      </Panel>
    );
  },
};

const automationClips: Scene = {
  title: "Automation clips", dur: 7.4, still: 6.6,
  draw: (t) => {
    const bars = 6, x = TX, w = TW, y = 62, h = 100;
    const g = grid(bars, x, w);
    const move = ek(t, 1.0, 2.2);
    const off = move * 1.0;
    const split = t > 5.0;
    const base: Pt[] = [{ b: 1, v: 0.3 }, { b: 1.6, v: 0.7 }, { b: 2.4, v: 0.4 }, { b: 3, v: 0.8 }];
    const shifted = base.map((p) => ({ ...p, b: p.b + off + 0.4 }));
    const a0 = shifted[0].b, a1 = shifted[shifted.length - 1].b;
    const cut = (a0 + a1) / 2;
    const menu = within(t, 3.4, 5.1);
    const c = path2(t, [[0, 520, 214], [0.6, g(a0 + 0.4) , 74], [1.0, g(a0 + 0.4), 74], [2.2, g(a0 + 1.4 + 0.0), 74], [3.0, g(a0 + 1.6), 90], [3.6, g(a0 + 1.6), 90], [4.4, g(a0 + 1.9), menuRowY(96, 1) ], [5.1, g(a0 + 1.9), menuRowY(96, 1)], [6.0, 520, 214]]);
    return (
      <Panel title="Automation · Filter cutoff">
        <Ruler x={x} y={34} w={w} bars={bars} />
        <Lane x={x} y={54} w={w} h={118} bars={bars} />
        {[ [a0, split ? cut : a1, 0], ...(split ? [[cut, a1, 1]] : []) ].map(([s, e, i]) => (
          <g key={i as number}>
            <rect x={g(s as number)} y={56} width={g(e as number) - g(s as number) - (i ? -0 : split ? 3 : 0)} height={114} fill={ACCENT} opacity={0.13} />
            <rect x={g(s as number)} y={56} width={g(e as number) - g(s as number) - (i ? 0 : split ? 3 : 0)} height={9} fill={ACCENT} opacity={0.5} />
            <path d={`M${g(s as number) + 5} 59.5h14M${g(s as number) + 5} 62h14`} stroke="#0b0714" strokeWidth={1} />
          </g>
        ))}
        <path d={polyline(shifted, bars, x, w, y + 4, h + 4)} stroke={ACCENT} strokeWidth={2} fill="none" />
        {split && <line x1={g(cut)} x2={g(cut)} y1={56} y2={170} stroke={D.t1} strokeOpacity={0.9 * (1 - k(t, 5.0, 6.6))} strokeDasharray="3 3" />}
        <Menu x={g(a0 + 1.9)} y={96} w={128} open={k(t, 3.4, 3.7) * (menu ? 1 : 0)} cursor={menu ? { x: c.x, y: c.y } : undefined}
          items={["Duplicate", "Split Here", { label: "Delete", danger: true }]} />
        <Caption x={300} y={206} w={290} opacity={k(t, 5.4, 6.0)}>Cutting a clip never changes how it sounds</Caption>
        <Label x={30} y={217} size={10.5} color={D.t3} opacity={1 - k(t, 2.4, 2.8)}>Drag the grip to move it. Ctrl-drag copies.</Label>
        <Cursor x={c.x} y={c.y} down={within(t, 0.6, 1.0) ? k(t, 0.6, 1.0) : within(t, 4.3, 4.7) ? k(t, 4.3, 4.7) : 0} hand={within(t, 1.0, 2.2)} />
      </Panel>
    );
  },
};

const fitSuggest: Scene = {
  title: "Fit to bars suggests lengths", dur: 6.2, still: 5.4,
  draw: (t) => {
    const g = grid(6, 20, 300);
    const rows = [
      ["4 bars", "x0.85 speed, pitch follows"],
      ["3 bars", "x1.13 speed, pitch follows"],
      ["5 bars", "x0.68 speed, pitch follows"],
      ["2 bars", "x1.70 speed, pitch follows"],
      ["6 bars", "x0.57 speed, pitch follows"],
    ];
    const chosen = t > 4.2;
    const len = chosen ? lerp(3.4, 4, ek(t, 4.2, 5.0)) : 3.4;
    const c = path2(t, [[0, 520, 214], [0.8, 230, 62], [1.4, 230, 62], [3.6, 470, menuRowY(86, 0, 22)], [4.2, 470, menuRowY(86, 0, 22)], [5.6, 520, 214]]);
    return (
      <Panel title="Clip editor">
        <Bed x={20} y={44} w={300} h={120} bars={6} />
        <Clip x={g(1)} y={54} w={(len / 6) * 300} h={90} slot={1} label="Loop" shape="drum" seed={7} cols={150} sel />
        <Label x={20} y={186} size={10.5} color={D.t3}>Clip is 3.4 bars</Label>
        <rect x={340} y={44} width={240} height={150} rx={3} fill={D.panel} stroke={D.borderStrong} />
        <Label x={352} y={62} size={9.5} mono color={D.t3} weight={600}>FIT TO BARS · BEST FIRST</Label>
        {rows.map(([bars, note], i) => {
          const on = k(t, 1.2 + i * 0.25, 1.5 + i * 0.25);
          const hot = t > 3.0 && i === 0;
          return (
            <g key={i} opacity={on}>
              {hot && <rect x={344} y={69 + i * 22} width={232} height={20} rx={2} fill={D.primary} opacity={0.22} />}
              <Label x={352} y={83 + i * 22} size={11} color={D.t1} weight={600}>{bars}</Label>
              <Label x={398} y={83 + i * 22} size={10} color={hot ? D.violet : D.t3}>{note}</Label>
            </g>
          );
        })}
        {chosen && <Check x={560} y={80} p={k(t, 4.4, 5)} />}
        <Cursor x={c.x} y={c.y} down={within(t, 3.9, 4.2) ? k(t, 3.9, 4.2) : 0} />
      </Panel>
    );
  },
};

const bounce: Scene = {
  title: "Bounce in Place", dur: 8.2, still: 5.2,
  draw: (t) => {
    const g = grid(4, 150, 430);
    const baked = t > 3.0 && t < 6.4;
    const wet = baked ? 1 : 0;
    const menu = within(t, 1.1, 3.0);
    const c = path2(t, [[0, 520, 214], [0.8, 260, 96], [1.1, 260, 96], [2.5, 262, menuRowY(96, 1)], [3.0, 262, menuRowY(96, 1)], [4.2, 520, 214], [5.4, 520, 214], [6.6, 520, 214]]);
    const chips = ["EQ", "Comp"];
    return (
      <Panel title="Timeline">
        <Bed x={150} y={44} w={430} h={110} bars={4} />
        <TrackHead x={20} y={56} w={130} h={60} n={1} name="Vox" slot={5} />
        {chips.map((n, i) => (
          <g key={n} opacity={wet ? 0.35 : 1}>
            <rect x={26 + i * 40} y={102} width={36} height={11} rx={2} fill={D.raised} stroke={D.border} />
            <Label x={30 + i * 40} y={111} size={8.5} color={D.t1}>{n}</Label>
            {wet === 1 && <line x1={26 + i * 40} x2={62 + i * 40} y1={107.5} y2={107.5} stroke={D.t3} />}
          </g>
        ))}
        <Clip x={g(1)} y={56} w={g(4) - g(1)} h={56} slot={5} label={baked ? "Vox (bounced)" : "Vox"} shape="vox" seed={baked ? 29 : 11} cols={220} />
        <Menu x={254} y={96} w={150} open={k(t, 1.1, 1.4) * (menu ? 1 : 0)} cursor={menu ? { x: c.x, y: c.y } : undefined}
          items={["Split Here", "Bounce in Place", "Fit to Bars", { label: "Delete", danger: true }]} />
        <rect x={20} y={164} width={560} height={52} fill={D.panel} stroke={D.border} />
        <Label x={30} y={181} size={10.5} color={D.t2} weight={600}>{baked ? "The clip now holds the sound through EQ and Comp" : "Right-click an audio clip"}</Label>
        <Label x={30} y={198} size={10} color={D.t3}>{baked ? "Effects are off so nothing is doubled. Fader and pan stay live." : "It becomes a recording of how it sounds through its track."}</Label>
        <g opacity={k(t, 4.2, 4.6) * (1 - k(t, 6.2, 6.6))}>
          <Keycap x={474} y={178} label="Ctrl" on /><Keycap x={520} y={178} label="Z" on />
        </g>
        <Cursor x={c.x} y={c.y} down={within(t, 0.9, 1.2) ? k(t, 0.9, 1.2) : within(t, 2.7, 3.0) ? k(t, 2.7, 3.0) : 0} />
      </Panel>
    );
  },
};

const insertSlots: Scene = {
  title: "Insert slots past ten", dur: 6.4, still: 5.4,
  draw: (t) => {
    const count = Math.round(keys(t, [[0.6, 9], [1.0, 9], [1.2, 10], [1.8, 10], [2.0, 11], [2.6, 11], [2.8, 12], [3.4, 12], [3.6, 13], [4.2, 13]]));
    const scroll = keys(t, [[2.0, 0], [3.8, Math.max(0, count - 10) * 16]]);
    const names = ["EQ", "Comp", "Transient", "Saturator", "Delay", "Verb", "Filter", "Limiter", "Chorus", "Gate", "Phaser", "Width", "Tilt EQ"];
    return (
      <Panel title="Mixer · Bass">
        <rect x={40} y={38} width={150} height={178} fill={D.panel} stroke={D.border} />
        <rect x={40} y={38} width={150} height={3} fill={tone(4).lane} />
        <Label x={115} y={56} size={10.5} anchor="middle" color={D.t1}>Bass</Label>
        <svg x={46} y={64} width={138} height={148} viewBox="46 64 138 148" overflow="hidden">
          {names.slice(0, count).map((n, i) => (
            <g key={n}>
              <rect x={48} y={64 + i * 16 - scroll} width={134} height={14} rx={2} fill={D.raised} stroke={i === count - 1 && t < 4.2 ? D.violet : D.border} />
              <Label x={54} y={74.5 + i * 16 - scroll} size={9} color={D.t1}>{n}</Label>
              <Label x={176} y={74.5 + i * 16 - scroll} size={8.5} anchor="end" mono color={D.t4}>{i + 1}</Label>
            </g>
          ))}
        </svg>
        <Label x={230} y={80} size={26} weight={700} color={D.t1}>{count}</Label>
        <Label x={266} y={80} size={12} color={D.t3}>inserts on this track</Label>
        <rect x={230} y={96} width={330} height={8} rx={4} fill={D.control} stroke={D.border} />
        <rect x={230} y={96} width={330 * (count / 64)} height={8} rx={4} fill={D.violet} />
        <Label x={560} y={120} size={10} anchor="end" mono color={D.t3}>limit 64</Label>
        <Label x={230} y={150} size={10.5} color={D.t3}>Ten used to be the end of the list.</Label>
        <Label x={230} y={168} size={10.5} color={D.t3}>A project with ten inserts or fewer</Label>
        <Label x={230} y={184} size={10.5} color={D.t3}>saves exactly as before.</Label>
      </Panel>
    );
  },
};

const panelModes: Scene = {
  title: "Docked or floating, contextual or open", dur: 8, still: 5.2,
  draw: (t) => {
    const open = within(t, 1.0, 5.2);
    const floatOn = t > 2.4;
    const keep = t > 4.0;
    const c = path2(t, [[0, 520, 214], [0.7, 332, 52], [1.0, 332, 52], [2.0, 340, menuRowY(66, 1)], [2.4, 340, menuRowY(66, 1)], [3.6, 342, menuRowY(66, 3)], [4.0, 342, menuRowY(66, 3)], [5.6, 520, 214]]);
    return (
      <Panel title="Timeline">
        <Bed x={20} y={44} w={560} h={170} bars={8} quiet />
        <g opacity={0.5}>
          <Clip x={30} y={56} w={160} h={36} slot={3} shape="drum" seed={3} cols={80} />
          <Clip x={30} y={100} w={240} h={36} slot={4} shape="bass" seed={5} cols={110} />
          <Clip x={30} y={144} w={120} h={36} slot={1} shape="keys" seed={9} cols={60} />
        </g>
        <g transform={`translate(${floatOn ? -26 : 0} ${floatOn ? 6 : 0})`}>
          <rect x={300} y={40} width={266} height={170} fill={D.chrome} stroke={floatOn ? D.violet : D.borderStrong} strokeWidth={floatOn ? 1.5 : 1} />
          <rect x={300} y={40} width={266} height={24} fill={D.panel} />
          <Label x={310} y={56} size={10.5} weight={600} color={D.t2}>MIXER</Label>
          <Label x={556} y={56} size={9} anchor="end" mono color={floatOn ? D.violet : D.t4}>{floatOn ? "FLOATING" : "DOCKED"}</Label>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={312 + i * 62} y={74} width={54} height={124} fill={D.panel} stroke={D.border} />
              <rect x={312 + i * 62} y={74} width={54} height={3} fill={tone([3, 4, 1, 5][i]).lane} />
              <Meter x={344 + i * 62} y={110} h={78} level={0.5 + 0.2 * Math.sin(t * 6 + i)} w={4} />
            </g>
          ))}
        </g>
        <Menu x={342 - (floatOn ? 26 : 0) - 8} y={60} w={150} open={k(t, 1.0, 1.3) * (open ? 1 : 0)}
          cursor={open ? { x: c.x, y: c.y } : undefined}
          items={[{ label: "Docked", hint: floatOn ? "" : "✓" }, { label: "Floating", hint: floatOn ? "✓" : "" }, { label: "Contextual", hint: keep ? "" : "✓" }, { label: "Keep Open", hint: keep ? "✓" : "" }]} />
        <Label x={30} y={217} size={10.5} color={D.t3}>Right-click a panel's title bar. View, Gather Panels brings everything back.</Label>
        <Cursor x={c.x} y={c.y} down={within(t, 0.8, 1.1) ? k(t, 0.8, 1.1) : within(t, 2.1, 2.4) ? k(t, 2.1, 2.4) : within(t, 3.7, 4.0) ? k(t, 3.7, 4.0) : 0} />
      </Panel>
    );
  },
};

const stems: Scene = {
  title: "Stems export", dur: 6.6, still: 5.6,
  draw: (t) => {
    const tracks = [["Drums", 3], ["Bass", 4], ["Keys", 1], ["Vocal", 5], ["Master", 0]] as const;
    const bw = 340;
    return (
      <Panel title="Export · Stems">
        <Label x={30} y={52} size={10} mono color={D.t3} weight={600}>ONE FILE PER TRACK WITH SOUND, PLUS THE MASTER</Label>
        {tracks.map(([name, slot], i) => {
          const y = 66 + i * 28;
          const grow = ek(t, 0.8 + i * 0.35, 1.6 + i * 0.35);
          const done = k(t, 2.8 + i * 0.4, 3.2 + i * 0.4);
          return (
            <g key={name}>
              <Label x={30} y={y + 15} size={11} color={D.t1}>{name}</Label>
              <rect x={120} y={y} width={bw} height={22} fill={D.bed} stroke={D.border} />
              <rect x={120} y={y} width={bw * grow} height={22} fill={name === "Master" ? D.primary : tone(slot).body} />
              <Label x={470 + 10} y={y + 15} size={10} mono color={D.t3}>{name.toLowerCase()}.wav</Label>
              <Check x={556} y={y + 6} p={done} />
            </g>
          );
        })}
        <line x1={120 + bw} x2={120 + bw} y1={62} y2={208} stroke={D.violet} strokeDasharray="3 3" opacity={k(t, 2.0, 2.6)} />
        <Caption x={300} y={220} w={330} opacity={k(t, 4.4, 5.0)}>Same length, so they line up in any other program</Caption>
      </Panel>
    );
  },
};

const recentPlugins: Scene = {
  title: "Recently loaded plugins", dur: 6.2, still: 5,
  draw: (t) => {
    const loaded = t > 2.4;
    const list = ["Aestra EQ", "Aestra Transient", "Surge XT", "Vital", "OTT"];
    const recent = loaded ? ["Surge XT", "Aestra EQ", "Aestra Transient"] : ["Aestra EQ", "Aestra Transient"];
    const c = path2(t, [[0, 520, 214], [0.9, 420, 103], [2.4, 420, 103], [3.0, 420, 103], [4.2, 520, 214]]);
    return (
      <Panel title="Plugins">
        <rect x={20} y={40} width={250} height={22} rx={3} fill={D.control} stroke={D.borderStrong} />
        <Label x={32} y={55} size={10.5} color={D.t3}>Search plugins</Label>
        <Label x={20} y={82} size={9.5} mono weight={600} color={D.violet}>RECENT</Label>
        {recent.map((n, i) => (
          <g key={n} opacity={n === "Surge XT" ? k(t, 2.6, 3.2) : 1}>
            <rect x={20} y={88 + i * 22} width={250} height={20} fill={n === "Surge XT" ? D.primary : D.panel} opacity={n === "Surge XT" ? 0.3 : 1} stroke={D.border} />
            <Label x={30} y={102 + i * 22} size={10.5} color={D.t1}>{n}</Label>
          </g>
        ))}
        <Label x={20} y={92 + recent.length * 22 + 12} size={9.5} mono weight={600} color={D.t3}>ALL PLUGINS</Label>
        {list.map((n, i) => (
          <g key={n}>
            <rect x={300} y={44 + i * 24} width={270} height={22} fill={D.panel} stroke={D.border} />
            <Label x={310} y={59 + i * 24} size={10.5} color={n === "Surge XT" && t > 1 ? D.violet : D.t2}>{n}</Label>
          </g>
        ))}
        <Cursor x={c.x} y={c.y} down={within(t, 2.1, 2.4) ? k(t, 2.1, 2.4) : 0} />
      </Panel>
    );
  },
};

const fades: Scene = {
  title: "Draggable fades", dur: 6, still: 4.4,
  draw: (t) => {
    const g = grid(4, 40, 520);
    const fi = lerp(0.1, 1.0, ek(t, 1.2, 2.6));
    const fo = lerp(0.1, 0.6, ek(t, 3.2, 4.4));
    const x0 = g(1) + 20, x1 = g(3) + 40, y = 70, h = 100;
    const fiX = x0 + fi * 80, foX = x1 - fo * 80;
    const c = path2(t, [[0, 520, 214], [0.8, x0 + 8, y + 4], [1.2, x0 + 8, y + 4], [2.6, fiX, y + 4], [3.0, x1 - 8, y + 4], [3.2, x1 - 8, y + 4], [4.4, foX, y + 4], [5.4, 520, 214]]);
    return (
      <Panel title="Timeline">
        <Bed x={40} y={44} w={520} h={140} bars={4} />
        <Clip x={x0} y={y} w={x1 - x0} h={h} slot={4} label="Pad" shape="pad" seed={14} cols={200} />
        <path d={`M${x0} ${y + h}L${fiX} ${y}L${x0} ${y}Z`} fill="#000" opacity={0.55} />
        <path d={`M${x1} ${y + h}L${foX} ${y}L${x1} ${y}Z`} fill="#000" opacity={0.55} />
        <line x1={x0} y1={y + h} x2={fiX} y2={y} stroke={D.t1} strokeWidth={1.4} />
        <line x1={x1} y1={y + h} x2={foX} y2={y} stroke={D.t1} strokeWidth={1.4} />
        <rect x={fiX - 3.5} y={y - 3.5} width={7} height={7} fill={D.t1} />
        <rect x={foX - 3.5} y={y - 3.5} width={7} height={7} fill={D.t1} />
        <Label x={40} y={206} size={10.5} color={D.t3}>Drag the corner handles. Clips also have a context menu, and undo covers every clip edit.</Label>
        <Cursor x={c.x} y={c.y} hand={within(t, 1.2, 2.6) || within(t, 3.2, 4.4)} />
      </Panel>
    );
  },
};

/* ── fix ───────────────────────────────────────────────────────────── */

const leftTrim: Scene = {
  title: "Left-trimmed MIDI clips", dur: 7, still: 5.4,
  draw: (t) => {
    const now = t > 3.5;
    const tt = now ? t - 3.5 : t;
    const beats = 8;
    const play = clamp(tt / 3.2) * beats;
    // the clip's first note sits at beat 3 on screen; before the fix it sounded `trim` beats late
    const trim = 1.5;
    const notes: Note[] = [{ s: 3, l: 1, p: 6 }, { s: 4.5, l: 1, p: 4 }, { s: 6, l: 1.5, p: 7 }];
    const sounding = (n: Note) => play >= n.s + (now ? 0 : trim) && play < n.s + (now ? 0 : trim) + n.l;
    const bx = rollX(20, 560, beats);
    return (
      <Panel title="Piano roll">
        <Era now={now} />
        <Roll x={20} y={38} w={560} h={150} rows={10} beats={beats}
          notes={notes.map((n) => ({ ...n, sel: sounding(n), o: sounding(n) ? 1 : 0.7 }))} />
        <rect x={bx(0)} y={38} width={bx(trim) - bx(0)} height={150} fill="#000" opacity={0.5} />
        <Label x={bx(0) + 6} y={56} size={9.5} mono color={D.t3}>trimmed</Label>
        <Playhead x={bx(play)} y={38} h={150} />
        <Label x={30} y={208} size={10.5} color={now ? D.meter : D.warn}>
          {now ? "Notes sound exactly where they are drawn" : `Notes sounded ${trim} beats late, the amount you trimmed`}
        </Label>
      </Panel>
    );
  },
};

const unityCurve: Scene = {
  title: "An empty volume curve", dur: 6, still: 4.8,
  draw: (t) => {
    const now = t > 3;
    const level = 0.55 + 0.2 * Math.sin(t * 8);
    return (
      <Panel title="Automation · Volume">
        <Era now={now} />
        <Lane x={30} y={48} w={420} h={120} bars={4} />
        <line x1={30} x2={450} y1={now ? 78 : 168} y2={now ? 78 : 168} stroke={now ? ACCENT : D.error} strokeWidth={2} />
        <Label x={36} y={now ? 72 : 162} size={10} mono color={now ? D.violet : D.error}>{now ? "no points = unity (0 dB)" : "no points = silence"}</Label>
        <rect x={480} y={48} width={90} height={120} fill={D.panel} stroke={D.border} />
        <Meter x={518} y={58} h={100} level={now ? level : 0} w={10} />
        <Label x={525} y={186} size={10} anchor="middle" mono color={now ? D.t1 : D.t3}>{now ? "0.0 dB" : "-inf"}</Label>
        <Label x={30} y={200} size={10.5} color={D.t3}>A track with an automation lane and no points in it plays at the fader's level.</Label>
      </Panel>
    );
  },
};

const loudness: Scene = {
  title: "Loudness reading at 48 kHz", dur: 6, still: 4.8,
  draw: (t) => {
    const now = t > 3;
    const v = now ? -14.0 : -15.0;
    const x = 40 + ((v + 20) / 12) * 520;
    return (
      <Panel title="Master · Loudness">
        <Era now={now} />
        <Label x={40} y={92} size={42} weight={700} color={D.t1}>{v.toFixed(1)}</Label>
        <Label x={176} y={92} size={14} color={D.t3}>LUFS integrated</Label>
        <rect x={40} y={118} width={520} height={10} rx={5} fill={D.control} stroke={D.border} />
        <rect x={40 + ((-14 + 20) / 12) * 520 - 1} y={112} width={2} height={22} fill={D.t1} />
        <Label x={40 + ((-14 + 20) / 12) * 520} y={150} size={10} anchor="middle" mono color={D.t3}>true level -14.0</Label>
        <circle cx={x} cy={123} r={7} fill={now ? D.meter : D.warn} />
        <Label x={40} y={196} size={10.5} color={now ? D.meter : D.warn}>
          {now ? "Measured once per file, and it matches" : "Read about 1 dB low on 48 kHz files"}
        </Label>
      </Panel>
    );
  },
};

const tension: Scene = {
  title: "Curve tension you can hear", dur: 6.4, still: 4.6,
  draw: (t) => {
    const ten = ek(t, 1.0, 2.6) * (1 - ek(t, 4.6, 5.6)) * 0.85;
    const x = 40, w = 520, y = 48, h = 70;
    const curve = (u: number) => (ten === 0 ? u : (Math.exp(ten * 4 * u) - 1) / (Math.exp(ten * 4) - 1));
    let d = "";
    for (let i = 0; i <= 60; i++) d += `${i ? "L" : "M"}${x + (i / 60) * w} ${y + h - curve(i / 60) * h}`;
    let wave = "";
    for (let i = 0; i <= 240; i++) {
      const u = i / 240;
      const a = 0.12 + 0.88 * curve(u);
      wave += `${i ? "L" : "M"}${x + u * w} ${168 + Math.sin(i * 0.7) * a * 34}`;
    }
    return (
      <Panel title="Automation · Volume">
        <Bed x={x} y={y} w={w} h={h} bars={4} quiet />
        <path d={d} stroke={ACCENT} strokeWidth={2.2} fill="none" />
        <Point x={x} y={y + h} /><Point x={x + w} y={y} />
        <circle cx={x + w / 2} cy={y + h - curve(0.5) * h} r={4.5} fill={D.chrome} stroke={D.t1} />
        <rect x={x} y={131} width={w} height={76} fill={D.bed} stroke={D.border} />
        <path d={wave} stroke={D.meter} strokeWidth={1.2} fill="none" />
        <Label x={x + 6} y={126} size={9.5} mono color={D.t3}>WHAT YOU HEAR</Label>
        <Label x={x + w - 6} y={126} size={9.5} anchor="end" mono color={D.violet}>tension {Math.round(ten * 100)}%</Label>
      </Panel>
    );
  },
};

/* ── perf ──────────────────────────────────────────────────────────── */

const memory: Scene = {
  title: "Audio memory in a 12-track session", dur: 6, still: 4.4,
  draw: (t) => {
    const a = ek(t, 0.6, 1.8);
    const b = ek(t, 1.8, 3.0);
    const W0 = 380;
    return (
      <Panel title="Memory · 4 GB laptop">
        <Label x={40} y={66} size={11} color={D.t2}>Before</Label>
        <rect x={140} y={52} width={W0} height={22} fill={D.bed} stroke={D.border} />
        <rect x={140} y={52} width={W0 * a} height={22} fill={D.warn} />
        <Label x={40} y={112} size={11} color={D.t2}>Now</Label>
        <rect x={140} y={98} width={W0} height={22} fill={D.bed} stroke={D.border} />
        <rect x={140} y={98} width={W0 * 0.57 * b} height={22} fill={D.meter} />
        <g opacity={k(t, 2.6, 3.2)}>
          <Label x={140 + W0 * 0.57 + 10} y={114} size={13} weight={700} color={D.meter}>-43%</Label>
        </g>
        <Label x={40} y={160} size={10.5} color={D.t3}>16 and 24-bit sources stay as PCM, with bit-identical output.</Label>
        <Label x={40} y={178} size={10.5} color={D.t3}>Imports decode off the UI thread.</Label>
        <Label x={40} y={196} size={10.5} color={D.t3}>The anti-alias copy is streamed, and made only for sources that play.</Label>
      </Panel>
    );
  },
};

export const V080: Record<string, Scene> = {
  "v0.8.0-alpha:edit-any-curve-and-undo-any": editCurve,
  "v0.8.0-alpha:automation-clips-a-stretch-of-a": automationClips,
  "v0.8.0-alpha:fit-to-bars-now-suggests-the": fitSuggest,
  "v0.8.0-alpha:bounce-in-place-right-click-an": bounce,
  "v0.8.0-alpha:insert-slots-grow-past-ten-up": insertSlots,
  "v0.8.0-alpha:every-panel-can-be-docked-or": panelModes,
  "v0.8.0-alpha:stems-export-one-file-per-track": stems,
  "v0.8.0-alpha:the-plugin-browser-remembers-the-plugins": recentPlugins,
  "v0.8.0-alpha:fades-are-draggable-on-the-timeline": fades,
  "v0.8.0-alpha:left-trimmed-midi-clips-now-play": leftTrim,
  "v0.8.0-alpha:a-volume-curve-with-no-points": unityCurve,
  "v0.8.0-alpha:the-loudness-reading-was-about-1": loudness,
  "v0.8.0-alpha:curve-tension-is-audible-now-older": tension,
  "v0.8.0-alpha:audio-memory-on-a-4-gb": memory,
};
