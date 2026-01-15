"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Copy, CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

import type { OfframpConfirmResponse, PayoutStatus } from "@/types/offramp";
import { cashwyreService } from "@/services/cashwyreService";

interface OfframpSuccessModalProps {
    isOpen: boolean;
    data: OfframpConfirmResponse["data"] | null;
    transactionReference?: string;
    walletId?: string;
    onClose: () => void;
}

export default function OfframpSuccessModal({
    isOpen,
    data,
    transactionReference,
    walletId,
    onClose,
}: OfframpSuccessModalProps) {
    const [copied, setCopied] = useState(false);
    const [payoutStatus, setPayoutStatus] = useState<PayoutStatus>("pending");
    const [payoutMessage, setPayoutMessage] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    // Poll for payout status
    const pollPayoutStatus = useCallback(async () => {
        if (!transactionReference) return;

        try {
            const result = await cashwyreService.getQuoteStatus(transactionReference, walletId);

            if (result.success && result.data) {
                const status = result.data.status as PayoutStatus;
                setPayoutStatus(status);

                if (result.data.cashwyreMessage) {
                    setPayoutMessage(result.data.cashwyreMessage);
                }

                // Stop polling if completed or failed
                if (status === "completed" || status === "failed" || status === "expired") {
                    setIsPolling(false);

                    if (status === "completed") {
                        toast.success("Payout completed successfully! 🎉");
                    } else if (status === "failed") {
                        toast.error("Payout failed. Please contact support.");
                    }
                }
            }
        } catch (error) {
            console.error("Failed to poll payout status:", error);
        }
    }, [transactionReference, walletId]);

    // Start polling when modal opens
    useEffect(() => {
        if (isOpen && transactionReference) {
            setIsPolling(true);
            setPayoutStatus("pending");
            setPayoutMessage(null);

            // Initial poll
            pollPayoutStatus();

            // Poll every 8 seconds
            const interval = setInterval(pollPayoutStatus, 8000);

            return () => {
                clearInterval(interval);
                setIsPolling(false);
            };
        }
    }, [isOpen, transactionReference, pollPayoutStatus]);

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

    // Get status display info
    const getStatusDisplay = () => {
        switch (payoutStatus) {
            case "completed":
                return {
                    text: "Completed",
                    color: "text-green-500",
                    bgColor: "bg-green-500/20",
                    icon: <CheckCircle2 className="h-5 w-5" />,
                };
            case "failed":
                return {
                    text: "Failed",
                    color: "text-red-500",
                    bgColor: "bg-red-500/20",
                    icon: <XCircle className="h-5 w-5" />,
                };
            case "expired":
                return {
                    text: "Expired",
                    color: "text-gray-500",
                    bgColor: "bg-gray-500/20",
                    icon: <Clock className="h-5 w-5" />,
                };
            case "confirmed":
            case "processing":
                return {
                    text: "Processing",
                    color: "text-blue-500",
                    bgColor: "bg-blue-500/20",
                    icon: <Loader2 className="h-5 w-5 animate-spin" />,
                };
            default:
                return {
                    text: "Pending",
                    color: "text-yellow-500",
                    bgColor: "bg-yellow-500/20",
                    icon: <Loader2 className="h-5 w-5 animate-spin" />,
                };
        }
    };

    const statusDisplay = getStatusDisplay();
    const isTerminalStatus = payoutStatus === "completed" || payoutStatus === "failed" || payoutStatus === "expired";

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

                {/* Status Icon */}
                <div className="flex justify-center mb-4">
                    <div className={`h-16 w-16 rounded-full ${statusDisplay.bgColor} flex items-center justify-center`}>
                        {payoutStatus === "completed" ? (
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        ) : payoutStatus === "failed" ? (
                            <XCircle className="h-10 w-10 text-red-500" />
                        ) : (
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-syne font-semibold text-white text-center mb-2">
                    {payoutStatus === "completed"
                        ? "Payout Complete! 🎉"
                        : payoutStatus === "failed"
                            ? "Payout Failed"
                            : "Offramp Processing"}
                </h3>
                <p className="text-fundable-light-grey text-center text-sm mb-6">
                    {payoutStatus === "completed"
                        ? "Your funds have been sent to your bank account"
                        : payoutStatus === "failed"
                            ? payoutMessage || "There was an issue with your payout. Please contact support."
                            : "Your transaction is being processed. This page will update automatically."}
                </p>

                <div className="space-y-4">
                    {/* Deposit Address - Only show if pending */}
                    {!isTerminalStatus && (
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
                    )}

                    {/* Amount */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm">
                            {isTerminalStatus ? "Amount Sent" : "Amount to Send"}
                        </p>
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

                    {/* Payout Status */}
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-fundable-light-grey">Payout Status</span>
                        <span className={`${statusDisplay.color} capitalize flex items-center gap-2`}>
                            {statusDisplay.icon}
                            {statusDisplay.text}
                            {isPolling && !isTerminalStatus && (
                                <span className="text-xs text-fundable-light-grey">(updating...)</span>
                            )}
                        </span>
                    </div>

                    {/* Status Message */}
                    {payoutMessage && isTerminalStatus && (
                        <div className={`${payoutStatus === "completed" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"} border rounded-lg p-3`}>
                            <p className={`${payoutStatus === "completed" ? "text-green-400" : "text-red-400"} text-sm`}>
                                {payoutMessage}
                            </p>
                        </div>
                    )}

                    {/* Warning - only show when pending */}
                    {!isTerminalStatus && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-yellow-500 text-sm">
                                ⚠️ Only send {data.depositToken} to this address. Sending other
                                tokens may result in permanent loss.
                            </p>
                        </div>
                    )}

                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        variant="gradient"
                        size="lg"
                        className="w-full mt-4"
                    >
                        {isTerminalStatus ? "Done" : "Close"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
