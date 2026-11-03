import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/work/",
  "/craft/",
  "/platform/",
  "/pricing/",
  "/process/",
  "/trust/",
  "/services/web-development/",
];

test.describe("static export routes", () => {
  for (const route of routes) {
    test(`${route} returns a complete document`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response?.status()).toBe(200);
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page).toHaveTitle(/.+/);
    });
  }
});

test.describe("homepage contract", () => {
  test("keeps the primary conversion paths", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: /book a working session/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /scope architect/i }).first(),
    ).toBeVisible();
  });

  test("has no horizontal overflow at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test("extensionless routes resolve with a trailing slash", async ({ page }) => {
  await page.goto("/work");

  await expect(page).toHaveURL(/\/work\/$/);
});
