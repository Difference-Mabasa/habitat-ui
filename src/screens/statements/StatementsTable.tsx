import Badge from "@/components/Badge";
import Button from "@/components/Button";

export interface StatementRow {
  id: string;
  period: string;
  collected: number;
  fees: number;
  payout: number;
  settled: string;
  status: "Paid" | "Pending";
}

export interface StatementsTableProps {
  rows: StatementRow[];
  feeRateLabel?: string;
  onDownload?: (id: string) => void;
}

export default function StatementsTable({
  rows,
  feeRateLabel = "Fees (0.8%)",
  onDownload,
}: StatementsTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "var(--surface-2)" }}>
          {["Period", "Collected", feeRateLabel, "Net payout", "Settled", "Status", ""].map((h) => (
            <th
              key={h}
              style={{
                textAlign: "left",
                padding: "10px 24px",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--slate)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
            <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 500 }}>{r.period}</td>
            <td style={{ padding: "14px 24px", fontSize: 13 }} className="tabular">
              R {r.collected.toLocaleString()}
            </td>
            <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--slate)" }} className="tabular">
              −R {r.fees}
            </td>
            <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 600 }} className="tabular">
              R {r.payout.toLocaleString()}
            </td>
            <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--slate)" }}>{r.settled}</td>
            <td style={{ padding: "14px 24px" }}>
              {r.status === "Paid" ? (
                <Badge tone="success">Paid</Badge>
              ) : (
                <Badge tone="accent">Pending</Badge>
              )}
            </td>
            <td style={{ padding: "14px 24px", textAlign: "right" }}>
              <Button variant="ghost" size="sm" leftIcon="download" onClick={() => onDownload?.(r.id)}>
                Statement
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
