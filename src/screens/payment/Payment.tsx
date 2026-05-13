import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";

interface TransactionRow {
  label: string;
  value: string;
  mono?: boolean;
}

const ROWS: TransactionRow[] = [
  { label: "Reference", value: "—", mono: true },
  { label: "Method", value: "—" },
  { label: "Date", value: "—" },
  { label: "Receipt #", value: "—", mono: true },
  { label: "Held in escrow until", value: "—" },
];

export default function Payment() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="tenant" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px" }}>
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
              <Icon name="check" size={26} />
            </div>
            <Eyebrow style={{ color: "var(--success)" }}>Payment received</Eyebrow>
            <h1
              className="tabular"
              style={{
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                margin: "8px 0 6px",
              }}
            >
              R 0.00
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", margin: 0 }}>
              —
            </p>
          </div>

          {/* Transaction details */}
          <div style={{ padding: "24px 48px" }}>
            <Eyebrow style={{ marginBottom: 16 }}>Transaction</Eyebrow>
            <div>
              {ROWS.map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--hairline)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--slate)" }}>{r.label}</span>
                  <span
                    style={{
                      fontWeight: 500,
                      fontFamily: r.mono ? "var(--font-mono)" : "inherit",
                    }}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
              <Link to="/lease" style={{ textDecoration: "none" }}>
                <Button
                  variant="accent"
                  size="lg"
                  rightIcon="arrR"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Sign your lease
                </Button>
              </Link>
              <Link to="/invoice" style={{ textDecoration: "none" }}>
                <Button
                  variant="secondary"
                  leftIcon="download"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Download receipt PDF
                </Button>
              </Link>
              <Link to="/tenant-portal" style={{ textDecoration: "none" }}>
                <Button
                  variant="ghost"
                  leftIcon="home"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Back to My Rental
                </Button>
              </Link>
            </div>
          </div>

          {/* Next due */}
          <div
            style={{
              padding: "20px 48px",
              background: "var(--surface-2)",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 4 }}>Next payment</Eyebrow>
              <div style={{ fontSize: 13 }}>R 0 · —</div>
            </div>
            <Link to="/settings" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm" rightIcon="chevR">
                Schedule debit order
              </Button>
            </Link>
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 24,
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
