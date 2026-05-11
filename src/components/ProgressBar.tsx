import type { CSSProperties } from "react";

export type ProgressTone = "accent" | "success" | "warn" | "danger" | "ink";
export type ProgressHeight = "thin" | "md";

const HEIGHTS: Record<ProgressHeight, number> = { thin: 5, md: 8 };

const TONE_COLOR: Record<ProgressTone, string> = {
  accent: "var(--accent)",
  success: "var(--success)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  ink: "var(--ink)",
};

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: ProgressTone;
  height?: ProgressHeight;
  width?: CSSProperties["width"];
  label?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  tone = "accent",
  height = "thin",
  width = "100%",
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = HEIGHTS[height];
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      style={{
        width,
        height: h,
        background: "var(--surface-3)",
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: TONE_COLOR[tone],
          transition: "width 200ms",
        }}
      />
    </div>
  );
}
