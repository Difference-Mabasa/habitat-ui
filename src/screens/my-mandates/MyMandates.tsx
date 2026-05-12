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

const ROWS: MandateRow[] = [
  {
    id: "mm1",
    property: "Backroom · Vilakazi St, Orlando West",
    landlord: "Thandi Mokoena",
    landlordInit: "TM",
    scope: "Full management",
    fee: "8% of monthly rent",
    rent: 3450,
    state: "active",
    since: "Jan 2024",
    expires: "Jan 2027",
    documents: 4,
    origin: "Online",
  },
  {
    id: "mm2",
    property: "Garden Cottage · Westdene",
    landlord: "Pieter Kruger",
    landlordInit: "PK",
    scope: "Tenant find only",
    fee: "1 month rent",
    rent: 5800,
    state: "active",
    since: "Mar 2025",
    documents: 3,
    origin: "Online",
  },
  {
    id: "mm3",
    property: "1-Bed · Maboneng Loft",
    landlord: "Ravi Singh",
    landlordInit: "RS",
    scope: "Letting & inspections",
    fee: "6% + R 250/inspection",
    rent: 7800,
    state: "pending",
    since: "Awaiting approval",
    documents: 5,
    origin: "Offline",
  },
  {
    id: "mm4",
    property: "Studio · Brixton",
    landlord: "Nomsa Zungu",
    landlordInit: "NZ",
    scope: "Full management",
    fee: "8% of monthly rent",
    rent: 4400,
    state: "completed",
    since: "Aug 2022 – Mar 2025",
    documents: 12,
    origin: "Online",
  },
  {
    id: "mm5",
    property: "Flatlet · Yeoville",
    landlord: "Lerato Pretorius",
    landlordInit: "LP",
    scope: "Full management",
    fee: "10% of monthly rent",
    rent: 5200,
    state: "revoked",
    since: "Revoked 2 May 2026",
    documents: 7,
    origin: "Landlord",
  },
];

const FILTERS: { id: MandateState | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 5 },
  { id: "active", label: "Active", count: 2 },
  { id: "pending", label: "Pending", count: 1 },
  { id: "completed", label: "Completed", count: 1 },
  { id: "revoked", label: "Revoked", count: 1 },
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
          <KpiTile label="Active" value="2" valueTone="success" />
          <KpiTile
            label="Rent under management"
            value={`R ${monthlyRent.toLocaleString("en-ZA")}/mo`}
          />
          <KpiTile label="Pending" value="1" valueTone="warn" subText="oldest: 3 days" />
          <KpiTile label="Avg. tenure" value="22 mo" subText="across completed" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as MandateState | "all")}
          />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
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
        </Card>
      </div>
    </AgentShell>
  );
}
