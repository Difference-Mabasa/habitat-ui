import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

const TERMS: [string, string][] = [
  ["Term", "12 months · 1 June 2026 — 31 May 2027"],
  ["Deposit", "No change · already on file"],
  ["Utilities", "Prepaid electricity (same), water included"],
  ["Notice period", "60 days (same)"],
];

export default function Renewal() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <Eyebrow>Lease renewal · 47 days remaining</Eyebrow>
            <h1 className="display" style={{ fontSize: 56, margin: "8px 0 0" }}>
              RENEW YOUR LEASE
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", marginTop: 6 }}>
              23 Vilakazi St · current term ends 31 May 2026
            </p>
          </div>
          <Link to="/vacate" style={{ textDecoration: "none" }}>
            <Button variant="ghost">Decline & give notice</Button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          <Card padding={32}>
            <Eyebrow>Proposed new term</Eyebrow>
            <h2 className="display" style={{ fontSize: 32, margin: "8px 0 18px" }}>
              NALEDI'S OFFER
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
              <div style={{ padding: 18, background: "var(--surface-2)", borderRadius: 10 }}>
                <Eyebrow style={{ marginBottom: 4 }}>Current rent</Eyebrow>
                <div className="mono" style={{ fontSize: 24, fontWeight: 600 }}>
                  R 3,450
                </div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>per month</div>
              </div>
              <div
                style={{
                  padding: 18,
                  background: "var(--accent-soft)",
                  borderRadius: 10,
                  border: "1px solid var(--accent)",
                }}
              >
                <Eyebrow style={{ marginBottom: 4, color: "var(--accent)" }}>New rent · +6%</Eyebrow>
                <div className="mono" style={{ fontSize: 24, fontWeight: 600 }}>
                  R 3,657
                </div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>per month · +R 207</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              {TERMS.map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <span style={{ color: "var(--slate)" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 22,
                padding: 14,
                background: "var(--surface-2)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              <strong>Note from Naledi:</strong> "Thanks for being a great tenant. 6% is below CPI — happy
              to have you stay another year."
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
              <Link to="/lease" style={{ flex: 1, textDecoration: "none" }}>
                <Button variant="accent" style={{ width: "100%", height: 52, justifyContent: "center" }}>
                  Accept & sign renewal
                </Button>
              </Link>
              <Link to="/inbox" style={{ textDecoration: "none" }}>
                <Button variant="secondary">Counter-offer</Button>
              </Link>
            </div>
          </Card>

          <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card padding={22}>
              <Icon name="info" size={18} style={{ color: "var(--accent)" }} />
              <div style={{ fontWeight: 600, marginTop: 10 }}>Why renew?</div>
              <ul
                style={{
                  paddingLeft: 18,
                  marginTop: 8,
                  fontSize: 13,
                  color: "var(--slate)",
                  lineHeight: 1.7,
                }}
              >
                <li>Skip move-out costs (~R 8,400 avg)</li>
                <li>No new deposit</li>
                <li>Stay verified at this address</li>
              </ul>
            </Card>
            <Card padding={22}>
              <Eyebrow>Counter-offer guide</Eyebrow>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 8 }}>
                Average Soweto renewal escalation is 7.2%. Asking for 4% on a 2-year term is common.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
