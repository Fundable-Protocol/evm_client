import {
  OFFRAMP_POLLING,
  OFFRAMP_TERMINAL_STATUSES,
  WALLET_REJECTION_PATTERNS,
} from "./offramp.constants";
import {
  OFFRAMP_MODES,
  type ManualOfframpOrder,
  type OfframpBank,
  type OfframpMode,
} from "../../types/offramp";

export function filterOfframpBanks(
  banks: OfframpBank[],
  query: string,
): OfframpBank[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return banks;

  return banks.filter((bank) =>
    bank.name.toLowerCase().includes(normalizedQuery),
  );
}

export function unwrapOfframpResponse<T>(payload: unknown): T {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "status" in payload &&
    "data" in payload
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export function calculateFiatFee(fee: number, rate: number): number {
  return Math.round(fee * rate * 100) / 100;
}

export function calculateFeeAdjustedRate(
  rate: number,
  feePercent: number,
): number {
  return Number((rate * (1 - feePercent / 100)).toFixed(6));
}

export function normalizeManualOfframpOrder(
  order: ManualOfframpOrder,
  grossAmount: number,
): ManualOfframpOrder {
  return {
    ...order,
    depositAmount: grossAmount,
  };
}

export function getOfframpBalanceState(
  mode: OfframpMode,
  tokenBalance: number | null,
  totalDebit: number | null,
) {
  if (
    mode === OFFRAMP_MODES.manual ||
    tokenBalance === null ||
    totalDebit === null
  ) {
    return {
      hasSufficientBalance: true,
      showInsufficientBalance: false,
    };
  }

  const hasSufficientBalance = tokenBalance >= totalDebit;

  return {
    hasSufficientBalance,
    showInsufficientBalance: !hasSufficientBalance,
  };
}

export function getPollingInterval(elapsedMs: number): number {
  return elapsedMs < OFFRAMP_POLLING.fastWindowMs
    ? OFFRAMP_POLLING.fastIntervalMs
    : OFFRAMP_POLLING.standardIntervalMs;
}

export function isTerminalOfframpStatus(status: string): boolean {
  return OFFRAMP_TERMINAL_STATUSES.includes(
    status.toLowerCase() as (typeof OFFRAMP_TERMINAL_STATUSES)[number],
  );
}

export function getRemainingSeconds(
  expiresAt: string | undefined | null,
  now = Date.now(),
): number {
  if (!expiresAt) return 0;

  return Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000));
}

export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function formatOfframpAmount(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
  }).format(value);
}

export function shortenAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export function isWalletRejection(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return WALLET_REJECTION_PATTERNS.some((pattern) => message.includes(pattern));
}
