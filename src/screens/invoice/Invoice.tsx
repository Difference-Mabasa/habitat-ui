import { useState } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";
import Alert from "@/components/Alert";

type InvoiceState = "PENDING" | "PAID" | "EXPIRED";

interface InvoiceLine {
  description: string;
  details: string;
  qty: string;
  unit: string;
  total: string;
}

const LINES: InvoiceLine[] = [
  { description: "Rent · May 2026", details: "23 Vilakazi St", qty: "1", unit: "R 3,450.00", total: "R 3,450.00" },
  { description: "Water (excess 1.2 kL)", details: "Municipal pass-through", qty: "1", unit: "R 26.40", total: "R 26.40" },
  { description: "Maintenance · geyser fix", details: "Approved by tenant 12 Apr", qty: "1", unit: "R 480.00", total: "R 480.00" },
  { description: "Habitat service fee", details: "5% of collected rent", qty: "1", unit: "R 172.50", total: "R 172.50" },
];

const SUBTOTAL = "R 4,128.90";
const VAT = "R 26.85";
const TOTAL = "R 4,155.75";

const STATE_HEADER: Record<InvoiceState, { tone: "warn" | "success" | "danger"; label: string; subline: string }> = {
  PENDING: { tone: "warn", label: "PENDING · 6 days to pay", subline: "Issued 12 May 2026 · expires 20 May 2026" },
  PAID: { tone: "success", label: "PAID · 2 MAY 2026", subline: "Issued 1 May 2026 · reference HB-PMT-04250" },
  EXPIRED: { tone: "danger", label: "EXPIRED · 21 MAY 2026", subline: "Issued 12 May 2026 · no payment received" },
};

