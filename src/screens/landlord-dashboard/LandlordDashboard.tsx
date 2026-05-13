import { Link, useNavigate } from "react-router-dom";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import KpiTile from "@/components/KpiTile";
import LandlordShell from "@/components/LandlordShell";
import PropertyTable, { type PropertyTableRowData } from "./PropertyTable";
import ApplicationPipeline, { type PipelineColumn } from "./ApplicationPipeline";

const PROPERTY_ROWS: PropertyTableRowData[] = [];

const PIPELINE_COLUMNS: PipelineColumn[] = [
  { title: "New", count: 0, items: [] },
  { title: "Vetting", count: 0, items: [] },
  { title: "Interview", count: 0, items: [] },
  { title: "Lease", count: 0, items: [] },
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
              Good morning
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
          <KpiTile label="Monthly rent" value="R 0" />
          <KpiTile label="Occupancy" value="—" />
          <KpiTile label="Open applications" value="0" />
          <KpiTile label="Outstanding" value="R 0" />
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
                0 properties · 0 units
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
          {PROPERTY_ROWS.length === 0 ? (
            <EmptyState
              icon="home"
              title="No properties yet"
              description="Your properties will appear here once you list one."
              actions={
                <Link to="/wizard" style={{ textDecoration: "none" }}>
                  <Button variant="accent" leftIcon="plus">
                    List a property
                  </Button>
                </Link>
              }
            />
          ) : (
            <PropertyTable
              rows={PROPERTY_ROWS}
              onOpen={(id) => navigate(`/property?ctx=landlord&id=${id}`)}
              onEdit={(id) => navigate(`/wizard?edit=${id}`)}
            />
          )}
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
