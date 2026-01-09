"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import type { OfframpFormState } from "@/types/offramp";
import { SUPPORTED_COUNTRIES } from "@/types/offramp";

interface OfframpSummaryProps {
    formState: OfframpFormState;
    onGetQuote: () => void;
    isLoading: boolean;
}

export default function OfframpSummary({
    formState,
    onGetQuote,
    isLoading,
}: OfframpSummaryProps) {
    const selectedCountry = SUPPORTED_COUNTRIES.find(
        (c) => c.code === formState.country
    );
    const isFormValid =
        formState.amount &&
        parseFloat(formState.amount) > 0 &&
        formState.bankCode &&
        formState.accountNumber.length >= 10 &&
        formState.accountName;

    return (
        <div className="bg-fundable-mid-dark rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-syne font-semibold text-white mb-6">
                Summary
            </h2>

            <div className="space-y-4">
                {/* Fee Info */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-fundable-light-grey">Network Fee</span>
                        <span className="text-white">Calculated on quote</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-fundable-light-grey">Service Fee</span>
                        <span className="text-white">0.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-fundable-light-grey">Exchange Rate</span>
                        <span className="text-white">Live rate on quote</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-fundable-light-grey">Estimated Time</span>
                        <span className="text-white">5-10 Minutes</span>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-fundable-light-grey">You Receive</span>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                                {selectedCountry?.currency || "---"}
                            </p>
                            <p className="text-fundable-light-grey text-sm">
                                Get quote for exact amount
                            </p>
                        </div>
                    </div>
                </div>

                {/* Get Quote Button */}
                <Button
                    onClick={onGetQuote}
                    disabled={!isFormValid || isLoading}
                    variant="gradient"
                    size="lg"
                    className="w-full h-14 text-lg font-semibold mt-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Getting Quote...
                        </>
                    ) : (
                        "Get Quote"
                    )}
                </Button>
            </div>
        </div>
    );
}
