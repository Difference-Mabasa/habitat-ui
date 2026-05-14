import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";
import { createPropertiesApi } from "./properties";
import { createClient } from "./client";

const client = createClient();
const api = createPropertiesApi(client);

describe("api/properties.popularAreas", () => {
  it("requests the default size when none provided", async () => {
    let seenUrl = "";
    server.use(
      http.get("/api/v1/properties/popular-areas", ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json([
          { name: "Sandton", listingCount: 7 },
          { name: "Camps Bay", listingCount: 3 },
        ]);
      }),
    );

    const out = await api.popularAreas();

    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ name: "Sandton", listingCount: 7 });
    // No `size=` query param when caller omits it — the server uses its own default.
    expect(seenUrl).not.toContain("size=");
  });

  it("forwards an explicit size parameter", async () => {
    let seenUrl = "";
    server.use(
      http.get("/api/v1/properties/popular-areas", ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json([]);
      }),
    );

    await api.popularAreas(6);

    expect(seenUrl).toContain("size=6");
  });

  it("propagates server payload shape verbatim (incl. editorial zero counts)", async () => {
    server.use(
      http.get("/api/v1/properties/popular-areas", () =>
        HttpResponse.json([
          { name: "Sandton", listingCount: 0 },
          { name: "Umhlanga", listingCount: 0 },
          { name: "Camps Bay", listingCount: 0 },
        ]),
      ),
    );

    const out = await api.popularAreas(3);

    expect(out).toEqual([
      { name: "Sandton", listingCount: 0 },
      { name: "Umhlanga", listingCount: 0 },
      { name: "Camps Bay", listingCount: 0 },
    ]);
  });
});
