import Photo from "@/components/Photo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";

export interface DepositItem {
  id: string;
  area: string;
  note: string;
  cost: number;
  agreed: boolean;
  photoLabels?: string[];
}

export interface DepositReturnChecklistProps {
  items: DepositItem[];
  onOpenDispute?: (id: string) => void;
}

export default function DepositReturnChecklist({
  items,
  onOpenDispute,
}: DepositReturnChecklistProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((it) => (
        <Card
          key={it.id}
          padding={0}
          style={{
            overflow: "hidden",
            borderColor: !it.agreed ? "var(--warn)" : "var(--hairline)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr auto" }}>
            <Photo
              ratio="auto"
              label={`${it.area.toLowerCase()}.jpg`}
              style={{ borderRadius: 0, height: "100%", minHeight: 130 }}
            />
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{it.area}</div>
                {it.agreed ? (
                  <Badge tone="success" leftIcon="check">
                    Agreed
                  </Badge>
                ) : (
                  <Badge tone="warn">Disputed</Badge>
                )}
              </div>
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 8 }}>{it.note}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {(it.photoLabels ?? ["", "", ""]).map((_, i) => (
                  <Photo
                    key={i}
                    ratio="1"
                    label=""
                    style={{ width: 36, height: 36, borderRadius: 4 }}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 8,
                borderLeft: "1px solid var(--hairline)",
                minWidth: 160,
              }}
            >
              <div className="tabular" style={{ fontSize: 18, fontWeight: 600 }}>
                R {it.cost.toLocaleString()}
              </div>
              {!it.agreed ? (
                <Button variant="ghost" size="sm" onClick={() => onOpenDispute?.(it.id)}>
                  Open dispute
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

