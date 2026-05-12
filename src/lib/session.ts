import { createContext, useContext } from "react";

export type Role = "tenant" | "landlord" | "agent" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  /** All roles this user can act as. */
  roles: Role[];
  /** Currently active role — drives nav + redirects. */
  activeRole: Role;
}

export interface SessionContextValue {
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  switchRole: (role: Role) => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export const SESSION_STORAGE_KEY = "habitat.session";

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

/**
 * Demo users for /auth, /register, and the dev role-switcher.
 *
 * Prototype convention: every demo user holds all four roles so the
 * Workspaces dropdown is fully populated regardless of which persona
 * signed in. `activeRole` is the only thing that differs and drives
 * which dashboard renders. When real auth + role assignment lands,
 * trim each user's `roles` array to what they actually own.
 */
const ALL_ROLES: Role[] = ["tenant", "landlord", "agent", "admin"];

export const DEMO_USERS: Record<Role, SessionUser> = {
  tenant: {
    id: "u-sipho",
    name: "Sipho Dlamini",
    email: "sipho@example.co.za",
    roles: ALL_ROLES,
    activeRole: "tenant",
  },
  landlord: {
    id: "u-thandi",
    name: "Thandi Mokoena",
    email: "thandi@example.co.za",
    roles: ALL_ROLES,
    activeRole: "landlord",
  },
  agent: {
    id: "u-naledi-agent",
    name: "Naledi M.",
    email: "naledi@vilakazi.co.za",
    roles: ALL_ROLES,
    activeRole: "agent",
  },
  admin: {
    id: "u-admin",
    name: "Habitat Trust",
    email: "trust@habitat.co.za",
    roles: ALL_ROLES,
    activeRole: "admin",
  },
};
