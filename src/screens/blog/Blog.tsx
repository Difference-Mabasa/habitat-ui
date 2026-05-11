import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import Chip from "@/components/Chip";
import Input from "@/components/Input";
import { useState } from "react";

const TAGS = ["Apply tips", "Lease basics", "Soweto", "Cape Town", "First-time", "Disputes", "Money"];
const POSTS = [
  { id: "p1", tag: "Apply tips", title: "How to get approved for your first backroom", read: "6 min", date: "8 May 2026" },
  { id: "p2", tag: "Lease basics", title: "Lease terms in plain English: what you're actually signing", read: "9 min", date: "5 May 2026" },
  { id: "p3", tag: "Money", title: "Deposit return — the 14-day rule and how to enforce it", read: "5 min", date: "1 May 2026" },
  { id: "p4", tag: "Soweto", title: "The 5 best neighbourhoods in Soweto under R 4,000", read: "8 min", date: "28 Apr 2026" },
  { id: "p5", tag: "First-time", title: "Moving in week one: a checklist", read: "4 min", date: "22 Apr 2026" },
  { id: "p6", tag: "Disputes", title: "What to do if your landlord won't fix the geyser", read: "7 min", date: "18 Apr 2026" },
];

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
        <Eyebrow>Habitat guide</Eyebrow>
        <h1 className="display" style={{ fontSize: 80, margin: "8px 0 24px" }}>
          RENT, SMARTER.
        </h1>

        {/* Featured */}
        <Card
          padding={0}
          style={{ overflow: "hidden", display: "grid", gridTemplateColumns: "1.2fr 1fr", marginBottom: 32 }}
        >
          <Photo
            label="Featured · Lease 101"
            ratio="auto"
            style={{ minHeight: 360, borderRadius: 0 }}
          />
          <div
            style={{
              padding: 36,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Badge tone="accent">Featured</Badge>
            <h2 className="display" style={{ fontSize: 40, margin: "10px 0 14px", lineHeight: 1 }}>
              EVERYTHING TO KNOW BEFORE YOU SIGN A LEASE IN SA.
            </h2>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6 }}>
              From CPA basics to your right to withhold rent — a 25-minute deep read by attorney Thabang
              Modise.
            </p>
            <div
              style={{
                marginTop: 18,
                fontSize: 12,
                color: "var(--slate)",
                display: "flex",
                gap: 12,
              }}
            >
              <span>25 min read</span>
              <span>·</span>
              <span>11 May 2026</span>
              <span>·</span>
              <span>1.2k views</span>
            </div>
            <Button variant="accent" rightIcon="arrR" style={{ marginTop: 22, alignSelf: "flex-start" }}>
              Read article
            </Button>
          </div>
        </Card>

        {/* Tag filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <Chip active={activeTag === "All"} onClick={() => setActiveTag("All")}>
            All · 42
          </Chip>
          {TAGS.map((t) => (
            <Chip key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>
              {t}
            </Chip>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {POSTS.map((p) => (
            <Card
              key={p.id}
              padding={0}
              interactive
              as="article"
              style={{ overflow: "hidden" }}
            >
              <Photo label={p.tag} ratio="16/10" style={{ borderRadius: 0 }} />
              <div style={{ padding: 18 }}>
                <Eyebrow style={{ color: "var(--accent)" }}>{p.tag}</Eyebrow>
                <h3
                  style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.35, margin: "8px 0 14px" }}
                >
                  {p.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "var(--slate)",
                  }}
                >
                  <span>{p.read} read</span>
                  <span>{p.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <Card
          padding={36}
          style={{
            marginTop: 48,
            background: "var(--ink)",
            color: "var(--paper)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div>
            <Eyebrow style={{ color: "var(--accent)" }}>Weekly digest</Eyebrow>
            <div
              className="display"
              style={{ fontSize: 32, color: "var(--paper)", marginTop: 6 }}
            >
              NEW SPOTS · NEW READS.
            </div>
            <div style={{ fontSize: 14, color: "rgba(247,239,226,0.7)", marginTop: 6 }}>
              1 email every Tuesday. Unsubscribe anytime.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Input
              placeholder="you@example.com"
              style={{
                height: 48,
                width: 280,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "var(--paper)",
              }}
            />
            <Button variant="accent">Subscribe</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
