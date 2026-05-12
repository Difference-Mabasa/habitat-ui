import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import KpiTile from "@/components/KpiTile";
import EmptyState from "@/components/EmptyState";

type LeaseState = "active" | "expiring" | "pending" | "ended" | "declined";

interface LeaseRow {
  id: string;
  ref: string;
  tenant: string;
  tenantInit: string;
  tenantEmail: string;
  property: string;
  unit: string;
  start: string;
  end: string;
  rent: number;
  state: LeaseState;
  /** Days until expiry — undefined for non-active. */
  daysToExpiry?: number;
  escalation?: string;
  signatures: number;
  signaturesTotal: number;
}

const LEASES: LeaseRow[] = [
  {
    id: "l1",
    ref: "HB-LSE-04412",
    tenant: "Sipho Dlamini",
    tenantInit: "SD",
    tenantEmail: "sipho@discovery.co.za",
    property: "Sunlit Property · Caroline",
    unit: "Backroom B",
    start: "1 Mar 2026",
    end: "28 Feb 2027",
    rent: 4400,
    state: "active",
    daysToExpiry: 287,
    escalation: "6.0% renewal proposed",
    signatures: 2,
    signaturesTotal: 2,
  },
  {
    id: "l2",
    ref: "HB-LSE-04388",
    tenant: "Naledi Khumalo",
    tenantInit: "NK",
    tenantEmail: "naledi.k@wits.ac.za",
    property: "Garden Cottages · Westdene",
    unit: "Cottage 1",
    start: "1 Aug 2024",
    end: "31 Jul 2026",
    rent: 5800,
    state: "expiring",
    daysToExpiry: 76,
    escalation: "Renewal notice due 31 May",
    signatures: 2,
    signaturesTotal: 2,
  },
  {
    id: "l3",
    ref: "HB-LSE-04401",
    tenant: "Lerato Pretorius",
    tenantInit: "LP",
    tenantEmail: "lerato.p@gmail.com",
    property: "Sunlit Property · Caroline",
    unit: "Garden Cottage",
    start: "1 Nov 2023",
    end: "31 Oct 2026",
    rent: 6800,
    state: "expiring",
    daysToExpiry: 168,
    signatures: 2,
    signaturesTotal: 2,
  },
  {
    id: "l4",
    ref: "HB-LSE-04482",
    tenant: "Mxolisi Ndlovu",
    tenantInit: "MN",
    tenantEmail: "mxolisi.n@gmail.com",
    property: "Backroom · Vilakazi St",
    unit: "Backroom A",
    start: "1 Jun 2023",
    end: "31 May 2027",
    rent: 3800,
    state: "active",
    daysToExpiry: 379,
    signatures: 2,
    signaturesTotal: 2,
  },
  {
    id: "l5",
    ref: "HB-LSE-04501",
    tenant: "Aisha Mahlangu",
    tenantInit: "AM",
    tenantEmail: "aisha.m@protonmail.com",
    property: "Auckland Studios",
    unit: "Studio 3",
    start: "1 Sep 2024",
    end: "31 Aug 2026",
    rent: 4950,
    state: "expiring",
    daysToExpiry: 111,
    escalation: "5.5% renewal proposed",
    signatures: 2,
    signaturesTotal: 2,
  },
  {
    id: "l6",
    ref: "HB-LSE-04532",
    tenant: "Zinhle Maseko",
    tenantInit: "ZM",
    tenantEmail: "zinhle.m@gmail.com",
    property: "Garden Cottages · Westdene",
    unit: "Cottage 2",
    start: "1 Jun 2026 (pending)",
    end: "31 May 2027",
    rent: 5400,
    state: "pending",
    signatures: 1,
    signaturesTotal: 2,
  },
  {
    id: "l7",
    ref: "HB-LSE-04488",
    tenant: "Karabo Mokoena",
    tenantInit: "KM",
    tenantEmail: "karabo.m@yahoo.com",
    property: "Sunlit Property · Caroline",
    unit: "Garden Cottage",
    start: "1 May 2026 (pending)",
    end: "30 Apr 2027",
    rent: 6800,
    state: "pending",
    signatures: 0,
    signaturesTotal: 2,
  },
  {
    id: "l8",
    ref: "HB-LSE-04367",
    tenant: "Bongani Tshabalala",
    tenantInit: "BT",
    tenantEmail: "bongani.t@protonmail.com",
    property: "Auckland Studios",
    unit: "Studio 1",
    start: "1 Mar 2023",
    end: "29 Feb 2026",
    rent: 4400,
    state: "ended",
    signatures: 2,
    signaturesTotal: 2,
  },
  {
    id: "l9",
    ref: "HB-LSE-04555",
    tenant: "Susan Boshoff",
    tenantInit: "SB",
    tenantEmail: "susan.b@gmail.com",
    property: "Loft · Maboneng",
    unit: "Loft",
    start: "1 May 2026 (proposed)",
    end: "30 Apr 2027",
    rent: 7800,
    state: "declined",
    signatures: 0,
    signaturesTotal: 2,
  },
];

const STATE_META: Record<LeaseState, { tone: BadgeTone; label: string }> = {
  active: { tone: "success", label: "Active" },
  expiring: { tone: "warn", label: "Ending ≤180d" },
  pending: { tone: "accent", label: "Awaiting signature" },
  ended: { tone: "neutral", label: "Ended" },
  declined: { tone: "danger", label: "Tenant declined" },
};

