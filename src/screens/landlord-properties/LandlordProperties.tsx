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

const ROWS: PropertyTableRowData[] = [
  { id: "p1", name: "Sunlit Property · Caroline", sub: "Brixton, JHB", units: 3, occupancyPct: 67, occupancyLabel: "2 of 3", monthlyRent: "R 15,400", apps: 3, state: "LISTED", source: "BY_AGENT", agent: "Naledi M.", mandate: "Full management", payoutAccount: "FNB ••3091" },
  { id: "p2", name: "Garden Cottages", sub: "Westdene, JHB", units: 4, occupancyPct: 100, occupancyLabel: "4 of 4", monthlyRent: "R 21,600", apps: 1, state: "LISTED", source: "LISTED_BY_OWNER", mandate: "Self-managed", payoutAccount: "FNB ••3091" },
  { id: "p3", name: "Auckland Studios", sub: "Auckland Park, JHB", units: 5, occupancyPct: 100, occupancyLabel: "5 of 5", monthlyRent: "R 32,500", apps: 3, state: "LISTED", source: "BY_AGENT", agent: "Lebo Properties", mandate: "Tenant find", payoutAccount: "Capitec ••4280" },
  { id: "p4", name: "Loft · Maboneng", sub: "Maboneng, JHB", units: 1, occupancyPct: 0, occupancyLabel: "0 of 1", monthlyRent: "R 7,800", apps: 0, state: "DRAFT", source: "LISTED_BY_OWNER", mandate: "Self-managed", payoutAccount: "FNB ••3091" },
  { id: "p5", name: "Backroom · Vilakazi St", sub: "Orlando West, SOW", units: 2, occupancyPct: 50, occupancyLabel: "1 of 2", monthlyRent: "R 3,450", apps: 5, state: "UNLISTED", source: "BY_AGENT", agent: "Vilakazi Property Co.", mandate: "Full management", payoutAccount: "FNB ••3091" },
  { id: "p6", name: "Garden Flatlet · Brixton", sub: "Brixton, JHB", units: 1, occupancyPct: 100, occupancyLabel: "1 of 1", monthlyRent: "R 5,800", apps: 0, state: "LISTED", source: "LISTED_BY_OWNER", mandate: "Self-managed", payoutAccount: "FNB ••3091" },
  { id: "p7", name: "Bachelor flat · Pimville", sub: "Pimville, SOW", units: 1, occupancyPct: 0, occupancyLabel: "0 of 1", monthlyRent: "R 3,950", apps: 2, state: "DRAFT", source: "LISTED_BY_OWNER", mandate: "Self-managed", payoutAccount: "FNB ••3091" },
];

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
