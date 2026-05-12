import Photo from "@/components/Photo";
import Badge, { type BadgeTone } from "@/components/Badge";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";

export type PropertyListingState = "DRAFT" | "LISTED" | "UNLISTED";
export type PropertyListingSource = "LISTED_BY_OWNER" | "BY_AGENT";

export interface PropertyTableRowData {
  id: string;
  name: string;
  sub: string;
  units: number;
  occupancyPct: number;
  occupancyLabel: string;
  monthlyRent: string;
  apps: number;
  state?: PropertyListingState;
  source?: PropertyListingSource;
  agent?: string;
  mandate?: "Full management" | "Tenant find" | "Self-managed";
  payoutAccount?: string;
}

export interface PropertyTableProps {
  rows: PropertyTableRowData[];
  onOpen?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const HEADERS = ["Property", "State", "Source", "Mandate", "Occupancy", "Monthly", "Apps", ""];

const STATE_TONE: Record<PropertyListingState, BadgeTone> = {
  DRAFT: "warn",
  LISTED: "success",
  UNLISTED: "neutral",
};

export default function PropertyTable({ rows, onOpen, onEdit }: PropertyTableProps) {
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
        {rows.map((row) => {
          const state = row.state ?? "LISTED";
          const source = row.source ?? "LISTED_BY_OWNER";
          return (
            <tr key={row.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
              <td style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Photo ratio="auto" style={{ width: 40, height: 40, borderRadius: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{row.name}</div>
                    <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>
                      {row.sub} · {row.units} units
                      {row.payoutAccount ? (
                        <>
                          {" · "}
                          <span className="mono">→ {row.payoutAccount}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ padding: 16 }}>
                <Badge tone={STATE_TONE[state]}>{state}</Badge>
              </td>
              <td style={{ padding: 16 }}>
                {source === "BY_AGENT" ? (
                  <span style={{ fontSize: 12 }}>
                    <Badge tone="accent">Agent</Badge>{" "}
                    <span style={{ color: "var(--slate)" }}>{row.agent}</span>
                  </span>
                ) : (
                  <Badge tone="neutral">Owner</Badge>
                )}
              </td>
              <td style={{ padding: 16, fontSize: 12 }}>
                {row.mandate ? (
                  <span style={{ color: "var(--slate)" }}>{row.mandate}</span>
                ) : (
                  <span style={{ color: "var(--slate)" }}>—</span>
                )}
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
              <td style={{ padding: 16, textAlign: "right", whiteSpace: "nowrap" }}>
                <Button variant="ghost" size="sm" leftIcon="edit" onClick={() => onEdit?.(row.id)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" rightIcon="chevR" onClick={() => onOpen?.(row.id)}>
                  Open
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
