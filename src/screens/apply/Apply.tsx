import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Stepper from "@/components/Stepper";
import Photo from "@/components/Photo";
import KeyValueRow from "@/components/KeyValueRow";
import DocumentStatusRow from "@/components/DocumentStatusRow";
import FileUploadZone from "@/components/FileUploadZone";
import InlineLink from "@/components/InlineLink";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import Checkbox from "@/components/Checkbox";
import Toggle from "@/components/Toggle";
import Alert from "@/components/Alert";
import ProgressBar from "@/components/ProgressBar";

const STEPS = [
  { label: "About you" },
  { label: "Affordability" },
  { label: "Documents" },
  { label: "Message" },
  { label: "Review" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "EMPLOYED", label: "Employed" },
  { value: "SELF_EMPLOYED", label: "Self-employed" },
  { value: "STUDENT", label: "Student" },
  { value: "PENSIONER", label: "Pensioner" },
  { value: "UNEMPLOYED", label: "Unemployed" },
  { value: "OTHER", label: "Other" },
];

const HOUSEHOLD_OPTIONS = [
  { value: "1", label: "Just me" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5+", label: "5 or more" },
];

const PETS_OPTIONS = [
  { value: "none", label: "No pets" },
  { value: "cat", label: "Cat(s)" },
  { value: "small_dog", label: "Small dog" },
  { value: "large_dog", label: "Large dog" },
  { value: "other", label: "Other (please describe in message)" },
];

const RENT_RULE_THRESHOLD = 1 / 3; // common SA affordability heuristic

interface UnitSummary {
  id: string;
  name: string;
  property: string;
  type: string;
  beds: number;
  baths: number;
  sqm: number;
  price: number;
  deposit: number;
  photoLabel: string;
}

const UNIT_LOOKUP: Record<string, UnitSummary> = {};

const DEFAULT_UNIT: UnitSummary = {
  id: "default",
  name: "Unit",
  property: "—",
  type: "",
  beds: 0,
  baths: 0,
  sqm: 0,
  price: 0,
  deposit: 0,
  photoLabel: "",
};

export default function Apply() {
  const [params, setParams] = useSearchParams();
  const unitParam = params.get("unit");
  const unit = (unitParam && UNIT_LOOKUP[unitParam]) || DEFAULT_UNIT;
  const parsedStep = Number(params.get("step"));
  const initialStep =
    Number.isInteger(parsedStep) && parsedStep >= 0 && parsedStep < STEPS.length ? parsedStep : 0;
  const [step, setStepState] = useState(initialStep);
  const setStep = (next: number) => {
    setStepState(next);
    if (next === 0) params.delete("step");
    else params.set("step", String(next));
    setParams(params, { replace: true });
  };
  const navigate = useNavigate();
  const isFinalStep = step === STEPS.length - 1;

  // Shared form state — surfaced in Review.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [employment, setEmployment] = useState("EMPLOYED");
  const [employer, setEmployer] = useState("");
  const [household, setHousehold] = useState("1");
  const [pets, setPets] = useState("none");
  const [income, setIncome] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [bankConnected, setBankConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptCredit, setAcceptCredit] = useState(false);
  const [addCosigner, setAddCosigner] = useState(false);
  const [cosignerName, setCosignerName] = useState("");
  const [cosignerEmail, setCosignerEmail] = useState("");
  const [cosignerPhone, setCosignerPhone] = useState("");
  const [cosignerRelation, setCosignerRelation] = useState("parent");

  const monthlyIncome = Number(income || 0) + Number(otherIncome || 0);
  const monthlyExpenses = Number(expenses || 0);
  const rent = unit.price;
  const disposable = monthlyIncome - monthlyExpenses;
  const affordable = disposable >= rent / RENT_RULE_THRESHOLD;
  const rentToIncome = monthlyIncome > 0 ? Math.round((rent / monthlyIncome) * 100) : 0;

  const canSubmit = acceptTerms && acceptCredit;

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
        <aside style={{ position: "sticky", top: 88, alignSelf: "start" }}>
          <InlineLink
            to={unit.id === "default" ? "/property" : `/unit?id=${unit.id}`}
            icon="chevL"
            iconPosition="left"
            size="sm"
            tone="slate"
          >
            Back to {unit.id === "default" ? "property" : unit.name}
          </InlineLink>
          <Eyebrow style={{ marginTop: 24, marginBottom: 8 }}>Application</Eyebrow>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>
            {unit.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 20 }}>
            {unit.property}
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
          {step === 0 ? (
            <StepHeader
              eyebrow="Step 1 of 5"
              title="Tell us about you"
              subtitle="Basic profile info we share with the landlord. You can edit any of this later in /profile."
            />
          ) : step === 1 ? (
            <StepHeader
              eyebrow="Step 2 of 5"
              title="Show you can afford it"
              subtitle="We use this to compute an affordability score. The landlord sees the score, not your raw numbers."
            />
          ) : step === 2 ? (
            <StepHeader
              eyebrow="Step 3 of 5"
              title="Upload your documents"
              subtitle="Nine document slots — drop in what applies. We check FICA and run credit before sending to the landlord."
            />
          ) : step === 3 ? (
            <StepHeader
              eyebrow="Step 4 of 5"
              title="A short note to the landlord"
              subtitle="Optional, but applicants who include a note get a reply ~3× more often. Keep it short and human."
            />
          ) : (
            <StepHeader
              eyebrow="Step 5 of 5"
              title="Review and submit"
              subtitle="Final pass before we send your application to the landlord. You can withdraw any time before they open it."
            />
          )}

          {step === 0 ? (
            <Card padding={24}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FormField label="Full name" required>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </FormField>
                <FormField label="Date of birth" required>
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </FormField>
                <FormField label="Email" required>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormField>
                <FormField label="Mobile" required helper="SA format · we send a one-time code to verify.">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FormField>
                <FormField label="Employment status" required>
                  <Select
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                    options={EMPLOYMENT_OPTIONS}
                  />
                </FormField>
                <FormField label="Employer / institution">
                  <Input value={employer} onChange={(e) => setEmployer(e.target.value)} />
                </FormField>
                <FormField label="Household size" required>
                  <Select
                    value={household}
                    onChange={(e) => setHousehold(e.target.value)}
                    options={HOUSEHOLD_OPTIONS}
                  />
                </FormField>
                <FormField label="Pets">
                  <Select value={pets} onChange={(e) => setPets(e.target.value)} options={PETS_OPTIONS} />
                </FormField>
              </div>
              <Alert tone="info" title="Why we ask">
                Household size and pets aren't a credit factor — they help the landlord pick a unit that
                actually fits. Some landlords reject applicants on this basis; that's their right under SA law.
              </Alert>
            </Card>
          ) : null}

          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>Monthly income</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <FormField label="Gross salary / wage" helper="Before tax and deductions.">
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      leftIcon="cash"
                    />
                  </FormField>
                  <FormField label="Other income" helper="Side gigs, rent, support — optional.">
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(e.target.value)}
                      leftIcon="cash"
                    />
                  </FormField>
                </div>
              </Card>

              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>Monthly commitments</Eyebrow>
                <FormField label="Existing debts, transport, school fees, etc." helper="Roughly — we don't need an exact number.">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    leftIcon="trend"
                  />
                </FormField>
              </Card>

              <Card padding={24}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div>
                    <Eyebrow style={{ marginBottom: 4 }}>Bank-linked verification</Eyebrow>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Connect your bank for a 92+ affordability score</div>
                    <p style={{ fontSize: 12, color: "var(--slate)", margin: "4px 0 0", maxWidth: 480, lineHeight: 1.5 }}>
                      Read-only via Stitch. We see balances and inflows; we never store statements or move
                      money. Optional — you can also upload statements in step 3.
                    </p>
                  </div>
                  <Toggle
                    checked={bankConnected}
                    onChange={(e) => setBankConnected(e.target.checked)}
                  />
                </div>
              </Card>

              <Card
                padding={24}
                style={{
                  borderColor: affordable ? "var(--success)" : "var(--warn)",
                  background: affordable
                    ? "color-mix(in oklch, var(--success) 4%, var(--surface))"
                    : "color-mix(in oklch, var(--warn) 4%, var(--surface))",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <Eyebrow style={{ marginBottom: 4, color: affordable ? "var(--success)" : "var(--warn)" }}>
                      Live affordability check
                    </Eyebrow>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>
                      {affordable
                        ? `You're well inside the affordability band for R ${rent.toLocaleString("en-ZA")} rent.`
                        : "Rent is above SA's recommended 1/3 of monthly income."}
                    </div>
                  </div>
                  <Badge tone={affordable ? "success" : "warn"}>
                    {rentToIncome}% rent-to-income
                  </Badge>
                </div>
                <KeyValueRow label="Total monthly income" value={`R ${monthlyIncome.toLocaleString("en-ZA")}`} divider />
                <KeyValueRow label="Monthly commitments" value={`R ${monthlyExpenses.toLocaleString("en-ZA")}`} divider />
                <KeyValueRow
                  label="Disposable after commitments"
                  value={`R ${disposable.toLocaleString("en-ZA")}`}
                  tone={disposable > rent ? "success" : "warn"}
                  divider
                />
                <KeyValueRow
                  label="Rent on this unit"
                  value={`R ${rent.toLocaleString("en-ZA")}`}
                  tone="accent"
                  divider={false}
                />
                <div style={{ marginTop: 14 }}>
                  <ProgressBar value={Math.min(100, rentToIncome)} tone={affordable ? "success" : "warn"} />
                </div>
              </Card>

              <Card padding={24}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
                  <div>
                    <Eyebrow style={{ marginBottom: 4 }}>Cosigner / guarantor · optional</Eyebrow>
                    <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, maxWidth: 460, lineHeight: 1.5 }}>
                      A working parent, family member, or employer can co-sign your lease. Strongest when
                      your own affordability is borderline — they're legally on the hook if you default.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddCosigner((v) => !v)}
                    className={addCosigner ? "btn btn--secondary btn--sm" : "btn btn--accent btn--sm"}
                  >
                    {addCosigner ? "Remove" : "Add cosigner"}
                  </button>
                </div>

                {addCosigner ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <FormField label="Full name" required>
                        <Input value={cosignerName} onChange={(e) => setCosignerName(e.target.value)} placeholder="Full name" />
                      </FormField>
                      <FormField label="Relationship" required>
                        <Select
                          value={cosignerRelation}
                          onChange={(e) => setCosignerRelation(e.target.value)}
                          options={[
                            { value: "parent", label: "Parent" },
                            { value: "guardian", label: "Guardian" },
                            { value: "sibling", label: "Sibling" },
                            { value: "employer", label: "Employer" },
                            { value: "other", label: "Other" },
                          ]}
                        />
                      </FormField>
                      <FormField label="Email" required>
                        <Input
                          type="email"
                          value={cosignerEmail}
                          onChange={(e) => setCosignerEmail(e.target.value)}
                          placeholder="name@example.co.za"
                        />
                      </FormField>
                      <FormField label="Mobile" required helper="We text them a one-tap consent link.">
                        <Input value={cosignerPhone} onChange={(e) => setCosignerPhone(e.target.value)} placeholder="+27 82 …" />
                      </FormField>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <Alert tone="info" title="Habitat will FICA-check your cosigner separately">
                        They'll get a one-time link to upload their own ID + payslip. Until they consent
                        the cosigner row stays in <span className="mono">PENDING</span>; you can still
                        submit the application and proceed.
                      </Alert>
                    </div>
                  </>
                ) : null}
              </Card>
            </div>
          ) : null}

          {step === 2 ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                <DocumentStatusRow
                  name="SA ID / Passport"
                  status="empty"
                  subText="SA_ID"
                />
                <DocumentStatusRow
                  name="Passport (non-SA citizens)"
                  status="empty"
                  subText="PASSPORT · optional if SA ID provided"
                />
                <DocumentStatusRow
                  name="Payslips · last 3 months"
                  status="empty"
                  subText="PAYSLIPS_3M · PDF · max 10 MB"
                />
                <DocumentStatusRow
                  name="Bank statements · last 3 months"
                  status="empty"
                  subText="BANK_STATEMENTS_3M · PDF or CSV · max 10 MB"
                  active
                />
                <DocumentStatusRow
                  name="Employment letter"
                  status="empty"
                  subText="EMPLOYMENT_LETTER · PDF"
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
                  status="empty"
                  subText="LANDLORD_REFERENCE"
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
            </>
          ) : null}

          {step === 3 ? (
            <Card padding={24}>
              <FormField
                label="Note to the landlord"
                helper={`${message.length} / 600 characters · keep it short, plain, and specific.`}
              >
                <Textarea
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 600))}
                />
              </FormField>

              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "var(--surface-2)",
                  borderRadius: 8,
                }}
              >
                <Eyebrow style={{ marginBottom: 8 }}>What works in a note</Eyebrow>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: "var(--slate)", lineHeight: 1.7 }}>
                  <li>Your situation in one line (work / study / family).</li>
                  <li>Why this unit specifically (location, size, the photo of the kitchen).</li>
                  <li>When you can view — a real day &amp; time helps.</li>
                </ul>
              </div>
            </Card>
          ) : null}

          {step === 4 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 12 }}>About you</Eyebrow>
                <KeyValueRow label="Name" value={fullName} divider />
                <KeyValueRow label="Date of birth" value={dob} divider />
                <KeyValueRow label="Email" value={email} divider />
                <KeyValueRow label="Mobile" value={phone} divider />
                <KeyValueRow
                  label="Employment"
                  value={
                    <span>
                      {EMPLOYMENT_OPTIONS.find((o) => o.value === employment)?.label}
                      {employer ? ` · ${employer}` : ""}
                    </span>
                  }
                  divider
                />
                <KeyValueRow
                  label="Household"
                  value={HOUSEHOLD_OPTIONS.find((o) => o.value === household)?.label ?? household}
                  divider
                />
                <KeyValueRow
                  label="Pets"
                  value={PETS_OPTIONS.find((o) => o.value === pets)?.label ?? pets}
                  divider={false}
                />
              </Card>

              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 12 }}>Affordability snapshot</Eyebrow>
                <KeyValueRow
                  label="Monthly income"
                  value={`R ${monthlyIncome.toLocaleString("en-ZA")}`}
                  divider
                />
                <KeyValueRow
                  label="Commitments"
                  value={`R ${monthlyExpenses.toLocaleString("en-ZA")}`}
                  divider
                />
                <KeyValueRow
                  label="Rent-to-income"
                  value={`${rentToIncome}%`}
                  tone={affordable ? "success" : "warn"}
                  divider
                />
                <KeyValueRow
                  label="Bank verification"
                  value={bankConnected ? "Connected (Stitch)" : "Not connected"}
                  tone={bankConnected ? "success" : "neutral"}
                  divider={false}
                />
              </Card>

              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 12 }}>Documents</Eyebrow>
                <KeyValueRow label="Required uploaded" value="0 of 7" tone="accent" divider />
                <KeyValueRow
                  label="Missing"
                  value="—"
                  tone="warn"
                  divider={false}
                />
                <div style={{ marginTop: 10 }}>
                  <Button variant="ghost" size="sm" leftIcon="upload" onClick={() => setStep(2)}>
                    Back to documents
                  </Button>
                </div>
              </Card>

              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 8 }}>Your note</Eyebrow>
                <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                  “{message}”
                </p>
              </Card>

              <Card padding={20} style={{ background: "var(--surface-2)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    label={
                      <span style={{ fontSize: 13 }}>
                        I accept Habitat's tenant terms and the Rental Housing Act standard clauses.
                      </span>
                    }
                  />
                  <Checkbox
                    checked={acceptCredit}
                    onChange={(e) => setAcceptCredit(e.target.checked)}
                    label={
                      <span style={{ fontSize: 13 }}>
                        I authorise Habitat to verify my identity and pull a soft credit check via Experian
                        and TPN.
                      </span>
                    }
                  />
                </div>
              </Card>

              {!canSubmit ? (
                <Alert tone="warn">
                  Tick both boxes above to enable Submit application.
                </Alert>
              ) : null}
            </div>
          ) : null}

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
              disabled={step === 0}
              onClick={() => setStep(Math.max(0, step - 1))}
            >
              Back
            </Button>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary">Save draft</Button>
              <Button
                variant="accent"
                rightIcon={isFinalStep ? "check" : "arrR"}
                disabled={isFinalStep && !canSubmit}
                onClick={() => (isFinalStep ? navigate("/my-apps") : setStep(step + 1))}
              >
                {isFinalStep ? "Submit application" : "Continue"}
              </Button>
            </div>
          </div>
        </main>

        {/* Right rail — listing recap */}
        <aside style={{ position: "sticky", top: 88, alignSelf: "start" }}>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <Photo ratio="16/10" label={unit.photoLabel} style={{ borderRadius: 0 }} />
            <div style={{ padding: 16 }}>
              <Eyebrow style={{ marginBottom: 6 }}>Applying for</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {unit.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 4 }}>
                {unit.property}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                {unit.sqm} m² · {unit.beds} bed · {unit.baths} bath
              </div>
              <KeyValueRow label="Rent" value={`R ${unit.price.toLocaleString("en-ZA")}`} divider size="sm" />
              <KeyValueRow label="Deposit" value={`R ${unit.deposit.toLocaleString("en-ZA")}`} divider size="sm" />
              <KeyValueRow label="Application fee" value="Free" divider size="sm" />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function StepHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Eyebrow style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow>
      <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, maxWidth: 620, lineHeight: 1.55 }}>
        {subtitle}
      </p>
    </div>
  );
}
