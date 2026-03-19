"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import type { CountryInfo, OfframpFormState, OfframpQuoteData } from "@/types/offramp";

interface OfframpSummaryProps {
    formState: OfframpFormState;
    countries: CountryInfo[];
    quote: OfframpQuoteData | null;
    quoteError?: string | null;
    onProceed: () => void;
    isLoading: boolean;
}

export default function OfframpSummary({
    formState,
    countries,
    quote,
    quoteError,
    onProceed,
    isLoading,
}: OfframpSummaryProps) {
    const selectedCountry = countries.find(
        (c) => c.code === formState.country
    );
    const isFormValid =
        formState.amount &&
        parseFloat(formState.amount) > 0 &&
        formState.bankCode &&
        formState.accountNumber.length >= 10 &&
        formState.accountName;

    const canProceed = isFormValid && quote && !isLoading;

    return (
        <div className="bg-fundable-mid-dark rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-syne font-semibold text-white mb-6">
                Quote Summary
            </h2>

            <div className="space-y-4">
                {/* Real-time Quote Info */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-fundable-purple mr-2" />
                        <span className="text-fundable-light-grey">Fetching quote...</span>
                    </div>
                ) : quote ? (
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-fundable-light-grey">You Send</span>
                            <span className="text-white font-medium">
                                {quote.amountInCryptoAsset} {formState.token}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-fundable-light-grey">Exchange Rate</span>
                            <span className="text-white">
                                1 {formState.token} = {quote.rateCurrency} {quote.cryptoRate?.toLocaleString() ?? "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-fundable-light-grey">Expires In</span>
                            <span className="text-fundable-purple">{quote.expireInMinutes} minutes</span>
                        </div>
                    </div>
                ) : quoteError ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-400 text-sm">{quoteError}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-fundable-light-grey">You Send</span>
                            <span className="text-white">
                                {formState.amount || "0"} {formState.token}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-fundable-light-grey">Exchange Rate</span>
                            <span className="text-fundable-light-grey">Enter amount for quote</span>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-fundable-light-grey">You Receive</span>
                        <div className="text-right">
                            {quote ? (
                                <>
                                    <p className="text-2xl font-bold text-white">
                                        {selectedCountry?.currency} {quote.payoutAmountInLocalCurrency?.toLocaleString()}
                                    </p>
                                    <p className="text-fundable-light-grey text-xs">
                                        Total Required: {quote.totalDepositInCryptoAsset} {formState.token}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl font-bold text-fundable-light-grey">
                                        {formState.currency || selectedCountry?.currency || "---"}
                                    </p>
                                    <p className="text-fundable-light-grey text-sm">
                                        Enter amount for quote
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Proceed Button */}
                <Button
                    onClick={onProceed}
                    disabled={!canProceed}
                    variant="gradient"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading Quote...
                        </>
                    ) : quote ? (
                        "Proceed to Confirm"
                    ) : (
                        "Enter Amount for Quote"
                    )}
                </Button>
            </div>
        </div>
    );
}
