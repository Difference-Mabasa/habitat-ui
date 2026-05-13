import { http, HttpResponse } from "msw";

/**
 * Default MSW handlers that mirror the habitat-api auth contract. Tests
 * override these for non-happy paths via `server.use(...)`.
 *
 * Token shape is just enough JSON to satisfy the UI's expectations — no real
 * JWT signing happens in tests.
 */
export const handlers = [
  http.post("/api/v1/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      firstName: string;
      surname: string;
      role: "TENANT" | "LANDLORD" | "AGENT";
      area?: string;
    };
    return HttpResponse.json(
      authResponseFor({
        email: body.email,
        firstName: body.firstName,
        surname: body.surname,
        activeRole: body.role,
      }),
      { status: 201 },
    );
  }),

  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    return HttpResponse.json(
      authResponseFor({
        email: body.email,
        firstName: "Mock",
        surname: "User",
        activeRole: "TENANT",
      }),
    );
  }),

  http.post("/api/v1/auth/refresh", async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };
    if (!body.refreshToken) {
      return HttpResponse.json(
        { status: 401, code: "UNAUTHORIZED", message: "Missing refresh token" },
        { status: 401 },
      );
    }
    return HttpResponse.json(
      authResponseFor({
        email: "refreshed@example.co.za",
        firstName: "Refreshed",
        surname: "User",
        activeRole: "TENANT",
      }),
    );
  }),

  http.post("/api/v1/auth/logout", () => new HttpResponse(null, { status: 204 })),

  http.get("/api/v1/users/me", ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return HttpResponse.json(
        { status: 401, code: "UNAUTHORIZED", message: "Authentication required." },
        { status: 401 },
      );
    }
    return HttpResponse.json({
      id: "00000000-0000-0000-0000-000000000001",
      email: "sipho@example.co.za",
      firstName: "Sipho",
      surname: "Dlamini",
      roles: ["TENANT", "LANDLORD", "AGENT", "ADMIN"],
      activeRole: "TENANT",
      emailVerified: true,
      area: "Brixton",
      createdAt: "2026-01-01T00:00:00Z",
    });
  }),

  http.patch("/api/v1/users/me/active-role", async ({ request }) => {
    const body = (await request.json()) as { role: string };
    return HttpResponse.json({
      id: "00000000-0000-0000-0000-000000000001",
      email: "sipho@example.co.za",
      firstName: "Sipho",
      surname: "Dlamini",
      roles: ["TENANT", "LANDLORD", "AGENT", "ADMIN"],
      activeRole: body.role,
      emailVerified: true,
      area: "Brixton",
      createdAt: "2026-01-01T00:00:00Z",
    });
  }),
];

function authResponseFor({
  email,
  firstName,
  surname,
  activeRole,
}: {
  email: string;
  firstName: string;
  surname: string;
  activeRole: string;
}) {
  const exp = new Date(Date.now() + 15 * 60_000).toISOString();
  const refreshExp = new Date(Date.now() + 7 * 86_400_000).toISOString();
  return {
    accessToken: "msw-access-token",
    accessTokenExpiresAt: exp,
    refreshToken: "msw-refresh-token",
    refreshTokenExpiresAt: refreshExp,
    userId: "00000000-0000-0000-0000-000000000001",
    email,
    firstName,
    surname,
    roles: ["TENANT", "LANDLORD", "AGENT", "ADMIN"],
    activeRole,
  };
}
