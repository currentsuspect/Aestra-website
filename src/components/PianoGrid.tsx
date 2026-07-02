import { memo } from "react";

/* ── PianoGrid ─────────────────────────────────────────────────────
   Hero background: a keyboard hanging from the top edge (the key
   lane of a piano roll), whose white-key boundaries continue down
   as the section grid. Pressed keys hold a violet chord and leak
   light down the page like sustained notes.

   Pure SVG, theme-aware via CSS variables, aria-hidden, static
   (no animation — safe under prefers-reduced-motion).
   ──────────────────────────────────────────────────────────────── */

const WHITE_W = 40;          // white key width in viewBox units
const OCTAVES = 6;           // 6 octaves ≈ 42 white keys across 1680
const VIEW_W = OCTAVES * 7 * WHITE_W;
const VIEW_H = 720;
const BLACK_W = 22;
const BLACK_H = 64;
/* Which white keys (0=C … 6=B) have a black key after them */
const BLACK_AFTER = [0, 1, 3, 4, 5];

/* Pressed chord — A minor (A, C, E), placed right of center so it
   sits behind the hero's secondary column, not the headline. */
const PRESSED_WHITE = [26, 28, 30];

const whiteKeyCount = OCTAVES * 7;

export const PianoGrid = memo(({ className = "" }: { className?: string }) => (
  <div
    className={`absolute inset-x-0 top-14 sm:top-16 h-[520px] sm:h-[640px] overflow-hidden pointer-events-none select-none piano-grid ${className}`}
    aria-hidden="true"
  >
    <svg
      className="w-full h-full"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMin slice"
    >
      <defs>
        <linearGradient id="pgFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.95" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pgNote" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.32" />
          <stop offset="0.35" stopColor="var(--color-accent)" stopOpacity="0.10" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
        <mask id="pgMask">
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#pgFade)" />
        </mask>
      </defs>

      <g mask="url(#pgMask)">
        {/* Sustained-note light trails under the pressed keys */}
        {PRESSED_WHITE.map((k) => (
          <rect
            key={`note-${k}`}
            x={k * WHITE_W}
            y={0}
            width={WHITE_W}
            height={VIEW_H}
            fill="url(#pgNote)"
          />
        ))}

        {/* White-key boundaries → section grid. Octave starts stronger. */}
        {Array.from({ length: whiteKeyCount + 1 }, (_, k) => (
          <line
            key={`line-${k}`}
            x1={k * WHITE_W}
            y1={0}
            x2={k * WHITE_W}
            y2={VIEW_H}
            stroke={k % 7 === 0 ? "var(--color-border-2)" : "var(--color-border)"}
            strokeWidth={1}
          />
        ))}

        {/* Keyboard lip */}
        <line
          x1={0}
          y1={BLACK_H + 14}
          x2={VIEW_W}
          y2={BLACK_H + 14}
          stroke="var(--color-border)"
          strokeWidth={1}
        />

        {/* Pressed white keys — violet key caps */}
        {PRESSED_WHITE.map((k) => (
          <rect
            key={`cap-${k}`}
            x={k * WHITE_W + 1}
            y={0}
            width={WHITE_W - 2}
            height={BLACK_H + 14}
            fill="var(--color-accent)"
            opacity="0.28"
          />
        ))}

        {/* Black keys */}
        {Array.from({ length: OCTAVES }, (_, o) =>
          BLACK_AFTER.map((i) => {
            const x = (o * 7 + i + 1) * WHITE_W - BLACK_W / 2;
            return (
              <rect
                key={`bk-${o}-${i}`}
                x={x}
                y={0}
                width={BLACK_W}
                height={BLACK_H}
                rx={2}
                fill="var(--color-surface-3)"
                stroke="var(--color-border-2)"
                strokeWidth={0.5}
              />
            );
          })
        )}
      </g>
    </svg>
  </div>
));
