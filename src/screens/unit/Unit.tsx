import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import { useViewport } from "@/hooks/useViewport";
import Photo from "@/components/Photo";
import PhotoMosaicGallery from "@/components/PhotoMosaicGallery";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceDisplay from "@/components/PriceDisplay";
import KeyValueRow from "@/components/KeyValueRow";
import AgentCard from "@/components/AgentCard";
import Alert from "@/components/Alert";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { useSavedProperties } from "@/lib/useSavedProperties";
import { toast } from "@/lib/toast";
import {
  createPropertiesApi,
  type PropertyDetail as PropertyDetailDto,
  type UnitDetail as UnitDetailDto,
  type UnitStatus,
} from "@/lib/api/properties";

const UNIT_BADGE: Record<UnitStatus, { tone: BadgeTone; label: string }> = {
  AVAILABLE: { tone: "success", label: "Available" },
  OCCUPIED: { tone: "neutral", label: "Currently let" },
  UNDER_MAINTENANCE: { tone: "warn", label: "Maintenance" },
  UNLISTED: { tone: "neutral", label: "Unlisted" },
};

const FURNISHING_LABEL: Record<string, string> = {
  FURNISHED: "Furnished",
  SEMI_FURNISHED: "Semi-furnished",
  UNFURNISHED: "Unfurnished",
};

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split("_")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** What's-included list derived from the Unit's boolean flags. */
function buildInclusions(unit: UnitDetailDto): string[] {
  const out: string[] = [];
  if (unit.waterIncluded) out.push("Water included");
  if (unit.electricityIncluded) out.push("Electricity included");
  if (unit.petsAllowed) out.push("Pets allowed");
  if (unit.furnishing && unit.furnishing !== "UNFURNISHED") {
    out.push(FURNISHING_LABEL[unit.furnishing] ?? "Furnished");
  }
  return out;
}

