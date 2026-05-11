import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { subscribeToasts, toast as toastApi, type Toast, type ToastTone } from "@/lib/toast";
import Icon, { type IconName } from "./Icon";

const TONE_STYLE: Record<ToastTone, { bg: string; color: string; border: string; icon: IconName }> = {
  success: { bg: "var(--success-soft)", color: "var(--success)", border: "var(--success)", icon: "check" },
  error: { bg: "var(--danger-soft)", color: "var(--danger)", border: "var(--danger)", icon: "x" },
  info: { bg: "var(--surface)", color: "var(--ink)", border: "var(--hairline-strong)", icon: "info" },
  warn: { bg: "var(--warn-soft)", color: "var(--warn)", border: "var(--warn)", icon: "info" },
};

export default function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;
  return createPortal(
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 30,
        maxWidth: 360,
      }}
    >
      {items.map((t) => {
        const style = TONE_STYLE[t.tone];
        return (
          <div
            key={t.id}
            role={t.tone === "error" || t.tone === "warn" ? "alert" : "status"}
            style={{
              display: "flex",
              gap: 10,
              padding: 14,
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: "var(--r-md)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Icon name={style.icon} size={16} style={{ color: style.color, flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
              {t.message}
            </div>
            <button
              type="button"
              onClick={() => toastApi.dismiss(t.id)}
              aria-label="Dismiss"
              className="btn btn--icon btn--sm btn--ghost"
            >
              <Icon name="x" size={12} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
