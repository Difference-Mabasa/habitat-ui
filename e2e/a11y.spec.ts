import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * One axe scan per public surface that's stable. As pages mature, add them
 * here — the goal is a zero-WCAG-AA-violation baseline on the public flows.
 */
const PUBLIC_PAGES: ReadonlyArray<{ name: string; path: string }> = [
  { name: "landing", path: "/landing" },
];

for (const { name, path } of PUBLIC_PAGES) {
  test(`a11y: ${name} has no WCAG 2.1 A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
