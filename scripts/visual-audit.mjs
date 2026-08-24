import { chromium } from "@playwright/test";

const base = "http://localhost:3119";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "load" });

// Audit the rendered experience
const audit = await page.evaluate(() => {
  const body = getComputedStyle(document.body);
  const h1 = document.querySelector("h1");
  const h1Style = h1 ? getComputedStyle(h1) : null;

  // Count sections
  const sections = document.querySelectorAll("section, [data-chapter]");

  // Check for visual elements
  const canvases = document.querySelectorAll("canvas");
  const svgs = document.querySelectorAll("svg");
  const images = document.querySelectorAll("img");

  // Check for CSS custom properties
  const rootStyle = getComputedStyle(document.documentElement);

  // Find all unique background colors used
  const bgColors = new Set();
  document.querySelectorAll("*").forEach(el => {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)") bgColors.add(bg);
  });

  // Font sizes used
  const fontSizes = new Set();
  document.querySelectorAll("h1, h2, h3, p, span").forEach(el => {
    fontSizes.add(getComputedStyle(el).fontSize);
  });

  return {
    bodyBg: body.backgroundColor,
    bodyColor: body.color,
    bodyFontFamily: body.fontFamily.split(",")[0],
    h1Exists: !!h1,
    h1FontSize: h1Style?.fontSize,
    h1FontWeight: h1Style?.fontWeight,
    h1Color: h1Style?.color,
    sectionCount: sections.length,
    canvasCount: canvases.length,
    svgCount: svgs.length,
    imgCount: images.length,
    uniqueBgColors: [...bgColors].slice(0, 10),
    uniqueFontSizes: [...fontSizes].sort((a, b) => parseFloat(b) - parseFloat(a)).slice(0, 8),
    themeAttr: document.documentElement.dataset.theme,
    hasRevealSystem: !!document.querySelector(".reveal"),
    hasLineMask: !!document.querySelector(".line-mask"),
    hasConsolePanel: !!document.querySelector(".console-panel") || !!document.querySelector("[class*='module-panel']"),
  };
});

console.log(JSON.stringify(audit, null, 2));
await browser.close();
