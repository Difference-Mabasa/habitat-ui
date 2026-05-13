import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Photo from "@/components/Photo";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Stepper from "@/components/Stepper";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Toggle from "@/components/Toggle";
import Radio from "@/components/Radio";
import Chip from "@/components/Chip";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";
import Avatar from "@/components/Avatar";
import { toast } from "@/lib/toast";

const STEPS = [
  { label: "Property details" },
  { label: "Mandate" },
  { label: "Units" },
  { label: "Application requirements" },
  { label: "Payout details" },
  { label: "Review & publish" },
];

type ListingMode = "self" | "behalf";
type MandateType = "FULL_MANAGEMENT" | "TENANT_FIND" | "LETTING_AND_INSPECTIONS";

interface UnitDraft {
  id: string;
  title: string;
  type: string;
  beds: number;
  baths: number;
  sqm: number;
  rent: number;
  deposit: number;
  availableFrom: string;
  photos: number;
}

const PROPERTY_TYPES = [
  { value: "FREESTANDING", label: "Free-standing house" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "APARTMENT_BLOCK", label: "Apartment block" },
  { value: "COTTAGE_GROUP", label: "Cottage/backroom group" },
  { value: "STUDIO_BLOCK", label: "Studio block" },
];

const AMENITIES = [
  "1 parking bay", "2+ parking", "Covered carport", "Fibre ready", "Prepaid electricity",
  "Solar / inverter", "Backup power", "Borehole", "Walled / gated", "24h security",
  "Pet friendly", "Garden", "Pool", "Communal braai", "Laundry yard",
];

const DOC_TYPES: { id: string; label: string; required: boolean }[] = [
  { id: "SA_ID", label: "SA ID / Passport", required: true },
  { id: "PAYSLIPS_3M", label: "Payslips · last 3 months", required: true },
  { id: "BANK_STATEMENTS_3M", label: "Bank statements · last 3 months", required: true },
  { id: "EMPLOYMENT_LETTER", label: "Employment letter", required: false },
  { id: "PROOF_OF_ADDRESS", label: "Proof of address", required: false },
  { id: "CREDIT_CONSENT", label: "Credit consent (TPN)", required: true },
  { id: "LANDLORD_REFERENCE", label: "Previous landlord reference", required: false },
];

const INITIAL_UNITS: UnitDraft[] = [];

interface ListingDraft {
  propertyName: string;
  propertyType: string;
  street: string;
  suburb: string;
  city: string;
  postcode: string;
  description: string;
  amenities: string[];
  units: UnitDraft[];
  mandateType: MandateType;
  agencyFee: string;
  landlordEmail: string;
}

const LISTING_LOOKUP: Record<string, ListingDraft> = {};

