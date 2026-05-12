import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import Stepper from "@/components/Stepper";
import FileUploadZone from "@/components/FileUploadZone";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import KeyValueRow from "@/components/KeyValueRow";

const STEPS = [
  { label: "ID type", detail: "Pick your document" },
  { label: "Photo of document", detail: "Both sides if applicable" },
  { label: "Selfie liveness", detail: "Match face to document" },
  { label: "Review & submit", detail: "Confirm details" },
];

const DOC_HISTORY = [
  { name: "SA ID card · front", uploaded: "12 May 2026 · 18:32", status: "ready" },
  { name: "SA ID card · back", uploaded: "Not yet", status: "missing" },
];

export default function IdentityVerification() {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("sa_id");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Profile · Verification"
          title="Verify your identity"
          subtitle="Required once. Verified profiles get 4× more landlord responses and unlock instant-apply."
          badges={<Badge tone="warn">In progress · step {step + 1} of 4</Badge>}
        />

        <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr) 280px", gap: 32 }}>
          <Stepper orientation="vertical" steps={STEPS} currentStep={step} onStepClick={setStep} />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {step === 0 && (
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>1 · Choose your document</Eyebrow>
                <FormField label="Document type">
                  <Select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    options={[
                      { value: "sa_id", label: "South African ID (smart card)" },
                      { value: "sa_id_book", label: "South African ID book (green)" },
                      { value: "passport", label: "Passport (non-SA)" },
                      { value: "asylum", label: "Asylum-seeker permit" },
                      { value: "refugee", label: "Refugee status (Section 24)" },
                    ]}
                  />
                </FormField>
                <Alert tone="info" title="POPIA-compliant">
                  We pass your document to a regulated KYC provider (Smile ID). Habitat never stores raw images
                  — only the verification result and a redacted reference.
                </Alert>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                  <Button variant="accent" rightIcon="chevR" onClick={() => setStep(1)}>
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {step === 1 && (
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>2 · Photo of document</Eyebrow>
                <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
                  Upload a clear photo of the front and back of your ID. All four corners must be visible —
                  no glare, no fingers covering data.
                </p>
                <FileUploadZone
                  title="Drop your ID photos here"
                  helpText="JPEG or PNG · max 8 MB each · 1 MB+ recommended for sharpness"
                  buttonLabel="Choose photos"
                  specsText="2 photos required · front + back"
                />
                <div style={{ marginTop: 20 }}>
                  <Eyebrow style={{ marginBottom: 8 }}>Uploads so far</Eyebrow>
                  {DOC_HISTORY.map((d, i) => (
                    <div
                      key={d.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                      }}
                    >
                      <Icon
                        name={d.status === "ready" ? "check" : "clock"}
                        size={14}
                        style={{ color: d.status === "ready" ? "var(--success)" : "var(--warn)" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: "var(--slate)" }}>{d.uploaded}</div>
                      </div>
                      {d.status === "ready" ? (
                        <Button variant="ghost" size="sm">Replace</Button>
                      ) : (
                        <Badge tone="warn">Missing</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 16 }}>
                  <Button variant="ghost" leftIcon="arrL" onClick={() => setStep(0)}>Back</Button>
                  <Button variant="accent" rightIcon="chevR" onClick={() => setStep(2)}>
                    Continue to selfie
                  </Button>
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>3 · Selfie liveness</Eyebrow>
                <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
                  Hold up your phone and follow the on-screen prompts (blink, turn left, turn right). Takes
                  about 8 seconds.
                </p>
                <div
                  style={{
                    background: "var(--surface-2)",
                    border: "1.5px dashed var(--hairline-strong)",
                    borderRadius: 12,
                    padding: 48,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      background: "var(--surface)",
                      border: "2px solid var(--hairline-strong)",
                      margin: "0 auto 16px",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon name="user" size={36} style={{ color: "var(--slate)" }} />
                  </div>
                  <Button variant="accent" leftIcon="video">Open camera</Button>
                  <div className="mono" style={{ fontSize: 11, color: "var(--slate)", marginTop: 16 }}>
                    Front camera · webcam · no upload from gallery
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 16 }}>
                  <Button variant="ghost" leftIcon="arrL" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="accent" rightIcon="chevR" onClick={() => setStep(3)}>
                    Continue
                  </Button>
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>4 · Confirm & submit</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <FormField label="Full name (as on document)">
                    <Input defaultValue="Sipho Dlamini" />
                  </FormField>
                  <FormField label="ID number">
                    <Input defaultValue="8504010012088" className="mono" />
                  </FormField>
                  <FormField label="Date of birth">
                    <Input defaultValue="01 Apr 1985" />
                  </FormField>
                  <FormField label="Nationality">
                    <Input defaultValue="South African" />
                  </FormField>
                </div>
                <div style={{ marginTop: 16 }}>
                  <KeyValueRow label="Document" value="SA ID smart card" divider />
                  <KeyValueRow label="Pages uploaded" value="2 / 2" divider />
                  <KeyValueRow label="Selfie liveness" value="Passed" tone="success" divider />
                  <KeyValueRow label="Estimated decision" value="Under 60 seconds" tone="accent" divider={false} />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "space-between", marginTop: 16 }}>
                  <Button variant="ghost" leftIcon="arrL" onClick={() => setStep(2)}>Back</Button>
                  <Link to="/verification" style={{ textDecoration: "none" }}>
                    <Button variant="accent" leftIcon="check">Submit &amp; continue to FICA</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88, alignSelf: "start" }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>What we check</Eyebrow>
              {[
                ["Document authenticity", "Government data + tamper detection"],
                ["Face match", "Selfie vs ID photo"],
                ["Liveness", "Real human, not a photo"],
                ["Sanctions screen", "Global watchlists"],
              ].map(([t, d]) => (
                <div key={t} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: "1px solid var(--hairline)" }}>
                  <Icon name="shield" size={14} style={{ color: "var(--success)", marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>{d}</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card padding={20} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
              <Eyebrow>Need help?</Eyebrow>
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: "8px 0 12px" }}>
                Stuck on the selfie? Switch to the WhatsApp flow — same provider, takes a minute.
              </p>
              <Button variant="secondary" size="sm" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>
                Verify via WhatsApp
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
