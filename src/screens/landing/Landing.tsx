import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import StatTile from "@/components/StatTile";
import AreaCard from "@/components/AreaCard";
import Footer from "@/components/Footer";

const FOOTER_COLUMNS = [
  { title: "Landlords", links: [
    { label: "List a property", href: "/wizard" },
    { label: "Pricing", href: "/pricing" },
    { label: "Find an agent", href: "/mandates" },
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
      <Hero />
      <TrustBar />
      <ValueGrid />
      <HowItWorks />
      <FeaturedAreas />
      <Footer
        columns={FOOTER_COLUMNS}
        tagline="The calmest way to rent out a backroom in South Africa. Built in Joburg."
        copyright="© 2026 Backroom · Your Spot. Your Hood."
      />
    </div>
  );
}

function Hero() {
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "80px 32px 64px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
          gap: 80,
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
            Backroom is the calm, professional way to rent out a backroom, cottage or flatlet — with
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
            <StatTile value="12,400+" label="active listings" />
            <StatTile value="R 3.2 bn" label="rent processed" />
            <StatTile value="48 hrs" label="median time-to-listed" />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <Photo ratio="4/5" label="Property cover photo" />
          <Card
            padding={16}
            style={{
              position: "absolute",
              bottom: 32,
              left: -32,
              width: 280,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Eyebrow style={{ marginBottom: 6 }}>Verified tenant</Eyebrow>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--surface-3)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                SD
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Sipho Dlamini</div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>FICA · Affordability checked</div>
              </div>
              <Icon name="check" size={14} style={{ color: "var(--success)" }} />
            </div>
          </Card>
          <Card
            padding={14}
            style={{
              position: "absolute",
              top: 24,
              right: -28,
              width: 220,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Eyebrow style={{ marginBottom: 4 }}>Rent · April</Eyebrow>
            <div className="tabular" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
              R 6,800
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Badge tone="success">Received</Badge>
              <span style={{ fontSize: 11, color: "var(--slate)" }}>2 hours ago</span>
            </div>
          </Card>
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
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Why landlords choose Backroom</Eyebrow>
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
            gridTemplateColumns: "repeat(4, 1fr)",
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
  const steps = [
    { n: "01", t: "Add your property", b: "Photos, address, rent. About 6 minutes from start to live." },
    { n: "02", t: "Receive applications", b: "We verify, vet, and score. You see only people who can actually afford it." },
    { n: "03", t: "Sign and collect", b: "Digital lease. Automatic rent. Maintenance requests in one inbox." },
  ];
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64 }}>
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

function FeaturedAreas() {
  const areas = [
    { name: "Brixton", count: 142, priceFrom: "R 4,200" },
    { name: "Melville", count: 88, priceFrom: "R 5,800" },
    { name: "Yeoville", count: 207, priceFrom: "R 3,200" },
    { name: "Westdene", count: 65, priceFrom: "R 4,800" },
  ];
  return (
    <section style={{ borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 32px" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
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
      </div>
    </section>
  );
}
