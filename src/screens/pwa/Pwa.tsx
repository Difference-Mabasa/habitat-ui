import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

const OFFLINE_AVAILABLE: [IconName, string][] = [
  ["paper", "Lease agreement"],
  ["doc", "Last 3 rent receipts"],
  ["pin", "Property address & directions"],
  ["info", "Emergency contact: Naledi"],
];

export default function Pwa() {
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
      {/* Install prompt */}
      <Phone>
        <div style={{ padding: "44px 20px 20px", background: "var(--surface-2)" }}>
          <Eyebrow>Browser · Chrome</Eyebrow>
          <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>backroom.co.za</div>
        </div>
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{ height: 80, opacity: 0.5 }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 24,
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--ink)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Logo size={12} invert />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Add Backroom to home</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                Faster · works offline · uses 2 MB
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              style={{
                background: "transparent",
                border: 0,
                color: "var(--slate)",
                cursor: "pointer",
              }}
            >
              <Icon name="x" size={18} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              type="button"
              style={{
                flex: 1,
                height: 44,
                background: "var(--surface-2)",
                border: 0,
                borderRadius: 10,
                fontWeight: 600,
                color: "var(--slate)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Not now
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                height: 44,
                background: "var(--accent)",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Install
            </button>
          </div>
        </div>
      </Phone>

      {/* Offline state */}
      <Phone>
        <div style={{ padding: "44px 20px 16px" }}>
          <div
            style={{
              background: "var(--warn-soft)",
              color: "var(--warn)",
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              aria-hidden="true"
              style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--warn)" }}
            />
            Offline · cached 18 min ago
          </div>
          <div className="display" style={{ fontSize: 26, marginTop: 12 }}>
            YOUR SPOT
          </div>
        </div>

        <div style={{ padding: "0 18px" }}>
          <Card padding={14} style={{ background: "var(--surface-2)" }}>
            <Eyebrow>Rent · May 2026</Eyebrow>
            <div className="display tabular" style={{ fontSize: 28, marginTop: 4 }}>
              R 3,450
            </div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>Due 1 June · cached info</div>
          </Card>

          <div
            style={{
              marginTop: 16,
              padding: 14,
              border: "1px dashed var(--hairline-strong)",
              borderRadius: 10,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              fontSize: 13,
            }}
          >
            <Icon
              name="info"
              size={16}
              style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <strong>You're offline.</strong> You can view your lease, deposit, and rent details.
              Payment & messaging need a connection.
            </div>
          </div>

          <Eyebrow style={{ marginTop: 22, marginBottom: 8 }}>Available offline</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {OFFLINE_AVAILABLE.map(([icon, label]) => (
              <div
                key={label}
                style={{
                  padding: 12,
                  background: "var(--surface-2)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                }}
              >
                <Icon name={icon} size={16} style={{ color: "var(--slate)" }} />
                {label}
              </div>
            ))}
          </div>

          <button
            type="button"
            style={{
              marginTop: 18,
              width: "100%",
              height: 44,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              color: "var(--slate)",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Icon name="refresh" size={14} /> Retry connection
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
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
