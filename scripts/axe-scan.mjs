import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.URL || "http://localhost:3118";
const routes = ["/", "/services", "/work/prv-financial-services", "/contact", "/design-kit"];

const browser = await chromium.launch();
let totalViolations = 0;

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.classList.add("js");
    document
      .querySelectorAll(".reveal, .field-wipe, [data-lines]")
      .forEach((el) => el.classList.add("is-in"));
  });
  await page.waitForTimeout(400);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact)
  );
  const minor = results.violations.length - serious.length;
  totalViolations += serious.length;

  console.log(
    route +
      ": " +
      results.violations.length +
      " violations (" +
      serious.length +
      " serious/critical, " +
      minor +
      " moderate/minor)"
  );
  for (const v of serious) {
    console.log("   x " + v.id + " [" + v.impact + "] " + v.help);
    for (const n of v.nodes.slice(0, 3)) {
      console.log("     -> " + n.target.join(" "));
    }
  }
  await context.close();
}

console.log(
  totalViolations === 0
    ? "\nAXE: zero serious/critical violations across scanned routes"
    : "\nAXE: " + totalViolations + " serious/critical to fix"
);
await browser.close();
process.exit(totalViolations === 0 ? 0 : 1);
