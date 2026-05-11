import type { ReactNode } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";

interface RowProps {
  label: string;
  value: ReactNode;
}

const rows: { section: string; items: RowProps[] }[] = [
  {
    section: "1. Parties",
    items: [
      { label: "Landlord", value: "Naledi Mokoena (ID 8201180123087)" },
      { label: "Tenant", value: "Sipho Khumalo (ID 9304120876081)" },
      { label: "Witness", value: "Habitat SA Pty Ltd · ref HB-W-12831" },
    ],
  },
  {
    section: "2. Property",
    items: [
      { label: "Address", value: "Backroom · 23 Vilakazi Street, Orlando West, Soweto 1804" },
      { label: "Type", value: "Detached backroom, single occupant" },
      { label: "Inventory", value: "1× single bed, geyser, fridge, sink, locking door (full report attached)" },
    ],
  },
  {
    section: "3. Term & rent",
    items: [
      { label: "Lease start", value: "1 June 2026" },
      { label: "Lease end", value: "31 May 2027 (12 months)" },
      { label: "Monthly rent", value: "R 3,450" },
      { label: "Deposit", value: "R 3,450 (1× month, held in trust)" },
      { label: "Escalation", value: "8% per annum on renewal" },
      { label: "Due date", value: "1st of each month, FNB •••2114" },
    ],
  },
];

export default function LeasePdf() {
  return (
    <div style={{ background: "var(--surface-2)", padding: 32, minHeight: "100vh" }}>
      <div style={{ maxWidth: 794, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Print bar */}
        <Card
          padding="12px 18px"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ fontSize: 13, color: "var(--slate)" }}>
            Lease #HB-LSE-2026-04891 · A4 portrait · 2 pages
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" leftIcon="download">
              Download PDF
            </Button>
            <Button variant="accent" size="sm" leftIcon="paper">
              Print
            </Button>
          </div>
        </Card>

        {/* Page 1 */}
        <div
          style={{
            background: "#fff",
            boxShadow: "var(--shadow-lg)",
            padding: 56,
            position: "relative",
            minHeight: 1100,
            fontFamily: "var(--font-sans)",
            color: "#1E0F06",
          }}
        >
          {/* Watermark */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 280,
              left: 0,
              right: 0,
              textAlign: "center",
              transform: "rotate(-22deg)",
              color: "rgba(233,122,31,0.06)",
              fontFamily: "var(--font-display)",
              fontSize: 140,
              letterSpacing: 6,
              pointerEvents: "none",
            }}
          >
            SPECIMEN
          </div>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: 18,
              borderBottom: "2px solid var(--ink)",
            }}
          >
            <Logo size={18} />
            <div style={{ textAlign: "right", fontSize: 10, color: "var(--slate)", lineHeight: 1.5 }}>
              <div className="mono" style={{ fontWeight: 600, fontSize: 11 }}>
                LEASE #HB-LSE-2026-04891
              </div>
              <div>Generated 4 May 2026</div>
              <div>POPIA-compliant electronic instrument</div>
            </div>
          </div>

          <div style={{ marginTop: 36 }}>
            <div
              className="eyebrow"
              style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
            >
              South African Residential Tenancy Agreement
            </div>
            <h1 className="display" style={{ fontSize: 38, margin: "8px 0 6px", color: "#1E0F06" }}>
              LEASE AGREEMENT
            </h1>
            <p style={{ fontSize: 11, color: "var(--slate)", margin: 0 }}>
              Made under the Rental Housing Act 50 of 1999, as amended.
            </p>
          </div>

          {rows.map((section) => (
            <div key={section.section} style={{ marginTop: 28 }}>
              <SectionHeading>{section.section}</SectionHeading>
              {section.items.map((item) => (
                <DocRow key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          ))}

          <div style={{ marginTop: 24 }}>
            <SectionHeading>4. Utilities</SectionHeading>
            <div style={{ fontSize: 12, lineHeight: 1.6 }}>
              Electricity is prepaid; the Tenant tops up directly. Water is included up to 6 kL/month,
              with excess charged at municipal rate. Refuse is included.
            </div>
          </div>

          {/* Signature block */}
          <div
            style={{
              position: "absolute",
              left: 56,
              right: 56,
              bottom: 56,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
          >
            <div>
              <div
                style={{
                  borderBottom: "1px solid var(--ink)",
                  height: 36,
                  marginBottom: 6,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: "Brush Script MT, cursive",
                    fontSize: 22,
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                  }}
                >
                  N. Mokoena
                </span>
              </div>
              <div style={{ fontSize: 10, color: "var(--slate)" }}>
                Landlord · signed 4 May 2026 14:22 SAST
              </div>
            </div>
            <div>
              <div style={{ borderBottom: "1px solid var(--ink)", height: 36, marginBottom: 6 }} />
              <div style={{ fontSize: 10, color: "var(--slate)" }}>Tenant · awaiting signature</div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              left: 56,
              right: 56,
              bottom: 16,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 9,
              color: "var(--slate)",
            }}
          >
            <span>Page 1 of 2 · Habitat SA Pty Ltd · PPRA reg. FFC2026/00831</span>
            <span className="mono">hb.co.za/L/04891</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--slate)",
        margin: "0 0 8px",
      }}
    >
      {children}
    </h3>
  );
}

function DocRow({ label, value }: RowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        padding: "8px 0",
        borderBottom: "1px dotted var(--hairline)",
        fontSize: 12,
      }}
    >
      <div style={{ color: "var(--slate)", fontWeight: 500 }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}
