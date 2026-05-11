import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export interface EmptyStateProps {
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { iconBox: 44, iconSize: 18, titleSize: 13, descSize: 12, gap: 12 },
  md: { iconBox: 56, iconSize: 22, titleSize: 14, descSize: 12, gap: 16 },
  lg: { iconBox: 72, iconSize: 28, titleSize: 18, descSize: 13, gap: 20 },
} as const;

export default function EmptyState({
  icon,
  title,
  description,
  actions,
  size = "md",
}: EmptyStateProps) {
  const s = SIZES[size];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      {icon ? (
        <div
          style={{
            width: s.iconBox,
            height: s.iconBox,
            borderRadius: "50%",
            background: "var(--surface-2)",
            color: "var(--slate)",
            display: "grid",
            placeItems: "center",
            marginBottom: s.gap,
          }}
        >
          <Icon name={icon} size={s.iconSize} />
        </div>
      ) : null}
      <div style={{ fontSize: s.titleSize, fontWeight: 600, marginBottom: 6, color: "var(--ink)" }}>
        {title}
      </div>
      {description ? (
        <div
          style={{
            fontSize: s.descSize,
            color: "var(--slate)",
            marginBottom: actions ? s.gap : 0,
            lineHeight: 1.5,
            maxWidth: 320,
          }}
        >
          {description}
        </div>
      ) : null}
      {actions ? <div style={{ display: "flex", gap: 6 }}>{actions}</div> : null}
    </div>
  );
}
