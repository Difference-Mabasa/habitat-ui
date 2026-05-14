import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import Tabs from "@/components/Tabs";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { toast } from "@/lib/toast";
import {
  createInvoicesApi,
  type InvoiceResponse,
  type InvoiceStatus,
} from "@/lib/api/invoices";

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  PENDING: "warn",
  PAID: "success",
  VOIDED: "neutral",
  EXPIRED: "danger",
};

function formatRand(amount: number | null): string {
  if (amount == null) return "R —";
  return `R ${Math.round(amount).toLocaleString("en-ZA")}.00`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function statusHeader(inv: InvoiceResponse): { tone: "warn" | "success" | "danger" | "neutral"; label: string; subline: string } {
  const issued = `Issued ${formatDate(inv.issuedAt)}`;
  switch (inv.status) {
    case "PENDING":
      return {
        tone: "warn",
        label: `PENDING · pay by ${formatDate(inv.expiresAt)}`,
        subline: `${issued} · expires ${formatDate(inv.expiresAt)}`,
      };
    case "PAID":
      return {
        tone: "success",
        label: `PAID · ${formatDate(inv.paidAt)}`,
        subline: inv.paymentReference
          ? `${issued} · reference ${inv.paymentReference}`
          : issued,
      };
    case "EXPIRED":
      return { tone: "danger", label: "EXPIRED", subline: `${issued} · no payment received` };
    default:
      return { tone: "neutral", label: inv.status, subline: issued };
  }
}

export default function Invoices() {
  const session = useSession();
  const api = useMemo(() => createInvoicesApi(session.client), [session.client]);
  const [rows, setRows] = useState<InvoiceResponse[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api
      .listMine()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
        const pending = data.find((r) => r.status === "PENDING");
        setActiveId((pending ?? data[0])?.id ?? "");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load invoices.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const active = rows.find((r) => r.id === activeId) ?? rows[0];

  async function handlePay() {
    if (!active) return;
    setPaying(true);
    try {
      const updated = await api.pay(active.id);
      setRows((rs) => rs.map((r) => (r.id === active.id ? updated : r)));
      toast.success(`Payment received · ${updated.invoiceRef}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message ?? "Couldn't process payment.")
          : "Couldn't process payment.";
      toast.error(msg);
    } finally {
      setPaying(false);
    }
  }

  return (
    <TenantShell activeId="payments" background="var(--surface-2)">
      <div style={{ padding: 32 }}>
        <div style={{ maxWidth: 794, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            <Card padding={32}>
              <LoadingState rows={4} />
            </Card>
          ) : error ? (
            <Card padding={32}>
              <EmptyState icon="info" title="Couldn't load invoices" description={error} />
            </Card>
          ) : !active ? (
            <Card padding={32}>
              <EmptyState
                icon="paper"
                title="No invoices yet"
                description="Once a landlord approves your application, a deposit invoice will appear here."
                actions={
                  <Link to="/my-apps" style={{ textDecoration: "none" }}>
                    <Button variant="accent">My applications</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <>
              {rows.length > 1 ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Tabs
                    variant="segmented"
                    tabs={rows.map((r) => ({ id: r.id, label: r.invoiceRef }))}
                    value={active.id}
                    onChange={(v) => setActiveId(v)}
                  />
                </div>
              ) : null}
              <InvoiceCanvas
                invoice={active}
                onPay={handlePay}
                paying={paying}
              />
            </>
          )}
        </div>
      </div>
    </TenantShell>
  );
}

function InvoiceCanvas({
  invoice,
  onPay,
  paying,
}: {
  invoice: InvoiceResponse;
  onPay: () => void;
  paying: boolean;
}) {
  const header = statusHeader(invoice);
  const isPending = invoice.status === "PENDING";

  const subtotal = invoice.totalAmount;
  const total = invoice.totalAmount;

  const tenantBlock = invoice.unit.title
    ? `${invoice.unit.title}${invoice.property.title ? " · " + invoice.property.title : ""}`
    : invoice.property.title ?? "—";
  const tenantAddress = [invoice.property.suburb, invoice.property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {/* Top bar */}
      <Card
        padding="12px 18px"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ fontSize: 13, color: "var(--slate)" }}>
          Tax invoice <span className="mono">{invoice.invoiceRef}</span> · {header.subline}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isPending ? (
            <Button
              variant="accent"
              size="sm"
              leftIcon="cash"
              onClick={onPay}
              disabled={paying}
            >
              {paying ? "Processing…" : `Pay ${formatRand(total)}`}
            </Button>
          ) : (
            <Button variant="accent" size="sm" leftIcon="paper" onClick={() => window.print()}>
              Print
            </Button>
          )}
          <Button variant="secondary" size="sm" leftIcon="download" disabled>
            Download
          </Button>
        </div>
      </Card>

      {/* A4 canvas */}
      <div style={{ background: "#fff", padding: 56, boxShadow: "var(--shadow-lg)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Logo size={18} />
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--slate)", lineHeight: 1.5 }}>
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
              {invoice.invoiceRef}
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--slate)" }}>
              Issued {formatDate(invoice.issuedAt)}
            </div>
            <div style={{ marginTop: 10 }}>
              <Badge tone={STATUS_TONE[invoice.status]}>{header.label}</Badge>
            </div>
          </div>
        </div>

        {/* From / To */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <Eyebrow style={{ marginBottom: 6, fontSize: 9 }}>Billed to</Eyebrow>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Tenant</div>
            <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, marginTop: 4 }}>
              {tenantBlock}
              {tenantAddress ? (
                <>
                  <br />
                  {tenantAddress}
                </>
              ) : null}
            </div>
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 6, fontSize: 9 }}>Collected on behalf of</Eyebrow>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{invoice.property.title ?? "Landlord"}</div>
            <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5, marginTop: 4 }}>
              Habitat trust account
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
            <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
              <td style={{ padding: "12px 8px", fontWeight: 500 }}>Deposit</td>
              <td style={{ padding: "12px 8px", color: "var(--slate)" }}>Refundable · held in trust</td>
              <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>1</td>
              <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>{formatRand(invoice.depositAmount)}</td>
              <td className="mono" style={{ padding: "12px 8px", textAlign: "right", fontWeight: 600 }}>{formatRand(invoice.depositAmount)}</td>
            </tr>
            {invoice.firstMonthRent != null ? (
              <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
                <td style={{ padding: "12px 8px", fontWeight: 500 }}>First month's rent</td>
                <td style={{ padding: "12px 8px", color: "var(--slate)" }}>Advance rent payment</td>
                <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>1</td>
                <td className="mono" style={{ padding: "12px 8px", textAlign: "right" }}>{formatRand(invoice.firstMonthRent)}</td>
                <td className="mono" style={{ padding: "12px 8px", textAlign: "right", fontWeight: 600 }}>{formatRand(invoice.firstMonthRent)}</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ marginTop: 18, marginLeft: "auto", width: 280, fontSize: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", color: "var(--slate)" }}>
            <span>Subtotal</span>
            <span className="mono">{formatRand(subtotal)}</span>
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
            <span className="mono">{formatRand(total)}</span>
          </div>
        </div>

        {/* Watermark for PAID / EXPIRED */}
        {invoice.status === "PAID" || invoice.status === "EXPIRED" ? (
          <div
            aria-hidden="true"
            style={{ position: "relative", marginTop: 24, textAlign: "center" }}
          >
            <span
              className="display"
              style={{
                fontSize: 48,
                letterSpacing: "0.08em",
                color: invoice.status === "PAID" ? "var(--success)" : "var(--danger)",
                opacity: 0.18,
                border: `4px solid ${invoice.status === "PAID" ? "var(--success)" : "var(--danger)"}`,
                padding: "8px 24px",
                borderRadius: 8,
                display: "inline-block",
                transform: "rotate(-4deg)",
              }}
            >
              {invoice.status}
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
          {isPending ? (
            <>
              <br />
              <span className="mono" style={{ color: "var(--accent)" }}>
                Pay link: hb.co.za/p/{invoice.invoiceRef}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
