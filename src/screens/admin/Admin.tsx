import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import Tabs from "@/components/Tabs";
import { toast } from "@/lib/toast";

type FlagPriority = "high" | "med" | "low";
type FlagState = "open" | "in-review" | "resolved";

interface FlagRow {
  id: string;
  type: string;
  reason: string;
  subject: string;
  source: string;
  priority: FlagPriority;
  state: FlagState;
}

const QUEUE: FlagRow[] = [];

const PRIORITY_TONE: Record<FlagPriority, BadgeTone> = {
  high: "danger",
  med: "warn",
  low: "neutral",
};

const STATE_TONE: Record<FlagState, BadgeTone> = {
  open: "warn",
  "in-review": "accent",
  resolved: "success",
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "listings", label: "Listings" },
  { id: "reviews", label: "Reviews" },
  { id: "messages", label: "Messages" },
  { id: "profiles", label: "Profiles" },
];

interface StatDef {
  label: string;
  value: string;
  sub: string;
  tone?: "ink" | "danger" | "accent";
}

const STATS: StatDef[] = [
  { label: "Open flags", value: "0", sub: "—" },
  { label: "In review", value: "0", sub: "—" },
  { label: "SLA breach", value: "0", sub: "—" },
  { label: "Auto-resolved (7d)", value: "0", sub: "—" },
];

const STAT_COLOR = {
  ink: "var(--ink)",
  danger: "var(--danger)",
  accent: "var(--accent)",
} as const;

export default function Admin() {
  const [filter, setFilter] = useState("all");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge tone="danger">Internal · staff only</Badge>
              <Eyebrow>Trust & safety</Eyebrow>
            </div>
            <h1 className="display" style={{ fontSize: 56, margin: "8px 0 0" }}>
              MODERATION QUEUE
            </h1>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
            Last sync: —
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {STATS.map((s) => (
            <Card key={s.label} padding={18}>
              <Eyebrow>{s.label}</Eyebrow>
              <div
                className="display tabular"
                style={{ fontSize: 36, marginTop: 4, color: STAT_COLOR[s.tone ?? "ink"] }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Tabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
          <div style={{ flex: 1 }} />
          <Button variant="secondary" size="sm" onClick={() => toast.info("Batch assigned to next available moderator.")}>
            Assign batch
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast.success("Exporting CSV…")}>
            Export CSV
          </Button>
        </div>

        {/* Queue table */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          {QUEUE.length === 0 ? (
            <EmptyState
              icon="shield"
              title="Moderation queue is empty"
              description="Flagged listings, reviews, messages, and profiles will appear here."
            />
          ) : null}
          {QUEUE.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Flag", "Type", "Subject", "Reason", "Source", "Priority", "State", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "var(--slate)",
                      background: "var(--surface-2)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: 13 }}>
              {QUEUE.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--hairline)" }}>
                  <td className="mono" style={{ padding: "14px 16px" }}>
                    {r.id}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge tone="neutral">{r.type}</Badge>
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 500 }}>{r.subject}</td>
                  <td style={{ padding: "14px 16px", color: "var(--slate)" }}>{r.reason}</td>
                  <td style={{ padding: "14px 16px", color: "var(--slate)" }}>{r.source}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge tone={PRIORITY_TONE[r.priority]}>{r.priority.toUpperCase()}</Badge>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Badge tone={STATE_TONE[r.state]}>{r.state.replace("-", " ").toUpperCase()}</Badge>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon="check"
                        onClick={() => toast.success(`${r.id} approved · subject cleared.`)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon="x"
                        onClick={() => toast.warn(`${r.id} rejected · removed from listing.`)}
                        style={{ color: "var(--danger)" }}
                      >
                        Reject
                      </Button>
                      <Button variant="ghost" size="sm" rightIcon="arrR" onClick={() => toast.info(`${r.id} opened for review.`)}>
                        Open
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : null}
          {QUEUE.length > 0 ? (
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--hairline)",
                color: "var(--slate)",
                fontSize: 12,
              }}
            >
              <span>Showing {QUEUE.length} of {QUEUE.length}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <Button variant="ghost" size="sm" disabled leftIcon="chevL">
                  Prev
                </Button>
                <Button variant="ghost" size="sm" rightIcon="chevR">
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
