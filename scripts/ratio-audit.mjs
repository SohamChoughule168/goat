import { chromium } from "@playwright/test";

const base = process.env.URL || "http://localhost:3117";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "load" });
await page.waitForTimeout(600);

const sizes = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10 : null;
  };
  return {
    displayH1: pick("h1"),
    body: (() => {
      const p = document.querySelector("main p");
      return p ? Math.round(parseFloat(getComputedStyle(p).fontSize) * 10) / 10 : null;
    })(),
    micro: (() => {
      const m = document.querySelector(".micro");
      return m ? Math.round(parseFloat(getComputedStyle(m).fontSize) * 10) / 10 : null;
    })(),
  };
});

console.log(JSON.stringify(sizes));
if (!sizes.displayH1 || !sizes.body) {
  console.error("ratio-audit: could not measure display/body");
  process.exit(1);
}
const ratio = Math.round((sizes.displayH1 / sizes.body) * 10) / 10;
console.log(`type ratio display:body = ${sizes.displayH1}:${sizes.body} = ${ratio}:1`);
t(ratio >= 6, "type ratio >= 6:1");

function t(pass, label) {
  console.log((pass ? "PASS" : "FAIL") + " " + label);
  if (!pass) process.exitCode = 1;
}
