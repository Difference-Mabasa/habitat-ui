import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import KeyValueRow from "@/components/KeyValueRow";
import Photo from "@/components/Photo";
import Alert from "@/components/Alert";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { createLeasesApi, type LeaseResponse } from "@/lib/api/leases";

function partyName(p: { firstName: string | null; surname: string | null; email: string | null } | null): string {
  if (!p) return "—";
  const name = [p.firstName, p.surname].filter(Boolean).join(" ");
  return name || (p.email ?? "—");
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

const CHECKLIST = [
  { icon: "key" as const,      title: "Collect your keys",      body: "Arrange a time with the landlord on or before your move-in date." },
  { icon: "doc" as const,      title: "Walk-through inspection", body: "Document the unit's condition with photos — protects your deposit." },
  { icon: "bolt" as const,     title: "Utility transfers",       body: "Arrange your electricity prepaid meter / water account in your name." },
  { icon: "shield" as const,   title: "Tenant's insurance",      body: "Optional but recommended — covers your belongings against theft, fire, water damage." },
];

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
        // Most recent signed lease, fall back to most recent overall.
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
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 64px" }}>
          <LoadingState rows={6} />
        </div>
      </TenantShell>
    );
  }

  if (error || !lease || (lease.status !== "SIGNED" && lease.status !== "COMPLETED")) {
    return (
      <TenantShell activeId="lease">
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 64px" }}>
          <EmptyState
            icon="home"
            title="Move-in isn't ready yet"
            description={
              error ??
              "Once both you and your landlord sign the lease, your move-in checklist will appear here."
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

  const address = [
    lease.property.addressLine,
    lease.property.suburb,
    lease.property.city,
    lease.property.postalCode,
  ]
    .filter(Boolean)
    .join(", ") || lease.property.title || "—";

  return (
    <TenantShell activeId="lease">
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>Move-in · {lease.leaseRef}</Eyebrow>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
              Welcome home, {lease.tenant.firstName ?? "tenant"}!
            </h1>
            <Badge tone="success" leftIcon="check">Both signed</Badge>
          </div>
          <p style={{ fontSize: 14, color: "var(--slate)", margin: "8px 0 0", maxWidth: 640 }}>
            The lease is signed by both parties. Your move-in date is{" "}
            <strong style={{ color: "var(--ink)" }}>{formatDate(lease.startDate)}</strong>.
            Here's what to take care of before you collect your keys.
          </p>
        </div>

        <Alert tone="success" title="You're in.">
          A confirmation has been sent to both you and {partyName(lease.landlord)}. The lease PDF and
          this checklist are always available from your /lease page.
        </Alert>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 320px",
            gap: 24,
            marginTop: 24,
          }}
        >
          <main>
            <Card padding={24}>
              <Eyebrow style={{ marginBottom: 16 }}>Move-in checklist</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CHECKLIST.map((item) => (
                  <ChecklistRow key={item.title} icon={item.icon} title={item.title} body={item.body} />
                ))}
              </div>
            </Card>

            <Card padding={24} style={{ marginTop: 16 }}>
              <Eyebrow style={{ marginBottom: 12 }}>Your landlord</Eyebrow>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "var(--surface-2)", display: "grid", placeItems: "center",
                    color: "var(--slate)", fontWeight: 600,
                  }}
                >
                  {(lease.landlord?.firstName ?? "?").charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{partyName(lease.landlord)}</div>
                  {lease.landlord?.email ? (
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>{lease.landlord.email}</div>
                  ) : null}
                </div>
                <Link to="/inbox" style={{ textDecoration: "none" }}>
                  <Button variant="secondary" size="sm" leftIcon="chat">Message</Button>
                </Link>
              </div>
            </Card>
          </main>

          <aside>
            <Card padding={0} style={{ overflow: "hidden", position: "sticky", top: 88 }}>
              <Photo
                ratio="4/3"
                src={lease.unit.coverImageUrl ?? undefined}
                label=""
                style={{ borderRadius: 0 }}
              />
              <div style={{ padding: 18 }}>
                <Eyebrow style={{ marginBottom: 8 }}>Your spot</Eyebrow>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  {lease.property.title ?? "Property"}
                </div>
                <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={12} /> {address}
                </div>
                <KeyValueRow label="Unit" value={lease.unit.title ?? "—"} size="sm" />
                <KeyValueRow label="Move-in" value={formatDate(lease.startDate)} size="sm" divider />
                <KeyValueRow
                  label="Rent"
                  value={`${formatRand(lease.monthlyRent)} / mo`}
                  size="sm"
                  divider
                />
                <KeyValueRow
                  label="Deposit"
                  value={formatRand(lease.deposit)}
                  size="sm"
                  divider
                />
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link to={`/lease?id=${lease.id}`} style={{ textDecoration: "none" }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon="paper"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      View lease
                    </Button>
                  </Link>
                  <Link to="/my-apps" style={{ textDecoration: "none" }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      My applications
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </TenantShell>
  );
}

function ChecklistRow({
  icon,
  title,
  body,
}: {
  icon: "key" | "doc" | "bolt" | "shield";
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "12px 14px",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          width: 36, height: 36, flexShrink: 0,
          borderRadius: 8,
          background: "var(--accent-soft)",
          display: "grid", placeItems: "center",
          color: "var(--accent)",
        }}
      >
        <Icon name={icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}
