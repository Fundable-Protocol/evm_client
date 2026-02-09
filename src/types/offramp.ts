// Types for Cashwyre Offramp Integration

// Supported countries for offramp
export type OfframpCountry = "NG" | "GH" | "KE";
export type OfframpCurrency = "NGN" | "GHS" | "KES";

export interface CountryInfo {
    code: OfframpCountry;
    name: string;
    currency: OfframpCurrency;
    flag: string;
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
    { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
    { code: "GH", name: "Ghana", currency: "GHS", flag: "🇬🇭" },
    { code: "KE", name: "Kenya", currency: "KES", flag: "🇰🇪" },
];

// Supported crypto tokens for offramp
export type OfframpToken = "USDC" | "USDT";

export interface TokenInfo {
    symbol: OfframpToken;
    name: string;
    icon: string;
    decimals: number;
}

export const SUPPORTED_OFFRAMP_TOKENS: TokenInfo[] = [
    { symbol: "USDC", name: "USD Coin", icon: "/svgs/tokens/usdc.svg", decimals: 6 },
    { symbol: "USDT", name: "Tether", icon: "/svgs/tokens/usdt.svg", decimals: 6 },
];

// Bank information
export interface Bank {
    code: string;
    name: string;
}

export interface BankAccount {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
}

// API Request/Response types
export interface OfframpQuoteRequest {
    token: OfframpToken;
    amount: number;
    country: OfframpCountry;
    currency: OfframpCurrency;
    network?: string; // e.g., "binance_smart_chain", "ethereum"
    bankCode?: string;
    accountNumber?: string;
}

export interface OfframpQuoteData {
    reference: string;
    transactionReference: string;
    cryptoAsset: string;
    amountInCryptoAsset: number;
    currency: OfframpCurrency;
    amountInLocalCurrency: number;
    payoutAmountInLocalCurrency: number;
    totalDepositInCryptoAsset: number;
    cryptoRate: number;
    rateCurrency: string;
    feeType: string;
    expireOn: string;
    expireInMinutes: number;
    country: OfframpCountry;
}

export interface OfframpQuoteResponse {
    success: boolean;
    data?: OfframpQuoteData;
    error?: string;
}

export interface OfframpConfirmRequest {
    quoteId: string;
}

export interface OfframpConfirmResponse {
    success: boolean;
    data?: {
        transactionId: string;
        status: "pending" | "processing" | "completed" | "failed";
        depositAddress: string;
        depositAmount: string;
        depositToken: OfframpToken;
        expiresAt: string;
    };
    error?: string;
}

export interface BankListResponse {
    success: boolean;
    data?: Bank[];
    error?: string;
}

export interface VerifyBankAccountRequest {
    bankCode: string;
    accountNumber: string;
}

export interface VerifyBankAccountResponse {
    success: boolean;
    data?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
    };
    error?: string;
}

// Rate information for crypto to local currency
export interface CurrencyRateInfo {
    currency: string;
    symbol: string;
    rate: number;
}

export interface RateInfo {
    cryptoAsset: string;
    currency: string;
    cryptoAssetInfo: CurrencyRateInfo;
    currencyInfo: CurrencyRateInfo;
    timestamp: string;
}

export interface RateInfoResponse {
    success: boolean;
    data?: RateInfo;
    error?: string;
}

// Component state types
export interface OfframpFormState {
    token: OfframpToken;
    amount: string;
    country: OfframpCountry;
    bankCode: string;
    accountNumber: string;
    accountName: string;
}

export interface OfframpQuoteState {
    isLoading: boolean;
    quote: OfframpQuoteResponse["data"] | null;
    error: string | null;
}

// Locked quote for confirmation flow
export interface LockedQuote {
    transactionReference: string;
    inputSnapshot: OfframpFormState;
    quoteData: OfframpQuoteData;
    network: string;
    lockedAt: number;
}

// Confirm response with crypto address
export interface OfframpConfirmData {
    transactionId: string;
    transactionReference: string;
    cryptoAssetAddress: string;
    amount: number;
    cryptoAsset: string;
    status: string;
    expireOn: string;
}

// Token contract addresses per network
export const TOKEN_CONTRACTS: Record<string, Record<string, string>> = {
    // Polygon Mainnet
    "137": {
        USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
    // BSC Mainnet
    "56": {
        USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        USDT: "0x55d398326f99059fF775485246999027B3197955",
    },
};

// Supported chain IDs for offramp
export const OFFRAMP_CHAIN_IDS = [137, 56]; // Polygon, BSC

// ==================== MULTI-PROVIDER TYPES ====================

// Provider identifiers
export type OfframpProviderId = "cashwyre" | "autoramp";

// Provider rate from aggregator
export interface ProviderRate {
    providerId: OfframpProviderId;
    displayName: string;
    cryptoAmount: number;
    fiatAmount: number;
    rate: number;
    fee: number;
    currency: string;
    token: string;
    network: string;
    expiresAt?: string;
}

// Aggregated rates response from backend
export interface AggregatedRatesResponse {
    best: ProviderRate | null;
    all: ProviderRate[];
    errors: { providerId: string; error: string }[];
    timestamp: string;
}

// Create offramp request (provider-agnostic)
export interface CreateOfframpRequest {
    providerId: OfframpProviderId;
    token: string;
    amount: number;
    country: string;
    currency: string;
    network: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
}

// Create offramp response
export interface CreateOfframpResponse {
    success: boolean;
    data?: {
        providerId: OfframpProviderId;
        reference: string;
        depositAddress: string;
        depositAmount: number;
        depositToken: string;
        depositNetwork: string;
        fiatAmount: number;
        currency: string;
        status: string;
        expiresAt?: string;
    };
    error?: string;
}

// Quote status from webhook polling (provider-agnostic)
export type PayoutStatus = "pending" | "processing" | "confirmed" | "completed" | "failed" | "expired";

export interface QuoteStatusData {
    id: string;
    transactionReference: string;
    status: PayoutStatus;
    providerStatus: string | null;
    providerMessage: string | null;
    providerId: string;
    payoutCompletedAt: string | null;
}

export interface QuoteStatusResponse {
    success: boolean;
    data?: QuoteStatusData;
    error?: string;
}

