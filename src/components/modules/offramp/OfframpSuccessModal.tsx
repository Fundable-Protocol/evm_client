"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import type { OfframpConfirmResponse } from "@/types/offramp";

interface OfframpSuccessModalProps {
    isOpen: boolean;
    data: OfframpConfirmResponse["data"] | null;
    onClose: () => void;
}

export default function OfframpSuccessModal({
    isOpen,
    data,
    onClose,
}: OfframpSuccessModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !data) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(data.depositAddress);
            setCopied(true);
            toast.success("Address copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <div className="fixed inset-0 bg-fundable-dark/80 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-fundable-mid-dark border border-green-500/50 rounded-2xl p-6 w-full max-w-md mx-4 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                </div>

                <h3 className="text-xl font-syne font-semibold text-white text-center mb-2">
                    Offramp Initiated!
                </h3>
                <p className="text-fundable-light-grey text-center text-sm mb-6">
                    Send the crypto to the address below to complete your offramp
                </p>

                <div className="space-y-4">
                    {/* Deposit Address */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm mb-2">
                            Deposit Address
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="text-white text-sm break-all flex-1 bg-fundable-mid-grey p-2 rounded">
                                {data.depositAddress}
                            </code>
                            <Button
                                onClick={handleCopy}
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-fundable-purple hover:text-white hover:bg-fundable-violet"
                            >
                                {copied ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Copy className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Amount to Send */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm">Amount to Send</p>
                        <p className="text-white text-xl font-semibold">
                            {data.depositAmount} {data.depositToken}
                        </p>
                    </div>

                    {/* Transaction ID */}
                    <div className="flex justify-between text-sm">
                        <span className="text-fundable-light-grey">Transaction ID</span>
                        <span className="text-white font-mono">
                            {data.transactionId.slice(0, 8)}...
                        </span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between text-sm">
                        <span className="text-fundable-light-grey">Status</span>
                        <span className="text-yellow-500 capitalize">{data.status}</span>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-500 text-sm">
                            ⚠️ Only send {data.depositToken} to this address. Sending other
                            tokens may result in permanent loss.
                        </p>
                    </div>

                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        variant="gradient"
                        size="lg"
                        className="w-full mt-4"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
