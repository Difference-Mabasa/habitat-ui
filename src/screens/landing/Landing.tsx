import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import StatTile from "@/components/StatTile";
import AreaCard from "@/components/AreaCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import PropertyCard, { type PropertyCardData } from "@/components/PropertyCard";
import { useViewport } from "@/hooks/useViewport";
import HeroSearch from "./HeroSearch";

const FOOTER_COLUMNS = [
  { title: "Landlords", links: [
    { label: "List a property", href: "/list-property" },
    { label: "Pricing", href: "/pricing" },
    { label: "Find an agent", href: "/agent-browse" },
    { label: "Resources", href: "/help" },
  ] },
  { title: "Tenants", links: [
    { label: "Browse", href: "/browse" },
    { label: "Saved", href: "/saved" },
    { label: "How vetting works", href: "/help" },
    { label: "Communities", href: "/communities" },
  ] },
  { title: "Company", links: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ] },
  { title: "Legal", links: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "POPIA", href: "#" },
    { label: "Contact", href: "#" },
  ] },
];

export default function Landing() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <SearchHero />
      <Hero />
      <TrustBar />
      <TopRatedNearYou />
      <ValueGrid />
      <HowItWorks />
      <FeaturedAreas />
      <Footer
        columns={FOOTER_COLUMNS}
        tagline="The calmest way to rent out a backroom in South Africa. Built in Joburg."
        copyright="© 2026 Habitat · Your Spot. Your Hood."
      />
    </div>
  );
}

interface TopRatedItem {
  data: PropertyCardData;
  rating: number;
  reviews: number;
  distanceKm: number;
}

const TOP_RATED: TopRatedItem[] = [];

type LocationState = "ask" | "granted" | "denied";

