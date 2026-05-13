import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Chip from "@/components/Chip";
import Input from "@/components/Input";
import EmptyState from "@/components/EmptyState";
import { useState } from "react";

interface BlogPost {
  id: string;
  tag: string;
  title: string;
  read: string;
  date: string;
}

const TAGS = ["Apply tips", "Lease basics", "Soweto", "Cape Town", "First-time", "Disputes", "Money"];
const POSTS: BlogPost[] = [];

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

        {/* Tag filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <Chip active={activeTag === "All"} onClick={() => setActiveTag("All")}>
            All
          </Chip>
          {TAGS.map((t) => (
            <Chip key={t} active={activeTag === t} onClick={() => setActiveTag(t)}>
              {t}
            </Chip>
          ))}
        </div>

        {/* Grid */}
        {POSTS.length === 0 ? (
          <EmptyState
            icon="paper"
            title="No articles yet"
            description="Posts will appear here once the editorial team starts publishing."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {POSTS.map((p) => (
              <Card
                key={p.id}
                padding={18}
                interactive
                as="article"
                style={{ overflow: "hidden" }}
              >
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
              </Card>
            ))}
          </div>
        )}

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
