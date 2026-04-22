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

    const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareText = "I just successfully offramped using @FundableHQ! 🚀";

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0A0A1A]/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-[#0A0A1A] border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-auto relative shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                    <div className={`h-16 w-16 rounded-full ${payoutStatus === "failed" ? "bg-red-500/20" : payoutStatus === "expired" ? "bg-gray-500/20" : "bg-green-500/20"} flex items-center justify-center`}>
                        <div className={`h-10 w-10 rounded-full ${payoutStatus === "failed" ? "bg-red-500" : payoutStatus === "expired" ? "bg-gray-500" : "bg-green-500"} flex items-center justify-center`}>
                            {payoutStatus === "failed" ? (
                                <X className="h-6 w-6 text-white" strokeWidth={3} />
                            ) : payoutStatus === "expired" ? (
                                <Clock className="h-6 w-6 text-white" strokeWidth={3} />
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-syne font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
                    {payoutStatus === "failed"
                        ? "Payout Failed"
                        : payoutStatus === "expired"
                            ? "Payout Expired"
                            : "Transaction Completed"}
                    {payoutStatus !== "failed" && payoutStatus !== "expired" && (
                        <div className="bg-[#4ADE80] rounded-[4px] p-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </h3>
                <p className="text-fundable-light-grey text-center text-sm mb-8">
                    {payoutStatus === "failed"
                        ? payoutMessage || "There was an issue with your payout. Please contact support."
                        : payoutStatus === "expired"
                            ? "This transaction has expired. Please try again."
                            : "Your transaction is on the way to your bank account."}
                </p>

                <div className="space-y-6">
                    {/* Amount Box */}
                    <div className="bg-[#151529] p-5 rounded-xl border border-indigo-500/20 flex justify-between items-center">
                        <span className="text-[10px] text-fundable-light-grey uppercase tracking-widest font-bold">
                            Amount Sent
                        </span>
                        <span className="text-white text-2xl font-bold">
                            {data.depositAmount} {data.depositToken}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Transaction ID */}
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-fundable-light-grey">Transaction ID</span>
                            <span className="text-white font-mono bg-[#1A1A2E] px-3 py-1 rounded-md">
                                {data.transactionId.slice(0, 8)}...
                            </span>
                        </div>

                        {/* Payout Status */}
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-fundable-light-grey">Payout Status</span>
                            <span className={`${statusDisplay.color} capitalize flex items-center gap-2 font-medium`}>
                                {statusDisplay.icon}
                                {statusDisplay.text}
                                {isPolling && !isTerminalStatus && (
                                    <span className="text-xs text-fundable-light-grey ml-1">(updating...)</span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Status Message */}
                    {payoutMessage && isTerminalStatus && (
                        <div className={`${payoutStatus === "completed" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"} border rounded-lg p-3`}>
                            <p className={`${payoutStatus === "completed" ? "text-green-400" : "text-red-400"} text-sm text-center`}>
                                {payoutMessage}
                            </p>
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="pt-4 border-t border-gray-800">
                        <p className="text-[10px] text-fundable-light-grey uppercase tracking-widest font-bold mb-4">
                            Share Your Success
                        </p>
                        <div className="flex justify-between gap-2">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-[72px] h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-[72px] h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href={`mailto:?subject=${encodeURIComponent("Successfully offramped using Fundable!")}&body=${encodeURIComponent(shareText + " " + shareUrl)}`}
                                className="w-[72px] h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                            <button
                                onClick={handleCopyLink}
                                className="w-[72px] h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-500/20 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Close Button */}
                    <Button
                        onClick={onClose}
                        className="w-full h-12 rounded-xl font-bold text-white bg-gradient-to-r from-fundable-purple-2 to-purple-500 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
