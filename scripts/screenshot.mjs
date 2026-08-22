import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.URL || "http://localhost:3118";
const routes = (process.env.ROUTES || "/design-kit,/").split(",");
mkdirSync("docs/screenshots", { recursive: true });

const browser = await chromium.launch();
for (const route of routes) {
  for (const [w, h, name] of [
    [1440, 900, "1440"],
    [390, 844, "390"],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.classList.add("js");
      document
        .querySelectorAll(".reveal, .field-wipe, [data-lines]")
        .forEach((el) => el.classList.add("is-in"));
    });
    await page.waitForTimeout(800);

    const mega = page.locator(".mega").first();
    let megaPx = "n/a";
    if (await mega.count()) {
      megaPx = String(await mega.evaluate((el) => Math.round(el.getBoundingClientRect().height)));
    }

    const slug = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    const file = `docs/screenshots/${slug}-${name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`SHOT ${file}  viewport=${w}x${h}  megaHeight=${megaPx}px`);
    await page.close();
  }
}
await browser.close();
