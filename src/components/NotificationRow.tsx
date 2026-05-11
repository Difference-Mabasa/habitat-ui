import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";
import Icon, { type IconName } from "./Icon";

export type NotificationTone = "neutral" | "accent" | "success" | "warn" | "danger";

const TONE_STYLE: Record<NotificationTone, { bg: string; color: string }> = {
  neutral: { bg: "var(--surface-2)", color: "var(--slate)" },
  accent: { bg: "color-mix(in oklch, var(--accent) 10%, transparent)", color: "var(--accent)" },
  success: { bg: "color-mix(in oklch, var(--success) 12%, transparent)", color: "var(--success)" },
  warn: { bg: "color-mix(in oklch, var(--warn) 14%, transparent)", color: "var(--warn)" },
  danger: { bg: "var(--danger-soft)", color: "var(--danger)" },
};

export interface NotificationRowProps {
  /** Visual variant. `drawer` is the dropdown panel style (vertical accent strip,
   * type eyebrow); `page` is the full notifications screen (colored icon badge). */
  variant?: "drawer" | "page";
  title: ReactNode;
  body: ReactNode;
  unread?: boolean;
  /** Drawer-variant: shown as an eyebrow above the title. */
  type?: ReactNode;
  /** Drawer-variant: relative timestamp on the top-right. */
  time?: ReactNode;
  /** Page-variant: icon shown inside the colored leading badge. */
  icon?: IconName;
  /** Page-variant: tone for the icon badge + page highlight. */
  tone?: NotificationTone;
  action?: ReactNode;
}

export default function NotificationRow({
  variant = "drawer",
  title,
  body,
  unread = false,
  type,
  time,
  icon,
  tone = "neutral",
  action,
}: NotificationRowProps) {
  if (variant === "page") {
    const style = TONE_STYLE[tone];
    return (
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          background: unread ? "color-mix(in oklch, var(--accent) 3%, transparent)" : "transparent",
          cursor: "pointer",
        }}
      >
        {icon ? (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background: style.bg,
              color: style.color,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name={icon} size={14} />
          </div>
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: unread ? 600 : 500, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--slate)" }}>{body}</div>
          {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
        </div>
        {unread ? (
          <div
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              marginTop: 8,
              flexShrink: 0,
            }}
          />
        ) : null}
      </div>
    );
  }

  // drawer variant (default)
  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--hairline)",
        background: unread ? "var(--surface-2)" : "transparent",
        display: "flex",
        gap: 12,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 6,
          alignSelf: "stretch",
          borderRadius: 3,
          background: unread ? "var(--accent)" : "transparent",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          {type ? <Eyebrow>{type}</Eyebrow> : null}
          {time ? (
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--slate)" }}>{time}</span>
          ) : null}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.4 }}>{body}</div>
        {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
      </div>
    </div>
  );
}
