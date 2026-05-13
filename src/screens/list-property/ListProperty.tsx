import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";

const STEPS: [string, string][] = [
  ["Tell us about the property", "Address, rooms, photos, rent."],
  ["Pick how you want to manage it", "Self-managed, agent-only, or full mandate."],
  ["Verify ownership + bank", "Title deed or rates account, plus your payout details."],
  ["Approve your first tenant", "Get applications in 48 hours — match in 9 days."],
];

const PERKS = [
  { icon: "shield" as const, title: "Trust account", body: "Tenant deposits ringfenced — Habitat Escrow Pty Ltd, FSP 51234." },
  { icon: "cash" as const, title: "0.8% transaction fee", body: "No monthly subscription. Pay only when rent moves." },
  { icon: "users" as const, title: "Pre-screened applicants", body: "ID, employment, and credit verified before they reach you." },
  { icon: "shield" as const, title: "Lease + statements built in", body: "South-African-law lease templates, free unlimited statements." },
];

const SOCIAL_PROOF = [
  { metric: "—", label: "Median time to first tenant" },
  { metric: "—", label: "On-time rent · last 12 months" },
  { metric: "R 0", label: "Tenant deposits in escrow today" },
];

export default function ListProperty() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      {/* Hero */}
      <section
        style={{
          background:
            "radial-gradient(120% 80% at 80% 20%, #4A2410 0%, #2A1709 45%, #1E0F06 100%)",
          color: "var(--paper)",
          padding: "72px 32px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <Badge tone="accent">For landlords</Badge>
            <h1
              className="display"
              style={{ fontSize: 84, color: "var(--paper)", margin: "16px 0 16px", lineHeight: 0.95 }}
            >
              LIST YOUR<br />
              <span style={{ color: "var(--accent)" }}>BACKROOM,</span>
              <br />
              GET RENT.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.5, maxWidth: 460, color: "rgba(247,239,226,0.78)", margin: "0 0 28px" }}>
              List once. Pre-screened tenants. Rent in escrow. Statements done for you.
              Habitat handles the boring bits so you don't have to chase money.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/wizard" style={{ textDecoration: "none" }}>
                <Button variant="accent" size="lg" rightIcon="arrR">
                  Start listing — it's free
                </Button>
              </Link>
              <Link to="/pricing" style={{ textDecoration: "none" }}>
                <Button variant="ghost" size="lg" style={{ color: "var(--paper)" }}>
                  See pricing
                </Button>
              </Link>
            </div>
            <div className="mono" style={{ fontSize: 11, color: "rgba(247,239,226,0.45)", marginTop: 20, letterSpacing: "0.12em" }}>
              5 MINUTES · NO CARD NEEDED · CANCEL ANYTIME
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Photo
              ratio="4/5"
              label="backroom · soweto"
              style={{ borderRadius: 16, boxShadow: "var(--shadow-lg)" }}
            />
            <Card
              padding={16}
              style={{
                position: "absolute",
                bottom: -24,
                left: -24,
                width: 260,
                background: "var(--paper)",
              }}
            >
              <Eyebrow>Live now</Eyebrow>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                <span className="tabular">0</span> applicants viewed your listing today
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                Listings get traction shortly after going live.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--hairline)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "24px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {SOCIAL_PROOF.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="display tabular" style={{ fontSize: 40 }}>{s.metric}</div>
              <Eyebrow style={{ marginTop: 4 }}>{s.label}</Eyebrow>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="display" style={{ fontSize: 48, margin: "8px 0 32px" }}>
            FOUR STEPS TO YOUR FIRST TENANT
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STEPS.map(([title, body], i) => (
              <Card key={title} padding={24} style={{ height: "100%" }}>
                <div
                  className="display"
                  style={{
                    fontSize: 32,
                    color: "var(--accent)",
                    marginBottom: 12,
                  }}
                >
                  0{i + 1}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</div>
                <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, lineHeight: 1.55 }}>{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: "0 32px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Eyebrow>What you get</Eyebrow>
          <h2 className="display" style={{ fontSize: 48, margin: "8px 0 32px" }}>
            EVERYTHING NEEDED, NOTHING EXTRA
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {PERKS.map((p) => (
              <Card key={p.title} padding={24} style={{ display: "flex", gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={p.icon} size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                  <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, lineHeight: 1.55 }}>{p.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ padding: "0 32px 72px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: 16,
            padding: "48px 56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Eyebrow style={{ color: "var(--accent)" }}>Ready when you are</Eyebrow>
            <div className="display" style={{ fontSize: 40, color: "var(--paper)", marginTop: 8 }}>
              5 MINUTES TO LIST.
            </div>
          </div>
          <Link to="/wizard" style={{ textDecoration: "none" }}>
            <Button variant="accent" size="lg" rightIcon="arrR">
              Start listing
            </Button>
          </Link>
        </div>
      </section>

      <Footer
        columns={[
          {
            title: "Habitat",
            links: [
              { label: "Pricing", href: "/pricing" },
              { label: "About", href: "/about" },
              { label: "Careers", href: "/careers" },
            ],
          },
          {
            title: "For landlords",
            links: [
              { label: "List a property", href: "/list-property" },
              { label: "Case study", href: "/case" },
              { label: "Onboarding guide", href: "/landlord-onboarding" },
            ],
          },
          {
            title: "Help",
            links: [
              { label: "Support centre", href: "/help" },
              { label: "Verification", href: "/verification" },
              { label: "POPIA", href: "/about" },
            ],
          },
        ]}
      />
    </div>
  );
}
