import LandlordShell from "@/components/LandlordShell";
import AgentShell from "@/components/AgentShell";
import { useWorkspace } from "@/lib/useWorkspace";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import KpiTile from "@/components/KpiTile";
import EmptyState from "@/components/EmptyState";
import InlineLink from "@/components/InlineLink";

interface FunnelRow {
  stage: string;
  n: number;
  pct: number;
}

const FUNNEL: FunnelRow[] = [
  { stage: "Saw listing", n: 0, pct: 0 },
  { stage: "Opened detail", n: 0, pct: 0 },
  { stage: "Saved", n: 0, pct: 0 },
  { stage: "Started application", n: 0, pct: 0 },
  { stage: "Submitted application", n: 0, pct: 0 },
  { stage: "Approved (you said yes)", n: 0, pct: 0 },
];

interface Suggestion {
  title: string;
  body: string;
  cta: string;
}

const SUGGESTIONS: Suggestion[] = [];

export default function Analytics() {
  const ws = useWorkspace();
  const Shell = ws === "agent" ? AgentShell : LandlordShell;
  return (
    <Shell activeId="insights">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div style={{ marginBottom: 12 }}>
          <InlineLink
            to="/landlord-dashboard"
            icon="chevL"
            iconPosition="left"
            size="sm"
            tone="slate"
          >
            Properties
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
              Listing
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
          <KpiTile label="Listing views" value="0" />
          <KpiTile label="Saved" value="0" />
          <KpiTile label="Applications" value="0" />
          <KpiTile label="Time-to-let" value="—" />
          <KpiTile label="Recommended price" value="R 0" />
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
              —
            </div>
            <EmptyState icon="trend" size="sm" title="No view data yet" />
          </Card>
        </div>

        <Card padding={24}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            Ways to improve this listing
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 20 }}>
            Suggestions appear once your listing has been live for a few days.
          </div>
          {SUGGESTIONS.length === 0 ? (
            <EmptyState icon="sparkle" size="sm" title="No suggestions yet" />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {SUGGESTIONS.map((s) => (
                <SuggestionCard key={s.title} suggestion={s} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </Shell>
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
