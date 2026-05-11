import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

export type AgencyStatus = "Let" | "Vacant" | "Listing";

export interface AgencyRow {
  id: string;
  property: string;
  landlord: string;
  rent: number;
  status: AgencyStatus;
  vacantSince?: string;
  paid: boolean | null;
  daysLate?: number;
  maintenance: number;
  apps30d: number;
}

export interface AgencyTableProps {
  rows: AgencyRow[];
  onOpen?: (id: string) => void;
}

const HEADERS = ["", "Property", "Owner", "Rent", "Status", "Apr rent", "Apps · 30d", "Maint.", ""];

export default function AgencyTable({ rows, onOpen }: AgencyTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "var(--surface-2)" }}>
          {HEADERS.map((h, i) => (
            <th
              key={i}
              style={{
                textAlign: "left",
                padding: "10px 16px",
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
            <td style={{ padding: "12px 16px", width: 36 }}>
              <Checkbox aria-label={`Select ${r.property}`} />
            </td>
            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{r.property}</td>
            <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--slate)" }}>{r.landlord}</td>
            <td style={{ padding: "12px 16px", fontSize: 13 }} className="tabular">
              R {r.rent.toLocaleString()}
            </td>
            <td style={{ padding: "12px 16px" }}>
              {r.status === "Let" ? (
                <Badge tone="success">Let</Badge>
              ) : r.status === "Vacant" ? (
                <Badge tone="warn">Vacant {r.vacantSince}</Badge>
              ) : (
                <Badge tone="accent">Listing</Badge>
              )}
            </td>
            <td style={{ padding: "12px 16px", fontSize: 13 }} className="tabular">
              {r.paid === true ? (
                <span style={{ color: "var(--success)" }}>✓ Paid</span>
              ) : r.paid === false ? (
                <span style={{ color: "var(--warn)", fontWeight: 600 }}>{r.daysLate}d late</span>
              ) : (
                <span style={{ color: "var(--slate)" }}>—</span>
              )}
            </td>
            <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--slate)" }} className="tabular">
              {r.apps30d}
            </td>
            <td style={{ padding: "12px 16px" }}>
              {r.maintenance > 0 ? (
                <Badge tone="neutral">{r.maintenance} open</Badge>
              ) : (
                <span style={{ fontSize: 12, color: "var(--slate)" }}>—</span>
              )}
            </td>
            <td style={{ padding: "12px 16px", textAlign: "right" }}>
              <Button variant="ghost" size="sm" rightIcon="chevR" onClick={() => onOpen?.(r.id)}>
                Open
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
