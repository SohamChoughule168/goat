import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning")
    console.log("CONSOLE[" + msg.type() + "]:", msg.text().slice(0, 200));
});

await page.goto("http://localhost:3118/design-kit", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const result = await page.evaluate(async () => {
  const el = document.querySelector('.field-wipe[data-field="cobalt"]');
  if (!el) return { error: "no element" };

  const manual = await new Promise((resolve) => {
    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        fired = true;
        resolve({ fired: true, ratio: entries[0].intersectionRatio });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    setTimeout(() => resolve({ fired: false }), 1500);
    void io;
    void fired;
  });

  return {
    hasIsIn: el.classList.contains("is-in"),
    clipPath: getComputedStyle(el).clipPath,
    manualIO: manual,
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
