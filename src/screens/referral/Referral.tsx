import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import Avatar from "@/components/Avatar";
import Hairline from "@/components/Hairline";

interface Invite {
  id: string;
  name: string;
  status: string;
  reward: string;
  state: "paid" | "pending" | "sent";
}

const INVITED: Invite[] = [];

const STATE_BADGE: Record<Invite["state"], { tone: BadgeTone; label: string }> = {
  paid: { tone: "success", label: "Paid" },
  pending: { tone: "warn", label: "Pending" },
  sent: { tone: "neutral", label: "Sent" },
};

const CODE = "—";

export default function Referral() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, alignItems: "stretch" }}>
          {/* Pitch card */}
          <div
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              borderRadius: 16,
              padding: 40,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -60,
                top: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: "var(--accent)",
                opacity: 0.4,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Eyebrow style={{ color: "var(--accent)", marginBottom: 14 }}>Refer & earn</Eyebrow>
              <h1
                className="display"
                style={{ fontSize: 64, color: "var(--paper)", margin: 0, lineHeight: 0.9 }}
              >
                GIVE R 50.
                <br />
                GET R 250.
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 20,
                  maxWidth: 360,
                  lineHeight: 1.5,
                }}
              >
                Invite a friend. They get R 50 toward their first month's rent. You get R 250 when they move in
                — paid to your bank.
              </p>

              <div
                style={{
                  marginTop: 32,
                  padding: 18,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    Your code
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.04em" }}
                  >
                    {CODE}
                  </div>
                </div>
                <Button variant="accent" size="sm">
                  Copy
                </Button>
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                {["WhatsApp", "Email", "Link"].map((label) => (
                  <Button
                    key={label}
                    variant="secondary"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "var(--paper)",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings */}
          <Card padding={28} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <Eyebrow>Lifetime earned</Eyebrow>
              <div className="display tabular" style={{ fontSize: 64, marginTop: 6 }}>
                R 0
              </div>
              <div style={{ fontSize: 13, color: "var(--slate)" }}>
                Add a payout method to receive referral rewards.
              </div>
            </div>
            <Hairline />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                ["Sent", "0"],
                ["Signed up", "0"],
                ["Moved in", "0"],
              ].map(([label, value]) => (
                <div key={label} className="mono">
                  <div style={{ fontSize: 26, fontWeight: 600 }}>{value}</div>
                  <Eyebrow style={{ marginTop: 4 }}>{label}</Eyebrow>
                </div>
              ))}
            </div>
            <Hairline />
            <div style={{ fontSize: 13, color: "var(--slate)", display: "flex", gap: 10 }}>
              <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Reward unlocks after your friend pays their first month's rent in full.</span>
            </div>
          </Card>
        </div>

        {/* Activity */}
        <Card style={{ marginTop: 28, padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="display" style={{ fontSize: 22 }}>
              YOUR REFERRALS
            </div>
            <Button variant="ghost" size="sm" rightIcon="download">
              Export
            </Button>
          </div>
          {INVITED.length === 0 ? (
            <EmptyState
              icon="users"
              title="No invitations yet"
              description="Share your code and your referrals will appear here."
            />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Friend", "Status", "Reward", "Action"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 24px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        color: "var(--slate)",
                        background: "var(--surface-2)",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVITED.map((r) => {
                  const badge = STATE_BADGE[r.state];
                  return (
                    <tr key={r.id} style={{ borderTop: "1px solid var(--hairline)" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar name={r.name} size="sm" tone="neutral" />
                          <span style={{ fontWeight: 500 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "var(--slate)", fontSize: 14 }}>
                        {r.status}
                      </td>
                      <td
                        className="mono"
                        style={{ padding: "16px 24px", fontWeight: 600, fontSize: 14 }}
                      >
                        {r.reward}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <Badge tone={badge.tone}>{badge.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
