import React from "react";
import { useSession, useStep, toggleCell } from "../session";
import { ROWS, STEPS, defaultGrid, emptyGrid, type Grid, type Row } from "../engine";
import { Panel, PlayDot, ROW_META, rowColor } from "./shared";

const on = (...n: number[]) => Array.from({ length: STEPS }, (_, i) => n.includes(i));
const KITS: { name: string; sub: string; grid: () => Grid; bpm: number }[] = [
  { name: "Boom bap", sub: "Night Drive · 92", grid: defaultGrid, bpm: 92 },
  { name: "Four on the floor", sub: "Kick, snare, hats · 124", grid: () => ({ kick: on(0, 4, 8, 12), snare: on(4, 12), hat: on(2, 6, 10, 14), bass: on(0, 3, 8, 11) }), bpm: 124 },
  { name: "Broken beat", sub: "Swung 16ths · 98", grid: () => ({ kick: on(0, 7, 10), snare: on(4, 13), hat: on(0, 3, 6, 8, 11, 14), bass: on(0, 7, 10) }), bpm: 98 },
  { name: "Empty rack", sub: "Start from nothing", grid: emptyGrid, bpm: 92 },
];

/* Arsenal: the rack you play. Rows are sounds, columns are steps. */
export const LoopDemo = () => {
  const { state, change, playing, toggle, reset } = useSession();
  const step = useStep();
  const { grid, bpm, muted } = state;

  const flip = (row: Row, i: number) =>
    change((s) => ({ ...s, grid: toggleCell(s.grid, row, i) }), `${grid[row][i] ? "Removed" : "Added"} ${ROW_META[row].name.toLowerCase()} at step ${i + 1}`);

  return (
    <Panel
      title="Arsenal · Night Drive"
      tag="Illustration"
      right={
        <span className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[12px]" style={{ color: "#aca397" }}>
            <input
              type="range" min={70} max={140} value={bpm} aria-label="Tempo in beats per minute"
              onChange={(e) => change((s) => ({ ...s, bpm: +e.target.value }))}
              onPointerUp={() => change((s) => s, `Set tempo ${bpm}`)}
              style={{ width: 90, accentColor: "#7c3aed" }}
            />
            <span style={{ color: "#eee9e1", fontVariantNumeric: "tabular-nums", minWidth: 62 }}><b>{bpm}</b> BPM</span>
          </label>
          <PlayDot playing={playing} onClick={() => { void toggle(); }} />
        </span>
      }
    >
      <div className="p-3 sm:p-4">
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: "92px 1fr" }}>
          {ROWS.map((row) => (
            <React.Fragment key={row}>
              <div className="flex items-center gap-2 pr-2" style={{ height: 38 }}>
                <span style={{ width: 8, height: 24, background: rowColor(row), flexShrink: 0 }} />
                <span className="text-[13px] font-semibold" style={{ opacity: muted.includes(row) ? 0.4 : 1 }}>{ROW_META[row].name}</span>
                <button
                  type="button"
                  className="ml-auto"
                  aria-pressed={muted.includes(row)}
                  aria-label={`Mute ${ROW_META[row].name}`}
                  onClick={() => change((s) => ({ ...s, muted: s.muted.includes(row) ? s.muted.filter((m) => m !== row) : [...s.muted, row] }), `${muted.includes(row) ? "Unmuted" : "Muted"} ${ROW_META[row].name.toLowerCase()}`)}
                  style={{ all: "unset", cursor: "pointer", width: 20, height: 20, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, border: "1px solid " + (muted.includes(row) ? "#f3a93b" : "#2e2a26"), background: muted.includes(row) ? "#f3a93b" : "transparent", color: muted.includes(row) ? "#0c0b0a" : "#857d72", borderRadius: 2 }}
                >M</button>
              </div>
              <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${STEPS}, minmax(0, 1fr))` }}>
                {Array.from({ length: STEPS }, (_, i) => {
                  const lit = grid[row][i];
                  const here = step === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      className="pad"
                      aria-pressed={lit}
                      aria-label={`${ROW_META[row].name}, step ${i + 1}`}
                      onClick={() => flip(row, i)}
                      style={{
                        height: 38,
                        marginLeft: i > 0 && i % 4 === 0 ? 5 : 0,
                        background: lit ? rowColor(row) : here ? "#2e2a26" : "#1c1a17",
                        opacity: lit ? (here ? 1 : 0.9) : 1,
                        boxShadow: here ? "inset 0 0 0 1.5px #eee9e1" : "none",
                      }}
                    />
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Starting kits">
          {KITS.map((k) => (
            <button key={k.name} type="button" className="dbtn" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2, padding: "7px 12px", minHeight: 0 }} onClick={() => reset(k.grid(), k.bpm, `Loaded ${k.name}`)}>
              <span>{k.name}</span>
              <span style={{ fontSize: 10, fontWeight: 400, color: "#857d72" }}>{k.sub}</span>
            </button>
          ))}
        </div>
        <p className="dnote mt-4 mb-0">Click a pad, then press play. Everything you change here is heard in the other tracks too.</p>
      </div>
    </Panel>
  );
};
