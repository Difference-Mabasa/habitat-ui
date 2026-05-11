import type { CSSProperties } from "react";

export type SkeletonShape = "line" | "block" | "circle";

export interface LoadingSkeletonProps {
  shape?: SkeletonShape;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  style?: CSSProperties;
}

export default function LoadingSkeleton({
  shape = "line",
  width,
  height,
  style,
}: LoadingSkeletonProps) {
  const base: CSSProperties = {
    width: width ?? (shape === "line" ? "100%" : shape === "circle" ? 40 : 80),
    height: height ?? (shape === "line" ? 12 : shape === "circle" ? 40 : 60),
    borderRadius: shape === "circle" ? "50%" : shape === "block" ? "var(--r-sm)" : 4,
    ...style,
  };
  return <div className="skel" style={base} aria-hidden="true" />;
}
