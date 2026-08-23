import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const base = process.env.URL || "http://localhost:3118";
const ROUTES = (
  process.env.ROUTES ||
  "/,/services,/services/web-development,/work/prv-financial-services,/contact,/design-system"
).split(",");

const _css = readFileSync("src/styles/tokens.css", "utf8");
const expected = {
  light: { bg: "rgb(249, 250, 252)", text: "#07090E" },
  dark: { bg: "rgb(7, 9, 14)", text: "#EBEDF1" },
};

let failures = 0;
const t = (pass, label, extra = "") => {
  console.log((pass ? "PASS" : "FAIL") + " " + label + (extra ? " — " + extra : ""));
  if (!pass) failures++;
};

const browser = await chromium.launch();

for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    try {
      const s = localStorage.getItem("imaginars-theme");
      const d =
        s === "dark" ||
        ((!s || s === "system") &&
          matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = d ? "dark" : "light";
    } catch {}
  });

  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(300);
  const earlyBg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );
  t(`no flash (${scheme})`, earlyBg === expected[scheme].bg, "got " + earlyBg);

  const empty = await page.evaluate(() => {
    const names = [
      "bg","surface","surface-raised","surface-sunken","text","text-muted",
      "text-subtle","border-hairline","border","border-interactive","accent",
      "accent-hover","accent-fg","accent-subtle","focus-ring","success",
      "warning","danger",
    ];
    const cs = getComputedStyle(document.documentElement);
    return names.filter((n) => !cs.getPropertyValue("--color-" + n).trim());
  });
  t(`token resolution (${scheme})`, empty.length === 0, empty.join(",") || "all resolve");

  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: "load" });
    await page.evaluate(() => {
      document.documentElement.classList.add("js");
      document
        .querySelectorAll(".reveal, [data-lines]")
        .forEach((el) => el.classList.add("is-in"));
    });
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact)
    );
    t(
      `axe ${route} (${scheme})`,
      serious.length === 0,
      serious.map((v) => v.id).join(",") || "clean"
    );
  }
  await context.close();
}

await browser.close();
console.log(failures === 0 ? "\nTHEME AUDIT CLEAN" : "\nFAILURES: " + failures);
process.exit(failures === 0 ? 0 : 1);
