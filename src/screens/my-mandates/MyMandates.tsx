import { useState } from "react";
import { Link } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import KpiTile from "@/components/KpiTile";
import EmptyState from "@/components/EmptyState";

type MandateState = "active" | "pending" | "completed" | "revoked";

interface MandateRow {
  id: string;
  property: string;
  landlord: string;
  landlordInit: string;
  scope: string;
  fee: string;
  rent: number;
  state: MandateState;
  since: string;
  expires?: string;
  documents: number;
  /** "Self-initiated", "Landlord-initiated", or "Offline" lifecycle path. */
  origin: "Online" | "Offline" | "Landlord";
}

const ROWS: MandateRow[] = [];

const FILTERS: { id: MandateState | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 0 },
  { id: "active", label: "Active", count: 0 },
  { id: "pending", label: "Pending", count: 0 },
  { id: "completed", label: "Completed", count: 0 },
  { id: "revoked", label: "Revoked", count: 0 },
];

const STATE_BADGE: Record<MandateState, { tone: "success" | "warn" | "neutral" | "danger"; label: string }> = {
  active: { tone: "success", label: "Active" },
  pending: { tone: "warn", label: "Pending approval" },
  completed: { tone: "neutral", label: "Completed" },
  revoked: { tone: "danger", label: "Revoked" },
};

export default function MyMandates() {
  const [filter, setFilter] = useState<MandateState | "all">("all");
  const rows = filter === "all" ? ROWS : ROWS.filter((r) => r.state === filter);
  const monthlyRent = rows.filter((r) => r.state === "active").reduce((s, r) => s + r.rent, 0);

  return (
    <AgentShell activeId="mandates">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Pipeline"
          title="My mandates"
          subtitle="Every property you're representing — by status, origin, and document completeness."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Filter</Button>
              <Link to="/statements" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" leftIcon="download">Export</Button>
              </Link>
              <Link to="/mandate-approvals" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="plus">New mandate</Button>
              </Link>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Active" value="0" />
          <KpiTile
            label="Rent under management"
            value={`R ${monthlyRent.toLocaleString("en-ZA")}/mo`}
          />
          <KpiTile label="Pending" value="0" subText="—" />
          <KpiTile label="Avg. tenure" value="—" subText="—" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as MandateState | "all")}
          />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          {rows.length === 0 ? (
            <EmptyState
              icon="paper"
              title="No mandates yet"
              description="Mandates you take on or send for approval will appear here."
            />
          ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Property", "Landlord", "Scope", "Fee", "Rent", "Origin", "Docs", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 20px",
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
              {rows.map((r) => {
                const badge = STATE_BADGE[r.state];
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                    <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }}>
                      {r.property}
                      <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{r.since}</div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar name={r.landlordInit} size="sm" tone="neutral" />
                        {r.landlord}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--slate)" }}>{r.scope}</td>
                    <td style={{ padding: "16px 20px", fontSize: 13 }}>{r.fee}</td>
                    <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }} className="tabular">
                      R {r.rent.toLocaleString("en-ZA")}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <Badge tone="neutral">{r.origin}</Badge>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13 }} className="tabular">{r.documents}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <Link to="/mandate-approvals" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" rightIcon="chevR">Open</Button>
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
    </AgentShell>
  );
}
