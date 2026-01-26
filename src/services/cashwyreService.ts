// Cashwyre API Service for Offramp functionality
// Calls backend API which handles Cashwyre integration

import { backendBaseUrl } from "@/lib/constant";
import type {
    OfframpQuoteRequest,
    OfframpQuoteResponse,
    OfframpConfirmResponse,
    BankListResponse,
    VerifyBankAccountResponse,
    RateInfoResponse,
    OfframpCountry,
} from "@/types/offramp";

const OFFRAMP_API_BASE = `${backendBaseUrl}/api/offramp`;

const getHeaders = (walletId?: string) => ({
    "Content-Type": "application/json",
    ...(walletId ? { "x-wallet-id": walletId } : {}),
});

export const cashwyreService = {
    /**
     * Get a quote for offramping crypto to local currency
     */
    async getOfframpQuote(
        request: OfframpQuoteRequest,
        walletId?: string
    ): Promise<OfframpQuoteResponse> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/quote`, {
                method: "POST",
                headers: getHeaders(walletId),
                body: JSON.stringify(request),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to get offramp quote",
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to get offramp quote",
            };
        }
    },

    /**
     * Confirm an offramp quote and get deposit address
     */
    async confirmOfframpQuote(
        params: {
            transactionReference: string;
            accountNumber: string;
            accountName: string;
            bankCode: string;
        },
        walletId?: string
    ): Promise<OfframpConfirmResponse> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/confirm`, {
                method: "POST",
                headers: getHeaders(walletId),
                body: JSON.stringify(params),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to confirm offramp",
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to confirm offramp",
            };
        }
    },

    /**
     * Get list of supported banks for a country
     */
    async getBankList(
        country: OfframpCountry,
        walletId?: string
    ): Promise<BankListResponse> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/banks?country=${country}`, {
                method: "GET",
                headers: getHeaders(walletId),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to fetch bank list",
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error ? error.message : "Failed to fetch bank list",
            };
        }
    },

    /**
     * Verify a bank account and get account name
     */
    async verifyBankAccount(
        bankCode: string,
        accountNumber: string,
        country: string,
        walletId?: string
    ): Promise<VerifyBankAccountResponse> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/verify-account`, {
                method: "POST",
                headers: getHeaders(walletId),
                body: JSON.stringify({ bankCode, accountNumber, country }),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to verify bank account",
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to verify bank account",
            };
        }
    },

    /**
     * Get live exchange rates for crypto to local currencies
     */
    async getRateInfo(cryptoAsset: string, currency: string): Promise<RateInfoResponse> {
        try {
            const url = `${OFFRAMP_API_BASE}/rate?cryptoAsset=${cryptoAsset}&currency=${currency}`;

            const res = await fetch(url, {
                method: "GET",
                headers: getHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to fetch rate info",
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch rate info",
            };
        }
    },

    /**
     * Save a quote to the backend database
     */
    async saveQuote(
        params: {
            walletAddress: string;
            transactionReference: string;
            token: string;
            amount: number;
            country: string;
            currency: string;
            network: string;
            quoteData: Record<string, unknown>;
            bankCode?: string;
            accountNumber?: string;
            accountName?: string;
            expiresAt?: string;
            amountUsd?: number;
            amountLocal?: number;
        },
        walletId?: string
    ): Promise<{ success: boolean; data?: unknown; error?: string }> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/quote/save`, {
                method: "POST",
                headers: getHeaders(walletId),
                body: JSON.stringify(params),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to save quote",
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to save quote",
            };
        }
    },

    /**
     * Update quote with user's transaction hash
     */
    async updateQuoteTxHash(
        transactionReference: string,
        txHash: string,
        walletId?: string
    ): Promise<{ success: boolean; data?: unknown; error?: string }> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/quote/update-tx`, {
                method: "POST",
                headers: getHeaders(walletId),
                body: JSON.stringify({ transactionReference, txHash }),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to update tx hash",
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to update tx hash",
            };
        }
    },

    /**
     * Get quote/payout status by transaction reference
     * Polls the backend for webhook-updated status
     */
    async getQuoteStatus(
        transactionReference: string,
        walletId?: string
    ): Promise<{
        success: boolean;
        data?: {
            id: number;
            transactionReference: string;
            status: string;
            cashwyreStatus: string | null;
            cashwyreMessage: string | null;
            payoutCompletedAt: string | null;
        };
        error?: string;
    }> {
        try {
            const res = await fetch(
                `${backendBaseUrl}/api/webhook/quote/${transactionReference}`,
                {
                    method: "GET",
                    headers: getHeaders(walletId),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    error: data.message || data.error || "Failed to get quote status",
                };
            }

            return { success: true, data: data.data || data };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to get quote status",
            };
        }
    },
};
