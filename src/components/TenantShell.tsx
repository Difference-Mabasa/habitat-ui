import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import Eyebrow from "./Eyebrow";
import { TENANT_SIDEBAR, type TenantSidebarId } from "@/lib/tenantNav";

export interface TenantShellProps {
  /** Which sidebar item should render as active. */
  activeId: TenantSidebarId;
  /** The page content — usually wrapped in its own max-width container. */
  children: ReactNode;
  /** Override the right-pane background. Defaults to var(--paper). */
  background?: string;
}

/**
 * Tenant-dashboard chrome: sidebar rail + nav + content slot. Every screen
 * that should keep the My Rental sidebar visible wraps its body in this.
 */
export default function TenantShell({
  activeId,
  children,
  background = "var(--paper)",
}: TenantShellProps) {
  return (
    <div style={{ background, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Nav role="tenant" />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          items={TENANT_SIDEBAR.map((i) => ({ ...i, active: i.id === activeId }))}
          header={<Eyebrow style={{ padding: "0 12px 12px" }}>My rental</Eyebrow>}
          style={{
            background: "var(--surface-2)",
            borderRight: "1px solid var(--hairline)",
            padding: "24px 16px",
            alignSelf: "stretch",
            overflowY: "auto",
          }}
        />
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
