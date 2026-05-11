import { Fragment, type ReactNode } from "react";
import Photo from "@/components/Photo";
import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export interface CompareProperty {
  id: string;
  name: string;
  price: number;
  beds: number;
  baths: number;
  sqm: number;
  distance: string;
  solar: boolean;
  petFriendly: boolean;
  parking: boolean;
  fibre: boolean;
  score: number;
}

interface ComparisonRow {
  label: string;
  /** Value renderer. */
  value: (p: CompareProperty) => ReactNode;
  /** Boolean rows use the check/x display. */
  bool?: boolean;
  /** Highlight predicate — true for the "best" cell in this row. */
  highlight?: (p: CompareProperty) => boolean;
}

export interface ComparisonTableProps {
  properties: CompareProperty[];
  onRemove?: (id: string) => void;
  onApply?: (id: string) => void;
  onBook?: (id: string) => void;
}

export default function ComparisonTable({
  properties,
  onRemove,
  onApply,
  onBook,
}: ComparisonTableProps) {
  const prices = properties.map((p) => p.price);
  const sizes = properties.map((p) => p.sqm);
  const cheapest = Math.min(...prices);
  const biggest = Math.max(...sizes);

  const rows: ComparisonRow[] = [
    { label: "Monthly rent", value: (p) => `R ${p.price.toLocaleString()}`, highlight: (p) => p.price === cheapest },
    { label: "Bedrooms", value: (p) => p.beds },
    { label: "Bathrooms", value: (p) => p.baths },
    { label: "Size", value: (p) => `${p.sqm} m²`, highlight: (p) => p.sqm === biggest },
    { label: "From your work", value: (p) => p.distance, highlight: (p) => p.distance === "0.4km" },
    { label: "Solar / backup", value: (p) => p.solar, bool: true },
    { label: "Pet-friendly", value: (p) => p.petFriendly, bool: true },
    { label: "Parking", value: (p) => p.parking, bool: true },
    { label: "Fibre installed", value: (p) => p.fibre, bool: true },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `200px repeat(${properties.length}, 1fr)`,
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      {/* Header row */}
      <div style={{ padding: 20, borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }} />
      {properties.map((p) => (
        <div
          key={p.id}
          style={{
            padding: 20,
            borderBottom: "1px solid var(--hairline)",
            borderLeft: "1px solid var(--hairline)",
            background: "var(--surface-2)",
          }}
        >
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Photo ratio="16/10" label="" style={{ borderRadius: 8 }} />
            <span style={{ position: "absolute", top: 8, left: 8 }}>
              <Badge tone="accent">Score {p.score}</Badge>
            </span>
            <IconButton
              icon="x"
              label={`Remove ${p.name}`}
              size="sm"
              variant="secondary"
              style={{ position: "absolute", top: 8, right: 8, background: "var(--paper)" }}
              onClick={() => onRemove?.(p.id)}
            />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
        </div>
      ))}

      {/* Data rows */}
      {rows.map((row) => (
        <Fragment key={row.label}>
          <div
            className="mono"
            style={{
              padding: "14px 20px",
              fontSize: 12,
              color: "var(--slate)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              borderBottom: "1px solid var(--hairline)",
              background: "var(--surface-2)",
            }}
          >
            {row.label}
          </div>
          {properties.map((p) => {
            const v = row.value(p);
            const highlighted = row.highlight ? row.highlight(p) : false;
            return (
              <div
                key={p.id}
                className={row.label === "Monthly rent" ? "tabular" : ""}
                style={{
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: highlighted ? 600 : 500,
                  color: highlighted ? "var(--success)" : "var(--ink)",
                  borderBottom: "1px solid var(--hairline)",
                  borderLeft: "1px solid var(--hairline)",
                  background: highlighted
                    ? "color-mix(in oklch, var(--success) 5%, var(--surface))"
                    : "var(--surface)",
                }}
              >
                {row.bool ? (
                  v ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Icon name="check" size={14} style={{ color: "var(--success)" }} />
                      Yes
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--slate)",
                      }}
                    >
                      <Icon name="x" size={14} />
                      No
                    </span>
                  )
                ) : (
                  v
                )}
              </div>
            );
          })}
        </Fragment>
      ))}

      {/* Action row */}
      <div style={{ padding: 20, background: "var(--surface-2)" }} />
      {properties.map((p) => (
        <div
          key={p.id}
          style={{
            padding: 20,
            borderLeft: "1px solid var(--hairline)",
            background: "var(--surface-2)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <Button
            variant="accent"
            size="sm"
            style={{ justifyContent: "center" }}
            onClick={() => onApply?.(p.id)}
          >
            Apply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            style={{ justifyContent: "center" }}
            onClick={() => onBook?.(p.id)}
          >
            Book viewing
          </Button>
        </div>
      ))}
    </div>
  );
}
