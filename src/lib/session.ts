import { createContext, useContext } from "react";
import type { ApiClient } from "@/lib/api/client";

/**
 * Auth role attached to a user's identity. Aligned with backroom-api's
 * post-R-1 UserRole: only USER, AGENT, ADMIN remain (SUPER_ADMIN
 * collapses to "admin" on this side).
 *
 * "tenant" and "landlord" are NOT roles — they're computed states from
 * the data model. A user is a tenant if they hold a lease; a landlord
 * if they manage a property. Both fall under {@link Role} = "user".
 *
 * For workspace / section context inside <Nav>, screens, and route
 * guards, use the {@link NavRole} type below.
 */
export type Role = "user" | "agent" | "admin";

/**
 * Workspace / section context. Independent of the auth {@link Role} —
 * a single `Role = "user"` person may navigate the "tenant" workspace
 * (My Rental) and the "landlord" workspace (My Listings) in the same
 * session. The nav prop typed `role` historically uses these values;
 * we keep that type alive so screens like `<Nav role="tenant" />`
 * remain consumable without renaming.
 */
export type NavRole = "tenant" | "landlord" | "agent" | "admin";

export interface SessionUser {
  id: string;
  firstName: string;
  surname: string;
  /**
   * Composed `${firstName} ${surname}`. Kept as a derived field on the
   * SessionUser so downstream consumers that just want a single display
   * handle (Avatar, Nav header, gallery byline) don't have to concat
   * themselves. `firstName` / `surname` are the source of truth — `name`
   * is just the convenience.
   */
  name: string;
  email: string;
  /** All roles this user can act as. */
  roles: Role[];
  /** Currently active role — drives nav + redirects. */
  activeRole: Role;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  /** ISO timestamps from the API. */
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export type SessionStatus = "loading" | "anonymous" | "authenticated";

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  surname: string;
  /** Self-registration only supports the non-privileged roles. */
  role: "user" | "agent";
  area?: string;
}

export interface SessionContextValue {
  user: SessionUser | null;
  tokens: SessionTokens | null;
  status: SessionStatus;
  /** Most recent error from login / register — cleared on next attempt. */
  error: string | null;

  /**
   * The auto-refreshing API client used internally for auth calls. Exposed
   * so other domains (notifications, properties, etc.) can build their own
   * typed clients on top without re-implementing token injection + 401
   * refresh.
   */
  client: ApiClient;

  login: (creds: { email: string; password: string }) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  switchActiveRole: (role: Role) => Promise<void>;

  /** OAuth callback / dev role-switcher use this when they already have tokens. */
  setSession: (response: {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    userId: string;
    email: string;
    firstName: string;
    surname: string;
    roles: Role[];
    activeRole: Role;
  }) => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export const SESSION_STORAGE_KEY = "habitat.session";

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

/**
 * Demo users used by /dev's role-switcher card. We sign in via the real
 * API using these credentials so the prototype dev experience matches
 * production: there is no longer a fake "signIn(user)" shortcut.
 *
 * The seed migration creates these four users with password `habitat123`.
 * The map is keyed by {@link NavRole} (workspace) rather than {@link Role}
 * (auth role) because after the role collapse "Tenant" (Sipho) and
 * "Landlord" (Thandi) both have the same auth role `USER` — what
 * distinguishes them in the dev gallery is which workspace they're
 * demoing.
 */
export interface DemoCredential {
  email: string;
  password: string;
  firstName: string;
  surname: string;
  /** The auth role the seeded user holds. */
  defaultActiveRole: Role;
}

export const DEMO_CREDENTIALS: Record<NavRole, DemoCredential> = {
  tenant: {
    email: "sipho@example.co.za",
    password: "habitat123",
    firstName: "Sipho",
    surname: "Dlamini",
    defaultActiveRole: "user",
  },
  landlord: {
    email: "thandi@example.co.za",
    password: "habitat123",
    firstName: "Thandi",
    surname: "Mokoena",
    defaultActiveRole: "user",
  },
  agent: {
    email: "naledi@vilakazi.co.za",
    password: "habitat123",
    firstName: "Naledi",
    surname: "M.",
    defaultActiveRole: "agent",
  },
  admin: {
    email: "trust@habitat.co.za",
    password: "habitat123",
    firstName: "Habitat",
    surname: "Trust",
    defaultActiveRole: "admin",
  },
};

/**
 * Back-compat alias. Older code referenced `DEMO_USERS[role].name` /
 * `.email`. The new auth flow uses {@link DEMO_CREDENTIALS} but read-only
 * consumers (avatars in the dev panel, etc.) can keep pointing at this
 * for now. New code should use DEMO_CREDENTIALS.
 */
export const DEMO_USERS = DEMO_CREDENTIALS;
