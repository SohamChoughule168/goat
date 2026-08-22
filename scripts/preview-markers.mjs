import { chromium } from "@playwright/test";

const base = process.env.URL || "http://localhost:3118";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "networkidle" });
const h = await page.content();
for (const m of [
  "mega",
  'data-field="cobalt"',
  'data-field="vermilion"',
  'data-field="chartreuse"',
  "type-graphic",
  "IMAGINARS",
]) {
  console.log((h.includes(m) ? "PASS" : "FAIL") + " " + m);
}
console.log(
  "body bg:",
  await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
);
await browser.close();
