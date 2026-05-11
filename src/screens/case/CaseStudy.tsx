import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import Avatar from "@/components/Avatar";

const METRICS: [string, string, string][] = [
  ["Avg. vacancy", "5 days", "from 23 days"],
  ["Time to fill", "↓ 78%", "vs. classifieds"],
  ["Revenue lift", "+ R 18,200", "first quarter"],
  ["Reply time", "1.4 h", "team avg"],
];

export default function CaseStudy() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 0" }}>
        <Eyebrow>Landlord story · 11 May 2026</Eyebrow>
        <h1 className="display" style={{ fontSize: 96, lineHeight: 0.92, margin: "16px 0 24px" }}>
          "I FILLED 6 SPOTS
          <br />
          IN 3 WEEKS."
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "var(--slate)",
            fontSize: 14,
          }}
        >
          <Avatar
            name="Naledi Mokoena"
            size="lg"
            tone="neutral"
            style={{ width: 44, height: 44, fontSize: 14 }}
          />
          <div>
            <div style={{ fontWeight: 600, color: "var(--ink)" }}>Naledi Mokoena</div>
            <div>Landlord · 8 properties · Soweto</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        <Photo label="Naledi · Vilakazi St" ratio="21/9" />

        <Card
          padding={0}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", margin: "32px 0" }}
        >
          {METRICS.map(([l, v, s], i) => (
            <div
              key={l}
              style={{
                padding: "22px 26px",
                borderRight: i < METRICS.length - 1 ? "1px solid var(--hairline)" : "none",
              }}
            >
              <div className="display tabular" style={{ fontSize: 32 }}>
                {v}
              </div>
              <Eyebrow style={{ marginTop: 4 }}>{l}</Eyebrow>
              <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 36, marginTop: 32 }}>
          <article style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)" }}>
            <p style={{ marginTop: 0 }}>
              Naledi's family owns 8 backrooms across Orlando, Diepkloof, and Pimville. Until 2025,
              every vacancy meant a hand-written sign at the corner shop, 6 weeks of strangers knocking
              on the gate, and a stack of mismatched cash receipts.
            </p>
            <p>
              "We were losing R 60,000 a year to vacancies alone," she said. "And that's without the
              cost of arguments about the deposit."
            </p>

            <blockquote
              className="display"
              style={{
                margin: "32px 0",
                padding: "20px 28px",
                borderLeft: "4px solid var(--accent)",
                fontSize: 32,
                lineHeight: 1.15,
                letterSpacing: "-0.005em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              "I haven't put a sign on a wall in 9 months. Every spot fills before the old tenant
              leaves."
            </blockquote>

            <p>
              She joined Backroom in August 2025 after a neighbour pointed her to the verified-landlord
              program. Within three weeks she'd listed all 8 properties, FICA'd through the wizard, and
              switched to next-day payouts.
            </p>

            <h3 className="display" style={{ fontSize: 26, marginTop: 36 }}>
              WHAT CHANGED
            </h3>
            <ul style={{ paddingLeft: 18, fontSize: 16 }}>
              <li>
                <strong>Verified tenants only.</strong> Score-filtered applicants meant Naledi reviewed
                4 strong leads per spot, not 40 strangers.
              </li>
              <li>
                <strong>Auto-reminders.</strong> Rent collection went from "every 5th" to "no chasing".
              </li>
              <li>
                <strong>Photos & boost.</strong> One R 49 boost on each listing put it in front of 1,200
                verified seekers.
              </li>
            </ul>
          </article>

          <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card padding={22} style={{ background: "var(--ink)", color: "var(--paper)" }}>
              <Eyebrow style={{ color: "var(--accent)" }}>Naledi's setup</Eyebrow>
              <ul
                style={{
                  paddingLeft: 18,
                  fontSize: 14,
                  color: "rgba(247,239,226,0.85)",
                  lineHeight: 1.7,
                  marginTop: 8,
                }}
              >
                <li>Landlord plan · R 199/mo</li>
                <li>8 active listings</li>
                <li>Rent-guarantee on 6 units</li>
                <li>WhatsApp support active</li>
              </ul>
            </Card>
            <Card padding={22}>
              <Eyebrow>Want this?</Eyebrow>
              <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>
                Start with a free spot. Verify in 2 minutes. Done.
              </p>
              <Button variant="accent" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
                List your first spot
              </Button>
            </Card>
          </aside>
        </div>
        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}
