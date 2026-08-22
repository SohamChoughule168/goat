import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3118/design-kit", { waitUntil: "networkidle" });

const target = page.locator('.field-wipe[data-field="cobalt"]');
await target.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);

const dbg = await page.evaluate(() => {
  const el = document.querySelector('.field-wipe[data-field="cobalt"]');
  const ioTargets = "[manual]";
  return {
    className: el?.className,
    hasIsIn: el?.classList.contains("is-in"),
    clipPath: el ? getComputedStyle(el).clipPath : null,
    rectTop: el ? Math.round(el.getBoundingClientRect().top) : null,
    viewportH: window.innerHeight,
    jsClass: document.documentElement.classList.contains("js"),
    totalIsIn: document.querySelectorAll(".is-in").length,
    ioTargets,
  };
});
console.log(JSON.stringify(dbg, null, 2));
await browser.close();
