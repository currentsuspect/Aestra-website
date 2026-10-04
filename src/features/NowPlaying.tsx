import React from "react";
import { useSession, useStep } from "./session";
import { ROWS, STEPS } from "./engine";
import { PlayDot } from "./demos/shared";

/* The transport that follows you through the record. */
export const NowPlaying = () => {
  const { playing, toggle, state, audio } = useSession();
  const step = useStep();
  return (
    <div className="sticky bottom-2 sm:bottom-4 z-30 px-3 sm:px-4 pb-3 sm:pb-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 w-fit max-w-full" style={{ background: "#141210", border: "1px solid #3d3833", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", color: "#eee9e1" }} role="region" aria-label="Now playing">
        <PlayDot playing={playing} onClick={() => { void toggle(); }} />
        <div>
          <div className="text-[12px] font-semibold">Night Drive</div>
          <div className="text-[11px]" style={{ color: "#857d72" }}>{audio === "unavailable" ? "No audio here" : `${state.bpm} BPM · ${playing ? "playing" : "stopped"}`}</div>
        </div>
        <div className="hidden min-[520px]:flex gap-[2px]" aria-hidden="true">
          {Array.from({ length: STEPS }, (_, i) => (
            <i key={i} style={{ width: 7, height: 18, display: "block", background: step === i ? "#eee9e1" : ROWS.some((r) => state.grid[r][i]) ? "#57514a" : "#25221f", marginLeft: i > 0 && i % 4 === 0 ? 4 : 0 }} />
          ))}
        </div>
      </div>
    </div>
  );
};
