import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button, { type ButtonVariant } from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  sub: string;
  cta: string;
  ctaVariant: ButtonVariant;
  featured?: boolean;
  tag?: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "R 0",
    cadence: "/month",
    sub: "List 1 spot. No featured placement.",
    cta: "Get started",
    ctaVariant: "secondary",
    features: ["1 active listing", "Standard placement", "Direct messaging", "FICA-verified badge", "Basic analytics"],
  },
  {
    name: "Landlord",
    price: "R 199",
    cadence: "/month",
    sub: "For owners with 2–10 spots. Faster vacancies.",
    cta: "Start 14-day trial",
    ctaVariant: "accent",
    featured: true,
    tag: "Most landlords",
    features: [
      "Up to 10 active listings",
      "2× featured placements",
      "Auto-screen applicants",
      "Lease & deposit handling",
      "Statements & payouts",
      "Priority support (WhatsApp)",
    ],
  },
  {
    name: "Agency",
    price: "R 749",
    cadence: "/month",
    sub: "For managing agents and offices.",
    cta: "Talk to sales",
    ctaVariant: "primary",
    features: [
      "Unlimited listings",
      "Multi-agent dashboards",
      "Bulk import & API",
      "Custom mandate templates",
      "White-label branding",
      "Dedicated account manager",
    ],
  },
];

const COMPARE_ROWS = [
  ["Active listings", "1", "10", "Unlimited"],
  ["Featured placements", "—", "2× /mo", "10× /mo"],
  ["Applicant screening", "Basic", "Auto + score", "Custom workflow"],
  ["Payouts", "Manual", "Auto next-day", "Auto + reconciliation"],
  ["Bulk import / API", "—", "—", "✓"],
  ["Dedicated CSM", "—", "—", "✓"],
];

const FAQS = [
  ["Can I switch plans?", "Yes — change anytime. Pro-rated to the day."],
  ["Do tenants pay any fees?", "No platform fee. They only pay rent + deposit."],
  ["What does FICA-verified mean?", "We verify ID, address, and bank against PPRA registers."],
  ["Is there a setup fee?", "Never. You only pay the monthly plan."],
];

export default function Pricing() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 32px 96px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow style={{ marginBottom: 14 }}>Plans · billed monthly · cancel anytime</Eyebrow>
          <h1 className="display" style={{ fontSize: 80, margin: "0 0 12px" }}>
            FILL VACANCIES FASTER.
          </h1>
          <p style={{ fontSize: 16, color: "var(--slate)", maxWidth: 540, margin: "0 auto" }}>
            Choose how many spots you list. Every plan includes verified tenant screening, lease handling,
            and FICA-compliant payouts.
          </p>
          <div
            style={{
              marginTop: 24,
              display: "inline-flex",
              padding: 4,
              background: "var(--surface-2)",
              borderRadius: 999,
              border: "1px solid var(--hairline)",
            }}
          >
            <button
              type="button"
              className="btn btn--sm"
              style={{ background: "var(--ink)", color: "var(--paper)", borderRadius: 999 }}
            >
              Monthly
            </button>
            <Button variant="ghost" size="sm" style={{ borderRadius: 999 }}>
              Yearly · save 20%
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TIERS.map((t) => (
            <PricingTier key={t.name} tier={t} />
          ))}
        </div>

        {/* Comparison strip */}
        <Card style={{ marginTop: 64, padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <h3 className="display" style={{ fontSize: 28, margin: 0 }}>
              COMPARE EVERY FEATURE
            </h3>
            <Button variant="ghost" size="sm" rightIcon="chevD">
              Show all
            </Button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Feature", "Free", "Landlord", "Agency"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 28px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--slate)",
                      background: "var(--surface-2)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 14 }}>
              {COMPARE_ROWS.map((row) => (
                <tr key={row[0]} style={{ borderTop: "1px solid var(--hairline)" }}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={i === 0 ? "" : "mono"}
                      style={{
                        padding: "16px 28px",
                        color: i === 0 ? "var(--ink)" : "var(--slate)",
                        fontWeight: i === 0 ? 600 : 400,
                        fontSize: i === 0 ? 14 : 13,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* FAQ teaser */}
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {FAQS.map(([q, a]) => (
            <div key={q} style={{ padding: "20px 0", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{q}</div>
              <div style={{ fontSize: 14, color: "var(--slate)" }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingTier({ tier }: { tier: Tier }) {
  return (
    <Card
      style={{
        padding: 28,
        position: "relative",
        borderColor: tier.featured ? "var(--ink)" : "var(--hairline)",
        borderWidth: tier.featured ? 2 : 1,
        transform: tier.featured ? "translateY(-12px)" : "none",
      }}
    >
      {tier.tag ? (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            padding: "5px 14px",
            borderRadius: 999,
            textTransform: "uppercase",
          }}
        >
          {tier.tag}
        </div>
      ) : null}
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--slate)",
        }}
      >
        {tier.name}
      </div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 4 }}>
        <div className="display" style={{ fontSize: 64 }}>
          {tier.price}
        </div>
        <div style={{ color: "var(--slate)", fontSize: 14 }}>{tier.cadence}</div>
      </div>
      <p style={{ fontSize: 13, color: "var(--slate)", margin: "8px 0 24px", minHeight: 36 }}>
        {tier.sub}
      </p>
      <Button
        variant={tier.ctaVariant}
        style={{ width: "100%", height: 48, justifyContent: "center" }}
      >
        {tier.cta}
      </Button>
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--slate)",
            marginBottom: 14,
          }}
        >
          Includes
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {tier.features.map((f) => (
            <li key={f} style={{ display: "flex", gap: 10, fontSize: 14 }}>
              <Icon name="check" size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
