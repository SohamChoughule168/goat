import { expect, test } from "@playwright/test";

test.describe("evidence routes", () => {
  test("work keeps one verified case and marks the confidential gap", async ({ page }) => {
    await page.goto("/work");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /case studies you can check/i,
    );
    await expect(page.getByRole("heading", { name: "PRV Financial Services" })).toBeVisible();
    await expect(page.getByText("No invented proof", { exact: true })).toBeVisible();
    await expect(page.getByText(/more work exists\. most of it is under nda/i)).toBeVisible();
  });

  test("platform opens one layer at a time and names the seams", async ({ page }) => {
    await page.goto("/platform");

    const brand = page.getByRole("button", { name: /brand/i });
    const website = page.getByRole("button", { name: /website/i });

    await expect(website).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#stack-website-panel")).toBeVisible();

    await brand.click();

    await expect(brand).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#stack-brand-panel")).toBeVisible();
    await expect(website).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#stack-website-panel")).toBeHidden();

    await page.keyboard.press("Escape");
    await expect(brand).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#stack-brand-panel")).toBeHidden();

    await expect(page.locator(".ev-seam")).toHaveCount(5);
  });

  test("pricing filters the scope matrix to changed capabilities", async ({ page }) => {
    await page.goto("/pricing");

    const rows = page.locator("table.ev-matrix tbody tr:not(.ev-matrix-group)");
    const status = page.locator(".ev-matrix-status");

    await expect(rows).toHaveCount(22);
    await expect(status).toContainText(/22 of 22/i);

    await page.locator(".ev-switch-label").click();
    await expect(rows).toHaveCount(16);
    await expect(status).toContainText(/16 of 22/i);

    await page.locator(".ev-switch-label").click();
    await expect(rows).toHaveCount(22);
    await expect(status).toContainText(/22 of 22/i);

    await expect(page.getByText("Quoted after diagnosis", { exact: true }).first()).toBeVisible();
  });

  test("pricing builder keeps package selection and quote links in sync", async ({ page }) => {
    await page.goto("/pricing?package=pro#builder");

    await expect(page.locator(".ev-summary-name")).toHaveText("Pro");
    await expect(page.locator(".ev-summary-total strong").first()).toHaveText(/1,49,999/);

    await page.getByRole("button", { name: /^Starter/ }).click();

    await expect(page.locator(".ev-summary-name")).toHaveText("Starter");
    await expect(page.locator(".ev-summary-total strong").first()).toHaveText(/29,999/);
    await expect(page.getByRole("link", { name: /request a written quote/i })).toHaveAttribute(
      "href",
      /package=starter/,
    );
  });

  test("process links the sticky index to scroll on desktop", async ({ page }) => {
    await page.goto("/process");

    const timeline = page.locator(".ev-timeline");
    await expect(timeline).toHaveAttribute("data-motion", "scrub");
    await expect(page.locator(".ev-timeline-rail")).toBeVisible();

    await page.evaluate(() => {
      const last = document.querySelector("#phase-04");
      if (last) {
        window.scrollTo({
          top: last.getBoundingClientRect().top + window.scrollY - 180,
          behavior: "instant",
        });
      }
    });

    await expect(page.locator('.ev-stage[data-active="true"]')).toHaveCount(1);
    await expect(page.locator('.ev-timeline-link[aria-current="location"]')).toHaveCount(1);
    await expect(page.locator("#phase-04")).toHaveAttribute("data-active", "true");
  });

  test("process falls back to a static sequence on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/process");

    await expect(page.locator(".ev-timeline")).toHaveAttribute("data-motion", "static");
    await expect(page.locator(".ev-timeline-rail")).toBeHidden();
    await expect(page.locator(".ev-stage")).toHaveCount(4);
    await expect(page.locator('.ev-stage[data-active="true"]')).toHaveCount(0);
  });

  test("process falls back to a static sequence with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/process");

    await expect(page.locator(".ev-timeline")).toHaveAttribute("data-motion", "static");
    await expect(page.locator(".ev-timeline-rail")).toBeHidden();
    await expect(page.locator(".ev-stage")).toHaveCount(4);
  });

  test("trust shows the static seal, then loads Lottie only on request", async ({ page }) => {
    await page.goto("/trust");

    await expect(page.locator("svg.ev-seal-poster")).toBeVisible();
    await expect(page.locator(".ev-seal-lottie svg")).toHaveCount(0);

    await page.getByRole("button", { name: /run the seal/i }).click();

    await expect(page.locator(".ev-seal-lottie svg")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(".ev-seal-status")).toContainText(/playing|complete/i);

    await page.getByRole("button", { name: /^pause$/i }).click();
    await expect(page.locator(".ev-seal-status")).toContainText(/paused/i);
    await page.getByRole("button", { name: /^resume$/i }).click();

    await expect(page.locator(".ev-seal-status")).toContainText(/complete/i, {
      timeout: 8_000,
    });
    await expect(page.getByRole("button", { name: /^replay$/i })).toBeVisible();
  });

  test("trust plays once and restores the poster with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/trust");

    const playOnce = page.getByRole("button", { name: /play once/i });
    await expect(playOnce).toBeVisible();
    await playOnce.click();

    await expect(page.locator(".ev-seal-lottie svg")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(".ev-seal-status")).toContainText(/static seal/i, {
      timeout: 10_000,
    });
    await expect(page.locator("svg.ev-seal-poster")).toBeVisible();
    await expect(page.locator(".ev-seal-lottie svg")).toHaveCount(0);
  });

  test("trust publishes four handover plates and no canvas", async ({ page }) => {
    await page.goto("/trust");
    await expect(page.locator(".handover-plate")).toHaveCount(4);
    await expect(page.locator(".handover-plate").first()).toContainText("The diagnosis");
    await expect(page.locator(".handover").locator("canvas")).toHaveCount(0);
  });

  test("reduced motion shows the handover plates stacked", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/trust");
    await expect(page.locator(".handover-plate")).toHaveCount(4);
    const positions = await page.locator(".handover-plate").evaluateAll((plates) =>
      plates.map((plate) => getComputedStyle(plate).position),
    );
    expect(new Set(positions)).toEqual(new Set(["static"]));
  });
});
