import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Hairline from "@/components/Hairline";

const COVERAGE: [string, string][] = [
  ["Tenant default", "Paid in 30 days"],
  ["Legal eviction costs", "Up to R 12,000"],
  ["Property damage", "Excess R 1,000"],
  ["Excess utilities", "Up to R 4,500"],
];

const STEPS: [string, string, string][] = [
  ["1", "Activate", "Toggle on per property. R 89/mo billed with your statement."],
  ["2", "Tenant misses", "We're notified automatically when rent is 10+ days late."],
  ["3", "Claim", "Submit a 2-tap claim. We review in 5 days."],
  ["4", "You're paid", "Funds in your FNB account within 30 days, every month."],
];

export default function Guarantee() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      {/* Hero */}
      <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "56px 32px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div>
            <Badge tone="accent">Insurance addon · R 89/mo per unit</Badge>
            <h1
              className="display"
              style={{
                fontSize: 80,
                color: "var(--paper)",
                margin: "12px 0",
                lineHeight: 0.92,
              }}
            >
              RENT-GUARANTEE
              <br />
              INSURANCE.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(247,239,226,0.7)",
                maxWidth: 520,
                lineHeight: 1.5,
              }}
            >
              If your tenant misses rent, we pay you within 30 days — up to 6 months at a time.
              Underwritten by King Price.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
              <Button variant="accent">Activate for R 89/mo</Button>
              <Button
                variant="secondary"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "var(--paper)",
                }}
              >
                Download brochure
              </Button>
            </div>
          </div>
          <Card padding={28} style={{ background: "var(--paper)", color: "var(--ink)" }}>
            <Eyebrow>Your potential coverage</Eyebrow>
            <div className="display tabular" style={{ fontSize: 56, marginTop: 6 }}>
              R 20,700
            </div>
            <div style={{ fontSize: 13, color: "var(--slate)" }}>
              Up to 6 months × R 3,450 rent on Vilakazi St
            </div>
            <Hairline style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              {COVERAGE.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderTop: "1px dotted var(--hairline)",
                  }}
                >
                  <span style={{ color: "var(--slate)" }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        <h3 className="display" style={{ fontSize: 32, marginBottom: 20 }}>
          HOW IT WORKS
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {STEPS.map(([n, t, d]) => (
            <Card key={n} padding={22}>
              <div className="display" style={{ fontSize: 40, color: "var(--accent)", lineHeight: 0.9 }}>
                {n}
              </div>
              <div style={{ fontWeight: 600, marginTop: 8 }}>{t}</div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6, lineHeight: 1.5 }}>
                {d}
              </p>
            </Card>
          ))}
        </div>

        <h3 className="display" style={{ fontSize: 26, marginTop: 48, marginBottom: 14 }}>
          YOUR CLAIMS
        </h3>
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between" }}>
            <div className="mono" style={{ fontSize: 13, color: "var(--slate)" }}>
              No active claims · 2 properties insured
            </div>
            <Button variant="ghost" size="sm" rightIcon="arrR">
              Open a claim
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