export default function Invoice() {
  const [state, setState] = useState<InvoiceState>("PENDING");
  const header = STATE_HEADER[state];

  return (
    <div style={{ background: "var(--surface-2)", padding: 32, minHeight: "100vh" }}>
      <div style={{ maxWidth: 794, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Demo state switcher */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tabs
            variant="segmented"
            tabs={[
              { id: "PENDING", label: "Pending" },
              { id: "PAID", label: "Paid" },
              { id: "EXPIRED", label: "Expired" },
            ]}
            value={state}
            onChange={(v) => setState(v as InvoiceState)}
          />
        </div>

        {/* Top bar */}
        <Card
          padding="12px 18px"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ fontSize: 13, color: "var(--slate)" }}>
            Tax invoice #HB-INV-2026-04-1124 · {header.subline}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {state === "PENDING" ? (
              <Button variant="accent" size="sm" leftIcon="cash">
                Pay R 4,155.75
              </Button>
            ) : state === "EXPIRED" ? (
              <Button variant="accent" size="sm" leftIcon="refresh">
                Request new invoice
              </Button>
            ) : (
              <Button variant="accent" size="sm" leftIcon="paper">
                Print
              </Button>
            )}
            <Button variant="secondary" size="sm" leftIcon="download">
              Download
            </Button>
          </div>
        </Card>

        {state === "PENDING" ? (
          <Alert tone="warn" title="6 days left to pay">
            Pay by 20 May 2026 to keep the lease offer active. After expiry the landlord may release the unit
            to the next applicant.{" "}
            <span className="mono" style={{ fontSize: 11 }}>Status: PENDING</span>
          </Alert>
        ) : state === "EXPIRED" ? (
          <Alert tone="danger" title="This invoice expired">
            Payment window passed on 20 May 2026. If you still want to take the unit, request a new invoice —
            the landlord may decline if they've moved on to another applicant.{" "}
            <span className="mono" style={{ fontSize: 11 }}>Status: EXPIRED</span>
          </Alert>
        ) : null}

        {/* Invoice */}
        <div style={{ background: "#fff", padding: 56, boxShadow: "var(--shadow-lg)" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Logo size={18} />
              <div
                style={{ marginTop: 12, fontSize: 11, color: "var(--slate)", lineHeight: 1.5 }}
              >
                Habitat SA (Pty) Ltd
                <br />
                3rd Floor, The Hive · 8 Bree Street, Cape Town 8001
                <br />
                VAT 4860298811 · PPRA FFC2026/00831
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="display" style={{ fontSize: 40, color: "var(--ink)" }}>
                TAX INVOICE
              </div>
              <div className="mono" style={{ fontSize: 12, color: "var(--slate)", marginTop: 6 }}>
                #HB-INV-2026-04-1124
              </div>
              <div className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
                {state === "PAID" ? "Issued 1 May 2026" : "Issued 12 May 2026"}
              </div>
              <div style={{ marginTop: 10 }}>
                <Badge tone={header.tone}>{header.label}</Badge>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <Eyebrow style={{ marginBottom: 6, fontSize: 9 }}>Billed to</Eyebrow>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Sipho Khumalo</div>
              <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, marginTop: 4 }}>
                Backroom at 23 Vilakazi Street
                <br />
                Orlando West, Soweto 1804
                <br />
                ID 9304120876081
              </div>
            </div>
            <div>
              <Eyebrow style={{ marginBottom: 6, fontSize: 9 }}>Collected on behalf of</Eyebrow>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Naledi Mokoena</div>
              <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, marginTop: 4 }}>
                FNB Cheque · acc •••2114
                <br />
                Branch 250655 · Johannesburg
                <br />
                PPRA FFC-022831
              </div>
            </div>
          </div>

          {/* Line items */}
          <table style={{ width: "100%", marginTop: 32, borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Description", "Details", "Qty", "Unit", "Total"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 8px",
                      textAlign: i > 1 ? "right" : "left",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "var(--slate)",
                      borderBottom: "2px solid var(--ink)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINES.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>{row.description}</td>
                  <td style={{ padding: "12px 8px", color: "var(--slate)" }}>{row.details}</td>
                  <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>
                    {row.qty}
                  </td>
                  <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>
                    {row.unit}
                  </td>
                  <td
                    className="mono"
                    style={{ padding: "12px 8px", textAlign: "right", fontWeight: 600 }}
                  >
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ marginTop: 18, marginLeft: "auto", width: 280, fontSize: 12 }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "var(--slate)" }}
            >
              <span>Subtotal</span>
              <span className="mono">{SUBTOTAL}</span>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "var(--slate)" }}
            >
              <span>VAT 15% (service fee only)</span>
              <span className="mono">{VAT}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0 0",
                borderTop: "2px solid var(--ink)",
                marginTop: 6,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              <span>TOTAL</span>
              <span className="mono">{TOTAL}</span>
            </div>
          </div>

          {/* State-specific watermark for PAID / EXPIRED */}
          {state !== "PENDING" ? (
            <div
              aria-hidden="true"
              style={{
                position: "relative",
                marginTop: 24,
                textAlign: "center",
              }}
            >
              <span
                className="display"
                style={{
                  fontSize: 48,
                  letterSpacing: "0.08em",
                  color: state === "PAID" ? "var(--success)" : "var(--danger)",
                  opacity: 0.18,
                  border: `4px solid ${state === "PAID" ? "var(--success)" : "var(--danger)"}`,
                  padding: "8px 24px",
                  borderRadius: 8,
                  display: "inline-block",
                  transform: "rotate(-4deg)",
                }}
              >
                {state}
              </span>
            </div>
          ) : null}

          {/* Footer */}
          <div
            style={{
              marginTop: 48,
              padding: "20px 0",
              borderTop: "1px solid var(--hairline)",
              fontSize: 10,
              color: "var(--slate)",
              lineHeight: 1.6,
            }}
          >
            This is an electronically generated tax invoice — no signature required. Habitat acts as a
            trust-account intermediary under PPRA regulations. For queries, email{" "}
            <strong>billing@habitat.co.za</strong> within 30 days.
            {state === "PENDING" ? (
              <>
                <br />
                <span className="mono" style={{ color: "var(--accent)" }}>
                  Pay link: hb.co.za/p/{`HB-INV-2026-04-1124`}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
