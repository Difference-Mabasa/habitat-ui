import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon, { type IconName } from "@/components/Icon";
import Input from "@/components/Input";
import FormField from "@/components/FormField";
import Textarea from "@/components/Textarea";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useViewport } from "@/hooks/useViewport";
import { useSession } from "@/lib/session";
import { toast } from "@/lib/toast";
import {
  createPropertiesApi,
  type PropertyDetail as PropertyDetailDto,
} from "@/lib/api/properties";
import {
  createApplicationsApi,
  type DocumentType,
  type EmploymentStatus,
} from "@/lib/api/applications";

// ── Wizard step model ───────────────────────────────────────────────

type WizardStep = "application" | "documents" | "review";
const STEP_ORDER: WizardStep[] = ["application", "documents", "review"];

const STEPS: { id: WizardStep; icon: IconName; title: string }[] = [
  { id: "application", icon: "edit",  title: "Your application" },
  { id: "documents",   icon: "doc",   title: "Documents" },
  { id: "review",      icon: "check", title: "Review" },
];

/**
 * Standard SA tenant document set. Matches V25's per-property backfill in
 * habitat-api so we can render the upload UI before the application
 * exists. Per-property variations land later when landlords can configure
 * their own checklists (will need a public GET /properties/{id}/required-
 * documents endpoint at that point).
 */
const REQUIRED_DOC_TYPES: DocumentType[] = [
  "SA_ID",
  "PAYSLIPS_3_MONTHS",
  "BANK_STATEMENTS_3_MONTHS",
  "PROOF_OF_ADDRESS",
];

const DOC_LABEL: Record<DocumentType, string> = {
  SA_ID: "South African ID",
  PASSPORT: "Passport",
  PAYSLIPS_3_MONTHS: "Last 3 payslips",
  BANK_STATEMENTS_3_MONTHS: "Last 3 bank statements",
  EMPLOYMENT_LETTER: "Employment letter",
  PROOF_OF_ADDRESS: "Proof of address",
};

const DOC_HINT: Record<DocumentType, string> = {
  SA_ID: "Clear scan or photo of both sides.",
  PASSPORT: "Photo page only.",
  PAYSLIPS_3_MONTHS: "PDF or image. 3 most recent months in one file is fine.",
  BANK_STATEMENTS_3_MONTHS: "Bank-stamped or PDF download. Most recent 3 months.",
  EMPLOYMENT_LETTER: "On letterhead, dated within 30 days.",
  PROOF_OF_ADDRESS: "Utility bill, lease, or bank statement — no older than 3 months.",
};

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string; icon: IconName }[] = [
  { value: "EMPLOYED",      label: "Employed",          icon: "user" },
  { value: "SELF_EMPLOYED", label: "Self-employed",     icon: "wrench" },
  { value: "STUDENT",       label: "Student",           icon: "paper" },
  { value: "PENSIONER",     label: "Pensioner",         icon: "home" },
  { value: "UNEMPLOYED",    label: "Currently looking", icon: "search" },
  { value: "OTHER",         label: "Other",             icon: "sparkle" },
];

const EMPLOYMENT_LABEL: Record<EmploymentStatus, string> = {
  EMPLOYED: "Employed",
  SELF_EMPLOYED: "Self-employed",
  STUDENT: "Student",
  PENSIONER: "Pensioner",
  UNEMPLOYED: "Currently looking",
  OTHER: "Other",
};

const TODAY = new Date().toISOString().split("T")[0];

