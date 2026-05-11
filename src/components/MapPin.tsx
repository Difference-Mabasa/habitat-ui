import type { ButtonHTMLAttributes } from "react";
import Icon from "./Icon";

export interface MapPinProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  price?: number;
  cluster?: number;
  active?: boolean;
  sold?: boolean;
  /** Position styles set by the parent (e.g. left/top %). */
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `R ${(n / 1_000).toFixed(1)}k`;
  return `R ${n}`;
}

export default function MapPin({
  price,
  cluster,
  active = false,
  sold = false,
  style,
  ...rest
}: MapPinProps) {
  const isCluster = cluster != null && cluster > 0;
  const text = isCluster ? cluster : price != null ? formatPrice(price) : "";

  return (
    <button
      type="button"
      {...rest}
      style={{
        transform: `translate(-50%, -100%) scale(${active ? 1.05 : 1})`,
        background: active ? "var(--ink)" : "var(--surface)",
        color: active ? "var(--paper)" : "var(--ink)",
        border: `1px solid ${active ? "var(--ink)" : "var(--hairline-strong)"}`,
        borderRadius: 999,
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        boxShadow: "var(--shadow-md)",
        transition: "transform 150ms, background 150ms",
        zIndex: active ? 5 : 1,
        whiteSpace: "nowrap",
        cursor: "pointer",
        textDecoration: sold ? "line-through" : "none",
        opacity: sold ? 0.7 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      {isCluster ? <Icon name="grid" size={11} /> : null}
      {text}
    </button>
  );
}
