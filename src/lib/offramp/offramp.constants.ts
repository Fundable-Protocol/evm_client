export const PAYCREST_PROVIDER_ID = "paycrest" as const;

export const OFFRAMP_CHAIN_NAMES = {
  1: "Ethereum",
  56: "BNB Smart Chain",
  137: "Polygon",
  1135: "Lisk",
  8453: "Base",
  42161: "Arbitrum One",
} as const;

export const OFFRAMP_TERMINAL_STATUSES = [
  "completed",
  "failed",
  "expired",
] as const;

export const OFFRAMP_POLLING = {
  fastWindowMs: 15_000,
  fastIntervalMs: 1_000,
  standardIntervalMs: 3_000,
  rateDebounceMs: 500,
  accountDebounceMs: 600,
} as const;

export const OFFRAMP_VALIDATION = {
  accountNumberLength: 10,
  minimumAmount: 0,
} as const;

export const OFFRAMP_STORAGE_KEYS = {
  manualOrder: "fundable:paycrest-manual-order",
} as const;

export const OFFRAMP_MESSAGES = {
  unavailable: "Offramp is temporarily unavailable. Please try again shortly.",
  assetsUnavailable:
    "Supported tokens are unavailable right now. Please try again shortly.",
  ratesUnavailable: "A live rate is unavailable. Adjust the amount and try again.",
  banksUnavailable: "Banks could not be loaded. Please try again.",
  accountUnavailable:
    "This account could not be verified. Check the details and try again.",
  orderUnavailable:
    "The transfer could not be started. No funds have been moved. Please try again.",
  statusUnavailable:
    "The latest transfer status is temporarily unavailable. We will keep checking.",
  unsupportedNetwork:
    "This wallet network is not available for offramp. Switch to a supported network.",
  insufficientBalance:
    "Your token balance is not enough for this transfer. Reduce the amount or add funds.",
  walletRejected:
    "The token transfer was not approved. You can retry while this order is active.",
  transferFailed:
    "The token transfer could not be completed. Check your wallet and try again.",
} as const;

export const OFFRAMP_BANK_SELECTOR_COPY = {
  loading: "Loading banks",
  placeholder: "Select bank",
  searchPlaceholder: "Search banks",
  empty: "No banks found",
} as const;

export const WALLET_REJECTION_PATTERNS = [
  "user rejected",
  "user denied",
  "rejected the request",
] as const;

export const ERC20_OFFRAMP_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
