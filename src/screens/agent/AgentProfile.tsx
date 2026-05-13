import { useState } from "react";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import Hairline from "@/components/Hairline";
import Tabs from "@/components/Tabs";
import RatingDisplay from "@/components/RatingDisplay";
import KeyValueRow from "@/components/KeyValueRow";

const FEES = {
  landlord: { type: "PERCENT_OF_ANNUAL" as const, value: "—", note: "" },
  tenant: { value: "—", note: "" },
};

const AREAS: string[] = [];

interface Social {
  kind: "WhatsApp" | "Instagram" | "TikTok";
  handle: string;
  href: string;
}

const SOCIALS: Social[] = [];

const STATS: [string, string][] = [
  ["Active listings", "0"],
  ["Avg. response", "—"],
  ["Filled this year", "0"],
  ["Member since", "—"],
];

interface Listing {
  id: string;
  title: string;
  price: string;
  area: string;
  badge?: "new";
}

const LISTINGS: Listing[] = [];

const TABS = [
  { id: "listings", label: "Listings" },
  { id: "about", label: "About" },
  { id: "reviews", label: "Reviews" },
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
            —
          </div>
          <div style={{ flex: 1, paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <h1 className="display" style={{ fontSize: 38, margin: 0 }}>
                —
              </h1>
              <Badge tone="neutral">Unverified</Badge>
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
                <Icon name="pin" size={14} /> —
              </span>
              <span>·</span>
              <RatingDisplay rating={0} count={0} size="sm" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, paddingBottom: 12, flexShrink: 0 }}>
            <Button variant="secondary">Save agent</Button>
            <Button variant="accent" leftIcon="chat">
              Message agent
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
            {LISTINGS.length === 0 ? (
              <Card padding={20}>
                <EmptyState
                  icon="home"
                  title="No listings yet"
                  description="This agent has no active listings."
                />
              </Card>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {LISTINGS.map((l) => (
                  <Card key={l.id} padding={0} style={{ overflow: "hidden" }}>
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
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <div className="display" style={{ fontSize: 20, marginBottom: 6 }}>
                ABOUT
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6, margin: 0 }}>
                —
              </p>
              <Hairline style={{ margin: "16px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Icon name="chat" size={14} style={{ color: "var(--slate)" }} /> Languages: —
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Icon name="clock" size={14} style={{ color: "var(--slate)" }} /> Availability: —
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Icon name="shield" size={14} style={{ color: "var(--slate)" }} /> Verification pending
                </div>
              </div>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Fees</Eyebrow>
              <KeyValueRow
                label="Landlord — placement"
                value={
                  <span>
                    {FEES.landlord.value}
                    <span className="mono" style={{ fontSize: 10, color: "var(--slate-2)", marginLeft: 6 }}>
                      PERCENT_OF_ANNUAL
                    </span>
                  </span>
                }
                size="sm"
              />
              <div style={{ fontSize: 11, color: "var(--slate)", marginTop: -4, marginBottom: 8 }}>
                {FEES.landlord.note}
              </div>
              <KeyValueRow
                label="Tenant — admin fee"
                value={FEES.tenant.value}
                size="sm"
                divider
              />
              <div style={{ fontSize: 11, color: "var(--slate)", marginTop: -4 }}>{FEES.tenant.note}</div>
              <div style={{ marginTop: 10, fontSize: 11, color: "var(--slate)" }}>
                <Icon name="info" size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
                Other agents may quote <span className="mono">FIXED</span> fees instead — both styles are valid.
              </div>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Areas covered</Eyebrow>
              {AREAS.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--slate)" }}>No areas listed yet.</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {AREAS.map((a) => (
                    <span
                      key={a}
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        background: "var(--surface-2)",
                        borderRadius: 999,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Icon name="pin" size={11} /> {a}
                    </span>
                  ))}
                </div>
              )}
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 10 }}>Connect</Eyebrow>
              {SOCIALS.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--slate)" }}>No contact details on file.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SOCIALS.map((s) => (
                    <div
                      key={s.kind}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}
                    >
                      <span style={{ color: "var(--slate)" }}>{s.kind}</span>
                      <span className="mono" style={{ fontSize: 12 }}>{s.handle}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="ghost" size="sm" rightIcon="arrUR" style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
                Open agency page
              </Button>
            </Card>

            <Card
              padding={20}
              style={{ background: "var(--surface-2)", borderColor: "transparent" }}
            >
              <Eyebrow>Recent review</Eyebrow>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 10 }}>
                No reviews yet.
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
