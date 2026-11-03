import { expect, test } from "@playwright/test";

const station = (index: string) => `#station-${index}`;

test.describe("craft workshop", () => {
  test("no station mounts a WebGL canvas on first paint", async ({ page }) => {
    await page.goto("/craft");
    await expect(page.locator(".craft-station canvas")).toHaveCount(0);
  });

  test("publishes eleven benches, nine runnable and two honest gaps", async ({ page }) => {
    await page.goto("/craft");

    await expect(page.locator(".craft-station")).toHaveCount(11);
    await expect(page.locator('.craft-station[data-status="live"]')).toHaveCount(9);
    await expect(page.locator('.craft-station[data-status="pending"]')).toHaveCount(2);

    await expect(page.locator(station("01"))).toBeVisible();
    await expect(page.locator(station("11"))).toBeVisible();

    // Posters are the default and the only thing on the stage.
    await expect(page.locator(".craft-poster svg")).toHaveCount(11);
    await expect(page.locator(".craft-live")).toHaveCount(0);

    // Every live bench carries a run control; the two gaps do not.
    await expect(
      page.locator('.craft-station[data-status="live"] .craft-controls button', {
        hasText: /run station/i,
      }),
    ).toHaveCount(9);
  });

  test("is linked from the footer and about, and listed in the sitemap", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    const footerCraft = page
      .locator(".site-footer")
      .getByRole("link", { name: "Craft", exact: true });
    await expect(footerCraft).toHaveAttribute("href", /\/craft\/?$/);

    await page.goto("/about");
    await expect(
      page.getByRole("link", { name: /open the workshop/i }),
    ).toHaveAttribute("href", /\/craft\/?$/);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("/craft");
  });

  test("stations nine and ten stay disabled and name the missing asset", async ({ page }) => {
    await page.goto("/craft");

    const gaps = [
      { index: "09", asset: /\.riv file/i },
      { index: "10", asset: /\.splinecode file/i },
    ];

    for (const gap of gaps) {
      const bench = page.locator(station(gap.index));
      const run = bench.getByRole("button", { name: /run station/i });

      await expect(run).toBeDisabled();
      await expect(bench.locator(".craft-station-badge")).toHaveText(/asset pending/i);
      await expect(bench.locator(".craft-pending")).toBeVisible();
      await expect(bench.locator(".craft-pending")).toContainText(gap.asset);
      await expect(bench.locator(".craft-live")).toHaveCount(0);
    }
  });

  test("station 03 scrubs from exploded to assembled and resets", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("03"));
    await bench.getByRole("button", { name: /run station/i }).click();

    const range = bench.getByRole("slider", { name: /explosion/i });
    await expect(range).toHaveValue("100");

    await range.fill("0");
    await expect(bench.locator("output")).toContainText("0% exploded");
    await expect(range).toHaveAttribute("aria-valuetext", "0% exploded");

    const first = bench.locator('[data-plate-group]').first();
    await expect(first).toHaveAttribute("style", /translateY\(0px\)/);

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator(".craft-live")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();
  });

  test("station 04 loads a scroll-scrubbed film only on run", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("04"));
    await expect(bench.locator("canvas")).toHaveCount(0);
    await expect(bench.locator("video")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();

    await bench.getByRole("button", { name: /run station/i }).click();

    const video = bench.locator("video");
    await expect(video).toHaveCount(1);
    await expect(video).toHaveAttribute("preload", "metadata");
    await expect(video).toHaveAttribute("playsinline", "");
    await expect(video).not.toHaveAttribute("controls", /.*/);
    await expect(video).not.toHaveAttribute("autoplay", /.*/);

    await bench.getByRole("button", { name: /^cobalt$/i }).click();
    await expect(bench.locator(".craft-film-frame")).toHaveAttribute("data-tone", "cobalt");

    await bench.getByRole("button", { name: /^contact sheet$/i }).click();
    await expect(bench.locator(".craft-film-sheet img")).toHaveCount(6);

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator("video")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();
  });

  test("station 05 scopes its scrub to its own frame and releases on reset", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("05"));
    await bench.getByRole("button", { name: /run station/i }).click();

    await expect(bench.locator(".craft-timeline")).toHaveAttribute("data-motion", "scrub");

    await page.evaluate(() => window.scrollBy(0, 240));
    await expect(bench.locator(".craft-timeline-readout")).not.toBeEmpty();

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator(".craft-live")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();
  });

  test("station 06 drives canvas and DOM from one state object", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("06"));
    await bench.getByRole("button", { name: /run station/i }).click();

    await expect(bench.locator("canvas")).toBeVisible();

    const yaw = bench.getByRole("slider", { name: /yaw/i });
    await yaw.fill("72");

    await expect(bench.locator(".craft-bridge-readout")).toContainText("Yaw 72");
    await expect(bench.getByRole("slider", { name: /yaw/i })).toHaveValue("72");

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator(".craft-live")).toHaveCount(0);
  });

  test("station 07 tilts on a fine pointer and recentres on reset", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("07"));
    await bench.getByRole("button", { name: /run station/i }).click();

    const stage = bench.locator(".craft-tilt");
    // Centre the stage so the sticky header cannot sit over the pointer path.
    await stage.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect(stage).toHaveAttribute("data-enabled", "true");

    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.82, box.y + box.height * 0.24);
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.26);
    }

    const card = bench.locator(".craft-tilt-card");
    await expect(card).toHaveAttribute("style", /--tilt-y:\s*-?[0-9.]+deg/);
    await expect(card).toHaveAttribute("style", /--tilt-x:\s*-?[0-9.]+deg/);

    // Leaving the stage recentres the card without unmounting it.
    await page.mouse.move(2, 2);
    await expect(card).toHaveAttribute("style", /--tilt-x:\s*0deg/);
    await expect(card).toHaveAttribute("style", /--tilt-y:\s*0deg/);

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator(".craft-live")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();
  });

  test("station 08 loads lottie only on request and plays once", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("08"));
    await expect(bench.locator(".craft-dial-stage svg")).toHaveCount(0);

    await bench.getByRole("button", { name: /run station/i }).click();
    await expect(bench.locator(".craft-dial-stage svg")).toBeVisible({ timeout: 15_000 });

    await bench.getByRole("button", { name: /^pause$/i }).click();
    await expect(bench.locator(".craft-status")).toContainText(/paused/i);

    await bench.getByRole("button", { name: /^resume$/i }).click();
    await expect(bench.getByRole("button", { name: /^replay$/i })).toBeVisible();

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator(".craft-dial-stage svg")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();
  });

  test("station 11 enters five ledger rows and clears them on reset", async ({ page }) => {
    await page.goto("/craft");

    const bench = page.locator(station("11"));
    await expect(bench.locator(".craft-ledger-row")).toHaveCount(0);

    await bench.getByRole("button", { name: /run station/i }).click();
    await expect(bench.locator(".craft-ledger-row")).toHaveCount(5);
    await expect(bench.locator(".craft-ledger-row").first()).toContainText("01");

    await bench.getByRole("button", { name: /^reset$/i }).click();
    await expect(bench.locator(".craft-ledger-row")).toHaveCount(0);
    await expect(bench.locator(".craft-poster svg")).toBeVisible();
  });

  test("reduced motion keeps every station static on first paint", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/craft");

    await expect(page.locator(".craft-live")).toHaveCount(0);

    // Station 03 exposes hand scrubbing but no auto-play.
    const exploded = page.locator(station("03"));
    await exploded.getByRole("button", { name: /run station/i }).click();
    await expect(exploded.getByRole("button", { name: /play once/i })).toHaveCount(0);

    // Station 07 refuses to tilt.
    const tilt = page.locator(station("07"));
    await tilt.getByRole("button", { name: /run station/i }).click();
    await expect(tilt.locator(".craft-tilt")).toHaveAttribute("data-enabled", "false");

    // Station 08 offers one play and no autoplay-on-load.
    await expect(page.locator('.craft-dial-stage svg')).toHaveCount(0);
  });

  test("has no horizontal overflow at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/craft");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await expect(page.locator(".craft-station")).toHaveCount(11);
  });
});
