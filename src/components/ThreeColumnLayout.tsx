import type { CSSProperties, ReactNode } from "react";

export interface ThreeColumnLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  leftWidth?: number;
  rightWidth?: number;
  gap?: CSSProperties["gap"];
  stickyRails?: boolean;
}

export default function ThreeColumnLayout({
  left,
  center,
  right,
  leftWidth = 260,
  rightWidth = 320,
  gap = 48,
  stickyRails = true,
}: ThreeColumnLayoutProps) {
  const railStyle: CSSProperties | undefined = stickyRails
    ? { position: "sticky", top: 24, alignSelf: "start" }
    : undefined;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${leftWidth}px minmax(0, 1fr) ${rightWidth}px`,
        gap,
      }}
    >
      <aside style={railStyle}>{left}</aside>
      <div style={{ minWidth: 0 }}>{center}</div>
      <aside style={railStyle}>{right}</aside>
    </div>
  );
}