function formatRand(amount: number): string {
  return `R ${Math.round(amount).toLocaleString("en-ZA")}`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export default function Apply() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;

  const session = useSession();
  const propertiesApi = useMemo(() => createPropertiesApi(session.client), [session.client]);
  const applicationsApi = useMemo(
    () => createApplicationsApi(session.client),
    [session.client],
  );

  const unitId = params.get("unit") ?? "";
  const propertyId = params.get("prop") ?? "";

  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard state — single source of truth for every step.
  const [step, setStep] = useState<WizardStep>("application");
  const [employment, setEmployment] = useState<EmploymentStatus | null>(null);
  const [message, setMessage] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  /** Files the tenant has chosen, keyed by DocumentType. Held until submit. */
  const [docs, setDocs] = useState<Partial<Record<DocumentType, File>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!propertyId || !unitId) {
      setLoading(false);
      setError("This apply link is missing its unit reference. Open it from a unit page.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void propertiesApi
      .getById(propertyId)
      .then((p) => {
        if (cancelled) return;
        setProperty(p);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Property not found.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [propertiesApi, propertyId, unitId]);

  const unit = useMemo(
    () => property?.units.find((u) => u.id === unitId),
    [property, unitId],
  );

  if (loading) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          <LoadingState rows={4} />
        </div>
      </div>
    );
  }

  if (error || !property || !unit) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          <EmptyState
            icon="home"
            title="Couldn't load that unit"
            description={error ?? "This unit may have been unlisted. Try browsing other spots."}
            actions={
              <Link to="/browse" style={{ textDecoration: "none" }}>
                <Button variant="accent">Browse units</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const cover = unit.images.find((i) => i.isCover)?.url ?? unit.images[0]?.url;
  const unitSize = [
    unit.sqm != null ? `${unit.sqm} m²` : null,
    unit.bedrooms != null ? `${unit.bedrooms} bed` : null,
    unit.bathrooms != null ? `${unit.bathrooms} bath` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const stepIndex = STEP_ORDER.indexOf(step);

  function goNext() {
    if (stepIndex < STEP_ORDER.length - 1) setStep(STEP_ORDER[stepIndex + 1]);
  }
  function goBack() {
    if (stepIndex > 0) setStep(STEP_ORDER[stepIndex - 1]);
  }

  async function handleSubmit() {
    if (submitting || !unit || !property) return;
    const submittedFor = unit;
    const submittedProperty = property;
    setSubmitting(true);
    try {
      // 1. Create the application.
      const application = await applicationsApi.create({
        unitId: submittedFor.id,
        message: message.trim() ? message.trim() : undefined,
        moveInDate: moveInDate || undefined,
        employmentStatus: employment ?? undefined,
      });

      // 2. Upload whichever documents the tenant picked in step 3.
      //    Each upload is a separate API call; failures are reported but
      //    don't abort the others — the user can resume at /upload-documents.
      const failed: DocumentType[] = [];
      for (const docType of REQUIRED_DOC_TYPES) {
        const file = docs[docType];
        if (!file) continue;
        try {
          await applicationsApi.uploadDocument(application.id, {
            docType,
            fileName: file.name,
            // No real object store yet; record a stub URL like the existing
            // upload screen does. When StorageService lands the wizard
            // swaps to a multipart upload before this call.
            fileUrl: `/uploads/stub/${file.name}`,
          });
        } catch {
          failed.push(docType);
        }
      }

      // 3. Decide where to send them. If anything is missing or upload
      //    failed AND the property requires docs, the API will leave the
      //    application at AWAITING_DOCUMENTS — route to /upload-documents
      //    so they can complete or retry. Otherwise straight to success.
      const missing = REQUIRED_DOC_TYPES.some((t) => !docs[t]);
      const incomplete = missing || failed.length > 0;
      const target = incomplete ? "/apply/upload-documents" : "/apply/success";
      navigate(target, {
        state: {
          application,
          property: {
            id: submittedProperty.id,
            title: submittedProperty.title,
            suburb: submittedProperty.suburb,
            city: submittedProperty.city,
          },
          unit: { id: submittedFor.id, title: submittedFor.title },
        },
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String(
              (err as { message?: string }).message ?? "Couldn't submit your application.",
            )
          : "Couldn't submit your application.";
      toast.error(msg);
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isSm ? "20px 16px 64px" : "32px 32px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "260px minmax(0, 1fr) 320px",
          gap: isMobile ? 32 : 48,
        }}
      >
        {/* ── Left rail: stepper + privacy card ──────────────────────────── */}
        <aside>
          <Link
            to={`/unit?id=${unit.id}&prop=${property.id}`}
            style={{
              fontSize: 13,
              color: "var(--slate)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 24,
              textDecoration: "none",
            }}
          >
            <Icon name="chevL" size={14} /> Back to property
          </Link>
          <Eyebrow style={{ marginBottom: 8 }}>Application</Eyebrow>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 20,
              letterSpacing: "-0.01em",
            }}
          >
            {unit.title}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {STEPS.map((s, i) => {
              const state =
                i < stepIndex ? "done" : i === stepIndex ? "current" : "next";
              const clickable = state === "done";
              const onClick = clickable
                ? () => setStep(STEPS[i].id)
                : undefined;
              return (
                <div
                  key={s.title}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onClick={onClick}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") onClick?.();
                        }
                      : undefined
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background:
                      state === "current" ? "var(--surface-2)" : "transparent",
                    cursor: clickable ? "pointer" : "default",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border:
                        "1px solid " +
                        (state === "next" ? "var(--hairline-strong)" : "var(--ink)"),
                      background:
                        state === "done"
                          ? "var(--ink)"
                          : state === "current"
                            ? "var(--surface)"
                            : "transparent",
                      color: state === "done" ? "var(--paper)" : "var(--ink)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {state === "done" ? <Icon name="check" size={12} /> : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: state === "current" ? 600 : 500,
                      color: state === "next" ? "var(--slate)" : "var(--ink)",
                    }}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          <Card
            padding={16}
            style={{
              marginTop: 24,
              background: "var(--surface-2)",
              borderColor: "var(--hairline)",
            }}
          >
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
              Everything you share goes straight to the landlord — encrypted, deleted after
              90 days if unsuccessful.
            </div>
          </Card>
        </aside>

        {/* ── Center: current step's content ──────────────────────────────── */}
        <main data-step={step}>
          {step === "application" ? (
            <StepApplication
              employment={employment}
              setEmployment={setEmployment}
              message={message}
              setMessage={setMessage}
              moveInDate={moveInDate}
              setMoveInDate={setMoveInDate}
              today={TODAY}
              isSm={isSm}
            />
          ) : step === "documents" ? (
            <StepDocuments docs={docs} setDocs={setDocs} />
          ) : (
            <StepReview
              employment={employment}
              message={message}
              moveInDate={moveInDate}
              docs={docs}
              unitTitle={unit.title}
              propertyTitle={property.title ?? ""}
            />
          )}

          {/* Footer nav — Back / Continue or Submit */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {stepIndex === 0 ? (
              <Link
                to={`/unit?id=${unit.id}&prop=${property.id}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="ghost" leftIcon="chevL" disabled={submitting}>
                  Back to property
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                leftIcon="chevL"
                onClick={goBack}
                disabled={submitting}
              >
                Back
              </Button>
            )}
            {step === "review" ? (
              <Button
                variant="accent"
                rightIcon="arrR"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
            ) : (
              <Button
                variant="accent"
                rightIcon="arrR"
                onClick={goNext}
                disabled={submitting}
              >
                Continue
              </Button>
            )}
          </div>
        </main>

        {/* ── Right rail: listing recap ──────────────────────────────────── */}
        <aside>
          <Card padding={0} style={{ position: "sticky", top: 24, overflow: "hidden" }}>
            <Photo ratio="16/10" src={cover} label="" style={{ borderRadius: 0 }} />
            <div style={{ padding: 16 }}>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--slate)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 6,
                }}
              >
                Applying for
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{unit.title}</div>
              {unitSize ? (
                <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                  {unitSize}
                </div>
              ) : (
                <div style={{ marginBottom: 16 }} />
              )}
              <RecapRow label="Rent" value={`${formatRand(Number(unit.price))} /mo`} />
              <RecapRow
                label="Deposit"
                value={formatRand(Number(unit.deposit ?? unit.price))}
              />
              <RecapRow label="Application fee" value="Free" />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

// ── Step bodies ──────────────────────────────────────────────────────

function StepApplication({
  employment,
  setEmployment,
  message,
  setMessage,
  moveInDate,
  setMoveInDate,
  today,
  isSm,
}: {
  employment: EmploymentStatus | null;
  setEmployment: (v: EmploymentStatus | null) => void;
  message: string;
  setMessage: (v: string) => void;
  moveInDate: string;
  setMoveInDate: (v: string) => void;
  today: string;
  isSm: boolean;
}) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        Your application
      </h1>
      <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 32px" }}>
        Employment, a short note, and your preferred move-in date. The landlord may
        counter the date.
      </p>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
          Employment situation
        </div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 12 }}>
          Pick the closest match.
        </div>
        <div
          role="radiogroup"
          aria-label="Employment situation"
          style={{
            display: "grid",
            gridTemplateColumns: isSm ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {EMPLOYMENT_OPTIONS.map((opt) => {
            const active = employment === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setEmployment(active ? null : opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  border: `1px solid ${active ? "var(--accent)" : "var(--hairline)"}`,
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  color: "var(--ink)",
                  textAlign: "left",
                }}
              >
                <Icon
                  name={opt.icon}
                  size={16}
                  style={{ color: active ? "var(--accent)" : "var(--slate)" }}
                />
                <span style={{ flex: 1, fontWeight: active ? 600 : 500 }}>{opt.label}</span>
                {active ? (
                  <Icon name="check" size={14} style={{ color: "var(--accent)" }} />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
          Message to landlord
        </div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 10 }}>
          Optional — introduce yourself in a sentence or two.
        </div>
        <FormField label="" htmlFor="apply-message">
          <Textarea
            id="apply-message"
            rows={5}
            placeholder="Hi! I'm a young professional looking for a quiet place close to the Gautrain…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
          />
        </FormField>
      </section>

      <section>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
          Preferred move-in date
        </div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 10 }}>
          Optional — the landlord may counter with their own date.
        </div>
        <FormField label="" htmlFor="apply-movein">
          <Input
            id="apply-movein"
            type="date"
            value={moveInDate}
            min={today}
            onChange={(e) => setMoveInDate(e.target.value)}
            style={{ maxWidth: 220 }}
          />
        </FormField>
      </section>
    </div>
  );
}

function StepDocuments({
  docs,
  setDocs,
}: {
  docs: Partial<Record<DocumentType, File>>;
  setDocs: (next: Partial<Record<DocumentType, File>>) => void;
}) {
  function pickFile(docType: DocumentType, file: File | null) {
    const next = { ...docs };
    if (file) next[docType] = file;
    else delete next[docType];
    setDocs(next);
  }

  const uploadedCount = REQUIRED_DOC_TYPES.filter((t) => docs[t]).length;

  return (
    <div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
        }}
      >
        Upload your documents
      </h1>
      <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 12px" }}>
        Standard SA tenant verification set. Goes straight to the landlord
        when you submit — encrypted, deleted after 90 days if unsuccessful.
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--slate)",
          margin: "0 0 24px",
          fontFamily: "var(--font-mono)",
        }}
      >
        {uploadedCount} / {REQUIRED_DOC_TYPES.length} attached · all optional in
        this step, you can finish later if any are missing.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {REQUIRED_DOC_TYPES.map((docType) => (
          <DocRow
            key={docType}
            docType={docType}
            file={docs[docType] ?? null}
            onPick={(f) => pickFile(docType, f)}
            onClear={() => pickFile(docType, null)}
          />
        ))}
      </div>
    </div>
  );
}

function DocRow({
  docType,
  file,
  onPick,
  onClear,
}: {
  docType: DocumentType;
  file: File | null;
  onPick: (f: File) => void;
  onClear: () => void;
}) {
  const inputId = `apply-doc-${docType}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 16px",
        border: `1px solid ${file ? "var(--hairline)" : "var(--ink)"}`,
        borderRadius: 12,
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: file ? "var(--accent-soft)" : "var(--surface-2)",
          color: file ? "var(--accent)" : "var(--slate)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name={file ? "doc" : "upload"} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{DOC_LABEL[docType]}</div>
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--slate)",
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file
            ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB`
            : DOC_HINT[docType]}
        </div>
      </div>
      <input
        id={inputId}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.currentTarget.value = "";
        }}
      />
      {file ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById(inputId)?.click()}
          >
            Replace
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Remove
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          leftIcon="upload"
          onClick={() => document.getElementById(inputId)?.click()}
        >
          Choose file
        </Button>
      )}
    </div>
  );
}

function StepReview({
  employment,
  message,
  moveInDate,
  docs,
  unitTitle,
  propertyTitle,
}: {
  employment: EmploymentStatus | null;
  message: string;
  moveInDate: string;
  docs: Partial<Record<DocumentType, File>>;
  unitTitle: string;
  propertyTitle: string;
}) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        Review and submit
      </h1>
      <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 32px" }}>
        Have a quick look. You can still go back and edit anything.
      </p>

      <Card padding={20} style={{ marginBottom: 16 }}>
        <Eyebrow style={{ marginBottom: 12 }}>Your application</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ReviewRow
            label="Employment"
            value={employment ? EMPLOYMENT_LABEL[employment] : "Not provided"}
          />
          <ReviewRow
            label="Move-in date"
            value={moveInDate ? formatDate(moveInDate) : "Flexible"}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 4 }}>
            Message to landlord
          </div>
          <div style={{ fontSize: 14, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
            {message.trim() ? message : <em style={{ color: "var(--slate)" }}>None</em>}
          </div>
        </div>
      </Card>

      <Card padding={20} style={{ marginBottom: 16 }}>
        <Eyebrow style={{ marginBottom: 12 }}>Documents</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {REQUIRED_DOC_TYPES.map((t) => {
            const file = docs[t];
            return (
              <div
                key={t}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--slate)" }}>{DOC_LABEL[t]}</span>
                <span
                  className={file ? "mono" : undefined}
                  style={{
                    fontWeight: 500,
                    color: file ? "var(--ink)" : "var(--slate)",
                    fontStyle: file ? "normal" : "italic",
                    maxWidth: "60%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file ? file.name : "Not attached"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card padding={20} style={{ marginBottom: 16, background: "var(--surface-2)" }}>
        <Eyebrow style={{ marginBottom: 8 }}>What happens next</Eyebrow>
        <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>
          Submitting sends your application to the landlord of {propertyTitle || unitTitle}.
          If they require supporting documents, you'll be taken to the upload screen next.
          Either way, you'll see your application's progress on{" "}
          <strong style={{ color: "var(--ink)" }}>/my-apps</strong>.
        </div>
      </Card>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
      <span style={{ color: "var(--slate)" }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <span style={{ fontSize: 13, color: "var(--slate)" }}>{label}</span>
      <span className="tabular" style={{ fontSize: 13, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}
