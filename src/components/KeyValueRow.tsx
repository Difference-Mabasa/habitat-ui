import type { CSSProperties, ReactNode } from "react";

export type KeyValueTone = "neutral" | "success" | "warn" | "danger" | "accent";

const TONE_COLOR: Record<KeyValueTone, string> = {
  neutral: "var(--ink)",
  success: "var(--success)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  accent: "var(--accent)",
};

export interface KeyValueRowProps {
  label: ReactNode;
  value: ReactNode;
  tone?: KeyValueTone;
  divider?: boolean;
  size?: "sm" | "md";
  style?: CSSProperties;
}

export default function KeyValueRow({
  label,
  value,
  tone = "neutral",
  divider = false,
  size = "md",
  style,
}: KeyValueRowProps) {
  const labelSize = size === "sm" ? 12 : 13;
  const valueSize = size === "sm" ? 13 : 14;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: size === "sm" ? "8px 0" : "10px 0",
        borderTop: divider ? "1px solid var(--hairline)" : undefined,
        ...style,
      }}
    >
      <span style={{ fontSize: labelSize, color: "var(--slate)" }}>{label}</span>
      <span
        className="tabular"
        style={{
          fontSize: valueSize,
          fontWeight: 600,
          color: TONE_COLOR[tone],
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
