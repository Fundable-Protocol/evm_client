"use client";

import { useCallback, useState, useEffect } from "react";
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, isAddress } from "viem";
import toast from "react-hot-toast";

import { TOKEN_CONTRACTS, OFFRAMP_CHAIN_IDS } from "@/types/offramp";
import { cashwyreService } from "@/services/cashwyreService";

// ERC20 transfer ABI
const ERC20_ABI = [
    {
        name: "transfer",
        type: "function",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
] as const;

// Token decimals per chain (verified from actual contracts)
const TOKEN_DECIMALS: Record<string, Record<string, number>> = {
    "137": { USDC: 6, USDT: 6 },   // Polygon
    "56": { USDC: 18, USDT: 18 },  // BSC
};

// Chain ID to network mapping for Cashwyre API
const CHAIN_TO_NETWORK: Record<number, string> = {
    137: "polygon",
    56: "binance_smart_chain",
};

interface UseOfframpTransactionProps {
    transactionReference: string;
    token: "USDC" | "USDT";
    amount: number;
    cryptoAssetAddress: string;
    onSuccess?: (txHash: string) => void;
    onError?: (error: Error) => void;
}

export function useOfframpTransaction() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [pendingTxData, setPendingTxData] = useState<{
        transactionReference: string;
        onSuccess?: (txHash: string) => void;
    } | null>(null);

    const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

    // Wait for transaction receipt
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // Check if user is on a supported chain
    const isSupportedChain = OFFRAMP_CHAIN_IDS.includes(chainId);

    // Get current network name for Cashwyre API
    const getCurrentNetwork = useCallback(() => {
        return CHAIN_TO_NETWORK[chainId] || "polygon";
    }, [chainId]);

    // Get token contract address for current chain
    const getTokenContract = useCallback((token: "USDC" | "USDT") => {
        const chainContracts = TOKEN_CONTRACTS[String(chainId)];
        if (!chainContracts) return null;
        return chainContracts[token] as `0x${string}` | null;
    }, [chainId]);

    // Get token decimals for current chain
    const getTokenDecimals = useCallback((token: "USDC" | "USDT") => {
        return TOKEN_DECIMALS[String(chainId)]?.[token] ?? 6;
    }, [chainId]);

    // Switch to supported chain
    const switchToSupportedChain = useCallback(async (targetChainId: number = 56) => {
        if (!switchChain) {
            toast.error("Chain switching not supported");
            return false;
        }

        try {
            await switchChain({ chainId: targetChainId });
            toast.success(`Switched to ${targetChainId === 137 ? "Polygon" : "BSC"}`);
            return true;
        } catch {
            toast.error("Failed to switch network");
            return false;
        }
    }, [switchChain]);

    // Handle TX confirmation
    useEffect(() => {
        if (isConfirmed && hash && pendingTxData) {
            toast.dismiss("tx-confirming");
            toast.success("Transaction confirmed on-chain!");

            // Update backend with confirmed TX
            cashwyreService.updateQuoteTxHash(
                pendingTxData.transactionReference,
                hash,
                address || ""
            ).catch(err => {
                console.error("Failed to update TX hash after confirmation:", err);
            });

            // Call success callback
            pendingTxData.onSuccess?.(hash);

            // Clean up
            setPendingTxData(null);
            setIsProcessing(false);
        }
    }, [isConfirmed, hash, pendingTxData, address]);

    // Send ERC20 transfer
    const sendOfframpTransaction = useCallback(async ({
        transactionReference,
        token,
        amount,
        cryptoAssetAddress,
        onSuccess,
        onError,
    }: UseOfframpTransactionProps) => {
        // Validation: Wallet connected
        if (!isConnected || !address) {
            toast.error("Please connect your wallet");
            return;
        }

        // Validation: Supported chain
        if (!isSupportedChain) {
            toast.error("Please switch to Polygon or BSC");
            const switched = await switchToSupportedChain();
            if (switched) {
                toast("Chain switched. Please confirm again.", { icon: "ℹ️" });
            }
            // Always return after chain switch - let state update
            return;
        }

        // Validation: Token contract exists
        const tokenContract = getTokenContract(token);
        if (!tokenContract) {
            toast.error(`${token} not supported on this network`);
            return;
        }

        // Validation: Valid deposit address
        if (!cryptoAssetAddress || !isAddress(cryptoAssetAddress)) {
            toast.error("Invalid deposit address received");
            console.error("Invalid address:", cryptoAssetAddress);
            return;
        }

        setIsProcessing(true);

        try {
            // Get correct decimals for token on this chain
            const decimals = getTokenDecimals(token);
            const amountInWei = parseUnits(amount.toString(), decimals);

            // Store pending TX data for confirmation callback
            setPendingTxData({ transactionReference, onSuccess });

            toast.loading("Please sign the transaction...", { id: "tx-signing" });

            // Send the transaction
            writeContract({
                address: tokenContract,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [cryptoAssetAddress as `0x${string}`, amountInWei],
            }, {
                onSuccess: async (hash) => {
                    toast.dismiss("tx-signing");
                    toast.loading("Transaction submitted, waiting for confirmation...", { id: "tx-confirming" });
                    setTxHash(hash);

                    // Optimistically update backend with TX hash
                    try {
                        await cashwyreService.updateQuoteTxHash(
                            transactionReference,
                            hash,
                            address
                        );
                    } catch (err) {
                        console.error("Failed to update TX hash:", err);
                    }

                    // Note: onSuccess will be called after confirmation via useEffect
                },
                onError: (error) => {
                    toast.dismiss("tx-signing");
                    toast.error("Transaction failed: " + error.message);
                    console.error("Transaction failed:", error);
                    onError?.(error);
                    setIsProcessing(false);
                    setPendingTxData(null);
                },
            });
        } catch (error) {
            toast.dismiss("tx-signing");
            const err = error instanceof Error ? error : new Error("Transaction failed");
            toast.error(err.message);
            console.error("Transaction error:", err);
            onError?.(err);
            setIsProcessing(false);
            setPendingTxData(null);
        }
    }, [
        isConnected,
        address,
        isSupportedChain,
        getTokenContract,
        getTokenDecimals,
        switchToSupportedChain,
        writeContract,
    ]);

    return {
        address,
        isConnected,
        chainId,
        isSupportedChain,
        getCurrentNetwork,
        switchToSupportedChain,
        sendOfframpTransaction,
        isProcessing: isProcessing || isWritePending,
        isConfirming,
        isConfirmed,
        txHash: hash || txHash,
        writeError,
    };
}
