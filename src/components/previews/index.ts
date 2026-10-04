import type { Scene } from "./kit";
import { SCENE_FILE, type SceneFile } from "./sceneIndex";

/* Scenes are matched to changelog entries by release and the entry's first
   six words, so a reworded entry drops its preview instead of showing the
   wrong one (scripts/check-previews.mjs fails the build when that happens).
   Previews start at v0.7.0.

   The scene code is the bulk of the changelog page and only runs when a row
   is opened, so it loads on demand. Whether an entry has a preview comes from
   the generated sceneIndex, which is a few lines of strings. */

export const previewKey = (version: string, text: string) =>
  `${version}:${text.toLowerCase().replace(/-/g, " ").replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 6).join("-")}`;

const FILES: Record<SceneFile, () => Promise<Record<string, Scene>>> = {
  scenes070: () => import("./scenes070").then((m) => m.V070),
  scenes071: () => import("./scenes071").then((m) => m.V071),
  scenesNext: () => import("./scenesNext").then((m) => m.NEXT),
};

export const hasPreview = (version: string, text: string) => previewKey(version, text) in SCENE_FILE;

export const loadPreview = async (version: string, text: string): Promise<Scene | undefined> => {
  const key = previewKey(version, text);
  const file = (SCENE_FILE as Record<string, SceneFile>)[key];
  return file ? (await FILES[file]())[key] : undefined;
};
