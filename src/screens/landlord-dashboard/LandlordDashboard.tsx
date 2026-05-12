import { Link, useNavigate } from "react-router-dom";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import KpiTile from "@/components/KpiTile";
import LandlordShell from "@/components/LandlordShell";
import PropertyTable, { type PropertyTableRowData } from "./PropertyTable";
import ApplicationPipeline, { type PipelineColumn } from "./ApplicationPipeline";

const PROPERTY_ROWS: PropertyTableRowData[] = [
  { id: "p1", name: "Sunlit Property · Caroline", sub: "Brixton, JHB", units: 3, occupancyPct: 67, occupancyLabel: "2 of 3", monthlyRent: "R 15,400", apps: 3, state: "LISTED", source: "BY_AGENT", agent: "Naledi M.", mandate: "Full management", payoutAccount: "FNB ••3091" },
  { id: "p2", name: "Garden Cottages", sub: "Westdene, JHB", units: 4, occupancyPct: 100, occupancyLabel: "4 of 4", monthlyRent: "R 21,600", apps: 1, state: "LISTED", source: "LISTED_BY_OWNER", mandate: "Self-managed", payoutAccount: "FNB ••3091" },
  { id: "p3", name: "Auckland Studios", sub: "Auckland Park, JHB", units: 5, occupancyPct: 100, occupancyLabel: "5 of 5", monthlyRent: "R 32,500", apps: 3, state: "LISTED", source: "BY_AGENT", agent: "Lebo Properties", mandate: "Tenant find", payoutAccount: "Capitec ••4280" },
  { id: "p4", name: "Loft · Maboneng", sub: "Maboneng, JHB", units: 1, occupancyPct: 0, occupancyLabel: "0 of 1", monthlyRent: "R 7,800", apps: 0, state: "DRAFT", source: "LISTED_BY_OWNER", mandate: "Self-managed", payoutAccount: "FNB ••3091" },
  { id: "p5", name: "Backroom · Vilakazi St", sub: "Orlando West, SOW", units: 2, occupancyPct: 50, occupancyLabel: "1 of 2", monthlyRent: "R 3,450", apps: 5, state: "UNLISTED", source: "BY_AGENT", agent: "Vilakazi Property Co.", mandate: "Full management", payoutAccount: "FNB ••3091" },
];

const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    title: "New",
    count: 3,
    items: [
      { id: "a1", name: "Sipho Dlamini", unit: "Studio · Melville", score: 84 },
      { id: "a2", name: "Lerato Ndlovu", unit: "Backroom · Yeoville", score: 72 },
      { id: "a3", name: "Aisha Patel", unit: "Garden · Westdene", score: 91 },
    ],
  },
  {
    title: "Vetting",
    count: 2,
    items: [
      { id: "a4", name: "Naledi Khumalo", unit: "Studio · Melville", score: 88, sub: "FICA in progress" },
      { id: "a5", name: "Mpho Sithole", unit: "Cottage · Westdene", score: 79, sub: "Credit pulled" },
    ],
  },
  {
    title: "Interview",
    count: 1,
    items: [{ id: "a6", name: "Karabo Mokoena", unit: "Backroom · Caroline", score: 95, sub: "Sat 10:30" }],
  },
  {
    title: "Lease",
    count: 1,
    items: [{ id: "a7", name: "Zinhle Maseko", unit: "Garden · Westdene", score: 92, sub: "Awaiting signature" }],
  },
];

export default function LandlordDashboard() {
  const navigate = useNavigate();
  return (
    <LandlordShell activeId="overview">
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
              Good morning, Thandi
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/statements" style={{ textDecoration: "none" }}>
              <Button variant="secondary" leftIcon="download">
                Export
              </Button>
            </Link>
            <Link to="/wizard" style={{ textDecoration: "none" }}>
              <Button variant="accent" leftIcon="plus">
                List a property
              </Button>
            </Link>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          <KpiTile
            label="Monthly rent"
            value="R 24,400"
            delta="+R 1,200"
            deltaTone="success"
            subText="vs last month"
            spark={[16, 14, 15, 10, 12, 7, 8, 3]}
            sparkTone="success"
          />
          <KpiTile label="Occupancy" value="92%" delta="11 of 12 units" subText="2 turning over Jun" />
          <KpiTile label="Open applications" value="7" delta="+3 today" deltaTone="accent" subText="2 awaiting review" />
          <KpiTile label="Outstanding" value="R 0" delta="0 days late" deltaTone="success" subText="all paid current" />
        </div>

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
              <div style={{ fontSize: 16, fontWeight: 600 }}>Your properties</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                3 properties · 12 units
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Chip style={{ height: 30, fontSize: 12 }}>All</Chip>
              <Chip active style={{ height: 30, fontSize: 12 }}>
                Active
              </Chip>
              <Chip style={{ height: 30, fontSize: 12 }}>Drafts</Chip>
            </div>
          </div>
          <PropertyTable
            rows={PROPERTY_ROWS}
            onOpen={(id) => navigate(`/property?ctx=landlord&id=${id}`)}
            onEdit={(id) => navigate(`/wizard?edit=${id}`)}
          />
        </Card>

        <section style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 6 }}>Applicants</Eyebrow>
              <div style={{ fontSize: 18, fontWeight: 600 }}>Pipeline</div>
            </div>
            <Link to="/applicant" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm" rightIcon="arrR">
                Open full pipeline
              </Button>
            </Link>
          </div>
          <ApplicationPipeline columns={PIPELINE_COLUMNS} onOpenApplicant={() => navigate("/applicant")} />
        </section>
      </div>
    </LandlordShell>
  );
}
