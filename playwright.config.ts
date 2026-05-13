import { defineConfig, devices } from "@playwright/test";

/**
 * Browser E2E configuration. Unit/component tests stay in src/**, driven by
 * Vitest + RTL + happy-dom. Playwright owns everything in e2e/** — real
 * Chromium, real DOM, real navigation against the Vite dev server.
 *
 * The webServer block starts `npm run dev` on demand and reuses an existing
 * one locally so the dev-loop is fast. CI gets a fresh server each run.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