function TopRatedNearYou() {
  const [location, setLocation] = useState<LocationState>("ask");
  const { isSm, isMd } = useViewport();
  const topRatedCols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "48px 20px" : "72px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Based on ratings &amp; your location</Eyebrow>
            <h2
              style={{
                fontSize: 40,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                fontWeight: 500,
                margin: 0,
              }}
            >
              Top rated <span style={{ color: "var(--accent)" }}>near you</span>
            </h2>
          </div>

          {location === "granted" ? (
            <Badge tone="success" leftIcon="pin">Sorted by distance from you</Badge>
          ) : location === "denied" ? (
            <Badge tone="neutral">Showing top-rated · location off</Badge>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              leftIcon="pin"
              onClick={() => setLocation("granted")}
            >
              Allow location for nearest results
            </Button>
          )}
        </div>

        {TOP_RATED.length === 0 ? (
          <EmptyState
            icon="home"
            title="No listings yet"
            description="Top-rated listings will appear here once they're published."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: topRatedCols, gap: 16 }}>
            {TOP_RATED.map((item) => (
              <TopRatedCard key={item.data.id} item={item} showDistance={location === "granted"} />
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Link to="/browse" style={{ textDecoration: "none" }}>
            <Button variant="ghost" rightIcon="arrR">
              Browse all listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TopRatedCard({
  item,
  showDistance,
}: {
  item: TopRatedItem;
  showDistance: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <PropertyCard
        data={{
          ...item.data,
          tag: `★ ${item.rating.toFixed(1)} · ${item.reviews} reviews`,
        }}
        variant="grid"
      />
      {showDistance ? (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12 + 32 + 8, // dodge the save heart on the card
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "4px 8px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "var(--shadow-sm)",
            pointerEvents: "none",
          }}
        >
          <Icon name="pin" size={11} /> {item.distanceKm.toFixed(1)} km
        </div>
      ) : null}
    </div>
  );
}

function SearchHero() {
  return (
    <section
      style={{
        borderBottom: "1px solid var(--hairline)",
        background:
          "radial-gradient(circle at 80% 20%, color-mix(in oklch, var(--accent) 18%, transparent), transparent 55%), var(--paper-2)",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "80px 32px 64px",
          textAlign: "center",
        }}
      >
        <Eyebrow style={{ marginBottom: 14, justifyContent: "center", display: "inline-flex" }}>
          Find your spot
        </Eyebrow>
        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            fontWeight: 500,
            margin: "8px 0 16px",
          }}
        >
          Your hood. <span style={{ color: "var(--accent)" }}>Your spot.</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--slate)",
            margin: "0 auto 32px",
            maxWidth: 580,
          }}
        >
          Verified backrooms, cottages and flatlets across South Africa. Pick a suburb, set your budget,
          go.
        </p>
        <HeroSearch />
        <div style={{ marginTop: 20, fontSize: 12, color: "var(--slate)" }}>
          Popular:{" "}
          {["Brixton", "Melville", "Soweto", "Yeoville"].map((s, i, arr) => (
            <span key={s}>
              <Link
                to={`/browse?location=${encodeURIComponent(s)}`}
                style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "none" }}
              >
                {s}
              </Link>
              {i < arr.length - 1 ? " · " : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: isSm ? "48px 20px 40px" : "80px 32px 64px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: isSm ? 32 : isMd ? 48 : 80,
          alignItems: "center",
        }}
      >
        <div>
          <div
            className="eyebrow"
            style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            For South African landlords
          </div>
          <h1
            style={{
              fontSize: 64,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              fontWeight: 500,
              margin: 0,
              marginBottom: 24,
            }}
          >
            List your backroom.
            <br />
            <span style={{ color: "var(--slate)" }}>Vet your tenant.</span>
            <br />
            Get paid on time.
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--slate)",
              margin: 0,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            Habitat is the calm, professional way to rent out a backroom, cottage or flatlet — with
            verified tenants, digital leases, and rent collection in one place.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
            <Link to="/wizard">
              <Button variant="primary" size="lg" rightIcon="arrR">
                List a property
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="secondary" size="lg">
                Browse units
              </Button>
            </Link>
          </div>

          <div style={{ display: "flex", gap: 40, paddingTop: 28, borderTop: "1px solid var(--hairline)" }}>
            <StatTile value="—" label="active listings" />
            <StatTile value="—" label="rent processed" />
            <StatTile value="—" label="median time-to-listed" />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <Photo ratio="4/5" label="Property cover photo" />
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const cities = ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Gqeberha", "Polokwane", "Bloemfontein"];
  return (
    <section
      style={{
        borderBottom: "1px solid var(--hairline)",
        background: "var(--surface-2)",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <Eyebrow>Trusted across</Eyebrow>
        {cities.map((c) => (
          <span key={c} style={{ fontSize: 13, color: "var(--slate)", fontWeight: 500 }}>
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}

const VALUE_ITEMS: { icon: import("@/components/Icon").IconName; t: string; b: string }[] = [
  { icon: "shield", t: "Vetted, verified tenants", b: "Every applicant is FICA verified, credit checked, and affordability scored before they reach you." },
  { icon: "paper", t: "Digital leases, signed in app", b: "Lease in plain English, signed on phone, automatically filed. No printing, no scanning, no chasing." },
  { icon: "cash", t: "Rent collection on autopilot", b: "Tenants set up debit orders. You see paid / late / pending in one dashboard, with reminders sent for you." },
  { icon: "users", t: "Optional agent network", b: "Hand the keys to a vetted local agent for showings and admin — only pay when they place a tenant." },
];

function ValueGrid() {
  const { isSm, isMd } = useViewport();
  const cols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "56px 20px" : "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Why landlords choose Habitat</Eyebrow>
            <h2
              style={{
                fontSize: 40,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                fontWeight: 500,
                margin: 0,
                maxWidth: 600,
              }}
            >
              Everything between "I want to rent it out" and "money in the bank."
            </h2>
          </div>
          <a
            href="#"
            style={{ fontSize: 14, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6 }}
          >
            See landlord guide <Icon name="arrUR" size={14} />
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: 1,
            background: "var(--hairline)",
            border: "1px solid var(--hairline)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {VALUE_ITEMS.map((it) => (
            <div key={it.t} style={{ padding: 28, background: "var(--surface)" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 20,
                }}
              >
                <Icon name={it.icon} size={18} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>
                {it.t}
              </div>
              <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55 }}>{it.b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { isSm, isMd } = useViewport();
  const isMobile = isSm || isMd;
  const steps = [
    { n: "01", t: "Add your property", b: "Photos, address, rent. About 6 minutes from start to live." },
    { n: "02", t: "Receive applications", b: "We verify, vet, and score. You see only people who can actually afford it." },
    { n: "03", t: "Sign and collect", b: "Digital lease. Automatic rent. Maintenance requests in one inbox." },
  ];
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "56px 20px" : "80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isSm ? 32 : 64 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>How it works</Eyebrow>
            <h2 style={{ fontSize: 36, letterSpacing: "-0.025em", lineHeight: 1.15, fontWeight: 500, margin: 0 }}>
              Three steps. <br />
              Roughly a week.
            </h2>
          </div>
          <div>
            {steps.map((s, i) => (
              <div
                key={s.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 32,
                  padding: "28px 0",
                  borderBottom: i < steps.length - 1 ? "1px solid var(--hairline)" : "none",
                  alignItems: "center",
                }}
              >
                <div className="mono" style={{ fontSize: 14, color: "var(--slate)" }}>
                  {s.n}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      marginBottom: 6,
                    }}
                  >
                    {s.t}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.55 }}>{s.b}</div>
                </div>
                <Icon name="arrR" size={18} style={{ color: "var(--slate-2)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeaturedArea {
  name: string;
  count: number;
  priceFrom: string;
}

function FeaturedAreas() {
  const { isSm, isMd } = useViewport();
  const cols = isSm ? "1fr" : isMd ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  const areas: FeaturedArea[] = [];
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isSm ? "56px 20px" : "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Popular this week</Eyebrow>
            <h2 style={{ fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1, fontWeight: 500, margin: 0 }}>
              Where tenants are looking
            </h2>
          </div>
          <a
            href="#"
            style={{ fontSize: 14, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6 }}
          >
            View all areas <Icon name="arrUR" size={14} />
          </a>
        </div>
        {areas.length === 0 ? (
          <EmptyState
            icon="pin"
            title="No areas yet"
            description="Popular suburbs will appear here as listings come online."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16 }}>
            {areas.map((a) => (
              <AreaCard
                key={a.name}
                name={a.name}
                count={a.count}
                priceFrom={a.priceFrom}
                ratio="3/2"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
