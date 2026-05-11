import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";
import Button from "./Button";

export type ActionItemTone = "neutral" | "accent" | "warn" | "success" | "danger";

const TONE_STYLE: Record<ActionItemTone, { bg: string; color: string }> = {
  neutral: { bg: "var(--surface-3)", color: "var(--slate)" },
  accent: { bg: "var(--accent-soft)", color: "var(--accent)" },
  warn: { bg: "var(--warn-soft)", color: "var(--warn)" },
  success: { bg: "var(--success-soft)", color: "var(--success)" },
  danger: { bg: "var(--danger-soft)", color: "var(--danger)" },
};

export interface ActionItemProps {
  icon: IconName;
  tone?: ActionItemTone;
  title: ReactNode;
  subtitle?: ReactNode;
  ctaLabel: string;
  onAction?: () => void;
  /** Suppress bottom border (used for the last row of an action queue). */
  last?: boolean;
}

export default function ActionItem({
  icon,
  tone = "neutral",
  title,
  subtitle,
  ctaLabel,
  onAction,
  last = false,
}: ActionItemProps) {
  const style = TONE_STYLE[tone];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 24px",
        borderBottom: last ? "none" : "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: style.bg,
          color: style.color,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{subtitle}</div>
        ) : null}
      </div>
      <Button variant="secondary" size="sm" onClick={onAction}>
        {ctaLabel}
      </Button>
    </div>
  );
}
