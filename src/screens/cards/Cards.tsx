import type { ReactNode } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import IconButton from "@/components/IconButton";
import Photo from "@/components/Photo";
import EmptyState from "@/components/EmptyState";

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <div className="display" style={{ fontSize: 26 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: "var(--slate)" }}>{sub}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function Cards() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Eyebrow>Component gallery</Eyebrow>
        <h1 className="display" style={{ fontSize: 64, margin: "8px 0 36px" }}>
          PROPERTY CARDS
        </h1>

        {/* Grid */}
        <Section title="GRID · default" sub="3-up on desktop, used on Browse and Saved.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[0, 1, 2].map((i) => (
              <Card key={i} padding={0} style={{ overflow: "hidden" }}>
                <div style={{ position: "relative" }}>
                  <Photo label="Backroom · Orlando" ratio="16/10" style={{ borderRadius: 0 }} />
                  <IconButton
                    icon="heart"
                    label="Save"
                    size="sm"
                    variant="secondary"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(255,255,255,0.95)",
                    }}
                  />
                  {i === 0 ? (
                    <span style={{ position: "absolute", top: 10, left: 10 }}>
                      <Badge tone="accent">New</Badge>
                    </span>
                  ) : null}
                </div>
                <div style={{ padding: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>Backroom · Vilakazi St</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>Orlando West · 18m²</div>
                    </div>
                    <div className="mono" style={{ fontWeight: 700 }}>
                      R 3,450
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 12,
                      color: "var(--slate)",
                      marginTop: 10,
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Icon name="bed" size={12} /> 1 room
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Icon name="bath" size={12} /> shared
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Icon name="wifi" size={12} /> fibre
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* List row */}
        <Section title="LIST ROW · dense" sub="Used in Saved, Compare, and tenant search history.">
          <Card padding={0} style={{ overflow: "hidden" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  borderTop: i ? "1px solid var(--hairline)" : "none",
                }}
              >
                <Photo
                  ratio="16/10"
                  label=""
                  style={{ width: 130, height: 84, flexShrink: 0, borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 600 }}>Backroom · Vilakazi St</span>
                    {i === 0 ? <Badge tone="success">Verified</Badge> : null}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                    Orlando West · 18m² · listed 3 days ago
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 12,
                      color: "var(--slate)",
                      marginTop: 8,
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Icon name="bed" size={12} /> 1 room
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Icon name="bath" size={12} /> shared
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Icon name="park" size={12} /> 1 parking
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontWeight: 700, fontSize: 16 }}>
                    R 3,450
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>per month</div>
                </div>
                <Button variant="secondary" size="sm" rightIcon="arrR">
                  View
                </Button>
              </div>
            ))}
          </Card>
        </Section>

        {/* Compact */}
        <Section title="COMPACT · 4-up" sub="Used in landlord dashboards and 'similar spots' carousels.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <Card key={i} padding={12} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Photo
                  ratio="1"
                  label=""
                  style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 8 }}
                />
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Backroom · Soweto
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
                    R 3,450
                  </div>
                  <div style={{ fontSize: 11, color: "var(--slate)" }}>Orlando · 18m²</div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Map pin */}
        <Section title="MAP PIN · clustered" sub="On full-map view. Active pin uses inverted style.">
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              padding: 32,
              background: "var(--surface-2)",
              borderRadius: 12,
            }}
          >
            {[
              { price: "R 3,450", active: false, sold: false, cluster: false, label: "Default" },
              { price: "R 3,450", active: true, sold: false, cluster: false, label: "Active" },
              { price: "12", active: false, sold: false, cluster: true, label: "Cluster" },
              { price: "—", active: false, sold: true, cluster: false, label: "Filled" },
            ].map((p, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  className="mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: p.cluster ? "8px 14px" : "10px 16px",
                    background: p.active ? "var(--ink)" : p.sold ? "var(--surface-3)" : "#fff",
                    color: p.active ? "var(--paper)" : p.sold ? "var(--slate)" : "var(--ink)",
                    border: p.active
                      ? "2px solid var(--accent)"
                      : "1px solid var(--hairline-strong)",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: "var(--shadow-sm)",
                    textDecoration: p.sold ? "line-through" : "none",
                  }}
                >
                  {p.cluster ? <Icon name="home" size={12} /> : null} {p.price}
                </div>
                <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 8 }}>{p.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Empty state card */}
        <Section title="EMPTY STATE" sub="Used when filters return nothing.">
          <Card padding={48} style={{ textAlign: "center" }}>
            <EmptyState
              icon="search"
              size="lg"
              title={
                <span className="display" style={{ fontSize: 26 }}>
                  NO SPOTS MATCH
                </span>
              }
              description="Try clearing the price filter or expanding your map radius."
              actions={
                <Button variant="accent" size="sm">
                  Clear filters
                </Button>
              }
            />
          </Card>
        </Section>
      </div>
    </div>
  );
}
