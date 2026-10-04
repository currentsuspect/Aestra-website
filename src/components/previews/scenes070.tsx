import React from "react";
import {
  D, tone, type Scene, W, k, ek, keys, path2, lerp, clamp, within,
  Label, Panel, PluginWindow, Button, Keycap, Cursor, Menu, Ruler, Bed, Playhead, Clip, TrackHead,
  Crop, Roll, rollX, grid, Meter, Strip, Check, Era, peaks, wavePath, type Note,
} from "./kit";
import { EQ_ACCENT, EqGrid, curvePath, eqGeom, type Band } from "./eq";

/* v0.7.0-alpha, the coherence milestone. One scene per entry. */

/* ── new ───────────────────────────────────────────────────────────── */

const oneShotStops: Scene = {
  title: "One-shots stop with the note", dur: 6,
  draw: (t) => {
    const now = t > 3;
    const tt = now ? t - 3 : t;
    const notes: Note[] = [{ s: 0, l: 0.5, p: 6, label: "C" }, { s: 1, l: 0.25, p: 6 }, { s: 2, l: 1, p: 6, label: "C" }];
    const bx = rollX(20, 560, 4);
    const ph = tt * 1.5;
    return (
      <Panel title="Piano Roll · One-shot">
        <Era now={now} />
        <Roll x={20} y={40} w={560} h={90} rows={8} beats={4} notes={notes} rowNames={{ 6: "C3" }} />
        <rect x={20} y={136} width={560} height={84} fill="#050505" />
        <Label x={26} y={150} size={9} mono color={D.t3}>WHAT YOU HEAR</Label>
        {notes.map((n, i) => {
          const start = n.s;
          const end = now ? n.s + n.l : Math.min(4, n.s + 1.3);
          const shown = clamp(ph - start, 0, end - start);
          if (shown <= 0) return null;
          const x0 = bx(start);
          const w = bx(start + shown) - x0;
          return <path key={i} d={wavePath(peaks(Math.max(4, Math.round(w / 3)), i + 3, "hit"), x0, 156, Math.max(2, w), 56)} fill={now ? D.meter : D.warn} opacity={0.8} />;
        })}
        <Playhead x={bx(Math.min(4, ph))} y={40} h={180} />
      </Panel>
    );
  },
};

const splitNoGap: Scene = {
  title: "Split audio, pitch apart from speed", dur: 6.4,
  draw: (t) => {
    const g = grid(8);
    const cut = t > 0.9;
    const now = true;
    const pitch = keys(t, [[3, 0], [4.2, 5], [5.2, -3]]);
    const cols = 200;
    return (
      <Panel title="Timeline">
        <Ruler x={20} y={38} w={560} bars={8} />
        <Bed x={20} y={56} w={560} h={100} bars={8} />
        {!cut ? (
          <Clip x={g(1)} y={70} w={g(9) - g(1)} h={60} slot={6} label="Vocal" shape="vox" seed={4} cols={cols} />
        ) : (
          <g>
            <Clip x={g(1)} y={70} w={g(4.5) - g(1) - 1} h={60} slot={6} label="Vocal" shape="vox" seed={4} cols={Math.round(cols * 3.5 / 8)} to={3.5 / 8} />
            <Clip x={g(4.5) + 1} y={70} w={g(9) - g(4.5) - 1} h={60} slot={6} label="Vocal" shape="vox" seed={4} cols={Math.round(cols * 4.5 / 8)} from={3.5 / 8} sel={t > 2.6} />
          </g>
        )}
        {now && <line x1={g(4.5)} x2={g(4.5)} y1={60} y2={140} stroke={D.t1} strokeWidth={2} strokeOpacity={cut ? 1 - k(t, 0.9, 1.8) : 0} />}
        <Label x={20} y={176} size={10.5} color={D.t3} opacity={k(t, 1.2, 1.6)}>The waveform carries straight across the cut: no restart, no gap.</Label>
        <g opacity={k(t, 2.6, 3)}>
          <rect x={20} y={190} width={420} height={30} rx={3} fill={D.panel} stroke={D.border} />
          <Label x={30} y={209} size={11} color={D.t2}>Pitch</Label>
          <Label x={72} y={209} size={11} mono color={D.violet}>{`${pitch >= 0 ? "+" : ""}${pitch.toFixed(1)} st`}</Label>
          <Label x={170} y={209} size={11} color={D.t2}>Speed</Label>
          <Label x={214} y={209} size={11} mono color={D.t1}>1.00×</Label>
          <Label x={290} y={209} size={10.5} color={D.t3}>length unchanged</Label>
        </g>
      </Panel>
    );
  },
};

const splitNote: Scene = {
  title: "Split a note to snap", dur: 4.6,
  draw: (t) => {
    const pieces = t > 1.8;
    const spread = ek(t, 1.8, 2.3);
    const notes: Note[] = pieces
      ? Array.from({ length: 8 }, (_, i) => ({ s: 0.5 + i * 0.5 + spread * 0.02, l: 0.5 - spread * 0.04, p: 6, sel: true }))
      : [{ s: 0.5, l: 4, p: 6, label: "E2", sel: t > 0.6 }];
    return (
      <Panel title="Piano Roll" right={<Label x={470} y={24} size={10} mono color={D.t3}>SNAP 1/8</Label>}>
        <Roll x={20} y={40} w={560} h={150} rows={10} beats={5} notes={notes} rowNames={{ 6: "E2" }} />
        <Keycap x={20} y={202} label="Split to snap" on={within(t, 1.6, 1.9)} />
        <Label x={130} y={217} size={10.5} color={D.t3} opacity={k(t, 2.2, 2.6)}>One long note, eight snap-sized pieces.</Label>
      </Panel>
    );
  },
};

