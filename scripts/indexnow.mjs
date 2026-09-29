// Tell IndexNow engines (Bing, Yandex, Seznam, Naver…) which pages exist or
// changed. Run after a production deploy:  node scripts/indexnow.mjs [url…]
// With no arguments it submits every URL in the live sitemap. The key file
// sits at the site root, which is how the engines verify the submission.
import { readdirSync, readFileSync } from "node:fs";

const HOST = "www.aestra.studio";
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file in public/");
const key = readFileSync(`public/${keyFile}`, "utf8").trim();

let urls = process.argv.slice(2);
if (urls.length === 0) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URL(s)`);
if (res.status >= 400) process.exit(1);
