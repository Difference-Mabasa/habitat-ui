import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";

interface CaseMetric {
  label: string;
  value: string;
  sub: string;
}

const METRICS: CaseMetric[] = [];

export default function CaseStudy() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 0" }}>
        <Eyebrow>Landlord stories</Eyebrow>
        <h1 className="display" style={{ fontSize: 96, lineHeight: 0.92, margin: "16px 0 24px" }}>
          LANDLORDS,
          <br />
          ON HABITAT.
        </h1>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        {METRICS.length === 0 ? (
          <Card padding={0} style={{ margin: "32px 0" }}>
            <EmptyState
              icon="info"
              title="No case studies yet"
              description="Landlord stories and their results will appear here once we publish them."
              actions={
                <Button variant="accent">List your first spot</Button>
              }
            />
          </Card>
        ) : (
          <Card
            padding={0}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", margin: "32px 0" }}
          >
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  padding: "22px 26px",
                  borderRight: i < METRICS.length - 1 ? "1px solid var(--hairline)" : "none",
                }}
              >
                <div className="display tabular" style={{ fontSize: 32 }}>
                  {m.value}
                </div>
                <Eyebrow style={{ marginTop: 4 }}>{m.label}</Eyebrow>
                <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 4 }}>{m.sub}</div>
              </div>
            ))}
          </Card>
        )}
        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}
