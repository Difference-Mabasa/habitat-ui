import type { CSSProperties } from "react";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarTone = "neutral" | "accent" | "ink";

const SIZES: Record<AvatarSize, { box: number; font: number }> = {
  sm: { box: 28, font: 11 },
  md: { box: 32, font: 12 },
  lg: { box: 44, font: 14 },
};

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  tone?: AvatarTone;
  shape?: "circle" | "square";
  style?: CSSProperties;
}

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Avatar({
  name,
  src,
  size = "md",
  tone = "ink",
  shape = "circle",
  style,
}: AvatarProps) {
  const { box, font } = SIZES[size];
  const toneStyle: CSSProperties =
    tone === "accent"
      ? { background: "var(--accent-soft)", color: "var(--accent)" }
      : tone === "neutral"
        ? { background: "var(--surface-3)", color: "var(--ink)" }
        : { background: "var(--ink)", color: "var(--paper)" };
  const base: CSSProperties = {
    width: box,
    height: box,
    borderRadius: shape === "circle" ? "50%" : 8,
    display: "grid",
    placeItems: "center",
    fontFamily: "var(--font-mono)",
    fontSize: font,
    fontWeight: 500,
    flexShrink: 0,
    overflow: "hidden",
    ...toneStyle,
    ...style,
  };
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ ...base, objectFit: "cover", padding: 0 }}
      />
    );
  }
  return (
    <div style={base} aria-label={name}>
      {initialsFrom(name)}
    </div>
  );
}
