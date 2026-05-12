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

/** Default demo users — used by /auth, /register, and the dev role-switcher. */
export const DEMO_USERS: Record<Role, SessionUser> = {
  tenant: {
    id: "u-sipho",
    name: "Sipho Dlamini",
    email: "sipho@example.co.za",
    roles: ["tenant"],
    activeRole: "tenant",
  },
  landlord: {
    id: "u-thandi",
    name: "Thandi Mokoena",
    email: "thandi@example.co.za",
    roles: ["landlord", "tenant"],
    activeRole: "landlord",
  },
  agent: {
    id: "u-naledi-agent",
    name: "Naledi M.",
    email: "naledi@vilakazi.co.za",
    roles: ["agent", "tenant"],
    activeRole: "agent",
  },
  admin: {
    id: "u-admin",
    name: "Habitat Trust",
    email: "trust@habitat.co.za",
    roles: ["admin", "tenant", "landlord", "agent"],
    activeRole: "admin",
  },
};
