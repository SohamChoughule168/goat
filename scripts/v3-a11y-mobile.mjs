/**
 * V3 mobile accessibility check — axe on a 390px touch profile, including the
 * WCAG 2.2 target-size rule that the desktop e2e suite cannot exercise.
 *
 * Usage: node scripts/v3-a11y-mobile.mjs [baseUrl]
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium, devices } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:4173";
const routes = [
  "/",
  "/work/",
  "/pricing/",
  "/craft/",
  "/trust/",
  "/platform/",
  "/process/",
  "/services/",
  "/contact/",
  "/book/",
  "/blueprint/",
];

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
let failures = 0;

for (const route of routes) {
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(700);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  if (blocking.length) {
    failures += blocking.length;
    console.log(`${route} FAIL`);
    for (const v of blocking) {
      console.log(
        `   ${v.id} (${v.impact}) — ${v.nodes.length} node(s):`,
        v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | "),
      );
    }
  } else {
    console.log(`${route} ok`);
  }
  await page.close();
}

await browser.close();
console.log(
  failures === 0
    ? "mobile a11y: clean — no serious or critical violations"
    : `mobile a11y: ${failures} blocking violations`,
);
process.exit(failures === 0 ? 0 : 1);
