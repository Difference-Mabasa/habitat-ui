import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
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
import Select from "@/components/Select";
import LeaseDocument, { type LeasePage } from "./LeaseDocument";

const PAGES: LeasePage[] = [
  {
    id: 4,
    title: "Rent and Deposit · Term",
    body: (
      <>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 0, marginBottom: 12 }}>4. Rent and Deposit</h3>
        <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
          The Tenant agrees to pay monthly rent of{" "}
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>R 5,400.00</span> on or before the 1st of
          each month, by EFT into the account nominated by the Landlord. A grace period of three (3) days
          applies; thereafter interest at the prescribed rate accrues on outstanding amounts.
        </p>
        <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
          The deposit, equal to one (1) month's rent (R 5,400.00), is held in an interest-bearing trust
          account in the Tenant's name as required by section 5(3)(b) of the Rental Housing Act.
        </p>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>5. Term</h3>
        <p style={{ margin: "0 0 16px", color: "var(--slate)" }}>
          This lease commences on{" "}
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>1 May 2025</span> and continues for a fixed
          term of twelve (12) months, ending 30 April 2026. Either party may terminate on twenty (20)
          business days' written notice without penalty, in accordance with the Consumer Protection Act.
        </p>
        <div
          style={{
            padding: 16,
            border: "1px solid var(--accent)",
            background: "color-mix(in oklch, var(--accent) 6%, transparent)",
            borderRadius: 8,
            marginTop: 24,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent)",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Initial here
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                width: 80,
                height: 36,
                border: "1px dashed var(--hairline-strong)",
                borderRadius: 4,
                background: "var(--surface)",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                color: "var(--slate)",
              }}
            >
              Tap to initial
            </div>
            <span style={{ fontSize: 11, color: "var(--slate)" }}>
              Acknowledging clauses 4 and 5 above.
            </span>
          </div>
        </div>
      </>
    ),
  },
];

type Stage = "template" | "review" | "sign" | "decline";

