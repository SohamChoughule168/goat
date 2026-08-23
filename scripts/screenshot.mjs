import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.URL || "http://localhost:3117";
const routes = (process.env.ROUTES || "/").split(",");
const out = process.env.OUT || "docs/screenshots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const route of routes) {
  for (const [w, h, name] of [
    [1440, 900, "1440"],
    [390, 844, "390"],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const slug = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    const file = `${out}/${slug}-${name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log("SHOT", file);
    await page.close();
  }
}
await browser.close();
