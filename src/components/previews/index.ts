import type { Scene } from "./kit";
import { NEXT } from "./scenesNext";
import { V071 } from "./scenes071";
import { V070 } from "./scenes070";

/* Scenes are matched to changelog entries by release and the entry's first
   six words, so a reworded entry drops its preview instead of showing the
   wrong one. Previews start at v0.7.0. */

export const previewKey = (version: string, text: string) =>
  `${version}:${text.toLowerCase().replace(/-/g, " ").replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 6).join("-")}`;

const SCENES: Record<string, Scene> = { ...NEXT, ...V071, ...V070 };

export const previewFor = (version: string, text: string): Scene | undefined => SCENES[previewKey(version, text)];
