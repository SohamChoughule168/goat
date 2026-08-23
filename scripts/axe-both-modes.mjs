import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.URL || "http://localhost:3117";
const routes = ["/", "/services/web-development", "/work/prv-financial-services", "/contact"];
let serious = 0;

const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({ colorScheme: scheme, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "load" });
  await page.evaluate(() => document.documentElement.classList.add("js"));
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const bad = results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
    if (bad.length) {
      serious += bad.length;
      console.log(`AXE FAIL ${route} (${scheme}):`, bad.map((v) => v.id).join(","));
    }
  }
  await context.close();
}
await browser.close();
console.log(serious === 0 ? "AXE CLEAN both modes" : `AXE FAILURES: ${serious}`);
