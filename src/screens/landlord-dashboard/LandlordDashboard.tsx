import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import KpiTile from "@/components/KpiTile";
import LandlordShell from "@/components/LandlordShell";
import { useSession } from "@/lib/session";
import {
  createApplicationsApi,
  type ApplicationResponse,
} from "@/lib/api/applications";
import PropertyTable, { type PropertyTableRowData } from "./PropertyTable";
import ApplicationPipeline, { type PipelineColumn } from "./ApplicationPipeline";

const PROPERTY_ROWS: PropertyTableRowData[] = [];

const NEW_STATUSES = new Set(["SUBMITTED", "AWAITING_DOCUMENTS"]);
const VETTING_STATUSES = new Set([
  "DOCUMENTS_SUBMITTED",
  "UNDER_REVIEW",
  "ON_HOLD",
]);
const INTERVIEW_STATUSES = new Set(["APPROVED", "INVOICE_SENT", "DEPOSIT_PAID"]);
const LEASE_STATUSES = new Set([
  "LEASE_GENERATED",
  "LEASE_PENDING_SIGNATURES",
  "COMPLETED",
]);

function tenantName(app: ApplicationResponse): string {
  const parts = [app.tenant.firstName, app.tenant.surname].filter(Boolean) as string[];
  if (parts.length) return parts.join(" ");
  return app.tenant.email ?? "Applicant";
}

function unitLine(app: ApplicationResponse): string {
  const bits = [app.property.title, app.unit.title].filter(Boolean) as string[];
  return bits.join(" · ");
}

function bucketise(apps: ApplicationResponse[]): PipelineColumn[] {
  const cols: Record<"new" | "vetting" | "interview" | "lease", ApplicationResponse[]> = {
    new: [],
    vetting: [],
    interview: [],
    lease: [],
  };
  for (const a of apps) {
    if (NEW_STATUSES.has(a.status)) cols.new.push(a);
    else if (VETTING_STATUSES.has(a.status)) cols.vetting.push(a);
    else if (INTERVIEW_STATUSES.has(a.status)) cols.interview.push(a);
    else if (LEASE_STATUSES.has(a.status)) cols.lease.push(a);
  }
  const toCol = (title: string, rows: ApplicationResponse[]): PipelineColumn => ({
    title,
    count: rows.length,
    items: rows.map((a) => ({
      id: a.id,
      name: tenantName(a),
      unit: unitLine(a),
      score: 0,
    })),
  });
  return [
    toCol("New", cols.new),
    toCol("Vetting", cols.vetting),
    toCol("Interview", cols.interview),
    toCol("Lease", cols.lease),
  ];
}

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const session = useSession();
  const api = useMemo(() => createApplicationsApi(session.client), [session.client]);
  const [inbound, setInbound] = useState<ApplicationResponse[]>([]);
  const [loadingInbound, setLoadingInbound] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingInbound(true);
    void api
      .listInbound()
      .then((rows) => {
        if (cancelled) return;
        setInbound(rows);
        setLoadingInbound(false);
      })
      .catch(() => {
        if (cancelled) return;
        setInbound([]);
        setLoadingInbound(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const pipelineColumns = useMemo(() => bucketise(inbound), [inbound]);
  const openCount = useMemo(
    () => inbound.filter((a) => !["COMPLETED", "REJECTED", "WITHDRAWN", "EXPIRED"].includes(a.status)).length,
    [inbound],
  );

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
          <KpiTile label="Open applications" value={String(openCount)} />
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
            {loadingInbound ? (
              <span style={{ fontSize: 12, color: "var(--slate)" }}>Loading…</span>
            ) : null}
          </div>
          {inbound.length === 0 && !loadingInbound ? (
            <EmptyState
              icon="paper"
              size="sm"
              title="No applications yet"
              description="Tenant applications against your properties will appear here."
            />
          ) : (
            <ApplicationPipeline
              columns={pipelineColumns}
              onOpenApplicant={(id) => navigate(`/applicant?id=${id}`)}
            />
          )}
        </section>
      </div>
    </LandlordShell>
  );
}
