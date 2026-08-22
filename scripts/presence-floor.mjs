import { chromium } from "@playwright/test";

const base = process.env.URL || "http://localhost:3118";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.add("js");
  document
    .querySelectorAll(".reveal, .field-wipe, [data-lines]")
    .forEach((el) => el.classList.add("is-in"));
});
await page.waitForTimeout(600);

const floor = await page.evaluate(() => {
  const fields = new Set(
    [...document.querySelectorAll("section.field")].map((s) => s.dataset.field)
  );
  const mega = document.querySelector(".mega");
  const megaSize = mega ? parseFloat(getComputedStyle(mega).fontSize) : null;
  const microSize = (() => {
    const m = document.querySelector(".micro");
    return m ? parseFloat(getComputedStyle(m).fontSize) : 11;
  })();
  const tg = document.querySelector(".type-graphic");
  const tgInfo = tg
    ? {
        fontSize: Math.round(parseFloat(getComputedStyle(tg).fontSize)),
        cropPx: Math.round(tg.scrollWidth - tg.parentElement.clientWidth),
      }
    : null;
  const chromatic = [...fields].filter((f) => !["paper", "ink"].includes(f));

  return {
    chromaticFields: chromatic.sort(),
    chromaticCount: chromatic.length,
    fieldSequence: [...document.querySelectorAll("section.field")].map(
      (s) => s.dataset.field
    ),
    megaPxAt1440: megaSize,
    typeRatio: Math.round((megaSize / microSize) * 10) / 10,
    typeAsGraphic: tgInfo,
    singleSentenceField: !!document.querySelector(
      '.field[data-field="vermilion"]'
    ),
    sentenceWordCount:
      document
        .querySelector('.field[data-field="vermilion"] .mega')
        ?.textContent.trim()
        .split(/\s+/).length ?? 0,
  };
});

console.log(JSON.stringify(floor, null, 2));
await browser.close();
