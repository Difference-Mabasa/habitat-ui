import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { scoreTone } from "@/lib/score";

export interface PipelineApplicant {
  id: string;
  name: string;
  unit: string;
  score: number;
  sub?: string;
}

export interface PipelineColumn {
  title: string;
  count: number;
  items: PipelineApplicant[];
}

export interface ApplicationPipelineProps {
  columns: PipelineColumn[];
  onOpenApplicant?: (id: string) => void;
}

export default function ApplicationPipeline({
  columns,
  onOpenApplicant,
}: ApplicationPipelineProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 16 }}>
      {columns.map((col) => (
        <Card
          key={col.title}
          padding={16}
          style={{ background: "var(--surface-2)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>{col.title}</span>
            <span
              style={{
                minWidth: 22,
                height: 22,
                padding: "0 8px",
                borderRadius: 999,
                background: "var(--surface)",
                border: "1px solid var(--hairline-strong)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
                display: "grid",
                placeItems: "center",
              }}
            >
              {col.count}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {col.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenApplicant?.(item.id)}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: "var(--ink)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                  <Badge tone={scoreTone(item.score)}>{item.score}</Badge>
                </div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>{item.unit}</div>
                {item.sub ? (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      marginTop: 6,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.sub}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
