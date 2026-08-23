import { chromium } from "@playwright/test";

const browser = await chromium.launch();
let fail = 0;
const t = (pass, label) => {
  console.log((pass ? "PASS" : "FAIL") + " " + label);
  if (!pass) fail++;
};

// Field wipes: each must OPEN when scrolled into view.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3118/design-kit", { waitUntil: "networkidle" });
  const wipes = page.locator(".field-wipe");
  const count = await wipes.count();
  for (let i = 0; i < count; i++) {
    const el = wipes.nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(780);
    const field = await el.getAttribute("data-field");
    const clip = await el.evaluate((n) => getComputedStyle(n).clipPath);
    const open = clip === "none" || clip.startsWith("inset(0px");
    t(open, `wipe ${field} opens on view (${clip})`);
  }
  await page.close();
}

// Reveals on home: rows must be opacity 1 once in view.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3118/", { waitUntil: "networkidle" });
  const rows = page.locator("ul .reveal");
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const el = rows.nth(i);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const op = parseFloat(await el.evaluate((n) => getComputedStyle(n).opacity));
    t(op > 0.95, `offering row ${i + 1} revealed (opacity=${op})`);
  }
  await page.close();
}

await browser.close();
console.log(fail === 0 ? "\nMOTION AUDIT CLEAN" : `\nFAILURES: ${fail}`);
process.exit(fail === 0 ? 0 : 1);

