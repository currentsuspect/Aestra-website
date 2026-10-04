import React from "react";
import { useSession } from "../session";
import { ROWS } from "../engine";
import { Panel, ROW_META, rowColor } from "./shared";

/* Close the project, then reopen it: the same loop, tempo, versions and
   history come back, because the session is saved as you go. */

const stamp = (t: number) => (t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "just now");

export const ReopenDemo = () => {
  const { state, closed, setClosed, savedAt, versions, playing, toggle } = useSession();
  const close = () => { if (playing) void toggle(); setClosed(true); };
  const count = ROWS.reduce((n, r) => n + state.grid[r].filter(Boolean).length, 0);

  return (
    <Panel title="Project window" tag="Illustration">
      <div className="p-3 sm:p-4">
        <div style={{ border: "1px solid #2e2a26", background: "#0c0b0a" }}>
          <div className="flex items-center gap-3 px-3" style={{ height: 38, background: "#141210", borderBottom: "1px solid #2e2a26", fontSize: 12 }}>
            <span style={{ color: "#aca397" }}>{closed ? "Aestra" : "Night Drive · Saved"}</span>
            <span className="flex-1" />
            {closed
              ? <button type="button" className="dbtn pri" onClick={() => setClosed(false)}>Reopen Night Drive</button>
              : <button type="button" className="dbtn" onClick={close}>Close project</button>}
          </div>
          <div style={{ minHeight: 168 }} className="p-4">
            {closed ? (
              <div className="grid place-items-center text-center" style={{ minHeight: 136 }}>
                <p className="m-0 text-[15px]" style={{ color: "#aca397" }}>No project open.</p>
                <p className="dnote m-0 mt-1">It's saved. Reopen it and see.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-5 items-center">
                <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(16, 9px)" }} aria-hidden="true">
                  {ROWS.flatMap((r) => state.grid[r].map((on, i) => (
                    <i key={r + i} style={{ width: 9, height: 9, background: on ? rowColor(r) : "#1c1a17", display: "block", marginLeft: i > 0 && i % 4 === 0 ? 3 : 0 }} />
                  )))}
                </div>
                <dl className="m-0 grid gap-1 text-[13px]" style={{ color: "#aca397" }}>
                  <div><dt className="dcap inline mr-2">Tempo</dt><dd className="inline m-0" style={{ color: "#eee9e1" }}>{state.bpm} BPM</dd></div>
                  <div><dt className="dcap inline mr-2">Notes</dt><dd className="inline m-0" style={{ color: "#eee9e1" }}>{count} across {ROWS.length} sounds ({ROWS.map((r) => ROW_META[r].name).join(", ")})</dd></div>
                  <div><dt className="dcap inline mr-2">Versions</dt><dd className="inline m-0" style={{ color: "#eee9e1" }}>{versions.length}</dd></div>
                  <div><dt className="dcap inline mr-2">Last saved</dt><dd className="inline m-0" style={{ color: "#eee9e1" }}>{stamp(savedAt)}</dd></div>
                </dl>
              </div>
            )}
          </div>
        </div>
        <p className="dnote mt-3 mb-0">Change the loop in the next track, close the project here and reopen it. It comes back the way you left it. In this demo it's kept in your browser, only on this device.</p>
      </div>
    </Panel>
  );
};
