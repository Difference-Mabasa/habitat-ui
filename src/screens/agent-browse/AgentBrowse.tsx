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
import Avatar from "@/components/Avatar";
import RatingDisplay from "@/components/RatingDisplay";
import EmptyState from "@/components/EmptyState";

interface AgentRow {
  id: string;
  name: string;
  init: string;
  agency: string;
  areas: string[];
  rating: number;
  reviews: number;
  listings: number;
  responseTime: string;
  languages: string[];
  verified: boolean;
  feeTenant?: string;
}

const AGENTS: AgentRow[] = [];

const FILTERS = [
  { id: "all", label: "All agents", count: 0 },
  { id: "soweto", label: "Soweto", count: 0 },
  { id: "inner", label: "Inner City", count: 0 },
];

const SORTS = [
  { id: "top", label: "Top-rated" },
  { id: "fast", label: "Fastest reply" },
  { id: "most", label: "Most listings" },
];

export default function AgentBrowse() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("top");

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
          <Eyebrow style={{ color: "var(--accent)" }}>Find an agent</Eyebrow>
          <h1 className="display" style={{ fontSize: 56, color: "var(--paper)", margin: "8px 0 12px" }}>
            VERIFIED AGENTS <span style={{ color: "var(--accent)" }}>NEAR YOU</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 560, color: "rgba(247,239,226,0.7)", margin: "0 0 24px" }}>
            PPRA-registered, ID + bank verified. Filter by suburb or specialty. Reach out direct — first
            reply is free.
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
              placeholder="Soweto, Brixton, Maboneng…"
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
          <Tabs variant="segmented" tabs={SORTS} value={sort} onChange={setSort} />
        </div>

        {AGENTS.length === 0 ? (
          <Card padding={32}>
            <EmptyState
              icon="users"
              title="No agents to compare"
              description="Verified agents in your areas will appear here."
            />
          </Card>
        ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {AGENTS.map((a) => (
            <Card key={a.id} padding={20} interactive style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Avatar name={a.init} size="lg" tone="neutral" style={{ width: 56, height: 56, fontSize: 18 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{a.name}</div>
                    {a.verified ? <Badge tone="success" leftIcon="check">Verified</Badge> : null}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                    Agent at <strong style={{ color: "var(--ink)" }}>{a.agency}</strong>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <RatingDisplay rating={a.rating} count={a.reviews} size="sm" />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <Stat label="Active listings" value={`${a.listings}`} />
                <Stat label="Avg. reply" value={a.responseTime} tone="success" />
                <Stat label="Tenant fee" value={a.feeTenant ?? "Free"} />
              </div>

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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Icon name="pin" size={11} /> {area}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: 12, color: "var(--slate)" }}>
                Speaks {a.languages.join(", ")}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  paddingTop: 12,
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <Button variant="accent" size="sm" leftIcon="chat" style={{ flex: 1, justifyContent: "center" }}>
                  Message
                </Button>
                <Button variant="secondary" size="sm" rightIcon="chevR" style={{ flex: 1, justifyContent: "center" }}>
                  View profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "var(--surface-2)",
        borderRadius: 8,
      }}
    >
      <Eyebrow style={{ marginBottom: 4 }}>{label}</Eyebrow>
      <div
        className="tabular"
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: tone === "success" ? "var(--success)" : "var(--ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
