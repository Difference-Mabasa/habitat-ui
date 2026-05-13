import { useState } from "react";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
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

interface InvoiceRow {
  id: string;
  date: string;
  number: string;
  amount: string;
}

const INVOICES: InvoiceRow[] = [];

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
          <div style={{ position: "sticky", top: 88, alignSelf: "start" }}>
            <SubNav items={ITEMS} activeId={section} onChange={setSection} />
          </div>

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
                    —
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                    Your plan details will appear here.
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Change plan
                </Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Properties used", value: "—" },
                  { label: "This month's fees", value: "R 0" },
                  { label: "Next invoice", value: "—" },
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
              <EmptyState
                icon="cash"
                title="No payout method on file"
                description="Add a bank account to receive rent payouts."
              />
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
              {INVOICES.length === 0 ? (
                <EmptyState
                  icon="paper"
                  title="No invoices yet"
                  description="Invoices will appear here as your plan renews."
                />
              ) : null}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
