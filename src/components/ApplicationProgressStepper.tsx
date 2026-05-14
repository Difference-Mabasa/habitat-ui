import Card from "./Card";
import Stepper, { type StepperStep } from "./Stepper";
import { APPLICATION_STEPS } from "@/lib/applicationSteps";

export interface ApplicationProgressStepperProps {
  /**
   * Index of the step the user is on right now. Steps before are
   * rendered as "done", steps after as "todo".
   */
  currentStep: number;
  /** When true, every step is marked done (terminal "you've arrived" state). */
  complete?: boolean;
  /** When true, dims the path past `currentStep` and marks current as declined. */
  declined?: boolean;
}

/**
 * Top-of-screen progress banner shared across every screen in the
 * application flow (Apply, Upload Documents, Invoices, Lease,
 * Move-in). Tells the tenant exactly where they are in the 6-step
 * process so the journey doesn't feel like a series of disconnected
 * pages.
 */
export default function ApplicationProgressStepper({
  currentStep,
  complete = false,
  declined = false,
}: ApplicationProgressStepperProps) {
  const steps: StepperStep[] = APPLICATION_STEPS.map((label, i) => {
    if (complete) return { label, state: "done" as const };
    if (declined && i === currentStep) return { label, state: "active" as const };
    if (declined && i > currentStep) return { label, state: "todo" as const };
    return { label };
  });

  return (
    <Card padding="14px 18px" style={{ marginBottom: 16 }}>
      <Stepper
        orientation="horizontal"
        steps={steps}
        currentStep={complete ? steps.length : currentStep}
      />
    </Card>
  );
}