const stretchPhrase: Scene = {
  title: "Stretch a phrase", dur: 5,
  draw: (t) => {
    const s = keys(t, [[1, 1], [2.4, 1.6], [3.4, 1.6], [4.4, 1.25]]);
    const base: [number, number, number][] = [[0.25, 0.5, 5], [0.75, 0.25, 7], [1, 0.5, 8], [1.75, 0.25, 7], [2, 0.75, 5]];
    const notes: Note[] = base.map(([st, l, p]) => ({ s: 0.25 + (st - 0.25) * s, l: l * s, p, sel: true }));
    const bx = rollX(20, 560, 6);
    const end = 0.25 + (2.75 - 0.25) * s;
    return (
      <Panel title="Piano Roll">
        <Roll x={20} y={40} w={560} h={160} rows={10} beats={6} notes={notes} />
        <rect x={bx(0.25)} y={44} width={bx(end) - bx(0.25)} height={152} fill="none" stroke={D.violet} strokeDasharray="4 3" />
        <rect x={bx(end) - 3} y={110} width={6} height={20} rx={2} fill={D.violet} />
        <Cursor x={bx(end)} y={120} hand />
        <Label x={20} y={220} size={10.5} color={D.t3}>{`Stretch ${Math.round(s * 100)}%: the rhythm inside keeps its shape.`}</Label>
      </Panel>
    );
  },
};

const pingPong: Scene = {
  title: "Sampler ping-pong loop", dur: 6,
  draw: (t) => {
    const a = 0.35;
    const b = 0.75;
    const len = b - a;
    const u = t * 0.32;
    const intro = Math.min(u, a);
    const inLoop = Math.max(0, u - a);
    const phase = (inLoop / len) % 2;
    const forward = phase < 1;
    const pos = u < a ? intro : forward ? a + (phase % 1) * len : b - (phase % 1) * len;
    const x = 30 + pos * 540;
    const reopen = t > 4.4 && t < 5.2;
    return (
      <Panel title="Sampler">
        <g opacity={reopen ? 0.2 : 1}>
          <rect x={30} y={50} width={540} height={120} fill="#050505" stroke={D.border} />
          <path d={wavePath(peaks(180, 14, "pad"), 30, 56, 540, 108)} fill={tone(1).ink} opacity={0.55} />
          <rect x={30 + a * 540} y={50} width={len * 540} height={120} fill="rgba(124,58,237,.14)" stroke={D.violet} />
          <Playhead x={x} y={50} h={120} />
          <path d={forward ? `M${x + 6} 60l8 5l-8 5z` : `M${x - 6} 60l-8 5l8 5z`} fill={D.t1} />
          <Label x={30} y={196} size={10.5} color={D.t2}>Loop mode</Label>
          <Button x={104} y={182} w={100} h={22} label="‹ Ping-pong ›" on color={D.primary} ink="#fff" />
          <Label x={220} y={196} size={10.5} color={D.t3}>{forward ? "forward" : "backward"}</Label>
        </g>
        {reopen && <Label x={W / 2} y={120} size={12} anchor="middle" mono color={D.t2}>CLOSE · REOPEN</Label>}
        {t > 5.2 && <Label x={330} y={196} size={10.5} color={D.meter}>Reopens in ping-pong.</Label>}
      </Panel>
    );
  },
};

const chordPaint: Scene = {
  title: "Paint chords, undo an erase", dur: 6.4,
  draw: (t) => {
    const bx = rollX(20, 560, 4);
    const painted = Math.floor(clamp((t - 0.5) / 1.4) * 4 + (t > 0.5 ? 1 : 0));
    const erased = t > 2.8 && t < 4.6 ? Math.floor(clamp((t - 2.8) / 1) * 4 + 1) : 0;
    const chord = (i: number): Note[] => [0, 3, 7].map((d) => ({ s: i, l: 0.9, p: 2 + d, sel: false }));
    const notes = Array.from({ length: Math.min(4, painted) }, (_, i) => i).filter((i) => i >= erased).flatMap(chord);
    const c = t < 2.3 ? { x: bx(clamp((t - 0.5) / 1.4) * 3.6 + 0.3), y: 150 } : t < 4 ? { x: bx(clamp((t - 2.8) / 1) * 3.6 + 0.3), y: 150 } : { x: 450, y: 212 };
    return (
      <Panel title="Piano Roll">
        <Roll x={20} y={40} w={560} h={150} rows={12} beats={4} notes={notes} />
        <Keycap x={20} y={200} label="Shift" on={within(t, 0.4, 2.2)} />
        <Label x={80} y={215} size={10.5} color={D.t2}>{t < 2.8 ? "Shift-drag paints chords" : t < 4.6 ? "Drag erase" : "One undo brings the whole erase back"}</Label>
        <Keycap x={430} y={200} label="Ctrl" on={within(t, 4.6, 4.9)} />
        <Keycap x={470} y={200} label="Z" on={within(t, 4.6, 4.9)} />
        <Cursor x={c.x} y={c.y} />
      </Panel>
    );
  },
};

const harmonyStays: Scene = {
  title: "Harmony stays with the pattern", dur: 5,
  draw: (t) => {
    const minor = [0, 2, 3, 5, 7, 8, 10];
    const chosen = t > 1.2;
    const reopen = t > 2.4 && t < 3.4;
    const notes: Note[] = [{ s: 0, l: 1, p: 0 }, { s: 1, l: 1, p: 3 }, { s: 2, l: 1, p: 7 }, { s: 3, l: 1, p: 10 }];
    return (
      <Panel title="Piano Roll · Pattern 3">
        <g opacity={reopen ? 0.15 : 1}>
          <Roll x={20} y={40} w={420} h={180} rows={12} beats={4} notes={notes}>
            {chosen && Array.from({ length: 12 }, (_, p) => minor.includes(p) && (
              <rect key={p} x={54} y={40 + (11 - p) * 15} width={386} height={15} fill={D.violet} opacity={0.07} />
            ))}
          </Roll>
          <rect x={450} y={40} width={132} height={180} fill={D.panel} stroke={D.border} />
          <Label x={460} y={60} size={9.5} mono color={D.t3}>HARMONY</Label>
          <Button x={460} y={70} w={112} h={22} label={chosen ? "C minor" : "Off"} on={chosen} ink={chosen ? "#fff" : undefined} />
          {t > 3.4 && <g><Check x={462} y={112} p={k(t, 3.4, 3.8)} /><Label x={480} y={117} size={10.5} color={D.meter}>Still C minor</Label></g>}
        </g>
        {reopen && <Label x={W / 2} y={130} size={12} anchor="middle" mono color={D.t2}>CLOSE · REOPEN</Label>}
      </Panel>
    );
  },
};

