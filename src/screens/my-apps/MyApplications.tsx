import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Photo from "@/components/Photo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Alert from "@/components/Alert";
import Icon from "@/components/Icon";
import ApplicationStatusTimeline from "./ApplicationStatusTimeline";

type EmploymentStatus = "EMPLOYED" | "SELF_EMPLOYED" | "STUDENT" | "PENSIONER" | "UNEMPLOYED" | "OTHER";

interface ApplicationRow {
  id: string;
  property: string;
  landlord: string;
  rent: string;
  applied: string;
  stage: number;
  status: string;
  tone: BadgeTone;
  employment: EmploymentStatus;
  /** State variants the legacy backroom-ui ships. */
  variant?: "default" | "conditional" | "on_hold" | "invoice_due" | "invoice_failed";
  variantDetail?: string;
  invoiceRef?: string;
}

const EMPLOYMENT_LABEL: Record<EmploymentStatus, string> = {
  EMPLOYED: "Employed",
  SELF_EMPLOYED: "Self-employed",
  STUDENT: "Student",
  PENSIONER: "Pensioner",
  UNEMPLOYED: "Unemployed",
  OTHER: "Other",
};

const APPS: ApplicationRow[] = [
  {
    id: "a1",
    property: "Studio · Melville",
    landlord: "Thandi M.",
    rent: "R 5,400",
    applied: "12 Mar",
    stage: 3,
    status: "Lease ready",
    tone: "success",
    employment: "EMPLOYED",
    variant: "default",
  },
  {
    id: "a2",
    property: "Cottage · Norwood",
    landlord: "Pieter K.",
    rent: "R 6,200",
    applied: "10 Mar",
    stage: 2,
    status: "Conditionally approved",
    tone: "warn",
    employment: "SELF_EMPLOYED",
    variant: "conditional",
    variantDetail: "Landlord wants 6 months of bank statements (you uploaded 3) before issuing the lease.",
  },
  {
    id: "a3",
    property: "Backroom · Yeoville",
    landlord: "Nomsa Z.",
    rent: "R 3,800",
    applied: "08 Mar",
    stage: 2,
    status: "Vetting",
    tone: "accent",
    employment: "STUDENT",
    variant: "default",
  },
  {
    id: "a4",
    property: "Flatlet · Auckland Park",
    landlord: "Ravi S.",
    rent: "R 4,950",
    applied: "02 Mar",
    stage: 1,
    status: "On hold",
    tone: "warn",
    employment: "UNEMPLOYED",
    variant: "on_hold",
    variantDetail: "Paused 14 Mar — Ravi is reviewing 8 applicants together. Decision expected by 25 Mar.",
  },
  {
    id: "a5",
    property: "Garden Flat · Brixton",
    landlord: "Lerato N.",
    rent: "R 5,800",
    applied: "06 Mar",
    stage: 3,
    status: "Invoice due",
    tone: "accent",
    employment: "EMPLOYED",
    variant: "invoice_due",
    variantDetail: "Pay R 5,800 deposit + first-month rent by 20 May to confirm the lease.",
    invoiceRef: "HB-INV-04332-NB",
  },
  {
    id: "a6",
    property: "Studio · Brixton",
    landlord: "—",
    rent: "R 4,400",
    applied: "26 Feb",
    stage: 0,
    status: "Declined",
    tone: "warn",
    employment: "PENSIONER",
    variant: "default",
  },
  {
    id: "a7",
    property: "Cottage · Linden",
    landlord: "Susan B.",
    rent: "R 7,200",
    applied: "04 Mar",
    stage: 3,
    status: "Payment failed",
    tone: "danger",
    employment: "EMPLOYED",
    variant: "invoice_failed",
    variantDetail: "Card declined on 14 May. Retry by 21 May or the lease offer expires.",
    invoiceRef: "HB-INV-04280-SB",
  },
];

