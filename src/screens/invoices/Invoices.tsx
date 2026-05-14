import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TenantShell from "@/components/TenantShell";
import Photo from "@/components/Photo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge, { type BadgeTone } from "@/components/Badge";
import Eyebrow from "@/components/Eyebrow";
import EmptyState from "@/components/EmptyState";
import KeyValueRow from "@/components/KeyValueRow";
import LoadingState from "@/components/LoadingState";
import { useSession } from "@/lib/session";
import { toast } from "@/lib/toast";
import {
  createInvoicesApi,
  type InvoiceResponse,
  type InvoiceStatus,
} from "@/lib/api/invoices";

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  PENDING: "Outstanding",
  PAID: "Paid",
  VOIDED: "Voided",
  EXPIRED: "Expired",
};

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  PENDING: "warn",
  PAID: "success",
  VOIDED: "neutral",
  EXPIRED: "danger",
};

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

export default function Invoices() {
  const session = useSession();
  const api = useMemo(() => createInvoicesApi(session.client), [session.client]);
  const [rows, setRows] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void api
      .listMine()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
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

  async function handlePay(invoiceId: string) {
    setPayingId(invoiceId);
    try {
      const updated = await api.pay(invoiceId);
      setRows((rs) => rs.map((r) => (r.id === invoiceId ? updated : r)));
      toast.success(`Payment received · ${updated.invoiceRef}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message ?? "Couldn't process payment.")
          : "Couldn't process payment.";
      toast.error(msg);
    } finally {
      setPayingId(null);
    }
  }

  const outstanding = rows.filter((r) => r.status === "PENDING");

  return (
    <TenantShell activeId="applications">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Eyebrow>You</Eyebrow>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "8px 0 6px",
          }}
        >
          Invoices
        </h1>
        <p style={{ fontSize: 14, color: "var(--slate)", margin: "0 0 32px" }}>
          {loading
            ? "Loading…"
            : outstanding.length > 0
              ? `${outstanding.length} outstanding · pay your deposit to confirm the unit.`
              : "No outstanding invoices."}
        </p>

        {loading ? (
          <LoadingState rows={3} />
        ) : error ? (
          <EmptyState icon="info" title="Couldn't load invoices" description={error} />
        ) : rows.length === 0 ? (
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
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rows.map((inv) => (
              <InvoiceRow
                key={inv.id}
                invoice={inv}
                onPay={() => handlePay(inv.id)}
                paying={payingId === inv.id}
              />
            ))}
          </div>
        )}
      </div>
    </TenantShell>
  );
}

function InvoiceRow({
  invoice,
  onPay,
  paying,
}: {
  invoice: InvoiceResponse;
  onPay: () => void;
  paying: boolean;
}) {
  const propertyLine =
    invoice.property.title ||
    [invoice.property.suburb, invoice.property.city].filter(Boolean).join(", ") ||
    "Property";
  const isPaid = invoice.status === "PAID";
  const isPending = invoice.status === "PENDING";

  return (
    <Card padding={0} style={{ overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 320px" }}>
        <Photo
          ratio="auto"
          src={invoice.unit.coverImageUrl ?? undefined}
          label=""
          style={{ borderRadius: 0, height: "100%", minHeight: 160 }}
        />
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 6,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{propertyLine}</h3>
            <Badge tone={STATUS_TONE[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--slate)",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span>{invoice.unit.title ?? "Unit"}</span>
            <span>·</span>
            <span className="mono">{invoice.invoiceRef}</span>
            <span>·</span>
            <span>Issued {formatDate(invoice.issuedAt)}</span>
            {invoice.expiresAt && isPending ? (
              <>
                <span>·</span>
                <span>Due {formatDate(invoice.expiresAt)}</span>
              </>
            ) : null}
            {isPaid && invoice.paidAt ? (
              <>
                <span>·</span>
                <span>Paid {formatDate(invoice.paidAt)}</span>
              </>
            ) : null}
          </div>

          <div style={{ marginTop: 14 }}>
            <KeyValueRow
              label="Deposit"
              value={formatRand(invoice.depositAmount)}
              size="sm"
            />
            {invoice.firstMonthRent != null ? (
              <KeyValueRow
                label="First month's rent"
                value={formatRand(invoice.firstMonthRent)}
                divider
                size="sm"
              />
            ) : null}
            <KeyValueRow
              label="Total"
              value={formatRand(invoice.totalAmount)}
              divider
              size="sm"
              tone="accent"
            />
          </div>
        </div>
        <div
          style={{
            padding: 20,
            borderLeft: "1px solid var(--hairline)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {isPending ? (
            <Button
              variant="accent"
              size="lg"
              leftIcon="cash"
              onClick={onPay}
              disabled={paying}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {paying ? "Processing…" : `Pay ${formatRand(invoice.totalAmount)}`}
            </Button>
          ) : isPaid ? (
            <Link to="/payment" style={{ textDecoration: "none" }}>
              <Button
                variant="secondary"
                size="sm"
                style={{ width: "100%", justifyContent: "center" }}
              >
                View receipt
              </Button>
            </Link>
          ) : null}
          <Link to="/my-apps" style={{ textDecoration: "none" }}>
            <Button
              variant="ghost"
              size="sm"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Back to applications
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
