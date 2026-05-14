import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import AgentShell from "@/components/AgentShell";
import { useWorkspace } from "@/lib/useWorkspace";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";
import Photo from "@/components/Photo";
import KeyValueRow from "@/components/KeyValueRow";
import InlineLink from "@/components/InlineLink";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";
import Textarea from "@/components/Textarea";
import { useSession } from "@/lib/session";
import { toast } from "@/lib/toast";
import {
  createApplicationsApi,
  type ApplicationResponse,
  type ApplicationStatus,
  type EmploymentStatus,
  type ReviewAction,
} from "@/lib/api/applications";

const STATUS_TONE: Record<ApplicationStatus, BadgeTone> = {
  SUBMITTED: "neutral",
  AWAITING_DOCUMENTS: "warn",
  DOCUMENTS_SUBMITTED: "neutral",
  UNDER_REVIEW: "neutral",
  ON_HOLD: "warn",
  APPROVED: "success",
  INVOICE_SENT: "accent",
  DEPOSIT_PAID: "success",
  LEASE_GENERATED: "accent",
  LEASE_PENDING_SIGNATURES: "warn",
  COMPLETED: "success",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
  EXPIRED: "neutral",
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  SUBMITTED: "Submitted",
  AWAITING_DOCUMENTS: "Awaiting documents",
  DOCUMENTS_SUBMITTED: "Documents uploaded",
  UNDER_REVIEW: "Under review",
  ON_HOLD: "On hold",
  APPROVED: "Approved",
  INVOICE_SENT: "Invoice sent",
  DEPOSIT_PAID: "Deposit paid",
  LEASE_GENERATED: "Lease ready",
  LEASE_PENDING_SIGNATURES: "Awaiting signatures",
  COMPLETED: "Completed",
  REJECTED: "Declined",
  WITHDRAWN: "Withdrawn",
  EXPIRED: "Expired",
};

const EMPLOYMENT_LABEL: Record<EmploymentStatus, string> = {
  EMPLOYED: "Employed",
  SELF_EMPLOYED: "Self-employed",
  STUDENT: "Student",
  PENSIONER: "Pensioner",
  UNEMPLOYED: "Currently looking",
  OTHER: "Other",
};

const REVIEWABLE_STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "DOCUMENTS_SUBMITTED",
  "UNDER_REVIEW",
  "ON_HOLD",
];

interface ReviewDialogState {
  action: ReviewAction;
}

type ReviewButtonVariant = "accent" | "secondary";

const REVIEW_COPY: Record<ReviewAction, { title: string; cta: string; variant: ReviewButtonVariant; placeholder: string }> = {
  APPROVE: {
    title: "Approve application",
    cta: "Approve",
    variant: "accent",
    placeholder: "Optional note to the tenant (move-in conditions, next steps, etc.)",
  },
  REJECT: {
    title: "Decline application",
    cta: "Decline",
    variant: "secondary",
    placeholder: "Tell the tenant why — this message goes back to them.",
  },
  ON_HOLD: {
    title: "Place on hold",
    cta: "Hold",
    variant: "secondary",
    placeholder: "What's the tenant waiting on? (references, additional docs, etc.)",
  },
};

function tenantName(app: ApplicationResponse): string {
  const parts = [app.tenant.firstName, app.tenant.surname].filter(Boolean) as string[];
  if (parts.length) return parts.join(" ");
  return app.tenant.email ?? "Applicant";
}

function propertyLine(app: ApplicationResponse): string {
  return (
    app.property.title ||
    [app.property.suburb, app.property.city].filter(Boolean).join(", ") ||
    "Property"
  );
}

function rentLabel(price: number | null): string {
  if (price == null) return "R —";
  return `R ${Math.round(price).toLocaleString("en-ZA")}`;
}

