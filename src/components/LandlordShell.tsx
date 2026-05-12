import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import Eyebrow from "./Eyebrow";
import Card from "./Card";
import Button from "./Button";
import { Link } from "react-router-dom";
import { LANDLORD_SIDEBAR, type LandlordSidebarId } from "@/lib/landlordNav";

export interface LandlordShellProps {
  /** Which sidebar item should render as active. */
  activeId: LandlordSidebarId;
  /** The page content. */
  children: ReactNode;
  /** Override the right-pane background. Defaults to var(--paper). */
  background?: string;
}

function ProTipCard() {
  return (
    <Card padding={16}>
      <Eyebrow style={{ marginBottom: 6, color: "var(--accent)" }}>Pro tip</Eyebrow>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--slate)" }}>
        You have 1 vacancy. List it before month-end to catch May movers.
      </div>
      <Link to="/wizard" style={{ textDecoration: "none" }}>
        <Button variant="accent" size="sm" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
          List vacancy
        </Button>
      </Link>
    </Card>
  );
}

/**
 * Landlord-dashboard chrome: top nav + sticky sidebar + content slot. Every
 * landlord-side screen wraps its body in this so the sidebar persists.
 */
export default function LandlordShell({
  activeId,
  children,
  background = "var(--paper)",
}: LandlordShellProps) {
  return (
    <div style={{ background, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Nav role="landlord" />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          items={LANDLORD_SIDEBAR.map((i) => ({ ...i, active: i.id === activeId }))}
          header={<Eyebrow style={{ padding: "0 12px 12px" }}>Landlord workspace</Eyebrow>}
          footer={<ProTipCard />}
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
