"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import OfframpForm from "./OfframpForm";
import BankDetailsCard from "./BankDetailsCard";
import OfframpSummary from "./OfframpSummary";
import OfframpQuoteModal from "./OfframpQuoteModal";
import OfframpSuccessModal from "./OfframpSuccessModal";

import { cashwyreService } from "@/services/cashwyreService";
import type {
    OfframpFormState,
    OfframpQuoteResponse,
    OfframpConfirmResponse,
    Bank,
} from "@/types/offramp";

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

    const [quote, setQuote] = useState<OfframpQuoteResponse["data"] | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [confirmResult, setConfirmResult] = useState<OfframpConfirmResponse["data"] | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Fetch banks when country changes
    useEffect(() => {
        const fetchBanks = async () => {
            setIsLoadingBanks(true);
            setBanks([]);
            setFormState((prev) => ({
                ...prev,
                bankCode: "",
                accountNumber: "",
                accountName: "",
            }));

            const result = await cashwyreService.getBankList(formState.country);

            if (result.success && result.data) {
                setBanks(result.data);
            } else {
                toast.error(result.error || "Failed to load banks");
            }

            setIsLoadingBanks(false);
        };

        fetchBanks();
    }, [formState.country]);

    // Verify bank account when bank and account number are provided
    const verifyAccount = useCallback(async () => {
        if (!formState.bankCode || formState.accountNumber.length < 10) {
            return;
        }

        setIsVerifyingAccount(true);
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

        setIsVerifyingAccount(false);
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
    };

    // Get quote
    const handleGetQuote = async () => {
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

        setIsLoadingQuote(true);
        const result = await cashwyreService.getOfframpQuote({
            token: formState.token,
            amount: formState.amount,
            country: formState.country,
            bankCode: formState.bankCode,
            accountNumber: formState.accountNumber,
        });

        if (result.success && result.data) {
            setQuote(result.data);
            setShowQuoteModal(true);
        } else {
            toast.error(result.error || "Failed to get quote");
        }

        setIsLoadingQuote(false);
    };

    // Confirm quote
    const handleConfirmQuote = async () => {
        if (!quote?.quoteId) return;

        setIsConfirming(true);
        const result = await cashwyreService.confirmOfframpQuote(quote.quoteId);

        if (result.success && result.data) {
            setConfirmResult(result.data);
            setShowQuoteModal(false);
            setShowSuccessModal(true);
            // Reset form
            setFormState(initialFormState);
            setQuote(null);
        } else {
            toast.error(result.error || "Failed to confirm offramp");
        }

        setIsConfirming(false);
    };

    // Close success modal
    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        setConfirmResult(null);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Left: Form */}
                <div className="flex-1 space-y-6">
                    <OfframpForm
                        formState={formState}
                        onChange={handleFormChange}
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
                        onGetQuote={handleGetQuote}
                        isLoading={isLoadingQuote}
                    />
                </div>
            </div>

            {/* Quote Confirmation Modal */}
            <OfframpQuoteModal
                isOpen={showQuoteModal}
                quote={quote}
                onClose={() => setShowQuoteModal(false)}
                onConfirm={handleConfirmQuote}
                isLoading={isConfirming}
            />

            {/* Success Modal */}
            <OfframpSuccessModal
                isOpen={showSuccessModal}
                data={confirmResult}
                onClose={handleCloseSuccess}
            />
        </>
    );
}
