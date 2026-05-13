import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import Stepper from "@/components/Stepper";
import FormField from "@/components/FormField";
import Textarea from "@/components/Textarea";
import Photo from "@/components/Photo";
import KeyValueRow from "@/components/KeyValueRow";
import Alert from "@/components/Alert";
import InlineLink from "@/components/InlineLink";

interface DayCell {
  iso: string; // YYYY-MM-DD
  label: number;
  inMonth: boolean;
  past: boolean;
  /** True if landlord has any open slot that day. */
  available: boolean;
  /** True if entire day already booked. */
  full: boolean;
}

interface TimeSlot {
  time: string;
  booked: boolean;
}

const STEPS = [
  { label: "Pick a date" },
  { label: "Pick a time" },
  { label: "Confirm" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Landlord availability keyed by YYYY-MM-DD. Empty until wired to the API. */
const AVAILABILITY: Record<string, TimeSlot[]> = {};

function buildMonth(year: number, month: number, todayIso: string): DayCell[] {
  // Monday-first 6-row grid.
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // 0 = Mon
  const start = new Date(year, month, 1 - offset);
  const out: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const inMonth = d.getMonth() === month;
    const past = iso < todayIso;
    const daySlots = AVAILABILITY[iso] ?? [];
    const openSlots = daySlots.filter((s) => !s.booked).length;
    out.push({
      iso,
      label: d.getDate(),
      inMonth,
      past,
      available: !past && openSlots > 0,
      full: !past && daySlots.length > 0 && openSlots === 0,
    });
  }
  return out;
}

function formatLongDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookViewing() {
  const navigate = useNavigate();
  const todayIso = "2026-05-12";
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // May (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const days = useMemo(() => buildMonth(year, month, todayIso), [year, month]);
  const slotsForDay = selectedDate ? AVAILABILITY[selectedDate] ?? [] : [];

  const step = selectedSlot ? 2 : selectedDate ? 1 : 0;
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });
  const availableDayCount = Object.keys(AVAILABILITY).filter((d) => {
    const ds = AVAILABILITY[d].filter((s) => !s.booked).length;
    return d >= todayIso && ds > 0 && d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`);
  }).length;

  const changeMonth = (delta: number) => {
    setSelectedDate(null);
    setSelectedSlot(null);
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    navigate("/viewing-confirmed", {
      state: {
        date: selectedDate,
        slot: selectedSlot,
        note,
      },
    });
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "32px 32px 64px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: 32,
        }}
      >
        <main>
          <InlineLink to="/property" icon="chevL" iconPosition="left" size="sm" tone="slate">
            Back to property
          </InlineLink>

          <div style={{ marginTop: 16, marginBottom: 24 }}>
            <Eyebrow>Property viewing</Eyebrow>
            <h1 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>
              Book a viewing
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", margin: 0, maxWidth: 560, lineHeight: 1.55 }}>
              Pick an open date and a 30-minute slot. The landlord confirms within a few hours — you'll get
              a push and a calendar invite.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Stepper orientation="horizontal" steps={STEPS} currentStep={step} />
          </div>

          {availableDayCount === 0 ? (
            <Card padding={32} style={{ textAlign: "center" }}>
              <Icon name="calendar" size={32} style={{ color: "var(--slate)", marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                No open dates this month
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", margin: "0 0 16px" }}>
                Try the next month, or message the landlord to ask for a custom time.
              </p>
              <Button variant="accent" onClick={() => changeMonth(1)}>
                Try {new Date(year, month + 1, 1).toLocaleDateString("en-ZA", { month: "long" })}
              </Button>
            </Card>
          ) : (
            <>
              {/* Calendar — always visible */}
              <Card padding={20} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <IconButton
                    icon="chevL"
                    label="Previous month"
                    size="sm"
                    onClick={() => changeMonth(-1)}
                  />
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
                    {monthLabel}
                  </div>
                  <IconButton icon="chevR" label="Next month" size="sm" onClick={() => changeMonth(1)} />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  {WEEKDAYS.map((w) => (
                    <div
                      key={w}
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--slate)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        textAlign: "center",
                        padding: "4px 0",
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {days.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    const enabled = d.inMonth && (d.available || d.full);
                    const tone = isSelected
                      ? { bg: "var(--ink)", color: "var(--paper)", border: "var(--ink)" }
                      : d.full
                        ? {
                            bg: "var(--surface-2)",
                            color: "var(--slate)",
                            border: "var(--hairline)",
                          }
                        : d.available
                          ? {
                              bg: "var(--success-soft)",
                              color: "var(--ink)",
                              border: "var(--success)",
                            }
                          : { bg: "transparent", color: d.inMonth ? "var(--slate)" : "var(--slate-2)", border: "transparent" };
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        disabled={!enabled || !d.available}
                        onClick={() => {
                          if (!d.available) return;
                          setSelectedDate(d.iso);
                          setSelectedSlot(null);
                        }}
                        style={{
                          aspectRatio: "1 / 1",
                          background: tone.bg,
                          color: tone.color,
                          border: `1px solid ${tone.border}`,
                          borderRadius: 8,
                          cursor: enabled && d.available ? "pointer" : "default",
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 500,
                          fontFamily: "var(--font-mono)",
                          opacity: d.past || (!d.inMonth && !d.available) ? 0.35 : 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          padding: 0,
                          transition: "background 120ms, transform 120ms",
                        }}
                      >
                        <span>{d.label}</span>
                        {d.available ? (
                          <span
                            aria-hidden="true"
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: isSelected ? "var(--paper)" : "var(--success)",
                            }}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid var(--hairline)",
                    fontSize: 11,
                    color: "var(--slate)",
                  }}
                >
                  <LegendDot color="var(--success-soft)" border="var(--success)" />
                  Open slots
                  <LegendDot color="var(--surface-2)" border="var(--hairline)" />
                  Fully booked
                  <LegendDot color="var(--ink)" border="var(--ink)" />
                  Selected
                </div>
              </Card>

              {/* Time slots — only when a date is picked */}
              {selectedDate ? (
                <Card padding={20}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <Eyebrow>Pick a 30-min slot</Eyebrow>
                      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
                        {formatLongDate(selectedDate)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon="arrL" onClick={() => setSelectedDate(null)}>
                      Change date
                    </Button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {slotsForDay.map((s) => {
                      const isSel = selectedSlot === s.time;
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={s.booked}
                          onClick={() => setSelectedSlot(s.time)}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: `1px solid ${isSel ? "var(--ink)" : s.booked ? "var(--hairline)" : "var(--hairline-strong)"}`,
                            background: isSel ? "var(--ink)" : s.booked ? "var(--surface-2)" : "var(--surface)",
                            color: isSel ? "var(--paper)" : s.booked ? "var(--slate-2)" : "var(--ink)",
                            fontWeight: isSel ? 600 : 500,
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            cursor: s.booked ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 6,
                            textDecoration: s.booked ? "line-through" : "none",
                          }}
                        >
                          <span>{s.time}</span>
                          {s.booked ? (
                            <span style={{ fontSize: 9, color: "var(--slate)" }}>Booked</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSlot ? (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--hairline)" }}>
                      <FormField
                        label="Note (optional)"
                        helper="e.g. I'll arrive with my partner · bringing my dog · need parking · 240 chars."
                      >
                        <Textarea
                          rows={3}
                          value={note}
                          onChange={(e) => setNote(e.target.value.slice(0, 240))}
                          placeholder="Anything the landlord should know before the viewing?"
                        />
                      </FormField>
                      <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button variant="ghost" onClick={() => setSelectedSlot(null)}>
                          Pick a different slot
                        </Button>
                        <Button variant="accent" leftIcon="check" onClick={handleConfirm}>
                          Confirm viewing
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Alert tone="info" title="How confirmations work" >
                      Your viewing isn't booked until the landlord taps Confirm — usually within an hour. We
                      send you a push and an iCal invite the moment they do.
                    </Alert>
                  )}
                </Card>
              ) : (
                <Card padding={20} style={{ background: "var(--surface-2)", borderColor: "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon name="calendar" size={18} style={{ color: "var(--slate)" }} />
                    <div style={{ fontSize: 13, color: "var(--slate)" }}>
                      Tap a green date to see the times the landlord has open that day.
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </main>

        {/* Sticky property recap */}
        <aside style={{ position: "sticky", top: 88, alignSelf: "start" }}>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <Photo ratio="16/10" label="property" style={{ borderRadius: 0 }} />
            <div style={{ padding: 16 }}>
              <Eyebrow style={{ marginBottom: 6 }}>Viewing</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                —
              </div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 16 }}>
                —
              </div>
              <KeyValueRow
                label="With"
                value="—"
                size="sm"
                divider
              />
              <KeyValueRow
                label="Date"
                value={selectedDate ? formatLongDate(selectedDate) : "Not picked"}
                size="sm"
                divider
                tone={selectedDate ? "accent" : "neutral"}
              />
              <KeyValueRow
                label="Time"
                value={selectedSlot ?? "—"}
                size="sm"
                divider
                tone={selectedSlot ? "accent" : "neutral"}
              />
              <KeyValueRow label="Duration" value="30 min" size="sm" divider={false} />
            </div>
          </Card>

          <Card padding={16} style={{ marginTop: 16, background: "var(--surface-2)" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Icon name="shield" size={16} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>
                Viewings are free. We never share your phone number — the landlord messages you through Habitat.
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function LegendDot({ color, border }: { color: string; border: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: 3,
        background: color,
        border: `1px solid ${border}`,
        marginRight: 4,
        verticalAlign: -2,
      }}
    />
  );
}
