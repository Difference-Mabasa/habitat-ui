import Nav from "@/components/Nav";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import KeyValueRow from "@/components/KeyValueRow";
import PageHeader from "@/components/PageHeader";
import ViewingCalendarGrid, { type CalendarEvent } from "./ViewingCalendarGrid";

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

const PENDING = [
  { name: "Mxolisi N.", when: "Wed 16 · 11:00 · Flatlet Brixton" },
  { name: "Bongi T.", when: "Sat 19 · 13:00 · Open house" },
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
              <Eyebrow style={{ marginBottom: 12 }}>Pending confirmation</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PENDING.map((p, i) => (
                  <div
                    key={p.name}
                    style={{
                      paddingBottom: i < PENDING.length - 1 ? 12 : 0,
                      borderBottom: i < PENDING.length - 1 ? "1px solid var(--hairline)" : undefined,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--slate)", marginBottom: 8 }}>{p.when}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button variant="accent" size="sm" style={{ flex: 1, justifyContent: "center" }}>
                        Confirm
                      </Button>
                      <Button variant="ghost" size="sm" style={{ flex: 1, justifyContent: "center" }}>
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding={20}>
              <Eyebrow style={{ marginBottom: 12 }}>This week</Eyebrow>
              <KeyValueRow label="Booked viewings" value="9" />
              <KeyValueRow label="Open slots" value="14" />
              <KeyValueRow label="Show rate" value="89%" tone="success" />
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
