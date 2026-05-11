import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
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

const MANDATES: Mandate[] = [
  { id: "m1", property: "Sunlit Cottage · Caroline", agent: "Lebo Properties", agentInit: "LP", scope: "Full management", since: "Jan 2024", rent: "R 4,400", status: "Active", fee: "8%" },
  { id: "m2", property: "Garden Flatlet · Brixton", agent: "Lebo Properties", agentInit: "LP", scope: "Tenant find only", since: "Mar 2025", rent: "R 5,200", status: "Active", fee: "1 month" },
  { id: "m3", property: "Studio · Melville", agent: "—", agentInit: "—", scope: "Self-managed", since: "—", rent: "R 5,400", status: "Self", fee: "—" },
  { id: "m4", property: "Loft · Maboneng", agent: "Inner City Lets", agentInit: "IC", scope: "Full management", since: "Sep 2023", rent: "R 7,800", status: "Ending Apr", fee: "10%" },
];

const STATUS_BADGE: Record<Mandate["status"], { tone: "success" | "warn" | "neutral"; label: string }> = {
  Active: { tone: "success", label: "Active" },
  Self: { tone: "neutral", label: "Self-managed" },
  "Ending Apr": { tone: "warn", label: "Ending Apr" },
};

export default function Mandates() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Manage"
          title="Mandates & agents"
          subtitle="Delegate any property to a vetted agent — keep full visibility into rent, vacancy, and statements."
          actions={
            <Button variant="accent" leftIcon="plus">
              New mandate
            </Button>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          <KpiTile label="Properties under mandate" value="3" subText="of 4 total" />
          <KpiTile
            label="Agency fees · YTD"
            value="R 11,840"
            subText="8.2% of rent collected"
          />
          <KpiTile label="Avg vacancy" value="9 days" subText="↓ 4 vs self-managed" subTone="success" />
          <KpiTile label="Agent satisfaction" value="4.7" subText="Based on 18 reviews" />
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
              <Button variant="ghost" size="sm" leftIcon="download">
                Statements
              </Button>
            </div>
          </div>
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
                      <Button variant="ghost" size="sm" rightIcon="chevR">
                        Manage
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
