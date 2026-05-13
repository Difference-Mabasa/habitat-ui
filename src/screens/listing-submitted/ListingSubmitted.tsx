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

type Mode = "self" | "behalf";

interface SubmittedState {
  mode?: Mode;
  propertyName?: string;
  address?: string;
  unitCount?: number;
  fromRent?: number;
  mandateType?: string;
  agencyFee?: string;
  ownerName?: string;
  ownerEmail?: string;
  landlordOnHabitat?: boolean;
}

const MANDATE_LABEL: Record<string, string> = {
  FULL_MANAGEMENT: "Full management",
  TENANT_FIND: "Tenant find",
  LETTING_AND_INSPECTIONS: "Letting & inspections",
};

export default function ListingSubmitted() {
  const location = useLocation();
  const state = (location.state ?? {}) as SubmittedState;

  const mode: Mode = state.mode ?? "self";
  const propertyName = state.propertyName ?? "Your property";
  const address = state.address ?? "—";
  const unitCount = state.unitCount ?? 0;
  const fromRent = state.fromRent ?? 0;
  const mandateType = state.mandateType ?? "FULL_MANAGEMENT";
  const agencyFee = state.agencyFee ?? "—";
  const ownerName = state.ownerName ?? "The owner";
  const ownerEmail = state.ownerEmail ?? "—";
  const landlordOnHabitat = state.landlordOnHabitat ?? true;

  const ref: string | null = null;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Card padding={0} style={{ overflow: "hidden" }}>
          {/* Hero */}
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
                background:
                  mode === "self"
                    ? "color-mix(in oklch, var(--success) 12%, transparent)"
                    : "color-mix(in oklch, var(--accent) 12%, transparent)",
                border: `1.5px solid ${mode === "self" ? "var(--success)" : "var(--accent)"}`,
                color: mode === "self" ? "var(--success)" : "var(--accent)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <Icon name={mode === "self" ? "check" : "paper"} size={26} />
            </div>
            <Eyebrow style={{ color: mode === "self" ? "var(--success)" : "var(--accent)" }}>
              {mode === "self" ? "Listing live" : "Sent for owner approval"}
            </Eyebrow>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                margin: "8px 0 6px",
              }}
            >
              {mode === "self"
                ? `${propertyName} is live`
                : `${state.ownerName ? state.ownerName.split(" ")[0] : "The owner"} just needs to approve the mandate`}
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 auto", maxWidth: 480, lineHeight: 1.55 }}>
              {mode === "self"
                ? `Tenants can now apply on /browse. Listings typically get their first application within 48 hours.`
                : landlordOnHabitat
                  ? `We sent ${ownerName} a one-tap approval request. The listing stays in DRAFT until she approves — usually within an hour.`
                  : `We emailed ${ownerName} an approval link (no Habitat account needed). She'll see a one-tap "Approve mandate" page; the listing publishes the moment she taps it.`}
            </p>
          </div>

          {/* Details */}
          <div style={{ padding: "24px 48px" }}>
            <Eyebrow style={{ marginBottom: 16 }}>What you submitted</Eyebrow>
            <KeyValueRow label="Property" value={propertyName} divider />
            <KeyValueRow label="Address" value={address} divider />
            <KeyValueRow
              label="Units"
              value={
                unitCount > 0
                  ? `${unitCount} unit${unitCount === 1 ? "" : "s"} · from R ${fromRent.toLocaleString("en-ZA")}/mo`
                  : "—"
              }
              divider
            />
            <KeyValueRow
              label="Status"
              value={
                <Badge tone={mode === "self" ? "success" : "warn"}>
                  {mode === "self" ? "LISTED" : "DRAFT · awaiting mandate"}
                </Badge>
              }
              divider
            />
            <KeyValueRow
              label="Reference"
              value={<span className="mono">{ref ?? "—"}</span>}
              divider={mode === "behalf"}
            />
            {mode === "behalf" ? (
              <>
                <KeyValueRow
                  label="Mandate"
                  value={`${MANDATE_LABEL[mandateType] ?? mandateType} · ${agencyFee}%`}
                  tone="accent"
                  divider
                />
                <KeyValueRow
                  label="Owner"
                  value={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Avatar name={ownerName} size="sm" tone="neutral" />
                      {ownerEmail}
                    </span>
                  }
                  divider={false}
                />
              </>
            ) : null}

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
              {mode === "self" ? (
                <>
                  <Link to="/property" style={{ textDecoration: "none" }}>
                    <Button variant="accent" size="lg" rightIcon="arrR" style={{ width: "100%", justifyContent: "center" }}>
                      View your listing
                    </Button>
                  </Link>
                  <Link to="/landlord-properties" style={{ textDecoration: "none" }}>
                    <Button variant="secondary" leftIcon="home" style={{ width: "100%", justifyContent: "center" }}>
                      Back to Properties
                    </Button>
                  </Link>
                  <Link to="/list-property" style={{ textDecoration: "none" }}>
                    <Button variant="ghost" leftIcon="plus" style={{ width: "100%", justifyContent: "center" }}>
                      List another property
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/my-mandates" style={{ textDecoration: "none" }}>
                    <Button variant="accent" size="lg" rightIcon="arrR" style={{ width: "100%", justifyContent: "center" }}>
                      Track mandate approval
                    </Button>
                  </Link>
                  <Link to="/inbox" style={{ textDecoration: "none" }}>
                    <Button variant="secondary" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>
                      Message {ownerName.split(" ")[0]}
                    </Button>
                  </Link>
                  <Link to="/portfolio" style={{ textDecoration: "none" }}>
                    <Button variant="ghost" leftIcon="home" style={{ width: "100%", justifyContent: "center" }}>
                      Back to Portfolio
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* What happens next timeline */}
          <div
            style={{
              padding: "20px 48px",
              background: "var(--surface-2)",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <Eyebrow style={{ marginBottom: 12 }}>What happens next</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mode === "self" ? (
                <>
                  <NextStep state="done" icon="check" title="Listing published" body="Just now" />
                  <NextStep
                    state="active"
                    icon="search"
                    title="Tenants browse and save"
                    body="Most listings get 8–12 saves in the first 24 hours."
                  />
                  <NextStep
                    state="todo"
                    icon="user"
                    title="First applications"
                    body="Typically within 48 hours. We pre-screen FICA + affordability before they reach you."
                  />
                  <NextStep
                    state="todo"
                    icon="key"
                    title="You pick & sign a tenant"
                    body="Approve, send lease, get rent. Median time-to-tenant: 9 days."
                  />
                </>
              ) : (
                <>
                  <NextStep state="done" icon="check" title="Mandate sent" body="Just now" />
                  <NextStep
                    state="active"
                    icon="clock"
                    title={`${ownerName.split(" ")[0]} reviews`}
                    body={
                      landlordOnHabitat
                        ? "She sees a request in /mandate-approvals. Usually decided within an hour."
                        : "She gets an email with a one-tap link. We nudge daily for 3 days if no response."
                    }
                  />
                  <NextStep
                    state="todo"
                    icon="bell"
                    title="Approval notification"
                    body="The moment she approves, the listing publishes — you'll get a push + email."
                  />
                  <NextStep
                    state="todo"
                    icon="user"
                    title="First applications start"
                    body="Typically within 48 hours of publish. We pre-screen FICA + affordability."
                  />
                </>
              )}
            </div>
          </div>
        </Card>

        {mode === "behalf" ? (
          <div style={{ marginTop: 16 }}>
            <Alert tone="info" title="Need to update something?">
              You can edit the draft from{" "}
              <Link to="/landlord-properties" style={{ color: "var(--accent)", fontWeight: 600 }}>
                Properties
              </Link>{" "}
              until {ownerName.split(" ")[0]} approves. Big changes after approval (price, units) will
              trigger a re-approval.
            </Alert>
          </div>
        ) : null}

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
          <span>Listings are screened by Habitat moderation before they appear in browse results.</span>
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
  icon: "check" | "clock" | "bell" | "search" | "user" | "key";
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
