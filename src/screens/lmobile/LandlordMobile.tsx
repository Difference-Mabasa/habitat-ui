import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Avatar from "@/components/Avatar";

const NEEDS_YOU: { icon: IconName; tone: "warn" | "accent" | "neutral"; title: string; sub: string }[] = [
  { icon: "info", tone: "warn", title: "Maintenance: geyser at Vilakazi", sub: "Quote pending · 2 days old" },
  { icon: "user", tone: "accent", title: "New applicant for Mofolo (score 84)", sub: "Sent 12 min ago" },
  { icon: "check", tone: "neutral", title: "Lease ready to sign · Diepkloof", sub: "Awaiting tenant" },
];

const QUICK_ADD: [IconName, string][] = [
  ["plus", "Spot"],
  ["paper", "Lease"],
  ["wrench", "Job"],
  ["doc", "Receipt"],
];

const TAB_BAR: { icon: IconName; label: string; active?: boolean }[] = [
  { icon: "home", label: "Home", active: true },
  { icon: "users", label: "Applicants" },
  { icon: "chat", label: "Inbox" },
  { icon: "cash", label: "Money" },
];

const HIGHLIGHTS: [string, string][] = [
  ["✓", "Affordability: pays ≤ 28% of income"],
  ["✓", "Stable employer · 3yrs"],
  ["✓", "Previous landlord rated 5★"],
  ["—", "First-time on Backroom"],
];

export default function LandlordMobile() {
  return (
    <div
      style={{
        background: "var(--paper)",
        minHeight: "100vh",
        padding: 32,
        display: "flex",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Phone 1: dashboard */}
      <Phone>
        <div style={{ padding: "44px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Eyebrow>Today · 12 May</Eyebrow>
              <div className="display" style={{ fontSize: 26 }}>
                HEY, NALEDI
              </div>
            </div>
            <Avatar name="Naledi M" size="md" tone="neutral" />
          </div>
        </div>

        <div style={{ padding: "0 16px" }}>
          <Card padding={16} style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
            <Eyebrow style={{ color: "var(--accent)" }}>This week's payouts</Eyebrow>
            <div className="display tabular" style={{ fontSize: 36, color: "var(--paper)", marginTop: 4 }}>
              R 28,400
            </div>
            <div style={{ fontSize: 12, color: "rgba(247,239,226,0.6)" }}>
              8 of 8 spots paid · next payout Thu
            </div>
          </Card>

          <Eyebrow style={{ marginTop: 18, marginBottom: 8 }}>Needs you · 3</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {NEEDS_YOU.map((n, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  background: "var(--surface-2)",
                  borderRadius: 10,
                  display: "flex",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background:
                      n.tone === "warn"
                        ? "var(--warn-soft)"
                        : n.tone === "accent"
                          ? "var(--accent-soft)"
                          : "var(--surface-3)",
                    color:
                      n.tone === "warn"
                        ? "var(--warn)"
                        : n.tone === "accent"
                          ? "var(--accent)"
                          : "var(--slate)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={n.icon} size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{n.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <Eyebrow style={{ marginTop: 18, marginBottom: 8 }}>Quick add</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {QUICK_ADD.map(([icon, label]) => (
              <button
                key={label}
                type="button"
                style={{
                  padding: "16px 8px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: 0,
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Icon name={icon} size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <TabBar items={TAB_BAR} />
      </Phone>

      {/* Phone 2: applicant card */}
      <Phone>
        <div style={{ padding: "44px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="arrL" size={20} />
          <div style={{ fontWeight: 600 }}>Applicant · Vilakazi St</div>
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar
              name="Sipho Khumalo"
              size="lg"
              tone="neutral"
              style={{ width: 56, height: 56, fontSize: 18 }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>Sipho Khumalo · 30</div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>
                Soweto · Discovery employee · 3 yrs
              </div>
            </div>
          </div>

          <Card
            padding={16}
            style={{ marginTop: 18, background: "var(--accent-soft)", borderColor: "var(--accent)" }}
          >
            <Eyebrow style={{ color: "var(--accent)" }}>Applicant score</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div className="display tabular" style={{ fontSize: 44, color: "var(--accent)" }}>
                84
              </div>
              <div style={{ color: "var(--slate)" }}>/ 100</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>
              ID verified · 24 mo on-time rent · employed
            </div>
          </Card>

          <div style={{ marginTop: 18 }}>
            <Eyebrow style={{ marginBottom: 8 }}>Highlights</Eyebrow>
            {HIGHLIGHTS.map(([t, l]) => (
              <div key={l} style={{ display: "flex", gap: 10, padding: "8px 0", fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: t === "✓" ? "var(--success)" : "var(--slate)" }}>
                  {t}
                </span>
                <span>{l}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button
              type="button"
              style={{
                flex: 1,
                height: 50,
                background: "transparent",
                border: "1.5px solid var(--ink)",
                borderRadius: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Decline
            </button>
            <button
              type="button"
              style={{
                flex: 2,
                height: 50,
                background: "var(--success)",
                color: "#fff",
                border: 0,
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Approve & send lease
            </button>
          </div>
          <button
            type="button"
            style={{
              marginTop: 8,
              width: "100%",
              height: 44,
              background: "var(--surface-2)",
              border: 0,
              borderRadius: 10,
              color: "var(--ink)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            WhatsApp Sipho
          </button>
        </div>
      </Phone>
    </div>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 380,
        background: "#fff",
        borderRadius: 32,
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--hairline)",
      }}
    >
      {children}
    </div>
  );
}

function TabBar({ items }: { items: { icon: IconName; label: string; active?: boolean }[] }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "12px 4px 18px",
        marginTop: 18,
        borderTop: "1px solid var(--hairline)",
      }}
    >
      {items.map((t) => (
        <div
          key={t.label}
          style={{
            flex: 1,
            textAlign: "center",
            color: t.active ? "var(--accent)" : "var(--slate)",
            fontSize: 11,
          }}
        >
          <Icon name={t.icon} size={18} />
          <div style={{ marginTop: 2 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}
