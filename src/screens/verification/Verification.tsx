import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Alert from "@/components/Alert";
import Stepper, { type StepperStep } from "@/components/Stepper";
import FileUploadZone from "@/components/FileUploadZone";

const STEPS: StepperStep[] = [
  { label: "Identity", state: "done", detail: "ID 8801235•••083 · matched home affairs" },
  { label: "Selfie liveness", state: "done", detail: "98% match · processed in 3s" },
  { label: "Proof of address", state: "active", detail: "Upload a bill or statement (< 3 months)" },
  { label: "Bank account", state: "todo", detail: "FNB · last 3 digits 114" },
  { label: "Reference check", state: "todo", detail: "Previous landlord + employer" },
];

const VALID_DOCS = ["City of Joburg bill", "FNB statement", "Landlord letter"];

export default function Verification() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 32px" }}>
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
              Verified tenants are <strong>4× more likely</strong> to be approved on first application.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Icon name="shield" size={18} style={{ color: "var(--success)" }} />
            <div className="mono" style={{ fontSize: 12 }}>
              End-to-end encrypted · POPIA compliant
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 28 }}>
          {/* Steps rail */}
          <Card padding={4}>
            <Stepper orientation="vertical" steps={STEPS} />
          </Card>

          {/* Active step content */}
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
              <Button variant="accent" rightIcon="arrR">
                Continue to bank
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
