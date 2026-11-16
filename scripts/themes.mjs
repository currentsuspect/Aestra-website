#!/usr/bin/env node
/**
 * The site wears the app's own themes. This script turns the Aestra Kit's
 * resolved theme values (the same data the app's NUIKitThemes.inc is generated
 * from) into the site's CSS variables, so no colour on the site is copied by hand.
 *
 *   node scripts/themes.mjs --from ~/Projects/aestra-kit/resolved.json
 *        refresh the snapshot (src/theme/kit.json) from the kit, then generate
 *   node scripts/themes.mjs           generate from the committed snapshot
 *   node scripts/themes.mjs --check   fail if the generated files are stale (run by `npm run build`)
 *
 * Writes:
 *   src/theme/kit.json    the kit's values, as read (input snapshot)
 *   src/theme/themes.css  one block of variables per theme, the default on :root
 *   src/theme/themes.ts   the picker's list, the default, swatches and the track palette
 *
 * Token names on the right of MAP are the app's NUIThemeProperties fields. Where an app
 * colour fails WCAG AA (4.5:1) as site text on the site's grounds, it is stepped toward the
 * text colour until it passes; every such step is listed in the CSS header so it can be read.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";

/* The theme a first-time visitor sees. One line to change; then run this script. */
const DEFAULT_THEME = "solace-dark";

const SNAPSHOT = "src/theme/kit.json";
const OUT_CSS = "src/theme/themes.css";
const OUT_TS = "src/theme/themes.ts";

const args = process.argv.slice(2);
const fromIdx = args.indexOf("--from");
const check = args.includes("--check");

let kit;
if (fromIdx >= 0) {
  const src = args[fromIdx + 1].replace(/^~/, homedir());
  const full = JSON.parse(readFileSync(src, "utf8"));
  kit = { source: "Aestra Kit resolved.json", order: full.order, names: full.names, modes: full.modes, track: full.track, values: full.values };
  mkdirSync("src/theme", { recursive: true });
  writeFileSync(SNAPSHOT, JSON.stringify(kit, null, 2) + "\n");
} else {
  kit = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
}