const routingLevel: Scene = {
  title: "Routing keeps its level", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const pulse = 0.75 + 0.1 * Math.sin(t * 9);
    const hops = ["Source", "Bus A", "Bus B", "Master"];
    return (
      <Panel title="Routing">
        <Era now={now} />
        {hops.map((h, i) => {
          const x = 40 + i * 140;
          const level = pulse * (now ? 1 : Math.pow(0.78, i));
          return (
            <g key={h}>
              <rect x={x} y={70} width={96} height={110} rx={3} fill={D.panel} stroke={D.border} />
              <Label x={x + 10} y={90} size={11} color={D.t1}>{h}</Label>
              <Meter x={x + 14} y={100} h={70} level={level} w={8} />
              <Meter x={x + 26} y={100} h={70} level={level * 0.96} w={8} />
              <Label x={x + 44} y={170} size={10.5} mono color={now ? D.meter : i ? D.warn : D.t2}>{`${(20 * Math.log10(level / pulse)).toFixed(1)} dB`}</Label>
              {i < 3 && <path d={`M${x + 100} 125h36m-6 -4l6 4l-6 4`} stroke={D.t3} fill="none" />}
            </g>
          );
        })}
        <Label x={40} y={210} size={10.5} color={D.t3}>{now ? "Every hop at unity. One-shots keep their pitch and full tail." : "Each channel on the way cost level."}</Label>
      </Panel>
    );
  },
};

const eqClean: Scene = {
  title: "Aestra EQ, clean canvas", dur: 6,
  draw: (t) => {
    const all: Band[] = [{ f: 80, g: 5, q: 1 }, { f: 900, g: -6, q: 1.4 }, { f: 6000, g: 4, q: 1 }];
    const added = t < 3 ? all.filter((_, i) => t > 0.6 + i * 0.6) : all.filter((_, i) => t < 3.4 + i * 0.6);
    const x = 30, y = 44, w = 540, h = 176;
    const { fx, gy } = eqGeom(x, y, w, h);
    return (
      <PluginWindow x={10} y={6} w={580} h={228} name="Aestra EQ" accent={EQ_ACCENT}>
        <EqGrid x={x} y={y} w={w} h={h} />
        <path d={curvePath(added, x, y, w, h)} stroke={EQ_ACCENT} strokeWidth={2.4} fill="none" />
        {added.map((b, i) => <circle key={i} cx={fx(b.f)} cy={gy(b.g)} r={5} fill="#0d1210" stroke={EQ_ACCENT} strokeWidth={1.8} />)}
        <Label x={x + w - 8} y={y + 16} size={10} anchor="end" color="#8ba398">
          {`${added.length} band${added.length === 1 ? "" : "s"}${t < 0.6 ? " · opens flat" : t > 5 ? " · every band deletable" : ""}`}
        </Label>
      </PluginWindow>
    );
  },
};

const pitchClips: Scene = {
  title: "Pitch clips two octaves", dur: 5.4,
  draw: (t) => {
    const st = keys(t, [[0.4, 0], [1.8, 24], [3.2, -24], [4.4, 0]]);
    const g = grid(4, 20, 560);
    return (
      <Panel title="Timeline">
        <Ruler x={20} y={38} w={560} bars={4} />
        <Bed x={20} y={56} w={560} h={110} bars={4} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={g(1 + i * 0.5)} x2={g(1 + i * 0.5)} y1={56} y2={166} stroke={D.violet} strokeOpacity={0.3} />)}
        <Clip x={g(1)} y={70} w={560} h={80} slot={3} label="Drum Loop" shape="drum" seed={6} cols={64} />
        <rect x={20} y={180} width={560} height={40} rx={3} fill={D.panel} stroke={D.border} />
        <Label x={30} y={204} size={11} color={D.t2}>Pitch</Label>
        <rect x={80} y={197} width={380} height={6} rx={3} fill={D.control} />
        <line x1={270} x2={270} y1={193} y2={207} stroke={D.t3} />
        <circle cx={270 + (st / 24) * 190} cy={200} r={7} fill={D.t1} />
        <Label x={570} y={204} size={12} anchor="end" mono color={D.violet}>{`${st >= 0 ? "+" : ""}${st.toFixed(0)} st`}</Label>
        <Label x={530} y={25} size={9} anchor="end" mono color={D.t3}>HITS STAY ON THE BEAT LINES AT ANY PITCH</Label>
      </Panel>
    );
  },
};

const crashIsolated: Scene = {
  title: "A crashing plugin stays contained", dur: 5.4,
  draw: (t) => {
    const crashed = t > 1.6;
    const ph = 1 + (t * 0.8) % 8;
    const g = grid(8, 20, 560);
    return (
      <g>
        <Panel title="Timeline · Windows">
          <Bed x={20} y={40} w={560} h={180} bars={8} />
          <Clip x={g(1)} y={60} w={560} h={40} slot={3} label="Drums" shape="drum" seed={1} cols={160} />
          <Clip x={g(1)} y={110} w={560} h={40} slot={4} label="Bass" shape="bass" seed={2} cols={160} />
          <Playhead x={g(ph)} y={40} h={180} />
          <Meter x={566} y={170} h={44} level={0.6 + 0.2 * Math.sin(t * 10)} w={6} />
        </Panel>
        <g opacity={crashed ? 1 - k(t, 2.4, 3) : 1}>
          <PluginWindow x={300} y={120} w={220} h={100} name="Third-party VST3" accent={D.t2}>
            <rect x={312} y={160} width={196} height={48} rx={4} fill={crashed ? "#2a0f0c" : "#15181a"} />
            <Label x={410} y={189} size={11} anchor="middle" color={crashed ? D.error : "#8a8f94"}>{crashed ? "✕ plugin process crashed" : "running"}</Label>
          </PluginWindow>
        </g>
        <Label x={20} y={234} size={10.5} color={D.meter} opacity={k(t, 2.4, 2.8)}>The plugin goes down. Aestra and your session keep playing.</Label>
      </g>
    );
  },
};

