/**
 * Tiered Offramp Fee Calculation
 *
 * Fee is added on top of the user's offramp amount and sent together
 * to Cashwyre's deposit address. Fundable keeps the fee portion.
 *
 * Ported from stellar_client/apps/web/src/utils/offramp-fee.ts
 */

export const FEE_TIERS = [
  { maxAmount: 500, feePercent: 1.0 },
  { maxAmount: 5_000, feePercent: 0.75 },
  { maxAmount: 25_000, feePercent: 0.5 },
  { maxAmount: Infinity, feePercent: 0.25 },
] as const;

export interface OfframpFeeResult {
  /** The fee percentage applied */
  feePercent: number;
  /** The fee amount in USDC/USDT */
  feeAmount: number;
  /** Total amount debited from user's wallet (amount + fee) */
  totalDebit: number;
}

/**
 * Calculate the Fundable platform fee for an offramp transaction.
 * @param amount The crypto amount the user wants to offramp
 * @returns Fee breakdown with percentage, fee amount, and total debit
 */
export function calculateOfframpFee(amount: number): OfframpFeeResult {
  if (amount <= 0) {
    return { feePercent: 0, feeAmount: 0, totalDebit: 0 };
  }

  const tier = FEE_TIERS.find((t) => amount <= t.maxAmount) ?? FEE_TIERS[FEE_TIERS.length - 1];
  const feePercent = tier.feePercent;
  const feeAmount = parseFloat((amount * (feePercent / 100)).toFixed(6));
  const totalDebit = parseFloat((amount + feeAmount).toFixed(6));

  return { feePercent, feeAmount, totalDebit };
}
