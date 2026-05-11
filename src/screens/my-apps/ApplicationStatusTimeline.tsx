import { Fragment } from "react";
import Icon from "@/components/Icon";

export type TimelineStage = "Submitted" | "Vetting" | "Approved" | "Lease";

export interface ApplicationStatusTimelineProps {
  /** Index of current stage in STAGES. 0=Submitted, 3=Lease. */
  stage: number;
  declined?: boolean;
  stages?: TimelineStage[];
}

const DEFAULT_STAGES: TimelineStage[] = ["Submitted", "Vetting", "Approved", "Lease"];

export default function ApplicationStatusTimeline({
  stage,
  declined = false,
  stages = DEFAULT_STAGES,
}: ApplicationStatusTimelineProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {stages.map((label, i) => {
        const done = stage > i;
        const active = stage === i && !declined;
        const dotBg = declined
          ? "var(--surface-3)"
          : done
            ? "var(--success)"
            : active
              ? "var(--accent)"
              : "var(--surface-3)";
        return (
          <Fragment key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: dotBg,
                  border: active ? "3px solid color-mix(in oklch, var(--accent) 25%, transparent)" : "none",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--paper)",
                }}
              >
                {done ? <Icon name="check" size={10} /> : null}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: active ? "var(--ink)" : "var(--slate)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
            {i < stages.length - 1 ? (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: done ? "var(--success)" : "var(--hairline)",
                }}
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
