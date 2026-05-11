import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

export interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            margin: 0,
            color: "var(--ink)",
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p style={{ fontSize: 13, color: "var(--slate)", margin: "2px 0 0" }}>{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{actions}</div> : null}
    </div>
  );
}
