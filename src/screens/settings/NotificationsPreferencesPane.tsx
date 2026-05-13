import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import Toggle from "@/components/Toggle";
import { useSession } from "@/lib/session";
import { ApiError } from "@/lib/api/client";
import {
  createNotificationPreferencesApi,
  type NotificationCategory,
  type NotificationChannel,
  type NotificationPreferenceMatrix,
  type PreferenceCell,
  CATEGORY_LABEL,
  CATEGORY_DESCRIPTION,
  CHANNEL_LABEL,
} from "@/lib/api/notificationPreferences";

/**
 * Notification preferences matrix — one row per category, one column per
 * channel (in-app / email / SMS). Locked cells (SYSTEM × IN_APP) render
 * disabled with helper copy explaining why. Cell toggles are
 * optimistic — the local state flips immediately and rolls back if the
 * API rejects.
 */
export default function NotificationsPreferencesPane() {
  const session = useSession();
  const api = useMemo(
    () => createNotificationPreferencesApi(session.client),
    [session.client],
  );

  const [matrix, setMatrix] = useState<NotificationPreferenceMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .matrix()
      .then((m) => {
        if (cancelled) return;
        setMatrix(m);
        setLoadError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setLoadError(e instanceof ApiError ? e.message : "Couldn't load preferences.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const cellsByKey = useMemo(() => {
    const map = new Map<string, PreferenceCell>();
    matrix?.cells.forEach((c) => map.set(keyOf(c.category, c.channel), c));
    return map;
  }, [matrix]);

  const onToggle = useCallback(
    async (category: NotificationCategory, channel: NotificationChannel, next: boolean) => {
      const key = keyOf(category, channel);
      // Optimistic: flip immediately, roll back on error.
      setMatrix((prev) => prev && {
        ...prev,
        cells: prev.cells.map((c) =>
          keyOf(c.category, c.channel) === key ? { ...c, enabled: next } : c,
        ),
      });
      setSavingKey(key);
      setRowError(null);
      try {
        await api.update({ category, channel, enabled: next });
      } catch (e) {
        setMatrix((prev) => prev && {
          ...prev,
          cells: prev.cells.map((c) =>
            keyOf(c.category, c.channel) === key ? { ...c, enabled: !next } : c,
          ),
        });
        setRowError(e instanceof ApiError ? e.message : "Couldn't save that change.");
      } finally {
        setSavingKey(null);
      }
    },
    [api],
  );

  if (loading) {
    return (
      <Card padding={32}>
        <div style={{ fontSize: 13, color: "var(--slate)" }}>Loading preferences…</div>
      </Card>
    );
  }

  if (loadError || !matrix) {
    return (
      <Card padding={32}>
        <EmptyState
          icon="bell"
          title="Couldn't load preferences"
          description={loadError ?? "Try refreshing the page."}
        />
      </Card>
    );
  }

  return (
    <Card padding={0} style={{ overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--hairline)" }}>
        <Eyebrow style={{ color: "var(--accent)" }}>Notification preferences</Eyebrow>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>
          Choose where you want to hear from us
        </div>
        <p style={{ fontSize: 13, color: "var(--slate)", margin: "4px 0 0", lineHeight: 1.5 }}>
          By default you're opted in to everything. Toggle any channel off below.
          Account &amp; security in-app alerts can't be muted.
        </p>
      </div>

      {rowError ? (
        <div
          role="alert"
          style={{
            padding: "10px 24px",
            background: "color-mix(in oklch, var(--danger) 8%, transparent)",
            color: "var(--danger)",
            fontSize: 12,
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          {rowError}
        </div>
      ) : null}

      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `minmax(0, 1fr) repeat(${matrix.channels.length}, 96px)`,
          gap: 0,
          padding: "12px 24px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--slate)",
        }}
      >
        <div>Category</div>
        {matrix.channels.map((ch) => (
          <div key={ch} style={{ textAlign: "center" }}>
            {CHANNEL_LABEL[ch]}
          </div>
        ))}
      </div>

      {matrix.categories.map((category, i) => (
        <div
          key={category}
          style={{
            display: "grid",
            gridTemplateColumns: `minmax(0, 1fr) repeat(${matrix.channels.length}, 96px)`,
            gap: 0,
            padding: "16px 24px",
            borderBottom: i === matrix.categories.length - 1 ? "none" : "1px solid var(--hairline)",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{CATEGORY_LABEL[category]}</div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4, lineHeight: 1.4 }}>
              {CATEGORY_DESCRIPTION[category]}
            </div>
          </div>
          {matrix.channels.map((channel) => {
            const cell = cellsByKey.get(keyOf(category, channel));
            const enabled = cell?.enabled ?? true;
            const locked = cell?.locked ?? false;
            const saving = savingKey === keyOf(category, channel);
            return (
              <div
                key={channel}
                style={{ display: "flex", justifyContent: "center" }}
                title={locked ? "Required — can't be muted in-app" : undefined}
              >
                <Toggle
                  checked={enabled}
                  disabled={locked || saving}
                  onChange={(e) => void onToggle(category, channel, e.target.checked)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </Card>
  );
}

function keyOf(category: NotificationCategory, channel: NotificationChannel): string {
  return `${category}:${channel}`;
}
