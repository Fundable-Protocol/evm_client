export const OFFRAMP_MODES = {
  connected: "connected",
  manual: "manual",
} as const;

export type OfframpMode =
  (typeof OFFRAMP_MODES)[keyof typeof OFFRAMP_MODES];

export const OFFRAMP_PUBLIC_STAGES = {
  awaitingDeposit: "awaiting_deposit",
  depositConfirmed: "deposit_confirmed",
  bankPayout: "bank_payout",
  completed: "completed",
  refundProcessing: "refund_processing",
  refunded: "refunded",
  expired: "expired",
} as const;

export type OfframpPublicStage =
  (typeof OFFRAMP_PUBLIC_STAGES)[keyof typeof OFFRAMP_PUBLIC_STAGES];

export interface OfframpAsset {
  symbol: string;
  network: string;
  chainId: number;
  contractAddress: `0x${string}`;
  decimals: number;
}

export interface OfframpCountry {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export interface OfframpBank {
  code: string;
  name: string;
}

export interface OfframpAccount {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName?: string;
}

export interface OfframpRate {
  rate: number;
  token: string;
  fee: number;
  network: string;
  currency: string;
  cryptoAmount: number;
  providerId: string;
  displayName: string;
  fiatAmount: number;
  providerIds?: string[];
  orderType?: string;
  refundTimeoutMinutes?: number;
  feeCurrency?: string;
  providerFee?: number;
  providerFeeCurrency?: string;
  fundableFeePercent?: number;
  totalDebit: number;
  quoteReference?: string;
}

export interface AggregatedOfframpRates {
  best: OfframpRate | null;
  all: OfframpRate[];
  errors: Array<{ providerId: string; code: string }>;
  timestamp?: string;
}

export interface OfframpRateParams {
  token: string;
  tokenAddress: string;
  amount: number;
  country: string;
  currency: string;
  network: string;
}

export interface VerifyOfframpAccountParams {
  accountNumber: string;
  bankCode: string;
  country: string;
  currency: string;
  providerId: "paycrest";
}

export interface CreateOfframpParams extends OfframpRateParams {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  email?: string;
}

export interface OfframpOrder {
  transactionReference: string;
  status: string;
  depositAddress: `0x${string}`;
  depositAmount: number;
  depositToken: string;
  depositNetwork: string;
  fiatAmount: number;
  currency: string;
  expiresAt?: string;
}

export interface ManualOfframpOrder extends OfframpOrder {
  accessToken: string;
}

export interface OfframpPublicStatus {
  transactionReference: string;
  status: string;
  stage: OfframpPublicStage;
  expiresAt: string | null;
}

export interface StoredManualOfframp {
  order: ManualOfframpOrder;
  savedAt: number;
}