const easierClips: Scene = {
  title: "Clips and minimap colours", dur: 5,
  draw: (t) => {
    const now = t > 2.5;
    const g = grid(8, 20, 560);
    const rows = [[1, 5, 3, "drum"], [2, 8, 4, "bass"], [1, 4, 1, "keys"], [4, 9, 6, "vox"]] as const;
    return (
      <Panel title="Timeline">
        <Era now={now} />
        <rect x={20} y={36} width={560} height={16} fill="#0a0908" stroke={D.border} />
        {rows.map(([a, b, slot], i) => (
          <rect key={i} x={20 + ((a - 1) / 8) * 560} y={38 + i * 3.2} width={((b - a) / 8) * 560} height={2.4} fill={now ? tone(slot).lane : D.t3} />
        ))}
        <Bed x={20} y={58} w={560} h={164} bars={8} />
        {rows.map(([a, b, slot, shape], i) => (
          now ? (
            <Clip key={i} x={g(a)} y={64 + i * 39} w={g(b) - g(a)} h={34} slot={slot} label={["Drums", "Bass", "Keys", "Vocal"][i]} shape={shape} seed={i} />
          ) : (
            <g key={i}>
              <rect x={g(a)} y={64 + i * 39} width={g(b) - g(a)} height={34} fill={["#ff5a4f", "#29b6ff", "#b388ff", "#ff5fa8"][i]} />
              <path d={wavePath(peaks(Math.round((g(b) - g(a)) / 2.2), i, shape), g(a) + 2, 78 + i * 39, g(b) - g(a) - 4, 18)} fill="#fff" opacity={0.9} />
            </g>
          )
        ))}
      </Panel>
    );
  },
};

const readableTimeline: Scene = {
  title: "Timeline at a glance", dur: 5.6,
  draw: (t) => {
    const now = t > 2.8;
    const scroll = keys(t, [[3.2, 0], [4.6, 3]]);
    const g = (b: number) => 20 + ((b - 1 - (now ? scroll : 0)) / 8) * 560;
    return (
      <Panel title="Timeline">
        <Era now={now} />
        <rect x={20} y={36} width={560} height={16} fill="#0a0908" stroke={D.border} />
        {now && <rect x={20 + ((now ? scroll : 0) / 14) * 560} y={36} width={(8 / 14) * 560} height={16} fill="rgba(168,141,251,.12)" stroke={D.violet} />}
        <Crop x={20} y={58} w={560} h={164}>
          <rect x={20} y={58} width={560} height={164} fill="#000" />
          {Array.from({ length: 64 }, (_, i) => {
            const x = g(1 + i / 4);
            const major = i % 4 === 0;
            return <line key={i} x1={x} x2={x} y1={58} y2={222} stroke={now ? (major ? "#2a2622" : "#121110") : major ? "#57514a" : "#3d3833"} />;
          })}
          {[[1, 6, 3], [3, 10, 4], [2, 5, 1], [6, 12, 6]].map(([a, b, slot], i) => (
            <Clip key={i} x={g(a)} y={64 + i * 39} w={g(b) - g(a)} h={34} slot={slot} label={["Drums", "Bass", "Keys", "Vocal"][i]} seed={i} shape="vox" waveOpacity={now ? 1 : 0.5} dim={now ? 0 : 0.5} />
          ))}
        </Crop>
      </Panel>
    );
  },
};

const museInspect: Scene = {
  title: "Muse inspects the session", dur: 5.4,
  draw: (t) => {
    const rows = [
      ["Audio health", "stream running, no underruns"],
      ["Project load", "every clip resolved"],
      ["Routing", "no loops, all inserts reachable"],
    ];
    return (
      <Panel title="Muse · connected to this session">
        <rect x={20} y={40} width={560} height={30} rx={3} fill={D.panel} stroke={D.border} />
        <Label x={30} y={60} size={11.5} color={D.t1}>{"Check this session before I bounce it.".slice(0, Math.floor(clamp(t / 1.2) * 38))}</Label>
        {rows.map(([a, b], i) => {
          const at = 1.6 + i * 0.9;
          return (
            <g key={a} opacity={k(t, at - 0.3, at)}>
              <rect x={20} y={86 + i * 40} width={560} height={34} rx={3} fill="#0f0d0c" stroke={D.border} />
              {t > at ? <Check x={34} y={104 + i * 40} p={k(t, at, at + 0.3)} /> : <circle cx={40} cy={103 + i * 40} r={5} fill="none" stroke={D.t3} strokeDasharray="3 3" />}
              <Label x={58} y={107 + i * 40} size={11.5} color={D.t1}>{a}</Label>
              <Label x={170} y={107 + i * 40} size={11} color={D.t3}>{t > at ? b : "reading…"}</Label>
            </g>
          );
        })}
      </Panel>
    );
  },
};

