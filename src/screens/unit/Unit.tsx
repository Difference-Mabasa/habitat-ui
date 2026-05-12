import { Link, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
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

type UnitStatus = "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE" | "UNLISTED";

interface UnitAmenity {
  icon: IconName;
  label: string;
}

interface UnitDetail {
  id: string;
  name: string;
  unitNumber: string;
  property: string;
  propertyId: string;
  address: string;
  area: string;
  type: string;
  furnishing: "Furnished" | "Unfurnished" | "Partially furnished";
  beds: number;
  baths: number;
  sqm: number;
  price: number;
  deposit: number;
  status: UnitStatus;
  availableFrom: string | null;
  description: string;
  amenities: UnitAmenity[];
  photos: string[];
  /** Floor (e.g. "Ground", "First floor") or "Standalone". */
  floor: string;
  /** Inclusions list (water, internet, etc.) */
  inclusions: string[];
}

const UNITS: Record<string, UnitDetail> = {
  u1: {
    id: "u1",
    name: "Backroom A",
    unitNumber: "Unit 1",
    property: "Sunlit Property on Caroline",
    propertyId: "p1",
    address: "12 Caroline St, Brixton, JHB",
    area: "Brixton",
    type: "Backroom",
    furnishing: "Unfurnished",
    beds: 1,
    baths: 1,
    sqm: 22,
    price: 4200,
    deposit: 4200,
    status: "OCCUPIED",
    availableFrom: null,
    description:
      "Detached backroom on the north side of the property with its own entrance, small private patio, and an east-facing window for morning light. Currently let — see Backroom B for an open unit.",
    floor: "Standalone",
    inclusions: ["Water included", "Refuse included"],
    amenities: [
      { icon: "park", label: "1 parking bay" },
      { icon: "wifi", label: "Fibre ready" },
      { icon: "bolt", label: "Prepaid electricity" },
    ],
    photos: ["backroom-a · entrance", "backroom-a · interior", "backroom-a · kitchenette", "backroom-a · bath", "backroom-a · patio"],
  },
  u2: {
    id: "u2",
    name: "Backroom B",
    unitNumber: "Unit 2",
    property: "Sunlit Property on Caroline",
    propertyId: "p1",
    address: "12 Caroline St, Brixton, JHB",
    area: "Brixton",
    type: "Backroom",
    furnishing: "Partially furnished",
    beds: 1,
    baths: 1,
    sqm: 24,
    price: 4400,
    deposit: 4400,
    status: "AVAILABLE",
    availableFrom: "Available now",
    description:
      "Quiet backroom at the rear of the property with its own entrance off the laundry yard. Comes with a built-in wardrobe and a small kitchenette. Two minutes' walk to 7th Avenue cafés.",
    floor: "Standalone",
    inclusions: ["Water included", "Refuse included", "Wi-Fi included (50 Mbps)"],
    amenities: [
      { icon: "park", label: "1 parking bay" },
      { icon: "wifi", label: "Fibre ready" },
      { icon: "pet", label: "Pets considered" },
      { icon: "bolt", label: "Prepaid electricity" },
      { icon: "shield", label: "24h security" },
      { icon: "flame", label: "Gas stove" },
    ],
    photos: ["backroom-b · entrance", "backroom-b · main room", "backroom-b · kitchenette", "backroom-b · bath", "backroom-b · wardrobe"],
  },
  u3: {
    id: "u3",
    name: "Garden Cottage",
    unitNumber: "Unit 3",
    property: "Sunlit Property on Caroline",
    propertyId: "p1",
    address: "12 Caroline St, Brixton, JHB",
    area: "Brixton",
    type: "Cottage",
    furnishing: "Unfurnished",
    beds: 2,
    baths: 1,
    sqm: 48,
    price: 6800,
    deposit: 6800,
    status: "AVAILABLE",
    availableFrom: "Available 1 May",
    description:
      "Two-bed garden cottage with its own enclosed yard, separate from the main house. Open-plan kitchen/lounge, full bathroom, and a covered carport.",
    floor: "Standalone",
    inclusions: ["Water included", "Refuse included", "Garden maintenance"],
    amenities: [
      { icon: "park", label: "Covered carport" },
      { icon: "wifi", label: "Fibre ready" },
      { icon: "pet", label: "Pet friendly" },
      { icon: "bolt", label: "Prepaid electricity" },
      { icon: "shield", label: "Walled · gated" },
      { icon: "flame", label: "Gas hob + oven" },
    ],
    photos: ["cottage · facade", "cottage · lounge", "cottage · kitchen", "cottage · bedroom", "cottage · garden"],
  },
};

const UNIT_BADGE: Record<UnitStatus, { tone: BadgeTone; label: string }> = {
  AVAILABLE: { tone: "success", label: "Available" },
  OCCUPIED: { tone: "neutral", label: "Currently let" },
  UNDER_MAINTENANCE: { tone: "warn", label: "Maintenance" },
  UNLISTED: { tone: "neutral", label: "Unlisted" },
};

export default function Unit() {
  const [params] = useSearchParams();
  const id = params.get("id") ?? "u2";
  const unit = UNITS[id] ?? UNITS.u2;
  const badge = UNIT_BADGE[unit.status];
  const canApply = unit.status === "AVAILABLE";

  const otherUnits = Object.values(UNITS).filter((u) => u.id !== unit.id);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 32px" }}>
          <Breadcrumbs
            items={[
              { label: "Browse", href: "/browse" },
              { label: "Johannesburg", href: "/browse" },
              { label: unit.area, href: "/browse" },
              { label: unit.property, href: "/property" },
              { label: unit.name },
            ]}
          />
        </div>
      </div>

      {/* Gallery — 5-photo mosaic identical layout to /property */}
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
          <Photo
            ratio="auto"
            label={unit.photos[0]}
            style={{ gridRow: "1 / 3", borderRadius: 0, height: "100%" }}
          />
          {unit.photos.slice(1, 5).map((p) => (
            <Photo key={p} ratio="auto" label={p} style={{ borderRadius: 0, height: "100%" }} />
          ))}
          <Button
            variant="secondary"
            size="sm"
            leftIcon="grid"
            style={{ position: "absolute", bottom: 16, right: 16 }}
          >
            View {unit.photos.length} photos
          </Button>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "16px 32px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 380px",
          gap: 64,
        }}
      >
        <main>
          {/* Title + status */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <Badge tone={badge.tone}>{badge.label}</Badge>
                <Badge tone="neutral">{unit.type}</Badge>
                <Badge tone="neutral">{unit.furnishing}</Badge>
                {unit.availableFrom ? <Badge tone="accent">{unit.availableFrom}</Badge> : null}
              </div>
              <h1 style={{ fontSize: 36, letterSpacing: "-0.025em", lineHeight: 1.1, fontWeight: 500, margin: "0 0 8px" }}>
                {unit.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--slate)", fontSize: 14, flexWrap: "wrap" }}>
                <Link to="/property" style={{ color: "var(--slate)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="home" size={14} /> {unit.property}
                </Link>
                <span>·</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={14} /> {unit.address}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Button variant="secondary" size="sm" leftIcon="heart">Save</Button>
              <Button variant="secondary" size="sm" leftIcon="arrUR">Share</Button>
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
            <QuickStat icon="bed" label="Bedrooms" value={`${unit.beds}`} divider />
            <QuickStat icon="bath" label="Bathrooms" value={`${unit.baths}`} divider />
            <QuickStat icon="sqm" label="Floor area" value={`${unit.sqm} m²`} divider />
            <QuickStat icon="key" label="Floor / level" value={unit.floor} />
          </div>

          <DetailSection title={`About ${unit.name}`}>
            <p style={{ fontSize: 15, color: "var(--slate)", lineHeight: 1.7, margin: 0 }}>
              {unit.description}
            </p>
          </DetailSection>

          <DetailSection title="What's included">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {unit.inclusions.map((inc) => (
                <div key={inc} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                  <Icon name="check" size={14} style={{ color: "var(--success)" }} />
                  {inc}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Unit amenities" subtitle="Specific to this unit">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {unit.amenities.map((a) => (
                <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
                  <Icon name={a.icon} size={16} style={{ color: "var(--slate)" }} />
                  {a.label}
                </div>
              ))}
            </div>
          </DetailSection>

          {!canApply ? (
            <Alert tone="warn" title={`${unit.name} isn't taking applications right now`}>
              {unit.status === "OCCUPIED"
                ? "This unit is currently let. Set a saved search and we'll notify you when it opens."
                : unit.status === "UNDER_MAINTENANCE"
                  ? "This unit is being renovated. Check back closer to the move-in date."
                  : "This unit is unlisted. The landlord may relist it later."}
            </Alert>
          ) : null}

          <DetailSection title="Other units in this property" subtitle={`${otherUnits.length} more`}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {otherUnits.map((u) => {
                const uBadge = UNIT_BADGE[u.status];
                return (
                  <Link key={u.id} to={`/unit?id=${u.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Card padding={0} interactive style={{ overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 14, alignItems: "center", padding: 12 }}>
                        <Photo ratio="4/3" label={u.photos[0]} style={{ borderRadius: 8 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", gap: 8 }}>
                            <span><Icon name="bed" size={12} /> {u.beds}</span>
                            <span><Icon name="bath" size={12} /> {u.baths}</span>
                            <span><Icon name="sqm" size={12} /> {u.sqm} m²</span>
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <Badge tone={uBadge.tone}>{uBadge.label}</Badge>
                          </div>
                        </div>
                        <PriceDisplay amount={u.price} period="/mo" size="sm" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
            <div style={{ marginTop: 12 }}>
              <Link to="/property" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>
                View the whole property →
              </Link>
            </div>
          </DetailSection>
        </main>

        {/* Sticky apply panel */}
        <aside>
          <Card padding={24} style={{ position: "sticky", top: 88 }}>
            <Eyebrow style={{ marginBottom: 8 }}>{unit.name}</Eyebrow>
            <PriceDisplay amount={unit.price} period="/ month" size="xl" />
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4, marginBottom: 20 }}>
              {unit.availableFrom ?? "Currently occupied"}
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
              <Tag icon="bed" label={`${unit.beds} bed`} />
              <Tag icon="bath" label={`${unit.baths} bath`} />
              <Tag icon="sqm" label={`${unit.sqm} m²`} />
            </div>

            <KeyValueRow label="Deposit" value={`R ${unit.deposit.toLocaleString("en-ZA")}`} size="sm" />
            <KeyValueRow label="Application fee" value="Free" size="sm" divider />
            <KeyValueRow label="Furnishing" value={unit.furnishing} size="sm" divider />
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
                  <Link to={`/apply?unit=${unit.id}`} style={{ textDecoration: "none" }}>
                    <Button variant="accent" size="lg" style={{ width: "100%", justifyContent: "center" }}>
                      Apply for {unit.name}
                    </Button>
                  </Link>
                  <Link to="/book-viewing" style={{ textDecoration: "none" }}>
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
                <Button variant="secondary" size="lg" leftIcon="bell" style={{ width: "100%", justifyContent: "center" }}>
                  Notify me when available
                </Button>
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
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
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
    <div style={{ padding: 20, borderRight: divider ? "1px solid var(--hairline)" : "none" }}>
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
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--slate)" }}>
      <Icon name={icon} size={14} /> {label}
    </span>
  );
}
