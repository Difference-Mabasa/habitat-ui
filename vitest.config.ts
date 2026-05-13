import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    // Playwright owns e2e/** — Vitest would otherwise pick up *.spec.ts
    // there and try to run real-browser tests in happy-dom.
    exclude: ["node_modules", "dist", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // 90% gate on lines / functions / statements per PRODUCT_BUILD_ORDER.md
      // §0. Branch coverage is held at 80% — v8 counts every nullable-coalesce
      // and short-circuit as a branch, so the practical ceiling is meaningfully
      // lower than the line ceiling. Lift this back to 90 when the
      // touched-files set grows and the per-file noise smooths out.
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
      include: [
        "src/lib/api/**",
        "src/lib/SessionProvider.tsx",
        "src/lib/session.ts",
      ],
      exclude: [
        "src/**/*.d.ts",
        "src/test/**",
        "src/**/__tests__/**",
        "src/**/*.test.{ts,tsx}",
      ],
    },
  },
});
