import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Hairline from "@/components/Hairline";

interface Factor {
  icon: IconName;
  label: string;
  tone: "good" | "warn";
}

const FACTORS: Factor[] = [
  { icon: "check", label: "24 months of on-time rent", tone: "good" },
  { icon: "check", label: "0 disputes or evictions", tone: "good" },
  { icon: "check", label: "FICA-verified employment", tone: "good" },
  { icon: "info", label: "Short credit history (under 3 yrs)", tone: "warn" },
  { icon: "info", label: "1 missed Edgars payment in 2023", tone: "warn" },
];

const SCORE = 678;
const MAX = 850;
const PCT = ((SCORE - 300) / (MAX - 300)) * 100;

export default function Credit() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        <Eyebrow>TPN credit check · refreshed 1 May 2026</Eyebrow>
        <h1 className="display" style={{ fontSize: 56, margin: "8px 0 24px" }}>
          YOUR RENTAL SCORE
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
          <Card padding={32}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <Eyebrow>Your score</Eyebrow>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div
                    className="display tabular"
                    style={{ fontSize: 88, color: "var(--success)", lineHeight: 1 }}
                  >
                    {SCORE}
                  </div>
                  <div style={{ fontSize: 16, color: "var(--slate)" }}>/ {MAX}</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Badge tone="success">GOOD · paid as agreed</Badge>
                </div>
              </div>
              <Icon name="shield" size={42} style={{ color: "var(--success)" }} />
            </div>

            <div
              style={{
                marginTop: 22,
                height: 10,
                background: "var(--surface-2)",
                borderRadius: 999,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, #C9442D 0%, #E97A1F 35%, #5C7A2F 60%, #2F7A50 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${PCT}%`,
                  top: -4,
                  width: 4,
                  height: 18,
                  background: "var(--ink)",
                  borderRadius: 2,
                }}
              />
            </div>
            <div
              className="mono"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 11,
                color: "var(--slate)",
              }}
            >
              <span>300</span>
              <span>500</span>
              <span>650</span>
              <span>800</span>
              <span>850</span>
            </div>

            <Hairline style={{ margin: "24px 0" }} />

            <Eyebrow style={{ marginBottom: 10 }}>What's affecting your score</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FACTORS.map((f) => (
                <div
                  key={f.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    background: "var(--surface-2)",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  <Icon
                    name={f.icon}
                    size={16}
                    style={{ color: f.tone === "good" ? "var(--success)" : "var(--warn)" }}
                  />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card padding={22}>
              <Eyebrow>Share with a landlord</Eyebrow>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>
                Generate a one-time link valid for 14 days. They see your score and history but no
                personal info.
              </p>
              <Button variant="accent" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>
                Generate share link
              </Button>
            </Card>
            <Card padding={22}>
              <Icon name="sparkle" size={16} style={{ color: "var(--accent)" }} />
              <div style={{ fontWeight: 600, marginTop: 8 }}>Boost your score</div>
              <ul
                style={{
                  paddingLeft: 18,
                  fontSize: 13,
                  color: "var(--slate)",
                  marginTop: 8,
                  lineHeight: 1.7,
                }}
              >
                <li>Pay 3 more months on time → +20 pts</li>
                <li>Verify utility account history → +30 pts</li>
                <li>Add a co-applicant guarantor → +40 pts</li>
              </ul>
            </Card>
            <Card padding={22} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
              <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                Data sourced from TPN Credit Bureau under POPIA consent. Refreshed monthly · last 1 May
                2026.
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
