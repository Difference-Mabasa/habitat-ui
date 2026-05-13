import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";

interface NewsletterSpot {
  title: string;
  price: string;
  detail: string;
}

const SPOTS: NewsletterSpot[] = [];

const STATS: [string, string][] = [
  ["—", "active spots"],
  ["R 0", "median rent"],
  ["—", "avg vacancy"],
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
            Tuesday Digest · {`{{issue_date}}`} · {`{{subscriber_count}}`} subscribers
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
              Issue #{`{{issue_number}}`} · {`{{issue_date}}`}
            </div>
          </div>

          <div style={{ padding: 32 }}>
            {/* Headline */}
            <Eyebrow style={{ color: "var(--accent)" }}>This week in your spots</Eyebrow>
            <h1
              className="display"
              style={{ fontSize: 44, margin: "10px 0 14px", lineHeight: 0.95 }}
            >
              {`{{new_count}}`} NEW SPOTS IN
              <br />
              YOUR AREA.
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6 }}>
              {`{{greeting}} {{recipient_name}}`} — fresh inventory in your saved areas, plus a deep
              read of the week.
            </p>

            {/* Top spots */}
            <h3 className="display" style={{ fontSize: 22, marginTop: 32 }}>
              TOP NEW SPOTS
            </h3>
            {SPOTS.length === 0 ? (
              <div
                style={{
                  marginTop: 12,
                  padding: 24,
                  border: "1px dashed var(--hairline-strong)",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--slate)",
                }}
              >
                Top spots will render here from your saved searches.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                {SPOTS.map((s) => (
                  <a
                    key={s.title}
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
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>{s.detail}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>
                        {s.price}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--slate)" }}>/mo</div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Read of the week */}
            <h3 className="display" style={{ fontSize: 22, marginTop: 32 }}>
              READ OF THE WEEK
            </h3>
            <Photo label="" ratio="21/9" style={{ marginTop: 12, borderRadius: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 10 }}>
              {`{{article_title}}`}
            </div>
            <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.55, margin: "6px 0 12px" }}>
              {`{{article_summary}}`}
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
            You're getting this because you saved searches in {`{{saved_area}}`}.{" "}
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
