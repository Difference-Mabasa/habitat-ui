import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import Tabs from "@/components/Tabs";
import EmptyState from "@/components/EmptyState";
import KpiTile from "@/components/KpiTile";
import PageHeader from "@/components/PageHeader";
import KeyValueRow from "@/components/KeyValueRow";
import TenantShell from "@/components/TenantShell";

type ViewingState =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "ALTERNATIVE_PROPOSED"
  | "ALTERNATIVE_ACCEPTED"
  | "CANCELLED"
  | "ATTENDED";

interface Viewing {
  id: string;
  ref: string;
  property: string;
  address: string;
  landlord: string;
  landlordInit: string;
  date: string;
  start: string;
  end: string;
  state: ViewingState;
  note?: string;
  altDate?: string;
  altStart?: string;
  altEnd?: string;
  altReason?: string;
}

const VIEWINGS: Viewing[] = [];

const STATE_META: Record<
  ViewingState,
  { tone: BadgeTone; label: string }
> = {
  PENDING: { tone: "warn", label: "Pending confirmation" },
  APPROVED: { tone: "success", label: "Confirmed" },
  DECLINED: { tone: "danger", label: "Declined" },
  ALTERNATIVE_PROPOSED: { tone: "accent", label: "Alternative proposed" },
  ALTERNATIVE_ACCEPTED: { tone: "success", label: "Alt time accepted" },
  CANCELLED: { tone: "neutral", label: "Cancelled" },
  ATTENDED: { tone: "neutral", label: "Attended" },
};

const FILTERS: { id: ViewingState | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Confirmed" },
  { id: "ALTERNATIVE_PROPOSED", label: "Alt proposed" },
  { id: "ATTENDED", label: "Past" },
  { id: "DECLINED", label: "Declined/cancelled" },
];

