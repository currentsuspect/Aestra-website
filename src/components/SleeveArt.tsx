import React, { memo } from "react";
import { TRACKS, CLIPS, BARS, tone } from "./mock/emberSession";

/* The session as sleeve art: every clip in its lane colour on black. */
export const SleeveArt = memo(({ label }: { label: string }) => (
  <div className="relative aspect-square w-full max-w-full bg-black border border-fg overflow-hidden" aria-hidden="true">
    <div className="absolute left-[8%] right-[8%] top-[10%] bottom-[28%]">
      {CLIPS.map((c) => (
        <span
          key={c.id}
          className="absolute"
          style={{
            left: `${(c.start / BARS) * 100}%`,
            width: `calc(${((c.end - c.start) / BARS) * 100}% - 2px)`,
            top: `${(c.track / TRACKS.length) * 100}%`,
            height: `calc(${100 / TRACKS.length}% - 2px)`,
            background: tone(TRACKS[c.track].slot).body,
            boxShadow: `inset 0 1px 0 ${tone(TRACKS[c.track].slot).edge}`,
          }}
        />
      ))}
    </div>
    <div className="absolute left-[8%] right-[8%] bottom-[7%] flex items-end justify-between text-[#eee9e1]">
      <span className="font-extrabold lowercase [font-stretch:125%] text-[clamp(1.1rem,2.2vw,1.8rem)] tracking-[-0.01em]">aestra</span>
      <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#857d72]">{label}</span>
    </div>
  </div>
));
