import type { ApplicationStatus } from "./api/applications";

/**
 * Canonical 6-step view of the application process, shared across
 * every screen in the flow (Apply → Documents → MyApplications →
 * Invoices → Lease → Move-in). Mirrors the lifecycle the API
 * documents on ApplicationStatus.
 */
export const APPLICATION_STEPS = [
  "Submit",
  "Documents",
  "Review",
  "Pay deposit",
  "Sign lease",
  "Move in",
] as const;

export type ApplicationStep = (typeof APPLICATION_STEPS)[number];

/** Step index for the screen the user is currently on. */
export const STEP_INDEX: Record<ApplicationStep, number> = {
  Submit: 0,
  Documents: 1,
  Review: 2,
  "Pay deposit": 3,
  "Sign lease": 4,
  "Move in": 5,
};

/**
 * Maps an {@link ApplicationStatus} from the API to the step it puts
 * the application *on*. Used by MyApplications to render each card's
 * progress. Terminal off-ramps (REJECTED / WITHDRAWN / EXPIRED) return
 * the review step — the caller passes a `declined` flag separately to
 * dim the rest of the path.
 */
export function statusToStep(status: ApplicationStatus): number {
  switch (status) {
    case "SUBMITTED":
      return STEP_INDEX.Review;
    case "AWAITING_DOCUMENTS":
      return STEP_INDEX.Documents;
    case "DOCUMENTS_SUBMITTED":
    case "UNDER_REVIEW":
    case "ON_HOLD":
      return STEP_INDEX.Review;
    case "APPROVED":
    case "INVOICE_SENT":
      return STEP_INDEX["Pay deposit"];
    case "DEPOSIT_PAID":
    case "LEASE_GENERATED":
    case "LEASE_PENDING_SIGNATURES":
      return STEP_INDEX["Sign lease"];
    case "COMPLETED":
      return STEP_INDEX["Move in"];
    case "REJECTED":
    case "WITHDRAWN":
    case "EXPIRED":
    default:
      return STEP_INDEX.Review;
  }
}

export function isDeclinedStatus(status: ApplicationStatus): boolean {
  return status === "REJECTED" || status === "WITHDRAWN" || status === "EXPIRED";
}

export function isCompleteStatus(status: ApplicationStatus): boolean {
  return status === "COMPLETED";
}
