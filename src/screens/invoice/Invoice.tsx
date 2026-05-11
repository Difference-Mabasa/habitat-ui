import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";

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
  { description: "Backroom service fee", details: "5% of collected rent", qty: "1", unit: "R 172.50", total: "R 172.50" },
];

const SUBTOTAL = "R 4,128.90";
const VAT = "R 26.85";
const TOTAL = "R 4,155.75";

export default function Invoice() {
  return (
    <div style={{ background: "var(--surface-2)", padding: 32, minHeight: "100vh" }}>
      <div style={{ maxWidth: 794, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Top bar */}
        <Card
          padding="12px 18px"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ fontSize: 13, color: "var(--slate)" }}>
            Tax invoice #BR-INV-2026-04-1124 · paid 2 May 2026
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" leftIcon="download">
              Download
            </Button>
            <Button variant="accent" size="sm" leftIcon="paper">
              Print
            </Button>
          </div>
        </Card>

        {/* Invoice */}
        <div style={{ background: "#fff", padding: 56, boxShadow: "var(--shadow-lg)" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Logo size={18} />
              <div
                style={{ marginTop: 12, fontSize: 11, color: "var(--slate)", lineHeight: 1.5 }}
              >
                Backroom SA (Pty) Ltd
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
                #BR-INV-2026-04-1124
              </div>
              <div className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
                Issued 1 May 2026
              </div>
              <div style={{ marginTop: 10 }}>
                <Badge tone="success">PAID · 2 MAY 2026</Badge>
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
            This is an electronically generated tax invoice — no signature required. Backroom acts as a
            trust-account intermediary under PPRA regulations. For queries, email{" "}
            <strong>billing@backroom.co.za</strong> within 30 days.
          </div>
        </div>
      </div>
    </div>
  );
}
