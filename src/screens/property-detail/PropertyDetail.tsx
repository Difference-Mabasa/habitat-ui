import type { ReactNode } from "react";
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
import Select from "@/components/Select";
import Breadcrumbs from "@/components/Breadcrumbs";
import PriceDisplay from "@/components/PriceDisplay";
import RatingDisplay from "@/components/RatingDisplay";
import AgentCard from "@/components/AgentCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import NearbyPlaces from "./NearbyPlaces";
import PhotoLightbox from "@/components/PhotoLightbox";
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
  /** Every photo on the property + units, in display order. The header
   *  gallery shows the first five; the lightbox cycles through all. */
  const allPhotos = useMemo(() => {
    if (!property) return [] as string[];
    const propUrls = property.images.map((i) => i.url);
    const unitUrls = property.units.flatMap((u) => u.images.map((i) => i.url));
    return [...propUrls, ...unitUrls];
  }, [property]);
  const galleryPhotos = useMemo(() => allPhotos.slice(0, 5), [allPhotos]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  // ── Units section: sort + paginate ──
  type UnitSort = "price-asc" | "price-desc";
  const UNITS_PER_PAGE = 9;
  const [unitSort, setUnitSort] = useState<UnitSort>("price-asc");
  const [unitPage, setUnitPage] = useState(0);

  const sortedUnits = useMemo(() => {
    const next = [...units];
    next.sort((a, b) =>
      unitSort === "price-asc"
        ? Number(a.price) - Number(b.price)
        : Number(b.price) - Number(a.price),
    );
    return next;
  }, [units, unitSort]);

  const unitPageCount = Math.max(1, Math.ceil(sortedUnits.length / UNITS_PER_PAGE));
  // Clamp the current page if the catalogue shrinks (status changes, etc.)
  const safeUnitPage = Math.min(unitPage, unitPageCount - 1);
  const unitsOnPage = sortedUnits.slice(
    safeUnitPage * UNITS_PER_PAGE,
    safeUnitPage * UNITS_PER_PAGE + UNITS_PER_PAGE,
  );
  const unitsShownFrom = sortedUnits.length === 0 ? 0 : safeUnitPage * UNITS_PER_PAGE + 1;
  const unitsShownTo = Math.min(sortedUnits.length, (safeUnitPage + 1) * UNITS_PER_PAGE);
  const unitGridCols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

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
            <button
              key={src + i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Open photo ${i + 1} of ${allPhotos.length}`}
              style={{
                padding: 0,
                border: 0,
                background: "transparent",
                cursor: "pointer",
                ...(i === 0 && !isSm
                  ? { gridRow: "1 / 3" }
                  : {}),
              }}
            >
              <Photo
                ratio="auto"
                src={src}
                label=""
                style={{ borderRadius: 0, height: "100%" }}
              />
            </button>
          ))}
          {galleryPhotos.length === 0 ? (
            <Photo ratio="auto" label="No photos" style={{ borderRadius: 0, height: "100%" }} />
          ) : null}

          {/* "View all" pill — only when there's more than fits in the grid. */}
          {allPhotos.length > galleryPhotos.length ? (
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              style={{
                position: "absolute",
                right: 16,
                bottom: 16,
                padding: "8px 14px",
                background: "var(--paper)",
                color: "var(--ink)",
                border: "1px solid var(--hairline)",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "var(--shadow-md)",
                fontFamily: "inherit",
              }}
            >
              <Icon name="grid" size={14} />
              View all {allPhotos.length} photos
            </button>
          ) : null}
        </div>
      </div>

      <PhotoLightbox
        photos={allPhotos}
        index={lightboxIndex}
        onChange={setLightboxIndex}
        alt={property.title}
      />

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

          <DetailSection
            title="Units"
            subtitle={`${availableUnits.length} of ${units.length} available`}
            actions={
              units.length > 1 ? (
                <Select
                  aria-label="Sort units"
                  value={unitSort}
                  onChange={(e) => {
                    setUnitSort(e.target.value as UnitSort);
                    setUnitPage(0);
                  }}
                  options={[
                    { value: "price-asc", label: "Price: Low to high" },
                    { value: "price-desc", label: "Price: High to low" },
                  ]}
                  style={{ width: 200 }}
                />
              ) : null
            }
          >
            {units.length === 0 ? (
              <EmptyState icon="home" title="No units yet" />
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: unitGridCols, gap: 16 }}>
                  {unitsOnPage.map((u) => (
                    <UnitCard key={u.id} unit={u} />
                  ))}
                </div>
                {unitPageCount > 1 ? (
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--slate)" }}>
                      Showing {unitsShownFrom}–{unitsShownTo} of {sortedUnits.length}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon="chevL"
                        disabled={safeUnitPage === 0}
                        onClick={() => setUnitPage((p) => Math.max(0, p - 1))}
                      >
                        Prev
                      </Button>
                      <span
                        className="mono"
                        style={{ fontSize: 12, color: "var(--slate)", padding: "0 8px" }}
                      >
                        {safeUnitPage + 1} / {unitPageCount}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon="chevR"
                        disabled={safeUnitPage >= unitPageCount - 1}
                        onClick={() => setUnitPage((p) => Math.min(unitPageCount - 1, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
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
          <Card padding={24} style={{ position: "sticky", top: 88, maxHeight: "calc(100vh - 104px)", overflowY: "auto" }}>
            <Eyebrow style={{ marginBottom: 8 }}>About this property</Eyebrow>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              {property.title}
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
              {titleCase(property.propertyType)} · {units.length} {units.length === 1 ? "unit" : "units"} · {availableUnits.length} available
            </div>

            {property.description ? (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--slate)",
                  lineHeight: 1.6,
                  margin: "0 0 16px",
                  whiteSpace: "pre-line",
                }}
              >
                {property.description}
              </p>
            ) : null}

            {amenities.length > 0 ? (
              <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 12, marginBottom: 4 }}>
                <Eyebrow style={{ marginBottom: 10 }}>Amenities</Eyebrow>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {amenities.map((a) => (
                    <li
                      key={a.t}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                        color: "var(--ink)",
                      }}
                    >
                      <Icon name={a.i} size={14} style={{ color: "var(--slate)" }} />
                      {a.t}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 12, marginTop: 16 }}>
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
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Right-aligned controls in the header — sort dropdown, view toggles, etc. */
  actions?: ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 32, borderTop: "1px solid var(--hairline)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {subtitle ? <span style={{ fontSize: 13, color: "var(--slate)" }}>{subtitle}</span> : null}
          {actions}
        </div>
      </div>
      {children}
    </section>
  );
}

function UnitCard({ unit }: { unit: UnitDetail }) {
  const closed = unit.status !== "AVAILABLE";
  const badge = UNIT_BADGE[unit.status];
  const cover = unit.images.find((i) => i.isCover)?.url ?? unit.images[0]?.url;
  return (
    <Link
      to={`/unit?id=${unit.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        background: "var(--surface)",
        opacity: closed ? 0.7 : 1,
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 150ms, box-shadow 150ms",
      }}
    >
      <div style={{ position: "relative" }}>
        <Photo ratio="4/3" src={cover} label="" style={{ borderRadius: 0 }} />
        <span style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </span>
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {unit.title}
          </span>
          <PriceDisplay amount={Number(unit.price)} period="/mo" size="sm" />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 12,
            color: "var(--slate)",
            paddingTop: 8,
            borderTop: "1px solid var(--hairline)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="bed" size={13} /> {unit.bedrooms}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="bath" size={13} /> {unit.bathrooms}
          </span>
          {unit.sqm != null ? (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="sqm" size={13} /> {unit.sqm} m²
            </span>
          ) : null}
          <span style={{ marginLeft: "auto", fontSize: 11 }}>
            {unit.availableFrom ?? "Occupied"}
          </span>
        </div>
      </div>
    </Link>
  );
}
