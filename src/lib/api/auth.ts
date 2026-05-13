import { type ApiClient } from "./client";
import type { Role, SessionUser } from "@/lib/session";

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface AuthResponse extends AuthTokens {
  userId: string;
  email: string;
  firstName: string;
  surname: string;
  roles: Role[];
  activeRole: Role;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  surname: string;
  role: Exclude<Role, "admin">; // ADMIN/SUPER_ADMIN can't self-register
  area?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserMeResponse {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  roles: Role[];
  activeRole: Role;
  emailVerified: boolean;
  area?: string;
  createdAt: string;
}

export interface AuthApi {
  register(payload: RegisterPayload): Promise<AuthResponse>;
  login(payload: LoginPayload): Promise<AuthResponse>;
  refresh(refreshToken: string): Promise<AuthResponse>;
  logout(refreshToken: string | null): Promise<void>;
  me(): Promise<UserMeResponse>;
  switchActiveRole(role: Role): Promise<UserMeResponse>;
}

/**
 * Maps the API's uppercase Role enum (USER / AGENT / ADMIN / SUPER_ADMIN)
 * to the UI's lowercase Role union ("user" | "agent" | "admin"). SUPER_ADMIN
 * collapses to "admin" on the UI side. Any unknown / legacy value (e.g. data
 * encountered before the V4 collapse migration) is mapped to "user" as a
 * safe default rather than throwing — the UI keeps rendering.
 */
function toUiRole(apiRole: string): Role {
  const key = apiRole.toLowerCase();
  if (key === "super_admin") return "admin";
  if (key === "user" || key === "agent" || key === "admin") return key;
  return "user";
}

function toApiRole(uiRole: Role): string {
  return uiRole.toUpperCase();
}

function transformResponse<T extends { roles: string[]; activeRole: string }>(raw: T) {
  return {
    ...raw,
    roles: raw.roles.map(toUiRole),
    activeRole: toUiRole(raw.activeRole),
  };
}

export function createAuthApi(client: ApiClient): AuthApi {
  return {
    async register(payload) {
      const raw = await client.post<RawAuthResponse>("/auth/register", {
        ...payload,
        role: toApiRole(payload.role),
      });
      return transformResponse(raw) as AuthResponse;
    },
    async login(payload) {
      const raw = await client.post<RawAuthResponse>("/auth/login", payload);
      return transformResponse(raw) as AuthResponse;
    },
    async refresh(refreshToken) {
      const raw = await client.post<RawAuthResponse>(
        "/auth/refresh",
        { refreshToken },
        { skipAuthRefresh: true },
      );
      return transformResponse(raw) as AuthResponse;
    },
    async logout(refreshToken) {
      await client.post<void>(
        "/auth/logout",
        refreshToken ? { refreshToken } : undefined,
      );
    },
    async me() {
      const raw = await client.get<RawUserMe>("/users/me");
      return transformResponse(raw) as UserMeResponse;
    },
    async switchActiveRole(role) {
      const raw = await client.patch<RawUserMe>("/users/me/active-role", {
        role: toApiRole(role),
      });
      return transformResponse(raw) as UserMeResponse;
    },
  };
}

interface RawAuthResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  email: string;
  firstName: string;
  surname: string;
  roles: string[];
  activeRole: string;
}

interface RawUserMe {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  roles: string[];
  activeRole: string;
  emailVerified: boolean;
  area?: string;
  createdAt: string;
}

/** Convenience: convert an AuthResponse into the SessionUser shape. */
export function authResponseToSessionUser(res: AuthResponse): SessionUser {
  return {
    id: res.userId,
    firstName: res.firstName,
    surname: res.surname,
    name: `${res.firstName} ${res.surname}`.trim(),
    email: res.email,
    roles: res.roles,
    activeRole: res.activeRole,
  };
}
