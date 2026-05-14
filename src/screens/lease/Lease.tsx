import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";
import Alert from "@/components/Alert";
import Tabs from "@/components/Tabs";
import KeyValueRow from "@/components/KeyValueRow";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { toast } from "@/lib/toast";
import {
  createLeasesApi,
  type LeaseResponse,
  type LeaseTemplate,
} from "@/lib/api/leases";
import LeaseDocument, { type LeasePage } from "./LeaseDocument";

const TEMPLATE_LABEL: Record<LeaseTemplate, string> = {
  RHA_STANDARD: "RHA · 12-month standard",
  RHA_SIX_MONTH: "RHA · 6-month flexi",
  RHA_ROOM: "RHA · room (simplified)",
};

type Stage = "review" | "sign" | "decline";

function partyName(p: { firstName: string | null; surname: string | null; email: string | null } | null): string {
  if (!p) return "—";
  const name = [p.firstName, p.surname].filter(Boolean).join(" ");
  return name || (p.email ?? "—");
}

function formatRand(amount: number | null): string {
  if (amount == null) return "R —";
  return `R ${Math.round(amount).toLocaleString("en-ZA")}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export default function Lease() {
  const [params] = useSearchParams();
  const session = useSession();
  const api = useMemo(() => createLeasesApi(session.client), [session.client]);
  const explicitId = params.get("id") ?? "";

  const [lease, setLease] = useState<LeaseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("review");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const loader = explicitId ? api.get(explicitId) : api.listMine().then((rs) => rs[0] ?? null);
    void loader
      .then((row) => {
        if (cancelled) return;
        setLease(row);
        if (row?.status === "DECLINED") setStage("decline");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load lease.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, explicitId]);

  async function handleSign() {
    if (!lease) return;
    setSubmitting(true);
    try {
      const updated = await api.sign(lease.id, { otp: otp || undefined });
      setLease(updated);
      setOtp("");
      toast.success(
        updated.status === "SIGNED"
          ? "Both parties signed · lease complete."
          : "Your signature was recorded.",
      );
      setStage("review");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message ?? "Couldn't record your signature.")
          : "Couldn't record your signature.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDecline() {
    if (!lease) return;
    setSubmitting(true);
    try {
      const updated = await api.decline(lease.id, {
        reason: declineReason.trim() || undefined,
      });
      setLease(updated);
      toast.success("Lease declined.");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message ?? "Couldn't decline the lease.")
          : "Couldn't decline the lease.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <TenantShell activeId="lease">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
          <LoadingState rows={6} />
        </div>
      </TenantShell>
    );
  }

  if (error || !lease) {
    return (
      <TenantShell activeId="lease">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
          <EmptyState
            icon="paper"
            title="No lease yet"
            description={
              error ??
              "Once your landlord approves your application and the deposit is paid, your lease will appear here."
            }
            actions={
              <Link to="/my-apps" style={{ textDecoration: "none" }}>
                <Button variant="accent">My applications</Button>
              </Link>
            }
          />
        </div>
      </TenantShell>
    );
  }

  const tenantSigned = !!lease.tenantSignedAt;
  const isSigned = lease.status === "SIGNED" || lease.status === "COMPLETED";
  const isDeclined = lease.status === "DECLINED";

  return (
    <TenantShell activeId="lease">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Eyebrow>Lease · {lease.leaseRef}</Eyebrow>
          {isDeclined ? (
            <Badge tone="danger">Declined</Badge>
          ) : isSigned ? (
            <Badge tone="success" leftIcon="check">Signed by both parties</Badge>
          ) : stage === "sign" ? (
            <Badge tone="accent" leftIcon="shield">OTP signing in progress</Badge>
          ) : (
            <Badge tone="warn" leftIcon="clock">
              {tenantSigned ? "Awaiting landlord signature" : "Awaiting your signature"}
            </Badge>
          )}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          {isDeclined ? "You declined this lease" : "Review and sign your lease"}
        </h1>

        {!isDeclined && !isSigned ? (
          <div style={{ marginBottom: 24 }}>
            <Tabs
              tabs={[
                { id: "review", label: "1 · Review" },
                { id: "sign", label: "2 · Sign (OTP)" },
                { id: "decline", label: "× Decline" },
              ]}
              value={stage}
              onChange={(id) => setStage(id as Stage)}
            />
          </div>
        ) : null}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", gap: 32 }}>
          {/* MAIN COLUMN */}
          {stage === "decline" && !isDeclined ? (
            <Card padding={32}>
              <Alert tone="warn" title="Decline this lease offer">
                The offer will close and the landlord will be notified. The unit may be re-offered to
                the next applicant.
              </Alert>
              <div style={{ marginTop: 20 }}>
                <FormField label="Reason (optional)" htmlFor="decline-reason">
                  <Textarea
                    id="decline-reason"
                    rows={4}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Help the landlord understand — totally optional."
                    maxLength={2000}
                  />
                </FormField>
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button
                  variant="ghost"
                  onClick={() => setStage("review")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDecline}
                  disabled={submitting}
                  style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
                >
                  {submitting ? "Declining…" : "Decline lease"}
                </Button>
              </div>
            </Card>
          ) : isDeclined ? (
            <Card padding={32}>
              <Alert tone="danger" title="You declined this lease">
                The offer is closed. The landlord has been notified.
              </Alert>
              {lease.declineReason ? (
                <div style={{ marginTop: 20 }}>
                  <Eyebrow style={{ marginBottom: 8 }}>Reason you gave</Eyebrow>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, lineHeight: 1.6 }}>
                    {lease.declineReason}
                  </p>
                </div>
              ) : null}
              <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Link to="/browse" style={{ textDecoration: "none" }}>
                  <Button variant="accent" leftIcon="search">Browse other spots</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card padding={0} style={{ overflow: "hidden" }}>
              <LeaseDocument
                title="Residential Lease Agreement"
                pages={buildPages(lease)}
                totalPages={buildPages(lease).length}
                initialPage={0}
              />
            </Card>
          )}

          {/* SIDEBAR */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 16 }}>Lease summary</Eyebrow>
              <KeyValueRow
                label="Property"
                value={lease.property.title ?? "—"}
                size="sm"
              />
              <KeyValueRow
                label="Unit"
                value={lease.unit.title ?? "—"}
                size="sm"
                divider
              />
              <KeyValueRow
                label="Landlord"
                value={partyName(lease.landlord)}
                size="sm"
                divider
              />
              <KeyValueRow
                label="Term"
                value={`${lease.termMonths} months`}
                size="sm"
                divider
              />
              <KeyValueRow
                label="Start"
                value={formatDate(lease.startDate)}
                size="sm"
                divider
              />
              <KeyValueRow
                label="Rent"
                value={`${formatRand(lease.monthlyRent)} / mo`}
                size="sm"
                divider
              />
              <KeyValueRow
                label="Deposit"
                value={formatRand(lease.deposit)}
                size="sm"
                divider
              />
              <KeyValueRow
                label="Template"
                value={<span className="mono">{TEMPLATE_LABEL[lease.template]}</span>}
                size="sm"
                divider
              />
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Signatures (dual OTP)</Eyebrow>
              <SignatureRow
                role="Landlord"
                name={partyName(lease.landlord)}
                signedAt={lease.landlordSignedAt}
              />
              <SignatureRow
                role="You"
                name={partyName(lease.tenant)}
                signedAt={lease.tenantSignedAt}
                divider
                pending={!tenantSigned && stage === "sign"}
              />

              {isSigned ? (
                <div style={{ marginTop: 16 }}>
                  <Alert tone="success" title="Lease signed">
                    Both parties signed. Move-in steps will follow shortly.
                  </Alert>
                </div>
              ) : !tenantSigned ? (
                stage === "sign" ? (
                  <div style={{ marginTop: 16 }}>
                    <FormField label="Enter 6-digit OTP" helper="(mock — any 6 digits accepted)">
                      <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        placeholder="••••••"
                        className="mono"
                        style={{ letterSpacing: "0.4em", fontSize: 18, height: 48, textAlign: "center" }}
                      />
                    </FormField>
                    <Button
                      variant="accent"
                      leftIcon="check"
                      disabled={otp.length < 6 || submitting}
                      style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
                      onClick={handleSign}
                    >
                      {submitting ? "Signing…" : "Confirm signature"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="accent"
                    leftIcon="edit"
                    style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
                    onClick={() => setStage("sign")}
                    disabled={isDeclined}
                  >
                    Sign lease
                  </Button>
                )
              ) : (
                <div style={{ marginTop: 16 }}>
                  <Alert tone="warn" title="Waiting on landlord">
                    Your signature is recorded. The landlord still has to sign.
                  </Alert>
                </div>
              )}

              {!isSigned && !isDeclined ? (
                <Button
                  variant="ghost"
                  size="sm"
                  style={{ width: "100%", justifyContent: "center", marginTop: 8, color: "var(--danger)" }}
                  onClick={() => setStage("decline")}
                >
                  Decline this lease
                </Button>
              ) : null}
            </Card>

            <Card padding={16} style={{ background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Icon name="shield" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                  Compliant with the Rental Housing Act and CPA. Signatures are time-stamped and
                  bound to the OTP delivered to your registered phone.
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </TenantShell>
  );
}

function SignatureRow({
  role,
  name,
  signedAt,
  divider,
  pending,
}: {
  role: string;
  name: string;
  signedAt: string | null;
  divider?: boolean;
  pending?: boolean;
}) {
  const signed = !!signedAt;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderTop: divider ? "1px solid var(--hairline)" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={name} size="sm" tone={signed ? "accent" : "neutral"} />
        <div>
          <div style={{ fontSize: 13 }}>{role}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--slate)" }}>
            {signed
              ? `Signed ${formatDate(signedAt)}`
              : pending
                ? "Verifying…"
                : name}
          </div>
        </div>
      </div>
      <Badge tone={signed ? "success" : pending ? "accent" : "warn"}>
        {signed ? "Signed" : pending ? "Verifying" : "Pending"}
      </Badge>
    </div>
  );
}

function buildPages(lease: LeaseResponse): LeasePage[] {
  const start = formatDate(lease.startDate);
  const rent = formatRand(lease.monthlyRent);
  const deposit = formatRand(lease.deposit);
  const propertyAddress = [
    lease.property.addressLine,
    lease.property.suburb,
    lease.property.city,
    lease.property.postalCode,
  ]
    .filter(Boolean)
    .join(", ") || lease.property.title || "—";

  return [
    {
      id: 1,
      title: "Parties · Premises",
      body: (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>1. Parties</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            This Residential Lease Agreement is entered into between{" "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{partyName(lease.landlord)}</span>{" "}
            (the &ldquo;Landlord&rdquo;) and{" "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{partyName(lease.tenant)}</span>{" "}
            (the &ldquo;Tenant&rdquo;).
          </p>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>2. Premises</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            The Landlord lets to the Tenant the premises known as{" "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>
              {lease.unit.title ? `${lease.unit.title}, ` : ""}{propertyAddress}
            </span>{" "}
            (the &ldquo;Premises&rdquo;), to be used by the Tenant as a private residence only.
          </p>
        </>
      ),
    },
    {
      id: 2,
      title: "Rent and Deposit · Term",
      body: (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>3. Rent</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            The Tenant agrees to pay monthly rent of{" "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{rent}</span> on or before the 1st of
            each month, by EFT into the account nominated by the Landlord. A grace period of three (3)
            days applies; thereafter interest at the prescribed rate accrues on outstanding amounts.
          </p>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>4. Deposit</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            The deposit of <span style={{ color: "var(--ink)", fontWeight: 600 }}>{deposit}</span>, equal
            to one (1) month's rent, is held in an interest-bearing trust account in the Tenant's name
            as required by section 5(3)(b) of the Rental Housing Act.
          </p>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>5. Term</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            This lease commences on{" "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{start}</span> and continues for a
            fixed term of {lease.termMonths} months. Either party may terminate on twenty (20) business
            days' written notice without penalty, in accordance with the Consumer Protection Act.
          </p>
        </>
      ),
    },
    {
      id: 3,
      title: "Tenant obligations",
      body: (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>6. Tenant obligations</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            The Tenant shall keep the Premises in good order, pay all utility charges metered separately,
            and not sublet without the Landlord's written consent. Routine maintenance below R 500 per
            event remains the Tenant's responsibility.
          </p>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>7. Landlord obligations</h3>
          <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
            The Landlord shall keep the structure, plumbing, electrical and gas installations in working
            order and shall not enter the Premises without 24 hours' notice except in emergencies.
          </p>
        </>
      ),
    },
  ];
}
