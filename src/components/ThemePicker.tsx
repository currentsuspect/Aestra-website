import { memo, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTheme, resolve, type Mode } from "../hooks/useTheme";
import { FAMILIES, SWATCH, type FamilyId } from "../theme/themes";

/* ── Theme picker ─────────────────────────────────────────────────
   The app's four theme families, each in dark, light or high contrast,
   or following the system. Changing one re-skins the whole site at once,
   the DAW mock included. Built from native radio groups, so arrow keys,
   Tab and screen readers work without extra script. */

const MODES: { id: Mode; label: string; short: string }[] = [
  { id: "dark", label: "Dark", short: "Dark" },
  { id: "light", label: "Light", short: "Light" },
  { id: "hc", label: "High contrast", short: "Contrast" },
  { id: "system", label: "System", short: "System" },
];

/* Three bands, as the theme reads at a glance: ground, panel, accent. */
export const Swatch = ({ id, size = 14 }: { id: string; size?: number }) => {
  const s = SWATCH[id];
  if (!s) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${s.bg} 0 50%, ${s.accent} 50% 100%)`,
        boxShadow: `inset 0 0 0 1px ${s.panel}`,
      }}
    />
  );
};

const swatchFor = (family: FamilyId, mode: Mode) => resolve({ family, mode });

/* The controls themselves; used in the header's popover and inline. */
export const ThemeControls = memo(({ layout = "menu" }: { layout?: "menu" | "inline" }) => {
  const { choice, setTheme } = useTheme();
  const name = useId();
  const inline = layout === "inline";
  return (
    <div className={inline ? "flex flex-wrap items-center gap-x-6 gap-y-3" : "grid gap-3"}>
      <fieldset className="m-0 p-0 border-0 min-w-0">
        <legend className={inline ? "sr-only" : "cap mb-1.5 px-2"}>Theme</legend>
        <div className={inline ? "flex flex-wrap gap-1.5" : "grid"} role="presentation">
          {FAMILIES.map((f) => {
            const on = choice.family === f.id;
            return (
              <label
                key={f.id}
                className={
                  inline
                    ? "tp-pill btn btn-soft h-9 px-3.5 text-[13px] gap-2"
                    : "tp-row flex items-center gap-2.5 h-8 px-2 rounded-[5px] text-[13px] cursor-pointer"
                }
                data-on={on ? "" : undefined}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`${name}-family`}
                  value={f.id}
                  checked={on}
                  onChange={() => setTheme({ family: f.id as FamilyId })}
                />
                <Swatch id={swatchFor(f.id as FamilyId, choice.mode)} size={inline ? 14 : 16} />
                <span className="flex-1">{f.name}</span>
                {!inline && on && <Check className="w-3.5 h-3.5 text-accent" aria-hidden="true" />}
              </label>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="m-0 p-0 border-0 min-w-0">
        <legend className={inline ? "sr-only" : "cap mb-1.5 px-2"}>Mode</legend>
        <div className="seg">
          {MODES.map((m) => {
            const on = choice.mode === m.id;
            return (
              <label key={m.id} className="seg-item tp-mode text-[12.5px] px-3" data-on={on ? "" : undefined}>
                <input
                  type="radio"
                  className="sr-only"
                  name={`${name}-mode`}
                  value={m.id}
                  checked={on}
                  onChange={() => setTheme({ mode: m.id })}
                />
                <span aria-hidden={m.short !== m.label ? "true" : undefined}>{inline ? m.label : m.short}</span>
                {!inline && m.short !== m.label && <span className="sr-only">{m.label}</span>}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
});

/* The header button: the current theme's swatch and name, opening a card. */
export const ThemePicker = memo(({ showName = true }: { showName?: boolean }) => {
  const { choice, resolved } = useTheme();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const id = useId();
  const family = FAMILIES.find((f) => f.id === choice.family)?.name ?? "";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!card.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    requestAnimationFrame(() => card.current?.querySelector<HTMLInputElement>("input:checked")?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={button}
        type="button"
        className="btn btn-soft h-8 px-2.5 text-[12.5px] gap-2"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Theme: ${family}, ${choice.mode === "hc" ? "high contrast" : choice.mode}. Change theme`}
        onClick={() => setOpen((v) => !v)}
      >
        <Swatch id={resolved} />
        {showName && <span className="hidden lg:inline">{family}</span>}
        <ChevronDown className={`w-3.5 h-3.5 text-dim transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div
        ref={card}
        id={id}
        role="dialog"
        aria-label="Theme"
        hidden={!open}
        className="tp-card absolute right-0 top-[calc(100%+8px)] z-[60] w-[19rem] p-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") setOpen(false);
        }}
      >
        <ThemeControls layout="menu" />
        <p className="m-0 mt-3 px-2 pb-1 text-[12px] leading-snug text-dim">
          The app's own themes. Aestra has all twelve in its development build.
        </p>
      </div>
    </div>
  );
});
