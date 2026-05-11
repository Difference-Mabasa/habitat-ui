import type { ReactNode } from "react";

export interface StatTileProps {
  value: ReactNode;
  label: ReactNode;
  subText?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { value: 18, label: 11 },
  md: { value: 22, label: 12 },
  lg: { value: 28, label: 13 },
} as const;

export default function StatTile({ value, label, subText, size = "md" }: StatTileProps) {
  const s = SIZES[size];
  return (
    <div>
      <div
        className="tabular"
        style={{ fontSize: s.value, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}
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
