import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "as"> {
  children: ReactNode;
  padding?: CSSProperties["padding"];
  interactive?: boolean;
  as?: ElementType;
}

export default function Card({
  children,
  padding,
  interactive = false,
  as,
  className = "",
  style,
  ...rest
}: CardProps) {
  const Tag = (as ?? "div") as ElementType;
  const interactiveStyle: CSSProperties = interactive
    ? { cursor: "pointer", transition: "border-color 120ms, box-shadow 120ms" }
    : {};
  return (
    <Tag
      className={`card ${className}`.trim()}
      style={{ padding, ...interactiveStyle, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
