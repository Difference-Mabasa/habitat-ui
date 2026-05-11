import ProgressBar, { type ProgressTone } from "./ProgressBar";

export interface ScoreBreakdownItem {
  label: string;
  value: number;
  max?: number;
  /** Tone override; otherwise derived from value/max. */
  tone?: ProgressTone;
  sub?: string;
}

export interface ScoreBreakdownProps {
  items: ScoreBreakdownItem[];
  columns?: number;
}

/**
 * Category-level score thresholds — more lenient than the overall scoreTone
 * helper in lib/score (which is for headline applicant scores).
 */
function defaultTone(value: number, max: number): ProgressTone {
  const pct = (value / max) * 100;
  if (pct >= 85) return "success";
  if (pct >= 70) return "accent";
  return "warn";
}

export default function ScoreBreakdown({ items, columns }: ScoreBreakdownProps) {
  const cols = columns ?? items.length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
      {items.map((item) => {
        const max = item.max ?? 100;
        const tone = item.tone ?? defaultTone(item.value, max);
        return (
          <div key={item.label}>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 6 }}>{item.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
              <span className="tabular" style={{ fontSize: 18, fontWeight: 600 }}>{item.value}</span>
              <span style={{ fontSize: 11, color: "var(--slate)" }}>/ {max}</span>
            </div>
            <div style={{ marginBottom: 6 }}>
              <ProgressBar value={item.value} max={max} tone={tone} />
            </div>
            {item.sub ? (
              <div style={{ fontSize: 11, color: "var(--slate)" }}>{item.sub}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
