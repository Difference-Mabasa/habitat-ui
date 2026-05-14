import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon, { type IconName } from "@/components/Icon";
import Photo from "@/components/Photo";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { createLeasesApi, type LeaseResponse } from "@/lib/api/leases";

function partyName(p: { firstName: string | null; surname: string | null; email: string | null } | null): string {
  if (!p) return "—";
  const name = [p.firstName, p.surname].filter(Boolean).join(" ");
  return name || (p.email ?? "—");
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRand(amount: number | null): string {
  if (amount == null) return "R —";
  return `R ${Math.round(amount).toLocaleString("en-ZA")}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function daysFromNow(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const ms = target.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** First of the month >= today. */
function nextRentDue(): Date {
  const now = new Date();
  return now.getDate() === 1
    ? now
    : new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export default function MoveIn() {
  const session = useSession();
  const api = useMemo(() => createLeasesApi(session.client), [session.client]);
  const [lease, setLease] = useState<LeaseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api
      .listMine()
      .then((rows) => {
        if (cancelled) return;
        const signed = rows.find((r) => r.status === "SIGNED" || r.status === "COMPLETED");
        setLease(signed ?? rows[0] ?? null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load your lease.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  if (loading) {
    return (
      <TenantShell activeId="lease">
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px" }}>
          <LoadingState rows={6} />
        </div>
      </TenantShell>
    );
  }

  if (error || !lease || (lease.status !== "SIGNED" && lease.status !== "COMPLETED")) {
    return (
      <TenantShell activeId="lease">
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px" }}>
          <EmptyState
            icon="home"
            title="Move-in isn't ready yet"
            description={
              error ??
              "Once both you and your landlord sign the lease, your move-in dashboard will appear here."
            }
            actions={
              <Link to="/lease" style={{ textDecoration: "none" }}>
                <Button variant="accent">View lease</Button>
              </Link>
            }
          />
        </div>
      </TenantShell>
    );
  }

  const monthly = Number(lease.monthlyRent);
  const tenantFirst = lease.tenant.firstName ?? "tenant";
  const homeTitle =
    lease.property.title ?? lease.unit.title ?? "Your home";
  const homeSuburb = [lease.property.suburb, lease.property.city]
    .filter(Boolean)
    .join(", ");
  const homeAddress =
    lease.property.addressLine || homeSuburb || lease.property.title || "";
  const leaseEnd = (() => {
    if (!lease.startDate) return null;
    const d = new Date(lease.startDate);
    if (Number.isNaN(d.getTime())) return null;
    const end = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate() - 1);
    return end.toISOString().slice(0, 10);
  })();
  const rentDueDate = nextRentDue().toISOString().slice(0, 10);
  const rentDueIn = daysFromNow(rentDueDate);
  const landlord = partyName(lease.landlord);

  return (
    <TenantShell activeId="lease">
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <Eyebrow style={{ marginBottom: 8 }}>My rental</Eyebrow>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Welcome home, {tenantFirst}
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: 24,
          }}
        >
          {/* Home card */}
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div style={{ display: "flex" }}>
              <Photo
                ratio="auto"
                src={lease.unit.coverImageUrl ?? undefined}
                label=""
                style={{ borderRadius: 0, width: 240, height: "auto", minHeight: 200 }}
              />
              <div style={{ padding: 24, flex: 1 }}>
                <Eyebrow style={{ marginBottom: 8 }}>Current home</Eyebrow>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    marginBottom: 4,
                  }}
                >
                  {homeTitle}
                </div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20 }}>
                  {homeAddress}
                  {lease.startDate ? ` · since ${formatDate(lease.startDate)}` : ""}
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
                  <Mini label="Lease ends" value={leaseEnd ? formatDate(leaseEnd) : "—"} />
                  <Mini label="Rent" value={formatRand(monthly)} />
                  <Mini label="Next due" value={formatShortDate(rentDueDate)} />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <ActionTile
                to="/payment"
                icon="cash"
                title="Pay rent"
                sub={rentDueIn != null ? `Due in ${rentDueIn} days` : "Set up auto-pay"}
              />
              <ActionTile
                to="/maintenance"
                icon="bolt"
                title="Report issue"
                sub="24h response"
              />
              <ActionTile
                to={`/lease?id=${lease.id}`}
                icon="paper"
                title="View lease"
                sub={
                  lease.tenantSignedAt
                    ? `Signed ${formatShortDate(lease.tenantSignedAt)}`
                    : "Signed"
                }
                last
              />
            </div>
          </Card>

          {/* Rent timeline */}
          <Card padding={24}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <Eyebrow style={{ marginBottom: 6 }}>Next payment</Eyebrow>
                <div
                  className="tabular"
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatRand(monthly)}
                </div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>
                  Due {formatDate(rentDueDate)} · debit order
                </div>
              </div>
              <Badge tone="accent">Auto-pay on</Badge>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                marginTop: 24,
              }}
            >
              {/* Deposit + first month paid via the invoice flow */}
              <PayRow
                date={formatDate(lease.tenantSignedAt ?? lease.createdAt)}
                amount={formatRand(Number(lease.deposit))}
                status="paid"
                sub="Deposit"
              />
              {lease.startDate ? (
                <PayRow
                  date={formatDate(lease.startDate)}
                  amount={formatRand(monthly)}
                  status="paid"
                  sub="First month"
                />
              ) : null}
            </div>

            <Link
              to="/statements"
              style={{ textDecoration: "none", display: "block", marginTop: 12 }}
            >
              <Button
                variant="ghost"
                size="sm"
                rightIcon="chevR"
                style={{ width: "100%", justifyContent: "center" }}
              >
                View all payments
              </Button>
            </Link>
          </Card>
        </div>

        {/* Maintenance + landlord */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: 24,
            marginTop: 24,
          }}
        >
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
            <EmptyState
              icon="bolt"
              size="sm"
              title="No maintenance requests"
              description="Anything that breaks or needs attention — log it here and we'll route it to your landlord."
            />
          </Card>

          <Card padding={24}>
            <Eyebrow style={{ marginBottom: 16 }}>Your landlord</Eyebrow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--surface-3)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                {initials(landlord) || "?"}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{landlord}</div>
                <div style={{ fontSize: 12, color: "var(--slate)" }}>
                  Responds in ~2 hrs
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/inbox" style={{ textDecoration: "none", flex: 1 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon="chat"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Message
                </Button>
              </Link>
              <Link to="/book-viewing" style={{ textDecoration: "none", flex: 1 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon="calendar"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Schedule
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </TenantShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--slate)",
          textTransform: "uppercase",
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
  sub,
  last,
}: {
  to: string;
  icon: IconName;
  title: string;
  sub: string;
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
        textDecoration: "none",
        color: "var(--ink)",
        transition: "background 120ms",
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
        }}
      >
        <Icon name={icon} size={16} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{sub}</div>
      </div>
      <Icon
        name="arrR"
        size={14}
        style={{ color: "var(--slate)", marginLeft: "auto" }}
      />
    </Link>
  );
}

function PayRow({
  date,
  amount,
  status,
  sub,
}: {
  date: string;
  amount: string;
  status: "paid" | "due";
  sub?: string;
}) {
  const tone = status === "paid" ? "var(--success)" : "var(--slate)";
  const badgeTone: BadgeTone = status === "paid" ? "success" : "neutral";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: tone,
          marginRight: 12,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{date}</div>
        {sub ? (
          <div style={{ fontSize: 11, color: "var(--slate)" }}>{sub}</div>
        ) : null}
      </div>
      <span className="tabular" style={{ fontSize: 13, fontWeight: 600 }}>
        {amount}
      </span>
      <div style={{ marginLeft: 16 }}>
        <Badge tone={badgeTone}>{status}</Badge>
      </div>
    </div>
  );
}
