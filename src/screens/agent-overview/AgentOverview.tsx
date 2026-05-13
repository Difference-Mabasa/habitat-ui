import { Link, useNavigate } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import Chip from "@/components/Chip";
import Badge, { type BadgeTone } from "@/components/Badge";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import PropertyTable, { type PropertyTableRowData } from "@/screens/landlord-dashboard/PropertyTable";
import ApplicationPipeline, { type PipelineColumn } from "@/screens/landlord-dashboard/ApplicationPipeline";

interface RecentBrief {
  id: string;
  tenant: string;
  init: string;
  body: string;
  posted: string;
  status: "OPEN" | "PROPOSED" | "WON" | "LOST";
}

const RECENT: RecentBrief[] = [];

const STATUS_META: Record<RecentBrief["status"], { tone: BadgeTone; label: string }> = {
  OPEN: { tone: "warn", label: "Open" },
  PROPOSED: { tone: "accent", label: "You proposed" },
  WON: { tone: "success", label: "Won" },
  LOST: { tone: "neutral", label: "Lost" },
};

const PORTFOLIO_ROWS: PropertyTableRowData[] = [];

const PIPELINE_COLUMNS: PipelineColumn[] = [
  { title: "New", count: 0, items: [] },
  { title: "Vetting", count: 0, items: [] },
  { title: "Interview", count: 0, items: [] },
  { title: "Lease", count: 0, items: [] },
];

export default function AgentOverview() {
  const navigate = useNavigate();
  return (
    <AgentShell activeId="overview">
      <div style={{ padding: "32px 32px 80px" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <Eyebrow>Overview</Eyebrow>
            <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 0" }}>
              Agent overview
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link to="/statements?ctx=agent" style={{ textDecoration: "none" }}>
              <Button variant="ghost" leftIcon="download">
                Export payouts
              </Button>
            </Link>
            <Link to="/job-board" style={{ textDecoration: "none" }}>
              <Button variant="secondary" leftIcon="search">Job board</Button>
            </Link>
            <Link to="/wizard?ctx=agent" style={{ textDecoration: "none" }}>
              <Button variant="accent" leftIcon="plus">
                List on behalf
              </Button>
            </Link>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          <KpiTile
            label="Open briefs"
            value="0"
            subText="in your areas"
          />
          <KpiTile
            label="Mandates active"
            value="0"
          />
          <KpiTile
            label="Placements · YTD"
            value="0"
          />
          <KpiTile label="Fees · YTD" value="R 0" />
        </div>

        {/* Portfolio snapshot — mirrors the landlord Overview's properties card */}
        <Card padding={0} style={{ overflow: "hidden", marginBottom: 24 }}>
          <div
            style={{
              padding: "20px 24px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Properties under your mandates</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                Mandates appear here once they're active.
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Chip active style={{ height: 30, fontSize: 12 }}>Active</Chip>
              <Chip style={{ height: 30, fontSize: 12 }}>Vacant</Chip>
              <Link to="/portfolio" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="sm" rightIcon="arrR">All</Button>
              </Link>
            </div>
          </div>
          <PropertyTable
            rows={PORTFOLIO_ROWS}
            onOpen={(id) => navigate(`/property?ctx=agent&id=${id}`)}
            onEdit={(id) => navigate(`/wizard?ctx=agent&edit=${id}`)}
          />
        </Card>

        {/* Marketplace activity */}
        <Card padding={0} style={{ overflow: "hidden", marginBottom: 24 }}>
          <div
            style={{
              padding: "20px 24px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Recent tenant briefs</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                Marketplace activity in your areas
              </div>
            </div>
            <Link to="/job-board" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm" rightIcon="arrR">Open job board</Button>
            </Link>
          </div>
          {RECENT.length === 0 ? (
            <EmptyState
              icon="search"
              title="No recent briefs"
              description="New tenant briefs in your areas will show up here."
            />
          ) : (
            RECENT.map((r, i) => {
              const meta = STATUS_META[r.status];
              return (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto auto",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 24px",
                    borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                  }}
                >
                  <Avatar name={r.init} size="md" tone="neutral" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.tenant}</div>
                    <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{r.body}</div>
                    <div style={{ fontSize: 10, color: "var(--slate-2)", marginTop: 2 }}>{r.posted}</div>
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon="chevR"
                    onClick={() => navigate(r.status === "OPEN" ? "/job-board" : "/agent-requests")}
                  >
                    {r.status === "OPEN" ? "Propose" : "Open"}
                  </Button>
                </div>
              );
            })
          )}
        </Card>

        {/* Application pipeline — same shape as the landlord overview */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 6 }}>Applicants on your mandates</Eyebrow>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Pipeline</div>
            </div>
            <Link to="/applicant?ctx=agent" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm" rightIcon="arrR">
                Open full pipeline
              </Button>
            </Link>
          </div>
          <ApplicationPipeline
            columns={PIPELINE_COLUMNS}
            onOpenApplicant={() => navigate("/applicant?ctx=agent")}
          />
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>This week</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <span><strong>0</strong> open viewings</span>
              <span><strong>0</strong> applications under review</span>
              <span><strong>R 0</strong> in rent due to release</span>
            </div>
          </Card>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Response time</Eyebrow>
            <div className="tabular" style={{ fontSize: 28, fontWeight: 600 }}>
              —
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
              Median time to first reply
            </div>
          </Card>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Win rate</Eyebrow>
            <div className="tabular" style={{ fontSize: 28, fontWeight: 600 }}>
              —
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
              Briefs you've won vs proposed
            </div>
          </Card>
        </div>
      </div>
    </AgentShell>
  );
}