const FILTERS: { id: LeaseState | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expiring", label: "Expiring ≤180d" },
  { id: "pending", label: "Awaiting signature" },
  { id: "ended", label: "Ended" },
  { id: "declined", label: "Declined" },
];

export default function LandlordLeases() {
  const [filter, setFilter] = useState<LeaseState | "all">("all");

  const visible = useMemo(() => {
    if (filter === "all") return LEASES;
    return LEASES.filter((l) => l.state === filter);
  }, [filter]);

  const counts = {
    all: LEASES.length,
    active: LEASES.filter((l) => l.state === "active").length,
    expiring: LEASES.filter((l) => l.state === "expiring").length,
    pending: LEASES.filter((l) => l.state === "pending").length,
    ended: LEASES.filter((l) => l.state === "ended").length,
    declined: LEASES.filter((l) => l.state === "declined").length,
  };
  const activeRent = LEASES.filter((l) => l.state === "active" || l.state === "expiring").reduce(
    (s, l) => s + l.rent,
    0,
  );

  return (
    <LandlordShell activeId="leases">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Lease documents"
          title="Leases"
          subtitle="Every signed lease across your portfolio. Use Tenants for the people view; this is the document view."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="filter">Filter</Button>
              <Button variant="ghost" size="sm" leftIcon="download">Export CSV</Button>
              <Link to="/lease" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="plus">New lease</Button>
              </Link>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <KpiTile
            label="Active leases"
            value={`${counts.active + counts.expiring}`}
            subText={`R ${activeRent.toLocaleString("en-ZA")} /mo`}
          />
          <KpiTile
            label="Expiring ≤180d"
            value={`${counts.expiring}`}
            valueTone="warn"
            subText="renewal paperwork due"
          />
          <KpiTile
            label="Awaiting signature"
            value={`${counts.pending}`}
            valueTone="accent"
            subText="OTP pending"
          />
          <KpiTile
            label="Ended · last 90d"
            value={`${counts.ended}`}
            subText="archive for SARS"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={FILTERS.map((f) => ({
              id: f.id,
              label: f.label,
              count: (counts as Record<string, number>)[f.id],
            }))}
            value={filter}
            onChange={(id) => setFilter(id as LeaseState | "all")}
          />
        </div>

        {visible.length === 0 ? (
          <Card padding={32}>
            <EmptyState
              icon="paper"
              title="No leases in this filter"
              description="Try a different state, or draft a new lease for a pending applicant."
              actions={
                <Link to="/applicant" style={{ textDecoration: "none" }}>
                  <Button variant="accent">Open applications</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <Card padding={0} style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  {["Tenant", "Unit / property", "Term", "Rent", "Signatures", "State", "Ref", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "10px 20px",
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--slate)",
                        borderBottom: "1px solid var(--hairline)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => {
                  const meta = STATE_META[l.state];
                  return (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <Link
                          to="/landlord-tenants"
                          style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10 }}
                        >
                          <Avatar name={l.tenantInit} size="md" tone="neutral" />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{l.tenant}</div>
                            <div style={{ fontSize: 11, color: "var(--slate)" }}>{l.tenantEmail}</div>
                          </div>
                        </Link>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 13 }}>
                        <div style={{ fontWeight: 500 }}>{l.unit}</div>
                        <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{l.property}</div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 12 }}>
                        <div>{l.start} —</div>
                        <div>{l.end}</div>
                        {l.daysToExpiry != null ? (
                          <div
                            style={{
                              fontSize: 11,
                              color: l.daysToExpiry <= 180 ? "var(--warn)" : "var(--slate)",
                              fontWeight: l.daysToExpiry <= 180 ? 600 : 400,
                              marginTop: 2,
                            }}
                          >
                            {l.daysToExpiry} days to expiry
                          </div>
                        ) : null}
                        {l.escalation ? (
                          <div className="mono" style={{ fontSize: 10, color: "var(--accent)", marginTop: 2 }}>
                            {l.escalation}
                          </div>
                        ) : null}
                      </td>
                      <td className="tabular" style={{ padding: "16px 20px", fontSize: 13, fontWeight: 500 }}>
                        R {l.rent.toLocaleString("en-ZA")}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 12 }}>
                        <span
                          className="tabular"
                          style={{
                            color: l.signatures === l.signaturesTotal ? "var(--success)" : "var(--warn)",
                            fontWeight: 600,
                          }}
                        >
                          {l.signatures}/{l.signaturesTotal}
                        </span>
                        <span style={{ color: "var(--slate)", marginLeft: 4 }}>signed</span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </td>
                      <td className="mono" style={{ padding: "16px 20px", fontSize: 11, color: "var(--slate)" }}>
                        {l.ref}
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          {l.state === "ended" ? (
                            <Link to="/deposit-refund" style={{ textDecoration: "none" }}>
                              <Button variant="accent" size="sm" leftIcon="cash">
                                Decide refund
                              </Button>
                            </Link>
                          ) : null}
                          <Link to="/lease-pdf" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" leftIcon="paper">PDF</Button>
                          </Link>
                          <Link to="/lease" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" rightIcon="chevR">Open</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </LandlordShell>
  );
}
