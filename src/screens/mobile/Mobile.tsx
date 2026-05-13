import Icon, { type IconName } from "@/components/Icon";
import Photo from "@/components/Photo";
import Chip from "@/components/Chip";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Input from "@/components/Input";
import Avatar from "@/components/Avatar";
import Eyebrow from "@/components/Eyebrow";
import PhoneFrame from "./PhoneFrame";

interface BrowseListing {
  name: string;
  area: string;
  price: string;
  hot?: boolean;
}

const BROWSE_LISTINGS: BrowseListing[] = [];

const TAB_BAR: { icon: IconName; label: string; active?: boolean }[] = [
  { icon: "search", label: "Browse" },
  { icon: "heart", label: "Saved" },
  { icon: "chat", label: "Inbox" },
  { icon: "home", label: "Rental" },
  { icon: "user", label: "Me" },
];

export default function Mobile() {
  return (
    <div style={{ background: "var(--surface-2)", padding: "48px 32px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Eyebrow>iOS · 393 × 852</Eyebrow>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 32px",
          }}
        >
          Mobile flows
        </h1>

        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Browse */}
          <PhoneFrame label="Browse">
            <div style={{ padding: "12px 16px 8px" }}>
              <Input leftIcon="search" defaultValue="" placeholder="Search location" style={{ height: 38, fontSize: 13 }} />
              <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10 }}>
                {["Map", "Under R5k", "1+ bed", "Pet", "Solar"].map((c, i) => (
                  <Chip
                    key={c}
                    active={i === 1}
                    style={{ height: 28, fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {c}
                  </Chip>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
              {BROWSE_LISTINGS.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 8,
                    border: "1px solid var(--hairline)",
                    borderRadius: 12,
                  }}
                >
                  <Photo
                    ratio="1"
                    label=""
                    style={{ width: 84, height: 84, borderRadius: 8, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 8 }}>{p.area}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="tabular" style={{ fontSize: 13, fontWeight: 600 }}>
                        {p.price}
                      </span>
                      {p.hot ? <Badge tone="accent">Hot</Badge> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <BottomTabBar items={TAB_BAR.map((t) => ({ ...t, active: t.label === "Browse" }))} />
          </PhoneFrame>

          {/* Property */}
          <PhoneFrame label="Property detail">
            <div style={{ position: "relative" }}>
              <Photo ratio="4/3" label="" style={{ borderRadius: 0 }} />
              <IconButton
                icon="chevL"
                label="Back"
                size="sm"
                variant="secondary"
                style={{ position: "absolute", top: 12, left: 12, background: "var(--paper)" }}
              />
              <IconButton
                icon="heart"
                label="Save"
                size="sm"
                variant="secondary"
                style={{ position: "absolute", top: 12, right: 12, background: "var(--paper)" }}
              />
              <div
                className="mono"
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.5)",
                  color: "var(--paper)",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 999,
                }}
              >
                1 / 12
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <Eyebrow style={{ fontSize: 9, marginBottom: 4 }}>Listing</Eyebrow>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}
              >
                —
              </h2>
              <div style={{ display: "flex", gap: 8, fontSize: 11, color: "var(--slate)", marginBottom: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Icon name="bed" size={11} /> —
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Icon name="bath" size={11} /> —
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Icon name="sqm" size={11} /> —
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--surface-2)",
                  borderRadius: 10,
                  marginBottom: 14,
                  alignItems: "center",
                }}
              >
                <Avatar name="" size="md" tone="neutral" />
                <div style={{ flex: 1, fontSize: 11 }}>
                  <div style={{ fontWeight: 600 }}>—</div>
                  <div style={{ color: "var(--slate)" }}>Landlord</div>
                </div>
                <IconButton icon="chat" label="Message" size="sm" />
              </div>
              <p style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, margin: "0 0 14px" }}>
                Listing description will appear here.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} />
            </div>
            {/* Sticky apply bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "10px 16px 24px",
                borderTop: "1px solid var(--hairline)",
                background: "var(--paper)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <div className="tabular" style={{ fontSize: 16, fontWeight: 600 }}>
                  R 0
                </div>
                <div style={{ fontSize: 9, color: "var(--slate)" }}>per month</div>
              </div>
              <Button variant="accent" style={{ flex: 1, justifyContent: "center", height: 38 }}>
                Apply
              </Button>
            </div>
          </PhoneFrame>

          {/* My Rental */}
          <PhoneFrame label="My Rental">
            <div style={{ padding: "12px 16px 16px" }}>
              <Eyebrow style={{ fontSize: 9, marginBottom: 4 }}>Your spot</Eyebrow>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  margin: "0 0 4px",
                  letterSpacing: "-0.01em",
                }}
              >
                —
              </h2>
              <div style={{ fontSize: 11, color: "var(--slate)" }}>—</div>
            </div>
            <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card
                padding={14}
                style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    opacity: 0.6,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  Next rent due
                </div>
                <div className="tabular" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
                  R 0
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 12 }}>—</div>
                <Button
                  variant="accent"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    height: 36,
                    background: "var(--paper)",
                    color: "var(--ink)",
                  }}
                >
                  Pay now
                </Button>
              </Card>
              <Card padding={14}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Eyebrow style={{ fontSize: 9 }}>Maintenance</Eyebrow>
                  <Button variant="ghost" size="sm" style={{ height: 24, fontSize: 10, padding: "0 8px" }}>
                    + New
                  </Button>
                </div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>No open tickets.</div>
              </Card>
              <Card padding={14} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name="" size="md" tone="neutral" />
                <div style={{ flex: 1, fontSize: 11 }}>
                  <div style={{ fontWeight: 600 }}>—</div>
                  <div style={{ color: "var(--slate)" }}>Landlord</div>
                </div>
                <Icon name="chevR" size={14} style={{ color: "var(--slate)" }} />
              </Card>
            </div>
            <BottomTabBar items={TAB_BAR.map((t) => ({ ...t, active: t.label === "Rental" }))} />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}

function BottomTabBar({ items }: { items: { icon: IconName; label: string; active?: boolean }[] }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 0 24px",
        borderTop: "1px solid var(--hairline)",
        background: "var(--paper)",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {items.map((t) => (
        <div
          key={t.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            color: t.active ? "var(--accent)" : "var(--slate)",
          }}
        >
          <Icon name={t.icon} size={18} />
          <span style={{ fontSize: 10, fontWeight: t.active ? 600 : 500 }}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}
