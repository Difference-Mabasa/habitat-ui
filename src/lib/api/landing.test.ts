import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";
import { createLandingApi } from "./landing";
import { createClient } from "./client";

const client = createClient();
const api = createLandingApi(client);

describe("api/landing.cities", () => {
  it("requests the default size when none provided", async () => {
    let seenUrl = "";
    server.use(
      http.get("/api/v1/landing/cities", ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json([
          { name: "Midrand", listingCount: 25 },
          { name: "Cape Town", listingCount: 9 },
        ]);
      }),
    );

    const out = await api.cities();

    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ name: "Midrand", listingCount: 25 });
    expect(seenUrl).not.toContain("size=");
  });

  it("forwards an explicit size parameter", async () => {
    let seenUrl = "";
    server.use(
      http.get("/api/v1/landing/cities", ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    await api.cities(3);

    expect(seenUrl).toContain("size=3");
  });
});

describe("api/landing.stats", () => {
  it("returns the four counts as numbers", async () => {
    server.use(
      http.get("/api/v1/landing/stats", () =>
        HttpResponse.json({
          activeListings: 50,
          registeredTenants: 17,
          suburbsCovered: 40,
          tenantsLast7Days: 5,
        }),
      ),
    );

    const out = await api.stats();

    expect(out).toEqual({
      activeListings: 50,
      registeredTenants: 17,
      suburbsCovered: 40,
      tenantsLast7Days: 5,
    });
  });

  it("accepts zeros across the board (pre-launch shape)", async () => {
    server.use(
      http.get("/api/v1/landing/stats", () =>
        HttpResponse.json({
          activeListings: 0,
          registeredTenants: 0,
          suburbsCovered: 0,
          tenantsLast7Days: 0,
        }),
      ),
    );

    const out = await api.stats();

    expect(out.activeListings).toBe(0);
    expect(out.registeredTenants).toBe(0);
    expect(out.suburbsCovered).toBe(0);
    expect(out.tenantsLast7Days).toBe(0);
  });
});
