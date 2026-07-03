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

/**
 * Given a wallet balance, calculate the maximum offramp amount such that
 * amount + fee(amount) <= balance.
 *
 * Since fee = amount × (feePercent / 100), we solve:
 *   amount × (1 + feePercent / 100) = balance
 *   amount = balance / (1 + feePercent / 100)
 *
 * The tier is determined by the resulting amount, so we iterate tiers
 * until we find the one the computed amount falls into.
 *
 * @param balance The user's full token balance
 * @param decimals Token decimals (default 6 for USDC/USDT)
 * @returns The maximum amount the user can enter for offramp
 */
export function calculateMaxOfframpAmount(balance: number, decimals = 6): number {
  if (balance <= 0) return 0;

  const factor = Math.pow(10, decimals);

  for (let i = 0; i < FEE_TIERS.length; i++) {
    const tier = FEE_TIERS[i];
    const amount = balance / (1 + tier.feePercent / 100);
    // Floor to token decimals to ensure totalDebit never exceeds balance
    const floored = Math.floor(amount * factor) / factor;

    // Verify this amount actually falls within this tier's range
    const prevMax = i > 0 ? FEE_TIERS[i - 1].maxAmount : 0;
    if (floored <= tier.maxAmount && (i === 0 || floored > prevMax)) {
      return floored;
    }
  }

  // Fallback: use the last tier
  const lastTier = FEE_TIERS[FEE_TIERS.length - 1];
  return Math.floor((balance / (1 + lastTier.feePercent / 100)) * factor) / factor;
}
