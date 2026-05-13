import { Link } from "react-router-dom";
import LandlordShell from "@/components/LandlordShell";
import AgentShell from "@/components/AgentShell";
import { useWorkspace } from "@/lib/useWorkspace";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge, { type BadgeTone } from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import KeyValueRow from "@/components/KeyValueRow";
import PageHeader from "@/components/PageHeader";
import ViewingCalendarGrid, { type CalendarEvent } from "./ViewingCalendarGrid";

type ViewingRequestState =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "ALTERNATIVE_PROPOSED"
  | "ALTERNATIVE_ACCEPTED"
  | "ALTERNATIVE_DECLINED"
  | "CANCELLED";

const REQUEST_STATE_META: Record<ViewingRequestState, { tone: BadgeTone; label: string }> = {
  PENDING: { tone: "warn", label: "Pending" },
  APPROVED: { tone: "success", label: "Approved" },
  DECLINED: { tone: "danger", label: "Declined" },
  ALTERNATIVE_PROPOSED: { tone: "accent", label: "You proposed alt." },
  ALTERNATIVE_ACCEPTED: { tone: "success", label: "Alt. accepted" },
  ALTERNATIVE_DECLINED: { tone: "neutral", label: "Alt. declined" },
  CANCELLED: { tone: "neutral", label: "Cancelled" },
};

const DAYS = [
  { label: "Mon", date: "14" },
  { label: "Tue", date: "15" },
  { label: "Wed", date: "16", today: true },
  { label: "Thu", date: "17" },
  { label: "Fri", date: "18" },
  { label: "Sat", date: "19" },
  { label: "Sun", date: "20" },
];

const EVENTS: CalendarEvent[] = [];

interface PendingRequest {
  name: string;
  when: string;
  state: ViewingRequestState;
  proposedTime?: string;
}

const PENDING: PendingRequest[] = [];

export default function Viewings() {
  const ws = useWorkspace();
  const Shell = ws === "agent" ? AgentShell : LandlordShell;
  return (
    <Shell activeId="viewings">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="This week"
          title="Viewings"
          actions={
            <>
              <Button variant="ghost" size="sm">Today</Button>
              <IconButton icon="chevL" label="Previous week" size="sm" />
              <IconButton icon="chevR" label="Next week" size="sm" />
              <Link to="/viewing-availability" style={{ textDecoration: "none" }}>
                <Button variant="accent" leftIcon="plus">Add slot</Button>
              </Link>
            </>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24 }}>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <ViewingCalendarGrid days={DAYS} events={EVENTS} />
          </Card>

          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>Request states</Eyebrow>
              {PENDING.length === 0 ? (
                <EmptyState icon="calendar" size="sm" title="No viewing requests" />
              ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PENDING.map((p, i) => {
                  const meta = REQUEST_STATE_META[p.state];
                  return (
                    <div
                      key={p.name}
                      style={{
                        paddingBottom: i < PENDING.length - 1 ? 12 : 0,
                        borderBottom: i < PENDING.length - 1 ? "1px solid var(--hairline)" : undefined,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: p.proposedTime ? 4 : 8 }}>{p.when}</div>
                      {p.proposedTime ? (
                        <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 8 }}>
                          → {p.proposedTime}
                        </div>
                      ) : null}
                      {p.state === "PENDING" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <Button variant="accent" size="sm" style={{ flex: 1, justifyContent: "center" }}>
                            Approve
                          </Button>
                          <Button variant="secondary" size="sm" style={{ flex: 1, justifyContent: "center" }}>
                            Propose alt.
                          </Button>
                          <Button variant="ghost" size="sm">
                            Decline
                          </Button>
                        </div>
                      ) : null}
                      {p.state === "ALTERNATIVE_PROPOSED" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <Button variant="ghost" size="sm" rightIcon="chevR">
                            Awaiting tenant
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              )}
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>This week</Eyebrow>
              <KeyValueRow label="Booked viewings" value="0" />
              <KeyValueRow label="Open slots" value="0" />
              <KeyValueRow label="Alt. times pending" value="0" />
              <KeyValueRow label="Show rate" value="—" divider={false} />
            </Card>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
