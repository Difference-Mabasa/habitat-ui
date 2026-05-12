import { Link, useLocation } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Eyebrow from "@/components/Eyebrow";
import Badge from "@/components/Badge";
import Avatar from "@/components/Avatar";
import KeyValueRow from "@/components/KeyValueRow";
import Alert from "@/components/Alert";

interface ConfirmationState {
  /** ISO date string (YYYY-MM-DD). */
  date?: string;
  /** Start time HH:mm. */
  slot?: string;
  /** Free-text note the tenant wrote. */
  note?: string;
  property?: string;
  address?: string;
  landlord?: string;
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

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + (m || 0) + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export default function ViewingConfirmed() {
  const location = useLocation();
  const state = (location.state ?? {}) as ConfirmationState;

  const date = state.date ?? "2026-05-24";
  const slot = state.slot ?? "14:00";
  const endSlot = addMinutes(slot, 30);
  const note = state.note?.trim();
  const property = state.property ?? "Studio Flatlet · Melville";
  const address = state.address ?? "12 Caroline St, Brixton, JHB";
  const landlord = state.landlord ?? "Naledi Mokoena";
  const ref = "HB-V-04532";

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Card padding={0} style={{ overflow: "hidden" }}>
          {/* Hero confirmation */}
          <div
            style={{
              padding: "48px 48px 32px",
              borderBottom: "1px solid var(--hairline)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "color-mix(in oklch, var(--success) 12%, transparent)",
                border: "1.5px solid var(--success)",
                color: "var(--success)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <Icon name="calendar" size={26} />
            </div>
            <Eyebrow style={{ color: "var(--success)" }}>Viewing requested</Eyebrow>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                margin: "8px 0 6px",
              }}
            >
              {landlord.split(" ")[0]} will confirm shortly
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 auto", maxWidth: 480, lineHeight: 1.55 }}>
              We've sent your request. Most landlords reply within an hour. You'll get a push and an iCal
              invite the moment {landlord.split(" ")[0]} confirms — no need to refresh.
            </p>
          </div>

          {/* Booking details */}
          <div style={{ padding: "24px 48px" }}>
            <Eyebrow style={{ marginBottom: 16 }}>Your request</Eyebrow>
            <KeyValueRow label="Property" value={property} divider />
            <KeyValueRow label="Address" value={address} divider />
            <KeyValueRow
              label="With"
              value={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={landlord} size="sm" tone="neutral" />
                  {landlord}
                  <Badge tone="success" leftIcon="check">Verified</Badge>
                </span>
              }
              divider
            />
            <KeyValueRow label="Date" value={formatLongDate(date)} divider tone="accent" />
            <KeyValueRow
              label="Time"
              value={
                <span className="tabular">
                  {slot} – {endSlot}
                </span>
              }
              divider
              tone="accent"
            />
            <KeyValueRow label="Duration" value="30 minutes" divider />
            <KeyValueRow
              label="Reference"
              value={<span className="mono">{ref}</span>}
              divider={Boolean(note)}
            />
            {note ? (
              <div style={{ paddingTop: 12 }}>
                <Eyebrow style={{ marginBottom: 6 }}>Your note</Eyebrow>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--slate)",
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  “{note}”
                </p>
              </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
              <Button
                variant="accent"
                size="lg"
                leftIcon="download"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Add to calendar (.ics)
              </Button>
              <Link to="/property" style={{ textDecoration: "none" }}>
                <Button
                  variant="secondary"
                  leftIcon="home"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Back to the property
                </Button>
              </Link>
              <Link to="/browse" style={{ textDecoration: "none" }}>
                <Button
                  variant="ghost"
                  leftIcon="search"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Browse more spots
                </Button>
              </Link>
            </div>
          </div>

          {/* What happens next */}
          <div
            style={{
              padding: "20px 48px",
              background: "var(--surface-2)",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <Eyebrow style={{ marginBottom: 12 }}>What happens next</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <NextStep state="done" icon="check" title="Request sent" body="Just now · ref HB-V-04532" />
              <NextStep
                state="active"
                icon="clock"
                title={`${landlord.split(" ")[0]} reviews`}
                body="Usually within an hour. We'll nudge if she hasn't replied in 6h."
              />
              <NextStep
                state="todo"
                icon="bell"
                title="Push + iCal invite"
                body="The moment she confirms — you don't need to refresh."
              />
              <NextStep
                state="todo"
                icon="home"
                title="Show up"
                body={`${formatLongDate(date)} · ${slot} · address pinned in the invite.`}
              />
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 16 }}>
          <Alert tone="info" title="Need to change it?">
            You can cancel or reschedule for free until 2 hours before the viewing.{" "}
            <Link to="/inbox" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Message {landlord.split(" ")[0]}
            </Link>{" "}
            if you need to negotiate a different time.
          </Alert>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
            fontSize: 11,
            color: "var(--slate)",
          }}
        >
          <Icon name="shield" size={12} style={{ color: "var(--success)" }} />
          <span>Free, no card needed · we never share your phone number until you both agree.</span>
        </div>
      </div>
    </div>
  );
}

function NextStep({
  state,
  icon,
  title,
  body,
}: {
  state: "done" | "active" | "todo";
  icon: "check" | "clock" | "bell" | "home";
  title: string;
  body: string;
}) {
  const tone =
    state === "done"
      ? { bg: "var(--success)", color: "var(--paper)" }
      : state === "active"
        ? { bg: "var(--accent)", color: "var(--paper)" }
        : { bg: "var(--surface)", color: "var(--slate)" };
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: tone.bg,
          color: tone.color,
          border: state === "todo" ? "1px solid var(--hairline-strong)" : "none",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={13} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: state === "active" ? 600 : 500, color: state === "todo" ? "var(--slate)" : "var(--ink)" }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
}
