import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createAuthApi, type AuthResponse } from "@/lib/api/auth";
import { ApiError, createClient, type ApiClient } from "@/lib/api/client";
import {
  SESSION_STORAGE_KEY,
  SessionContext,
  type Role,
  type RegisterPayload,
  type SessionContextValue,
  type SessionStatus,
  type SessionTokens,
  type SessionUser,
} from "./session";

/** Refresh the access token this many ms before it expires. */
const REFRESH_LEAD_MS = 60_000;

interface PersistedState {
  user: SessionUser | null;
  tokens: SessionTokens | null;
}

function load(): PersistedState {
  if (typeof window === "undefined") return { user: null, tokens: null };
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return { user: null, tokens: null };
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.user || !parsed.user.id || !parsed.user.activeRole) {
      return { user: null, tokens: null };
    }
    return parsed;
  } catch {
    return { user: null, tokens: null };
  }
}

function save(state: PersistedState) {
  try {
    if (state.user && state.tokens) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / private-mode failures */
  }
}

function authResponseToState(res: AuthResponse): PersistedState {
  return {
    user: {
      id: res.userId,
      firstName: res.firstName,
      surname: res.surname,
      name: `${res.firstName} ${res.surname}`.trim(),
      email: res.email,
      roles: res.roles,
      activeRole: res.activeRole,
    },
    tokens: {
      accessToken: res.accessToken,
      accessTokenExpiresAt: res.accessTokenExpiresAt,
      refreshToken: res.refreshToken,
      refreshTokenExpiresAt: res.refreshTokenExpiresAt,
    },
  };
}

export interface SessionProviderProps {
  children: ReactNode;
  /** Inject a custom client (tests). Defaults to a fresh createClient(). */
  client?: ApiClient;
}

export default function SessionProvider({ children, client: injectedClient }: SessionProviderProps) {
  const [state, setStateInternal] = useState<PersistedState>(() => load());
  const [status, setStatus] = useState<SessionStatus>(() =>
    load().user ? "authenticated" : "anonymous",
  );
  const [error, setError] = useState<string | null>(null);

  // Refs let the api client read the latest tokens without re-creating itself.
  const stateRef = useRef(state);
  stateRef.current = state;
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState = useCallback((next: PersistedState) => {
    save(next);
    setStateInternal(next);
    stateRef.current = next;
    setStatus(next.user ? "authenticated" : "anonymous");
  }, []);

  // The api client: reads tokens from stateRef, calls refresh on 401,
  // clears session if refresh fails.
  const api = useMemo(() => {
    const client =
      injectedClient ??
      createClient({
        getAccessToken: () => stateRef.current.tokens?.accessToken ?? null,
        refreshAccessToken: async () => {
          const tokens = stateRef.current.tokens;
          if (!tokens) return null;
          try {
            // Use a no-auth client to avoid the recursion of refresh-on-refresh.
            const rawClient = createClient();
            const res = await rawClient.post<AuthResponse>(
              "/auth/refresh",
              { refreshToken: tokens.refreshToken },
              { skipAuthRefresh: true },
            );
            setState(authResponseToState(res));
            return res.accessToken;
          } catch {
            return null;
          }
        },
        onAuthFailure: () => {
          setState({ user: null, tokens: null });
        },
      });
    return createAuthApi(client);
    // We intentionally create this once — closures read state via stateRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Background access-token refresh. Re-armed whenever tokens change.
  useEffect(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (!state.tokens) return;
    const expiresAt = Date.parse(state.tokens.accessTokenExpiresAt);
    const fireIn = Math.max(0, expiresAt - Date.now() - REFRESH_LEAD_MS);
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.refresh(stateRef.current.tokens!.refreshToken);
        setState(authResponseToState(res));
      } catch {
        // Refresh failed — drop the session; SecurityConfig will redirect.
        setState({ user: null, tokens: null });
      }
    }, fireIn);
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [state.tokens, api, setState]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setError(null);
      setStatus("loading");
      try {
        const res = await api.login({ email, password });
        setState(authResponseToState(res));
      } catch (e) {
        setStatus("anonymous");
        setError(e instanceof ApiError ? e.message : "Sign in failed.");
        throw e;
      }
    },
    [api, setState],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setError(null);
      setStatus("loading");
      try {
        const res = await api.register(payload);
        setState(authResponseToState(res));
      } catch (e) {
        setStatus("anonymous");
        setError(e instanceof ApiError ? e.message : "Registration failed.");
        throw e;
      }
    },
    [api, setState],
  );

  const logout = useCallback(async () => {
    const refreshToken = stateRef.current.tokens?.refreshToken ?? null;
    try {
      if (refreshToken) await api.logout(refreshToken);
    } catch {
      // Backend may already consider us anonymous; that's fine — clear locally.
    } finally {
      setState({ user: null, tokens: null });
      setError(null);
    }
  }, [api, setState]);

  const switchActiveRole = useCallback(
    async (role: Role) => {
      const current = stateRef.current.user;
      if (!current) return;
      if (!current.roles.includes(role)) return;
      try {
        const updated = await api.switchActiveRole(role);
        setState({
          user: { ...current, activeRole: updated.activeRole, roles: updated.roles },
          tokens: stateRef.current.tokens,
        });
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Role switch failed.");
        throw e;
      }
    },
    [api, setState],
  );

  const setSession = useCallback<SessionContextValue["setSession"]>(
    (response) => {
      setState(authResponseToState(response as AuthResponse));
    },
    [setState],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      user: state.user,
      tokens: state.tokens,
      status,
      error,
      login,
      register,
      logout,
      switchActiveRole,
      setSession,
    }),
    [state.user, state.tokens, status, error, login, register, logout, switchActiveRole, setSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
