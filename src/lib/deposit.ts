import type { DepositItem } from "@/screens/deposit/DepositReturnChecklist";

/**
 * Total deductions across deposit-return items.
 */
export function totalDeductions(items: DepositItem[]): number {
  return items.reduce((sum, item) => sum + item.cost, 0);
}
