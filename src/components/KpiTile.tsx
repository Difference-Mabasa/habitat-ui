import type { ReactNode } from "react";
import Card from "./Card";
import Badge, { type BadgeTone } from "./Badge";

export interface KpiTileProps {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: BadgeTone;
  subText?: ReactNode;
  /** Tiny sparkline trace (8 points fits nicely). */
  spark?: number[];
  sparkTone?: "success" | "accent" | "warn" | "danger";
}

const SPARK_TONE_COLOR = {
  success: "var(--success)",
  accent: "var(--accent)",
  warn: "var(--warn)",
  danger: "var(--danger)",
};

function Spark({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const w = 60;
  const h = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - 2 - ((v - min) / span) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
      <polyline points={points} stroke={color} strokeWidth={1.5} fill="none" />
    </svg>
  );
}

export default function KpiTile({
  label,
  value,
  delta,
  deltaTone = "neutral",
  subText,
  spark,
  sparkTone = "success",
}: KpiTileProps) {
  return (
    <Card padding={20}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--slate)" }}>{label}</span>
        {spark ? <Spark data={spark} color={SPARK_TONE_COLOR[sparkTone]} /> : null}
      </div>
      <div
        className="tabular"
        style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {value}
      </div>
      {(delta || subText) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          {delta ? <Badge tone={deltaTone}>{delta}</Badge> : null}
          {subText ? (
            <span style={{ fontSize: 12, color: "var(--slate)" }}>{subText}</span>
          ) : null}
        </div>
      )}
    </Card>
  );
}
