import { useState } from "react";
import { Link } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
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
import EmptyState from "@/components/EmptyState";

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

const REQUESTS: MandateRequest[] = [];

const FILTERS: { id: ApprovalState | "all"; label: string; count: number }[] = [
  { id: "pending", label: "Pending", count: 0 },
  { id: "approved", label: "Approved", count: 0 },
  { id: "rejected", label: "Rejected", count: 0 },
  { id: "revoked", label: "Revoked", count: 0 },
  { id: "all", label: "All", count: 0 },
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
    <LandlordShell activeId="mandate-approvals">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Approvals"
          title="Mandate requests"
          subtitle="Agencies asking permission to manage one of your properties. Approve to grant access; reject to keep self-managing."
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          <KpiTile label="Pending" value="0" subText="—" />
          <KpiTile label="Approved · YTD" value="0" />
          <KpiTile label="Avg. response time" value="—" subText="—" />
          <KpiTile label="Active mandates" value="0" subText="—" />
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

        {rows.length === 0 ? (
          <EmptyState
            icon="check"
            title="No mandate requests"
            description="Approval requests from agencies wanting to manage your properties will appear here."
          />
        ) : (
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
                    <Link to="/my-mandates" style={{ textDecoration: "none" }}>
                      <Button variant="accent" leftIcon="check">Approve mandate</Button>
                    </Link>
                    <Link to="/inbox" style={{ textDecoration: "none" }}>
                      <Button variant="secondary">Counter-offer</Button>
                    </Link>
                    <Button variant="ghost">Reject</Button>
                    <Link to="/agency-browse" style={{ textDecoration: "none", marginLeft: "auto" }}>
                      <Button variant="ghost" rightIcon="chevR">
                        View agency profile
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                    <Link to="/my-mandates" style={{ textDecoration: "none", marginLeft: "auto" }}>
                      <Button variant="ghost" rightIcon="chevR">
                        View full mandate
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        )}
      </div>
    </LandlordShell>
  );
}