const crispText: Scene = {
  title: "Crisp text from anywhere", dur: 5,
  draw: (t) => {
    const now = t > 2.5;
    return (
      <g>
        <Panel title="Terminal">
          <Label x={24} y={52} size={11} mono color={D.t3}>~/Downloads $</Label>
          <Label x={124} y={52} size={11} mono color={D.t1}>./Aestra</Label>
          <Era now={now} />
          <rect x={24} y={70} width={552} height={150} rx={4} fill={D.panel} stroke={D.border} />
          <g style={{ filter: now ? "none" : "blur(0.9px)" }}>
            <text x={40} y={112} fontSize={now ? 22 : 21} fill={D.t1} style={{ fontFamily: now ? "var(--font-sans)" : "serif" }}>Night Drive</text>
            <text x={40} y={140} fontSize={now ? 12 : 12} fill={D.t2} style={{ fontFamily: now ? "var(--font-sans)" : "serif" }}>Position 1.1.1 · Tempo 112.00 BPM · Saved</text>
          </g>
          <Label x={40} y={200} size={10.5} color={now ? D.meter : D.warn}>{now ? "Bundled fonts found wherever Aestra starts." : "Launched outside the build folder: fallback font."}</Label>
        </Panel>
      </g>
    );
  },
};

const clipHeadroom: Scene = {
  title: "Audio clip editor: headroom and routing", dur: 5.6,
  draw: (t) => {
    const open = t > 1.4 && t < 3.4 ? k(t, 1.4, 1.7) : 0;
    const routed = t > 3.4;
    return (
      <Panel title="Audio Clip · Vocal">
        <rect x={20} y={40} width={560} height={90} fill="#050505" />
        <path d={wavePath(peaks(200, 3, "vox"), 20, 48, 560, 74)} fill={tone(6).ink} opacity={0.7} />
        <line x1={20} x2={580} y1={48} y2={48} stroke={D.warn} strokeOpacity={0.4} strokeDasharray="3 3" />
        <line x1={20} x2={580} y1={122} y2={122} stroke={D.warn} strokeOpacity={0.4} strokeDasharray="3 3" />
        <Label x={576} y={60} size={9} anchor="end" mono color={D.t3}>HEADROOM KEPT BY DEFAULT</Label>
        <Label x={20} y={158} size={10.5} color={D.t2}>Source output</Label>
        <Button x={120} y={144} w={160} h={22} label={routed ? "Insert 4 · Vocal Bus" : "Master"} on={routed} ink={routed ? "#fff" : undefined} />
        <Menu x={120} y={170} w={160} open={open} hover={t > 2.4 ? 3 : -1} items={["Master", "Insert 1 · Drums", "Insert 2 · Bass", "Insert 4 · Vocal Bus"]} />
        <Cursor x={t < 1.4 ? lerp(300, 200, k(t, 0, 1.4)) : 200} y={t < 2.4 ? 155 : 250 - 0 * t} />
      </Panel>
    );
  },
};

const searchRoute: Scene = {
  title: "Searchable routing", dur: 5,
  draw: (t) => {
    const q = "voc".slice(0, Math.floor(k(t, 0.8, 1.6) * 3 + (t > 0.8 ? 1 : 0)));
    const all = ["Master", "Insert 1 · Drums", "Insert 2 · Bass", "Insert 3 · Keys", "Insert 4 · Vocal Bus", "Insert 5 · Vocal FX"];
    const list = all.filter((n) => !q || n.toLowerCase().includes(q));
    const picked = t > 3;
    return (
      <Panel title="Audio Clip Editor">
        <rect x={20} y={40} width={250} height={180} fill={D.panel} stroke={D.border} />
        <rect x={30} y={50} width={230} height={26} rx={3} fill={D.control} stroke={q ? D.violet : D.borderStrong} />
        <Label x={40} y={67} size={11} color={q ? D.t1 : D.t4}>{q || "Route to…"}</Label>
        {list.map((n, i) => (
          <g key={n}>
            {picked && n === "Insert 4 · Vocal Bus" && <rect x={30} y={84 + i * 22} width={230} height={20} rx={2} fill={D.primary} />}
            <Label x={40} y={98 + i * 22} size={11} color={D.t1}>{n}</Label>
          </g>
        ))}
        <g transform="translate(290 40)">
          <rect x={0} y={0} width={290} height={180} fill="#000" />
          {[0, 1, 2].map((i) => <Clip key={i} x={10 + i * 70} y={20 + i * 40} w={140} h={32} slot={6} label={`Vocal ${i + 1}`} seed={i} />)}
          <Label x={10} y={170} size={10} color={D.t3}>Clips arranged freely; one shared source.</Label>
        </g>
      </Panel>
    );
  },
};

/* ── fix ───────────────────────────────────────────────────────────── */

const noFollow: Scene = {
  title: "Follow off by default; reverb navigator", dur: 6.4,
  draw: (t) => {
    const follow = t > 2.2 && t < 4;
    const ph = (t * 1.6) % 8;
    const page = follow ? Math.floor(ph / 4) * 4 : 0;
    const bx = (b: number) => rollX(20, 560, 4)(b - page);
    const notes: Note[] = [{ s: 0, l: 1, p: 5 }, { s: 1.5, l: 1, p: 7 }, { s: 2.5, l: 1.5, p: 3 }];
    const mode = t < 4.6 ? 0 : t < 5.4 ? 1 : 2;
    return (
      <g>
        <Panel x={8} y={8} w={584} h={150} title="Piano Roll" right={<Button x={450} y={11} w={60} h={16} size={9} label="Follow" on={follow} ink={follow ? "#fff" : undefined} />}>
          <Roll x={20} y={40} w={560} h={110} rows={8} beats={4} notes={notes.map((n) => ({ ...n, s: n.s - page }))} />
          {bx(ph) <= 580 && <Playhead x={bx(ph)} y={40} h={110} />}
        </Panel>
        <Panel x={8} y={166} w={584} h={66} title="Aestra Verb · bottom deck">
          <Label x={24} y={218} size={11} color={D.t2}>Mode</Label>
          <Button x={70} y={202} w={22} h={22} label="‹" pressed={within(t, 5.4, 5.6) ? 1 : 0} />
          <Label x={130} y={218} size={12} anchor="middle" color={D.t1}>{["Room", "Hall", "Plate"][mode]}</Label>
          <Button x={168} y={202} w={22} h={22} label="›" pressed={within(t, 4.6, 4.8) ? 1 : 0} />
        </Panel>
        <Label x={140} y={24} size={9} mono color={D.t3}>{follow ? "FOLLOW ON: THE VIEW PAGES" : "YOU EDIT; THE VIEW STAYS PUT"}</Label>
      </g>
    );
  },
};

