import { Fragment } from "react";
import Icon from "@/components/Icon";
import { CARD_MILESTONES } from "@/lib/applicationSteps";

export interface ApplicationStatusTimelineProps {
  /** Index of current stage in {@link stages}. */
  stage: number;
  declined?: boolean;
  /** Defaults to the 4-stage milestone view from the design handoff. */
  stages?: readonly string[];
}

export default function ApplicationStatusTimeline({
  stage,
  declined = false,
  stages = CARD_MILESTONES,
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
