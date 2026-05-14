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
  type EmploymentStatus,
} from "@/lib/api/applications";

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string; icon: IconName }[] = [
  { value: "EMPLOYED", label: "Employed", icon: "user" },
  { value: "SELF_EMPLOYED", label: "Self-employed", icon: "wrench" },
  { value: "STUDENT", label: "Student", icon: "paper" },
  { value: "PENSIONER", label: "Pensioner", icon: "home" },
  { value: "UNEMPLOYED", label: "Currently looking", icon: "search" },
  { value: "OTHER", label: "Other", icon: "sparkle" },
];

// Wizard step list — ports the handoff's left-rail stepper (screen-apply.jsx).
// Habitat collects "Message" today; the others are placeholders for the
// wizard expansion. Show them all so the user sees the journey.
const APPLY_SUBSTEPS: { icon: IconName; title: string }[] = [
  { icon: "user", title: "About you" },
  { icon: "cash", title: "Affordability" },
  { icon: "doc", title: "Documents" },
  { icon: "edit", title: "Message" },
  { icon: "check", title: "Review" },
];
const CURRENT_SUBSTEP = 3; // "Message"

const TODAY = new Date().toISOString().split("T")[0];

function formatRand(amount: number): string {
  return `R ${Math.round(amount).toLocaleString("en-ZA")}`;
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

  const [employment, setEmployment] = useState<EmploymentStatus | null>(null);
  const [message, setMessage] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !unit || !property) return;
    const submittedFor = unit;
    const submittedProperty = property;
    setSubmitting(true);
    try {
      const application = await applicationsApi.create({
        unitId: submittedFor.id,
        message: message.trim() ? message.trim() : undefined,
        moveInDate: moveInDate || undefined,
        employmentStatus: employment ?? undefined,
      });
      const target =
        application.status === "AWAITING_DOCUMENTS"
          ? "/apply/upload-documents"
          : "/apply/success";
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
            {APPLY_SUBSTEPS.map((s, i) => {
              const state =
                i < CURRENT_SUBSTEP ? "done" : i === CURRENT_SUBSTEP ? "current" : "next";
              return (
                <div
                  key={s.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: state === "current" ? "var(--surface-2)" : "transparent",
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
              Documents go straight to the landlord — encrypted, deleted after 90 days if
              unsuccessful.
            </div>
          </Card>
        </aside>

        {/* ── Center: the form (Message step today) ──────────────────────── */}
        <main>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Your message to {property.title || "the landlord"}
          </h1>
          <p style={{ fontSize: 15, color: "var(--slate)", margin: "0 0 32px" }}>
            Tell the landlord a bit about you — employment, preferred move-in date, and a short
            note. Submitting doesn't commit you to anything; they'll review and respond.
          </p>

          <form onSubmit={handleSubmit}>
            <FormSection
              title="What's your employment situation?"
              hint="Optional — gives the landlord a quick read on your income story."
            >
              <div
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
                        transition: "border-color 120ms, background 120ms",
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
            </FormSection>

            <FormSection
              title="Message to landlord"
              hint="Optional — introduce yourself in a sentence or two."
            >
              <FormField label="" htmlFor="apply-message">
                <Textarea
                  id="apply-message"
                  rows={4}
                  placeholder="Hi, I'm a young professional looking for a quiet place close to the Gautrain…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                />
              </FormField>
            </FormSection>

            <FormSection
              title="Preferred move-in date"
              hint="Optional — the landlord may counter with their own date."
            >
              <FormField label="" htmlFor="apply-movein">
                <Input
                  id="apply-movein"
                  type="date"
                  value={moveInDate}
                  min={TODAY}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  style={{ maxWidth: 220 }}
                />
              </FormField>
            </FormSection>

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
              <Link
                to={`/unit?id=${unit.id}&prop=${property.id}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="ghost" leftIcon="chevL" disabled={submitting}>
                  Back
                </Button>
              </Link>
              <Button
                type="submit"
                variant="accent"
                rightIcon="arrR"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
            </div>
          </form>
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

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</div>
        {hint ? <div style={{ fontSize: 12, color: "var(--slate)" }}>{hint}</div> : null}
      </div>
      {children}
    </section>
  );
}
