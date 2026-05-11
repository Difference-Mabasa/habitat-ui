import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Photo from "@/components/Photo";
import Eyebrow from "@/components/Eyebrow";
import AreaCard from "@/components/AreaCard";

const STATS: [string, string][] = [
  ["Avg. rent", "R 3,450"],
  ["Spots available", "1,206"],
  ["Avg. vacancy", "8 days"],
  ["Verified landlords", "412"],
];

const SUB_AREAS: { name: string; priceFrom: string; count: number }[] = [
  { name: "Orlando West", priceFrom: "R 3,650", count: 184 },
  { name: "Diepkloof", priceFrom: "R 3,200", count: 211 },
  { name: "Mofolo", priceFrom: "R 3,480", count: 134 },
  { name: "Pimville", priceFrom: "R 3,950", count: 96 },
  { name: "Meadowlands", priceFrom: "R 2,950", count: 158 },
  { name: "Jabavu", priceFrom: "R 3,100", count: 142 },
  { name: "Dube", priceFrom: "R 3,890", count: 88 },
  { name: "Klipspruit", priceFrom: "R 2,750", count: 193 },
];

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  { icon: "wifi", title: "Connected", body: "Fibre in Orlando, Pimville, and Dube. Taxis to Joburg CBD every 4 minutes." },
  { icon: "users", title: "Community", body: "Strong stokvels, churches, and street committees — landlords know their neighbours." },
  { icon: "flame", title: "Affordable", body: "30% cheaper than Joburg CBD for similar amenities. Prepaid utilities." },
];

const NEW_LISTINGS = [
  { id: "n1", title: "Backroom in Orlando", price: "R 3,200", sub: "Available 1 June · 18m² · verified" },
  { id: "n2", title: "Cottage in Pimville", price: "R 4,100", sub: "Available 8 June · 32m² · verified" },
  { id: "n3", title: "Bachelor flat in Diepkloof", price: "R 3,600", sub: "Available now · 24m² · verified" },
];

export default function Neighbourhood() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      {/* Hero */}
      <div style={{ position: "relative", height: 360, overflow: "hidden", background: "var(--ink)" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(135deg, #2A1709 0 14px, #321B0C 14px 28px)",
            opacity: 0.7,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, var(--ink) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            padding: "0 32px 36px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", color: "var(--paper)" }}>
            <Eyebrow style={{ color: "var(--accent)" }}>South Africa · Gauteng · Soweto</Eyebrow>
            <h1
              className="display"
              style={{ fontSize: 96, margin: "8px 0", color: "var(--paper)" }}
            >
              SOWETO
            </h1>
            <p style={{ fontSize: 16, color: "rgba(247,239,226,0.7)", maxWidth: 560, margin: 0 }}>
              South Africa's largest township — 1.3M residents, 1,200 active listings, average vacancy 8
              days.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "-40px auto 0",
          padding: "0 32px 64px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Stats */}
        <Card
          padding={0}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 36 }}
        >
          {STATS.map(([label, value], i) => (
            <div
              key={label}
              style={{
                padding: "22px 28px",
                borderRight: i < STATS.length - 1 ? "1px solid var(--hairline)" : "none",
              }}
            >
              <div className="display tabular" style={{ fontSize: 36 }}>
                {value}
              </div>
              <Eyebrow style={{ marginTop: 4 }}>{label}</Eyebrow>
            </div>
          ))}
        </Card>

        {/* Sub-areas */}
        <div className="display" style={{ fontSize: 32, marginBottom: 20 }}>
          POPULAR SUB-AREAS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 48,
          }}
        >
          {SUB_AREAS.map((a) => (
            <AreaCard key={a.name} name={a.name} count={a.count} priceFrom={a.priceFrom} />
          ))}
        </div>

        {/* Why people choose */}
        <Card padding={36} style={{ marginBottom: 32 }}>
          <div className="display" style={{ fontSize: 28, marginBottom: 24 }}>
            WHY PEOPLE CHOOSE SOWETO
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {FEATURES.map((f) => (
              <div key={f.title}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <Icon name={f.icon} size={20} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
                <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, lineHeight: 1.5 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top listings teaser */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 16,
          }}
        >
          <div className="display" style={{ fontSize: 32 }}>
            NEW IN SOWETO
          </div>
          <Button variant="ghost" size="sm" rightIcon="arrR">
            Browse all 1,206
          </Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {NEW_LISTINGS.map((l) => (
            <Card key={l.id} padding={0} style={{ overflow: "hidden" }}>
              <Photo label={l.title} ratio="16/10" style={{ borderRadius: 0 }} />
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600 }}>{l.title}</div>
                  <div className="mono" style={{ fontWeight: 600 }}>
                    {l.price}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>{l.sub}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
