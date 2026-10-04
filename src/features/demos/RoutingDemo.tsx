import React, { useRef, useState } from "react";
import { useSession } from "../session";
import { ROWS, type Row, type Route } from "../engine";
import { useFrame, useVisible } from "../hooks";
import { Panel, ROW_META, rowColor } from "./shared";

/* The routing graph, after the v0.8.1 design: sources, a bus, a master
   rail. Select a source, send it somewhere else, and hear the difference.
   Lines light up with the real level of each sound. */

const W = 680;
const H = 310;
const SRC_X = 14, SRC_W = 168, NODE_H = 34;
const srcY = (i: number) => 18 + i * 56;
const BUS = { x: 268, y: srcY(1) - 8, w: 168 };
const RAIL_X = 600;
const tapY = (k: "bus" | Row) => (k === "bus" ? 116 : 232);

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = Math.max(40, (x2 - x1) / 2);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
};

type Sel = Row | "bus" | null;

export const RoutingDemo = () => {
  const { state, change, engine, playing } = useSession();
  const { routes, muted, busLevel } = state;
  const [sel, setSel] = useState<Sel>(null);
  const [msg, setMsg] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const visible = useVisible(box);
  const lines = useRef<Partial<Record<Row | "bus", SVGPathElement | null>>>({});
  const pins = useRef<Partial<Record<Row, HTMLElement | null>>>({});
  const meters = useRef<(HTMLElement | null)[]>([]);

  useFrame(() => {
    let drums = 0;
    let all = 0;
    for (const row of ROWS) {
      const lv = engine.level(row);
      all = Math.max(all, lv);
      if (routes[row] === "drums") drums = Math.max(drums, lv);
      const p = lines.current[row];
      if (p) { p.style.strokeOpacity = String(0.25 + lv * 0.75); p.style.strokeWidth = String(1.5 + lv * 2); }
      const pin = pins.current[row];
      if (pin) { pin.style.background = lv > 0.04 ? "#3fd6ad" : "#0c0b0a"; pin.style.borderColor = lv > 0.04 ? "#3fd6ad" : "#857d72"; }
    }
    const b = lines.current.bus;
    if (b) { b.style.strokeOpacity = String(0.25 + drums * 0.75); b.style.strokeWidth = String(1.5 + drums * 2); }
    meters.current.forEach((m, i) => { if (m) m.style.height = `${Math.min(100, (all * (i ? 0.92 : 1) * 100))}%`; });
  }, visible && playing, 30);

  const send = (row: Row, to: Route) => {
    setMsg("");
    change((s) => ({ ...s, routes: { ...s.routes, [row]: to } }), `Sent ${ROW_META[row].name.toLowerCase()} to ${to === "drums" ? "Drum Bus" : "Master"}`);
  };

  const rowNames = ROWS.filter((r) => routes[r] === "drums").map((r) => ROW_META[r].name);

  return (
    <Panel title="Routing · signal flow" tag="Design preview">
      <div ref={box} className="overflow-x-auto">
        <div className="relative" style={{ width: W, height: H, margin: "0 auto" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0" aria-hidden="true">
            {ROWS.map((row, i) => {
              const y = srcY(i) + NODE_H / 2;
              const toBus = routes[row] === "drums";
              const d = toBus ? curve(SRC_X + SRC_W, y, BUS.x, BUS.y + NODE_H / 2) : curve(SRC_X + SRC_W, y, RAIL_X, tapY(row));
              return <path key={row} ref={(el) => { lines.current[row] = el; }} d={d} fill="none" stroke={rowColor(row)} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />;
            })}
            <path ref={(el) => { lines.current.bus = el; }} d={curve(BUS.x + BUS.w, BUS.y + NODE_H / 2, RAIL_X, tapY("bus"))} fill="none" stroke="#aca397" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
            <text x={SRC_X} y={10} fill="#57514a" fontSize="9" letterSpacing="1.4" fontFamily="var(--font-mono, monospace)">SOURCES</text>
            <text x={BUS.x} y={10} fill="#57514a" fontSize="9" letterSpacing="1.4" fontFamily="var(--font-mono, monospace)">BUSES</text>
            <circle cx={RAIL_X} cy={tapY("bus")} r="4.5" fill="#0c0b0a" stroke="#857d72" strokeWidth="1.5" />
            <circle cx={RAIL_X} cy={tapY("bass")} r="4.5" fill="#0c0b0a" stroke="#857d72" strokeWidth="1.5" />
          </svg>

          {ROWS.map((row, i) => {
            const m = muted.includes(row);
            return (
              <button
                key={row}
                type="button"
                onClick={() => { setSel(sel === row ? null : row); setMsg(""); }}
                aria-pressed={sel === row}
                aria-label={`${ROW_META[row].name}. Choose where it goes.`}
                style={{
                  all: "unset", boxSizing: "border-box", position: "absolute", left: SRC_X, top: srcY(i), width: SRC_W, height: NODE_H, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 12, fontWeight: 500,
                  background: "#1c1a17", border: "1px solid " + (sel === row ? "#7c3aed" : "#2e2a26"), boxShadow: sel === row ? "0 0 0 1px #7c3aed" : "none", borderRadius: 2, opacity: m ? 0.4 : 1,
                }}
              >
                <span style={{ width: 10, height: 10, background: rowColor(row) }} />
                {ROW_META[row].name}
                <i ref={(el) => { pins.current[row] = el; }} style={{ position: "absolute", right: -5, top: 12, width: 9, height: 9, borderRadius: "50%", border: "1.5px solid #857d72", background: "#0c0b0a", boxSizing: "border-box" }} />
              </button>
            );
          })}

          {(
            <button
              type="button"
              onClick={() => { setSel(sel === "bus" ? null : "bus"); setMsg(""); }}
              aria-pressed={sel === "bus"}
              aria-label="Drum Bus. Choose where it goes."
              style={{
                all: "unset", boxSizing: "border-box", position: "absolute", left: BUS.x, top: BUS.y, width: BUS.w, height: NODE_H, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 12, fontWeight: 500,
                background: "#1c1a17", border: "1px solid " + (sel === "bus" ? "#7c3aed" : "#2e2a26"), boxShadow: sel === "bus" ? "0 0 0 1px #7c3aed" : "none", borderRadius: 2, opacity: rowNames.length ? 1 : 0.45,
              }}
            >
              <span style={{ width: 10, height: 10, background: ROW_META.snare.color }} />
              Drum Bus
              <span style={{ marginLeft: "auto", fontSize: 9, letterSpacing: "0.12em", color: "#857d72" }}>BUS</span>
            </button>
          )}
          {(
            <label style={{ position: "absolute", left: BUS.x, top: BUS.y + NODE_H + 8, width: BUS.w, fontSize: 10, color: "#857d72", display: "block" }}>
              Bus level
              <input type="range" min={0} max={1} step={0.01} value={busLevel} onChange={(e) => change((s) => ({ ...s, busLevel: +e.target.value }))} style={{ width: "100%", accentColor: "#7c3aed", display: "block" }} />
            </label>
          )}

          <div style={{ position: "absolute", left: RAIL_X - 22, top: 22, width: 44, height: 256, boxSizing: "border-box", background: "#141210", border: "1px solid #2e2a26", borderRadius: 2 }}>
            <span style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontSize: 9, letterSpacing: "0.2em", color: "#aca397", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 64, margin: "0 auto" }}>MASTER</span>
            {[0, 1].map((k) => (
              <div key={k} style={{ position: "absolute", bottom: 12, left: 14 + k * 10, width: 6, height: 110, background: "#25221f" }}>
                <i ref={(el) => { meters.current[k] = el; }} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "0%", background: "#3fd6ad" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1" style={{ minHeight: 86 }}>
        {sel && sel !== "bus" && (
          <div>
            <p className="dcap m-0 mb-2">Send {ROW_META[sel].name} to</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`dbtn ${routes[sel] === "drums" ? "on" : ""}`} onClick={() => send(sel, "drums")}>Drum Bus</button>
              <button type="button" className={`dbtn ${routes[sel] === "master" ? "on" : ""}`} onClick={() => send(sel, "master")}>Master</button>
              <button type="button" className="dbtn" aria-pressed={muted.includes(sel)} onClick={() => change((s) => ({ ...s, muted: s.muted.includes(sel) ? s.muted.filter((x) => x !== sel) : [...s.muted, sel] }))}>
                {muted.includes(sel) ? "Unmute" : "Mute"}
              </button>
            </div>
          </div>
        )}
        {sel === "bus" && (
          <div>
            <p className="dcap m-0 mb-2">Send Drum Bus to</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="dbtn on">Master</button>
              {rowNames.map((n) => (
                <button key={n} type="button" className="dbtn" style={{ opacity: 0.55, background: "repeating-linear-gradient(135deg,#1c1a17 0 6px,#141210 6px 12px)" }} onClick={() => setMsg(`${rowNames.join(", ")} feed Drum Bus, so routing it into ${n} would loop. They refuse the drop and say why.`)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
        {!sel && <p className="dnote m-0 pt-2">Click a sound to choose where it goes, then play. Try sending the hats straight to Master.</p>}
        {msg && <p className="m-0 mt-3 text-[12px]" role="status" style={{ color: "#ff6b4f" }}>{msg}</p>}
      </div>
    </Panel>
  );
};
