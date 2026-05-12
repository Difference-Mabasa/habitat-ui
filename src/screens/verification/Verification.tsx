import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Alert from "@/components/Alert";
import Badge, { type BadgeTone } from "@/components/Badge";
import Stepper, { type StepperStep } from "@/components/Stepper";
import FileUploadZone from "@/components/FileUploadZone";
import Toggle from "@/components/Toggle";
import KeyValueRow from "@/components/KeyValueRow";

const STEPS: StepperStep[] = [
  { label: "Identity", state: "done", detail: "ID 8801235•••083 · matched home affairs" },
  { label: "Selfie liveness", state: "done", detail: "98% match · processed in 3s" },
  { label: "Proof of address", state: "active", detail: "Upload a bill or statement (< 3 months)" },
  { label: "Bank account", state: "todo", detail: "FNB · last 3 digits 114" },
  { label: "Reference check", state: "todo", detail: "Previous landlord + employer" },
];

interface DocStatusRow {
  type: string;
  label: string;
  detail: string;
  state: "verified" | "pending" | "needs_action" | "todo";
  icon: IconName;
}

const DOC_STATUS: DocStatusRow[] = [
  { type: "SA_ID", label: "Identity (SA ID)", detail: "Smart card · matched home affairs · 28 Mar 2026", state: "verified", icon: "shield" },
  { type: "SELFIE", label: "Selfie liveness", detail: "98% match score · processed in 3s", state: "verified", icon: "user" },
  { type: "POA", label: "Proof of address", detail: "Awaiting upload — bill or statement < 3 months", state: "needs_action", icon: "home" },
  { type: "BANK", label: "Bank account", detail: "Pending verification — FNB ••114", state: "pending", icon: "cash" },
  { type: "EMPLOYMENT", label: "Employment", detail: "Letter from Discovery Health · uploaded 28 Mar", state: "pending", icon: "users" },
  { type: "CREDIT", label: "Credit (TPN)", detail: "Consent required — opens TPN credit history", state: "todo", icon: "trend" },
  { type: "REFERENCES", label: "Previous landlord", detail: "Reference request not yet sent", state: "todo", icon: "key" },
];

const STATUS_META: Record<DocStatusRow["state"], { tone: BadgeTone; label: string; iconColor: string }> = {
  verified: { tone: "success", label: "Verified", iconColor: "var(--success)" },
  pending: { tone: "accent", label: "Pending", iconColor: "var(--accent)" },
  needs_action: { tone: "warn", label: "Action needed", iconColor: "var(--warn)" },
  todo: { tone: "neutral", label: "Not started", iconColor: "var(--slate)" },
};

const VALID_DOCS = ["City of Joburg bill", "FNB statement", "Landlord letter"];

export default function Verification() {
  const [creditConsent, setCreditConsent] = useState(false);
  const [tpnConsent, setTpnConsent] = useState(false);
  const verifiedCount = DOC_STATUS.filter((d) => d.state === "verified").length;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
            gap: 24,
          }}
        >
          <div>
            <Eyebrow>FICA / POPIA verification</Eyebrow>
            <h1 className="display" style={{ fontSize: 56, margin: "8px 0 0" }}>
              VERIFY YOUR PROFILE
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", marginTop: 8 }}>
              Verified tenants are <strong>4× more likely</strong> to be approved on first application. {verifiedCount} of {DOC_STATUS.length} checks complete.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Icon name="shield" size={18} style={{ color: "var(--success)" }} />
            <div className="mono" style={{ fontSize: 12 }}>
              End-to-end encrypted · POPIA compliant
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28 }}>
          {/* Left rail: stepper + status grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={4}>
              <Stepper orientation="vertical" steps={STEPS} />
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>All checks</Eyebrow>
              {DOC_STATUS.map((d, i) => {
                const meta = STATUS_META[d.state];
                return (
                  <div
                    key={d.type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                    }}
                  >
                    <Icon name={d.icon} size={16} style={{ color: meta.iconColor, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 1 }}>{d.detail}</div>
                    </div>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* Right column: active step + consent */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={32}>
              <Eyebrow>Step 3 of 5</Eyebrow>
              <h2 className="display" style={{ fontSize: 36, margin: "8px 0" }}>
                UPLOAD PROOF OF ADDRESS
              </h2>
              <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 24 }}>
                A municipal bill, bank statement, or signed letter from your landlord. Must be dated within
                the last 3 months.
              </p>

              <FileUploadZone
                title="Drop your file here"
                helpText="or click to browse · PDF / JPG / PNG · max 10 MB"
                buttonLabel="Choose file"
              />

              <div style={{ marginTop: 24 }}>
                <Eyebrow style={{ marginBottom: 10 }}>What works</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {VALID_DOCS.map((doc) => (
                    <div
                      key={doc}
                      style={{
                        padding: 14,
                        border: "1px solid var(--hairline)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                      }}
                    >
                      <Icon name="check" size={14} style={{ color: "var(--success)" }} />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Alert tone="danger">
                    Selfies, screenshots of phones, and handwritten notes won't be accepted.
                  </Alert>
                </div>
              </div>

              <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <Button variant="ghost" leftIcon="chevL">
                  Back
                </Button>
                <Link to="/browse" style={{ textDecoration: "none" }}>
                  <Button variant="accent" rightIcon="arrR">
                    Finish &amp; browse
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Consent card: CREDIT_CONSENT + TPN */}
            <Card padding={24}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <Eyebrow style={{ marginBottom: 4 }}>Credit & TPN consent</Eyebrow>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Authorise the credit checks</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "4px 0 0", maxWidth: 480 }}>
                    Both are required by SA's Rental Housing Act before a landlord can sign you on. We never
                    pull your credit without your consent.
                  </p>
                </div>
                <Badge tone={creditConsent && tpnConsent ? "success" : "warn"}>
                  {creditConsent && tpnConsent ? "Granted" : "Required"}
                </Badge>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Card padding={14} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Toggle checked={creditConsent} onChange={(e) => setCreditConsent(e.target.checked)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Credit consent (CREDIT_CONSENT)</div>
                      <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2, lineHeight: 1.5 }}>
                        Lets Habitat run a soft credit check via Experian. Doesn't affect your score. Required
                        for affordability calculation.
                      </div>
                    </div>
                  </div>
                </Card>

                <Card padding={14} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Toggle checked={tpnConsent} onChange={(e) => setTpnConsent(e.target.checked)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>TPN consent</div>
                      <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2, lineHeight: 1.5 }}>
                        Lets Habitat read and (with your future approval) report rental payments to TPN. Good
                        tenants build a "Paying" score that landlords trust.
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
                <KeyValueRow label="Consent timestamp" value={creditConsent || tpnConsent ? "Just now" : "—"} divider={false} />
                <KeyValueRow label="Consent reference" value={<span className="mono">HB-CONS-04250-SD</span>} divider />
                <KeyValueRow label="Withdraw any time" value="From /profile → Privacy" divider />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