export default function Unit() {
  const [params] = useSearchParams();
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const session = useSession();
  const api = useMemo(() => createPropertiesApi(session.client), [session.client]);

  const unitId = params.get("id") ?? "";
  const propertyId = params.get("prop") ?? "";

  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSaved, toggle: toggleSaved } = useSavedProperties();

  useEffect(() => {
    if (!propertyId || propertyId === ":id") {
      setLoading(false);
      setError("This link is missing the property reference. Open the unit from a property page.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api
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
  }, [api, propertyId]);

  const unit = useMemo(() => property?.units.find((u) => u.id === unitId), [property, unitId]);
  const otherUnits = useMemo(
    () => (property ? property.units.filter((u) => u.id !== unitId) : []),
    [property, unitId],
  );

  if (loading) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 32px" }}>
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
            title="Unit not found"
            description={error ?? "This unit isn't available right now. Try browsing other spots."}
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

  const badge = UNIT_BADGE[unit.status];
  const canApply = unit.status === "AVAILABLE";
  const photos = unit.images.map((i) => i.url);
  const inclusions = buildInclusions(unit);
  const unitTypeLabel = titleCase(unit.unitType);
  const furnishingLabel = unit.furnishing
    ? FURNISHING_LABEL[unit.furnishing] ?? titleCase(unit.furnishing)
    : "Unfurnished";
  const unitName = unit.unitNumber ? `${unit.title} · ${unit.unitNumber}` : unit.title;
  const fullAddress = [property.addressLine, property.suburb, property.city, property.province]
    .filter(Boolean)
    .join(", ");

  function handleShare() {
    const url = window.location.href;
    const title = unitName;
    if (typeof navigator.share === "function") {
      navigator.share({ title, url }).catch(() => {});
      return;
    }
    void navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Couldn't copy the link"));
  }

  // Save state is keyed on the unit's parent property — saving a unit
  // is functionally "save this property" until we add unit-level saves.
  const saved = isSaved(property.id);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 32px" }}>
          <Breadcrumbs
            items={[
              { label: "Browse", href: "/browse" },
              ...(property.suburb ? [{ label: property.suburb, href: "/browse" }] : []),
              { label: property.title, href: `/property/${property.id}` },
              { label: unitName },
            ]}
          />
        </div>
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "16px 16px" : "24px 32px" }}>
        <PhotoMosaicGallery photos={photos} alt={unitName} compact={isSm} />
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: isSm ? "16px 16px 64px" : "16px 32px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 380px",
          gap: 64,
        }}
      >
        <main>
          {/* Title + status */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <Badge tone={badge.tone}>{badge.label}</Badge>
                <Badge tone="neutral">{unitTypeLabel}</Badge>
                <Badge tone="neutral">{furnishingLabel}</Badge>
                {unit.availableFrom ? <Badge tone="accent">From {unit.availableFrom}</Badge> : null}
              </div>
              <h1 style={{ fontSize: 36, letterSpacing: "-0.025em", lineHeight: 1.1, fontWeight: 500, margin: "0 0 8px" }}>
                {unitName}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--slate)", fontSize: 14, flexWrap: "wrap" }}>
                <Link
                  to={`/property/${property.id}`}
                  style={{ color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Icon name="home" size={14} /> {property.title}
                </Link>
                <span>·</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={14} /> {fullAddress || "—"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Button
                variant={saved ? "accent" : "secondary"}
                size="sm"
                leftIcon="heart"
                onClick={() => toggleSaved(property.id)}
              >
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="secondary" size="sm" leftIcon="arrUR" onClick={handleShare}>
                Share
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isSm ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              border: "1px solid var(--hairline)",
              borderRadius: 12,
              marginBottom: 32,
            }}
          >
            <QuickStat icon="bed" label="Bedrooms" value={`${unit.bedrooms}`} divider />
            <QuickStat icon="bath" label="Bathrooms" value={`${unit.bathrooms}`} divider />
            <QuickStat
              icon="sqm"
              label="Floor area"
              value={unit.sqm != null ? `${unit.sqm} m²` : "—"}
              divider
            />
            <QuickStat
              icon="users"
              label="Max occupants"
              value={unit.maxOccupants != null ? `${unit.maxOccupants}` : "—"}
            />
          </div>

          {unit.description ? (
            <DetailSection title={`About ${unit.title}`}>
              <p style={{ fontSize: 15, color: "var(--slate)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                {unit.description}
              </p>
            </DetailSection>
          ) : null}

          {inclusions.length > 0 ? (
            <DetailSection title="What's included">
              <div style={{ display: "grid", gridTemplateColumns: isSm ? "1fr" : "repeat(2, 1fr)", gap: 10 }}>
                {inclusions.map((inc) => (
                  <div key={inc} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <Icon name="check" size={14} style={{ color: "var(--success)" }} />
                    {inc}
                  </div>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {!canApply ? (
            <div style={{ marginTop: 24 }}>
              <Alert tone="warn" title={`${unit.title} isn't taking applications right now`}>
                {unit.status === "OCCUPIED"
                  ? "This unit is currently let. Set a saved search and we'll notify you when it opens."
                  : unit.status === "UNDER_MAINTENANCE"
                    ? "This unit is being renovated. Check back closer to the move-in date."
                    : "This unit is unlisted. The landlord may relist it later."}
              </Alert>
            </div>
          ) : null}

          {otherUnits.length > 0 ? (
            <DetailSection
              title="Other units in this property"
              subtitle={`${otherUnits.length} more`}
            >
              <div style={{ display: "grid", gridTemplateColumns: isSm ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
                {otherUnits.slice(0, 4).map((u) => {
                  const uBadge = UNIT_BADGE[u.status];
                  const uCover = u.images.find((i) => i.isCover)?.url ?? u.images[0]?.url;
                  return (
                    <Link
                      key={u.id}
                      to={`/unit?id=${u.id}&prop=${property.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Card padding={0} interactive style={{ overflow: "hidden" }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "120px 1fr auto",
                            gap: 14,
                            alignItems: "center",
                            padding: 12,
                          }}
                        >
                          <Photo ratio="4/3" src={uCover} label="" style={{ borderRadius: 8 }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{u.title}</div>
                            <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", gap: 8 }}>
                              <span>
                                <Icon name="bed" size={12} /> {u.bedrooms}
                              </span>
                              <span>
                                <Icon name="bath" size={12} /> {u.bathrooms}
                              </span>
                              {u.sqm != null ? (
                                <span>
                                  <Icon name="sqm" size={12} /> {u.sqm} m²
                                </span>
                              ) : null}
                            </div>
                            <div style={{ marginTop: 6 }}>
                              <Badge tone={uBadge.tone}>{uBadge.label}</Badge>
                            </div>
                          </div>
                          <PriceDisplay amount={Number(u.price)} period="/mo" size="sm" />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              <div style={{ marginTop: 12 }}>
                <Link
                  to={`/property/${property.id}`}
                  style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}
                >
                  View the whole property →
                </Link>
              </div>
            </DetailSection>
          ) : null}
        </main>

        {/* Sticky apply panel */}
        <aside>
          <Card padding={24} style={{ position: "sticky", top: 88 }}>
            <Eyebrow style={{ marginBottom: 8 }}>{unit.title}</Eyebrow>
            <PriceDisplay amount={Number(unit.price)} period="/ month" size="xl" />
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4, marginBottom: 20 }}>
              {unit.availableFrom ? `Available from ${unit.availableFrom}` : "Currently occupied"}
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                padding: "12px 0",
                borderTop: "1px solid var(--hairline)",
                borderBottom: "1px solid var(--hairline)",
                marginBottom: 16,
              }}
            >
              <Tag icon="bed" label={`${unit.bedrooms} bed`} />
              <Tag icon="bath" label={`${unit.bathrooms} bath`} />
              {unit.sqm != null ? <Tag icon="sqm" label={`${unit.sqm} m²`} /> : null}
            </div>

            {unit.deposit != null ? (
              <KeyValueRow
                label="Deposit"
                value={`R ${Number(unit.deposit).toLocaleString("en-ZA")}`}
                size="sm"
              />
            ) : null}
            <KeyValueRow label="Application fee" value="Free" size="sm" divider />
            <KeyValueRow label="Furnishing" value={furnishingLabel} size="sm" divider />
            <KeyValueRow
              label="Status"
              value={badge.label}
              tone={badge.tone === "success" ? "success" : badge.tone === "warn" ? "warn" : "neutral"}
              size="sm"
              divider
            />

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {canApply ? (
                <>
                  <Link
                    to={`/apply?unit=${unit.id}&prop=${property.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="accent"
                      size="lg"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Apply for {unit.title}
                    </Button>
                  </Link>
                  <Link
                    to={`/book-viewing?unit=${unit.id}&prop=${property.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      leftIcon="calendar"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Book a viewing
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon="bell"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Notify me when available
                </Button>
              )}
            </div>

            {property.manager ? (
              <div style={{ borderTop: "1px solid var(--hairline)", marginTop: 20, paddingTop: 20 }}>
                <Eyebrow style={{ marginBottom: 10 }}>Listed by</Eyebrow>
                <AgentCard
                  name={`${property.manager.firstName} ${property.manager.surname}`}
                  role="Landlord"
                  responseTime="Typically responds in 2 hours"
                  actions={
                    <Link to={`/inbox?to=${property.manager.id}`} aria-label="Message landlord">
                      <IconButton icon="chat" label="Message" variant="secondary" size="sm" />
                    </Link>
                  }
                />
              </div>
            ) : null}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 32, borderTop: "1px solid var(--hairline)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>{title}</h3>
        {subtitle ? <span style={{ fontSize: 13, color: "var(--slate)" }}>{subtitle}</span> : null}
      </div>
      {children}
    </section>
  );
}

function QuickStat({
  icon,
  label,
  value,
  divider,
}: {
  icon: IconName;
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <div
      style={{
        padding: 20,
        borderRight: divider ? "1px solid var(--hairline)" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--slate)", marginBottom: 6 }}>
        <Icon name={icon} size={14} />
        <span style={{ fontSize: 12 }}>{label}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Tag({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink)" }}>
      <Icon name={icon} size={14} style={{ color: "var(--slate)" }} /> {label}
    </span>
  );
}
