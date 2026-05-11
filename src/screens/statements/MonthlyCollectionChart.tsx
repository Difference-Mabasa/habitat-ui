export interface MonthBar {
  label: string;
  collected: number;
  expected?: number;
}

export interface MonthlyCollectionChartProps {
  months: MonthBar[];
  /** Y-axis upper bound (in same units as values). */
  max: number;
  height?: number;
}

export default function MonthlyCollectionChart({
  months,
  max,
  height = 180,
}: MonthlyCollectionChartProps) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${months.length}, 1fr)`,
          gap: 8,
          alignItems: "end",
          height,
        }}
      >
        {months.map((m) => {
          const collectedH = (m.collected / max) * 100;
          const expectedH = m.expected != null ? (m.expected / max) * 100 : null;
          return (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ height: height - 20, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                {expectedH != null ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: `${expectedH}%`,
                      background: "var(--surface-3)",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: `${collectedH}%`,
                    background: "var(--accent)",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--slate)" }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
