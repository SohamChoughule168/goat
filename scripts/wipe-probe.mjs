import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3118/design-kit", { waitUntil: "networkidle" });
await page.waitForTimeout(900);
const wipes = await page.evaluate(() =>
  [...document.querySelectorAll(".field-wipe")].map((el) => ({
    field: el.dataset.field,
    clipPath: getComputedStyle(el).clipPath,
  }))
);
console.log("FIELD WIPE STATE AFTER LOAD:");
wipes.forEach((w) => console.log(` ${w.field}: ${w.clipPath}`));
const allOpen = wipes.every(
  (w) => w.clipPath === "none" || w.clipPath === "inset(0px 0px 0px 0px)"
);
console.log(allOpen ? "PASS all wipes open" : "FAIL wipe stuck hidden");
await browser.close();
