import { Link } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import KpiTile from "@/components/KpiTile";

interface Mandate {
  id: string;
  property: string;
  agent: string;
  agentInit: string;
  scope: string;
  since: string;
  rent: string;
  status: "Active" | "Self" | "Ending Apr";
  fee: string;
}

const MANDATES: Mandate[] = [];

const STATUS_BADGE: Record<Mandate["status"], { tone: "success" | "warn" | "neutral"; label: string }> = {
  Active: { tone: "success", label: "Active" },
  Self: { tone: "neutral", label: "Self-managed" },
  "Ending Apr": { tone: "warn", label: "Ending Apr" },
};

export default function Mandates() {
  return (
    <LandlordShell activeId="mandate-approvals">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Manage"
          title="Mandates & agents"
          subtitle="Delegate any property to a vetted agent — keep full visibility into rent, vacancy, and statements."
          actions={
            <Link to="/mandate-approvals" style={{ textDecoration: "none" }}>
              <Button variant="accent" leftIcon="plus">
                New mandate
              </Button>
            </Link>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          <KpiTile label="Properties under mandate" value="0" />
          <KpiTile label="Agency fees · YTD" value="R 0" />
          <KpiTile label="Avg vacancy" value="—" />
          <KpiTile label="Agent satisfaction" value="—" />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Your mandates</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" size="sm" leftIcon="filter">
                Status
              </Button>
              <Link to="/statements" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" leftIcon="download">
                  Statements
                </Button>
              </Link>
            </div>
          </div>
          {MANDATES.length === 0 ? (
            <EmptyState
              icon="key"
              title="No mandates"
              description="Delegate a property to a vetted agent to see it here."
            />
          ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Property", "Agent", "Scope", "Fee", "Rent", "Since", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 24px",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--slate)",
                      borderBottom: "1px solid var(--hairline)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MANDATES.map((m) => {
                const status = STATUS_BADGE[m.status];
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                    <td style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500 }}>{m.property}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13 }}>
                      {m.agent === "—" ? (
                        <span style={{ color: "var(--slate)" }}>—</span>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar
                            name={m.agentInit}
                            size="sm"
                            shape="square"
                            tone="neutral"
                            style={{ width: 24, height: 24, fontSize: 10 }}
                          />
                          {m.agent}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--slate)" }}>{m.scope}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13 }} className="tabular">{m.fee}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13, fontWeight: 500 }} className="tabular">{m.rent}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--slate)" }}>{m.since}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <Link to="/my-mandates" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" rightIcon="chevR">
                          Manage
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </Card>
      </div>
    </LandlordShell>
  );
}
