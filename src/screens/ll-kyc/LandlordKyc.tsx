import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";

type StepState = "done" | "active" | "todo";

interface KycStep {
  n: number;
  title: string;
  state: StepState;
  note: string;
}

const STEPS: KycStep[] = [
  { n: 1, title: "Identity & directors", state: "active", note: "Verify your ID with Home Affairs" },
  { n: 2, title: "Property ownership", state: "todo", note: "Upload title deed or registered lease" },
  { n: 3, title: "Bank account", state: "todo", note: "We deposit rent here" },
  { n: 4, title: "Tax registration", state: "todo", note: "Optional · adds Tax Verified badge" },
];

export default function LandlordKyc() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
          }}
        >
          <div>
            <Eyebrow>Landlord verification · FICA</Eyebrow>
            <h1 className="display" style={{ fontSize: 56, margin: "8px 0 0" }}>
              GET PAID FASTER
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", marginTop: 8 }}>
              Verified landlords get a green badge, priority placement, and next-day payouts.
            </p>
          </div>
          <Badge tone="neutral">0 of 4 steps complete</Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28 }}>
          <Card padding={4}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  gap: 12,
                  background: s.state === "active" ? "var(--surface-2)" : "transparent",
                  borderRadius: 10,
                }}
              >
                <div
                  className="mono"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background:
                      s.state === "done"
                        ? "var(--success)"
                        : s.state === "active"
                          ? "var(--ink)"
                          : "var(--surface-3)",
                    color: s.state === "todo" ? "var(--slate)" : "#fff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {s.state === "done" ? <Icon name="check" size={14} /> : s.n}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 3 }}>{s.note}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card padding={32}>
            <Eyebrow>Step 2 of 4</Eyebrow>
            <h2 className="display" style={{ fontSize: 32, margin: "8px 0" }}>
              PROVE PROPERTY OWNERSHIP
            </h2>
            <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 24 }}>
              Upload a title deed, mortgage statement, or signed lease showing you have rights to let the
              property.
            </p>

            <div
              style={{
                padding: "40px 24px",
                border: "2px dashed var(--hairline-strong)",
                borderRadius: 12,
                background: "var(--surface-2)",
                textAlign: "center",
              }}
            >
              <Icon name="paper" size={32} style={{ color: "var(--slate)" }} />
              <div style={{ fontWeight: 600, marginTop: 14 }}>
                Drop title deed or proof of ownership
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                PDF preferred · scans accepted · max 20 MB
              </div>
              <Button variant="accent" size="sm" style={{ marginTop: 16 }}>
                Choose file
              </Button>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                background: "var(--accent-soft)",
                borderRadius: 10,
                fontSize: 13,
                color: "var(--ink-2)",
                display: "flex",
                gap: 10,
              }}
            >
              <Icon
                name="info"
                size={16}
                style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}
              />
              <span>
                Don't own the property? You can still list it as an agent — upload your{" "}
                <strong>mandate</strong> instead and we'll verify with the owner.
              </span>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
              <Button variant="ghost" leftIcon="chevL">
                Back
              </Button>
              <Button variant="accent">Continue to bank</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
