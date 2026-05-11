import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import SubNav, { type SubNavItem } from "@/components/SubNav";

const ITEMS: SubNavItem[] = [
  { id: "plan", label: "Plan & billing", icon: "cash" },
  { id: "payout", label: "Payout method", icon: "trend" },
  { id: "tax", label: "Tax & VAT", icon: "paper" },
  { id: "team", label: "Team & agents", icon: "users" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "api", label: "API & integrations", icon: "bolt" },
  { id: "close", label: "Close account", icon: "logout" },
];

const INVOICES = [
  { id: "i1", date: "12 Apr 2025", number: "INV-2025-04-0042", amount: "R 199.00" },
  { id: "i2", date: "12 Mar 2025", number: "INV-2025-03-0042", amount: "R 199.00" },
  { id: "i3", date: "12 Feb 2025", number: "INV-2025-02-0042", amount: "R 199.00" },
  { id: "i4", date: "12 Jan 2025", number: "INV-2025-01-0042", amount: "R 199.00" },
];

export default function Settings() {
  const [section, setSection] = useState("plan");

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Nav role="landlord" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>Account</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 32px",
          }}
        >
          Settings & billing
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 48 }}>
          <SubNav items={ITEMS} activeId={section} onChange={setSection} />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Plan */}
            <Card padding={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <div>
                  <Eyebrow style={{ color: "var(--accent)" }}>Current plan</Eyebrow>
                  <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 4 }}>
                    Landlord · Pro
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                    Up to 10 properties · 0.8% transaction fee · Renews 12 May 2025
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Change plan
                </Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Properties used", value: "4 / 10" },
                  { label: "This month's fees", value: "R 184" },
                  { label: "Next invoice", value: "R 199 · 12 May" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{ padding: 12, background: "var(--surface-2)", borderRadius: 6 }}
                  >
                    <Eyebrow style={{ marginBottom: 4 }}>{s.label}</Eyebrow>
                    <div className="tabular" style={{ fontSize: 16, fontWeight: 600 }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payout method */}
            <Card padding={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>Payout method</div>
                <Button variant="ghost" size="sm" leftIcon="edit">
                  Change
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 14,
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                }}
              >
                <div
                  className="mono"
                  style={{
                    width: 44,
                    height: 32,
                    background: "var(--ink)",
                    color: "var(--paper)",
                    borderRadius: 4,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  FNB
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>FNB Cheque · ••••3091</div>
                  <div style={{ fontSize: 11, color: "var(--slate)" }}>
                    Settles T+3 business days · verified Mar 2024
                  </div>
                </div>
                <Badge tone="success">Verified</Badge>
              </div>
            </Card>

            {/* Invoices */}
            <Card padding={0} style={{ overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid var(--hairline)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>Recent invoices</div>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </div>
              {INVOICES.map((inv, i) => (
                <div
                  key={inv.id}
                  style={{
                    padding: "12px 24px",
                    borderTop: i > 0 ? "1px solid var(--hairline)" : "none",
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 120px 80px auto",
                    alignItems: "center",
                    gap: 16,
                    fontSize: 13,
                  }}
                >
                  <span>{inv.date}</span>
                  <span className="mono" style={{ color: "var(--slate)", fontSize: 12 }}>
                    {inv.number}
                  </span>
                  <span className="tabular">{inv.amount}</span>
                  <Badge tone="success">Paid</Badge>
                  <IconButton icon="download" label="Download invoice" size="sm" />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
