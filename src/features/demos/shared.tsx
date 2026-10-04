import React from "react";
import type { Row } from "../engine";

export const ROW_META: Record<Row, { name: string; hue: number }> = {
  kick: { name: "Kick", hue: 25 },
  snare: { name: "Snare", hue: 60 },
  hat: { name: "Hats", hue: 95 },
  bass: { name: "Bass", hue: 250 },
};
export const rowColor = (r: Row, l = 0.73) => `oklch(${l} 0.18 ${ROW_META[r].hue})`;

export const Panel = ({
  title, tag, children, right,
}: { title: string; tag: string; children: React.ReactNode; right?: React.ReactNode }) => (
  <div className="dpanel">
    <div className="dpanel-head">
      <span className="dcap">{title}</span>
      <span className="flex items-center gap-3">
        {right}
        <span className="dcap" style={{ color: "#a88dfb" }}>{tag}</span>
      </span>
    </div>
    {children}
  </div>
);

export const PlayDot = ({ playing, onClick, label = "Play" }: { playing: boolean; onClick: () => void; label?: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={playing ? "Stop" : label}
    aria-pressed={playing}
    style={{ all: "unset", cursor: "pointer", width: 34, height: 34, borderRadius: "50%", background: "#eee9e1", color: "#0c0b0a", display: "grid", placeItems: "center", boxSizing: "border-box" }}
  >
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      {playing ? <><rect x="3" y="2.5" width="3.4" height="11" /><rect x="9.6" y="2.5" width="3.4" height="11" /></> : <path d="M4 2.5 L13 8 L4 13.5 Z" />}
    </svg>
  </button>
);
