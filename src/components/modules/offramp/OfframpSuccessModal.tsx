"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
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
    const [payoutStatus, setPayoutStatus] = useState<PayoutStatus>("pending");
    const [payoutMessage, setPayoutMessage] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Poll for payout status
    const pollPayoutStatus = useCallback(async () => {
        if (!transactionReference) return;

        try {
            const result = await cashwyreService.getQuoteStatus(transactionReference, walletId);

            if (result.success && result.data) {
                const status = result.data.status as PayoutStatus;
                setPayoutStatus(status);

                if (result.data.providerMessage) {
                    setPayoutMessage(result.data.providerMessage);
                }

                // Stop polling if completed or failed
                if (status === "completed" || status === "failed" || status === "expired") {
                    setIsPolling(false);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }

                    if (status === "completed") {
                        toast.success("Payout completed successfully! 🎉");
                    } else if (status === "failed") {
                        toast.error("Payout failed. Please contact support.");
                    } else if (status === "expired") {
                        toast.error("Payout expired. Please try again.");
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
            intervalRef.current = setInterval(pollPayoutStatus, 8000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setIsPolling(false);
            };
        }
    }, [isOpen, transactionReference, pollPayoutStatus]);

    if (!isOpen || !data) return null;


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
                    <div className={`h-16 w-16 rounded-full ${payoutStatus === "failed" ? "bg-red-500/20" : payoutStatus === "expired" ? "bg-gray-500/20" : "bg-green-500/20"} flex items-center justify-center`}>
                        {payoutStatus === "failed" ? (
                            <XCircle className="h-10 w-10 text-red-500" />
                        ) : payoutStatus === "expired" ? (
                            <Clock className="h-10 w-10 text-gray-500" />
                        ) : (
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-syne font-semibold text-white text-center mb-2">
                    {payoutStatus === "failed"
                        ? "Payout Failed"
                        : payoutStatus === "expired"
                            ? "Payout Expired"
                            : "Transaction Completed ✅"}
                </h3>
                <p className="text-fundable-light-grey text-center text-sm mb-6">
                    {payoutStatus === "failed"
                        ? payoutMessage || "There was an issue with your payout. Please contact support."
                        : payoutStatus === "expired"
                            ? "This transaction has expired. Please try again."
                            : "Your transaction is on the way to your bank account."}
                </p>

                <div className="space-y-4">
                    {/* Amount */}
                    <div className="bg-fundable-dark p-4 rounded-lg">
                        <p className="text-fundable-light-grey text-sm">
                            Amount Sent
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