/* ── colour maths ─────────────────────────────────────────────── */
const parse = (h) => {
  const s = h.replace("#", "");
  const n = (i) => parseInt(s.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: s.length >= 8 ? n(6) / 255 : 1 };
};
const hex2 = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
const toHex = ({ r, g, b }) => `#${hex2(r)}${hex2(g)}${hex2(b)}`;
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const ratio = (a, b) => { const x = lum(parse(a)), y = lum(parse(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (a, b, t) => { const p = parse(a), q = parse(b); return toHex({ r: p.r + (q.r - p.r) * t, g: p.g + (q.g - p.g) * t, b: p.b + (q.b - p.b) * t }); };
/* An alpha colour laid over a ground, as the eye sees it. */
const over = (fg, ground) => { const p = parse(fg); return mix(ground, toHex(p), p.a); };

const AA = 4.5;
/* Step `c` toward `toward` until it reads at `min` on every ground. */
const ensure = (c, grounds, toward, min, label, notes) => {
  let out = c;
  for (let t = 0; t <= 1.0001; t += 0.02) {
    out = mix(c, toward, t);
    if (grounds.every((g) => ratio(out, g) >= min)) {
      if (t > 0) notes.push(`${label}: ${c} -> ${out} (${Math.round(t * 100)}% toward text, for ${min}:1)`);
      return out;
    }
  }
  throw new Error(`${label}: cannot reach ${min}:1`);
};

/* ── the mapping ──────────────────────────────────────────────── */
const build = (id, v) => {
  const notes = [];
  const bg = v.backgroundPrimary;
  const panel = v.backgroundSecondary;
  const card = v.surfaceTertiary;
  // Site text sits on the page, on panels and on cards.
  const grounds = [bg, panel, card];
  const fg = v.textPrimary;
  const text = (c, label) => ensure(c, grounds, fg, AA, label, notes);
  // The accent as text: the app's primary if it reads, else its secondary (the app's own
  // readable-accent token), stepped toward the text colour only if neither does.
  const accentText = grounds.every((g) => ratio(v.primary, g) >= AA) ? v.primary : text(v.secondary, "accent text (secondary)");
  // Ink on the accent fill: the app's textOnPrimary must read on primary. A hovered accent
  // button takes primaryHover when the ink still reads on it, else primaryPressed (the app's
  // two neighbouring shades), so hover never costs contrast.
  if (ratio(v.textOnPrimary, v.primary) < AA) throw new Error(`${id}: textOnPrimary on primary is under AA`);
  const accentHover = ratio(v.textOnPrimary, v.primaryHover) >= AA ? v.primaryHover : v.primaryPressed;
  if (accentHover !== v.primaryHover) notes.push(`accent hover: primaryHover ${v.primaryHover} -> primaryPressed ${v.primaryPressed} (ink ${ratio(v.textOnPrimary, v.primaryHover).toFixed(2)}:1 on primaryHover)`);
  const dark = lum(parse(bg)) < 0.2;
  const site = {
    // grounds, from sunk to raised
    "--color-well": v.editorWell,
    "--color-bg": bg,
    "--color-bg-elev": panel,
    "--color-surface": panel,
    "--color-surface-2": card,
    "--color-surface-3": v.surfaceRaised,
    // lines
    "--color-border": v.border,
    "--color-border-2": v.borderStrong,
    "--color-border-3": v.textDisabled,
    // text tiers
    "--color-fg": fg,
    "--color-fg-muted": text(mix(fg, v.textSecondary, 0.45), "fg-muted"),
    "--color-muted": text(v.textSecondary, "muted (textSecondary)"),
    "--color-dim": text(v.textMuted, "dim (textMuted)"),
    "--color-faint": text(v.textMuted, "faint (textMuted)"),
    // the theme's accent
    "--color-accent": accentText,
    "--color-accent-fill": v.primary,
    "--color-accent-hover": accentHover,
    "--color-accent-press": v.primaryPressed,
    "--color-on-accent": v.textOnPrimary,
    "--color-accent-soft": v.selected,
    "--color-accent-2": v.secondary,
    "--color-focus": v.focusRing,
    // state washes (hover and press are tonal, never glows)
    "--color-hover": v.hover,
    "--color-pressed": v.pressed,
    "--color-overlay": v.overlay,
    "--color-shadow": v.shadow,
    // status only
    "--color-success": text(v.success, "success"),
    "--color-warn": text(v.warning, "warn"),
    "--color-error": text(v.error, "error"),
    // the DAW drawn on the page (hero mock, previews, demos)
    "--color-daw-bed": v.timelineBed,
    "--color-daw-panel": panel,
    "--daw-bed": v.timelineBed,
    "--daw-chrome": bg,
    "--daw-panel": panel,
    "--daw-control": card,
    "--daw-raised": v.surfaceRaised,
    "--daw-well": v.editorWell,
    "--daw-border": v.border,
    "--daw-border-strong": v.borderStrong,
    "--daw-divider": v.divider,
    "--daw-t1": fg,
    "--daw-t2": v.textSecondary,
    "--daw-t3": v.textMuted,
    "--daw-t4": v.textDisabled,
    "--daw-primary": v.primary,
    "--daw-primary-hover": v.primaryHover,
    "--daw-on-primary": v.textOnPrimary,
    "--daw-accent": v.secondary,
    "--daw-selected": v.selected,
    "--daw-control-selected": v.controlSelected,
    "--daw-hover": v.hover,
    "--daw-meter": v.meterSafe,
    "--daw-meter-warn": v.meterWarn,
    "--daw-meter-crit": v.meterCrit,
    "--daw-meter-bg": v.meterBackground,
    "--daw-warn": v.warning,
    "--daw-error": v.error,
    "--daw-success": v.success,
    "--daw-on-status": v.textOnStatus,
    "--daw-grid-major": v.gridMajor,
    "--daw-grid-minor": v.gridMinor,
    "--daw-cyan": v.accentCyan,
    "--daw-magenta": v.accentMagenta,
    "--daw-lime": v.accentLime,
  };
  // Report: every text pair the site relies on.
  const report = [];
  for (const k of ["--color-fg", "--color-fg-muted", "--color-muted", "--color-dim", "--color-accent", "--color-success", "--color-warn", "--color-error"]) {
    const worst = Math.min(...grounds.map((g) => ratio(site[k], g)));
    report.push(`${k.replace("--color-", "")} ${worst.toFixed(2)}`);
  }
  report.push(`on-accent ${ratio(v.textOnPrimary, v.primary).toFixed(2)}`);
  return { site, notes, report, dark };
};

const themes = kit.order.map((id) => ({ id, ...build(id, kit.values[id]) }));
if (!kit.order.includes(DEFAULT_THEME)) throw new Error(`DEFAULT_THEME ${DEFAULT_THEME} is not a kit theme`);

const block = (sel, t) =>
  `${sel} {\n  color-scheme: ${t.dark ? "dark" : "light"};\n${Object.entries(t.site).map(([k, val]) => `  ${k}: ${val};`).join("\n")}\n}`;

const def = themes.find((t) => t.id === DEFAULT_THEME);
const header = `/* Generated by scripts/themes.mjs from ${kit.source}. Do not edit by hand.
   Default theme: ${DEFAULT_THEME}. Change DEFAULT_THEME in the script and run it again.

   Worst-case text contrast per theme (on page, panel and card grounds):
${themes.map((t) => `     ${t.id.padEnd(20)} ${t.report.join(" · ")}`).join("\n")}
${themes.some((t) => t.notes.length) ? `\n   Adjusted for AA:\n${themes.flatMap((t) => t.notes.map((n) => `     ${t.id}: ${n}`)).join("\n")}\n` : ""}*/`;

// @theme registers the names with Tailwind and carries the default; each [data-theme]
// block (unlayered, so it wins over the theme layer) re-skins the whole page.
const css = `${header}

@theme {
${Object.entries(def.site).filter(([k]) => k.startsWith("--color-")).map(([k, val]) => `  ${k}: ${val};`).join("\n")}
}

${block(":root", def)}

${themes.map((t) => block(`[data-theme="${t.id}"]`, t)).join("\n\n")}
`;

const families = Object.keys(kit.names);
const ts = `// Generated by scripts/themes.mjs from ${kit.source}. Do not edit by hand.

export const DEFAULT_THEME = ${JSON.stringify(DEFAULT_THEME)};

export const FAMILIES = ${JSON.stringify(families.map((f) => ({ id: f, name: kit.names[f] })), null, 2)} as const;

export type FamilyId = (typeof FAMILIES)[number]["id"];
export type ResolvedMode = ${Object.keys(kit.modes).map((m) => JSON.stringify(m)).join(" | ")};
export const MODE_NAMES: Record<ResolvedMode, string> = ${JSON.stringify(kit.modes)};

/** Ground, panel and accent of every theme, for the picker's swatches and the browser's theme-color. */
export const SWATCH: Record<string, { bg: string; panel: string; accent: string; fg: string }> = {
${themes.map((t) => `  ${JSON.stringify(t.id)}: { bg: ${JSON.stringify(t.site["--color-bg"])}, panel: ${JSON.stringify(t.site["--color-surface-2"])}, accent: ${JSON.stringify(t.site["--color-accent-fill"])}, fg: ${JSON.stringify(t.site["--color-fg"])} },`).join("\n")}
};

/** Track identity colours. They do not change with the theme, in the app or here. */
export const TRACK_PALETTE = ${JSON.stringify(Object.values(kit.track))};
`;

if (check) {
  const same = (p, s) => { try { return readFileSync(p, "utf8") === s; } catch { return false; } };
  if (!same(OUT_CSS, css) || !same(OUT_TS, ts)) {
    console.error("themes: src/theme is out of date. Run `node scripts/themes.mjs`.");
    process.exit(1);
  }
  console.log(`themes: ${themes.length} themes in sync (default ${DEFAULT_THEME})`);
} else {
  writeFileSync(OUT_CSS, css);
  writeFileSync(OUT_TS, ts);
  console.log(`themes: wrote ${themes.length} themes (default ${DEFAULT_THEME})`);
  for (const t of themes) for (const n of t.notes) console.log(`  ${t.id}: ${n}`);
}
