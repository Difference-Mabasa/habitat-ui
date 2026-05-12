import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Stepper from "@/components/Stepper";
import Photo from "@/components/Photo";
import KeyValueRow from "@/components/KeyValueRow";
import DocumentStatusRow from "@/components/DocumentStatusRow";
import FileUploadZone from "@/components/FileUploadZone";
import InlineLink from "@/components/InlineLink";

const STEPS = [
  { label: "About you" },
  { label: "Affordability" },
  { label: "Documents" },
  { label: "Message" },
  { label: "Review" },
];

export default function Apply() {
  const [step, setStep] = useState(2);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px 32px 80px",
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr) 320px",
          gap: 48,
        }}
      >
        {/* Left rail — stepper */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <InlineLink to="/property" icon="chevL" iconPosition="left" size="sm" tone="slate">
            Back to property
          </InlineLink>
          <Eyebrow style={{ marginTop: 24, marginBottom: 8 }}>Application</Eyebrow>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Studio · Melville
          </div>

          <Stepper
            orientation="vertical"
            currentStep={step}
            steps={STEPS}
            onStepClick={(i) => i <= step && setStep(i)}
          />

          <Card padding={16} style={{ marginTop: 24, background: "var(--surface-2)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                fontSize: 12,
                color: "var(--slate)",
              }}
            >
              <Icon name="shield" size={14} /> Why we ask
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
              Documents go straight to the landlord — encrypted, deleted after 90 days if unsuccessful.
            </div>
          </Card>
        </aside>

        {/* Center */}
        <main>
          <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
            Upload your documents
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 32px" }}>
            Three required documents. We'll check FICA and run your credit before sending to the landlord.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <DocumentStatusRow
              name="SA ID / Passport"
              status="verified"
              subText="SA_ID · matched home affairs · 28 Mar 2026"
            />
            <DocumentStatusRow
              name="Passport (non-SA citizens)"
              status="empty"
              subText="PASSPORT · optional if SA ID provided"
            />
            <DocumentStatusRow
              name="Payslips · last 3 months"
              status="uploaded"
              subText="PAYSLIPS_3M · payslip-march.pdf · 2.4 MB · +2 more"
            />
            <DocumentStatusRow
              name="Bank statements · last 3 months"
              status="empty"
              subText="BANK_STATEMENTS_3M · PDF or CSV · max 10 MB"
              active
            />
            <DocumentStatusRow
              name="Employment letter"
              status="uploaded"
              subText="EMPLOYMENT_LETTER · discovery-letter.pdf · 142 KB"
            />
            <DocumentStatusRow
              name="Proof of address"
              status="empty"
              subText="PROOF_OF_ADDRESS · bill / statement / landlord letter < 3 months"
            />
            <DocumentStatusRow
              name="Credit consent (TPN)"
              status="empty"
              subText="CREDIT_CONSENT · we won't pull your credit without this"
            />
            <DocumentStatusRow
              name="Previous landlord reference"
              status="uploaded"
              subText="LANDLORD_REFERENCE · auto-requested from Mxolisi N. · received 14 Mar"
            />
            <DocumentStatusRow
              name="Other (optional)"
              status="empty"
              subText="OTHER · anything else you want to share — pet vet papers, study letter, etc."
            />
          </div>

          <FileUploadZone
            title="Drop bank statements here"
            specsText="BANK_STATEMENTS_3M · PDF · CSV · max 10 MB · 3 months"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <Button
              variant="ghost"
              leftIcon="chevL"
              onClick={() => setStep(Math.max(0, step - 1))}
            >
              Back
            </Button>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary">Save draft</Button>
              <Button
                variant="accent"
                rightIcon="arrR"
                onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              >
                Continue
              </Button>
            </div>
          </div>
        </main>

        {/* Right rail — listing recap */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <Photo ratio="16/10" label="studio · melville.jpg" style={{ borderRadius: 0 }} />
            <div style={{ padding: 16 }}>
              <Eyebrow style={{ marginBottom: 6 }}>Applying for</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                Studio Flatlet · Melville
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                32 m² · 1 bed · 1 bath
              </div>
              <KeyValueRow label="Rent" value="R 5,400" divider size="sm" />
              <KeyValueRow label="Deposit" value="R 5,400" divider size="sm" />
              <KeyValueRow label="Application fee" value="Free" divider size="sm" />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
