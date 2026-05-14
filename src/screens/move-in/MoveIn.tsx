import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { createLeasesApi, type LeaseResponse } from "@/lib/api/leases";

function partyName(p: { firstName: string | null; surname: string | null; email: string | null } | null): string {
  if (!p) return "your landlord";
  const name = [p.firstName, p.surname].filter(Boolean).join(" ");
  return name || (p.email ?? "your landlord");
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

/**
 * Post-signed celebration + handoff page. Lands here from /lease the moment
 * the second signature commits. Mirrors the success pattern from the design
 * handoff's screen-payment.jsx (centered card, big check, eyebrow + headline,
 * transaction-style detail rows, primary + secondary CTAs, footer).
 *
 * The single primary CTA points at /tenant-portal — the ongoing-tenancy
 * dashboard — so the user has an obvious next step. /move-in itself is the
 * "you've arrived" moment, not the place you live.
 */
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
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px" }}>
          <LoadingState rows={5} />
        </div>
      </div>
    );
  }

  if (error || !lease || (lease.status !== "SIGNED" && lease.status !== "COMPLETED")) {
    return (
      <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav role="tenant" />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px" }}>
          <EmptyState
            icon="home"
            title="Not ready for move-in yet"
            description={
              error ??
              "Once both you and your landlord sign the lease, this is where you'll land."
            }
            actions={
              <Link to="/my-apps" style={{ textDecoration: "none" }}>
                <Button variant="accent">My applications</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const tenantFirst = lease.tenant.firstName ?? "tenant";
  const propertyTitle = lease.property.title ?? lease.unit.title ?? "your new home";
  const monthly = Number(lease.monthlyRent);
  const deposit = Number(lease.deposit);
  const landlord = partyName(lease.landlord);

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
            <Eyebrow style={{ marginBottom: 6, color: "var(--success)" }}>
              Lease signed
            </Eyebrow>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                margin: "0 0 6px",
              }}
            >
              Welcome home, {tenantFirst}
            </h1>
            <p style={{ fontSize: 14, color: "var(--slate)", margin: 0 }}>
              {propertyTitle} · move-in {formatDate(lease.startDate)}
            </p>
          </div>

          {/* Lease summary rows */}
          <div style={{ padding: "24px 48px" }}>
            <Eyebrow style={{ marginBottom: 16 }}>Your lease</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <DetailRow label="Reference" value={lease.leaseRef} mono />
              <DetailRow label="Property" value={propertyTitle} />
              <DetailRow label="Landlord" value={landlord} />
              <DetailRow label="Move-in" value={formatDate(lease.startDate)} />
              <DetailRow
                label="Monthly rent"
                value={`${formatRand(monthly)} /mo`}
              />
              <DetailRow label="Deposit paid" value={formatRand(deposit)} />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 24,
              }}
            >
              <Link to="/tenant-portal" style={{ textDecoration: "none" }}>
                <Button
                  variant="accent"
                  rightIcon="arrR"
                  style={{ width: "100%", justifyContent: "center", height: 44 }}
                >
                  Enter your tenant portal
                </Button>
              </Link>
              <Link to={`/lease?id=${lease.id}`} style={{ textDecoration: "none" }}>
                <Button
                  variant="secondary"
                  leftIcon="paper"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  View signed lease
                </Button>
              </Link>
            </div>
          </div>

          {/* Next step strip */}
          <div
            style={{
              padding: "20px 48px",
              background: "var(--surface-2)",
              borderTop: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <Eyebrow style={{ marginBottom: 4 }}>Next up</Eyebrow>
              <div style={{ fontSize: 13, color: "var(--ink)" }}>
                Collect keys on move-in day · message {landlord} to arrange
              </div>
            </div>
            <Link to="/inbox" style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm" rightIcon="chevR">
                Message
              </Button>
            </Link>
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 24,
            fontSize: 12,
            color: "var(--slate)",
          }}
        >
          <Link
            to="/my-apps"
            style={{
              color: "var(--slate)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Icon name="chevL" size={12} /> Back to applications
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid var(--hairline)",
        fontSize: 13,
      }}
    >
      <span style={{ color: "var(--slate)" }}>{label}</span>
      <span className={mono ? "mono" : undefined} style={{ fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}
