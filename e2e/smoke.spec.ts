import { expect, test } from "@playwright/test";

test.describe("landing", () => {
  test("renders the hero heading and the search CTA", async ({ page }) => {
    await page.goto("/landing");
    await expect(
      page.getByRole("heading", { level: 1, name: /your hood\.?\s*your spot\.?/i }),
    ).toBeVisible();
  });

  test("navigates to /browse when the user submits a search", async ({ page }) => {
    await page.goto("/landing");
    const search = page.getByRole("button", { name: /search/i }).first();
    await search.click();
    await expect(page).toHaveURL(/\/browse(\?|$)/);
  });
});
