import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import KpiTile from "@/components/KpiTile";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import BriefCard, { type BriefCardData, type BriefStatus } from "@/components/BriefCard";

const BRIEFS: BriefCardData[] = [
  {
    id: "r1",
    tenant: "Sipho Dlamini",
    tenantInit: "SD",
    budgetMin: 3000,
    budgetMax: 4200,
    areas: ["Orlando West", "Diepkloof", "Mofolo"],
    moveIn: "by 1 Jun",
    status: "OPEN",
    body: "Working professional. Need a backroom or bachelor flat with own entrance and prepaid electricity. Quiet area preferred.",
    posted: "18m",
    proposals: 2,
  },
  {
    id: "r2",
    tenant: "Naledi Khumalo",
    tenantInit: "NK",
    budgetMin: 5500,
    budgetMax: 7500,
    areas: ["Westdene", "Auckland Park", "Brixton"],
    moveIn: "ASAP",
    status: "OPEN",
    body: "Postgrad student. Garden cottage or 1-bed flat, parking, Wi-Fi-ready. ID + payslip + Wits letter on file.",
    posted: "2h",
    proposals: 0,
  },
  {
    id: "r3",
    tenant: "Lerato Pretorius",
    tenantInit: "LP",
    budgetMin: 4000,
    budgetMax: 5800,
    areas: ["Yeoville", "Bertrams", "Bellevue East"],
    moveIn: "by 15 Jun",
    status: "OPEN",
    body: "Looking for a 1-bed with secure parking and water included. Pet (small dog) — vet papers ready.",
    posted: "4h",
    proposals: 5,
  },
  {
    id: "r4",
    tenant: "Mxolisi Ndlovu",
    tenantInit: "MN",
    budgetMin: 2800,
    budgetMax: 3500,
    areas: ["Pimville", "Klipspruit"],
    moveIn: "by 1 Jul",
    status: "MATCHED",
    body: "Backroom with own entrance. Recently matched with a Pimville unit — keeping brief open as backup.",
    posted: "Yesterday",
    proposals: 3,
  },
  {
    id: "r5",
    tenant: "Aisha Mahlangu",
    tenantInit: "AM",
    budgetMin: 6500,
    budgetMax: 9000,
    areas: ["Maboneng", "Newtown", "Braamfontein"],
    moveIn: "by 1 Jun",
    status: "FILLED",
    body: "Filled — moved into Loft at Maboneng on 14 May.",
    posted: "3d",
    proposals: 6,
  },
];

const FILTERS: { id: BriefStatus | "all"; label: string; count: number }[] = [
  { id: "all", label: "All", count: 5 },
  { id: "OPEN", label: "Open", count: 3 },
  { id: "MATCHED", label: "Matched", count: 1 },
  { id: "FILLED", label: "Filled", count: 1 },
  { id: "EXPIRED", label: "Expired", count: 0 },
];

export default function JobBoard() {
  const [filter, setFilter] = useState<BriefStatus | "all">("OPEN");
  const rows = filter === "all" ? BRIEFS : BRIEFS.filter((b) => b.status === filter);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="agent" />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Marketplace"
          title="Tenant briefs"
          subtitle="Live job board of tenants looking for a spot. Propose a match from your mandated listings — fastest agent wins the brief."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Areas & budget</Button>
              <Button variant="accent" leftIcon="plus">Saved searches</Button>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile label="Open briefs" value="3" subText="in your areas" />
          <KpiTile label="You proposed" value="4" subText="2 awaiting review" />
          <KpiTile label="Matches won · YTD" value="11" valueTone="success" subText="R 38,400 fees" />
          <KpiTile label="Avg. response" value="42 min" subText="faster than 78%" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.count }))}
            value={filter}
            onChange={(id) => setFilter(id as BriefStatus | "all")}
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon="search"
            title="No briefs match this filter"
            description="Try another status, or broaden the areas in your saved searches."
            actions={<Button variant="accent">Edit saved searches</Button>}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {rows.map((b) => (
              <BriefCard
                key={b.id}
                brief={b}
                actions={
                  b.status === "OPEN" ? (
                    <>
                      <Button variant="accent" size="sm" leftIcon="check">Propose a match</Button>
                      <Button variant="ghost" size="sm">Message tenant</Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" rightIcon="chevR">View brief</Button>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
