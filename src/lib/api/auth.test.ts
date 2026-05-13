import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";
import { authResponseToSessionUser, createAuthApi } from "./auth";
import { createClient } from "./client";

const client = createClient();
const api = createAuthApi(client);

describe("api/auth", () => {
  it("register lowercases the API role enum into UI shape", async () => {
    const out = await api.register({
      email: "test@example.co.za",
      password: "password123",
      firstName: "Test",
      surname: "Tester",
      role: "tenant",
    });
    expect(out.activeRole).toBe("tenant");
    expect(out.roles).toContain("tenant");
    expect(out.roles).toContain("landlord");
  });

  it("login returns tokens + profile", async () => {
    const out = await api.login({ email: "a@example.co.za", password: "p" });
    expect(out.accessToken).toBe("msw-access-token");
    expect(out.refreshToken).toBe("msw-refresh-token");
    expect(out.activeRole).toBe("tenant");
  });

  it("refresh sends the refresh token", async () => {
    let seenBody: unknown = null;
    server.use(
      http.post("/api/v1/auth/refresh", async ({ request }) => {
        seenBody = await request.json();
        return HttpResponse.json({
          accessToken: "new-acc",
          accessTokenExpiresAt: "2030-01-01T00:00:00Z",
          refreshToken: "new-ref",
          refreshTokenExpiresAt: "2030-12-31T00:00:00Z",
          userId: "00000000-0000-0000-0000-000000000001",
          email: "x@example.co.za",
          firstName: "Refresh",
          surname: "Tester",
          roles: ["TENANT"],
          activeRole: "TENANT",
        });
      }),
    );
    const out = await api.refresh("rt-value");
    expect(seenBody).toEqual({ refreshToken: "rt-value" });
    expect(out.accessToken).toBe("new-acc");
    expect(out.activeRole).toBe("tenant");
  });

  it("logout posts the refresh token when provided", async () => {
    let seen: unknown = null;
    server.use(
      http.post("/api/v1/auth/logout", async ({ request }) => {
        seen = await request.json();
        return new HttpResponse(null, { status: 204 });
      }),
    );
    await api.logout("rt-bye");
    expect(seen).toEqual({ refreshToken: "rt-bye" });
  });

  it("logout with no refresh token sends no body", async () => {
    let sawBody = false;
    server.use(
      http.post("/api/v1/auth/logout", async ({ request }) => {
        const text = await request.text();
        sawBody = text.length > 0;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    await api.logout(null);
    expect(sawBody).toBe(false);
  });

  it("me sends the Authorization header through the client", async () => {
    const authedClient = createClient({ getAccessToken: () => "tkn" });
    const authedApi = createAuthApi(authedClient);
    const out = await authedApi.me();
    expect(out.email).toBe("sipho@example.co.za");
    expect(out.activeRole).toBe("tenant");
  });

  it("me rejects with ApiError when unauthenticated", async () => {
    await expect(api.me()).rejects.toMatchObject({ status: 401, code: "UNAUTHORIZED" });
  });

  it("switchActiveRole uppercases the role before sending", async () => {
    let payload: unknown = null;
    server.use(
      http.patch("/api/v1/users/me/active-role", async ({ request }) => {
        payload = await request.json();
        return HttpResponse.json({
          id: "00000000-0000-0000-0000-000000000001",
          email: "x@example.co.za",
          firstName: "Switch",
          surname: "Tester",
          roles: ["TENANT", "LANDLORD"],
          activeRole: "LANDLORD",
          emailVerified: true,
          createdAt: "2026-01-01T00:00:00Z",
        });
      }),
    );
    const out = await api.switchActiveRole("landlord");
    expect(payload).toEqual({ role: "LANDLORD" });
    expect(out.activeRole).toBe("landlord");
  });

  it("authResponseToSessionUser projects the right fields", async () => {
    const out = await api.login({ email: "a@example.co.za", password: "p" });
    const session = authResponseToSessionUser(out);
    expect(session.id).toBe(out.userId);
    expect(session.firstName).toBe(out.firstName);
    expect(session.surname).toBe(out.surname);
    expect(session.name).toBe(`${out.firstName} ${out.surname}`);
    expect(session.email).toBe(out.email);
    expect(session.roles).toEqual(out.roles);
    expect(session.activeRole).toBe(out.activeRole);
  });
});
