import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import Eyebrow from "./Eyebrow";
import Card from "./Card";
import Button from "./Button";
import { Link } from "react-router-dom";
import { AGENT_SIDEBAR, type AgentSidebarId } from "@/lib/agentNav";

export interface AgentShellProps {
  /** Which sidebar item should render as active. */
  activeId: AgentSidebarId;
  /** The page content. */
  children: ReactNode;
  /** Override the right-pane background. Defaults to var(--paper). */
  background?: string;
}

function MarketplaceTipCard() {
  return (
    <Card padding={16}>
      <Eyebrow style={{ marginBottom: 6, color: "var(--accent)" }}>Marketplace tip</Eyebrow>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--slate)" }}>
        Fastest agent on a brief usually wins it. Watch the job board notifications.
      </div>
      <Link to="/job-board" style={{ textDecoration: "none" }}>
        <Button variant="accent" size="sm" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
          Open job board
        </Button>
      </Link>
    </Card>
  );
}

/**
 * Agent-workspace chrome: top nav + sticky sidebar + content slot. Used by
 * every agent-side screen so the rail persists.
 */
export default function AgentShell({
  activeId,
  children,
  background = "var(--paper)",
}: AgentShellProps) {
  return (
    <div style={{ background, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Nav role="agent" />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          items={AGENT_SIDEBAR.map((i) => ({ ...i, active: i.id === activeId }))}
          header={<Eyebrow style={{ padding: "0 12px 12px" }}>Agent workspace</Eyebrow>}
          footer={<MarketplaceTipCard />}
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
