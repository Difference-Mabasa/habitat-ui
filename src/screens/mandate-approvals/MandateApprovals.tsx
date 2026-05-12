import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import KpiTile from "@/components/KpiTile";
import KeyValueRow from "@/components/KeyValueRow";
import Alert from "@/components/Alert";

type ApprovalState = "pending" | "approved" | "rejected" | "revoked";

interface MandateRequest {
  id: string;
  agency: string;
  agencyInit: string;
  agent: string;
  property: string;
  scope: "Full management" | "Tenant find only" | "Letting & inspections";
  fee: string;
  duration: string;
  requested: string;
  state: ApprovalState;
  notes?: string;
}

const REQUESTS: MandateRequest[] = [
  {
    id: "ma1",
    agency: "Vilakazi Property Co.",
    agencyInit: "VPC",
    agent: "Naledi Mokoena",
    property: "Backroom · Vilakazi St, Orlando West",
    scope: "Full management",
    fee: "8% of monthly rent",
    duration: "12 months",
    requested: "3 hours ago",
    state: "pending",
    notes: "Includes monthly statements + maintenance triage. Trust account audited Mar 2026.",
  },
  {
    id: "ma2",
    agency: "Lebo Properties",
    agencyInit: "LP",
    agent: "Thabo K.",
    property: "Garden Flatlet · Brixton",
    scope: "Tenant find only",
    fee: "1 month rent (once-off)",
    duration: "Until let",
    requested: "1 day ago",
    state: "pending",
  },
  {
    id: "ma3",
    agency: "Inner City Lets",
    agencyInit: "IC",
    agent: "Pieter v.d.B.",
    property: "Loft · Maboneng",
    scope: "Letting & inspections",
    fee: "6% + R 250 / inspection",
    duration: "24 months",
    requested: "5 days ago",
    state: "approved",
  },
  {
    id: "ma4",
    agency: "North Joburg Realty",
    agencyInit: "NJ",
    agent: "Susan B.",
    property: "Studio · Killarney",
    scope: "Full management",
    fee: "10% of monthly rent",
    duration: "12 months",
    requested: "1 week ago",
    state: "rejected",
    notes: "Rejected — fee structure not aligned. Owner countered at 7.5%.",
  },
];

const FILTERS: { id: ApprovalState | "all"; label: string; count: number }[] = [
  { id: "pending", label: "Pending", count: 2 },
  { id: "approved", label: "Approved", count: 1 },
  { id: "rejected", label: "Rejected", count: 1 },
  { id: "revoked", label: "Revoked", count: 0 },
  { id: "all", label: "All", count: 4 },
];

const STATE_BADGE: Record<ApprovalState, { tone: "neutral" | "success" | "warn" | "danger" | "accent"; label: string }> = {
  pending: { tone: "warn", label: "Pending your approval" },
  approved: { tone: "success", label: "Approved" },
  rejected: { tone: "danger", label: "Rejected" },
  revoked: { tone: "neutral", label: "Revoked" },
};

export default function MandateApprovals() {
  const [filter, setFilter] = useState<ApprovalState | "all">("pending");
  const rows = filter === "all" ? REQUESTS : REQUESTS.filter((r) => r.state === filter);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Approvals"
          title="Mandate requests"
          subtitle="Agencies asking permission to manage one of your properties. Approve to grant access; reject to keep self-managing."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          <KpiTile label="Pending" value="2" valueTone="warn" subText="oldest: 1 day" />
          <KpiTile label="Approved · YTD" value="6" valueTone="success" />
          <KpiTile label="Avg. response time" value="14 h" subText="across all requests" />
          <KpiTile label="Active mandates" value="3" subText="of 4 properties" />
        </div>

        <Alert tone="info" title="Before you approve">
          Check the agency's PPRA registration, trust-account audit date, and the fee structure. You can always
          revoke a mandate later — but rejecting now is cheaper if the terms don't fit.
        </Alert>

        <div style={{ margin: "20px 0 16px" }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as ApprovalState | "all")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r) => {
            const badge = STATE_BADGE[r.state];
            return (
              <Card key={r.id} padding={20}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 10,
                      background: "var(--surface-2)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {r.agencyInit}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{r.agency}</div>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Avatar name={r.agent} size="sm" tone="neutral" />
                        {r.agent}
                      </span>
                      <span>·</span>
                      <span>Requested {r.requested}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16, padding: 14, background: "var(--surface-2)", borderRadius: 8 }}>
                  <Eyebrow style={{ marginBottom: 6 }}>Property</Eyebrow>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{r.property}</div>
                  <KeyValueRow label="Scope" value={r.scope} divider />
                  <KeyValueRow label="Fee" value={r.fee} divider />
                  <KeyValueRow label="Duration" value={r.duration} divider />
                </div>

                {r.notes ? (
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "12px 0 0", lineHeight: 1.55 }}>
                    “{r.notes}”
                  </p>
                ) : null}

                {r.state === "pending" ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                    <Button variant="accent" leftIcon="check">Approve mandate</Button>
                    <Button variant="secondary">Counter-offer</Button>
                    <Button variant="ghost">Reject</Button>
                    <Button variant="ghost" style={{ marginLeft: "auto" }} rightIcon="chevR">
                      View agency profile
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: "flex", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                    <Button variant="ghost" rightIcon="chevR" style={{ marginLeft: "auto" }}>
                      View full mandate
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
