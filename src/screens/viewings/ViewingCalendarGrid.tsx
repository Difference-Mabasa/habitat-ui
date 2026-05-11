export interface CalendarEvent {
  id: string;
  /** 0 = first day in `days`. */
  day: number;
  /** Hour from 8:00 (8). */
  start: number;
  /** Duration in hours (can be fractional). */
  duration: number;
  title: string;
  who: string;
  confirmed: boolean;
  group?: boolean;
}

export interface ViewingCalendarGridProps {
  days: { label: string; date: string; today?: boolean }[];
  events: CalendarEvent[];
  /** Hour to start displaying at (24h). Default 8. */
  startHour?: number;
  /** Number of hourly rows. Default 11 (8am–6pm). */
  hours?: number;
  /** Pixel height per hour row. Default 48. */
  rowHeight?: number;
}

export default function ViewingCalendarGrid({
  days,
  events,
  startHour = 8,
  hours = 11,
  rowHeight = 48,
}: ViewingCalendarGridProps) {
  return (
    <div style={{ overflow: "hidden" }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `60px repeat(${days.length}, 1fr)`,
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div />
        {days.map((d) => (
          <div
            key={d.label}
            style={{
              padding: "12px 8px",
              textAlign: "center",
              borderLeft: "1px solid var(--hairline)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--slate)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {d.label}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                marginTop: 2,
                color: d.today ? "var(--accent)" : "var(--ink)",
              }}
            >
              {d.date}
            </div>
          </div>
        ))}
      </div>

      {/* Hourly grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `60px repeat(${days.length}, 1fr)`,
          position: "relative",
        }}
      >
        <div>
          {Array.from({ length: hours }).map((_, h) => (
            <div
              key={h}
              className="mono"
              style={{
                height: rowHeight,
                padding: "4px 8px",
                fontSize: 10,
                color: "var(--slate)",
                textAlign: "right",
                borderTop: "1px solid var(--hairline)",
              }}
            >
              {startHour + h}:00
            </div>
          ))}
        </div>
        {days.map((_, dayIndex) => (
          <div key={dayIndex} style={{ borderLeft: "1px solid var(--hairline)", position: "relative" }}>
            {Array.from({ length: hours }).map((_, h) => (
              <div
                key={h}
                style={{ height: rowHeight, borderTop: "1px solid var(--hairline)" }}
              />
            ))}
            {events
              .filter((e) => e.day === dayIndex)
              .map((e) => (
                <EventBlock
                  key={e.id}
                  event={e}
                  startHour={startHour}
                  rowHeight={rowHeight}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventBlock({
  event,
  startHour,
  rowHeight,
}: {
  event: CalendarEvent;
  startHour: number;
  rowHeight: number;
}) {
  const top = (event.start - startHour) * rowHeight + 2;
  const height = event.duration * rowHeight - 4;
  const bg = event.group
    ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
    : event.confirmed
      ? "color-mix(in oklch, var(--accent) 8%, var(--surface))"
      : "var(--surface-2)";
  return (
    <button
      type="button"
      style={{
        position: "absolute",
        top,
        height,
        left: 4,
        right: 4,
        background: bg,
        border: `1px solid ${event.confirmed ? "var(--accent)" : "var(--hairline-strong)"}`,
        borderLeft: `3px solid ${event.confirmed ? "var(--accent)" : "var(--warn)"}`,
        borderRadius: 4,
        padding: "6px 8px",
        fontSize: 11,
        overflow: "hidden",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--ink)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{event.title}</div>
      <div style={{ color: "var(--slate)" }}>{event.who}</div>
    </button>
  );
}
