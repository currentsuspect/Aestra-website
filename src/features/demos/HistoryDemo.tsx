import React, { useState } from "react";
import { useSession, type Branch, type Version } from "../session";
import { Panel } from "./shared";

/* History, after the v0.8.1 timeline: every change is a step you can go back
   to; a version is a step you kept, on a branch. */

const X0 = 96, DX = 74, LANE = 54, TOP = 46;
const hhmm = (t: number) => (t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "now");

export const HistoryDemo = () => {
  const { steps, cursor, goToStep, versions, branches, saveVersion, newBranch, restoreVersion } = useSession();
  const [name, setName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [active, setActive] = useState<string>("main");

  // x position of each version by creation order, plus a leading "Start" on Main.
  const nodes = versions.map((v, i) => ({ v, x: X0 + (i + 1) * DX }));
  const lane = (b: string) => Math.max(0, branches.findIndex((x) => x.id === b));
  const ly = (b: string) => TOP + lane(b) * LANE;
  const W = Math.max(520, X0 + (versions.length + 1) * DX + 60);
  const H = TOP + branches.length * LANE + 14;
  const colorOf = (b: string) => branches.find((x) => x.id === b)?.color ?? "#7c3aed";

  const nodeById = (id: number | null) => nodes.find((n) => n.v.id === id);

  const save = () => { saveVersion(name, active); setName(""); };
  const branch = () => { newBranch(branchName); setBranchName(""); setActive(`b${branches.length}`); };

  return (
    <Panel title="History · Night Drive" tag="Design preview">
      <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div style={{ borderRight: "1px solid #2e2a26" }}>
          <div className="overflow-x-auto p-3">
            <svg width={W} height={H} role="img" aria-label="Versions on branches">
              {branches.map((b: Branch) => (
                <g key={b.id}>
                  <text x="0" y={ly(b.id) + 4} fill="#aca397" fontSize="12">{b.name}</text>
                  <circle cx="82" cy={ly(b.id)} r="3" fill={b.color} />
                </g>
              ))}
              <line x1={X0} x2={W - 24} y1={ly("main")} y2={ly("main")} stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
              <circle cx={X0} cy={ly("main")} r="7" fill="#141210" stroke="#7c3aed" strokeWidth="3" />
              <text x={X0} y={ly("main") - 14} textAnchor="middle" fill="#eee9e1" fontSize="11" fontWeight="600">Start</text>
              {nodes.map(({ v, x }) => {
                const p = nodeById(v.parent);
                const px = p ? p.x : X0;
                const py = p ? ly(p.v.branch) : ly("main");
                const y = ly(v.branch);
                const c = colorOf(v.branch);
                return (
                  <g key={v.id}>
                    {v.branch !== "main" && <path d={`M ${px} ${py} C ${px + 22} ${py} ${x - 22} ${y} ${x} ${y}`} fill="none" stroke={c} strokeWidth="2.5" />}
                    {v.branch !== "main" && <line x1={x} x2={W - 24} y1={y} y2={y} stroke={c} strokeWidth="2.5" opacity="0.5" />}
                    <g tabIndex={0} role="button" aria-label={`Go back to ${v.name}`} style={{ cursor: "pointer", outline: "none" }} onClick={() => restoreVersion(v.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); restoreVersion(v.id); } }}>
                      <circle cx={x} cy={y} r="14" fill="transparent" />
                      <circle cx={x} cy={y} r="7" fill="#141210" stroke={c} strokeWidth="3" />
                      <text x={x} y={y - 14} textAnchor="middle" fill="#eee9e1" fontSize="11" fontWeight="600">{v.name.length > 11 ? v.name.slice(0, 10) + "…" : v.name}</text>
                      <text x={x} y={y + 24} textAnchor="middle" fill="#857d72" fontSize="9" fontFamily="var(--font-mono, monospace)">{hhmm(v.at)}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="px-4 pb-4 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="ver-name">Version name</label>
            <input id="ver-name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); }} placeholder="Name this version" maxLength={24}
              style={{ height: 32, minWidth: 0, flex: "1 1 130px", padding: "0 10px", fontSize: 12, background: "#0c0b0a", border: "1px solid #2e2a26", color: "#eee9e1", borderRadius: 2 }} />
            <button type="button" className="dbtn pri" onClick={save}>Save version</button>
            <label className="sr-only" htmlFor="br-name">Branch name</label>
            <input id="br-name" value={branchName} onChange={(e) => setBranchName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") branch(); }} placeholder="Try something on a branch" maxLength={24}
              style={{ height: 32, minWidth: 0, flex: "1 1 150px", padding: "0 10px", fontSize: 12, background: "#0c0b0a", border: "1px solid #2e2a26", color: "#eee9e1", borderRadius: 2 }} />
            <button type="button" className="dbtn" onClick={branch}>New branch</button>
          </div>
          {branches.length > 1 && (
            <div className="px-4 pb-4 flex flex-wrap gap-2" role="group" aria-label="Save to branch">
              <span className="dcap" style={{ alignSelf: "center" }}>Save to</span>
              {branches.map((b) => (
                <button key={b.id} type="button" className={`dbtn ${active === b.id ? "on" : ""}`} aria-pressed={active === b.id} onClick={() => setActive(b.id)}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: b.color }} />{b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4" style={{ background: "#0c0b0a" }}>
          <p className="dcap m-0 mb-2">Steps · click to go back</p>
          <ol className="m-0 p-0 list-none overflow-y-auto" style={{ maxHeight: 268, border: "1px solid #2e2a26" }}>
            {[...steps].map((s, i) => ({ s, i })).reverse().map(({ s, i }) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goToStep(i)}
                  aria-current={i === cursor}
                  style={{ all: "unset", boxSizing: "border-box", width: "100%", display: "flex", alignItems: "center", gap: 10, height: 34, padding: "0 12px", cursor: "pointer", borderBottom: "1px solid #201d1a", background: i === cursor ? "#1f1a2b" : "transparent", color: i > cursor ? "#57514a" : "#eee9e1", fontSize: 13 }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: i === cursor ? "#9a6bff" : "#2e2a26" }} />
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, color: "#857d72" }}>{i === cursor ? "here" : hhmm(s.at)}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="dnote mt-3 mb-0">Edit the loop above, then come back here. Every change is a step. Go back to one and the loop plays like it did.</p>
        </div>
      </div>
    </Panel>
  );
};
