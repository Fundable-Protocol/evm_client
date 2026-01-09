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
export type OfframpToken = "ETH" | "USDC" | "USDT";

export interface TokenInfo {
    symbol: OfframpToken;
    name: string;
    icon: string;
    decimals: number;
}

export const SUPPORTED_OFFRAMP_TOKENS: TokenInfo[] = [
    { symbol: "ETH", name: "Ethereum", icon: "/svgs/tokens/eth.svg", decimals: 18 },
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
    amount: string;
    country: OfframpCountry;
    bankCode: string;
    accountNumber: string;
}

export interface OfframpQuoteResponse {
    success: boolean;
    data?: {
        quoteId: string;
        token: OfframpToken;
        tokenAmount: string;
        localCurrency: OfframpCurrency;
        localAmount: string;
        exchangeRate: string;
        networkFee: string;
        serviceFee: string;
        totalFee: string;
        estimatedTime: string;
        expiresAt: string;
        bankDetails: {
            bankName: string;
            accountNumber: string;
            accountName: string;
        };
    };
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
