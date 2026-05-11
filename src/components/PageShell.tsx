import type { CSSProperties, ReactNode } from "react";
import Nav, { type NavRole } from "./Nav";

export interface PageShellProps {
  role?: NavRole;
  sidebar?: ReactNode;
  children: ReactNode;
  maxWidth?: number;
  padding?: CSSProperties["padding"];
  /** Hide nav entirely (print/email artboards, auth screen). */
  bare?: boolean;
}

export default function PageShell({
  role = "tenant",
  sidebar,
  children,
  maxWidth = 1440,
  padding = "32px",
  bare = false,
}: PageShellProps) {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!bare ? <Nav role={role} /> : null}
      {sidebar ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            maxWidth,
            width: "100%",
            margin: "0 auto",
            padding,
            gap: 24,
          }}
        >
          {sidebar}
          <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
        </div>
      ) : (
        <main style={{ maxWidth, margin: "0 auto", padding, width: "100%" }}>{children}</main>
      )}
    </div>
  );
}
