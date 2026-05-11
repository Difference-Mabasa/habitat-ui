import type { CSSProperties, ReactNode } from "react";

export interface EyebrowProps {
  children: ReactNode;
  as?: "div" | "span" | "p";
  style?: CSSProperties;
  className?: string;
}

export default function Eyebrow({ children, as = "div", style, className = "" }: EyebrowProps) {
  const Tag = as;
  return (
    <Tag className={`eyebrow ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
