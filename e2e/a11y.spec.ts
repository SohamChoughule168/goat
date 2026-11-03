import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "home", path: "/" },
  { name: "platform", path: "/platform" },
  { name: "solutions", path: "/solutions" },
  { name: "proof", path: "/work" },
  { name: "craft", path: "/craft" },
  { name: "pricing", path: "/pricing" },
  { name: "process", path: "/process" },
  { name: "trust", path: "/trust" },
  { name: "about", path: "/about" },
  { name: "book", path: "/book" },
  { name: "contact", path: "/contact" },
  { name: "careers", path: "/careers" },
  { name: "faq", path: "/faq" },
  { name: "services", path: "/services" },
  { name: "blueprint", path: "/blueprint" },
  { name: "estimate", path: "/estimate" },
  { name: "quote", path: "/quote" },
  { name: "insights", path: "/insights" },
  { name: "case study", path: "/work/prv-financial-services" },
  { name: "privacy", path: "/legal/privacy" },
  { name: "terms", path: "/legal/terms" },
  { name: "cookies", path: "/legal/cookies" },
];

test("visible labels are included in accessible names", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withRules(["label-content-name-mismatch"])
    .analyze();

  expect(
    results.violations
      .filter(({ id }) => id === "label-content-name-mismatch")
      .map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map(({ target }) => target),
      })),
  ).toEqual([]);
});

for (const route of routes) {
  test(`${route.name} has no serious or critical accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );

    expect(
      blocking.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
    ).toEqual([]);
  });
}
