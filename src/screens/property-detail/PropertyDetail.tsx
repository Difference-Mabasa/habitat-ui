import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import { useViewport } from "@/hooks/useViewport";
import Photo from "@/components/Photo";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceDisplay from "@/components/PriceDisplay";
import RatingDisplay from "@/components/RatingDisplay";
import AgentCard from "@/components/AgentCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import NearbyPlaces from "./NearbyPlaces";
import { useSession } from "@/lib/session";
import { useSavedProperties } from "@/lib/useSavedProperties";
import { toast } from "@/lib/toast";
import {
  createPropertiesApi,
  type PropertyDetail as PropertyDetailDto,
  type PropertyStatus,
  type UnitDetail,
  type UnitStatus,
} from "@/lib/api/properties";

const UNIT_BADGE: Record<UnitStatus, { tone: "success" | "neutral" | "warn"; label: string }> = {
  AVAILABLE: { tone: "success", label: "Available" },
  OCCUPIED: { tone: "neutral", label: "Occupied" },
  UNDER_MAINTENANCE: { tone: "warn", label: "Maintenance" },
  UNLISTED: { tone: "neutral", label: "Unlisted" },
};

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split("_")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * Property-level amenities derived from the unit-level boolean flags
 * (waterIncluded / electricityIncluded / petsAllowed). The rule is
 * "any unit grants it" so a property with one pet-friendly unit reads
 * "Pets allowed" even if other units don't accept pets. Honest enough
 * for the listing card while a real Amenity entity is unspeced.
 */
function deriveAmenities(units: UnitDetail[]): { i: IconName; t: string }[] {
  if (units.length === 0) return [];
  const amenities: { i: IconName; t: string }[] = [];
  if (units.some((u) => u.waterIncluded)) {
    amenities.push({ i: "bath", t: "Water included" });
  }
  if (units.some((u) => u.electricityIncluded)) {
    amenities.push({ i: "bolt", t: "Electricity included" });
  }
  if (units.some((u) => u.petsAllowed)) {
    amenities.push({ i: "heart", t: "Pets allowed" });
  }
  if (units.some((u) => u.furnishing === "FURNISHED")) {
    amenities.push({ i: "home", t: "Fully furnished unit" });
  } else if (units.some((u) => u.furnishing === "SEMI_FURNISHED")) {
    amenities.push({ i: "home", t: "Semi-furnished unit" });
  }
  return amenities;
}

