import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3118/", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const data = await page.evaluate(() => {
  const tg = document.querySelector(".type-graphic");
  const wrap = document.querySelector(".type-graphic-wrap");
  const mask1 = document.querySelector(".line-mask > *");
  const h1 = document.querySelector("h1.mega");
  const r = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return {
      fontSize: cs.fontSize,
      width: Math.round(b.width),
      height: Math.round(b.height),
      right: Math.round(b.right),
      transform: cs.transform,
    };
  };
  return {
    megaFontSize: h1 ? getComputedStyle(h1).fontSize : null,
    line1: r(mask1),
    typeGraphic: r(tg),
    wrapClientWidth: wrap ? wrap.clientWidth : null,
    cropPx: tg && wrap ? Math.round(tg.scrollWidth - wrap.clientWidth) : null,
    heroDoneFlags: document.querySelectorAll(".is-in").length,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
