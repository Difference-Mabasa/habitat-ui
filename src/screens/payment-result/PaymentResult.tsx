import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon, { type IconName } from "@/components/Icon";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";
import Alert from "@/components/Alert";
import KeyValueRow from "@/components/KeyValueRow";

type ResultState = "success" | "cancel" | "error";

const STATE_STYLE: Record<
  ResultState,
  { icon: IconName; tone: "success" | "warn" | "danger"; eyebrow: string; heading: string; body: string }
> = {
  success: {
    icon: "check",
    tone: "success",
    eyebrow: "Payment received",
    heading: "Your payment went through",
    body: "Funds are in escrow and will release to the landlord on the scheduled date. A receipt is on the way to your inbox.",
  },
  cancel: {
    icon: "x",
    tone: "warn",
    eyebrow: "Payment cancelled",
    heading: "Nothing went through",
    body: "You backed out at the gateway. No money moved. Your invoice is still pending — try again before it expires.",
  },
  error: {
    icon: "info",
    tone: "danger",
    eyebrow: "Something broke",
    heading: "We couldn't confirm your payment",
    body: "The gateway sent back an error. If money left your account, it'll auto-reverse in 24 hours. Take a screenshot of this page and tap Contact support if it doesn't.",
  },
};

interface ResultRow {
  label: string;
  value: string;
  mono?: boolean;
}

const SUCCESS_ROWS: ResultRow[] = [
  { label: "Reference", value: "—", mono: true },
  { label: "Method", value: "—" },
  { label: "Date", value: "—" },
  { label: "Amount", value: "R 0" },
  { label: "Held in escrow until", value: "—" },
];

const CANCEL_ROWS: ResultRow[] = [
  { label: "Invoice", value: "—", mono: true },
  { label: "Amount due", value: "R 0" },
  { label: "Expires", value: "—" },
  { label: "Late fee after", value: "—" },
];

const ERROR_ROWS: ResultRow[] = [
  { label: "Reference", value: "—", mono: true },
  { label: "Gateway code", value: "—", mono: true },
  { label: "Last attempt", value: "—" },
];

export default function PaymentResult() {
  const [state, setState] = useState<ResultState>("success");
  const s = STATE_STYLE[state];
  const rows = state === "success" ? SUCCESS_ROWS : state === "cancel" ? CANCEL_ROWS : ERROR_ROWS;

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Demo controls — flip between the three result states. */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
          <Tabs
            variant="segmented"
            tabs={[
              { id: "success", label: "Success" },
              { id: "cancel", label: "Cancel" },
              { id: "error", label: "Error" },
            ]}
            value={state}
            onChange={(v) => setState(v as ResultState)}
          />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
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
                background: `color-mix(in oklch, var(--${s.tone}) 12%, transparent)`,
                border: `1.5px solid var(--${s.tone})`,
                color: `var(--${s.tone})`,
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px",
              }}
            >
              <Icon name={s.icon} size={26} />
            </div>
            <Eyebrow style={{ color: `var(--${s.tone})` }}>{s.eyebrow}</Eyebrow>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                margin: "8px 0 6px",
              }}
            >
              {s.heading}
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 auto", maxWidth: 480, lineHeight: 1.55 }}>
              {s.body}
            </p>
          </div>

          <div style={{ padding: "20px 48px" }}>
            <Eyebrow style={{ marginBottom: 12 }}>{state === "cancel" ? "Invoice" : "Transaction"}</Eyebrow>
            {rows.map((r, i) => (
              <KeyValueRow
                key={r.label}
                label={r.label}
                value={r.mono ? <span className="mono">{r.value}</span> : r.value}
                divider={i > 0}
              />
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
              {state === "success" ? (
                <>
                  <Link to="/lease" style={{ textDecoration: "none" }}>
                    <Button variant="accent" size="lg" rightIcon="arrR" style={{ width: "100%", justifyContent: "center" }}>
                      Sign your lease
                    </Button>
                  </Link>
                  <Link to="/invoice" style={{ textDecoration: "none" }}>
                    <Button variant="secondary" leftIcon="download" style={{ width: "100%", justifyContent: "center" }}>
                      Download receipt PDF
                    </Button>
                  </Link>
                  <Link to="/tenant-portal" style={{ textDecoration: "none" }}>
                    <Button variant="ghost" leftIcon="home" style={{ width: "100%", justifyContent: "center" }}>
                      Back to My Rental
                    </Button>
                  </Link>
                </>
              ) : state === "cancel" ? (
                <>
                  <Link to="/payment" style={{ textDecoration: "none" }}>
                    <Button variant="accent" size="lg" leftIcon="refresh" style={{ width: "100%", justifyContent: "center" }}>
                      Try payment again
                    </Button>
                  </Link>
                  <Link to="/payment" style={{ textDecoration: "none" }}>
                    <Button variant="secondary" style={{ width: "100%", justifyContent: "center" }}>
                      Choose a different method
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/payment" style={{ textDecoration: "none" }}>
                    <Button variant="accent" size="lg" leftIcon="refresh" style={{ width: "100%", justifyContent: "center" }}>
                      Retry payment
                    </Button>
                  </Link>
                  <Link to="/help" style={{ textDecoration: "none" }}>
                    <Button variant="secondary" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>
                      Contact support
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </Card>

        {state === "error" ? (
          <div style={{ marginTop: 16 }}>
            <Alert tone="danger" title="What to do if money left your account">
              Card or EFT payments that fail at the gateway auto-reverse within 24 hours. Keep this page open
              or screenshot the gateway code — support will need it.
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
          <span>Held in regulated trust account · Habitat Escrow Pty Ltd · FSP 51234</span>
        </div>
      </div>
    </div>
  );
}
