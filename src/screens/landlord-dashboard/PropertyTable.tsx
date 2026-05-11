import Photo from "@/components/Photo";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";

export interface PropertyTableRowData {
  id: string;
  name: string;
  sub: string;
  units: number;
  occupancyPct: number;
  occupancyLabel: string;
  monthlyRent: string;
  apps: number;
}

export interface PropertyTableProps {
  rows: PropertyTableRowData[];
  onOpen?: (id: string) => void;
}

const HEADERS = ["Property", "Units", "Occupancy", "Monthly", "Apps", ""];

export default function PropertyTable({ rows, onOpen }: PropertyTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "var(--surface-2)" }}>
          {HEADERS.map((h) => (
            <th
              key={h}
              style={{
                padding: "10px 16px",
                textAlign: "left",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--slate)",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
            <td style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Photo ratio="auto" style={{ width: 40, height: 40, borderRadius: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{row.name}</div>
                  <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{row.sub}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: 16, fontSize: 13 }} className="tabular">
              {row.units}
            </td>
            <td style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ProgressBar
                  value={row.occupancyPct}
                  tone={row.occupancyPct === 100 ? "success" : "accent"}
                  width={60}
                />
                <span className="tabular" style={{ fontSize: 12, color: "var(--slate)" }}>
                  {row.occupancyLabel}
                </span>
              </div>
            </td>
            <td style={{ padding: 16, fontSize: 13, fontWeight: 600 }} className="tabular">
              {row.monthlyRent}
            </td>
            <td style={{ padding: 16 }}>
              {row.apps > 0 ? (
                <Badge tone="accent">{row.apps} new</Badge>
              ) : (
                <span style={{ fontSize: 12, color: "var(--slate)" }}>—</span>
              )}
            </td>
            <td style={{ padding: 16, textAlign: "right" }}>
              <Button variant="ghost" size="sm" rightIcon="chevR" onClick={() => onOpen?.(row.id)}>
                Open
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