export default function PropertyDetail() {
  const { id: propertyId } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const ctx = params.get("ctx");
  const session = useSession();
  const api = useMemo(() => createPropertiesApi(session.client), [session.client]);

  const [property, setProperty] = useState<PropertyDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSaved, toggle: toggleSaved } = useSavedProperties();

  function handleShare() {
    if (!property) return;
    const url = window.location.href;
    const title = property.title;
    if (typeof navigator.share === "function") {
      navigator
        .share({ title, url })
        .catch(() => {
          // User cancelled the native sheet — silent.
        });
      return;
    }
    void navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Couldn't copy the link"));
  }

  useEffect(() => {
    if (!propertyId || propertyId === ":id") {
      setLoading(false);
      setError("No property selected. Open one from /browse.");
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

  const canEdit = ctx === "landlord" || ctx === "agent";
  const editHref = `/wizard?edit=${propertyId ?? ""}${ctx === "agent" ? "&ctx=agent" : ""}`;
  const units: UnitDetail[] = useMemo(() => property?.units ?? [], [property]);
  const availableUnits = units.filter((u) => u.status === "AVAILABLE");
  const listingState: PropertyStatus = property?.status ?? "LISTED";
  const galleryPhotos = useMemo(() => {
    if (!property) return [] as string[];
    const propUrls = property.images.map((i) => i.url);
    const unitUrls = property.units.flatMap((u) => u.images.map((i) => i.url));
    return [...propUrls, ...unitUrls].slice(0, 5);
  }, [property]);

  const earliestMoveIn = useMemo(() => {
    const dates = availableUnits
      .map((u) => u.availableFrom)
      .filter((d): d is string => Boolean(d))
      .sort();
    return dates[0] ?? null;
  }, [availableUnits]);

  const quickStats: { i: IconName; l: string; v: string }[] = property
    ? [
        { i: "home", l: "Property type", v: titleCase(property.propertyType) },
        { i: "users", l: "Units available", v: `${availableUnits.length} of ${units.length}` },
        { i: "calendar", l: "Earliest move-in", v: earliestMoveIn ?? "—" },
        {
          i: "star",
          l: "Rating",
          v:
            property.ratingCount > 0
              ? `★ ${Number(property.avgRating).toFixed(1)} · ${property.ratingCount} ${property.ratingCount === 1 ? "review" : "reviews"}`
              : "No reviews yet",
        },
      ]
    : [];

  const amenities = useMemo(() => deriveAmenities(units), [units]);

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

  if (error || !property) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px" }}>
          <ErrorState
            title="Property not found"
            description={error ?? "This property may have been unlisted."}
          />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/browse">
              <Button variant="ghost" leftIcon="arrR">
                Back to browse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 32px" }}>
          <Breadcrumbs
            items={[
              { label: "Browse", href: "/browse" },
              { label: "Property" },
            ]}
          />
        </div>
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "16px 16px" : "24px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isSm ? "1fr" : "2fr 1fr 1fr",
            gridTemplateRows: isSm ? "320px" : "1fr 1fr",
            gap: 8,
            height: isSm ? 320 : 480,
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {galleryPhotos.map((src, i) => (
            <Photo
              key={src + i}
              ratio="auto"
              src={src}
              label=""
              style={i === 0
                ? { gridRow: isSm ? undefined : "1 / 3", borderRadius: 0, height: "100%" }
                : { borderRadius: 0, height: "100%" }}
            />
          ))}
          {galleryPhotos.length === 0 ? (
            <Photo ratio="auto" label="No photos" style={{ borderRadius: 0, height: "100%" }} />
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: isSm ? "24px 16px 64px" : "32px 32px 80px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 380px",
          gap: 64,
        }}
      >
        <main>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge tone="success" leftIcon="check">
                  Verified
                </Badge>
                <Badge tone={listingState === "LISTED" ? "success" : listingState === "DRAFT" ? "warn" : "neutral"}>
                  {listingState}
                </Badge>
              </div>
              <h1
                style={{
                  fontSize: 36,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  fontWeight: 500,
                  margin: "0 0 10px",
                }}
              >
                {property.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--slate)", fontSize: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={14} />
                  {[property.suburb, property.city, property.province].filter(Boolean).join(", ") || "—"}
                </span>
                {property.ratingCount > 0 ? (
                  <>
                    <span>·</span>
                    <RatingDisplay
                      rating={Number(property.avgRating)}
                      count={property.ratingCount}
                      size="sm"
                    />
                  </>
                ) : null}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {canEdit ? (
                <Link to={editHref} style={{ textDecoration: "none" }}>
                  <Button variant="accent" size="sm" leftIcon="edit">
                    Edit listing
                  </Button>
                </Link>
              ) : null}
              <Button
                variant={isSaved(property.id) ? "accent" : "secondary"}
                size="sm"
                leftIcon="heart"
                onClick={() => toggleSaved(property.id)}
              >
                {isSaved(property.id) ? "Saved" : "Save"}
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
            {quickStats.map((s, i) => (
              <div
                key={s.l}
                style={{ padding: 20, borderRight: i < quickStats.length - 1 ? "1px solid var(--hairline)" : "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--slate)", marginBottom: 6 }}>
                  <Icon name={s.i} size={14} />
                  <span style={{ fontSize: 12 }}>{s.l}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.v}</div>
              </div>
            ))}
          </div>

          <DetailSection title="About this property">
            <p style={{ fontSize: 15, color: "var(--slate)", lineHeight: 1.7, margin: "0 0 12px" }}>
              {property.description ?? "—"}
            </p>
          </DetailSection>

          <DetailSection
            title="Units"
            subtitle={`${availableUnits.length} of ${units.length} available · click a unit for photos & apply`}
          >
            {units.length === 0 ? (
              <EmptyState icon="home" title="No units yet" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {units.map((u) => (
                  <UnitRow key={u.id} unit={u} />
                ))}
              </div>
            )}
          </DetailSection>

          <DetailSection title="Amenities">
            {amenities.length === 0 ? (
              <EmptyState icon="home" title="No amenities listed" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isSm ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 14 }}>
                {amenities.map((a) => (
                  <div
                    key={a.t}
                    style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "var(--ink)" }}
                  >
                    <Icon name={a.i} size={16} style={{ color: "var(--slate)" }} />
                    {a.t}
                  </div>
                ))}
              </div>
            )}
          </DetailSection>

          {property.latitude != null && property.longitude != null ? (
            <DetailSection title="Neighbourhood">
              <NearbyPlaces latitude={property.latitude} longitude={property.longitude} />
            </DetailSection>
          ) : null}
        </main>

        {/* Sticky property-info panel */}
        <aside>
          <Card padding={24} style={{ position: "sticky", top: 88 }}>
            <Eyebrow style={{ marginBottom: 8 }}>About this property</Eyebrow>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              {property.title}
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
              {units.length} units · {availableUnits.length} available
            </div>

            <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 12 }}>
              {availableUnits.length > 0 ? (
                <>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 10 }}>
                    Pick a unit to see its photos and apply
                  </div>
                  {availableUnits.map((u) => (
                    <Link
                      key={u.id}
                      to={`/unit?id=${u.id}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderTop: "1px solid var(--hairline)",
                        textDecoration: "none",
                        color: "var(--ink)",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{u.title}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <PriceDisplay amount={Number(u.price)} period="/mo" size="sm" />
                        <Icon name="chevR" size={14} style={{ color: "var(--slate)" }} />
                      </span>
                    </Link>
                  ))}
                </>
              ) : (
                <div style={{ fontSize: 13, color: "var(--slate)" }}>
                  All units are currently let. Set a saved search to be notified when one opens.
                </div>
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

function UnitRow({ unit }: { unit: UnitDetail }) {
  const closed = unit.status !== "AVAILABLE";
  const badge = UNIT_BADGE[unit.status];
  const cover = unit.images.find((i) => i.isCover)?.url ?? unit.images[0]?.url;
  return (
    <Link
      to={`/unit?id=${unit.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "grid",
        gridTemplateColumns: "100px 1fr auto auto auto",
        gap: 16,
        alignItems: "center",
        padding: 12,
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        background: "var(--surface)",
        opacity: closed ? 0.7 : 1,
        cursor: "pointer",
        transition: "border-color 150ms, background 150ms",
      }}
    >
      <Photo ratio="4/3" src={cover} label="" style={{ borderRadius: 8 }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{unit.title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", gap: 10 }}>
          <span><Icon name="bed" size={12} /> {unit.bedrooms}</span>
          <span><Icon name="bath" size={12} /> {unit.bathrooms}</span>
          {unit.sqm != null ? (
            <span><Icon name="sqm" size={12} /> {unit.sqm} m²</span>
          ) : null}
        </div>
      </div>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <PriceDisplay amount={Number(unit.price)} period="" size="md" />
        <span style={{ fontSize: 11, color: "var(--slate)" }}>
          {unit.availableFrom ?? "Currently occupied"}
        </span>
      </span>
      <Badge tone={badge.tone}>{badge.label}</Badge>
      <Icon name="chevR" size={16} style={{ color: "var(--slate)" }} />
    </Link>
  );
}
