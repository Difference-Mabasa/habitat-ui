import Nav from "@/components/Nav";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import EmptyState from "@/components/EmptyState";

const STATS: [string, string][] = [
  ["Active spots", "—"],
  ["Cities", "—"],
  ["Tenants moved in", "—"],
  ["Disputes resolved", "—"],
];

const FOUNDERS: [string, string][] = [];

const MILESTONES: [string, string, string][] = [];

const PRESS: string[] = [];

export default function About() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ padding: "64px 32px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <Eyebrow>Habitat</Eyebrow>
        <h1 className="display" style={{ fontSize: 120, lineHeight: 0.92, margin: "16px 0 24px" }}>
          OUR JOB IS
          <br />
          YOUR SPOT.
        </h1>
        <p style={{ fontSize: 18, color: "var(--slate)", maxWidth: 640, lineHeight: 1.5 }}>
          We're a Cape Town team building the rails for South Africa's informal rental market.
          Building trust infrastructure for renting that already happens — just without recourse,
          contracts, or receipts.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <Card
          padding={0}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 48 }}
        >
          {STATS.map(([l, v], i) => (
            <div
              key={l}
              style={{
                padding: "24px 28px",
                borderRight: i < STATS.length - 1 ? "1px solid var(--hairline)" : "none",
              }}
            >
              <div className="display tabular" style={{ fontSize: 40 }}>
                {v}
              </div>
              <Eyebrow style={{ marginTop: 4 }}>{l}</Eyebrow>
            </div>
          ))}
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36, marginBottom: 64 }}>
          <div>
            <Eyebrow>The story</Eyebrow>
            <h2 className="display" style={{ fontSize: 44, margin: "8px 0 18px" }}>
              BUILT FOR SA RENTING.
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 14 }}>
              South Africa's informal rental market runs on verbal agreements, cash, and trust. When
              the trust breaks, there's no contract, no receipt, and no recourse — and finding the
              next room means starting from scratch.
            </p>
            <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7 }}>
              Habitat helps tenants and verified landlords keep clean records, pay rent on time, and
              resolve disputes — without lawyers.
            </p>
          </div>
          <Photo label="Founding team" ratio="4/5" />
        </div>

        <Eyebrow style={{ marginBottom: 12 }}>Founders & leadership</Eyebrow>
        {FOUNDERS.length === 0 ? (
          <Card padding={0} style={{ marginBottom: 64 }}>
            <EmptyState
              icon="users"
              title="Team profiles coming soon"
              description="Leadership bios will appear here."
            />
          </Card>
        ) : null}

        <h3 className="display" style={{ fontSize: 32, marginBottom: 18 }}>
          MILESTONES
        </h3>
        {MILESTONES.length === 0 ? (
          <Card padding={0} style={{ marginBottom: 64 }}>
            <EmptyState
              icon="calendar"
              title="No milestones to show yet"
              description="Key dates will be added as the platform grows."
            />
          </Card>
        ) : null}

        <h3 className="display" style={{ fontSize: 32, marginBottom: 16 }}>
          IN THE PRESS
        </h3>
        {PRESS.length === 0 ? (
          <Card padding={0} style={{ marginBottom: 64 }}>
            <EmptyState
              icon="paper"
              title="No press coverage yet"
              description="Mentions and articles will appear here."
            />
          </Card>
        ) : null}
        <div style={{ paddingBottom: 64 }} />
      </div>
    </div>
  );
}
