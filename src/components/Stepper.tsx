import type { ReactNode } from "react";
import Icon from "./Icon";

export type StepState = "done" | "active" | "todo";

export interface StepperStep {
  id?: string;
  label: string;
  detail?: string;
  state?: StepState;
}

export interface StepperProps {
  orientation?: "vertical" | "horizontal";
  steps: StepperStep[];
  currentStep?: number;
  onStepClick?: (index: number) => void;
  aside?: ReactNode;
}

function stateOf(step: StepperStep, index: number, currentStep: number): StepState {
  if (step.state) return step.state;
  if (index < currentStep) return "done";
  if (index === currentStep) return "active";
  return "todo";
}

function stateColors(state: StepState): { bg: string; color: string; ring: string } {
  if (state === "done") return { bg: "var(--success)", color: "#fff", ring: "var(--success)" };
  if (state === "active") return { bg: "var(--ink)", color: "var(--paper)", ring: "var(--ink)" };
  return { bg: "var(--surface)", color: "var(--slate)", ring: "var(--hairline-strong)" };
}

export default function Stepper({
  orientation = "vertical",
  steps,
  currentStep = 0,
  onStepClick,
  aside,
}: StepperProps) {
  if (orientation === "horizontal") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {steps.map((step, i) => {
          const state = stateOf(step, i, currentStep);
          const colors = stateColors(state);
          const last = i === steps.length - 1;
          return (
            <div key={step.id ?? step.label} style={{ display: "flex", alignItems: "center", flex: last ? "0 0 auto" : 1, gap: 8 }}>
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                disabled={!onStepClick}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  border: 0,
                  cursor: onStepClick ? "pointer" : "default",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.ring}`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {state === "done" ? <Icon name="check" size={13} /> : i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: state === "active" ? 600 : 500, color: state === "todo" ? "var(--slate)" : "var(--ink)" }}>
                  {step.label}
                </span>
              </button>
              {!last ? (
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: state === "done" ? "var(--success)" : "var(--hairline)",
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {steps.map((step, i) => {
          const state = stateOf(step, i, currentStep);
          const colors = stateColors(state);
          return (
            <li key={step.id ?? step.label}>
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                disabled={!onStepClick}
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 12,
                  padding: "10px 8px",
                  alignItems: "center",
                  background: state === "active" ? "var(--surface-2)" : "transparent",
                  border: 0,
                  borderRadius: 8,
                  cursor: onStepClick ? "pointer" : "default",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: colors.bg,
                    color: colors.color,
                    border: `1px solid ${colors.ring}`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {state === "done" ? <Icon name="check" size={14} /> : i + 1}
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: state === "active" ? 600 : 500, color: state === "todo" ? "var(--slate)" : "var(--ink)" }}>
                    {step.label}
                  </span>
                  {step.detail ? (
                    <span style={{ fontSize: 11, color: "var(--slate)" }}>{step.detail}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {aside}
    </div>
  );
}
