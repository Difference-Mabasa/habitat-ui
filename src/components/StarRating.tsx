import { useState } from "react";

export type StarSize = "sm" | "md" | "lg";

const SIZES: Record<StarSize, number> = { sm: 12, md: 16, lg: 22 };

export interface StarRatingProps {
  value: number;
  max?: number;
  size?: StarSize;
  interactive?: boolean;
  onChange?: (value: number) => void;
  label?: string;
}

function StarShape({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "var(--accent)" : "transparent"}
      stroke={filled ? "var(--accent)" : "var(--slate-3)"}
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15 9 22 10 17 15 18 22 12 18.5 6 22 7 15 2 10 9 9" />
    </svg>
  );
}

export default function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  label,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  const pixelSize = SIZES[size];

  if (!interactive) {
    return (
      <span
        role="img"
        aria-label={label ?? `${value} of ${max} stars`}
        style={{ display: "inline-flex", gap: 2, alignItems: "center" }}
      >
        {Array.from({ length: max }, (_, i) => (
          <StarShape key={i} filled={i < Math.round(value)} size={pixelSize} />
        ))}
      </span>
    );
  }

  return (
    <span
      role="radiogroup"
      aria-label={label ?? "Rating"}
      style={{ display: "inline-flex", gap: 4, alignItems: "center" }}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} of ${max}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange?.(n)}
            style={{ background: "none", border: 0, padding: 2, cursor: "pointer" }}
          >
            <StarShape filled={n <= display} size={pixelSize} />
          </button>
        );
      })}
    </span>
  );
}
