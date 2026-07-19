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
  publicStatus?: OfframpPublicStatus;
}

// ---------------------------------------------------------------------------
// Form & UI types
// ---------------------------------------------------------------------------

export interface OfframpFormState {
  token: string;
  amount: string;
  country: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export type OfframpToken = string;

export interface OfframpTokenInfo {
  symbol: string;
  name: string;
}

// ---------------------------------------------------------------------------
// Cashwyre quote / confirm response types
// ---------------------------------------------------------------------------

export interface OfframpQuoteData {
  transactionReference: string;
  totalDepositInCryptoAsset: number;
  payoutAmountInLocalCurrency: number;
  cryptoRate: number;
  rateCurrency: string;
  currency: string;
  feeType: string;
  expireInMinutes: number;
  depositAddress: string;
  cryptoAssetAddress: string;
  expireOn?: string;
  amountInCryptoAsset?: number;
  amountInLocalCurrency?: number;
  [key: string]: unknown;
}

export interface OfframpQuoteRequest {
  token: string;
  amount: number;
  country: string;
  currency: string;
  network: string;
}

export interface OfframpQuoteResponse {
  success: boolean;
  data?: OfframpQuoteData;
  error?: string;
}

export interface OfframpConfirmResponse {
  success: boolean;
  data?: {
    depositAddress: string;
    depositAmount: number;
    depositToken: string;
    transactionId: string;
    [key: string]: unknown;
  };
  error?: string;
}

export type PayoutStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "failed"
  | "expired";

// ---------------------------------------------------------------------------
// Bank types
// ---------------------------------------------------------------------------

export interface Bank {
  code: string;
  name: string;
}

export interface BankListResponse {
  success: boolean;
  data?: Bank[];
  error?: string;
}

export interface VerifyBankAccountResponse {
  success: boolean;
  data?: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    [key: string]: unknown;
  };
  error?: string;
}

export interface RateInfoResponse {
  success: boolean;
  data?: {
    rate: number;
    [key: string]: unknown;
  };
  error?: string;
}

// ---------------------------------------------------------------------------
// Locked quote (used during confirmation flow)
// ---------------------------------------------------------------------------

export interface LockedQuote {
  transactionReference: string;
  inputSnapshot: OfframpFormState;
  quoteData: OfframpQuoteData;
  network: string;
  lockedAt: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SUPPORTED_COUNTRIES: OfframpCountry[] = [
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", currency: "GHS", flag: "🇬🇭" },
  { code: "KE", name: "Kenya", currency: "KES", flag: "🇰🇪" },
];

export const SUPPORTED_OFFRAMP_TOKENS: OfframpTokenInfo[] = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "USDT", name: "Tether" },
];

export const TOKEN_CONTRACTS: Record<string, Record<string, string>> = {
  "137": {
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  },
  "56": {
    USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    USDT: "0x55d398326f99059fF775485246999027B3197955",
  },
};

export const OFFRAMP_CHAIN_IDS: number[] = [137, 56];
