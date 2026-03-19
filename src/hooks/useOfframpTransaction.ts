"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { parseUnits, isAddress } from "viem";
import toast from "react-hot-toast";

import {
    TOKEN_CONTRACTS,
    OFFRAMP_CHAIN_IDS,
    CASHWYRE_NATIVE_CHAIN_IDS,
    BRIDGE_REQUIRED_CHAIN_IDS,
} from "@/types/offramp";
import { cashwyreService } from "@/services/cashwyreService";
import { calculateOfframpFee } from "@/utils/offramp-fee";
import { useAcrossBridge, POLYGON_TOKEN_ADDRESSES } from "@/hooks/useAcrossBridge";
import { parseWalletError } from "@/lib/parseWalletError";

// ─── ERC20 transfer ABI (used for direct Cashwyre deposit on Polygon / BSC) ──
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

// ─── Token decimals per chain ─────────────────────────────────────────────
const TOKEN_DECIMALS: Record<string, Record<string, number>> = {
    "137": { USDC: 6, USDT: 6 }, // Polygon
    "56": { USDC: 18, USDT: 18 }, // BSC
    "1135": { USDC: 6, USDT: 6 }, // Lisk
    "1": { USDC: 6, USDT: 6 }, // Ethereum
    "8453": { USDC: 6, USDT: 6 }, // Base
    "42161": { USDC: 6, USDT: 6 }, // Arbitrum
};

// ─── Chain ID → Cashwyre network name ────────────────────────────────────
// For bridged chains we always report "polygon" since Across delivers there.
const CHAIN_TO_NETWORK: Record<number, string> = {
    137: "polygon",
    56: "binance_smart_chain",
    // Bridge chains: Cashwyre receives on Polygon via Across
    1135: "polygon",
    1: "polygon",
    8453: "polygon",
    42161: "polygon",
};

// ─── Chain ID → display name (for toasts) ────────────────────────────────
const CHAIN_DISPLAY_NAME: Record<number, string> = {
    137: "Polygon",
    56: "BNB Smart Chain",
    1135: "Lisk",
    1: "Ethereum",
    8453: "Base",
    42161: "Arbitrum",
};

// ─────────────────────────────────────────────────────────────────────────────

interface UseOfframpTransactionProps {
    transactionReference: string;
    token: "USDC" | "USDT";
    /** Human-readable amount (string to avoid float precision issues) */
    amount: string;
    cryptoAssetAddress: string;
    onSuccess?: (txHash: string) => void;
    onError?: (error: Error) => void;
}

