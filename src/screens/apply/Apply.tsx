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
import PriceDisplay from "@/components/PriceDisplay";
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

const TODAY = new Date().toISOString().split("T")[0];

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

  // Form state — every field is optional per the API contract (only
  // unitId is required, which we already have from the URL).
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
  const heroAddress = [property.suburb, property.city, property.province]
    .filter(Boolean)
    .join(", ");

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
      // API auto-transitions to AWAITING_DOCUMENTS when the property has
      // required docs — route the tenant straight to the upload screen
      // in that case; otherwise go to the simple success page.
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
          maxWidth: 1100,
          margin: "0 auto",
          padding: isSm ? "20px 16px 64px" : "32px 32px 96px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 320px",
          gap: 32,
        }}
      >
        <main>
          <Link
            to={`/unit?id=${unit.id}&prop=${property.id}`}
            style={{
              fontSize: 13,
              color: "var(--slate)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <Icon name="chevL" size={14} />
            Back to {unit.title}
          </Link>

          <h1
            style={{
              fontSize: 32,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              fontWeight: 500,
              margin: "0 0 8px",
            }}
          >
            Apply for {unit.title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 32px" }}>
            Submitting doesn't commit you to anything — the landlord reviews each application and
            responds.
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

            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <Button
                type="submit"
                variant="accent"
                size="lg"
                rightIcon="arrR"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
              <Link
                to={`/unit?id=${unit.id}&prop=${property.id}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="ghost" size="lg" disabled={submitting}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </main>

        <aside>
          <Card padding={0} style={{ position: "sticky", top: 88, overflow: "hidden" }}>
            <Photo ratio="4/3" src={cover} label="" style={{ borderRadius: 0 }} />
            <div style={{ padding: 18 }}>
              <Eyebrow style={{ marginBottom: 6 }}>Applying for</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{unit.title}</div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--slate)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <Icon name="home" size={12} /> {property.title}
              </div>
              {heroAddress ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--slate)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 14,
                  }}
                >
                  <Icon name="pin" size={12} /> {heroAddress}
                </div>
              ) : null}
              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid var(--hairline)",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--slate)" }}>Rent</span>
                <PriceDisplay amount={Number(unit.price)} period="/mo" size="md" />
              </div>
              {unit.availableFrom ? (
                <div
                  style={{
                    paddingTop: 8,
                    fontSize: 12,
                    color: "var(--slate)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon name="calendar" size={12} /> Available from {unit.availableFrom}
                </div>
              ) : null}
            </div>
          </Card>
        </aside>
      </div>
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
