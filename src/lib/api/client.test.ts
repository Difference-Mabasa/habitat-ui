import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";
import { ApiError, createClient } from "./client";

describe("api client", () => {
  it("injects the Authorization bearer when a token is provided", async () => {
    let seen: string | null = null;
    server.use(
      http.get("/api/v1/probe", ({ request }) => {
        seen = request.headers.get("Authorization");
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createClient({ getAccessToken: () => "tkn-123" });
    await client.get("/probe");
    expect(seen).toBe("Bearer tkn-123");
  });

  it("does not inject Authorization when there is no token", async () => {
    let seen: string | null = null;
    server.use(
      http.get("/api/v1/anon", ({ request }) => {
        seen = request.headers.get("Authorization");
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createClient();
    await client.get("/anon");
    expect(seen).toBeNull();
  });

  it("parses ApiError on non-2xx and throws", async () => {
    server.use(
      http.post("/api/v1/fail", () =>
        HttpResponse.json(
          {
            status: 422,
            code: "VALIDATION_FAILED",
            message: "Bad",
            requestId: "req-1",
            errors: [{ field: "email", message: "Invalid" }],
          },
          { status: 422 },
        ),
      ),
    );

    const client = createClient();
    await expect(client.post("/fail", { email: "x" })).rejects.toMatchObject({
      status: 422,
      code: "VALIDATION_FAILED",
      message: "Bad",
      requestId: "req-1",
      fieldErrors: [{ field: "email", message: "Invalid" }],
    });
  });

  it("returns undefined for 204 responses", async () => {
    server.use(http.delete("/api/v1/thing", () => new HttpResponse(null, { status: 204 })));
    const client = createClient();
    const out = await client.delete<void>("/thing");
    expect(out).toBeUndefined();
  });

  it("retries once on 401 using the refresh callback", async () => {
    let calls = 0;
    server.use(
      http.get("/api/v1/protected", ({ request }) => {
        calls++;
        const auth = request.headers.get("Authorization");
        if (auth === "Bearer old") {
          return HttpResponse.json(
            { status: 401, code: "UNAUTHORIZED", message: "expired" },
            { status: 401 },
          );
        }
        return HttpResponse.json({ ok: true });
      }),
    );

    let token = "old";
    const refresh = vi.fn().mockImplementation(async () => {
      token = "new";
      return token;
    });
    const client = createClient({
      getAccessToken: () => token,
      refreshAccessToken: refresh,
    });

    const out = await client.get<{ ok: boolean }>("/protected");
    expect(out).toEqual({ ok: true });
    expect(calls).toBe(2);
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("calls onAuthFailure and returns the 401 ApiError when refresh fails", async () => {
    server.use(
      http.get("/api/v1/protected", () =>
        HttpResponse.json(
          { status: 401, code: "UNAUTHORIZED", message: "go away" },
          { status: 401 },
        ),
      ),
    );

    const onFail = vi.fn();
    const client = createClient({
      getAccessToken: () => "old",
      refreshAccessToken: async () => null,
      onAuthFailure: onFail,
    });

    await expect(client.get("/protected")).rejects.toBeInstanceOf(ApiError);
    expect(onFail).toHaveBeenCalledOnce();
  });

  it("sends FormData without setting Content-Type or stringifying", async () => {
    let seenContentType: string | null = null;
    let seenBody = "";
    server.use(
      http.post("/api/v1/upload", async ({ request }) => {
        seenContentType = request.headers.get("Content-Type");
        seenBody = await request.text();
        return HttpResponse.json({ ok: true });
      }),
    );
    const client = createClient();
    const fd = new FormData();
    fd.append("name", "test.png");
    await client.post("/upload", fd);
    // Our client must not force application/json on multipart bodies.
    expect(seenContentType).not.toBe("application/json");
    expect(seenBody).toContain("test.png");
  });

  it("falls back to a synthetic ApiError when the error body is not JSON", async () => {
    server.use(
      http.get("/api/v1/text-err", () =>
        new HttpResponse("internal boom", { status: 500, headers: { "Content-Type": "text/plain" } }),
      ),
    );
    const client = createClient();
    await expect(client.get("/text-err")).rejects.toMatchObject({
      status: 500,
      code: "UNKNOWN_ERROR",
      message: "internal boom",
    });
  });

  it("throws MALFORMED_JSON when a 2xx body isn't parseable JSON", async () => {
    server.use(
      http.get("/api/v1/garbage", () =>
        new HttpResponse("not json", { status: 200, headers: { "Content-Type": "application/json" } }),
      ),
    );
    const client = createClient();
    await expect(client.get("/garbage")).rejects.toMatchObject({
      status: 200,
      code: "MALFORMED_JSON",
    });
  });

  it("skips refresh when skipAuthRefresh is true", async () => {
    server.use(
      http.get("/api/v1/no-refresh", () =>
        HttpResponse.json({ status: 401, code: "UNAUTHORIZED", message: "x" }, { status: 401 }),
      ),
    );
    const refresh = vi.fn();
    const client = createClient({
      getAccessToken: () => "t",
      refreshAccessToken: refresh,
    });
    await expect(client.get("/no-refresh", { skipAuthRefresh: true })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(refresh).not.toHaveBeenCalled();
  });
});