const soloMaster: Scene = {
  title: "Solo silences direct-to-Master clips", dur: 5,
  draw: (t) => {
    const solo = t > 1.4;
    const g = grid(8, 150, 400);
    const lvl = (on: boolean, s: number) => (on ? 0.55 + 0.25 * Math.abs(Math.sin(t * 7 + s)) : 0);
    return (
      <Panel title="Timeline">
        {[["Drums", 3, "via Drums bus"], ["Keys", 1, "via Keys bus"], ["FX Riser", 5, "straight to Master"]].map(([n, slot, route], i) => {
          const y = 44 + i * 58;
          const live = !solo || i === 0;
          return (
            <g key={i}>
              <TrackHead x={20} y={y} w={128} h={50} n={i + 1} name={n as string} slot={slot as number} solo={solo && i === 0} />
              <Clip x={g(1)} y={y + 4} w={400} h={42} slot={slot as number} seed={i} shape="vox" cols={120} dim={live ? 0 : 1} />
              <Label x={g(1) + 400 - 6} y={y + 40} size={9} anchor="end" mono color={D.t2}>{route}</Label>
              <Meter x={560} y={y + 6} h={38} level={lvl(live, i)} w={6} />
            </g>
          );
        })}
        <Label x={20} y={224} size={10.5} color={D.t3} opacity={k(t, 1.6, 2)}>Solo matches what an isolated bounce of that track delivers.</Label>
      </Panel>
    );
  },
};

const masterEffects: Scene = {
  title: "Master hosts effects; levels hold", dur: 5.4,
  draw: (t) => {
    const lvl = 0.7 + 0.12 * Math.sin(t * 9);
    const inserts = ["EQ", "Comp", "Limit"].filter((_, i) => t > 1 + i * 0.7);
    return (
      <Panel title="Mixer">
        <Strip x={40} y={36} h={192} name="Keys" slot={1} level={lvl} inserts={["EQ"]} />
        <Strip x={116} y={36} h={192} name="Keys Bus" slot={1} level={lvl} inserts={[]} />
        <Strip x={210} y={36} h={192} name="Master" slot={7} level={lvl} inserts={inserts} sel />
        <g transform="translate(310 60)">
          <Label x={0} y={0} size={11} color={D.t1}>Through the bus: same level as direct.</Label>
          <Label x={0} y={22} size={11} color={D.t1}>Master takes effects like any channel.</Label>
          <Label x={0} y={44} size={11} color={D.t1}>Automation lanes automate again.</Label>
          <Label x={0} y={66} size={11} color={D.t1}>Remove and re-add: the insert area</Label>
          <Label x={0} y={82} size={11} color={D.t1}>doesn't stick.</Label>
        </g>
      </Panel>
    );
  },
};

const routingUndo: Scene = {
  title: "Undoable routing, loops blocked", dur: 6,
  draw: (t) => {
    const A = { x: 110, y: 120 };
    const B = { x: 300, y: 120 };
    const C = { x: 490, y: 120 };
    const draw1 = k(t, 0.4, 1.2);
    const undone = t > 1.8 && t < 2.6;
    const loopTry = k(t, 3.2, 4);
    const blocked = t > 4;
    const node = (p: { x: number; y: number }, n: string) => (
      <g>
        <rect x={p.x - 50} y={p.y - 22} width={100} height={44} rx={4} fill={D.panel} stroke={D.border} />
        <Label x={p.x} y={p.y + 4} size={11.5} anchor="middle" color={D.t1}>{n}</Label>
      </g>
    );
    return (
      <Panel title="Routing">
        {node(A, "Drums")}
        {node(B, "Bus A")}
        {node(C, "Bus B")}
        <path d={`M${B.x + 50} ${B.y}H${C.x - 50}`} stroke={D.t3} strokeWidth={1.5} />
        {!undone && <path d={`M${A.x + 50} ${A.y}H${lerp(A.x + 50, B.x - 50, draw1)}`} stroke={D.violet} strokeWidth={2} />}
        {t > 3.2 && (
          <path d={`M${C.x} ${C.y + 22}V${C.y + 60}H${lerp(C.x, A.x, loopTry)}${loopTry > 0.99 ? `V${A.y + 22}` : ""}`} stroke={blocked ? D.error : D.t2} strokeWidth={2} fill="none" strokeDasharray={blocked ? "5 4" : undefined} />
        )}
        {blocked && <Label x={300} y={206} size={11} anchor="middle" color={D.error}>Bus B → Drums would loop. Blocked.</Label>}
        <Keycap x={24} y={36} label="Ctrl+Z" on={within(t, 1.8, 2.1)} />
        <Keycap x={84} y={36} label="Ctrl+Y" on={within(t, 2.6, 2.9)} />
        <Label x={150} y={51} size={10.5} color={D.t3}>{t < 3.2 ? "Reroutes and sends undo like any edit" : ""}</Label>
      </Panel>
    );
  },
};

