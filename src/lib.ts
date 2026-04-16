export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// DAW mockup constants
export const TRACK_HEIGHT = 72;
export const HEADER_WIDTH = 180;
export const RULER_HEIGHT = 32;
export const SNAP_GRID_PX = 20;