export default function MyViewings() {
  const [filter, setFilter] = useState<ViewingState | "all">("all");

  const visible = useMemo(() => {
    if (filter === "all") return VIEWINGS;
    if (filter === "DECLINED") return VIEWINGS.filter((v) => v.state === "DECLINED" || v.state === "CANCELLED");
    return VIEWINGS.filter((v) => v.state === filter);
  }, [filter]);

  const counts = {
    all: VIEWINGS.length,
    PENDING: VIEWINGS.filter((v) => v.state === "PENDING").length,
    APPROVED: VIEWINGS.filter((v) => v.state === "APPROVED").length,
    ALTERNATIVE_PROPOSED: VIEWINGS.filter((v) => v.state === "ALTERNATIVE_PROPOSED").length,
    ATTENDED: VIEWINGS.filter((v) => v.state === "ATTENDED").length,
    DECLINED: VIEWINGS.filter((v) => v.state === "DECLINED" || v.state === "CANCELLED").length,
  };

  return (
    <TenantShell activeId="viewings">
      <div style={{ padding: "32px 32px 64px" }}>
          <PageHeader
            eyebrow="My viewings"
            title="Your viewing requests"
            subtitle="Every viewing you've requested or attended, with the landlord's reply state."
            actions={
              <Link to="/browse" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="plus">Find a spot to view</Button>
              </Link>
            }
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <KpiTile label="Pending" value={`${counts.PENDING}`} valueTone="warn" subText="awaiting landlord" />
            <KpiTile label="Confirmed" value={`${counts.APPROVED}`} valueTone="success" subText="upcoming this week" />
            <KpiTile label="Alt times to review" value={`${counts.ALTERNATIVE_PROPOSED}`} valueTone="accent" subText="needs your reply" />
            <KpiTile label="Attended · YTD" value={`${counts.ATTENDED}`} subText="this year" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Tabs
              tabs={FILTERS.map((f) => ({
                id: f.id,
                label: f.label,
                count: (counts as Record<string, number>)[f.id],
              }))}
              value={filter}
              onChange={(id) => setFilter(id as ViewingState | "all")}
            />
          </div>

          {visible.length === 0 ? (
            <Card padding={32}>
              <EmptyState
                icon="calendar"
                title="Nothing in this state yet"
                description="Try a different filter, or browse new listings and book a viewing."
                actions={
                  <Link to="/browse" style={{ textDecoration: "none" }}>
                    <Button variant="accent">Browse units</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visible.map((v) => {
                const meta = STATE_META[v.state];
                const isUpcoming = v.state === "PENDING" || v.state === "APPROVED" || v.state === "ALTERNATIVE_PROPOSED";
                return (
                  <Card key={v.id} padding={0} style={{ overflow: "hidden" }}>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <Avatar name={v.landlordInit} size="md" tone="neutral" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{v.property}</div>
                            <Badge tone={meta.tone}>{meta.label}</Badge>
                          </div>
                          <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <Icon name="pin" size={11} /> {v.address}
                            </span>
                            <span>·</span>
                            <span>with {v.landlord}</span>
                            <span>·</span>
                            <span className="mono">{v.ref}</span>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 14,
                          padding: 14,
                          background: "var(--surface-2)",
                          borderRadius: 8,
                        }}
                      >
                        <KeyValueRow
                          label="Requested"
                          value={
                            <span>
                              {v.date} ·{" "}
                              <span className="tabular">
                                {v.start} – {v.end}
                              </span>
                            </span>
                          }
                          size="sm"
                          divider={false}
                        />
                        {v.altDate ? (
                          <KeyValueRow
                            label="Landlord proposed"
                            tone="accent"
                            size="sm"
                            divider
                            value={
                              <span>
                                {v.altDate} ·{" "}
                                <span className="tabular">
                                  {v.altStart} – {v.altEnd}
                                </span>
                              </span>
                            }
                          />
                        ) : null}
                        {v.note ? (
                          <KeyValueRow
                            label="Your note"
                            size="sm"
                            divider
                            value={
                              <span style={{ fontStyle: "italic", color: "var(--slate)", fontWeight: 400 }}>
                                “{v.note}”
                              </span>
                            }
                          />
                        ) : null}
                        {v.altReason && !v.altDate ? (
                          <KeyValueRow
                            label="Reason"
                            size="sm"
                            divider
                            value={<span style={{ color: "var(--slate)", fontWeight: 400 }}>{v.altReason}</span>}
                          />
                        ) : null}
                        {v.altDate && v.altReason ? (
                          <KeyValueRow
                            label="Note from landlord"
                            size="sm"
                            divider
                            value={<span style={{ color: "var(--slate)", fontWeight: 400 }}>{v.altReason}</span>}
                          />
                        ) : null}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        padding: "14px 20px",
                        borderTop: "1px solid var(--hairline)",
                        background: isUpcoming ? "var(--surface)" : "var(--surface-2)",
                      }}
                    >
                      {v.state === "PENDING" ? (
                        <>
                          <Link to="/inbox" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" leftIcon="chat">Message {v.landlord.split(" ")[0]}</Button>
                          </Link>
                          <div style={{ flex: 1 }} />
                          <Button variant="ghost" size="sm">Cancel request</Button>
                        </>
                      ) : v.state === "APPROVED" ? (
                        <>
                          <Button variant="accent" size="sm" leftIcon="download">Add to calendar</Button>
                          <Link to="/inbox" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" leftIcon="chat">Message</Button>
                          </Link>
                          <div style={{ flex: 1 }} />
                          <Button variant="ghost" size="sm">Reschedule</Button>
                          <Button variant="ghost" size="sm" style={{ color: "var(--danger)" }}>Cancel</Button>
                        </>
                      ) : v.state === "ALTERNATIVE_PROPOSED" ? (
                        <>
                          <Button variant="accent" size="sm" leftIcon="check">Accept new time</Button>
                          <Button variant="secondary" size="sm">Decline alt</Button>
                          <Link to="/inbox" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" leftIcon="chat">Counter-propose</Button>
                          </Link>
                        </>
                      ) : v.state === "ATTENDED" ? (
                        <>
                          <Link to="/apply" style={{ textDecoration: "none" }}>
                            <Button variant="accent" size="sm" rightIcon="arrR">Apply for this unit</Button>
                          </Link>
                          <Link to="/inbox" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" leftIcon="chat">Message {v.landlord.split(" ")[0]}</Button>
                          </Link>
                          <div style={{ flex: 1 }} />
                          <Button variant="ghost" size="sm" leftIcon="star">Leave a review</Button>
                        </>
                      ) : (
                        <>
                          <Link to="/browse" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm" leftIcon="search">Find similar spots</Button>
                          </Link>
                          <div style={{ flex: 1 }} />
                          <Link to="/book-viewing" style={{ textDecoration: "none" }}>
                            <Button variant="ghost" size="sm">Book another</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
      </div>
    </TenantShell>
  );
}
