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

  // ── Step 1 — Your application (employment + message + move-in) ──
  await expect(page.getByRole("heading", { name: /^Your application$/i })).toBeVisible();
  await expect(page.locator('main[data-step="application"]')).toBeVisible();
  await page.getByRole("radio", { name: /^Employed$/i }).click();
  await page.getByPlaceholder(/Hi! I'm a young professional/i).fill(
    "Wizard click-through test — step 1 OK.",
  );
  await page.getByRole("button", { name: /^Continue$/i }).click();

  // ── Step 2 — Documents ──
  await expect(page.getByRole("heading", { name: /Upload your documents/i })).toBeVisible();
  await expect(page.locator('main[data-step="documents"]')).toBeVisible();
  const sampleFile = {
    name: "id-front.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 fake", "utf-8"),
  };
  await page.locator("input#apply-doc-SA_ID").setInputFiles(sampleFile);
  await expect(page.getByText("id-front.pdf").first()).toBeVisible();
  await page.getByRole("button", { name: /^Continue$/i }).click();

  // ── Step 3 — Review ──
  await expect(page.getByRole("heading", { name: /Review and submit/i })).toBeVisible();
  await expect(page.locator('main[data-step="review"]')).toBeVisible();
  await expect(page.getByText(/Wizard click-through test/i)).toBeVisible();
  await expect(page.getByText("id-front.pdf").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Submit application/i })).toBeVisible();

  // ── Back navigation ──
  await page.getByRole("button", { name: /^Back$/i }).click();
  await expect(page.getByRole("heading", { name: /Upload your documents/i })).toBeVisible();

  // ── Left rail click-back to a done step ──
  await page.getByRole("button", { name: /Your application/i }).first().click();
  await expect(page.locator('main[data-step="application"]')).toBeVisible();

  const fatal = errors.filter((e) => !/Failed to load resource.*4\d\d/i.test(e));
  expect(fatal, "no fatal console errors").toEqual([]);
});

test("apply wizard: in-wizard confirmation lives inside the same shell after submit", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  const login = await page.request.post("http://localhost:8080/api/v1/auth/login", {
    data: { email: SEED_TENANT_EMAIL, password: SEED_TENANT_PASSWORD },
  });
  expect(login.ok()).toBe(true);
  const auth = await login.json();

  // Find any property whose first AVAILABLE unit hasn't already been
  // applied to by this tenant — try a few, since this test reruns.
  const props = await page.request.get(
    "http://localhost:8080/api/v1/properties?page=0&size=20",
  );
  const propsBody = await props.json();
  let propertyId: string | undefined;
  let unitId: string | undefined;
  for (const p of propsBody.content ?? []) {
    const detail = await (
      await page.request.get(`http://localhost:8080/api/v1/properties/${p.id}`)
    ).json();
    const unit = detail.units?.find((u: { status: string }) => u.status === "AVAILABLE");
    if (!unit) continue;
    propertyId = detail.id;
    unitId = unit.id;
    break;
  }
  expect(propertyId, "found an applicable property/unit").toBeTruthy();

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

  await page.goto(`http://localhost:5173/apply?prop=${propertyId}&unit=${unitId}`, {
    waitUntil: "networkidle",
  });

  // Walk all 3 steps to Review.
  await page.getByRole("radio", { name: /^Employed$/i }).click();
  await page.getByRole("button", { name: /^Continue$/i }).click();
  await page.getByRole("button", { name: /^Continue$/i }).click(); // skip docs
  await expect(page.locator('main[data-step="review"]')).toBeVisible();
  await page.getByRole("button", { name: /Submit application/i }).click();

  // Confirmation must live inside the same shell (data-step="submitted").
  await expect(page.locator('main[data-step="submitted"]')).toBeVisible({ timeout: 10_000 });
  // The listing recap (right rail) is still rendered.
  await expect(page.getByText(/Applying for/i)).toBeVisible();
  // The "Submitted" milestone shows in the left rail.
  await expect(page.getByText(/^Submitted$/)).toBeVisible();
  // Follow-up CTAs.
  await expect(page.getByRole("link", { name: /My applications/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse more units/i })).toBeVisible();

  const fatal = errors.filter((e) => !/Failed to load resource.*4\d\d/i.test(e));
  expect(fatal, "no fatal console errors").toEqual([]);
});
