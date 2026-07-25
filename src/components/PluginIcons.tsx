import React, { memo } from "react";

/* ── Plugin icons ───────────────────────────────────────────────────
   Each icon plots what the plugin does to the signal, rather than
   picking a noun loosely associated with it. A producer reads a tanh
   curve as soft-clip saturation before reading the word "Sat"; nobody
   reads a flame that way.

   Shared grammar, so the ten read as readouts on one instrument:
     · 24x24 grid, plot area inset to x:3-21, y:4-20
     · 1.5 stroke, currentColor, round caps/joins, no fill
     · a "reference" element (unity diagonal, ceiling, centre line) is
       drawn at 0.35 opacity where the curve is only meaningful
       relative to something

   Colour is inherited — these are never given a hue of their own, per
   the accent-as-signal rule in styles.css.
   ────────────────────────────────────────────────────────────────── */

type IconProps = { className?: string; strokeWidth?: number };

const Plot = ({
  className,
  strokeWidth = 1.5,
  children,
}: IconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* Reference geometry — unity diagonal, ceiling, centre line. Drawn
   thinner as well as dimmer: at 0.35 opacity but full stroke weight it
   competed with the signal instead of sitting behind it. */
const Ref = ({ d, dashed }: { d: string; dashed?: boolean }) => (
  <path
    d={d}
    opacity="0.4"
    strokeWidth="1"
    strokeDasharray={dashed ? "2.2 2" : undefined}
  />
);

/* Frequency response, framed by the low/high axis rules of an EQ
   display — the bare curve read as a squiggle without them. */
export const EqIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M3.5 5.5v13M20.5 5.5v13" />
    <path d="M3.5 13.5c3 0 4-6.5 7-6.5s4 6.5 6 6.5c1.6 0 2.2-3.2 4-3.2" />
  </Plot>
));

/* Impulse response: dense reflections decaying into the tail. */
export const VerbIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M3 19h18" />
    <path d="M5 19V6M7.6 19v-8.4M10.2 19v-6.2M12.8 19v-4.5M15.4 19v-3.2M18 19v-2.2M20.4 19v-1.4" />
  </Plot>
));

/* Transfer curve: unity below the knee, compressed above it. */
export const CompIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M4 20 20 4" />
    <path d="M4 20l7.5-7.5c1.6-1.6 3.4-2.2 8.5-2.6" />
  </Plot>
));

/* Discrete repeats: evenly spaced taps, each quieter than the last. */
export const DelayIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M3 19h18" />
    <path d="M5 19V6M9.7 19v-8.2M14.4 19v-5.6M19.1 19v-3.6" />
  </Plot>
));

/* Resonant lowpass: flat passband, peak at cutoff, steep rolloff. */
export const FilterIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <path d="M3 11.5h6c2 0 2.4-5.5 4-5.5s1.7 5.5 3.4 9.5c1 2.3 2.3 3.5 4.6 3.5" />
  </Plot>
));

/* Soft clip: tanh curve bending away from unity at both extremes. */
export const SatIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M4 20 20 4" />
    <path d="M4 19.3c5 0 5.2-7.3 8-7.3s3 -7.3 8-7.3" />
  </Plot>
));

/* Three bands pulled toward a common target from above and below. */
export const OttIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <path d="M9 7h12M9 12h12M9 17h12" />
    <path d="M4.5 4.5v4.2M3 7.2l1.5 1.5L6 7.2" />
    <path d="M4.5 19.5v-4.2M3 16.8l1.5-1.5L6 16.8" />
  </Plot>
));

/* One cycle, with the phase origin marked. */
export const LfoIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M3 12h18" />
    <path d="M3 12q4.5-8 9 0t9 0" />
    <circle cx="3" cy="12" r="1.35" fill="currentColor" stroke="none" />
  </Plot>
));

/* Brickwall: the signal meets a ceiling and goes flat along it. */
export const LimitIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <Ref d="M3 8.2h18" dashed />
    <path d="M3 18.8c3 0 2.6-10.6 5.4-10.6h7.2c2.8 0 2.4 10.6 5.4 10.6" />
  </Plot>
));

/* The source pitch runs solid; the voices it drifts to are dotted,
   so the shifted copies read as a separate line from the take. */
export const DriftIcon = memo((p: IconProps) => (
  <Plot {...p}>
    <path d="M3 12h5.5" />
    <path d="M8.5 12c3.5 0 3.5-5.5 7-5.5H21" strokeDasharray="2.2 2.2" />
    <path d="M8.5 12c3.5 0 3.5 5.5 7 5.5H21" strokeDasharray="2.2 2.2" />
  </Plot>
));