export default function ApplicantDetail() {
  const ws = useWorkspace();
  const Shell = ws === "agent" ? AgentShell : LandlordShell;
  const [params] = useSearchParams();
  const session = useSession();
  const api = useMemo(() => createApplicationsApi(session.client), [session.client]);

  const applicationId = params.get("id") ?? "";
  const [app, setApp] = useState<ApplicationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewDialog, setReviewDialog] = useState<ReviewDialogState | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      setError("Open this page from the applications pipeline.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api
      .get(applicationId)
      .then((row) => {
        if (cancelled) return;
        setApp(row);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load this applicant.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, applicationId]);

  async function handleReview() {
    if (!reviewDialog || !app) return;
    setSubmitting(true);
    try {
      const next = await api.review(app.id, {
        action: reviewDialog.action,
        note: reviewNote.trim() || undefined,
      });
      setApp(next);
      setReviewDialog(null);
      setReviewNote("");
      toast.success(`${STATUS_LABEL[next.status]}.`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message ?? "Couldn't update the application.")
          : "Couldn't update the application.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function openReview(action: ReviewAction) {
    setReviewNote("");
    setReviewDialog({ action });
  }

  return (
    <Shell activeId="applications">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px 64px" }}>
        <div style={{ marginBottom: 16 }}>
          <InlineLink
            to="/landlord-dashboard"
            icon="chevL"
            iconPosition="left"
            size="sm"
            tone="slate"
          >
            Applications
          </InlineLink>
        </div>

        {loading ? (
          <LoadingState rows={5} />
        ) : error || !app ? (
          <EmptyState
            icon="paper"
            title="Couldn't load applicant"
            description={error ?? "Application not found."}
            actions={
              <Link to="/landlord-dashboard" style={{ textDecoration: "none" }}>
                <Button variant="accent">Back to dashboard</Button>
              </Link>
            }
          />
        ) : (
          <ApplicantBody
            app={app}
            onApprove={() => openReview("APPROVE")}
            onReject={() => openReview("REJECT")}
            onHold={() => openReview("ON_HOLD")}
          />
        )}

        <Modal
          open={!!reviewDialog}
          onClose={() => {
            if (!submitting) setReviewDialog(null);
          }}
          title={reviewDialog ? REVIEW_COPY[reviewDialog.action].title : ""}
        >
          {reviewDialog ? (
            <div>
              <FormField label="Note to tenant" htmlFor="review-note">
                <Textarea
                  id="review-note"
                  rows={4}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder={REVIEW_COPY[reviewDialog.action].placeholder}
                  maxLength={2000}
                />
              </FormField>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <Button
                  variant="ghost"
                  onClick={() => setReviewDialog(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant={REVIEW_COPY[reviewDialog.action].variant}
                  onClick={handleReview}
                  disabled={submitting}
                  style={
                    reviewDialog.action === "REJECT"
                      ? { background: "var(--danger-soft)", color: "var(--danger)" }
                      : undefined
                  }
                >
                  {submitting ? "Saving…" : REVIEW_COPY[reviewDialog.action].cta}
                </Button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </Shell>
  );
}

function ApplicantBody({
  app,
  onApprove,
  onReject,
  onHold,
}: {
  app: ApplicationResponse;
  onApprove: () => void;
  onReject: () => void;
  onHold: () => void;
}) {
  const reviewable = REVIEWABLE_STATUSES.includes(app.status);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 32 }}>
      <main>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <Avatar name={tenantName(app)} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>
                {tenantName(app)}
              </h1>
              <Badge tone={STATUS_TONE[app.status]}>{STATUS_LABEL[app.status]}</Badge>
              {app.employmentStatus ? (
                <Badge tone="neutral">{EMPLOYMENT_LABEL[app.employmentStatus]}</Badge>
              ) : null}
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)", display: "flex", gap: 12, flexWrap: "wrap" }}>
              {app.tenant.email ? <span>{app.tenant.email}</span> : null}
              {app.moveInDate ? (
                <>
                  <span>·</span>
                  <span>Move-in {app.moveInDate}</span>
                </>
              ) : null}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {reviewable ? (
              <>
                <Button variant="secondary" leftIcon="clock" onClick={onHold}>
                  Hold
                </Button>
                <Button variant="secondary" leftIcon="x" onClick={onReject}>
                  Decline
                </Button>
                <Button variant="accent" leftIcon="check" onClick={onApprove}>
                  Approve
                </Button>
              </>
            ) : null}
            <Link to="/inbox" style={{ textDecoration: "none" }}>
              <Button variant="secondary" leftIcon="chat">
                Message
              </Button>
            </Link>
          </div>
        </div>

        <Card padding={24} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cover note</div>
          {app.message ? (
            <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
              {app.message}
            </p>
          ) : (
            <p style={{ fontSize: 13, color: "var(--slate)", margin: 0 }}>
              The applicant didn't leave a note.
            </p>
          )}
        </Card>

        {app.decisionNote ? (
          <Card padding={24} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Icon name="paper" size={16} style={{ color: "var(--slate)" }} />
              <div style={{ fontSize: 16, fontWeight: 600 }}>Your decision note</div>
            </div>
            <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
              {app.decisionNote}
            </p>
          </Card>
        ) : null}

        <Card padding={24}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Documents</div>
          <EmptyState
            icon="doc"
            size="sm"
            title="No documents yet"
            description="Documents the tenant uploads against this application will appear here."
          />
        </Card>
      </main>

      <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card padding={20}>
          <Eyebrow style={{ marginBottom: 12 }}>Applying for</Eyebrow>
          <Photo
            ratio="16/10"
            src={app.unit.coverImageUrl ?? undefined}
            label=""
            style={{ borderRadius: 8, marginBottom: 12 }}
          />
          <div style={{ fontSize: 14, fontWeight: 600 }}>{propertyLine(app)}</div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
            {app.unit.title ?? "Unit"}
            {app.property.suburb ? ` · ${app.property.suburb}` : ""}
          </div>
          <KeyValueRow label="Rent" value={`${rentLabel(app.unit.price)} /mo`} divider size="sm" />
          {app.unit.bedrooms != null ? (
            <KeyValueRow label="Bedrooms" value={String(app.unit.bedrooms)} divider size="sm" />
          ) : null}
          {app.unit.bathrooms != null ? (
            <KeyValueRow label="Bathrooms" value={String(app.unit.bathrooms)} divider size="sm" />
          ) : null}
        </Card>
      </aside>
    </div>
  );
}
