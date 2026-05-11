import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";

const SPOTS: [string, string, string][] = [
  ["Backroom · Orlando East", "R 3,200", "18m² · verified · listed today"],
  ["Bachelor · Diepkloof Zone 2", "R 4,100", "Single room + shared kitchen"],
  ["Cottage · Mofolo North", "R 4,800", "2 rooms · private entry · fibre"],
];

const STATS: [string, string][] = [
  ["12,840", "active spots"],
  ["R 3,450", "median rent"],
  ["8 days", "avg vacancy"],
];

export default function Newsletter() {
  return (
    <div style={{ background: "var(--surface-2)", minHeight: "100vh", padding: 32 }}>
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Client chrome */}
        <Card
          padding="14px 18px"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ fontSize: 13, color: "var(--slate)" }}>
            Tuesday Digest · 12 May 2026 · 28k subscribers
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm">
              Preview mobile
            </Button>
            <Button variant="accent" size="sm">
              Send test
            </Button>
          </div>
        </Card>

        {/* Email */}
        <div style={{ background: "#fff", boxShadow: "var(--shadow-lg)" }}>
          {/* Banner */}
          <div
            style={{
              background: "var(--ink)",
              padding: "26px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Logo size={16} invert />
            <div
              className="mono"
              style={{ fontSize: 11, color: "rgba(247,239,226,0.6)" }}
            >
              Issue #44 · 12 May 2026
            </div>
          </div>

          <div style={{ padding: 32 }}>
            {/* Headline */}
            <Eyebrow style={{ color: "var(--accent)" }}>This week in your spots</Eyebrow>
            <h1
              className="display"
              style={{ fontSize: 44, margin: "10px 0 14px", lineHeight: 0.95 }}
            >
              23 NEW SPOTS IN
              <br />
              YOUR AREA.
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6 }}>
              Sawubona Sipho — fresh inventory in Orlando, Diepkloof, and Mofolo, plus a deep read on the
              new POPIA rule that affects your deposit.
            </p>

            {/* Top spots */}
            <h3 className="display" style={{ fontSize: 22, marginTop: 32 }}>
              TOP NEW SPOTS
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {SPOTS.map(([t, p, d]) => (
                <a
                  key={t}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: 12,
                    background: "var(--surface-2)",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "var(--ink)",
                  }}
                >
                  <Photo
                    ratio="16/10"
                    label=""
                    style={{ width: 120, height: 76, flexShrink: 0, borderRadius: 8 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>{d}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>
                      {p}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--slate)" }}>/mo</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Read of the week */}
            <h3 className="display" style={{ fontSize: 22, marginTop: 32 }}>
              READ OF THE WEEK
            </h3>
            <Photo label="Deposit rule 2026" ratio="21/9" style={{ marginTop: 12, borderRadius: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 10 }}>
              The new POPIA deposit rule, explained in 3 minutes
            </div>
            <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55, margin: "6px 0 12px" }}>
              From 1 July 2026 landlords must show interest earned on your deposit. Here's what changes
              for you.
            </p>
            <button
              type="button"
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "10px 18px",
                border: 0,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Read article →
            </button>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginTop: 32,
                padding: 16,
                background: "var(--surface-2)",
                borderRadius: 10,
              }}
            >
              {STATS.map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div className="display tabular" style={{ fontSize: 22 }}>
                    {v}
                  </div>
                  <Eyebrow style={{ marginTop: 2 }}>{l}</Eyebrow>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "20px 32px",
              borderTop: "1px solid var(--hairline)",
              fontSize: 10,
              color: "var(--slate)",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Habitat SA Pty Ltd · 8 Bree Street, Cape Town
            <br />
            You're getting this because you saved searches in Orlando.{" "}
            <a href="#" style={{ color: "var(--slate)", textDecoration: "underline" }}>
              Manage frequency
            </a>{" "}
            ·{" "}
            <a href="#" style={{ color: "var(--slate)", textDecoration: "underline" }}>
              Unsubscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
