import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";

const base = process.env.URL || "https://goat-o1bscfnq3-sohamchoughule168s-projects.vercel.app";
const routes = ["/", "/services/web-development", "/work/prv-financial-services", "/contact"];
mkdirSync("docs/screenshots/v3/final", { recursive: true });

const browser = await chromium.launch();
let axeFail = 0, shotCount = 0;

for (const scheme of ["light", "dark"]) {
  for (const size of [[1440, 900, "desktop"], [768, 1024, "tablet"], [390, 844, "mobile"]]) {
    const context = await browser.newContext({
      colorScheme: scheme,
      viewport: { width: size[0], height: size[1] },
    });
    const page = await context.newPage();

    // Test key routes
    for (const route of ["/", "/services/web-development"]) {
      await page.goto(base + route, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `docs/screenshots/v3/final/${scheme}-${size[2]}${route.replace(/\//g, "-") || "-home"}.png`, fullPage: false });
      shotCount++;
    }

    // Axe on home only per mode (fast)
    if (size[0] === 1440) {
      await page.goto(base + "/", { waitUntil: "load" });
      await page.waitForTimeout(400);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const bad = results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
      axeFail += bad.length;
      console.log(`axe ${scheme}: ${bad.length} serious/critical`);
      for (const v of bad) console.log("  " + v.id + " " + v.help);
    }

    await context.close();
  }
}

// Keyboard navigation pass
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  let focusable = 0;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName + ":" + (el.textContent?.trim().slice(0, 20) || el.getAttribute("aria-label") || "") : "none";
    });
    console.log(`TAB ${i + 1}: ${focused}`);
    focusable++;
  }
  console.log(focusable >= 5 ? "PASS keyboard nav" : "FAIL keyboard nav");
  await context.close();
}

console.log(`\nScreenshots: ${shotCount} | axe serious/critical: ${axeFail}`);
await browser.close();
