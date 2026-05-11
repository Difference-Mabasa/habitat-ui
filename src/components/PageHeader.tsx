import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

export interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  badges?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  badges,
}: PageHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--ink)",
            }}
          >
            {title}
          </h1>
          {badges}
        </div>
        {subtitle ? (
          <p style={{ fontSize: 14, color: "var(--slate)", margin: "4px 0 0", maxWidth: 720 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{actions}</div> : null}
    </header>
  );
}
