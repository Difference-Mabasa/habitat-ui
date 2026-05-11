import type { CSSProperties } from "react";

export type PriceSize = "sm" | "md" | "lg" | "xl";

const SIZE_STYLE: Record<PriceSize, { amount: number; period: number; gap: number }> = {
  sm: { amount: 14, period: 11, gap: 4 },
  md: { amount: 18, period: 12, gap: 6 },
  lg: { amount: 24, period: 13, gap: 6 },
  xl: { amount: 36, period: 14, gap: 8 },
};

export interface PriceDisplayProps {
  amount: number;
  period?: string;
  currency?: string;
  size?: PriceSize;
  tone?: "ink" | "accent" | "slate";
  className?: string;
  style?: CSSProperties;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}

export default function PriceDisplay({
  amount,
  period = "/month",
  currency = "R",
  size = "md",
  tone = "ink",
  className,
  style,
}: PriceDisplayProps) {
  const sizes = SIZE_STYLE[size];
  const color = tone === "accent" ? "var(--accent)" : tone === "slate" ? "var(--slate)" : "var(--ink)";
  return (
    <span
      className={`tabular ${className ?? ""}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: sizes.gap,
        color,
        ...style,
      }}
    >
      <span style={{ fontSize: sizes.amount, fontWeight: 600, letterSpacing: "-0.01em" }}>
        {currency} {formatAmount(amount)}
      </span>
      {period ? (
        <span style={{ fontSize: sizes.period, color: "var(--slate)", fontWeight: 500 }}>
          {period}
        </span>
      ) : null}
    </span>
  );
}
