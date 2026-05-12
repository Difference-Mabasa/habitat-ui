import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";
import FormField from "@/components/FormField";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import PageHeader from "@/components/PageHeader";

type Urgency = "Low" | "Medium" | "Urgent";

interface Ticket {
  id: string;
  title: string;
  property: string;
  urgency: Urgency;
  stage: number;
  opened: string;
  contractor: string;
  eta: string;
  done?: boolean;
}

const TICKETS: Ticket[] = [
  { id: "MNT-0421", title: "Geyser leaking into ceiling", property: "Studio · Melville", urgency: "Urgent", stage: 2, opened: "2h ago", contractor: "PlumberPro · Sipho M.", eta: "Today 16:00" },
  { id: "MNT-0419", title: "Front door latch sticking", property: "Studio · Melville", urgency: "Low", stage: 1, opened: "Yesterday", contractor: "Awaiting quote", eta: "—" },
  { id: "MNT-0398", title: "Electric stove element burnt out", property: "Studio · Melville", urgency: "Medium", stage: 3, opened: "5 days ago", contractor: "Lebo Electric", eta: "Resolved 12 Mar", done: true },
];

const STAGES = ["Reported", "Triaged", "Scheduled", "Resolved"];
const URGENCY_BADGE: Record<Urgency, "warn" | "accent" | "neutral"> = {
  Urgent: "warn",
  Medium: "accent",
  Low: "neutral",
};
const URGENCY_ICON: Record<Urgency, IconName> = {
  Urgent: "flame",
  Medium: "settings",
  Low: "settings",
};

export default function Maintenance() {
  const [urgency, setUrgency] = useState<Urgency>("Urgent");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <PageHeader
          eyebrow="Your spot"
          title="Maintenance"
          actions={
            <Button variant="accent" leftIcon="plus">
              Report a problem
            </Button>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TICKETS.map((tk) => (
              <Card key={tk.id} padding={20} style={{ opacity: tk.done ? 0.7 : 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background:
                        tk.urgency === "Urgent"
                          ? "color-mix(in oklch, var(--warn) 18%, transparent)"
                          : "var(--surface-2)",
                      color: tk.urgency === "Urgent" ? "var(--warn)" : "var(--slate)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={URGENCY_ICON[tk.urgency]} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--slate)" }}>
                        {tk.id}
                      </span>
                      <Badge tone={URGENCY_BADGE[tk.urgency]}>{tk.urgency}</Badge>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{tk.title}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                      {tk.property} · opened {tk.opened}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {STAGES.map((s, si) => {
                        const done = tk.stage > si;
                        const active = tk.stage === si;
                        return (
                          <div
                            key={s}
                            style={{ display: "flex", alignItems: "center", gap: 6, flex: si < STAGES.length - 1 ? 1 : "0 0 auto" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div
                                style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: "50%",
                                  background: done
                                    ? "var(--success)"
                                    : active
                                      ? "var(--accent)"
                                      : "var(--surface-3)",
                                  border: active
                                    ? "3px solid color-mix(in oklch, var(--accent) 25%, transparent)"
                                    : "none",
                                  flexShrink: 0,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 11,
                                  color: active ? "var(--ink)" : "var(--slate)",
                                  fontWeight: active ? 600 : 400,
                                }}
                              >
                                {s}
                              </span>
                            </div>
                            {si < STAGES.length - 1 ? (
                              <div
                                style={{
                                  flex: 1,
                                  height: 1,
                                  background: done ? "var(--success)" : "var(--hairline)",
                                }}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12 }}>
                      <span>
                        <span style={{ color: "var(--slate)" }}>Contractor:</span> {tk.contractor}
                      </span>
                      {tk.eta !== "—" ? (
                        <span>
                          <span style={{ color: "var(--slate)" }}>ETA:</span> {tk.eta}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" rightIcon="chevR">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Quick report</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <FormField label="What's wrong?">
                <Select
                  defaultValue="Plumbing"
                  options={[
                    { value: "Plumbing", label: "Plumbing" },
                    { value: "Electrical", label: "Electrical" },
                    { value: "Appliance", label: "Appliance" },
                    { value: "Locks & doors", label: "Locks & doors" },
                    { value: "Pest control", label: "Pest control" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </FormField>
              <FormField label="Describe it">
                <Textarea
                  rows={3}
                  style={{ resize: "none" }}
                  placeholder="Where in the unit, when it started, anything we should know…"
                />
              </FormField>
              <FormField label="Photos">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  <Photo ratio="1" label="" style={{ borderRadius: 6 }} />
                  <Photo ratio="1" label="" style={{ borderRadius: 6 }} />
                  <button
                    type="button"
                    style={{
                      aspectRatio: "1",
                      border: "1.5px dashed var(--hairline-strong)",
                      borderRadius: 6,
                      display: "grid",
                      placeItems: "center",
                      color: "var(--slate)",
                      background: "var(--surface-2)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon name="upload" size={16} />
                  </button>
                </div>
              </FormField>
              <FormField label="Urgency">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {(["Low", "Medium", "Urgent"] as const).map((u) => {
                    const selected = urgency === u;
                    const isUrgent = u === "Urgent";
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUrgency(u)}
                        className="btn btn--secondary btn--sm"
                        style={{
                          justifyContent: "center",
                          borderColor: selected
                            ? isUrgent
                              ? "var(--warn)"
                              : "var(--ink)"
                            : "var(--hairline-strong)",
                          color: selected && isUrgent ? "var(--warn)" : "var(--ink)",
                          background: selected
                            ? isUrgent
                              ? "color-mix(in oklch, var(--warn) 6%, var(--surface))"
                              : "var(--surface-2)"
                            : "var(--surface)",
                        }}
                      >
                        {u}
                      </button>
                    );
                  })}
                </div>
              </FormField>
              <Link to="/tenant-portal" style={{ textDecoration: "none" }}>
                <Button variant="accent" rightIcon="arrR" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                  Submit ticket
                </Button>
              </Link>
              <div style={{ fontSize: 11, color: "var(--slate)", textAlign: "center", marginTop: 4 }}>
                Your landlord is notified instantly. Most urgent tickets are triaged within 2 hours.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
