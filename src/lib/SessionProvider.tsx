import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  DEMO_USERS,
  SESSION_STORAGE_KEY,
  SessionContext,
  type Role,
  type SessionContextValue,
  type SessionUser,
} from "./session";

interface SessionState {
  user: SessionUser | null;
}

function load(): SessionState {
  if (typeof window === "undefined") return { user: null };
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return { user: null };
    const parsed = JSON.parse(raw) as SessionState;
    if (!parsed?.user || !parsed.user.id || !parsed.user.activeRole) return { user: null };
    // Migrate persisted demo sessions to the latest DEMO_USERS shape (keeps
    // the active role) so a prototype change like "every demo user owns
    // every workspace" picks up on existing tabs without a sign-out cycle.
    const matchingDemo = Object.values(DEMO_USERS).find((d) => d.id === parsed.user!.id);
    if (matchingDemo) {
      return { user: { ...matchingDemo, activeRole: parsed.user.activeRole } };
    }
    return parsed;
  } catch {
    return { user: null };
  }
}

function save(state: SessionState) {
  try {
    if (state.user) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    else window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(() => load());

  useEffect(() => {
    save(state);
  }, [state]);

  const signIn = useCallback((user: SessionUser) => {
    setState({ user });
  }, []);

  const signOut = useCallback(() => {
    setState({ user: null });
  }, []);

  const switchRole = useCallback((role: Role) => {
    setState((prev) => {
      if (!prev.user || !prev.user.roles.includes(role)) return prev;
      return { user: { ...prev.user, activeRole: role } };
    });
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ user: state.user, signIn, signOut, switchRole }),
    [state.user, signIn, signOut, switchRole],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
