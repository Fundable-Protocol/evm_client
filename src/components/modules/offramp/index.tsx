"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useBalance, useChainId } from "wagmi";
import { formatUnits } from "viem";

import OfframpForm from "./OfframpForm";
import BankDetailsCard from "./BankDetailsCard";
import OfframpSummary from "./OfframpSummary";
import OfframpQuoteModal from "./OfframpQuoteModal";
import OfframpSuccessModal from "./OfframpSuccessModal";

import { cashwyreService } from "@/services/cashwyreService";
import { useOfframpTransaction } from "@/hooks/useOfframpTransaction";
import type {
    OfframpFormState,
    OfframpQuoteData,
    OfframpConfirmResponse,
    Bank,
    LockedQuote,
} from "@/types/offramp";
import { SUPPORTED_COUNTRIES, TOKEN_CONTRACTS } from "@/types/offramp";

const initialFormState: OfframpFormState = {
    token: "USDC",
    amount: "",
    country: "NG",
    bankCode: "",
    accountNumber: "",
    accountName: "",
};

export default function OfframpModule() {
    const [formState, setFormState] = useState<OfframpFormState>(initialFormState);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoadingBanks, setIsLoadingBanks] = useState(false);
    const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const [quote, setQuote] = useState<OfframpQuoteData | null>(null);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [confirmResult, setConfirmResult] = useState<OfframpConfirmResponse["data"] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successTransactionReference, setSuccessTransactionReference] = useState<string | null>(null);

    // Quote locking state
    const [isQuoteLocked, setIsQuoteLocked] = useState(false);
    const [lockedQuote, setLockedQuote] = useState<LockedQuote | null>(null);

    // TX signing hook
    const {
        address,
        isConnected,
        isSupportedChain,
        getCurrentNetwork,
        sendOfframpTransaction,
    } = useOfframpTransaction();
    const chainId = useChainId();

    // Get token contract address for current chain and token
    const tokenAddress = chainId && TOKEN_CONTRACTS[chainId.toString()]
        ? TOKEN_CONTRACTS[chainId.toString()][formState.token] as `0x${string}` | undefined
        : undefined;

    // Fetch token balance
    const { data: balanceData } = useBalance({
        address: address as `0x${string}` | undefined,
        token: tokenAddress,
        query: {
            enabled: !!address && !!tokenAddress,
        },
    });

    // Format balance for display
    const maxBalance = balanceData
        ? formatUnits(balanceData.value, balanceData.decimals)
        : undefined;

    // Handle Max button click
    const handleMaxClick = useCallback(() => {
        if (maxBalance) {
            setFormState(prev => ({ ...prev, amount: maxBalance }));
        }
    }, [maxBalance]);

    // Fetch banks when country changes
    useEffect(() => {
        const abortController = new AbortController();
        let isCancelled = false;

        const fetchBanks = async () => {
            setIsLoadingBanks(true);
            setBanks([]);
            setFormState((prev) => ({
                ...prev,
                bankCode: "",
                accountNumber: "",
                accountName: "",
            }));

            try {
                const result = await cashwyreService.getBankList(formState.country);

                if (isCancelled) return;

                if (result.success && result.data) {
                    // Deduplicate banks by code to prevent key collisions
                    const uniqueBanks = result.data.filter(
                        (bank, index, self) =>
                            index === self.findIndex((b) => b.code === bank.code)
                    );
                    setBanks(uniqueBanks);
                } else {
                    toast.error(result.error || "Failed to load banks");
                }
            } catch (error) {
                if (!isCancelled) {
                    toast.error("Failed to load banks");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoadingBanks(false);
                }
            }
        };

        fetchBanks();

        return () => {
            isCancelled = true;
            abortController.abort();
        };
    }, [formState.country]);

    // Verify bank account when bank and account number are provided
    const verifyAccount = useCallback(async () => {
        if (!formState.bankCode || formState.accountNumber.length < 10) {
            return;
        }

        setIsVerifyingAccount(true);
        try {
            const result = await cashwyreService.verifyBankAccount(
                formState.bankCode,
                formState.accountNumber,
                formState.country
            );

            if (result.success && result.data) {
                setFormState((prev) => ({
                    ...prev,
                    accountName: result.data!.accountName,
                }));
            } else {
                setFormState((prev) => ({ ...prev, accountName: "" }));
                if (formState.accountNumber.length >= 10) {
                    toast.error(result.error || "Could not verify account");
                }
            }
        } catch (error) {
            setFormState((prev) => ({ ...prev, accountName: "" }));
            toast.error(error instanceof Error ? error.message : "Could not verify account");
        } finally {
            setIsVerifyingAccount(false);
        }
    }, [formState.bankCode, formState.accountNumber, formState.country]);

    useEffect(() => {
        const timer = setTimeout(() => {
            verifyAccount();
        }, 500);

        return () => clearTimeout(timer);
    }, [verifyAccount]);

    // Handle form field changes
    const handleFormChange = (field: keyof OfframpFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
            // Reset account name when bank or account number changes
            ...(field === "bankCode" || field === "accountNumber"
                ? { accountName: "" }
                : {}),
        }));

        // Clear quote when amount changes (will be refetched by the effect)
        if (field === "amount") {
            setQuote(null);
        }
    };

    // Fetch real-time quote when amount, token, or country changes (debounced)
    useEffect(() => {
        // Don't update quote while locked in confirmation flow
        if (isQuoteLocked) return;

        const amount = parseFloat(formState.amount);
        if (!formState.amount || isNaN(amount) || amount <= 0) {
            setQuote(null);
            return;
        }

        const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.code === formState.country);
        const currency = selectedCountry?.currency || "NGN";

        const fetchQuote = async () => {
            setIsLoadingQuote(true);
            try {
                const result = await cashwyreService.getOfframpQuote({
                    token: formState.token,
                    amount: amount,
                    country: formState.country,
                    currency: currency,
                    network: getCurrentNetwork(),
                });

                if (result.success && result.data) {
                    setQuote(result.data);
                    setQuoteError(null);
                } else {
                    setQuote(null);
                    setQuoteError(result.error || "Failed to get quote");
                }
            } catch (error) {
                setQuote(null);
                setQuoteError(error instanceof Error ? error.message : "Failed to get quote");
            } finally {
                setIsLoadingQuote(false);
            }
        };

        // Debounce quote fetching by 500ms
        const timer = setTimeout(fetchQuote, 500);
        return () => clearTimeout(timer);
    }, [formState.amount, formState.token, formState.country, isQuoteLocked, getCurrentNetwork]);

    // Proceed to confirmation (quote is already fetched in real-time)
    const handleProceedToConfirm = () => {
        if (!formState.amount || parseFloat(formState.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!formState.bankCode) {
            toast.error("Please select a bank");
            return;
        }
        if (!formState.accountNumber || formState.accountNumber.length < 10) {
            toast.error("Please enter a valid account number");
            return;
        }
        if (!formState.accountName) {
            toast.error("Please wait for account verification");
            return;
        }
        if (!quote) {
            toast.error("Please wait for quote to load");
            return;
        }

        // Lock the quote to prevent updates during confirmation flow
        setLockedQuote({
            transactionReference: quote.transactionReference,
            inputSnapshot: { ...formState },
            quoteData: quote,
            network: getCurrentNetwork(),
            lockedAt: Date.now(),
        });
        setIsQuoteLocked(true);
        setShowQuoteModal(true);
    };

    // Handle modal close - unlock quote
    const handleCloseModal = () => {
        setShowQuoteModal(false);
        setIsQuoteLocked(false);
        setLockedQuote(null);
    };

    // Confirm quote and trigger TX signing
    const handleConfirmQuote = async () => {
        if (!quote?.transactionReference || !lockedQuote) return;

        if (!isConnected) {
            toast.error("Please connect your wallet");
            return;
        }

        if (!isSupportedChain) {
            toast.error("Please switch to Polygon or BSC");
            return;
        }

        setIsConfirming(true);

        try {
            // Step 1: Confirm quote with Cashwyre to get deposit address
            const result = await cashwyreService.confirmOfframpQuote(
                {
                    transactionReference: quote.transactionReference,
                    accountNumber: formState.accountNumber,
                    accountName: formState.accountName,
                    bankCode: formState.bankCode,
                },
                address // Pass connected wallet address for auth
            );

            if (!result.success || !result.data) {
                toast.error(result.error || "Failed to confirm offramp");
                setIsConfirming(false);
                return;
            }

            // Extract crypto address for deposit
            const cryptoAssetAddress = (result.data as { cryptoAssetAddress?: string })?.cryptoAssetAddress;

            if (!cryptoAssetAddress) {
                toast.error("No deposit address received");
                setIsConfirming(false);
                return;
            }

            // Step 2: Save quote to database for tracking
            const selectedCountry = SUPPORTED_COUNTRIES.find(c => c.code === formState.country);
            const currency = selectedCountry?.currency || "NGN";

            await cashwyreService.saveQuote(
                {
                    walletAddress: address || "",
                    transactionReference: quote.transactionReference,
                    token: formState.token,
                    amount: parseFloat(formState.amount),
                    country: formState.country,
                    currency: currency,
                    network: getCurrentNetwork(),
                    quoteData: quote as unknown as Record<string, unknown>,
                    bankCode: formState.bankCode,
                    accountNumber: formState.accountNumber,
                    accountName: formState.accountName,
                    expiresAt: quote.expireOn,
                    amountUsd: quote.amountInCryptoAsset,
                    amountLocal: quote.amountInLocalCurrency,
                },
                address
            );

            // Step 3: Trigger TX signing to send crypto to the deposit address
            await sendOfframpTransaction({
                transactionReference: quote.transactionReference,
                token: formState.token as "USDC" | "USDT",
                amount: quote.totalDepositInCryptoAsset?.toString() || formState.amount,
                cryptoAssetAddress,
                onSuccess: () => {
                    toast.dismiss("tx-confirming");
                    toast.success("Transaction submitted successfully!");
                    // Set success state before clearing quote data
                    setSuccessTransactionReference(quote.transactionReference);
                    setConfirmResult(result.data);
                    setShowQuoteModal(false);
                    setShowSuccessModal(true);
                    // Reset form and unlock quote
                    setFormState(initialFormState);
                    setQuote(null);
                    setIsQuoteLocked(false);
                    setLockedQuote(null);
                    setIsConfirming(false);
                },
                onError: () => {
                    toast.error("Transaction failed. You can try again.");
                    setIsConfirming(false);
                },
            });
        } catch {
            toast.error("Failed to process offramp");
            setIsConfirming(false);
        }
    };

    // Close success modal
    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        setConfirmResult(null);
        setSuccessTransactionReference(null);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Left: Form */}
                <div className="flex-1 space-y-6">
                    <OfframpForm
                        formState={formState}
                        onChange={handleFormChange}
                        maxBalance={maxBalance}
                        onMaxClick={handleMaxClick}
                    />
                </div>

                {/* Right: Bank Details */}
                <div className="flex-1 space-y-6">
                    <BankDetailsCard
                        formState={formState}
                        banks={banks}
                        isLoadingBanks={isLoadingBanks}
                        isVerifyingAccount={isVerifyingAccount}
                        onChange={handleFormChange}
                    />

                    <OfframpSummary
                        formState={formState}
                        quote={quote}
                        quoteError={quoteError}
                        onProceed={handleProceedToConfirm}
                        isLoading={isLoadingQuote}
                    />
                </div>
            </div>

            {/* Quote Confirmation Modal */}
            <OfframpQuoteModal
                isOpen={showQuoteModal}
                quote={quote}
                formState={formState}
                onClose={handleCloseModal}
                onConfirm={handleConfirmQuote}
                isLoading={isConfirming}
            />

            {/* Success Modal */}
            <OfframpSuccessModal
                isOpen={showSuccessModal}
                data={confirmResult}
                transactionReference={successTransactionReference || undefined}
                walletId={address}
                onClose={handleCloseSuccess}
            />
        </>
    );
}
