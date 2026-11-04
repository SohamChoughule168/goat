/**
 * V3 crop check — screenshot one selector on a page at mobile size.
 * Usage: node scripts/v3-crop.mjs <url> <selector> <outName>
 */
import { chromium, devices } from "@playwright/test";

const [url, selector, outName] = process.argv.slice(2);

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

const el = await page.$(selector);
if (!el) {
  console.log(`no element for ${selector}`);
} else {
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await el.screenshot({ path: `docs/screenshots/v3/${outName}.png` });
  const styles = await el.evaluate((node) => {
    const link = node.querySelector("a");
    const cs = link ? getComputedStyle(link) : null;
    return {
      linkColor: cs?.color ?? null,
      linkBg: cs?.backgroundColor ?? null,
      sectionVisibility: getComputedStyle(node.closest("section") ?? node).contentVisibility,
    };
  });
  console.log(`${outName} captured`, JSON.stringify(styles));
}

await browser.close();
