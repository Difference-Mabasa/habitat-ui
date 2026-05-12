import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import Tabs from "@/components/Tabs";
import PageHeader from "@/components/PageHeader";
import KeyValueRow from "@/components/KeyValueRow";
import Toggle from "@/components/Toggle";
import Alert from "@/components/Alert";

const DAYS: { id: string; label: string; default: { open: boolean; from: string; to: string } }[] = [
  { id: "mon", label: "Mon", default: { open: true, from: "09:00", to: "17:00" } },
  { id: "tue", label: "Tue", default: { open: true, from: "09:00", to: "17:00" } },
  { id: "wed", label: "Wed", default: { open: true, from: "09:00", to: "17:00" } },
  { id: "thu", label: "Thu", default: { open: true, from: "09:00", to: "17:00" } },
  { id: "fri", label: "Fri", default: { open: true, from: "09:00", to: "17:00" } },
  { id: "sat", label: "Sat", default: { open: true, from: "10:00", to: "14:00" } },
  { id: "sun", label: "Sun", default: { open: false, from: "", to: "" } },
];

interface DayOverride {
  date: string;
  reason: string;
  windows: string;
  closed: boolean;
}

const OVERRIDES: DayOverride[] = [
  { date: "Sat 24 May", reason: "Open house · Vilakazi St", windows: "11:00 – 15:00", closed: false },
  { date: "Mon 02 Jun", reason: "Public holiday", windows: "—", closed: true },
  { date: "Wed 11 Jun", reason: "Stock-take · all properties", windows: "After 14:00", closed: false },
];

const ALT_PROPOSALS = [
  {
    tenant: "Sipho Dlamini",
    requested: "Sat 24 May · 09:00",
    proposed: "Sat 24 May · 11:30",
    reason: "Inside open-house window",
  },
  {
    tenant: "Lerato Pretorius",
    requested: "Mon 02 Jun · 16:00",
    proposed: "Tue 03 Jun · 17:00",
    reason: "Mon is a public holiday",
  },
];

export default function ViewingAvailability() {
  const [tab, setTab] = useState<"weekly" | "overrides" | "proposals">("weekly");
  const [openDays, setOpenDays] = useState<Record<string, boolean>>(
    Object.fromEntries(DAYS.map((d) => [d.id, d.default.open])),
  );
  const [bufferMin, setBufferMin] = useState(true);

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Viewings"
          title="Availability"
          subtitle="When you can host viewings. Tenants only see slots inside these windows minus existing bookings."
          actions={
            <>
              <Button variant="ghost" size="sm" leftIcon="calendar">Preview public calendar</Button>
              <Button variant="accent" leftIcon="check">Save changes</Button>
            </>
          }
        />

        <div style={{ marginBottom: 16 }}>
          <Tabs
            tabs={[
              { id: "weekly", label: "Weekly windows" },
              { id: "overrides", label: "Date overrides", count: OVERRIDES.length },
              { id: "proposals", label: "Alternative-time proposals", count: ALT_PROPOSALS.length },
            ]}
            value={tab}
            onChange={(id) => setTab(id as "weekly" | "overrides" | "proposals")}
          />
        </div>

        {tab === "weekly" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24 }}>
            <Card padding={0} style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", fontSize: 14, fontWeight: 600 }}>
                Repeating weekly schedule
              </div>
              {DAYS.map((d, i) => {
                const open = openDays[d.id];
                return (
                  <div
                    key={d.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px auto 1fr auto",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 20px",
                      borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</div>
                    <Toggle
                      checked={open}
                      onChange={(e) => setOpenDays({ ...openDays, [d.id]: e.target.checked })}
                    />
                    <div style={{ fontSize: 13, color: open ? "var(--ink)" : "var(--slate)" }}>
                      {open ? (
                        <span>
                          <span className="mono">{d.default.from}</span> – <span className="mono">{d.default.to}</span>{" "}
                          <Button variant="ghost" size="sm" leftIcon="edit" style={{ marginLeft: 6 }}>
                            Edit window
                          </Button>
                        </span>
                      ) : (
                        <span>Closed all day</span>
                      )}
                    </div>
                    {open ? <Badge tone="success">Open</Badge> : <Badge tone="neutral">Closed</Badge>}
                  </div>
                );
              })}
            </Card>

            <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card padding={20}>
                <Eyebrow style={{ marginBottom: 12 }}>Slot rules</Eyebrow>
                <KeyValueRow label="Slot length" value="45 min" />
                <KeyValueRow label="Buffer between" value={bufferMin ? "15 min" : "0 min"} />
                <KeyValueRow label="Lead time" value="2 hours" />
                <KeyValueRow label="Max bookings/day" value="6" />
                <KeyValueRow label="Group viewings" value="Allowed" tone="accent" divider={false} />
                <div style={{ marginTop: 12 }}>
                  <Toggle
                    label="15-min buffer between viewings"
                    helper="Stops back-to-back rush — most landlords keep this on."
                    checked={bufferMin}
                    onChange={(e) => setBufferMin(e.target.checked)}
                  />
                </div>
              </Card>

              <Alert tone="info" title="How tenants see this">
                Tenants pick from open slots inside these windows. Existing viewings, overrides, and the
                15-min buffer are subtracted automatically.
              </Alert>
            </aside>
          </div>
        )}

        {tab === "overrides" && (
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Date overrides</div>
              <Button variant="ghost" size="sm" leftIcon="plus">Add override</Button>
            </div>
            {OVERRIDES.map((o, i) => (
              <div
                key={o.date}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr 180px auto auto",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 20px",
                  borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                }}
              >
                <Icon name="calendar" size={16} style={{ color: "var(--slate)" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{o.date}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{o.reason}</div>
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
                  {o.windows}
                </div>
                {o.closed ? (
                  <Badge tone="neutral">Closed</Badge>
                ) : (
                  <Badge tone="accent">Custom window</Badge>
                )}
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
          </Card>
        )}

        {tab === "proposals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Alert tone="warn" title="Proposing an alternative time">
              When tenants request a slot outside your windows, propose an alternative they can accept or
              decline. Faster than DM-ing back-and-forth.
            </Alert>
            {ALT_PROPOSALS.map((p) => (
              <Card key={p.tenant} padding={20}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.tenant}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{p.reason}</div>
                  </div>
                  <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                    <div>
                      <Eyebrow>Tenant requested</Eyebrow>
                      <div style={{ fontSize: 13, marginTop: 2 }}>{p.requested}</div>
                    </div>
                    <Icon name="arrR" size={14} style={{ color: "var(--slate)" }} />
                    <div>
                      <Eyebrow style={{ color: "var(--accent)" }}>Your proposal</Eyebrow>
                      <div style={{ fontSize: 13, marginTop: 2, fontWeight: 600 }}>{p.proposed}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="accent" size="sm">Send proposal</Button>
                    <Button variant="ghost" size="sm">Decline request</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