const bounceSends: Scene = {
  title: "Solo bounce with sends", dur: 5.4,
  draw: (t) => {
    const now = t > 2.7;
    const len = k(now ? t - 2.7 : t, 0.3, 2);
    const g = grid(6, 20, 560);
    const dry = peaks(120, 5, "keys");
    const tail = Array.from({ length: 60 }, (_, i) => 0.35 * Math.exp(-i / 18));
    const p = now ? [...dry, ...tail] : [...dry, ...tail.map(() => 0)];
    const shown = p.slice(0, Math.floor(p.length * len));
    return (
      <Panel title="Bounce · Keys (solo)">
        <Era now={now} />
        <Ruler x={20} y={38} w={560} bars={6} />
        <Bed x={20} y={56} w={560} h={110} bars={6} />
        <path d={wavePath(shown.length > 1 ? shown : [0, 0], 20, 70, (shown.length / p.length) * 560, 80)} fill={now ? D.meter : D.t2} opacity={0.8} />
        <rect x={g(5)} y={60} width={g(7) - g(5)} height={100} fill="none" stroke={now ? D.meter : D.warn} strokeDasharray="4 3" opacity={len > 0.9 ? 1 : 0} />
        <Label x={g(5) + 6} y={176} size={10} color={now ? D.meter : D.warn} opacity={len > 0.9 ? 1 : 0}>{now ? "reverb return included" : "send return missing"}</Label>
        <Label x={20} y={214} size={10.5} color={D.t3}>The bounce matches the full mix, return path and all.</Label>
      </Panel>
    );
  },
};

const bounceSpeed: Scene = {
  title: "Solo bounce at clip speed", dur: 5,
  draw: (t) => {
    const now = t > 2.5;
    const g = grid(8, 20, 560);
    const bounceLen = now ? 4 : 6;
    const p = ek(now ? t - 2.5 : t, 0.3, 1.6);
    return (
      <Panel title="Timeline">
        <Era now={now} />
        <Ruler x={20} y={38} w={560} bars={8} />
        <Bed x={20} y={56} w={560} h={160} bars={8} />
        <Label x={24} y={74} size={9.5} mono color={D.t3}>LIVE · SPEED 1.50×</Label>
        <Clip x={g(1)} y={80} w={g(5) - g(1)} h={44} slot={2} label="Guitar" shape="keys" seed={4} cols={120} />
        <Label x={24} y={148} size={9.5} mono color={D.t3}>SOLO BOUNCE</Label>
        <Clip x={g(1)} y={154} w={(g(1 + bounceLen) - g(1)) * p} h={44} slot={2} label="Guitar (bounce)" shape="keys" seed={4} cols={120} />
        <line x1={g(5)} x2={g(5)} y1={76} y2={204} stroke={now ? D.meter : D.warn} strokeDasharray="3 3" />
      </Panel>
    );
  },
};

const deleteNoCrash: Scene = {
  title: "Delete clips safely", dur: 5,
  draw: (t) => {
    const g = grid(8, 20, 560);
    const clips = [[1, 3, 60, 3], [3.5, 6, 60, 3], [2, 5, 104, 4], [5.5, 8, 104, 4], [1, 4, 148, 6], [4.5, 9, 148, 6]];
    const gone = (i: number) => t > 0.8 + i * 0.35;
    return (
      <Panel title="Timeline">
        <Bed x={20} y={40} w={560} h={150} bars={8} />
        {clips.map(([a, b, y, slot], i) => (
          <g key={i} opacity={gone(i) ? 1 - k(t, 0.8 + i * 0.35, 1 + i * 0.35) : 1}>
            <Clip x={g(a)} y={y} w={g(b) - g(a)} h={38} slot={slot} seed={i} sel={t > 0.5} />
          </g>
        ))}
        <Keycap x={20} y={204} label="Del" on={Math.floor((t - 0.8) / 0.35) >= 0 && (t - 0.8) % 0.35 < 0.12 && t < 3} />
        <Label x={60} y={219} size={10.5} color={D.t3}>Deleting while the timeline refreshes: no crash, no half-drawn clips.</Label>
        {t > 3.2 && <Check x={540} y={210} p={k(t, 3.2, 3.6)} />}
      </Panel>
    );
  },
};

const trimSurvives: Scene = {
  title: "Trims survive reopen", dur: 5.4,
  draw: (t) => {
    const end = keys(t, [[0.5, 7], [1.6, 5.2]]);
    const g = grid(8, 20, 560);
    const reopen = t > 2.2 && t < 3.4;
    const fade = reopen ? 1 - Math.sin(k(t, 2.2, 3.4) * Math.PI) : 1;
    return (
      <g>
        <g opacity={fade}>
          <Panel title="Timeline">
            <Bed x={20} y={40} w={560} h={180} bars={8} />
            <Clip x={g(2)} y={100} w={g(end) - g(2)} h={50} slot={1} label="Keys" shape="keys" seed={3} cols={140} to={(end - 2) / 5} />
            <rect x={g(end) - 3} y={110} width={6} height={30} rx={2} fill={D.t1} opacity={t < 2 ? 1 : 0} />
            {t > 3.4 && <g><Check x={g(end) + 10} y={124} p={k(t, 3.4, 3.8)} /><Label x={g(end) + 30} y={130} size={10.5} color={D.meter}>still trimmed</Label></g>}
          </Panel>
        </g>
        {reopen && <Label x={W / 2} y={120} size={12} anchor="middle" mono color={D.t2} opacity={1 - fade}>SAVE · CLOSE · REOPEN</Label>}
        {t < 2 && <Cursor x={g(end)} y={125} hand />}
      </g>
    );
  },
};

const dragNoJump: Scene = {
  title: "Clips follow the drag", dur: 5.4,
  draw: (t) => {
    const now = t > 2.7;
    const tt = now ? t - 2.7 : t;
    const c = path2(tt, [[0.3, 200, 90], [1.8, 380, 150]]);
    const grab = 60;
    const jump = !now && tt > 0.3 ? 38 : 0;
    return (
      <Panel title="Timeline">
        <Era now={now} />
        <Bed x={20} y={40} w={560} h={180} bars={8} />
        <Clip x={c.x - grab + jump} y={c.y - 16} w={160} h={36} slot={4} label="Bass" shape="bass" seed={2} sel />
        <Cursor x={c.x} y={c.y} hand />
        <Label x={20} y={224} size={10.5} color={now ? D.meter : D.warn}>{now ? "The clip stays under your hand." : "The clip jumped away from the pointer."}</Label>
      </Panel>
    );
  },
};

