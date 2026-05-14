import type { ReactNode } from "react";

export type StatTileValueTone = "ink" | "accent";

export interface StatTileProps {
  value: ReactNode;
  label: ReactNode;
  subText?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Colour of the value line. Defaults to ink; pass `accent` for hero / marketing emphasis. */
  valueTone?: StatTileValueTone;
}

const SIZES = {
  sm: { value: 18, label: 11 },
  md: { value: 22, label: 12 },
  lg: { value: 28, label: 13 },
} as const;

const VALUE_COLOR: Record<StatTileValueTone, string> = {
  ink: "var(--ink)",
  accent: "var(--accent)",
};

export default function StatTile({
  value,
  label,
  subText,
  size = "md",
  valueTone = "ink",
}: StatTileProps) {
  const s = SIZES[size];
  return (
    <div>
      <div
        className="tabular"
        style={{ fontSize: s.value, fontWeight: 600, letterSpacing: "-0.02em", color: VALUE_COLOR[valueTone] }}
      >
        {value}
      </div>
      <div style={{ fontSize: s.label, color: "var(--slate)", marginTop: 2 }}>{label}</div>
      {subText ? (
        <div style={{ fontSize: s.label, color: "var(--slate-2)", marginTop: 4 }}>{subText}</div>
      ) : null}
    </div>
  );
}
