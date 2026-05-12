import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import PortfolioTable, { type PortfolioRow } from "./PortfolioTable";

const ROWS: PortfolioRow[] = [
  { id: "ag1", property: "Studio · Melville", landlord: "Thandi M.", rent: 5400, paid: true, maintenance: 1, apps30d: 12, status: "Let" },
  { id: "ag2", property: "Cottage · Caroline", landlord: "Pieter K.", rent: 4400, paid: true, maintenance: 0, apps30d: 8, status: "Let" },
  { id: "ag3", property: "Flatlet · Brixton", landlord: "Nomsa Z.", rent: 5200, paid: false, daysLate: 4, maintenance: 2, apps30d: 6, status: "Let" },
  { id: "ag4", property: "Loft · Maboneng", landlord: "Ravi S.", rent: 7800, paid: true, maintenance: 0, apps30d: 14, status: "Let" },
  { id: "ag5", property: "Studio · Brixton", landlord: "Aisha M.", rent: 4400, paid: null, maintenance: 0, apps30d: 22, status: "Vacant", vacantSince: "12d" },
  { id: "ag6", property: "Backroom · Yeoville", landlord: "Mxolisi N.", rent: 3800, paid: true, maintenance: 1, apps30d: 5, status: "Let" },
  { id: "ag7", property: "Cottage · Norwood", landlord: "Bongi T.", rent: 6200, paid: true, maintenance: 0, apps30d: 9, status: "Let" },
  { id: "ag8", property: "Studio · Auckland Park", landlord: "Lerato P.", rent: 4950, paid: null, maintenance: 0, apps30d: 17, status: "Listing" },
  { id: "ag9", property: "Flatlet · Greenside", landlord: "Kabelo D.", rent: 6500, paid: true, maintenance: 0, apps30d: 11, status: "Let" },
  { id: "ag10", property: "Garden cottage · Linden", landlord: "Susan B.", rent: 7200, paid: true, maintenance: 1, apps30d: 7, status: "Let" },
];

const FILTERS = [
  { id: "all", label: "All", count: 24 },
  { id: "let", label: "Let", count: 21 },
  { id: "vacant", label: "Vacant", count: 1 },
  { id: "listing", label: "Listing", count: 1 },
  { id: "issues", label: "Issues", count: 1 },
];

export default function Portfolio() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  return (
    <AgentShell activeId="portfolio">
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Properties under your mandates"
          title="Portfolio · 24 mandates"
          subtitle="Day-to-day operations across every property you (or your agency) manage. Use Mandates for the contract view."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Filter</Button>
              <Button variant="ghost" size="sm" leftIcon="download">Export</Button>
              <Button variant="accent" leftIcon="plus" onClick={() => navigate("/mandate-approvals")}>
                New mandate
              </Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Total monthly rent" value="R 156,200" />
          <KpiTile label="Collected this month" value="R 150,800" valueTone="success" />
          <KpiTile
            label="Outstanding"
            value="R 5,400"
            valueTone="warn"
            subText="1 property · 4 days late"
          />
          <KpiTile label="Vacant" value="2" subText="Studio Brixton · listing Auckland Pk" />
          <KpiTile label="Open viewings" value="9" subText="this week" />
        </div>

        <div style={{ marginBottom: 12 }}>
          <Tabs tabs={FILTERS} value={filter} onChange={setFilter} />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          <PortfolioTable
            rows={ROWS}
            onOpen={(id) => navigate(`/property?ctx=agent&id=${id}`)}
            onEdit={(id) => navigate(`/wizard?ctx=agent&edit=${id}`)}
          />
        </Card>
      </div>
    </AgentShell>
  );
}
