import type { CSSProperties } from "react";

export interface HairlineProps {
  style?: CSSProperties;
}

export default function Hairline({ style }: HairlineProps) {
  return <hr className="hairline" style={{ border: 0, margin: 0, ...style }} aria-hidden="true" />;
}
