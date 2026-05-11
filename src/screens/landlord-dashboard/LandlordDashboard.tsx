import Nav from "@/components/Nav";
import Sidebar, { type SidebarItem } from "@/components/Sidebar";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import KpiTile from "@/components/KpiTile";
import ActionItem from "@/components/ActionItem";
import PropertyTable, { type PropertyTableRowData } from "./PropertyTable";
import ApplicationPipeline, { type PipelineColumn } from "./ApplicationPipeline";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "overview", icon: "grid", label: "Overview", to: "/landlord-dashboard", active: true },
  { id: "properties", icon: "home", label: "Properties", to: "/landlord-dashboard" },
  { id: "applications", icon: "inbox", label: "Applications", to: "/applicant", count: 7 },
  { id: "tenants", icon: "users", label: "Tenants", to: "/tenant-portal" },
  { id: "leases", icon: "paper", label: "Leases", to: "/lease" },
  { id: "payments", icon: "cash", label: "Payments", to: "/statements" },
  { id: "viewings", icon: "calendar", label: "Viewings", to: "/viewings" },
  { id: "mandates", icon: "key", label: "Mandates", to: "/mandates" },
  { id: "insights", icon: "trend", label: "Insights", to: "/analytics" },
];

const PROPERTY_ROWS: PropertyTableRowData[] = [
  { id: "p1", name: "Sunlit Property · Caroline", sub: "Brixton, JHB", units: 3, occupancyPct: 67, occupancyLabel: "2 of 3", monthlyRent: "R 15,400", apps: 3 },
  { id: "p2", name: "Garden Cottages", sub: "Westdene, JHB", units: 4, occupancyPct: 100, occupancyLabel: "4 of 4", monthlyRent: "R 21,600", apps: 1 },
  { id: "p3", name: "Auckland Studios", sub: "Auckland Park, JHB", units: 5, occupancyPct: 100, occupancyLabel: "5 of 5", monthlyRent: "R 32,500", apps: 3 },
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

function ProTipCard() {
  return (
    <Card padding={16}>
      <Eyebrow style={{ marginBottom: 6, color: "var(--accent)" }}>Pro tip</Eyebrow>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--slate)" }}>
        You have 1 vacancy. List it before month-end to catch May movers.
      </div>
      <Button variant="accent" size="sm" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
        List vacancy
      </Button>
    </Card>
  );
}

export default function LandlordDashboard() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", display: "flex" }}>
      <Sidebar
        items={SIDEBAR_ITEMS}
        header={
          <Eyebrow style={{ padding: "0 12px 12px" }}>Landlord workspace</Eyebrow>
        }
        footer={<ProTipCard />}
        style={{
          background: "var(--surface-2)",
          borderRight: "1px solid var(--hairline)",
          padding: "24px 16px",
          minHeight: "100vh",
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Nav role="landlord" />

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
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  margin: "8px 0 0",
                }}
              >
                Good morning, Thandi
              </h1>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" leftIcon="download">
                Export
              </Button>
              <Button variant="accent" leftIcon="plus">
                List a property
              </Button>
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

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24 }}>
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
              <PropertyTable rows={PROPERTY_ROWS} />
            </Card>

            <Card padding={0} style={{ overflow: "hidden" }}>
              <div
                style={{
                  padding: "20px 24px 16px",
                  borderBottom: "1px solid var(--hairline)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Action queue</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                    5 things need you
                  </div>
                </div>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
              <ActionItem icon="user" tone="accent" title="Sipho Dlamini applied" subtitle="Studio · Melville · 14m ago" ctaLabel="Review" />
              <ActionItem icon="paper" tone="warn" title="Lease ready to send" subtitle="Garden Flat · Westdene" ctaLabel="Send" />
              <ActionItem icon="calendar" tone="accent" title="Viewing · Sat 10:30" subtitle="Naledi K. · Studio · Melville" ctaLabel="Confirm" />
              <ActionItem icon="cash" tone="neutral" title="April rent reconciled" subtitle="11 of 11 received" ctaLabel="View" />
              <ActionItem icon="bolt" tone="warn" title="Maintenance request" subtitle="Geyser · Caroline · Backroom B" ctaLabel="Assign" last />
            </Card>
          </div>

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
              <Button variant="ghost" size="sm" rightIcon="arrR">
                Open full pipeline
              </Button>
            </div>
            <ApplicationPipeline columns={PIPELINE_COLUMNS} />
          </section>
        </div>
      </div>
    </div>
  );
}
