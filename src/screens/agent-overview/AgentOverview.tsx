import { Link, useNavigate } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import Badge, { type BadgeTone } from "@/components/Badge";
import Avatar from "@/components/Avatar";

interface RecentBrief {
  id: string;
  tenant: string;
  init: string;
  body: string;
  posted: string;
  status: "OPEN" | "PROPOSED" | "WON" | "LOST";
}

const RECENT: RecentBrief[] = [
  { id: "r1", tenant: "Sipho Dlamini", init: "SD", body: "Backroom · Orlando West · R 3,000–4,200 · by 1 Jun", posted: "18m ago", status: "OPEN" },
  { id: "r2", tenant: "Naledi Khumalo", init: "NK", body: "Cottage · Westdene · R 5,500–7,500 · ASAP", posted: "2h ago", status: "PROPOSED" },
  { id: "r3", tenant: "Aisha Mahlangu", init: "AM", body: "Loft · Maboneng · R 6,500–9,000 · by 1 Jun", posted: "Yesterday", status: "WON" },
  { id: "r4", tenant: "Mxolisi Ndlovu", init: "MN", body: "Bachelor flat · Pimville · R 2,800–3,500 · by 1 Jul", posted: "3d ago", status: "LOST" },
];

const STATUS_META: Record<RecentBrief["status"], { tone: BadgeTone; label: string }> = {
  OPEN: { tone: "warn", label: "Open" },
  PROPOSED: { tone: "accent", label: "You proposed" },
  WON: { tone: "success", label: "Won" },
  LOST: { tone: "neutral", label: "Lost" },
};

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
          }}
        >
          <div>
            <Eyebrow>Overview</Eyebrow>
            <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 0" }}>
              Good morning, Naledi
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/portfolio" style={{ textDecoration: "none" }}>
              <Button variant="secondary" leftIcon="home">View portfolio</Button>
            </Link>
            <Link to="/job-board" style={{ textDecoration: "none" }}>
              <Button variant="accent" leftIcon="search">Open job board</Button>
            </Link>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          <KpiTile
            label="Open briefs"
            value="3"
            valueTone="accent"
            subText="in your areas"
            spark={[2, 1, 2, 3, 2, 3, 3]}
            sparkTone="accent"
          />
          <KpiTile
            label="Mandates active"
            value="24"
            subText="2 ending ≤60d"
            subTone="warn"
          />
          <KpiTile
            label="Placements · YTD"
            value="11"
            valueTone="success"
            delta="+3 this month"
            deltaTone="success"
          />
          <KpiTile label="Fees · YTD" value="R 38,400" subText="Avg R 3,490 per placement" />
        </div>

        <div>
          <Card padding={0} style={{ overflow: "hidden" }}>
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
            {RECENT.map((r, i) => {
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
            })}
          </Card>

        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>This week</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <span><strong>9</strong> open viewings</span>
              <span><strong>4</strong> applications under review</span>
              <span><strong>R 12,200</strong> in rent due to release</span>
            </div>
          </Card>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Response time</Eyebrow>
            <div className="tabular" style={{ fontSize: 28, fontWeight: 600, color: "var(--success)" }}>
              42 min
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
              Faster than 78% of agents in your areas
            </div>
          </Card>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Win rate</Eyebrow>
            <div className="tabular" style={{ fontSize: 28, fontWeight: 600 }}>
              36%
            </div>
            <div style={{ fontSize: 12, color: "var(--success)", marginTop: 4 }}>
              ↑ 4 pts vs last 30 days
            </div>
          </Card>
        </div>
      </div>
    </AgentShell>
  );
}
