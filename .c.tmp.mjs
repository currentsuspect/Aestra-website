import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
const b = await puppeteer.launch({ args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }), executablePath: await chromium.executablePath(), headless: "shell" });
for (const [w, name] of [[1366, "wide"], [720, "narrow"]]) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: 900, deviceScaleFactor: 3 });
  await p.goto(process.argv[2] + "/", { waitUntil: "networkidle0" });
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
  const el = await p.$(".cells");
  await el.evaluate(e => { window.scrollTo(0, window.scrollY + e.getBoundingClientRect().top - 200); });
  await new Promise(r => setTimeout(r, 1200));
  const bx = await el.boundingBox(); const sy = await p.evaluate(() => window.scrollY);
  await p.screenshot({ path: `${process.argv[3]}/cells-${name}.png`, clip: { x: Math.max(0, bx.x - 12), y: bx.y + sy - 12, width: Math.min(bx.width + 24, w), height: bx.height + 24 } });
  await p.close();
}
await b.close();
