// Renders every changelog preview scene frame by frame in headless Chromium and flags geometry that
// would read as broken: text outside the stage, partly clipped, spilling out of the box it sits in,
// or colliding with other text. Cursor and menu alignment is not checked here; Menu follows its cursor.
//   npm run audit:previews            exit 1 on any new finding
//   npm run audit:previews -- --sheets <dir>   also write contact sheets (4 frames per scene)
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

/* Findings reviewed by eye and accepted: [scene key prefix, text pattern, why]. */
const ACCEPT = [
  ["Unreleased:the-eq-response", /^-?\d+k?$/, "axis ticks sit on the analyzer grid"],
  ["v0.7.0-alpha:the-timeline-is-easier", /^(Drums|Bass|Keys|Vocal)$/, "clip names scroll out under the timeline crop"],
  ["v0.7.1-alpha:your-timeline-overview", /^(Drums|Bass|Keys|Vocal|\d+)$/, "clip names and bar numbers scroll out under the crop"],
  ["v0.7.0-alpha:select-menus", /^96 kHz$/, "row mid-unfold"],
  ["v0.7.1-alpha:the-mixers-plugin-dropdown", /^(Comp · Verb · Delay …|Every installed CLAP|▸)$/, "row under the menu while it unfolds"],
  ["v0.7.1-alpha:opening-a-project-with-moved-audio", /missing/, "dialog fades in over the placeholder"],
];
const accepted = (key, txt) => ACCEPT.some(([k, re]) => key.startsWith(k) && re.test(txt));

const sheetsDir = process.argv.includes("--sheets") ? resolve(process.argv[process.argv.indexOf("--sheets") + 1]) : null;
const files = { scenesNext: "NEXT", scenes070: "V070", scenes071: "V071" };

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const scenes = [];
for (const [f, name] of Object.entries(files)) {
  const m = await vite.ssrLoadModule(`/src/components/previews/${f}.tsx`);
  for (const [key, scene] of Object.entries(m[name])) scenes.push({ key, scene });
}
await vite.close();

const fonts = pathToFileURL(resolve("public/fonts")).href;
const page = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Archivo;font-weight:400 800;font-stretch:62% 125%;src:url(${fonts}/archivo-latin.woff2)}
@font-face{font-family:"JetBrains Mono";font-weight:100 800;src:url(${fonts}/jetbrains-mono-latin.woff2)}
:root{--font-sans:Archivo,sans-serif;--font-mono:"JetBrains Mono",monospace}
body{margin:0;background:#000}svg{display:block;position:absolute;left:0;top:0}</style><body></body>`;
const dir = join(tmpdir(), "aestra-preview-audit");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "stage.html"), page);

const br = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const p = await br.newPage();
await p.setViewport({ width: 700, height: 400 });
await p.goto(pathToFileURL(join(dir, "stage.html")).href);
await p.evaluate(async () => { await document.fonts.load("500 11px Archivo"); await document.fonts.load("500 11px 'JetBrains Mono'"); });

const inspect = (svg) => {
  document.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240" viewBox="0 0 600 240">${svg}</svg>`;
  const root = document.querySelector("svg");
  const R = (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; };
  const vis = (e) => {
    for (let n = e; n && n !== root.parentNode; n = n.parentNode) if (n.nodeType === 1 && parseFloat(getComputedStyle(n).opacity) < 0.08) return null;
    let r = R(e); const full = r.w * r.h;
    for (let n = e.parentNode; n && n !== root; n = n.parentNode) {
      if (n.tagName !== "svg") continue;
      const m = n.parentNode.getScreenCTM();
      const x = m.a * (+n.getAttribute("x") || 0) + m.e, y = m.d * (+n.getAttribute("y") || 0) + m.f;
      const w = m.a * +n.getAttribute("width"), h = m.d * +n.getAttribute("height");
      const nx = Math.max(r.x, x), ny = Math.max(r.y, y), nr = Math.min(r.r, x + w), nb = Math.min(r.b, y + h);
      if (nr <= nx || nb <= ny) return null;
      r = { x: nx, y: ny, w: nr - nx, h: nb - ny, r: nr, b: nb };
    }
    return { ...r, frac: full ? (r.w * r.h) / full : 1 };
  };
  const texts = [...root.querySelectorAll("text")].filter((t) => t.textContent.trim())
    .map((t) => ({ txt: t.textContent.trim(), ...(vis(t) || { x: NaN }) })).filter((T) => !Number.isNaN(T.x));
  const rects = [...root.querySelectorAll("rect")].filter((e) => vis(e)).map((e) => R(e))
    .filter((o) => o.w > 6 && o.h > 8 && o.w * o.h < 600 * 240 * 0.45 && o.h < 130);
  const out = [];
  for (const T of texts) {
    if (T.frac < 0.92) out.push(["clipped", T.txt]);
    if (T.x < -0.5 || T.r > 600.5 || T.y < -0.5 || T.b > 240.5) out.push(["off-stage", T.txt]);
    const cx = T.x + T.w / 2, cy = T.y + T.h / 2;
    const c = rects.filter((o) => cx >= o.x && cx <= o.r && cy >= o.y && cy <= o.b).sort((a, b) => a.w * a.h - b.w * b.h)[0];
    if (c && (T.x < c.x - 1 || T.r > c.r + 1 || T.y < c.y - 1.5 || T.b > c.b + 1.5)) out.push(["outside-box", T.txt]);
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (Math.min(a.r, b.r) - Math.max(a.x, b.x) > 2 && Math.min(a.b, b.b) - Math.max(a.y, b.y) > 4) out.push(["text-collide", `${a.txt} / ${b.txt}`]);
  }
  return out;
};

let bad = 0;
for (const { key, scene } of scenes) {
  const seen = new Map();
  for (let t = 0.1; t <= scene.dur; t += 1 / 6) {
    const found = await p.evaluate(inspect, renderToStaticMarkup(scene.draw(t)));
    for (const [kind, txt] of found) if (!accepted(key, txt) && !seen.has(kind + txt)) seen.set(kind + txt, [kind, txt, +t.toFixed(1)]);
  }
  for (const [kind, txt, t] of seen.values()) { bad++; console.log(`${key}  ${kind}  "${txt}"  first at ${t}s`); }
}

if (sheetsDir) {
  mkdirSync(sheetsDir, { recursive: true });
  const css = `body{margin:0;background:#222;color:#ff0;font:12px monospace}.row{display:flex;gap:4px;margin-bottom:4px}svg{position:static;width:380px;height:152px;background:#000}.h{padding:3px 0}`;
  for (let i = 0; i < scenes.length; i += 3) {
    const html = scenes.slice(i, i + 3).map(({ key, scene }) => `<div class="h">${key}</div><div class="row">${[0.22, 0.45, 0.72, 0.98].map((f) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240">${renderToStaticMarkup(scene.draw(scene.dur * f))}</svg>`).join("")}</div>`).join("");
    await p.setViewport({ width: 1560, height: 600 });
    await p.evaluate((h, c) => { document.body.innerHTML = `<style>${c}</style>${h}`; }, html, css);
    await p.screenshot({ path: join(sheetsDir, `sheet-${String(i / 3).padStart(2, "0")}.png`), fullPage: true });
  }
  console.log(`contact sheets in ${sheetsDir}`);
}
await br.close();
console.log(bad ? `audit-previews: ${bad} finding(s)` : `audit-previews: ${scenes.length} scenes clean`);
process.exit(bad ? 1 : 0);