export default function Lease() {
  const [stage, setStage] = useState<Stage>("review");
  const [otp, setOtp] = useState("");
  const [template, setTemplate] = useState("rha_standard");
  const navigate = useNavigate();

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Eyebrow>Lease · LSE-2024-00482</Eyebrow>
          {stage === "decline" ? (
            <Badge tone="danger">You declined this offer</Badge>
          ) : stage === "sign" ? (
            <Badge tone="accent" leftIcon="shield">OTP signing in progress</Badge>
          ) : stage === "template" ? (
            <Badge tone="neutral">Drafting</Badge>
          ) : (
            <Badge tone="warn" leftIcon="clock">
              Awaiting your signature
            </Badge>
          )}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
          {stage === "template" ? "Pick a lease template" : stage === "decline" ? "You declined this lease" : "Review and sign your lease"}
        </h1>

        <div style={{ marginBottom: 24 }}>
          <Tabs
            tabs={[
              { id: "template", label: "1 · Template" },
              { id: "review", label: "2 · Review" },
              { id: "sign", label: "3 · Sign (OTP)" },
              { id: "decline", label: "× Decline" },
            ]}
            value={stage}
            onChange={(id) => setStage(id as Stage)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", gap: 32 }}>
          {/* MAIN COLUMN */}
          {stage === "template" ? (
            <Card padding={32}>
              <Eyebrow style={{ marginBottom: 12 }}>Choose a template</Eyebrow>
              <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 20, maxWidth: 560 }}>
                Habitat ships three SA-law lease templates. Pick the one that matches your arrangement —
                you can still negotiate specific clauses with the landlord.
              </p>
              <FormField label="Template" helper="Used to generate the draft on the right.">
                <Select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  options={[
                    { value: "rha_standard", label: "Rental Housing Act · Standard 12-month" },
                    { value: "rha_six_month", label: "Rental Housing Act · 6-month flexi" },
                    { value: "rha_room", label: "Single room · simplified lease" },
                  ]}
                />
              </FormField>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
                {[
                  ["12-month standard", "Fixed term, 20-day notice, deposit in trust."],
                  ["6-month flexi", "Shorter fixed term, escalation negotiable."],
                  ["Single-room simplified", "For backrooms / outbuildings, shorter & plainer."],
                ].map(([title, body]) => (
                  <Card key={title} padding={14}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
                    <p style={{ fontSize: 12, color: "var(--slate)", margin: "6px 0 0", lineHeight: 1.5 }}>{body}</p>
                  </Card>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="accent" rightIcon="chevR" onClick={() => setStage("review")}>
                  Generate draft
                </Button>
              </div>
            </Card>
          ) : stage === "decline" ? (
            <Card padding={32}>
              <Alert tone="danger" title="You declined this lease">
                The offer is now closed. The landlord has been notified. The unit will be re-offered to the
                next applicant in the queue. You can browse similar spots, or message Thandi if this was a
                mistake.
              </Alert>
              <div style={{ marginTop: 24 }}>
                <Eyebrow style={{ marginBottom: 10 }}>Reason you gave</Eyebrow>
                <Textarea
                  rows={4}
                  defaultValue="Took a different unit closer to work — apologies for the late decline."
                  readOnly
                />
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Link to="/inbox" style={{ textDecoration: "none" }}>
                  <Button variant="ghost" leftIcon="chat">Message Thandi</Button>
                </Link>
                <Button variant="secondary" leftIcon="search" onClick={() => setStage("review")}>
                  Undo — re-open lease
                </Button>
              </div>
            </Card>
          ) : (
            <Card padding={0} style={{ overflow: "hidden" }}>
              <LeaseDocument
                title="Residential Lease Agreement · Studio · Melville"
                pages={PAGES}
                totalPages={11}
                initialPage={0}
              />
            </Card>
          )}

          {/* SIDEBAR */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 16 }}>Lease summary</Eyebrow>
              <KeyValueRow label="Property" value="Studio · Melville" size="sm" />
              <KeyValueRow label="Landlord" value="Thandi Mokoena" size="sm" />
              <KeyValueRow label="Term" value="12 months" size="sm" />
              <KeyValueRow label="Start" value="1 May 2025" size="sm" />
              <KeyValueRow label="Rent" value="R 5,400 / mo" size="sm" />
              <KeyValueRow label="Deposit" value="R 5,400" size="sm" />
              <KeyValueRow
                label="Template"
                value={
                  <span className="mono">
                    {template === "rha_six_month"
                      ? "RHA · 6-month"
                      : template === "rha_room"
                        ? "RHA · room"
                        : "RHA · standard"}
                  </span>
                }
                size="sm"
                divider
              />
            </Card>

            {/* Signatures + OTP */}
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Signatures (dual OTP)</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name="Thandi Mokoena" size="sm" tone="neutral" />
                  <div>
                    <div style={{ fontSize: 13 }}>Thandi (landlord)</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--slate)" }}>
                      OTP · 14 May 09:42
                    </div>
                  </div>
                </div>
                <Badge tone="success" leftIcon="check">Signed</Badge>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name="Sipho Dlamini" size="sm" tone="neutral" />
                  <div>
                    <div style={{ fontSize: 13 }}>You</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--slate)" }}>
                      OTP sent to +27 82 ••• 4421
                    </div>
                  </div>
                </div>
                <Badge tone={stage === "sign" ? "accent" : "warn"}>{stage === "sign" ? "Verifying" : "Pending"}</Badge>
              </div>

              {stage === "sign" ? (
                <div style={{ marginTop: 16 }}>
                  <FormField label="Enter 6-digit code" helper="Resend in 0:47">
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      placeholder="••••••"
                      className="mono"
                      style={{ letterSpacing: "0.4em", fontSize: 18, height: 48, textAlign: "center" }}
                    />
                  </FormField>
                  <Button
                    variant="accent"
                    leftIcon="check"
                    disabled={otp.length < 6}
                    style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
                    onClick={() => navigate("/payment-result")}
                  >
                    Confirm signature
                  </Button>
                </div>
              ) : (
                <Button
                  variant="accent"
                  leftIcon="edit"
                  style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
                  onClick={() => setStage("sign")}
                >
                  Sign all 11 pages
                </Button>
              )}

              <Link to="/lease-pdf" style={{ textDecoration: "none" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon="download"
                  style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
                >
                  Download draft PDF
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                style={{ width: "100%", justifyContent: "center", marginTop: 4, color: "var(--danger)" }}
                onClick={() => setStage("decline")}
                disabled={stage === "decline"}
              >
                Decline this lease
              </Button>
            </Card>

            <Card padding={16} style={{ background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Icon name="shield" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                  Compliant with the Rental Housing Act and CPA. Signatures are e-IDAS qualified, OTP-bound,
                  and time-stamped.
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
