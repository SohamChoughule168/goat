import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.URL || "http://localhost:3119";
const routes = (process.env.ROUTES || "/").split(",");
const out = process.env.OUT || "docs/screenshots";
const mode = process.env.MODE || "light";
mkdirSync(out, { recursive: true });

const SIZES = [
  [1440, 900, "1440"],
  [390, 844, "390"],
];

const browser = await chromium.launch();
for (const route of routes) {
  for (const size of SIZES) {
    const width = size[0];
    const height = size[1];
    const label = size[2];
    const context = await browser.newContext({
      viewport: { width: width, height: height },
      colorScheme: mode === "dark" ? "dark" : "light",
    });
    const page = await context.newPage();
    await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(500);
    // Scroll through the page to fire IntersectionObservers, then settle
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1300);
    let slug = route === "/" ? "home" : route.slice(1);
    slug = slug.split("/").join("-");
    const file = `${out}/${slug}-${label}${mode === "dark" ? "-dark" : ""}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log("SHOT", file);
    await context.close();
  }
}
await browser.close();
