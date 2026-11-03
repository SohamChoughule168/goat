/**
 * V3 visual QA capture — viewport-sized shots along the page so images stay
 * small enough to review. Reusable for before/after comparisons.
 *
 * Usage: node scripts/v3-capture.mjs <url> <prefix> [desktop|mobile|both] [maxShots]
 * Output: docs/screenshots/v3/<prefix>-<mode>-NN.png
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const url = process.argv[2] ?? "https://goat-wheat.vercel.app/";
const prefix = process.argv[3] ?? "site";
const mode = process.argv[4] ?? "both";
const maxShots = Number(process.argv[5] ?? 14);

const outDir = resolve("docs/screenshots/v3");
mkdirSync(outDir, { recursive: true });

const profiles = {
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    step: 810,
    shots: maxShots,
    isMobile: false,
  },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    step: 760,
    shots: Math.min(maxShots, 12),
    isMobile: true,
  },
};

const browser = await chromium.launch();

async function captureDesktop(name, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  // Trigger lazy media by walking down once, then return to top.
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += profile.viewport.height * 2) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const shots = Math.min(profile.shots, Math.ceil(total / profile.step));
  for (let i = 0; i < shots; i += 1) {
    await page.evaluate((yy) => window.scrollTo(0, yy), i * profile.step);
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${outDir}/${name}-${String(i + 1).padStart(2, "0")}.png` });
  }
  console.log(`${name}: ${shots} shots, page height ${total}px`);
  await context.close();
}

async function captureMobile(name, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += profile.viewport.height * 2) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const shots = Math.min(profile.shots, Math.ceil(total / profile.step));
  for (let i = 0; i < shots; i += 1) {
    await page.evaluate((yy) => window.scrollTo(0, yy), i * profile.step);
    await page.waitForTimeout(650);
    await page.screenshot({ path: `${outDir}/${name}-${String(i + 1).padStart(2, "0")}.png` });
  }
  console.log(`${name}: ${shots} shots, page height ${total}px`);
  await context.close();
}

const run = async () => {
  if (mode === "desktop" || mode === "both") {
    await captureDesktop(`${prefix}-desktop`, profiles.desktop);
  }
  if (mode === "mobile" || mode === "both") {
    await captureMobile(`${prefix}-mobile`, profiles.mobile);
  }
  await browser.close();
};

await run();
