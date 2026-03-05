"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

import type { OfframpQuoteData, OfframpFormState } from "@/types/offramp";

// Currency symbols - extracted outside component for performance
const CURRENCY_SYMBOLS: Record<string, string> = {
    NGN: "₦",
    GHS: "₵",
    KES: "KSh ",
};

const getCurrencySymbol = (currency: string) =>
    CURRENCY_SYMBOLS[currency] || currency + " ";

interface OfframpQuoteModalProps {
    isOpen: boolean;
    quote: OfframpQuoteData | null;
    formState: OfframpFormState;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export default function OfframpQuoteModal({
    isOpen,
    quote,
    formState,
    onClose,
    onConfirm,
    isLoading,
}: OfframpQuoteModalProps) {
    // Handle Escape key to close modal
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape" && !isLoading) {
            onClose();
        }
    }, [isLoading, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen || !quote) return null;

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-fundable-dark/80 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-fundable-mid-dark border border-fundable-purple rounded-2xl p-6 w-full max-w-md mx-4 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-xl font-syne font-semibold text-white mb-6">
                    Confirm Offramp
                </h3>

                <div className="space-y-4">
                    {/* Amount Section */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm">You Send</p>
                        <p className="text-white text-xl font-semibold">
                            {quote.totalDepositInCryptoAsset} {formState.token}
                        </p>
                    </div>

                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm">You Receive</p>
                        <p className="text-white text-xl font-semibold">
                            {getCurrencySymbol(quote.currency)}{quote.payoutAmountInLocalCurrency?.toLocaleString() ?? "—"}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Exchange Rate</span>
                            <span className="text-white">
                                1 {formState.token} = {getCurrencySymbol(quote.rateCurrency)}{quote.cryptoRate?.toLocaleString() ?? "—"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Fee Type</span>
                            <span className="text-white capitalize">{quote.feeType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Expires In</span>
                            <span className="text-fundable-purple">{quote.expireInMinutes} minutes</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Reference</span>
                            <span className="text-white text-xs font-mono">{quote.transactionReference}</span>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm mb-2">Bank Details</p>
                        <p className="text-white font-medium">{formState.accountName}</p>
                        <p className="text-white">{formState.accountNumber}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-6">
                        <Button
                            onClick={onClose}
                            disabled={isLoading}
                            variant="grey"
                            size="md"
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            variant="gradient"
                            size="md"
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