export default function Wizard() {
  const [params, setParams] = useSearchParams();
  const editId = params.get("edit");
  const isEdit = Boolean(editId);
  const seed: ListingDraft | undefined = editId ? LISTING_LOOKUP[editId] : undefined;
  const initialStep = Math.max(
    0,
    Math.min(STEPS.length - 1, Number(params.get("step")) || 0),
  );
  const [step, setStepState] = useState(initialStep);
  const setStep = (next: number) => {
    setStepState(next);
    if (next === 0) params.delete("step");
    else params.set("step", String(next));
    setParams(params, { replace: true });
  };
  const navigate = useNavigate();

  const ctxAgent = params.get("ctx") === "agent";
  const defaultMode: ListingMode = ctxAgent ? "behalf" : "self";

  // Form state (mocked, not persisted)
  const [propertyName, setPropertyName] = useState(seed?.propertyName ?? "");
  const [propertyType, setPropertyType] = useState(seed?.propertyType ?? "FREESTANDING");
  const [street, setStreet] = useState(seed?.street ?? "");
  const [suburb, setSuburb] = useState(seed?.suburb ?? "");
  const [city, setCity] = useState(seed?.city ?? "");
  const [postcode, setPostcode] = useState(seed?.postcode ?? "");
  const [description, setDescription] = useState(seed?.description ?? "");
  const [amenities, setAmenities] = useState<string[]>(seed?.amenities ?? []);

  const [listingMode, setListingMode] = useState<ListingMode>(defaultMode);
  const [mandateType, setMandateType] = useState<MandateType>(seed?.mandateType ?? "FULL_MANAGEMENT");
  const [landlordOnHabitat, setLandlordOnHabitat] = useState(true);
  const [landlordEmail, setLandlordEmail] = useState(seed?.landlordEmail ?? "");
  const [agencyFee, setAgencyFee] = useState(seed?.agencyFee ?? "");

  const [units, setUnits] = useState<UnitDraft[]>(seed?.units ?? INITIAL_UNITS);

  const [requiredDocs, setRequiredDocs] = useState<string[]>(
    DOC_TYPES.filter((d) => d.required).map((d) => d.id),
  );
  const [allowMessages, setAllowMessages] = useState(true);
  const [instantApply, setInstantApply] = useState(false);

  const [bankName, setBankName] = useState("FNB");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");

  const totalRent = useMemo(() => units.reduce((s, u) => s + u.rent, 0), [units]);
  const isFinal = step === STEPS.length - 1;

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  const toggleDoc = (id: string) =>
    setRequiredDocs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const removeUnit = (id: string) => setUnits((prev) => prev.filter((u) => u.id !== id));

  const handlePublish = () => {
    if (isEdit && editId) {
      toast.success(`${propertyName} updated — changes are live.`);
      navigate(ctxAgent ? "/portfolio" : "/landlord-properties");
      return;
    }
    const minRent = units.length > 0 ? Math.min(...units.map((u) => u.rent)) : 0;
    navigate("/listing-submitted", {
      state: {
        mode: listingMode,
        propertyName,
        address: `${street}, ${suburb}, ${city}${postcode ? " " + postcode : ""}`,
        unitCount: units.length,
        fromRent: minRent,
        mandateType,
        agencyFee,
        ownerName: "",
        ownerEmail: landlordEmail,
        landlordOnHabitat,
      },
    });
  };
  const handleSaveExit = () => {
    if (isEdit) {
      toast.info("Edits saved as draft.");
      navigate(ctxAgent ? "/portfolio" : "/landlord-properties");
      return;
    }
    navigate("/landlord-dashboard");
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      {/* Progress strip */}
      <div style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface)" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Eyebrow>
            {isEdit ? `Edit listing · ${propertyName}` : "List a property"} · step {step + 1} of {STEPS.length}
          </Eyebrow>
          <div style={{ flex: 1 }}>
            <Stepper
              orientation="horizontal"
              currentStep={step}
              steps={STEPS}
              onStepClick={(i) => i <= step && setStep(i)}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={handleSaveExit}>
            {isEdit ? "Save & close" : "Save & exit"}
          </Button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 32px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 360px",
          gap: 64,
        }}
      >
        <main>
          {/* === Step 1 — Property details === */}
          {step === 0 && (
            <>
              <StepHeader
                title="Tell us about the property"
                body="The building itself — name, type, address. Unit-specific stuff (rent, photos, beds) comes next."
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Identity</Eyebrow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="Property name" helper="Optional — for your dashboard only.">
                      <Input value={propertyName} onChange={(e) => setPropertyName(e.target.value)} />
                    </FormField>
                    <FormField label="Property type" required>
                      <Select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        options={PROPERTY_TYPES}
                      />
                    </FormField>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Address</Eyebrow>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="Street address" required>
                      <Input value={street} onChange={(e) => setStreet(e.target.value)} />
                    </FormField>
                    <FormField label="Suburb" required>
                      <Input value={suburb} onChange={(e) => setSuburb(e.target.value)} />
                    </FormField>
                    <FormField label="City" required>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </FormField>
                    <FormField label="Postcode">
                      <Input value={postcode} onChange={(e) => setPostcode(e.target.value)} className="mono" />
                    </FormField>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Description</Eyebrow>
                  <FormField
                    label="About this property"
                    helper={`${description.length} / 1,000 characters · shown on the public listing page.`}
                  >
                    <Textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                    />
                  </FormField>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 14 }}>Amenities</Eyebrow>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 12px" }}>
                    Pick what applies to the property as a whole. Per-unit amenities (own entrance, gas
                    stove etc.) get set in the Units step.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {AMENITIES.map((a) => (
                      <Chip key={a} active={amenities.includes(a)} onClick={() => toggleAmenity(a)}>
                        {a}
                      </Chip>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* === Step 2 — Mandate === */}
          {step === 1 && (
            <>
              <StepHeader
                title="Who's the owner?"
                body="Habitat lets agents list on behalf of landlords. If you are the owner, this step is one click."
              />
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 12 }}>Ownership</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Radio
                    name="mode"
                    value="self"
                    checked={listingMode === "self"}
                    onChange={() => setListingMode("self")}
                    label={
                      <span>
                        <strong>I am the owner</strong>
                        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                          You'll receive rent directly. No mandate paperwork needed.
                        </div>
                      </span>
                    }
                  />
                  <Radio
                    name="mode"
                    value="behalf"
                    checked={listingMode === "behalf"}
                    onChange={() => setListingMode("behalf")}
                    label={
                      <span>
                        <strong>I'm listing on behalf of the owner</strong>
                        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                          Agency / agent flow — the owner approves a mandate before publish.
                        </div>
                      </span>
                    }
                  />
                </div>
              </Card>

              {listingMode === "behalf" ? (
                <>
                  <Card padding={24} style={{ marginTop: 16 }}>
                    <Eyebrow style={{ marginBottom: 14 }}>Mandate</Eyebrow>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <FormField label="Mandate type" required>
                        <Select
                          value={mandateType}
                          onChange={(e) => setMandateType(e.target.value as MandateType)}
                          options={[
                            { value: "FULL_MANAGEMENT", label: "Full management" },
                            { value: "TENANT_FIND", label: "Tenant find only" },
                            { value: "LETTING_AND_INSPECTIONS", label: "Letting & inspections" },
                          ]}
                        />
                      </FormField>
                      <FormField label="Agency fee" helper="% of monthly rent (Full mgmt) or 1× month (Tenant find)">
                        <Input value={agencyFee} onChange={(e) => setAgencyFee(e.target.value)} />
                      </FormField>
                    </div>
                  </Card>

                  <Card padding={24} style={{ marginTop: 16 }}>
                    <Eyebrow style={{ marginBottom: 14 }}>Landlord</Eyebrow>
                    <div style={{ marginBottom: 12 }}>
                      <Toggle
                        label="Landlord is on Habitat"
                        helper="Off → we email them a one-tap approval link."
                        checked={landlordOnHabitat}
                        onChange={(e) => setLandlordOnHabitat(e.target.checked)}
                      />
                    </div>
                    <FormField label={landlordOnHabitat ? "Landlord's Habitat email" : "Landlord's email"} required>
                      <Input
                        type="email"
                        value={landlordEmail}
                        onChange={(e) => setLandlordEmail(e.target.value)}
                      />
                    </FormField>
                  </Card>

                  <Alert tone="info" title="What happens next">
                    Once you publish, we send the landlord a mandate-approval request. The listing stays in
                    DRAFT until they approve — usually within an hour.
                  </Alert>
                </>
              ) : null}
            </>
          )}

          {/* === Step 3 — Units === */}
          {step === 2 && (
            <>
              <StepHeader
                title="Add units"
                body="A property usually has one or more rentable units — a backroom, a cottage, a flat. Each unit has its own photos, rent, and availability."
              />
              <Card padding={0} style={{ overflow: "hidden", marginBottom: 16 }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--hairline)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {units.length} unit{units.length === 1 ? "" : "s"} drafted
                  </div>
                  <Button variant="accent" size="sm" leftIcon="plus">Add unit</Button>
                </div>
                {units.length === 0 ? (
                  <div style={{ padding: 32, textAlign: "center", color: "var(--slate)", fontSize: 13 }}>
                    No units yet. Add at least one before publishing.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--surface-2)" }}>
                        {["Unit", "Type", "Beds / baths", "Size", "Rent", "Photos", ""].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "10px 20px",
                              fontSize: 11,
                              fontWeight: 500,
                              fontFamily: "var(--font-mono)",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: "var(--slate)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((u) => (
                        <tr key={u.id} style={{ borderTop: "1px solid var(--hairline)" }}>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <Photo ratio="auto" label={u.title} style={{ width: 48, height: 48, borderRadius: 6 }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{u.title}</div>
                                <div style={{ fontSize: 11, color: "var(--slate)" }}>{u.availableFrom}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: 12 }}>
                            <Badge tone="neutral">{u.type}</Badge>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: 13 }}>
                            {u.beds} / {u.baths}
                          </td>
                          <td className="tabular" style={{ padding: "14px 20px", fontSize: 13 }}>
                            {u.sqm} m²
                          </td>
                          <td className="tabular" style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500 }}>
                            R {u.rent.toLocaleString("en-ZA")}
                          </td>
                          <td className="tabular" style={{ padding: "14px 20px", fontSize: 12, color: "var(--slate)" }}>
                            {u.photos}
                          </td>
                          <td style={{ padding: "14px 20px", textAlign: "right" }}>
                            <Button variant="ghost" size="sm" leftIcon="edit">Edit</Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon="trash"
                              style={{ color: "var(--danger)" }}
                              onClick={() => removeUnit(u.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>

              <Alert tone="info" title="Each unit gets its own photos and rent">
                Tenants browse and apply at the unit level. Photo recommendation: 5+ daylight photos per
                unit, plus a property-wide cover photo.
              </Alert>
            </>
          )}

          {/* === Step 4 — Application requirements === */}
          {step === 3 && (
            <>
              <StepHeader
                title="What should applicants submit?"
                body="Pick the documents tenants must include. The required taxonomy matches what Habitat verifies automatically — payslips, bank statements, FICA, etc."
              />
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>Required documents</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {DOC_TYPES.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: "12px 14px",
                        border: "1px solid var(--hairline)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Checkbox
                        checked={requiredDocs.includes(d.id)}
                        onChange={() => toggleDoc(d.id)}
                        disabled={d.required}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {d.label}{" "}
                          {d.required ? (
                            <span style={{ color: "var(--accent)", fontSize: 11, fontWeight: 600 }}>· required by Habitat</span>
                          ) : null}
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: "var(--slate)", marginTop: 2 }}>
                          {d.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding={24} style={{ marginTop: 16 }}>
                <Eyebrow style={{ marginBottom: 14 }}>Application rules</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Toggle
                    label="Allow applicants to message me before applying"
                    helper="Useful for niche units; off = they apply first, chat second."
                    checked={allowMessages}
                    onChange={(e) => setAllowMessages(e.target.checked)}
                  />
                  <Toggle
                    label="Enable instant-apply for affordability ≥ 90"
                    helper="Pre-approves high-affordability applicants on payslip + bank verification."
                    checked={instantApply}
                    onChange={(e) => setInstantApply(e.target.checked)}
                  />
                </div>
              </Card>
            </>
          )}

          {/* === Step 5 — Payout details === */}
          {step === 4 && (
            <>
              <StepHeader
                title="Where should rent go?"
                body="Bank details for the trust-account payout. Habitat collects rent, holds it in escrow, and pays you T+3 days each month."
              />
              <Card padding={24}>
                <Eyebrow style={{ marginBottom: 14 }}>Payout account</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <FormField label="Bank" required>
                    <Select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      options={[
                        { value: "FNB", label: "First National Bank" },
                        { value: "ABSA", label: "Absa" },
                        { value: "STANDARD", label: "Standard Bank" },
                        { value: "NEDBANK", label: "Nedbank" },
                        { value: "CAPITEC", label: "Capitec" },
                        { value: "TYME", label: "TymeBank" },
                        { value: "OTHER", label: "Other" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Account type">
                    <Select
                      defaultValue="CHEQUE"
                      options={[
                        { value: "CHEQUE", label: "Cheque / Current" },
                        { value: "SAVINGS", label: "Savings" },
                        { value: "TRANSMISSION", label: "Transmission" },
                      ]}
                    />
                  </FormField>
                  <FormField label="Account holder name" required>
                    <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
                  </FormField>
                  <FormField label="Account number" required>
                    <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mono" />
                  </FormField>
                  <FormField label="Branch code" required helper="Universal branch codes are fine.">
                    <Input value={branchCode} onChange={(e) => setBranchCode(e.target.value)} className="mono" />
                  </FormField>
                </div>
              </Card>

              <Alert tone="info" title="Account verification">
                Habitat sends a R 1 trial deposit to confirm the account holder name matches. Usually
                clears within an hour. You can publish before verification completes — payouts just queue.
              </Alert>

              <Card padding={24} style={{ marginTop: 16 }}>
                <Eyebrow style={{ marginBottom: 14 }}>VAT &amp; tax</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <FormField label="VAT registered?">
                    <Select
                      defaultValue="no"
                      options={[
                        { value: "no", label: "No" },
                        { value: "yes", label: "Yes" },
                      ]}
                    />
                  </FormField>
                  <FormField label="VAT number (if applicable)">
                    <Input className="mono" placeholder="—" />
                  </FormField>
                </div>
              </Card>
            </>
          )}

          {/* === Step 6 — Review & publish === */}
          {step === 5 && (
            <>
              <StepHeader
                title={isEdit ? "Review your changes" : "One last look"}
                body={
                  isEdit
                    ? "Save changes to push the updated listing live. Tenants browsing your unit will see the new details on their next refresh."
                    : listingMode === "behalf"
                      ? "We'll send the owner a mandate-approval request when you publish. The listing stays in DRAFT until they approve."
                      : "Publishing makes the listing live and visible to tenants on /browse."
                }
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 12 }}>Property</Eyebrow>
                  <KeyValueRow label="Name" value={propertyName} divider />
                  <KeyValueRow
                    label="Type"
                    value={PROPERTY_TYPES.find((p) => p.value === propertyType)?.label ?? propertyType}
                    divider
                  />
                  <KeyValueRow label="Address" value={`${street}, ${suburb}, ${city} ${postcode}`} divider />
                  <KeyValueRow
                    label="Amenities"
                    value={amenities.length > 0 ? amenities.join(" · ") : "—"}
                    divider={false}
                  />
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 12 }}>Mandate</Eyebrow>
                  <KeyValueRow
                    label="Listing as"
                    value={listingMode === "self" ? "Owner" : "Agent on behalf of owner"}
                    tone={listingMode === "self" ? "neutral" : "accent"}
                    divider
                  />
                  {listingMode === "behalf" ? (
                    <>
                      <KeyValueRow
                        label="Mandate type"
                        value={
                          mandateType === "FULL_MANAGEMENT"
                            ? "Full management"
                            : mandateType === "TENANT_FIND"
                              ? "Tenant find"
                              : "Letting & inspections"
                        }
                        divider
                      />
                      <KeyValueRow label="Fee" value={`${agencyFee}%`} divider />
                      <KeyValueRow
                        label="Owner"
                        value={
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Avatar name="" size="sm" tone="neutral" />
                            {landlordEmail || "—"}
                          </span>
                        }
                        divider={false}
                      />
                    </>
                  ) : (
                    <KeyValueRow label="Mandate paperwork" value="Not required" divider={false} />
                  )}
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 12 }}>Units · {units.length}</Eyebrow>
                  {units.map((u, i) => (
                    <KeyValueRow
                      key={u.id}
                      label={u.title}
                      value={`${u.type} · ${u.beds}/${u.baths} · ${u.sqm} m² · R ${u.rent.toLocaleString("en-ZA")}/mo`}
                      divider={i > 0}
                    />
                  ))}
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid var(--hairline)",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <span>Total monthly rent</span>
                    <span className="tabular">R {totalRent.toLocaleString("en-ZA")}</span>
                  </div>
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 12 }}>Application requirements</Eyebrow>
                  <KeyValueRow
                    label="Required documents"
                    value={`${requiredDocs.length} of ${DOC_TYPES.length}`}
                    divider
                  />
                  <KeyValueRow
                    label="Pre-apply messaging"
                    value={allowMessages ? "Allowed" : "Off"}
                    tone={allowMessages ? "success" : "neutral"}
                    divider
                  />
                  <KeyValueRow
                    label="Instant-apply"
                    value={instantApply ? "On (affordability ≥ 90)" : "Off"}
                    tone={instantApply ? "accent" : "neutral"}
                    divider={false}
                  />
                </Card>

                <Card padding={24}>
                  <Eyebrow style={{ marginBottom: 12 }}>Payout</Eyebrow>
                  <KeyValueRow label="Bank" value={bankName} divider />
                  <KeyValueRow label="Holder" value={accountHolder} divider />
                  <KeyValueRow
                    label="Account"
                    value={<span className="mono">{accountNumber} · branch {branchCode}</span>}
                    divider={false}
                  />
                </Card>

                <Alert tone="info" title="POPIA + RHA compliance">
                  By publishing you confirm the property is yours to let (or that you have the owner's
                  written mandate) and that all info supplied is accurate.
                </Alert>
              </div>
            </>
          )}

          {/* Footer nav */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 24,
              marginTop: 32,
              borderTop: "1px solid var(--hairline)",
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
              <Button variant="secondary" onClick={handleSaveExit}>
                {isEdit ? "Save draft" : "Save draft"}
              </Button>
              {isFinal ? (
                <Button variant="accent" leftIcon="check" onClick={handlePublish}>
                  {isEdit
                    ? "Save changes"
                    : listingMode === "behalf"
                      ? "Send for owner approval"
                      : "Publish listing"}
                </Button>
              ) : (
                <Button
                  variant="accent"
                  rightIcon="arrR"
                  onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Right rail — live preview */}
        <aside style={{ position: "sticky", top: 88, alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Listing preview</Eyebrow>
            <Photo ratio="16/10" label="cover.jpg" style={{ borderRadius: 8, marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{propertyName}</div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
              {suburb}, {city}
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
              {units.length} unit{units.length === 1 ? "" : "s"}
              {units.length > 0
                ? ` · from R ${Math.min(...units.map((u) => u.rent)).toLocaleString("en-ZA")}/mo`
                : ""}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                paddingTop: 12,
                borderTop: "1px solid var(--hairline)",
                flexWrap: "wrap",
              }}
            >
              {amenities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    background: "var(--surface-2)",
                    borderRadius: 4,
                    color: "var(--slate)",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </Card>

          <Card padding={16} style={{ background: "var(--surface-2)" }}>
            <Eyebrow style={{ marginBottom: 8, color: "var(--accent)" }}>Tip</Eyebrow>
            <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
              {step === 0
                ? "Properties with a clear suburb + descriptor in the name get 38% more clicks."
                : step === 1
                  ? "Mandated listings get a 'Verified mandate' badge — tenants trust them more."
                  : step === 2
                    ? "Units with 5+ daylight photos get 3.4× more applications. Always include a bathroom shot."
                    : step === 3
                      ? "Asking for fewer optional docs gets more applicants — but lower quality. Habitat's defaults strike a good balance."
                      : step === 4
                        ? "We never share your bank details with tenants — they only see Habitat's trust-account confirmation."
                        : "Listings published before 18:00 SAST get 2.1× the same-day views vs. late-night posts."}
            </div>
          </Card>

          <Card padding={16}>
            <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--ink)" }}>Save & exit</strong> keeps your progress as a DRAFT.{" "}
              <Link to="/landlord-dashboard" style={{ color: "var(--accent)", fontWeight: 600 }}>
                Drafts live on your dashboard
              </Link>.
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function StepHeader({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, maxWidth: 620, lineHeight: 1.55 }}>
        {body}
      </p>
    </div>
  );
}
