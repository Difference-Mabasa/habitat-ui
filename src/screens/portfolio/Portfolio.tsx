import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentShell from "@/components/AgentShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import PortfolioTable, { type PortfolioRow } from "./PortfolioTable";

const ROWS: PortfolioRow[] = [];

const FILTERS = [
  { id: "all", label: "All", count: 0 },
  { id: "let", label: "Let", count: 0 },
  { id: "vacant", label: "Vacant", count: 0 },
  { id: "listing", label: "Listing", count: 0 },
  { id: "issues", label: "Issues", count: 0 },
];

export default function Portfolio() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  return (
    <AgentShell activeId="portfolio">
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Properties under your mandates"
          title="Portfolio"
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
          <KpiTile label="Total monthly rent" value="R 0" />
          <KpiTile label="Collected this month" value="R 0" />
          <KpiTile label="Outstanding" value="R 0" />
          <KpiTile label="Vacant" value="0" />
          <KpiTile label="Open viewings" value="0" />
        </div>

        <div style={{ marginBottom: 12 }}>
          <Tabs tabs={FILTERS} value={filter} onChange={setFilter} />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          {ROWS.length === 0 ? (
            <EmptyState
              icon="home"
              title="No mandates yet"
              description="Properties under your mandate appear here once you accept your first one."
            />
          ) : (
            <PortfolioTable
              rows={ROWS}
              onOpen={(id) => navigate(`/property?ctx=agent&id=${id}`)}
              onEdit={(id) => navigate(`/wizard?ctx=agent&edit=${id}`)}
            />
          )}
        </Card>
      </div>
    </AgentShell>
  );
}
