import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Hairline from "@/components/Hairline";
import Photo from "@/components/Photo";
import Tabs from "@/components/Tabs";
import RatingDisplay from "@/components/RatingDisplay";

const STATS: [string, string][] = [
  ["Active listings", "14"],
  ["Avg. response", "1.4 h"],
  ["Filled this year", "32"],
  ["Member since", "2022"],
];

interface Listing {
  id: string;
  title: string;
  price: string;
  area: string;
  badge?: "new";
}

const LISTINGS: Listing[] = [
  { id: "l1", title: "Backroom · Vilakazi St", price: "R 3,450", area: "Orlando West" },
  { id: "l2", title: "Cottage · Mofolo North", price: "R 4,800", area: "Mofolo", badge: "new" },
  { id: "l3", title: "Bachelor flat · Pimville", price: "R 3,950", area: "Pimville" },
  { id: "l4", title: "Backroom · Diepkloof Z2", price: "R 2,850", area: "Diepkloof" },
];

const TABS = [
  { id: "listings", label: "Listings · 14" },
  { id: "about", label: "About" },
  { id: "reviews", label: "Reviews · 127" },
];

export default function AgentProfile() {
  const [tab, setTab] = useState("listings");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      {/* Cover */}
      <div
        style={{
          position: "relative",
          height: 200,
          background: "linear-gradient(135deg, #2A1709 0%, #4A2410 100%)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: -52 }}>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 24,
              background: "var(--surface-2)",
              border: "4px solid var(--paper)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-display)",
              fontSize: 56,
              color: "var(--ink)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            NM
          </div>
          <div style={{ flex: 1, paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <h1 className="display" style={{ fontSize: 38, margin: 0 }}>
                NALEDI MOKOENA
              </h1>
              <Badge tone="success" leftIcon="check">
                Verified
              </Badge>
              <Badge tone="neutral">PPRA · FFC-022831</Badge>
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--slate)",
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="pin" size={14} /> Soweto · Diepkloof · Orlando
              </span>
              <span>·</span>
              <span>
                Agent at <strong style={{ color: "var(--ink)" }}>Vilakazi Property Co.</strong>
              </span>
              <span>·</span>
              <RatingDisplay rating={4.8} count={127} size="sm" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, paddingBottom: 12, flexShrink: 0 }}>
            <Button variant="secondary">Save agent</Button>
            <Button variant="accent" leftIcon="chat">
              Message Naledi
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <Card
          padding={0}
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {STATS.map(([label, value], i) => (
            <div
              key={label}
              style={{
                padding: "20px 28px",
                borderRight: i < STATS.length - 1 ? "1px solid var(--hairline)" : "none",
              }}
            >
              <div className="display tabular" style={{ fontSize: 32 }}>
                {value}
              </div>
              <Eyebrow style={{ marginTop: 4 }}>{label}</Eyebrow>
            </div>
          ))}
        </Card>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              <Tabs variant="underline" tabs={TABS} value={tab} onChange={setTab} />
            </div>

            {/* Listings grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {LISTINGS.map((l) => (
                <Card key={l.id} padding={0} style={{ overflow: "hidden" }}>
                  <Photo label="Backroom · Soweto" ratio="16/10" style={{ borderRadius: 0 }} />
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{l.title}</div>
                        <div style={{ fontSize: 12, color: "var(--slate)" }}>{l.area}</div>
                      </div>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>
                        {l.price}
                      </div>
                    </div>
                    {l.badge === "new" ? (
                      <div style={{ marginTop: 10 }}>
                        <Badge tone="accent">New today</Badge>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <div className="display" style={{ fontSize: 20, marginBottom: 6 }}>
                ABOUT NALEDI
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6, margin: 0 }}>
                10 years managing properties across Soweto and the surrounds. Specialises in single rooms,
                cottages, and short-stay rentals for working families.
              </p>
              <Hairline style={{ margin: "16px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Icon name="chat" size={14} style={{ color: "var(--slate)" }} /> Speaks Zulu, Sotho,
                  English
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Icon name="clock" size={14} style={{ color: "var(--slate)" }} /> Active Mon–Sat, 7am–7pm
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Icon name="shield" size={14} style={{ color: "var(--success)" }} /> ID & bank verified
                </div>
              </div>
            </Card>
            <Card
              padding={20}
              style={{ background: "var(--surface-2)", borderColor: "transparent" }}
            >
              <Eyebrow>Recent review</Eyebrow>
              <p style={{ fontSize: 13, lineHeight: 1.5, margin: "10px 0", fontStyle: "italic" }}>
                "Replied to my WhatsApp the same evening. Lease was sorted in 3 days. Recommend."
              </p>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>— Thabo K. · April 2026</div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
