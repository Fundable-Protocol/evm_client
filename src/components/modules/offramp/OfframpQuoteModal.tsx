"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

import type { OfframpQuoteResponse } from "@/types/offramp";

interface OfframpQuoteModalProps {
    isOpen: boolean;
    quote: OfframpQuoteResponse["data"] | null;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export default function OfframpQuoteModal({
    isOpen,
    quote,
    onClose,
    onConfirm,
    isLoading,
}: OfframpQuoteModalProps) {
    if (!isOpen || !quote) return null;

    return (
        <div className="fixed inset-0 bg-fundable-dark/80 backdrop-blur-sm flex justify-center items-center z-50">
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
                            {quote.tokenAmount} {quote.token}
                        </p>
                    </div>

                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm">You Receive</p>
                        <p className="text-white text-xl font-semibold">
                            {quote.localCurrency} {quote.localAmount}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Exchange Rate</span>
                            <span className="text-white">
                                1 {quote.token} = {quote.exchangeRate} {quote.localCurrency}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Network Fee</span>
                            <span className="text-white">{quote.networkFee} {quote.token}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Service Fee</span>
                            <span className="text-white">{quote.serviceFee} {quote.token}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-fundable-light-grey">Estimated Time</span>
                            <span className="text-white">{quote.estimatedTime}</span>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm mb-2">Bank Details</p>
                        <p className="text-white font-medium">{quote.bankDetails.bankName}</p>
                        <p className="text-white">{quote.bankDetails.accountNumber}</p>
                        <p className="text-fundable-light-grey">{quote.bankDetails.accountName}</p>
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
