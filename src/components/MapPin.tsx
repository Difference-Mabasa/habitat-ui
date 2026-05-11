import type { ButtonHTMLAttributes } from "react";
import Icon from "./Icon";

export interface MapPinProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  price?: number;
  cluster?: number;
  /** Currently selected/hovered — ink bg overrides tone. */
  active?: boolean;
  sold?: boolean;
  /** Visual tone for non-active state. `accent` is the "hot/featured" look. */
  tone?: "default" | "accent";
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
  tone = "default",
  style,
  ...rest
}: MapPinProps) {
  const isCluster = cluster != null && cluster > 0;
  const text = isCluster ? cluster : price != null ? formatPrice(price) : "";
  const bg = active
    ? "var(--ink)"
    : tone === "accent"
      ? "var(--accent)"
      : "var(--surface)";
  const color = active || tone === "accent" ? "var(--paper)" : "var(--ink)";
  const borderColor = active
    ? "var(--ink)"
    : tone === "accent"
      ? "var(--accent)"
      : "var(--hairline-strong)";

  return (
    <button
      type="button"
      {...rest}
      style={{
        transform: `translate(-50%, -100%) scale(${active ? 1.05 : 1})`,
        background: bg,
        color,
        border: `1px solid ${borderColor}`,
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