export default function MyApplications() {
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
          {APPS.length} active · landlords typically respond within 48 hours.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {APPS.map((a) => (
            <Card key={a.id} padding={0} style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto" }}>
                <Photo ratio="auto" label="" style={{ borderRadius: 0, height: "100%", minHeight: 140 }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{a.property}</h3>
                    <Badge tone={a.tone}>{a.status}</Badge>
                    <Badge tone="neutral">{EMPLOYMENT_LABEL[a.employment]}</Badge>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--slate)",
                      display: "flex",
                      gap: 12,
                      marginBottom: a.variantDetail ? 12 : 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>Landlord: {a.landlord}</span>
                    <span>·</span>
                    <span className="tabular">{a.rent}/mo</span>
                    <span>·</span>
                    <span>Applied {a.applied}</span>
                    {a.invoiceRef ? (
                      <>
                        <span>·</span>
                        <span className="mono">{a.invoiceRef}</span>
                      </>
                    ) : null}
                  </div>

                  {a.variant === "conditional" ? (
                    <Alert tone="warn" title="Documents requested">
                      {a.variantDetail}
                    </Alert>
                  ) : a.variant === "on_hold" ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: 12,
                        background: "var(--warn-soft)",
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    >
                      <Icon name="clock" size={16} style={{ color: "var(--warn)", flexShrink: 0, marginTop: 2 }} />
                      <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>{a.variantDetail}</div>
                    </div>
                  ) : a.variant === "invoice_due" || a.variant === "invoice_failed" ? (
                    <Alert tone={a.variant === "invoice_failed" ? "danger" : "info"} title={a.variant === "invoice_failed" ? "Payment failed — retry" : "Pay to confirm"}>
                      {a.variantDetail}
                    </Alert>
                  ) : null}

                  <div style={{ marginTop: a.variantDetail ? 12 : 0 }}>
                    <ApplicationStatusTimeline stage={a.stage} declined={a.status === "Declined"} />
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
                  {a.variant === "invoice_due" ? (
                    <>
                      <Link to="/payment" style={{ textDecoration: "none" }}>
                        <Button variant="accent" size="sm" leftIcon="cash" style={{ width: "100%", justifyContent: "center" }}>Pay invoice</Button>
                      </Link>
                      <Link to="/invoice" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" leftIcon="download" style={{ width: "100%", justifyContent: "center" }}>Download PDF</Button>
                      </Link>
                    </>
                  ) : a.variant === "invoice_failed" ? (
                    <>
                      <Link to="/payment" style={{ textDecoration: "none" }}>
                        <Button variant="accent" size="sm" leftIcon="refresh" style={{ width: "100%", justifyContent: "center" }}>Retry payment</Button>
                      </Link>
                      <Link to="/payment" style={{ textDecoration: "none" }}>
                        <Button variant="secondary" size="sm" style={{ width: "100%", justifyContent: "center" }}>Use another card</Button>
                      </Link>
                    </>
                  ) : a.variant === "conditional" ? (
                    <>
                      <Link to="/apply?step=2" style={{ textDecoration: "none" }}>
                        <Button variant="accent" size="sm" leftIcon="upload" style={{ width: "100%", justifyContent: "center" }}>Upload statements</Button>
                      </Link>
                      <Link to="/inbox" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>Message landlord</Button>
                      </Link>
                    </>
                  ) : a.variant === "on_hold" ? (
                    <>
                      <Link to="/property" style={{ textDecoration: "none" }}>
                        <Button variant="secondary" size="sm" style={{ width: "100%", justifyContent: "center" }}>View status</Button>
                      </Link>
                      <Link to="/inbox" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>Nudge landlord</Button>
                      </Link>
                    </>
                  ) : a.status === "Lease ready" ? (
                    <>
                      <Link to="/lease" style={{ textDecoration: "none" }}>
                        <Button variant="accent" size="sm" rightIcon="chevR" style={{ width: "100%", justifyContent: "center" }}>Sign lease</Button>
                      </Link>
                      <Link to="/inbox" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>Message</Button>
                      </Link>
                    </>
                  ) : a.status === "Declined" ? (
                    <>
                      <Link to="/property" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" style={{ width: "100%", justifyContent: "center" }}>View reason</Button>
                      </Link>
                      <Link to="/browse" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" leftIcon="search" style={{ width: "100%", justifyContent: "center" }}>Find similar</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/property" style={{ textDecoration: "none" }}>
                        <Button variant="secondary" size="sm" style={{ width: "100%", justifyContent: "center" }}>View status</Button>
                      </Link>
                      <Link to="/inbox" style={{ textDecoration: "none" }}>
                        <Button variant="ghost" size="sm" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>Message</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </TenantShell>
  );
}
