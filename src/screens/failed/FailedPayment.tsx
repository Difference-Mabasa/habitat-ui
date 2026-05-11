import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";

interface Attempt {
  time: string;
  method: string;
  outcome: string;
  tone: BadgeTone;
}

const ATTEMPTS: Attempt[] = [
  { time: "1 May 06:00", method: "EFT debit · FNB •••2114", outcome: "Failed · insufficient funds", tone: "danger" },
  { time: "1 May 12:30", method: "Retry · same account", outcome: "Failed · insufficient funds", tone: "danger" },
  { time: "2 May 09:15", method: "Manual EFT · pending", outcome: "Awaiting confirmation", tone: "warn" },
];

export default function FailedPayment() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
        <Card padding={32} style={{ borderColor: "var(--danger)", borderWidth: 2 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--danger-soft)",
                color: "var(--danger)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="info" size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <Badge tone="danger">Payment failed</Badge>
              <h1 className="display" style={{ fontSize: 40, margin: "10px 0 6px" }}>
                MAY RENT DIDN'T GO THROUGH
              </h1>
              <p style={{ fontSize: 14, color: "var(--slate)" }}>
                We tried to debit R 3,450 from FNB •••2114 on 1 May at 06:00. The bank returned:{" "}
                <strong>"insufficient funds"</strong>.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              padding: 18,
              background: "var(--surface-2)",
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Eyebrow>Late fee timer · 4 days until R 250 fee</Eyebrow>
              <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
                03 d : 14 h : 22 m
              </div>
            </div>
            <Icon name="clock" size={32} style={{ color: "var(--accent)" }} />
          </div>

          <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 18, border: "1.5px solid var(--ink)", borderRadius: 10 }}>
              <Eyebrow style={{ color: "var(--accent)" }}>Recommended</Eyebrow>
              <div style={{ fontWeight: 600, marginTop: 6, fontSize: 16 }}>Retry now</div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>
                Pay R 3,450 from a different account, instant EFT, or card.
              </p>
              <Button
                variant="accent"
                rightIcon="arrR"
                style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
              >
                Pay R 3,450
              </Button>
            </div>
            <div style={{ padding: 18, border: "1px solid var(--hairline)", borderRadius: 10 }}>
              <Eyebrow>If you're short this month</Eyebrow>
              <div style={{ fontWeight: 600, marginTop: 6, fontSize: 16 }}>Set up a payment plan</div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>
                Split into 2 × R 1,725 (8 days apart). Naledi has to approve.
              </p>
              <Button variant="secondary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>
                Request payment plan
              </Button>
            </div>
          </div>
        </Card>

        {/* History */}
        <div style={{ marginTop: 24 }}>
          <Eyebrow style={{ marginBottom: 10 }}>Attempts</Eyebrow>
          <Card padding={0} style={{ overflow: "hidden" }}>
            {ATTEMPTS.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: i ? "1px solid var(--hairline)" : "none",
                  fontSize: 14,
                }}
              >
                <div className="mono" style={{ fontSize: 13, color: "var(--slate)" }}>
                  {a.time}
                </div>
                <div style={{ flex: 1, paddingLeft: 16, fontWeight: 500 }}>{a.method}</div>
                <Badge tone={a.tone}>{a.outcome}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
