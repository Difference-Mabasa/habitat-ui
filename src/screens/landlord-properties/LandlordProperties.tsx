import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Chip from "@/components/Chip";
import KpiTile from "@/components/KpiTile";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import PropertyTable, {
  type PropertyTableRowData,
  type PropertyListingState,
} from "@/screens/landlord-dashboard/PropertyTable";

const ROWS: PropertyTableRowData[] = [];

const FILTERS: { id: PropertyListingState | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "LISTED", label: "Listed" },
  { id: "DRAFT", label: "Drafts" },
  { id: "UNLISTED", label: "Unlisted" },
];

const AREAS = Array.from(new Set(ROWS.map((r) => r.sub.split(",")[0]!.trim())));

export default function LandlordProperties() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PropertyListingState | "all">("all");
  const [area, setArea] = useState<string | null>(null);

  const visible = useMemo(() => {
    let rows = ROWS;
    if (filter !== "all") rows = rows.filter((r) => (r.state ?? "LISTED") === filter);
    if (area) rows = rows.filter((r) => r.sub.startsWith(area));
    return rows;
  }, [filter, area]);

  const counts = {
    all: ROWS.length,
    LISTED: ROWS.filter((r) => r.state === "LISTED").length,
    DRAFT: ROWS.filter((r) => r.state === "DRAFT").length,
    UNLISTED: ROWS.filter((r) => r.state === "UNLISTED").length,
  };
  const totalUnits = ROWS.reduce((s, r) => s + r.units, 0);
  const occupiedUnits = ROWS.reduce((s, r) => s + Math.round((r.units * r.occupancyPct) / 100), 0);
  const availableUnits = totalUnits - occupiedUnits;
  const occupancy = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const monthlyRent = ROWS.filter((r) => r.state === "LISTED").reduce((s, r) => {
    const n = Number(r.monthlyRent.replace(/[^\d]/g, "")) || 0;
    return s + n;
  }, 0);

  return (
    <LandlordShell activeId="properties">
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow={`${ROWS.length} properties · ${totalUnits} units`}
          title="Properties"
          subtitle="Every property you own, listed or drafted. Open a row for unit-level detail and payouts."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Filter</Button>
              <Button variant="ghost" size="sm" leftIcon="download">Export CSV</Button>
              <Link to="/wizard" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="plus">List a property</Button>
              </Link>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Total properties" value={`${ROWS.length}`} subText={`${totalUnits} units`} />
          <KpiTile
            label="Occupancy"
            value={`${occupancy}%`}
            valueTone={occupancy >= 90 ? "success" : "ink"}
            subText={`${occupiedUnits} of ${totalUnits} let`}
          />
          <KpiTile
            label="Available units"
            value={`${availableUnits}`}
            valueTone={availableUnits > 0 ? "warn" : "success"}
            subText={availableUnits > 0 ? "fill before month-end" : "all let"}
          />
          <KpiTile
            label="Rent · listed only"
            value={`R ${monthlyRent.toLocaleString("en-ZA")}`}
            subText="/month gross"
          />
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <Tabs
            tabs={FILTERS.map((f) => ({
              id: f.id,
              label: f.label,
              count: (counts as Record<string, number>)[f.id],
            }))}
            value={filter}
            onChange={(id) => setFilter(id as PropertyListingState | "all")}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AREAS.map((a) => (
              <Chip
                key={a}
                active={area === a}
                leftIcon="pin"
                onClick={() => setArea(area === a ? null : a)}
              >
                {a}
              </Chip>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <Card padding={32}>
            <EmptyState
              icon="home"
              title="No properties in this filter"
              description="Try another status or area, or list a new property."
              actions={
                <Link to="/wizard" style={{ textDecoration: "none" }}>
                  <Button variant="accent">List a property</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <Card padding={0} style={{ overflow: "hidden" }}>
            <PropertyTable
              rows={visible}
              onOpen={(id) => navigate(`/property?ctx=landlord&id=${id}`)}
              onEdit={(id) => navigate(`/wizard?edit=${id}`)}
            />
          </Card>
        )}
      </div>
    </LandlordShell>
  );
}
