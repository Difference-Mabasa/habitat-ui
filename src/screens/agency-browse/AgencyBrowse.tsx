import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import Chip from "@/components/Chip";
import Tabs from "@/components/Tabs";
import RatingDisplay from "@/components/RatingDisplay";
import EmptyState from "@/components/EmptyState";

interface Agency {
  id: string;
  name: string;
  initials: string;
  bio: string;
  areas: string[];
  agents: number;
  mandates: number;
  rating: number;
  reviews: number;
  verified: boolean;
  featured?: boolean;
}

const AGENCIES: Agency[] = [];

const FILTERS = [
  { id: "all", label: "All agencies", count: 0 },
  { id: "soweto", label: "Soweto", count: 0 },
  { id: "inner", label: "Inner City", count: 0 },
  { id: "north", label: "North", count: 0 },
];

export default function AgencyBrowse() {
  const [filter, setFilter] = useState("all");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      {/* Hero */}
      <div
        style={{
          background:
            "radial-gradient(120% 80% at 80% 20%, #4A2410 0%, #2A1709 45%, #1E0F06 100%)",
          color: "var(--paper)",
          padding: "56px 32px 48px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Eyebrow style={{ color: "var(--accent)" }}>Find an agency</Eyebrow>
          <h1 className="display" style={{ fontSize: 56, color: "var(--paper)", margin: "8px 0 12px" }}>
            VERIFIED AGENCIES <span style={{ color: "var(--accent)" }}>NEAR YOU</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 560, color: "rgba(247,239,226,0.7)", margin: "0 0 24px" }}>
            PPRA-registered, FICA-compliant, with audited trust accounts. Browse by area or specialty.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              maxWidth: 720,
              background: "var(--paper)",
              padding: 8,
              borderRadius: 12,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <Icon name="search" size={18} style={{ marginLeft: 12, color: "var(--slate)" }} />
            <Input
              placeholder="Search by area"
              style={{ flex: 1, border: 0, background: "transparent", height: 44 }}
            />
            <Button variant="accent" size="md">Search</Button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <Tabs tabs={FILTERS} value={filter} onChange={setFilter} />
          <div style={{ flex: 1 }} />
          <Chip leftIcon="filter">Verified only</Chip>
          <Chip leftIcon="sliders">Sort: Rating</Chip>
        </div>

        {AGENCIES.length === 0 ? (
          <EmptyState
            icon="search"
            title="No agencies to show"
            description="Verified agencies will appear here once they're onboarded."
          />
        ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {AGENCIES.map((a) => (
            <Card key={a.id} padding={20} interactive style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    background: "var(--surface-2)",
                    border: "1px solid var(--hairline)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {a.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{a.name}</div>
                    {a.verified ? <Badge tone="success" leftIcon="check">Verified</Badge> : null}
                    {a.featured ? <Badge tone="accent">Featured</Badge> : null}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <RatingDisplay rating={a.rating} count={a.reviews} size="sm" />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "var(--slate)", margin: 0, lineHeight: 1.55 }}>{a.bio}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {a.areas.map((area) => (
                  <span
                    key={area}
                    style={{
                      fontSize: 11,
                      padding: "4px 8px",
                      background: "var(--surface-2)",
                      borderRadius: 6,
                      color: "var(--slate)",
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 12,
                  borderTop: "1px solid var(--hairline)",
                  gap: 16,
                  fontSize: 12,
                  color: "var(--slate)",
                }}
              >
                <span><strong style={{ color: "var(--ink)" }}>{a.agents}</strong> agents</span>
                <span><strong style={{ color: "var(--ink)" }}>{a.mandates}</strong> active mandates</span>
                <div style={{ flex: 1 }} />
                <Button variant="ghost" size="sm" rightIcon="chevR">View agency</Button>
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
