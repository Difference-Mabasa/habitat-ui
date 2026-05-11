import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";

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

const QUEUE: FlagRow[] = [
  { id: "HB-FLG-1421", type: "Listing", reason: "Suspicious pricing", subject: "Cottage · Sandton · R 850", source: "User report ×3", priority: "high", state: "open" },
  { id: "HB-FLG-1419", type: "Review", reason: "Slander · personal attack", subject: "Naledi Mokoena · 1★", source: "Auto-detect", priority: "med", state: "open" },
  { id: "HB-FLG-1418", type: "Listing", reason: "Duplicate of #HB-LST-08123", subject: "Backroom · Vilakazi St", source: "Auto-detect", priority: "low", state: "open" },
  { id: "HB-FLG-1416", type: "Message", reason: "Off-platform payment ask", subject: "Conversation #4421", source: "User report", priority: "high", state: "in-review" },
  { id: "HB-FLG-1411", type: "Profile", reason: "Failed FICA · 3rd attempt", subject: "User #92041", source: "System", priority: "med", state: "in-review" },
  { id: "HB-FLG-1408", type: "Listing", reason: "Photo of another listing", subject: "Bachelor · Diepkloof", source: "User report", priority: "low", state: "resolved" },
];

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
  { id: "all", label: "All", count: 42 },
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
  { label: "Open flags", value: "42", sub: "↑ 8 vs yesterday", tone: "danger" },
  { label: "In review", value: "16", sub: "by 4 moderators" },
  { label: "SLA breach", value: "3", sub: "> 4h unresponded", tone: "danger" },
  { label: "Auto-resolved (7d)", value: "184", sub: "84% accuracy", tone: "accent" },
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
            Last sync: 11 May 2026 · 14:38 SAST
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
          <Button variant="secondary" size="sm">
            Assign batch
          </Button>
          <Button variant="secondary" size="sm">
            Export CSV
          </Button>
        </div>

        {/* Queue table */}
        <Card padding={0} style={{ overflow: "hidden" }}>
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
                    <Button variant="ghost" size="sm" rightIcon="arrR">
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <span>Showing 6 of 42</span>
            <div style={{ display: "flex", gap: 6 }}>
              <Button variant="ghost" size="sm" disabled leftIcon="chevL">
                Prev
              </Button>
              <Button variant="ghost" size="sm" rightIcon="chevR">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
