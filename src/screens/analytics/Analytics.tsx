import LandlordShell from "@/components/LandlordShell";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import InlineLink from "@/components/InlineLink";

interface FunnelRow {
  stage: string;
  n: number;
  pct: number;
}

const FUNNEL: FunnelRow[] = [
  { stage: "Saw listing", n: 1284, pct: 100 },
  { stage: "Opened detail", n: 412, pct: 32 },
  { stage: "Saved", n: 47, pct: 3.7 },
  { stage: "Started application", n: 18, pct: 1.4 },
  { stage: "Submitted application", n: 12, pct: 0.9 },
  { stage: "Approved (you said yes)", n: 1, pct: 0.08 },
];

interface Suggestion {
  title: string;
  body: string;
  cta: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    title: "Raise rent to R 5,600",
    body: "Comparable studios with solar are letting at R5,500–5,800. You're R200 below market.",
    cta: "Apply suggestion",
  },
  {
    title: "Add 4 more photos",
    body: "Listings with 10+ photos get 2.3× more applications. You currently have 6.",
    cta: "Add photos",
  },
  {
    title: "Mention 'walk to 7th Street'",
    body: "Tenants searching Melville filter for 7th Street access. Adding this surfaces you in 2× more queries.",
    cta: "Edit description",
  },
];

export default function Analytics() {
  return (
    <LandlordShell activeId="insights">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div style={{ marginBottom: 12 }}>
          <InlineLink
            to="/landlord-dashboard"
            icon="chevL"
            iconPosition="left"
            size="sm"
            tone="slate"
          >
            Properties · Studio · Melville
          </InlineLink>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Performance · last 30 days
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>
              Studio · Melville
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" size="sm" rightIcon="chevD">
              30 days
            </Button>
            <Button variant="secondary" size="sm" leftIcon="edit">
              Edit listing
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
          <KpiTile label="Listing views" value="1,284" subText="+312" subTone="success" />
          <KpiTile label="Saved" value="47" subText="+18" subTone="success" />
          <KpiTile label="Applications" value="12" subText="+4" subTone="success" />
          <KpiTile label="Time-to-let" value="9 days" subText="−4 vs avg" subTone="success" />
          <KpiTile
            label="Recommended price"
            value="R 5,600"
            subText="+R200 vs current"
            subTone="accent"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 1fr", gap: 16, marginBottom: 16 }}>
          {/* Funnel */}
          <Card padding={24}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Conversion funnel</div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 24 }}>
              What happens after someone sees your listing.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FUNNEL.map((r) => (
                <div
                  key={r.stage}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr 80px 60px",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--slate)" }}>{r.stage}</span>
                  <div
                    style={{
                      height: 18,
                      background: "var(--surface-3)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.pct}%`,
                        minWidth: 4,
                        height: "100%",
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                  <span className="tabular" style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>
                    {r.n.toLocaleString()}
                  </span>
                  <span
                    className="tabular"
                    style={{ fontSize: 11, color: "var(--slate)", textAlign: "right" }}
                  >
                    {r.pct}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Views chart */}
          <Card padding={24}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Daily views</div>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 20 }}>
              Spike on 12 Mar — you re-listed with new photos.
            </div>
            <DailyViewsChart />
          </Card>
        </div>

        <Card padding={24}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            3 ways to improve this listing
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 20 }}>
            Based on similar Melville studios that let in under 7 days.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {SUGGESTIONS.map((s) => (
              <SuggestionCard key={s.title} suggestion={s} />
            ))}
          </div>
        </Card>
      </div>
    </LandlordShell>
  );
}

function DailyViewsChart() {
  return (
    <svg viewBox="0 0 600 200" style={{ width: "100%", height: 200 }} aria-label="Daily views line chart">
      <line x1="0" y1="50" x2="600" y2="50" stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="0" y1="100" x2="600" y2="100" stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="0" y1="150" x2="600" y2="150" stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 4" />
      <path
        d="M 0 160 L 30 152 L 60 148 L 90 140 L 120 138 L 150 130 L 180 110 L 210 65 L 240 80 L 270 95 L 300 88 L 330 78 L 360 70 L 390 64 L 420 72 L 450 60 L 480 56 L 510 50 L 540 58 L 570 52 L 600 48 L 600 200 L 0 200 Z"
        fill="color-mix(in oklch, var(--accent) 12%, transparent)"
      />
      <path
        d="M 0 160 L 30 152 L 60 148 L 90 140 L 120 138 L 150 130 L 180 110 L 210 65 L 240 80 L 270 95 L 300 88 L 330 78 L 360 70 L 390 64 L 420 72 L 450 60 L 480 56 L 510 50 L 540 58 L 570 52 L 600 48"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <circle cx="210" cy="65" r="4" fill="var(--accent)" />
      <text x="220" y="58" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink)">
        Re-list · 312 views
      </text>
    </svg>
  );
}

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const icon: IconName = "sparkle";
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid var(--hairline)",
        borderRadius: 8,
        background: "var(--surface-2)",
      }}
    >
      <Icon name={icon} size={16} style={{ color: "var(--accent)", marginBottom: 10 }} />
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{suggestion.title}</div>
      <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, marginBottom: 12 }}>
        {suggestion.body}
      </div>
      <Button variant="ghost" size="sm" rightIcon="chevR" style={{ padding: 0 }}>
        {suggestion.cta}
      </Button>
    </div>
  );
}
