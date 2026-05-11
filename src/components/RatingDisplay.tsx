import StarRating from "./StarRating";

export interface RatingDisplayProps {
  rating: number;
  count?: number;
  layout?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

const TEXT_SIZES = {
  sm: { rating: 14, count: 11 },
  md: { rating: 16, count: 12 },
  lg: { rating: 28, count: 13 },
} as const;

export default function RatingDisplay({
  rating,
  count,
  layout = "horizontal",
  size = "md",
}: RatingDisplayProps) {
  const sizes = TEXT_SIZES[size];
  if (layout === "vertical") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
        <div className="tabular" style={{ fontSize: sizes.rating, fontWeight: 600 }}>
          {rating.toFixed(1)}
        </div>
        <StarRating value={rating} size={size === "lg" ? "md" : "sm"} />
        {count != null ? (
          <div style={{ fontSize: sizes.count, color: "var(--slate)" }}>
            {count} {count === 1 ? "review" : "reviews"}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <StarRating value={rating} size={size === "lg" ? "md" : "sm"} />
      <span className="tabular" style={{ fontSize: sizes.rating, fontWeight: 600 }}>
        {rating.toFixed(1)}
      </span>
      {count != null ? (
        <span style={{ fontSize: sizes.count, color: "var(--slate)" }}>
          ({count})
        </span>
      ) : null}
    </span>
  );
}
