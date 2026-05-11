import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export type AlertTone = "info" | "success" | "warn" | "danger";

const TONE_STYLE: Record<AlertTone, { bg: string; color: string; border: string; defaultIcon: IconName }> = {
  info: { bg: "var(--surface-2)", color: "var(--ink)", border: "var(--hairline-strong)", defaultIcon: "info" },
  success: { bg: "var(--success-soft)", color: "var(--success)", border: "var(--success)", defaultIcon: "check" },
  warn: { bg: "var(--warn-soft)", color: "var(--warn)", border: "var(--warn)", defaultIcon: "info" },
  danger: { bg: "var(--danger-soft)", color: "var(--danger)", border: "var(--danger)", defaultIcon: "x" },
};

export interface AlertProps {
  tone?: AlertTone;
  icon?: IconName;
  title?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
}

export default function Alert({
  tone = "info",
  icon,
  title,
  children,
  action,
  onDismiss,
}: AlertProps) {
  const style = TONE_STYLE[tone];
  const iconName = icon ?? style.defaultIcon;
  return (
    <div
      role={tone === "danger" || tone === "warn" ? "alert" : "status"}
      style={{
        display: "flex",
        gap: 12,
        padding: 14,
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: "var(--r-md)",
        color: style.color,
      }}
    >
      <Icon name={iconName} size={18} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0, color: "var(--ink)" }}>
        {title ? (
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: children ? 2 : 0, color: style.color }}>
            {title}
          </div>
        ) : null}
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>{children}</div>
        {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="btn btn--icon btn--sm btn--ghost"
          style={{ color: style.color, alignSelf: "flex-start" }}
        >
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
}
