import type { CSSProperties, ReactNode } from "react";

export interface TwoColumnSplitProps {
  main: ReactNode;
  aside: ReactNode;
  asideWidth?: number;
  gap?: CSSProperties["gap"];
  stickyAside?: boolean;
}

export default function TwoColumnSplit({
  main,
  aside,
  asideWidth = 380,
  gap = 64,
  stickyAside = true,
}: TwoColumnSplitProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `minmax(0, 1fr) ${asideWidth}px`,
        gap,
      }}
    >
      <div style={{ minWidth: 0 }}>{main}</div>
      <aside style={stickyAside ? { position: "sticky", top: 24, alignSelf: "start" } : undefined}>
        {aside}
      </aside>
    </div>
  );
}
