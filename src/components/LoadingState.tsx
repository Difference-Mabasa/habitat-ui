import type { CSSProperties } from "react";
import Card from "./Card";
import LoadingSkeleton from "./LoadingSkeleton";

export interface LoadingStateProps {
  /** How many skeleton cards to render. */
  rows?: number;
  /** "card" stacks padded Cards; "list" stacks bare rows on a hairline. */
  variant?: "card" | "list";
  /** Whether each row leads with a circle (avatar) skeleton. */
  withAvatar?: boolean;
  style?: CSSProperties;
}

export default function LoadingState({
  rows = 4,
  variant = "card",
  withAvatar = false,
  style,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{ display: "flex", flexDirection: "column", gap: variant === "card" ? 14 : 0, ...style }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} variant={variant} withAvatar={withAvatar} isFirst={i === 0} />
      ))}
    </div>
  );
}

function SkeletonRow({
  variant,
  withAvatar,
  isFirst,
}: {
  variant: "card" | "list";
  withAvatar: boolean;
  isFirst: boolean;
}) {
  const inner = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      {withAvatar ? <LoadingSkeleton shape="circle" width={40} height={40} /> : null}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <LoadingSkeleton shape="line" width="40%" height={14} />
        <LoadingSkeleton shape="line" width="92%" />
        <LoadingSkeleton shape="line" width="76%" />
      </div>
      <LoadingSkeleton shape="block" width={56} height={28} />
    </div>
  );

  if (variant === "card") return <Card padding={16}>{inner}</Card>;
  return (
    <div
      style={{
        padding: "14px 16px",
        borderTop: isFirst ? undefined : "1px solid var(--hairline)",
      }}
    >
      {inner}
    </div>
  );
}
