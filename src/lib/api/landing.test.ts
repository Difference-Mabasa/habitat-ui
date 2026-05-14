import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";
import { createLandingApi } from "./landing";
import { createClient } from "./client";

const client = createClient();
const api = createLandingApi(client);

describe("api/landing.stats", () => {
  it("returns the three counts as numbers", async () => {
    server.use(
      http.get("/api/v1/landing/stats", () =>
        HttpResponse.json({
          activeListings: 50,
          registeredTenants: 17,
          suburbsCovered: 40,
        }),
      ),
    );

    const out = await api.stats();

    expect(out).toEqual({
      activeListings: 50,
      registeredTenants: 17,
      suburbsCovered: 40,
    });
  });

  it("accepts zeros across the board (pre-launch shape)", async () => {
    server.use(
      http.get("/api/v1/landing/stats", () =>
        HttpResponse.json({
          activeListings: 0,
          registeredTenants: 0,
          suburbsCovered: 0,
        }),
      ),
    );

    const out = await api.stats();

    expect(out.activeListings).toBe(0);
    expect(out.registeredTenants).toBe(0);
    expect(out.suburbsCovered).toBe(0);
  });
});
