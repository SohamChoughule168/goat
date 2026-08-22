import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3118/design-kit", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.classList.add("js"));
const probe = await page.evaluate(() => {
  const el = document.querySelector(".mega");
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    family: cs.fontFamily.split(",")[0],
    weight: cs.fontWeight,
    letterSpacing: cs.letterSpacing,
    boxHeight: Math.round(r.height),
    bg: getComputedStyle(el.closest(".field")).backgroundColor,
    color: cs.color,
  };
});
console.log("MEGA @1440:", JSON.stringify(probe, null, 2));
console.log(
  "BODY BG:",
  await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
);
console.log(
  "BTN RADIUS:",
  await page.evaluate(() => getComputedStyle(document.querySelector(".btn")).borderRadius)
);
await browser.close();
