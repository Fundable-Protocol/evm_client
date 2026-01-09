// Cashwyre API Service for Offramp functionality
// Calls backend API which handles Cashwyre integration

import { backendBaseUrl } from "@/lib/constant";
import type {
    OfframpQuoteRequest,
    OfframpQuoteResponse,
    OfframpConfirmResponse,
    BankListResponse,
    VerifyBankAccountResponse,
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
        quoteId: string,
        walletId?: string
    ): Promise<OfframpConfirmResponse> {
        try {
            const res = await fetch(`${OFFRAMP_API_BASE}/confirm`, {
                method: "POST",
                headers: getHeaders(walletId),
                body: JSON.stringify({ quoteId }),
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
};
