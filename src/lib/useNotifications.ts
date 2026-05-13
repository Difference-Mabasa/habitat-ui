import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, type ApiClient } from "@/lib/api/client";
import {
  createNotificationsApi,
  type NotificationItem,
  type NotificationsApi,
} from "@/lib/api/notifications";

/**
 * Bell-icon data layer.
 *
 * Polls the lightweight `/notifications/unread-count` endpoint every 30
 * seconds — but pauses when the tab is hidden (Page Visibility API). The
 * fuller list is fetched lazily on `refreshList()` so the drawer always
 * gets fresh content when it opens, without dragging notification bodies
 * over the wire on every badge tick.
 *
 * Improves on backroom-ui's polling in two ways flagged in their TECH_DEBT:
 *   - PERF-03: pause on document.hidden. We do.
 *   - The bell badge stays correct across tabs because the visibility
 *     handler refreshes immediately on focus instead of waiting for the
 *     next 30s tick.
 *
 * The hook returns no-ops while signed out so a screen can call it
 * unconditionally inside a SessionProvider.
 */

const POLL_INTERVAL_MS = 30_000;

export interface UseNotifications {
  unreadCount: number;
  items: NotificationItem[];
  loading: boolean;
  error: ApiError | null;
  refresh: () => Promise<void>;
  refreshList: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useNotifications(
  client: ApiClient | null,
  isAuthenticated: boolean,
): UseNotifications {
  const api: NotificationsApi | null = useMemo(
    () => (client ? createNotificationsApi(client) : null),
    [client],
  );

  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Track the latest auth-aware api on a ref so the polling timer's closure
  // sees fresh state without re-arming the interval on every render.
  const stateRef = useRef({ api, isAuthenticated });
  useEffect(() => {
    stateRef.current = { api, isAuthenticated };
  }, [api, isAuthenticated]);

  const fetchCount = useCallback(async () => {
    const { api: a, isAuthenticated: signedIn } = stateRef.current;
    if (!a || !signedIn) return;
    try {
      const n = await a.unreadCount();
      setUnreadCount(n);
      setError(null);
    } catch (e) {
      if (e instanceof ApiError) setError(e);
    }
  }, []);

  const refreshList = useCallback(async () => {
    const { api: a, isAuthenticated: signedIn } = stateRef.current;
    if (!a || !signedIn) return;
    setLoading(true);
    try {
      const page = await a.list(0, 20);
      setItems(page.content);
      setError(null);
    } catch (e) {
      if (e instanceof ApiError) setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchCount(), refreshList()]);
  }, [fetchCount, refreshList]);

  const markAsRead = useCallback(
    async (id: string) => {
      const a = stateRef.current.api;
      if (!a) return;
      await a.markAsRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    const a = stateRef.current.api;
    if (!a) return;
    await a.markAllAsRead();
    setItems((prev) =>
      prev.map((n) => (n.read ? n : { ...n, read: true, readAt: new Date().toISOString() })),
    );
    setUnreadCount(0);
  }, []);

  const remove = useCallback(async (id: string) => {
    const a = stateRef.current.api;
    if (!a) return;
    await a.remove(id);
    setItems((prev) => {
      const before = prev.find((n) => n.id === id);
      if (before && !before.read) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // Reset state when the user signs out so the next sign-in starts clean.
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setItems([]);
      setError(null);
    }
  }, [isAuthenticated]);

  // Initial fetch + interval poll + visibility refresh.
  useEffect(() => {
    if (!isAuthenticated) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(() => {
        if (document.visibilityState === "visible") void fetchCount();
      }, POLL_INTERVAL_MS);
    };
    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void fetchCount();
        startPolling();
      } else {
        stopPolling();
      }
    };

    // First fetch immediately so the badge populates without waiting 30s.
    void fetchCount();

    if (document.visibilityState === "visible") startPolling();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isAuthenticated, fetchCount]);

  return {
    unreadCount,
    items,
    loading,
    error,
    refresh,
    refreshList,
    markAsRead,
    markAllAsRead,
    remove,
  };
}