export function useOfframpTransaction() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const publicClient = usePublicClient();
    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [pendingTxData, setPendingTxData] = useState<{
        transactionReference: string;
        onSuccess?: (txHash: string) => void;
    } | null>(null);

    const isProcessingRef = useRef(false);

    // Across bridge hook (only used for non-native chains)
    const {
        executeAcrossBridge,
        isApproving,
        isDepositing,
        bridgeStep,
    } = useAcrossBridge();

    // Direct ERC20 transfer (Polygon / BSC)
    const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

    // Wait for on-chain confirmation of the direct transfer
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    // ── Derived state ──────────────────────────────────────────────────────
    const isSupportedChain = (OFFRAMP_CHAIN_IDS as readonly number[]).includes(chainId);
    const requiresBridge = (BRIDGE_REQUIRED_CHAIN_IDS as readonly number[]).includes(chainId);
    const isNativeChain = (CASHWYRE_NATIVE_CHAIN_IDS as readonly number[]).includes(chainId);

    const getCurrentNetwork = useCallback(() => CHAIN_TO_NETWORK[chainId] ?? "polygon", [chainId]);

    const getTokenContract = useCallback((token: "USDC" | "USDT") => {
        const chainContracts = TOKEN_CONTRACTS[String(chainId)];
        if (!chainContracts) return null;
        return chainContracts[token] as `0x${string}` | null;
    }, [chainId]);

    const getTokenDecimals = useCallback((token: "USDC" | "USDT") => {
        const decimals = TOKEN_DECIMALS[String(chainId)]?.[token];
        if (decimals === undefined) {
            throw new Error(`Token decimals not configured for ${token} on chain ${chainId}`);
        }
        return decimals;
    }, [chainId]);

    const switchToSupportedChain = useCallback(async (targetChainId = 137) => {
        if (!switchChain) { toast.error("Chain switching not supported"); return false; }
        try {
            await switchChain({ chainId: targetChainId });
            toast.success(`Switched to ${CHAIN_DISPLAY_NAME[targetChainId] ?? "supported chain"}`);
            return true;
        } catch {
            toast.error("Failed to switch network");
            return false;
        }
    }, [switchChain]);

    // ── Handle confirmation for direct transfers ───────────────────────────
    useEffect(() => {
        if (isConfirmed && hash && pendingTxData) {
            toast.dismiss("tx-confirming");
            toast.success("Transaction confirmed on-chain!");

            cashwyreService.updateQuoteTxHash(
                pendingTxData.transactionReference,
                hash,
                address ?? ""
            ).catch(err => console.error("Failed to update TX hash:", err));

            pendingTxData.onSuccess?.(hash);
            setPendingTxData(null);
            setIsProcessing(false);
            isProcessingRef.current = false;
        }
    }, [isConfirmed, hash, pendingTxData, address]);

    // ── Main entry point ──────────────────────────────────────────────────
    const sendOfframpTransaction = useCallback(async ({
        transactionReference,
        token,
        amount,
        cryptoAssetAddress,
        onSuccess,
        onError,
    }: UseOfframpTransactionProps) => {
        if (isProcessingRef.current) {
            toast("Transaction already in progress", { icon: "⏳" });
            return;
        }
        if (!isConnected || !address) {
            toast.error("Please connect your wallet");
            return;
        }
        if (!isSupportedChain) {
            toast.error(`Unsupported network. Please switch to a supported chain.`);
            await switchToSupportedChain();
            return;
        }
        if (!cryptoAssetAddress || !isAddress(cryptoAssetAddress)) {
            toast.error("Invalid deposit address received");
            return;
        }

        setIsProcessing(true);
        isProcessingRef.current = true;

        try {
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // PATH A: Direct ERC20 transfer (Polygon or BSC)
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            if (isNativeChain) {
                const tokenContract = getTokenContract(token);
                if (!tokenContract) {
                    toast.error(`${token} not supported on this network`);
                    setIsProcessing(false);
                    isProcessingRef.current = false;
                    return;
                }

                const decimals = getTokenDecimals(token);
                // Apply Fundable tiered fee on top of the Cashwyre deposit amount
                const feeResult = calculateOfframpFee(parseFloat(amount));
                const amountInWei = parseUnits(feeResult.totalDebit.toFixed(decimals), decimals);

                setPendingTxData({ transactionReference, onSuccess });
                toast.loading("Please sign the transaction…", { id: "tx-signing" });

                writeContract({
                    address: tokenContract,
                    abi: ERC20_ABI,
                    functionName: "transfer",
                    args: [cryptoAssetAddress as `0x${string}`, amountInWei],
                }, {
                    onSuccess: async (txHash) => {
                        toast.dismiss("tx-signing");
                        toast.loading("Waiting for confirmation…", { id: "tx-confirming" });
                        setTxHash(txHash);
                        try {
                            await cashwyreService.updateQuoteTxHash(transactionReference, txHash, address);
                        } catch (err) {
                            console.error("Failed to update TX hash:", err);
                        }
                    },
                    onError: (error) => {
                        toast.dismiss("tx-signing");
                        const msg = parseWalletError(error);
                        if (msg !== "Transaction cancelled") {
                            toast.error(msg);
                        }
                        onError?.(error);
                        setIsProcessing(false);
                        isProcessingRef.current = false;
                        setPendingTxData(null);
                    },
                });

                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // PATH B: Bridge via Across Protocol (Lisk, Ethereum, Base, Arbitrum)
                // The Across relayer delivers directly to cryptoAssetAddress on Polygon,
                // so no second transfer is required after bridging.
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            } else if (requiresBridge) {
                const decimals = getTokenDecimals(token);
                const inputToken = getTokenContract(token);
                const outputToken = POLYGON_TOKEN_ADDRESSES[token];

                if (!inputToken || !isAddress(inputToken)) {
                    toast.error(`${token} not configured on chain ${chainId}`);
                    setIsProcessing(false);
                    isProcessingRef.current = false;
                    return;
                }
                if (!outputToken || !isAddress(outputToken)) {
                    toast.error(`${token} output address not configured for Polygon`);
                    setIsProcessing(false);
                    isProcessingRef.current = false;
                    return;
                }

                // Verify source token address is a deployed contract
                if (publicClient) {
                    const inputCode = await publicClient.getCode({ address: inputToken as `0x${string}` });
                    if (!inputCode || inputCode === "0x") {
                        toast.error(`${token} contract not found on this network`);
                        setIsProcessing(false);
                        isProcessingRef.current = false;
                        return;
                    }
                }

                // Apply Fundable tiered fee on top of the Cashwyre deposit amount
                const feeResult = calculateOfframpFee(parseFloat(amount));
                const inputAmountRaw = parseUnits(feeResult.totalDebit.toFixed(decimals), decimals);

                const depositTxHash = await executeAcrossBridge({
                    depositorAddress: address,
                    recipientAddress: cryptoAssetAddress as `0x${string}`,
                    inputTokenAddress: inputToken as `0x${string}`,
                    outputTokenAddress: outputToken,
                    inputAmountRaw,
                    decimals,
                    displayAmount: `${amount} ${token}`,
                    sourceChainId: chainId,
                });

                if (!depositTxHash) {
                    // executeAcrossBridge already showed the error toast
                    onError?.(new Error("Bridge transaction failed"));
                    setIsProcessing(false);
                    isProcessingRef.current = false;
                    return;
                }

                setTxHash(depositTxHash);

                // Report bridge tx hash to backend → backend polls Across for fill
                try {
                    await cashwyreService.updateQuoteTxHash(
                        transactionReference,
                        depositTxHash,
                        address
                    );
                } catch (err) {
                    console.error("Failed to report bridge tx hash:", err);
                }

                toast.success("Bridge submitted! Funds arriving on Polygon shortly.");
                onSuccess?.(depositTxHash);
                setIsProcessing(false);
                isProcessingRef.current = false;
            }
        } catch (error) {
            toast.dismiss("tx-signing");
            const msg = parseWalletError(error);
            if (msg !== "Transaction cancelled") {
                toast.error(msg);
            }
            const err = error instanceof Error ? error : new Error(msg);
            onError?.(err);
            setIsProcessing(false);
            isProcessingRef.current = false;
            setPendingTxData(null);
        }
    }, [
        isConnected, address, isSupportedChain, isNativeChain, requiresBridge,
        chainId, publicClient, getTokenContract, getTokenDecimals, switchToSupportedChain,
        writeContract, executeAcrossBridge,
    ]);

    return {
        address,
        isConnected,
        chainId,
        isSupportedChain,
        requiresBridge,
        getCurrentNetwork,
        switchToSupportedChain,
        sendOfframpTransaction,
        isProcessing: isProcessing || isWritePending || isApproving || isDepositing,
        isConfirming,
        isConfirmed,
        txHash: hash || txHash,
        bridgeStep,
        writeError,
    };
}
