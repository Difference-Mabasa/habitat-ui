import Nav from "@/components/Nav";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge, { type BadgeTone } from "@/components/Badge";
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

const EVENTS: CalendarEvent[] = [
  { id: "e1", day: 0, start: 10, duration: 1, title: "Studio · Melville", who: "Sipho Dlamini", confirmed: true },
  { id: "e2", day: 1, start: 14, duration: 1, title: "Cottage · Caroline", who: "Lerato P.", confirmed: true },
  { id: "e3", day: 2, start: 11, duration: 1.5, title: "Flatlet · Brixton", who: "Mxolisi N.", confirmed: false },
  { id: "e4", day: 4, start: 9, duration: 1, title: "Studio · Melville", who: "Aisha M.", confirmed: true },
  { id: "e5", day: 5, start: 13, duration: 2, title: "Open house · Caroline", who: "5 booked", confirmed: true, group: true },
];

interface PendingRequest {
  name: string;
  when: string;
  state: ViewingRequestState;
  proposedTime?: string;
}

const PENDING: PendingRequest[] = [
  { name: "Mxolisi N.", when: "Wed 16 · 11:00 · Flatlet Brixton", state: "PENDING" },
  { name: "Bongi T.", when: "Sat 19 · 13:00 · Open house", state: "APPROVED" },
  { name: "Sipho D.", when: "Sat 24 · 09:00 · Studio Melville", state: "ALTERNATIVE_PROPOSED", proposedTime: "Sat 24 · 11:30 (open-house window)" },
  { name: "Lerato P.", when: "Mon 02 Jun · 16:00 · Garden Cottage", state: "ALTERNATIVE_ACCEPTED", proposedTime: "Tue 03 Jun · 17:00" },
  { name: "Aisha M.", when: "Fri 18 · 15:00 · Backroom Vilakazi", state: "ALTERNATIVE_DECLINED" },
  { name: "Pieter K.", when: "Thu 17 · 10:00 · Loft Maboneng", state: "DECLINED" },
  { name: "Naledi K.", when: "Wed 16 · 14:00 · Studio Brixton", state: "CANCELLED" },
];

export default function Viewings() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="This week"
          title="Viewings"
          actions={
            <>
              <Button variant="ghost" size="sm">Today</Button>
              <IconButton icon="chevL" label="Previous week" size="sm" />
              <IconButton icon="chevR" label="Next week" size="sm" />
              <Button variant="accent" leftIcon="plus">Add slot</Button>
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
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>This week</Eyebrow>
              <KeyValueRow label="Booked viewings" value="9" />
              <KeyValueRow label="Open slots" value="14" />
              <KeyValueRow label="Alt. times pending" value="1" tone="accent" />
              <KeyValueRow label="Show rate" value="89%" tone="success" divider={false} />
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