const inputRouting: Scene = {
  title: "Input lands where you click", dur: 5.4,
  draw: (t) => {
    const g = grid(8, 20, 560);
    const menu = t > 0.8 && t < 2.2 ? k(t, 0.8, 1.05) : 0;
    const looped = t > 2.2;
    const c = path2(t, [[0, 400, 220], [0.6, 260, 110], [0.8, 260, 110], [1.6, 300, 152], [2, 300, 152], [3, 100, 45], [3.3, 100, 45]]);
    return (
      <Panel title="Timeline">
        <Ruler x={20} y={38} w={560} bars={8} />
        {looped && <rect x={g(2)} y={38} width={g(6) - g(2)} height={8} fill={D.primary} opacity={ek(t, 2.2, 2.6)} />}
        <Bed x={20} y={56} w={560} h={160} bars={8} />
        <Clip x={g(2)} y={90} w={g(6) - g(2)} h={40} slot={1} label="Keys" seed={2} shape="keys" sel={t > 0.8} />
        <Menu x={260} y={110} w={160} open={menu} hover={t > 1.5 ? 2 : -1} items={["Split", "Duplicate", "Loop this clip", { label: "Delete", danger: true }]} />
        <Label x={20} y={230} size={10.5} color={D.t3}>Right-click, pick, done: menus and dialogs take the click you gave them.</Label>
        <Cursor x={c.x} y={c.y} down={within(t, 0.8, 1.1) ? k(t, 0.8, 1.1) : within(t, 2, 2.3) ? k(t, 2, 2.3) : 0} />
      </Panel>
    );
  },
};

const menusTooltips: Scene = {
  title: "Select menus and tooltips", dur: 5.4,
  draw: (t) => {
    const open = t > 0.7 && t < 2.6 ? k(t, 0.7, 0.95) : 0;
    const items = ["44.1 kHz", "48 kHz", "88.2 kHz", "96 kHz", "176.4 kHz", "192 kHz"];
    const tipX = Math.min(578 - 150, 540 - 75);
    return (
      <Panel title="Audio settings">
        <Label x={30} y={58} size={11} color={D.t2}>Sample rate</Label>
        <Button x={120} y={44} w={140} h={22} label={t > 2.4 ? "96 kHz  ▾" : "48 kHz  ▾"} />
        <Menu x={120} y={70} w={140} open={open} hover={t > 1.8 ? 3 : 1} items={items} />
        <Label x={280} y={58} size={10} color={D.t3} opacity={open}>One click. Every option reachable.</Label>
        <Button x={520} y={190} w={56} h={22} label="Apply" />
        <g opacity={k(t, 3.4, 3.7)}>
          <rect x={tipX} y={150} width={150} height={26} rx={3} fill={D.raised} stroke={D.borderStrong} />
          <Label x={tipX + 10} y={167} size={10.5} color={D.t1}>Apply and restart audio</Label>
        </g>
        <Label x={30} y={220} size={10} color={D.t3} opacity={k(t, 3.6, 4)}>Tooltips stay on screen and stop flickering.</Label>
        <Cursor x={t < 3 ? 190 : 548} y={t < 3 ? (t > 1.8 ? 150 : 56) : 200} down={within(t, 0.7, 1) ? k(t, 0.7, 1) : 0} />
      </Panel>
    );
  },
};

export const V070: Record<string, Scene> = {
  "v0.7.0-alpha:one-shot-samples-now-stop-when": oneShotStops,
  "v0.7.0-alpha:now-you-can-split-an-audio": splitNoGap,
  "v0.7.0-alpha:you-can-now-split-a-selected": splitNote,
  "v0.7.0-alpha:you-can-now-stretch-a-selected": stretchPhrase,
  "v0.7.0-alpha:sampler-ping-pong-loops-now-play": pingPong,
  "v0.7.0-alpha:you-can-now-shift-drag-to": chordPaint,
  "v0.7.0-alpha:piano-roll-harmony-choices-now-stay": harmonyStays,
  "v0.7.0-alpha:routing-through-more-mixer-channels-no": routingLevel,
  "v0.7.0-alpha:aestra-eq-now-opens-on-a": eqClean,
  "v0.7.0-alpha:you-can-now-pitch-audio-clips": pitchClips,
  "v0.7.0-alpha:on-windows-a-crashing-plugin-no": crashIsolated,
  "v0.7.0-alpha:timeline-clips-are-easier-on-the": easierClips,
  "v0.7.0-alpha:the-timeline-is-easier-to-read": readableTimeline,
  "v0.7.0-alpha:now-muse-can-inspect-audio-health": museInspect,
  "v0.7.0-alpha:aestra-now-renders-its-intended-crisp": crispText,
  "v0.7.0-alpha:now-you-can-edit-audio-clips": clipHeadroom,
  "v0.7.0-alpha:now-you-can-arrange-clips-freely": searchRoute,
  "v0.7.0-alpha:the-piano-roll-view-no-longer": noFollow,
  "v0.7.0-alpha:soloing-a-track-now-silences-clips": soloMaster,
  "v0.7.0-alpha:routing-audio-through-a-mixer-channel": masterEffects,
  "v0.7.0-alpha:routing-changes-are-now-undoable-ctrlz": routingUndo,
  "v0.7.0-alpha:solo-bouncing-a-track-now-includes": bounceSends,
  "v0.7.0-alpha:solo-bouncing-a-clip-with-speed": bounceSpeed,
  "v0.7.0-alpha:deleting-clips-no-longer-risks-crashing": deleteNoCrash,
  "v0.7.0-alpha:now-you-can-trim-clips-and": trimSurvives,
  "v0.7.0-alpha:dragging-timeline-clips-no-longer-jumps": dragNoJump,
  "v0.7.0-alpha:timeline-selection-context-menus-looping-and": inputRouting,
  "v0.7.0-alpha:select-menus-no-longer-hide-reachable": menusTooltips,
};

