import { useState } from "react";
import { Link } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import AgentShell from "@/components/AgentShell";
import { useWorkspace } from "@/lib/useWorkspace";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import KpiTile from "@/components/KpiTile";
import EmptyState from "@/components/EmptyState";

type PaymentState = "current" | "late" | "ending" | "renewed";

interface TenantRow {
  id: string;
  name: string;
  init: string;
  email: string;
  property: string;
  rent: number;
  startedOn: string;
  nextDue: string;
  state: PaymentState;
  leaseEnds: string;
  paidStreak: number;
}

const ROWS: TenantRow[] = [];

const FILTERS: { id: PaymentState | "all"; label: string; count: number }[] = [
  { id: "all", label: "All tenants", count: 0 },
  { id: "current", label: "Current", count: 0 },
  { id: "late", label: "Late", count: 0 },
  { id: "ending", label: "Lease ending ≤60d", count: 0 },
  { id: "renewed", label: "Renewed", count: 0 },
];

const STATE_BADGE: Record<PaymentState, { tone: "success" | "warn" | "danger" | "accent" | "neutral"; label: string }> = {
  current: { tone: "success", label: "Paying on time" },
  late: { tone: "danger", label: "4 days late" },
  ending: { tone: "warn", label: "Lease ending" },
  renewed: { tone: "accent", label: "Renewed +12m" },
};

export default function LandlordTenants() {
  const ws = useWorkspace();
  const Shell = ws === "agent" ? AgentShell : LandlordShell;
  const [filter, setFilter] = useState<PaymentState | "all">("all");
  const rows = filter === "all" ? ROWS : ROWS.filter((r) => r.state === filter);
  const monthlyRent = ROWS.reduce((s, r) => s + r.rent, 0);

  return (
    <Shell activeId="tenants">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Active leases"
          title="Tenants"
          subtitle="Every signed lease across your properties. Distinct from Applications — these are already in your units."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Filter</Button>
              <Link to="/statements" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" leftIcon="download">Export</Button>
              </Link>
              <Link to="/inbox" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="chat">Message all</Button>
              </Link>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Active tenants" value="0" />
          <KpiTile
            label="Monthly rent · gross"
            value={`R ${monthlyRent.toLocaleString("en-ZA")}`}
          />
          <KpiTile label="Paid on time · last 12m" value="—" subText="—" />
          <KpiTile label="Leases ending ≤60d" value="0" subText="—" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as PaymentState | "all")}
          />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          {rows.length === 0 ? (
            <EmptyState
              icon="users"
              title="No tenants yet"
              description="Once a tenant signs a lease, they'll show up here."
            />
          ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Tenant", "Property", "Rent", "Next due", "Lease ends", "Streak", "Status", ""].map((h) => (
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
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={r.init} size="md" tone="neutral" />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: "var(--slate)" }}>{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13 }}>
                      {r.property}
                      <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
                        Started {r.startedOn}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }} className="tabular">
                      R {r.rent.toLocaleString("en-ZA")}
                    </td>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: r.state === "late" ? "var(--danger)" : "var(--ink)",
                        fontWeight: r.state === "late" ? 600 : 500,
                      }}
                    >
                      {r.nextDue}
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--slate)" }}>{r.leaseEnds}</td>
                    <td style={{ padding: "16px 20px", fontSize: 13 }} className="tabular">
                      {r.paidStreak > 0 ? `${r.paidStreak}× on time` : "—"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <Link to="/tenant-portal" style={{ textDecoration: "none" }}>
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
    </Shell>
  );
}
