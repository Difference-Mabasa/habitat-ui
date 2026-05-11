import type { BadgeTone } from "@/components/Badge";

/**
 * Score-to-tone mapping repeated across landlord pipeline + applicant detail.
 * Convergence rule from component-audit.md: don't reinvent this per screen.
 */
export function scoreTone(score: number): BadgeTone {
  if (score >= 90) return "success";
  if (score >= 75) return "accent";
  return "warn";
}
