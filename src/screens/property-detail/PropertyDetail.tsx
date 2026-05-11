import { useState } from "react";
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
import KeyValueRow from "@/components/KeyValueRow";
import RatingDisplay from "@/components/RatingDisplay";
import AgentCard from "@/components/AgentCard";

interface Unit {
  id: number;
  name: string;
  price: number;
  beds: number;
  baths: number;
  sqm: number;
  status: "open" | "let";
  available: string | null;
}

const UNITS: Unit[] = [
  { id: 0, name: "Backroom A", price: 4200, beds: 1, baths: 1, sqm: 22, status: "let", available: null },
  { id: 1, name: "Backroom B", price: 4400, beds: 1, baths: 1, sqm: 24, status: "open", available: "Available now" },
  { id: 2, name: "Garden Cottage", price: 6800, beds: 2, baths: 1, sqm: 48, status: "open", available: "Available 1 May" },
];

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
  { i: "shield", l: "Verified by", v: "Backroom · Mar 2026" },
];

const NEIGHBOURHOOD_STATS = [
  { l: "Walk to 7th Ave cafés", v: "3 min" },
  { l: "Drive to Wits", v: "8 min" },
  { l: "Helen Joseph Hospital", v: "12 min" },
];

export default function PropertyDetail() {
  const [unitId, setUnitId] = useState(1);
  const activeUnit = UNITS.find((u) => u.id === unitId) ?? UNITS[1];

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
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Badge tone="success" leftIcon="check">
                  Verified
                </Badge>
                <Badge tone="neutral">Single landlord</Badge>
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

          <DetailSection title="Available units" subtitle="2 of 3 open">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {UNITS.map((u) => (
                <UnitRow
                  key={u.id}
                  unit={u}
                  active={unitId === u.id}
                  onClick={() => u.status === "open" && setUnitId(u.id)}
                />
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

          <DetailSection title="Neighbourhood">
            <div
              style={{
                height: 220,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    repeating-linear-gradient(0deg, transparent 0 56px, rgba(11,13,18,0.04) 56px 57px),
                    repeating-linear-gradient(90deg, transparent 0 56px, rgba(11,13,18,0.04) 56px 57px),
                    var(--surface-2)
                  `,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -100%)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  boxShadow: "var(--shadow-md)",
                }}
              >
                R 4.4k
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {NEIGHBOURHOOD_STATS.map((x) => (
                <div key={x.l} style={{ padding: 14, border: "1px solid var(--hairline)", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{x.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{x.v}</div>
                </div>
              ))}
            </div>
          </DetailSection>
        </main>

        {/* Sticky apply panel */}
        <aside>
          <Card padding={24} style={{ position: "sticky", top: 24 }}>
            <Eyebrow style={{ marginBottom: 8 }}>{activeUnit.name}</Eyebrow>
            <PriceDisplay amount={activeUnit.price} period="/ month" size="xl" />
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4, marginBottom: 20 }}>
              {activeUnit.available}
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
              <Tag icon="bed" label={`${activeUnit.beds} bed`} />
              <Tag icon="bath" label={`${activeUnit.baths} bath`} />
              <Tag icon="sqm" label={`${activeUnit.sqm} m²`} />
            </div>

            <p style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16, lineHeight: 1.5 }}>
              You can apply in 4 minutes. We'll verify your FICA and affordability before sharing with the
              landlord.
            </p>

            <Button variant="accent" size="lg" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>
              Apply for this unit
            </Button>
            <Button
              variant="secondary"
              size="lg"
              leftIcon="calendar"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Book a viewing
            </Button>

            <div style={{ borderTop: "1px solid var(--hairline)", marginTop: 20, paddingTop: 20 }}>
              <AgentCard
                name="Thandi Mokoena"
                role="Landlord"
                responseTime="responds in ~2 hrs"
                actions={<IconButton icon="chat" label="Message" variant="secondary" size="sm" />}
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

function Tag({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--slate)" }}>
      <Icon name={icon} size={14} /> {label}
    </span>
  );
}

function UnitRow({
  unit,
  active,
  onClick,
}: {
  unit: Unit;
  active: boolean;
  onClick: () => void;
}) {
  const closed = unit.status !== "open";
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr auto auto",
        gap: 16,
        alignItems: "center",
        padding: 12,
        border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
        borderRadius: 12,
        background: active ? "var(--surface-2)" : "var(--surface)",
        opacity: closed ? 0.5 : 1,
        cursor: closed ? "default" : "pointer",
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
      <KeyValueRow
        label=""
        value={
          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <PriceDisplay amount={unit.price} period="" size="md" />
            <span style={{ fontSize: 11, color: "var(--slate)", fontWeight: 400 }}>
              {closed ? "Currently let" : unit.available}
            </span>
          </span>
        }
      />
      {closed ? (
        <Badge tone="neutral">Let</Badge>
      ) : (
        <Button variant="secondary" size="sm" rightIcon="chevR">
          View
        </Button>
      )}
    </div>
  );
}
