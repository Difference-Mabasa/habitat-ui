import { Link } from "react-router-dom";
import Photo from "@/components/Photo";
import Icon, { type IconName } from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import PriceDisplay from "@/components/PriceDisplay";
import AgentCard from "@/components/AgentCard";
import KpiTile from "@/components/KpiTile";
import TenantShell from "@/components/TenantShell";

interface PaymentRow {
  date: string;
  amount: string;
  status: "paid" | "due" | "overdue";
  sub?: string;
}

interface MaintenanceRow {
  title: string;
  status: string;
  date: string;
  tone: "warn" | "accent" | "success";
}

const PAYMENTS: PaymentRow[] = [];

const MAINTENANCE: MaintenanceRow[] = [];

export default function TenantPortal() {
  return (
    <TenantShell activeId="overview">
      <div style={{ padding: "32px 32px 64px" }}>
          <header style={{ marginBottom: 24 }}>
            <Eyebrow>Overview</Eyebrow>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                margin: "8px 0 0",
              }}
            >
              Welcome home
            </h1>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            <KpiTile label="Active lease" value="—" />
            <KpiTile label="Next rent due" value="R 0" />
            <KpiTile label="Open maintenance" value="0" />
            <KpiTile label="Upcoming viewings" value="0" />
          </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 24 }}>
          {/* Home card */}
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div style={{ display: "flex" }}>
              <Photo
                ratio="auto"
                label=""
                style={{ borderRadius: 0, width: 240, height: "auto", flexShrink: 0 }}
              />
              <div style={{ padding: 24, flex: 1 }}>
                <Eyebrow style={{ marginBottom: 8 }}>Current home</Eyebrow>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4 }}>
                  —
                </div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20 }}>
                  No active lease
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 16,
                    paddingTop: 16,
                    borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <MiniStat label="Lease ends" value="—" />
                  <MiniStat label="Rent" value="R 0" />
                  <MiniStat label="Next due" value="—" />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid var(--hairline)" }}>
              <ActionTile to="/payment" icon="cash" title="Pay rent" subtitle="—" />
              <ActionTile to="/maintenance" icon="bolt" title="Report issue" subtitle="24h response" />
              <ActionTile to="/lease" icon="paper" title="View lease" subtitle="—" />
              <ActionTile to="/move-out" icon="key" title="Move out" subtitle="Inspection & handover" last />
            </div>
          </Card>

          {/* Rent timeline */}
          <Card padding={24}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <Eyebrow style={{ marginBottom: 6 }}>Next payment</Eyebrow>
                <PriceDisplay amount={0} period="" size="lg" />
                <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 4 }}>
                  —
                </div>
              </div>
              <Badge tone="neutral">Auto-pay off</Badge>
            </div>

            {PAYMENTS.length === 0 ? (
              <EmptyState icon="cash" size="sm" title="No payments yet" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 24 }}>
                {PAYMENTS.map((p) => (
                  <PayRow key={p.date} payment={p} />
                ))}
              </div>
            )}

            <Link to="/statements" style={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                size="sm"
                rightIcon="chevR"
                style={{ width: "100%", marginTop: 12, justifyContent: "center" }}
              >
                View statements
              </Button>
            </Link>
          </Card>
        </div>

        {/* Maintenance + landlord */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24, marginTop: 24 }}>
          <Card padding={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <Eyebrow style={{ marginBottom: 6 }}>Maintenance</Eyebrow>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Open requests</div>
              </div>
              <Link to="/maintenance" style={{ textDecoration: "none" }}>
                <Button variant="secondary" size="sm" leftIcon="plus">
                  New request
                </Button>
              </Link>
            </div>
            {MAINTENANCE.length === 0 ? (
              <EmptyState icon="bolt" size="sm" title="No open requests" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {MAINTENANCE.map((m) => (
                  <MaintRow key={m.title} item={m} />
                ))}
              </div>
            )}
          </Card>

          <Card padding={24}>
            <Eyebrow style={{ marginBottom: 16 }}>Your landlord</Eyebrow>
            <AgentCard
              variant="stacked"
              name=""
              role="Landlord"
              responseTime=""
              actions={
                <>
                  <Link to="/inbox" style={{ flex: 1, textDecoration: "none" }}>
                    <Button variant="secondary" size="sm" leftIcon="chat" style={{ width: "100%", justifyContent: "center" }}>
                      Message
                    </Button>
                  </Link>
                  <Link to="/book-viewing" style={{ flex: 1, textDecoration: "none" }}>
                    <Button variant="secondary" size="sm" leftIcon="calendar" style={{ width: "100%", justifyContent: "center" }}>
                      Schedule
                    </Button>
                  </Link>
                </>
              }
            />
          </Card>
        </div>
      </div>
    </TenantShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: "var(--slate)",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div className="tabular" style={{ fontSize: 14, fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

function ActionTile({
  to,
  icon,
  title,
  subtitle,
  last,
}: {
  to: string;
  icon: IconName;
  title: string;
  subtitle: string;
  last?: boolean;
}) {
  return (
    <Link
      to={to}
      style={{
        flex: 1,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "transparent",
        borderRight: last ? "none" : "1px solid var(--hairline)",
        textAlign: "left",
        cursor: "pointer",
        transition: "background 120ms",
        textDecoration: "none",
        color: "var(--ink)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--surface-3)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{subtitle}</div>
      </div>
      <Icon name="arrR" size={14} style={{ color: "var(--slate)" }} />
    </Link>
  );
}

function PayRow({ payment }: { payment: PaymentRow }) {
  const dotColor = payment.status === "paid" ? "var(--success)" : "var(--slate)";
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--hairline)" }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: dotColor,
          marginRight: 12,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{payment.date}</div>
        {payment.sub ? (
          <div style={{ fontSize: 11, color: "var(--slate)" }}>{payment.sub}</div>
        ) : null}
      </div>
      <span className="tabular" style={{ fontSize: 13, fontWeight: 600 }}>
        {payment.amount}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--slate)",
          marginLeft: 16,
          textTransform: "capitalize",
          fontFamily: "var(--font-mono)",
        }}
      >
        {payment.status}
      </span>
    </div>
  );
}

function MaintRow({ item }: { item: MaintenanceRow }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        border: "1px solid var(--hairline)",
        borderRadius: 8,
      }}
    >
      <div
        style={{ width: 6, height: 6, borderRadius: "50%", background: `var(--${item.tone})`, flexShrink: 0 }}
      />
      <div style={{ flex: 1, fontSize: 14 }}>{item.title}</div>
      <Badge tone={item.tone}>{item.status}</Badge>
      <span style={{ fontSize: 12, color: "var(--slate)", minWidth: 100, textAlign: "right" }}>
        {item.date}
      </span>
    </div>
  );
}
