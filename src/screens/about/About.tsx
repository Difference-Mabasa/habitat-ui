import Nav from "@/components/Nav";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import Avatar from "@/components/Avatar";

const STATS: [string, string][] = [
  ["Active spots", "12,840"],
  ["Cities", "9"],
  ["Tenants moved in", "38,210"],
  ["Disputes resolved", "98.4%"],
];

const FOUNDERS: [string, string][] = [
  ["Sipho Khumalo", "CEO · Cape Town"],
  ["Naledi Mokoena", "COO · Joburg"],
  ["Thabang Modise", "Head of Legal · Soweto"],
  ["Karabo Dlamini", "CTO · Cape Town"],
];

const MILESTONES: [string, string, string][] = [
  ["May 2026", "30k tenants moved in", "Hit 30,000 verified moves across 9 cities."],
  ["Jan 2026", "Series A · R 48M", "Led by Knife Capital and HAVAÍC."],
  ["Aug 2025", "PPRA registered", "First informal-rental platform to register as a property practitioner."],
  ["Mar 2024", "Pre-seed · R 6M", "Backed by E-Squared and Allan Gray E²."],
  ["Sep 2022", "First lease signed", "Naledi let her backroom on Vilakazi to Thabo. He's still there."],
];

const PRESS = ["Daily Maverick", "Ventureburn", "TimesLIVE", "Bloomberg Africa"];

export default function About() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ padding: "64px 32px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <Eyebrow>Backroom · est. 2022</Eyebrow>
        <h1 className="display" style={{ fontSize: 120, lineHeight: 0.92, margin: "16px 0 24px" }}>
          OUR JOB IS
          <br />
          YOUR SPOT.
        </h1>
        <p style={{ fontSize: 18, color: "var(--slate)", maxWidth: 640, lineHeight: 1.5 }}>
          We're a Cape Town team building the rails for South Africa's informal rental market. 1.3
          million backrooms. R 14B in cash, every month. Zero trust infrastructure. That's the problem
          we're fixing.
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
              STARTED IN SOWETO.
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 14 }}>
              In 2022 our co-founder Sipho lost his deposit after a verbal lease in Orlando went
              sideways. There was no contract, no receipt, no recourse — and no easy way to find the
              next room either.
            </p>
            <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7 }}>
              Three years later, Backroom helps over 38,000 tenants and 4,200 verified landlords keep
              clean records, pay rent on time, and resolve disputes — without lawyers.
            </p>
          </div>
          <Photo label="Soweto founding team" ratio="4/5" />
        </div>

        <Eyebrow style={{ marginBottom: 12 }}>Founders & leadership</Eyebrow>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 64,
          }}
        >
          {FOUNDERS.map(([n, r]) => (
            <Card key={n} padding={20}>
              <Avatar
                name={n}
                size="lg"
                tone="neutral"
                shape="square"
                style={{ width: 60, height: 60, fontSize: 20, marginBottom: 14, borderRadius: 14 }}
              />
              <div style={{ fontWeight: 600, fontSize: 15 }}>{n}</div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>{r}</div>
            </Card>
          ))}
        </div>

        <h3 className="display" style={{ fontSize: 32, marginBottom: 18 }}>
          MILESTONES
        </h3>
        <Card padding={0} style={{ overflow: "hidden", marginBottom: 64 }}>
          {MILESTONES.map(([d, t, c], i) => (
            <div
              key={d}
              style={{
                padding: "18px 24px",
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                borderTop: i ? "1px solid var(--hairline)" : "none",
              }}
            >
              <div className="mono" style={{ fontWeight: 600, color: "var(--slate)" }}>
                {d}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 3 }}>{c}</div>
              </div>
            </div>
          ))}
        </Card>

        <h3 className="display" style={{ fontSize: 32, marginBottom: 16 }}>
          IN THE PRESS
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            paddingBottom: 64,
          }}
        >
          {PRESS.map((p) => (
            <Card
              key={p}
              padding={22}
              style={{ textAlign: "center", fontWeight: 600, fontSize: 14, color: "var(--slate)" }}
            >
              {p}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
