import { Link, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
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
import NearbyPlaces from "./NearbyPlaces";

type UnitStatus = "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE" | "UNLISTED";

interface Unit {
  /** Slug used in /unit?id=… */
  id: string;
  name: string;
  price: number;
  beds: number;
  baths: number;
  sqm: number;
  unitStatus: UnitStatus;
  available: string | null;
}

const UNITS: Unit[] = [
  { id: "u1", name: "Backroom A", price: 4200, beds: 1, baths: 1, sqm: 22, unitStatus: "OCCUPIED", available: null },
  { id: "u2", name: "Backroom B", price: 4400, beds: 1, baths: 1, sqm: 24, unitStatus: "AVAILABLE", available: "Available now" },
  { id: "u3", name: "Garden Cottage", price: 6800, beds: 2, baths: 1, sqm: 48, unitStatus: "AVAILABLE", available: "Available 1 May" },
  { id: "u4", name: "Backroom C", price: 4400, beds: 1, baths: 1, sqm: 22, unitStatus: "UNDER_MAINTENANCE", available: "Available from 1 Jul (geyser replacement)" },
  { id: "u5", name: "Studio Loft", price: 6200, beds: 1, baths: 1, sqm: 32, unitStatus: "UNLISTED", available: null },
];

const UNIT_BADGE: Record<UnitStatus, { tone: "success" | "neutral" | "warn"; label: string }> = {
  AVAILABLE: { tone: "success", label: "Available" },
  OCCUPIED: { tone: "neutral", label: "Occupied" },
  UNDER_MAINTENANCE: { tone: "warn", label: "Maintenance" },
  UNLISTED: { tone: "neutral", label: "Unlisted" },
};

const AMENITIES: { i: IconName; t: string }[] = [
  { i: "park", t: "1 parking bay" },
  { i: "wifi", t: "Fibre ready" },
  { i: "pet", t: "Pet friendly" },
  { i: "bolt", t: "Backup power" },
  { i: "shield", t: "24h security" },
  { i: "flame", t: "Gas cooker" },
];

const QUICK_STATS: { i: IconName; l: string; v: string }[] = [
  { i: "home", l: "Property type", v: "Free-standing house" },
  { i: "users", l: "Units available", v: "2 of 3" },
  { i: "calendar", l: "Earliest move-in", v: "Now" },
  { i: "shield", l: "Verified by", v: "Habitat · Mar 2026" },
];

type ListingState = "DRAFT" | "LISTED" | "UNLISTED";

export default function PropertyDetail() {
  const [params] = useSearchParams();
  const ctx = params.get("ctx");
  const propertyId = params.get("id") ?? "p1";
  const canEdit = ctx === "landlord" || ctx === "agent";
  const editHref = `/wizard?edit=${propertyId}${ctx === "agent" ? "&ctx=agent" : ""}`;
  const availableUnits = UNITS.filter((u) => u.unitStatus === "AVAILABLE");
  const listingState: ListingState = "LISTED";
  const listingSource: "LISTED_BY_OWNER" | "BY_AGENT" = "BY_AGENT";
  const listingAgent = "Naledi M. · Vilakazi Property Co.";

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 32px" }}>
          <Breadcrumbs
            items={[
              { label: "Browse", href: "/browse" },
              { label: "Johannesburg", href: "/browse" },
              { label: "Brixton", href: "/browse" },
              { label: "Sunlit Property · 12 Caroline St" },
            ]}
          />
        </div>
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 8,
            height: 480,
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Photo ratio="auto" label="hero · facade.jpg" style={{ gridRow: "1 / 3", borderRadius: 0, height: "100%" }} />
          <Photo ratio="auto" label="kitchen.jpg" style={{ borderRadius: 0, height: "100%" }} />
          <Photo ratio="auto" label="garden.jpg" style={{ borderRadius: 0, height: "100%" }} />
          <Photo ratio="auto" label="bedroom.jpg" style={{ borderRadius: 0, height: "100%" }} />
          <Photo ratio="auto" label="bath.jpg" style={{ borderRadius: 0, height: "100%" }} />
          <Button
            variant="secondary"
            size="sm"
            leftIcon="grid"
            style={{ position: "absolute", bottom: 16, right: 16 }}
          >
            View 24 photos
          </Button>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "32px 32px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 380px",
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
                <Badge tone={listingSource === "BY_AGENT" ? "accent" : "neutral"}>
                  {listingSource === "BY_AGENT" ? `Listed by ${listingAgent}` : "Listed by owner"}
                </Badge>
                <Badge tone="success" leftIcon="key">Mandate · Full management</Badge>
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
                Sunlit Property on Caroline
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--slate)", fontSize: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={14} /> 12 Caroline St, Brixton, JHB
                </span>
                <span>·</span>
                <RatingDisplay rating={4.8} count={32} size="sm" />
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
              <Button variant="secondary" size="sm" leftIcon="heart">
                Save
              </Button>
              <Button variant="secondary" size="sm" leftIcon="arrUR">
                Share
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              border: "1px solid var(--hairline)",
              borderRadius: 12,
              marginBottom: 32,
            }}
          >
            {QUICK_STATS.map((s, i) => (
              <div
                key={s.l}
                style={{ padding: 20, borderRight: i < QUICK_STATS.length - 1 ? "1px solid var(--hairline)" : "none" }}
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
              A quiet, walled property on a leafy stretch of Caroline Street with three rentable units sharing a
              north-facing garden and laundry yard. Two minutes' walk to 7th Avenue cafés, ten minutes by car to
              Wits and Helen Joseph Hospital. The owner lives in the main house.
            </p>
            <a
              href="#"
              style={{
                fontSize: 14,
                color: "var(--ink)",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Read more <Icon name="chevD" size={14} />
            </a>
          </DetailSection>

          <DetailSection
            title="Units"
            subtitle={`${availableUnits.length} of ${UNITS.length} available · click a unit for photos &amp; apply`}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {UNITS.map((u) => (
                <UnitRow key={u.id} unit={u} />
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Amenities">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {AMENITIES.map((a) => (
                <div
                  key={a.t}
                  style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "var(--ink)" }}
                >
                  <Icon name={a.i} size={16} style={{ color: "var(--slate)" }} />
                  {a.t}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Neighbourhood" subtitle="Nearby places · 12">
            <NearbyPlaces />
          </DetailSection>
        </main>

        {/* Sticky property-info panel */}
        <aside>
          <Card padding={24} style={{ position: "sticky", top: 88 }}>
            <Eyebrow style={{ marginBottom: 8 }}>About this property</Eyebrow>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
              Sunlit Property on Caroline
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
              {UNITS.length} units · {availableUnits.length} available
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
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <PriceDisplay amount={u.price} period="/mo" size="sm" />
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

            <div style={{ borderTop: "1px solid var(--hairline)", marginTop: 20, paddingTop: 20 }}>
              <AgentCard
                name="Thandi Mokoena"
                role="Landlord"
                responseTime="responds in ~2 hrs"
                actions={
                  <Link to="/inbox" aria-label="Message landlord">
                    <IconButton icon="chat" label="Message" variant="secondary" size="sm" />
                  </Link>
                }
              />
            </div>
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

function UnitRow({ unit }: { unit: Unit }) {
  const closed = unit.unitStatus !== "AVAILABLE";
  const badge = UNIT_BADGE[unit.unitStatus];
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
      <Photo ratio="4/3" label="" style={{ borderRadius: 8 }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{unit.name}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", gap: 10 }}>
          <span><Icon name="bed" size={12} /> {unit.beds}</span>
          <span><Icon name="bath" size={12} /> {unit.baths}</span>
          <span><Icon name="sqm" size={12} /> {unit.sqm} m²</span>
        </div>
      </div>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <PriceDisplay amount={unit.price} period="" size="md" />
        <span style={{ fontSize: 11, color: "var(--slate)" }}>
          {unit.available ?? "Currently occupied"}
        </span>
      </span>
      <Badge tone={badge.tone}>{badge.label}</Badge>
      <Icon name="chevR" size={16} style={{ color: "var(--slate)" }} />
    </Link>
  );
}
