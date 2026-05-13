import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

interface TileProps {
  icon: IconName;
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: "neutral" | "accent";
}

function Tile({ icon, label, value, sub, tone = "neutral" }: TileProps) {
  return (
    <div
      style={{
        padding: 14,
        background: tone === "accent" ? "var(--accent-soft)" : "var(--surface-2)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Icon
        name={icon}
        size={16}
        style={{ color: tone === "accent" ? "var(--accent)" : "var(--slate)" }}
      />
      <div className="display tabular" style={{ fontSize: 22, lineHeight: 1, marginTop: 4 }}>
        {value}
      </div>
      <Eyebrow>{label}</Eyebrow>
      {sub ? <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{sub}</div> : null}
    </div>
  );
}

const QUICK_ACTIONS: [IconName, string][] = [
  ["chat", "Message landlord"],
  ["wrench", "Report a problem"],
  ["paper", "View lease"],
  ["doc", "Get rent receipt"],
];

const TAB_BAR: { icon: IconName; label: string; active?: boolean }[] = [
  { icon: "search", label: "Browse" },
  { icon: "home", label: "My spot", active: true },
  { icon: "chat", label: "Inbox" },
  { icon: "user", label: "Me" },
];

const BREAKDOWN: [string, string][] = [
  ["Rent · single room", "R 0"],
  ["Water (incl. up to 6 kL)", "R 0"],
  ["Refuse", "R 0"],
  ["Maintenance fund", "R 0"],
];

export default function TenantMobile() {
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
      {/* Phone 1: home */}
      <Phone>
        <div style={{ background: "var(--ink)", padding: "44px 20px 20px", color: "var(--paper)" }}>
          <Eyebrow style={{ color: "rgba(247,239,226,0.6)" }}>Hello</Eyebrow>
          <div className="display" style={{ fontSize: 32, color: "var(--paper)", marginTop: 4 }}>
            YOUR SPOT
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
              fontSize: 13,
              color: "rgba(247,239,226,0.7)",
            }}
          >
            <Icon name="pin" size={14} /> No active lease
          </div>
        </div>

        <div style={{ padding: 18 }}>
          <Card
            padding={14}
            style={{
              background: "var(--accent)",
              color: "#fff",
              borderColor: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Eyebrow style={{ color: "rgba(255,255,255,0.85)" }}>Rent due</Eyebrow>
              <div className="display tabular" style={{ fontSize: 28, color: "#fff", marginTop: 2 }}>
                R 0
              </div>
            </div>
            <button
              type="button"
              style={{
                background: "#fff",
                color: "var(--accent)",
                padding: "10px 14px",
                borderRadius: 8,
                border: 0,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Pay now
            </button>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            <Tile icon="key" label="Lease" value="—" sub="no active lease" />
            <Tile icon="shield" label="Deposit" value="R 0" sub="held in trust" />
            <Tile icon="check" label="Score" value="—" sub="no score yet" tone="accent" />
            <Tile icon="wrench" label="Tickets" value="0" sub="all clear" />
          </div>

          <Eyebrow style={{ marginTop: 22, marginBottom: 10 }}>Quick actions</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {QUICK_ACTIONS.map(([icon, label]) => (
              <div
                key={label}
                style={{
                  padding: "14px",
                  background: "var(--surface-2)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Icon name={icon} size={16} style={{ color: "var(--slate)" }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                <Icon
                  name="chevR"
                  size={14}
                  style={{ color: "var(--slate)", marginLeft: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>

        <TabBar items={TAB_BAR} />
      </Phone>

      {/* Phone 2: rent breakdown */}
      <Phone>
        <div style={{ padding: "44px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="arrL" size={20} />
          <div className="display" style={{ fontSize: 22, margin: 0 }}>
            THIS MONTH
          </div>
        </div>

        <div style={{ padding: 18 }}>
          <div className="display tabular" style={{ fontSize: 52, color: "var(--accent)", lineHeight: 1 }}>
            R 0
          </div>
          <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>
            No active lease
          </div>

          <div style={{ marginTop: 22 }}>
            <Eyebrow style={{ marginBottom: 10 }}>Breakdown</Eyebrow>
            {BREAKDOWN.map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderTop: "1px dotted var(--hairline)",
                  fontSize: 14,
                }}
              >
                <span style={{ color: "var(--slate)" }}>{k}</span>
                <span className="mono" style={{ fontWeight: 600 }}>
                  {v}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0 0",
                borderTop: "2px solid var(--ink)",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              <span>Total</span>
              <span className="mono">R 0</span>
            </div>
          </div>

          <button
            type="button"
            style={{
              marginTop: 22,
              width: "100%",
              height: 52,
              background: "var(--accent)",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Pay rent
          </button>
          <button
            type="button"
            style={{
              marginTop: 8,
              width: "100%",
              height: 44,
              background: "transparent",
              color: "var(--ink)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Schedule auto-debit
          </button>

          <div
            style={{
              marginTop: 18,
              padding: 14,
              background: "var(--surface-2)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--slate)",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: "var(--ink)" }}>On-time streak: —</strong> Pay before the due
            date to build your streak.
          </div>
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
        padding: "8px 4px 18px",
        borderTop: "1px solid var(--hairline)",
        marginTop: 18,
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
