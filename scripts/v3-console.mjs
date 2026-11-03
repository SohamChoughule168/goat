/**
 * V3 console check — loads a URL and reports console errors, warnings,
 * page exceptions and failed network requests.
 *
 * Usage: node scripts/v3-console.mjs <url> [scroll-steps]
 */
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000/";
const steps = Number(process.argv[3] ?? 12);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const logs = [];
page.on("console", (msg) => {
  const type = msg.type();
  if (type === "error" || type === "warning") {
    logs.push(`[console.${type}] ${msg.text()}`);
  }
});
page.on("pageerror", (error) => {
  logs.push(`[pageerror] ${error.message}`);
});
page.on("requestfailed", (request) => {
  const failure = request.failure()?.errorText ?? "unknown";
  if (!failure.includes("ERR_ABORTED")) {
    logs.push(`[requestfailed] ${request.url()} — ${failure}`);
  }
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

const height = await page.evaluate(() => document.body.scrollHeight);
for (let i = 0; i < steps; i += 1) {
  await page.evaluate((y) => window.scrollTo(0, y), (height / steps) * i);
  await page.waitForTimeout(350);
}

const summary = logs.length === 0 ? "clean — no errors or warnings" : logs.join("\n");
console.log(summary);
await browser.close();
