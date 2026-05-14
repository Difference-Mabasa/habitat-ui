import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Photo from "@/components/Photo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Alert from "@/components/Alert";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import {
  createApplicationsApi,
  type ApplicationResponse,
  type ApplicationStatus,
  type EmploymentStatus,
} from "@/lib/api/applications";
import ApplicationStatusTimeline from "./ApplicationStatusTimeline";

const EMPLOYMENT_LABEL: Record<EmploymentStatus, string> = {
  EMPLOYED: "Employed",
  SELF_EMPLOYED: "Self-employed",
  STUDENT: "Student",
  PENSIONER: "Pensioner",
  UNEMPLOYED: "Unemployed",
  OTHER: "Other",
};

interface StatusMeta {
  label: string;
  tone: BadgeTone;
  /** Index in the 4-stage timeline (Submitted/Vetting/Approved/Lease). */
  stage: number;
  declined?: boolean;
}

const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  SUBMITTED:                { label: "Submitted",        tone: "neutral", stage: 0 },
  AWAITING_DOCUMENTS:       { label: "Awaiting docs",    tone: "warn",    stage: 0 },
  DOCUMENTS_SUBMITTED:      { label: "Docs uploaded",    tone: "neutral",    stage: 1 },
  UNDER_REVIEW:             { label: "Under review",     tone: "neutral",    stage: 1 },
  ON_HOLD:                  { label: "On hold",          tone: "warn",    stage: 1 },
  APPROVED:                 { label: "Approved",         tone: "success", stage: 2 },
  INVOICE_SENT:             { label: "Invoice sent",     tone: "accent",  stage: 2 },
  DEPOSIT_PAID:             { label: "Deposit paid",     tone: "success", stage: 2 },
  LEASE_GENERATED:          { label: "Lease ready",      tone: "accent",  stage: 3 },
  LEASE_PENDING_SIGNATURES: { label: "Awaiting signatures", tone: "warn", stage: 3 },
  COMPLETED:                { label: "Completed",        tone: "success", stage: 3 },
  REJECTED:                 { label: "Declined",         tone: "danger",  stage: 1, declined: true },
  WITHDRAWN:                { label: "Withdrawn",        tone: "neutral", stage: 0, declined: true },
  EXPIRED:                  { label: "Expired",          tone: "neutral", stage: 0, declined: true },
};

function formatAppliedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function formatRent(price: number | null): string {
  if (price == null) return "R —";
  return `R ${Math.round(price).toLocaleString("en-ZA")}`;
}

export default function MyApplications() {
  const session = useSession();
  const api = useMemo(() => createApplicationsApi(session.client), [session.client]);
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api
      .listMine()
      .then((rows) => {
        if (cancelled) return;
        setApps(rows);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load your applications.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  return (
    <TenantShell activeId="applications">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>You</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 6px",
          }}
        >
          My applications
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 32px" }}>
          {loading
            ? "Loading…"
            : `${apps.length} ${apps.length === 1 ? "application" : "applications"} · landlords typically respond within 48 hours.`}
        </p>

        {loading ? (
          <LoadingState rows={3} />
        ) : error ? (
          <EmptyState
            icon="info"
            title="Couldn't load applications"
            description={error}
          />
        ) : apps.length === 0 ? (
          <EmptyState
            icon="paper"
            title="No applications yet"
            description="Submitted applications appear here. Browse listings to apply for one."
            actions={
              <Link to="/browse" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="search">Browse listings</Button>
              </Link>
            }
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {apps.map((a) => (
              <ApplicationCard key={a.id} app={a} />
            ))}
          </div>
        )}
      </div>
    </TenantShell>
  );
}

function ApplicationCard({ app }: { app: ApplicationResponse }) {
  const meta = STATUS_META[app.status];
  const propertyLine =
    app.property.title ||
    [app.property.suburb, app.property.city].filter(Boolean).join(", ") ||
    "Property";
  const locationLine = [app.property.suburb, app.property.city]
    .filter(Boolean)
    .join(", ");

  const showAwaitingDocs = app.status === "AWAITING_DOCUMENTS";
  const showOnHold = app.status === "ON_HOLD";
  const showRejected = app.status === "REJECTED";
  const showInvoice = app.status === "INVOICE_SENT";
  const showLease = app.status === "LEASE_GENERATED" || app.status === "LEASE_PENDING_SIGNATURES";

  return (
    <Card padding={0} style={{ overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto" }}>
        <Photo
          ratio="auto"
          src={app.unit.coverImageUrl ?? undefined}
          label=""
          style={{ borderRadius: 0, height: "100%", minHeight: 140 }}
        />
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{propertyLine}</h3>
            <Badge tone={meta.tone}>{meta.label}</Badge>
            {app.employmentStatus ? (
              <Badge tone="neutral">{EMPLOYMENT_LABEL[app.employmentStatus]}</Badge>
            ) : null}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--slate)",
              display: "flex",
              gap: 12,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {app.unit.title ? <span>{app.unit.title}</span> : null}
            {app.unit.title && (locationLine || app.unit.price != null) ? <span>·</span> : null}
            {locationLine ? <span>{locationLine}</span> : null}
            {app.unit.price != null ? (
              <>
                <span>·</span>
                <span className="tabular">{formatRent(app.unit.price)}/mo</span>
              </>
            ) : null}
            <span>·</span>
            <span>Applied {formatAppliedAt(app.createdAt)}</span>
          </div>

          {showAwaitingDocs ? (
            <Alert tone="warn" title="Documents requested">
              The landlord needs supporting documents before reviewing this application.
            </Alert>
          ) : showOnHold && app.decisionNote ? (
            <Alert tone="warn" title="On hold">{app.decisionNote}</Alert>
          ) : showRejected && app.decisionNote ? (
            <Alert tone="danger" title="Declined">{app.decisionNote}</Alert>
          ) : showInvoice ? (
            <Alert tone="info" title="Pay to confirm">
              Invoice issued — pay the deposit to secure the unit.
            </Alert>
          ) : null}

          <div style={{ marginTop: meta.declined || showAwaitingDocs || showInvoice ? 12 : 0 }}>
            <ApplicationStatusTimeline stage={meta.stage} declined={meta.declined} />
          </div>
        </div>
        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            justifyContent: "center",
            borderLeft: "1px solid var(--hairline)",
            minWidth: 180,
          }}
        >
          {showAwaitingDocs ? (
            <Link to="/apply/upload-documents" style={{ textDecoration: "none" }}>
              <Button
                variant="accent"
                size="sm"
                leftIcon="upload"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Upload documents
              </Button>
            </Link>
          ) : showInvoice ? (
            <Link to="/invoices" style={{ textDecoration: "none" }}>
              <Button
                variant="accent"
                size="sm"
                leftIcon="cash"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Pay invoice
              </Button>
            </Link>
          ) : showLease ? (
            <Link to="/lease" style={{ textDecoration: "none" }}>
              <Button
                variant="accent"
                size="sm"
                rightIcon="chevR"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Sign lease
              </Button>
            </Link>
          ) : (
            <Link
              to={`/property?id=${app.property.id}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="secondary"
                size="sm"
                style={{ width: "100%", justifyContent: "center" }}
              >
                View property
              </Button>
            </Link>
          )}
          <Link to="/inbox" style={{ textDecoration: "none" }}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon="chat"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Message
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
