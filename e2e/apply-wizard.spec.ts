import { test, expect } from "@playwright/test";

const SEED_TENANT_EMAIL = "sipho@example.co.za";
const SEED_TENANT_PASSWORD = "habitat123";

test("apply wizard: lands on About you and clicks through to Review", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  // Authenticate via the API and seed the SessionProvider's localStorage
  // directly — avoids fragile form-driven sign-in.
  const login = await page.request.post("http://localhost:8080/api/v1/auth/login", {
    data: { email: SEED_TENANT_EMAIL, password: SEED_TENANT_PASSWORD },
  });
  expect(login.ok(), `login failed (${login.status()}): ${await login.text()}`).toBe(true);
  const auth = await login.json();

  // Discover any property + unit from the public catalogue.
  const props = await page.request.get(
    "http://localhost:8080/api/v1/properties?page=0&size=1",
  );
  const propertyId = (await props.json()).content?.[0]?.id;
  const detailResp = await page.request.get(
    `http://localhost:8080/api/v1/properties/${propertyId}`,
  );
  const detail = await detailResp.json();
  const unit = detail?.units?.find((u: { status: string }) => u.status === "AVAILABLE")
    ?? detail?.units?.[0];
  const unitId = unit?.id;
  expect(propertyId, "property in catalogue").toBeTruthy();
  expect(unitId, "unit on property").toBeTruthy();

  // Plant the session.
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate((authResp) => {
    window.localStorage.setItem(
      "habitat.session",
      JSON.stringify({
        user: {
          id: authResp.userId,
          firstName: authResp.firstName,
          surname: authResp.surname,
          name: `${authResp.firstName} ${authResp.surname}`.trim(),
          email: authResp.email,
          roles: authResp.roles,
          activeRole: authResp.activeRole,
        },
        tokens: {
          accessToken: authResp.accessToken,
          accessTokenExpiresAt: authResp.accessTokenExpiresAt,
          refreshToken: authResp.refreshToken,
          refreshTokenExpiresAt: authResp.refreshTokenExpiresAt,
        },
      }),
    );
  }, auth);

  // Navigate to /apply.
  await page.goto(`http://localhost:5173/apply?prop=${propertyId}&unit=${unitId}`, {
    waitUntil: "networkidle",
  });

  // ── Step 1 — About you ──
  await expect(page.getByRole("heading", { name: /Tell the landlord about you/i })).toBeVisible();
  await expect(page.locator('main[data-step="about"]')).toBeVisible();
  await page.getByRole("radio", { name: /^Employed$/i }).click();
  await page.getByRole("button", { name: /^Continue$/i }).click();

  // ── Step 2 — Your application ──
  await expect(page.getByRole("heading", { name: /^Your application$/i })).toBeVisible();
  await expect(page.locator('main[data-step="application"]')).toBeVisible();
  await page.getByPlaceholder(/Hi! I'm a young professional/i).fill(
    "Wizard click-through test — step 2 OK.",
  );
  await page.getByRole("button", { name: /^Continue$/i }).click();

  // ── Step 3 — Review ──
  await expect(page.getByRole("heading", { name: /Review and submit/i })).toBeVisible();
  await expect(page.locator('main[data-step="review"]')).toBeVisible();
  await expect(page.getByText(/Wizard click-through test/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Submit application/i })).toBeVisible();

  // ── Back navigation ──
  await page.getByRole("button", { name: /^Back$/i }).click();
  await expect(page.getByRole("heading", { name: /^Your application$/i })).toBeVisible();

  // ── Left rail click-back to a done step ──
  await page.getByRole("button", { name: /About you/i }).first().click();
  await expect(page.getByRole("heading", { name: /Tell the landlord about you/i })).toBeVisible();

  // Filter out the harmless dev refresh chatter that fires when API is
  // briefly probed; everything else should be silent.
  const fatal = errors.filter((e) => !/Failed to load resource.*4\d\d/i.test(e));
  expect(fatal, "no fatal console errors").toEqual([]);
});
