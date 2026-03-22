"use client";

import { useCallback, useState } from "react";
import {
    useWriteContract,
    usePublicClient,
} from "wagmi";
import { parseUnits, maxUint256 } from "viem";
import toast from "react-hot-toast";

import { ACROSS_BRIDGE_TARGET_CHAIN_ID } from "@/types/offramp";
import { parseWalletError } from "@/lib/parseWalletError";

// ─── Across SpokePool ABI (deposit function only) ──────────────────────────
// Using the V3 SpokePool interface (depositV3)
const SPOKE_POOL_ABI = [
    {
        name: "depositV3",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "depositor", type: "address" },
            { name: "recipient", type: "address" },
            { name: "inputToken", type: "address" },
            { name: "outputToken", type: "address" },
            { name: "inputAmount", type: "uint256" },
            { name: "outputAmount", type: "uint256" },
            { name: "destinationChainId", type: "uint256" },
            { name: "exclusiveRelayer", type: "address" },
            { name: "quoteTimestamp", type: "uint32" },
            { name: "fillDeadline", type: "uint32" },
            { name: "exclusivityDeadline", type: "uint32" },
            { name: "message", type: "bytes" },
        ],
        outputs: [],
    },
] as const;

// ERC20 approve ABI (needed before depositV3 for non-ETH tokens)
const ERC20_ABI = [
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;

// ─── SpokePool contract addresses per chain ────────────────────────────────
// Source: https://docs.across.to/reference/contract-addresses
const SPOKE_POOL_ADDRESSES: Record<number, `0x${string}`> = {
    1135: "0x9552a0a6624A23B848060AE5901659CDDa1f83f8", // Lisk
    1: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5", // Ethereum
    8453: "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64", // Base
    42161: "0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A", // Arbitrum
    137: "0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096", // Polygon (source too)
    56: "0x4e8E101924eDE233C13e2D8622DC8aED2872d505", // BSC
};

// ─── Across Suggested Fees API ─────────────────────────────────────────────
// https://app.across.to/api/suggested-fees
const ACROSS_API_BASE = "https://app.across.to/api";

export interface AcrossQuote {
    inputAmount: bigint;
    outputAmount: bigint;       // inputAmount minus Across relay fee
    quoteTimestamp: number;
    fillDeadline: number;
    exclusivityDeadline: number;
    exclusiveRelayer: `0x${string}`;
    relayFeePercent: string;     // human-readable, e.g. "0.06"
    estimatedFillTimeSec: number;
}

export interface AcrossBridgeParams {
    /** EVM address of depositor (= connected wallet) */
    depositorAddress: `0x${string}`;
    /** Where Across delivers funds on the dest chain (= Cashwyre deposit address) */
    recipientAddress: `0x${string}`;
    /** Token contract on the source chain */
    inputTokenAddress: `0x${string}`;
    /** Token contract on the destination chain (Polygon) */
    outputTokenAddress: `0x${string}`;
    /** Exact amount to bridge, AFTER applying the 0.05% Fundable markup (in token decimals) */
    inputAmountRaw: bigint;
    /** Token decimals */
    decimals: number;
    /** Human-readable input amount (for toasts) */
    displayAmount: string;
    /** Source chain ID */
    sourceChainId: number;
}

export type AcrossBridgeStep = "idle" | "approving" | "depositing" | "submitted";

interface UseAcrossBridgeReturn {
    bridgeStep: AcrossBridgeStep;
    getAcrossQuote: (params: Pick<AcrossBridgeParams,
        "inputTokenAddress" | "outputTokenAddress" | "inputAmountRaw" | "sourceChainId"
    >) => Promise<AcrossQuote | null>;
    executeAcrossBridge: (params: AcrossBridgeParams) => Promise<string | null>; // returns source txHash
    isApproving: boolean;
    isDepositing: boolean;
    bridgeError: string | null;
}

/**
 * Hook for bridging ERC-20 tokens via Across Protocol to Polygon.
 *
 * Flow:
 *  1. Fetch a suggested-fees quote from the Across API
 *  2. Approve the SpokePool to spend the input token (if needed)
 *  3. Call SpokePool.depositV3() — Across relayer fills on Polygon within seconds
 *  4. Return the source-chain deposit tx hash so the backend can track fill status
 */
export function useAcrossBridge(): UseAcrossBridgeReturn {
    const publicClient = usePublicClient();
    const [bridgeStep, setBridgeStep] = useState<AcrossBridgeStep>("idle");
    const [bridgeError, setBridgeError] = useState<string | null>(null);

    // For ERC20 approval
    const {
        writeContractAsync: approveAsync,
        isPending: isApproving,
    } = useWriteContract();

    // For SpokePool deposit
    const {
        writeContractAsync: depositAsync,
        isPending: isDepositing,
    } = useWriteContract();

    // ── 1. Fetch Across Suggested Fees Quote ──────────────────────────────
    const getAcrossQuote = useCallback(async ({
        inputTokenAddress,
        outputTokenAddress,
        inputAmountRaw,
        sourceChainId,
    }: Pick<AcrossBridgeParams, "inputTokenAddress" | "outputTokenAddress" | "inputAmountRaw" | "sourceChainId">): Promise<AcrossQuote | null> => {
        try {
            const params = new URLSearchParams({
                inputToken: inputTokenAddress,
                outputToken: outputTokenAddress,
                originChainId: sourceChainId.toString(),
                destinationChainId: ACROSS_BRIDGE_TARGET_CHAIN_ID.toString(),
                amount: inputAmountRaw.toString(),
                allowUnmatchedDecimals: "true",
            });

            const res = await fetch(`${ACROSS_API_BASE}/suggested-fees?${params}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Across API error: ${text}`);
            }

            const data = await res.json();

            const now = Math.floor(Date.now() / 1000);

            // Fix: outputAmount is a top-level field in the Across suggested-fees response.
            // Must parse it directly — don't mix ?? with ?: on the same expression.
            let outputAmount: bigint;
            if (data.outputAmount != null) {
                outputAmount = BigInt(data.outputAmount);
            } else if (data.totalRelayFee?.total != null) {
                outputAmount = inputAmountRaw - BigInt(data.totalRelayFee.total);
            } else {
                outputAmount = inputAmountRaw; // fallback: no fee deducted
            }

            return {
                inputAmount: inputAmountRaw,
                outputAmount,
                quoteTimestamp: data.timestamp ?? now,
                fillDeadline: now + (data.fillDeadlineBufferSeconds ?? 21600),
                exclusivityDeadline: data.exclusivityDeadline ?? 0,
                exclusiveRelayer: (data.exclusiveRelayer ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
                relayFeePercent: data.relayFeePercent ?? "—",
                estimatedFillTimeSec: data.estimatedFillTimeSec ?? 10,
            };
        } catch (err) {
            console.error("[useAcrossBridge] getAcrossQuote failed:", err);
            return null;
        }
    }, []);

    // ── 2. Execute: Approve + Deposit ─────────────────────────────────────
    const executeAcrossBridge = useCallback(async ({
        depositorAddress,
        recipientAddress,
        inputTokenAddress,
        outputTokenAddress,
        inputAmountRaw,
        displayAmount,
        sourceChainId,
    }: AcrossBridgeParams): Promise<string | null> => {
        setBridgeError(null);
        const spokePool = SPOKE_POOL_ADDRESSES[sourceChainId];

        if (!spokePool || spokePool === "0x000000000000000000000000000000000000000") {
            const msg = `No Across SpokePool configured for chain ${sourceChainId}`;
            setBridgeError(msg);
            toast.error(msg);
            return null;
        }

        try {
            // ── Step A: Check & request ERC20 approval ──────────────────
            if (publicClient) {
                const currentAllowance = await publicClient.readContract({
                    address: inputTokenAddress,
                    abi: ERC20_ABI,
                    functionName: "allowance",
                    args: [depositorAddress, spokePool],
                }) as bigint;

                if (currentAllowance < inputAmountRaw) {
                    setBridgeStep("approving");
                    toast.loading("Approving token spend…", { id: "across-approve" });

                    const approveTxHash = await approveAsync({
                        address: inputTokenAddress,
                        abi: ERC20_ABI,
                        functionName: "approve",
                        args: [spokePool, maxUint256],
                    });

                    // ⚠️ CRITICAL: wait for the approval to be mined before
                    // calling depositV3. approveAsync resolves as soon as the tx
                    // reaches the mempool; if we proceed immediately the SpokePool
                    // still sees allowance = 0 and the deposit reverts.
                    toast.loading("Waiting for approval confirmation…", { id: "across-approve" });
                    await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

                    toast.dismiss("across-approve");
                    toast.success("Token approved");
                }
            }

            // ── Step B: Fetch quote for accurate outputAmount ────────────
            const quote = await getAcrossQuote({
                inputTokenAddress,
                outputTokenAddress,
                inputAmountRaw,
                sourceChainId,
            });

            if (!quote) {
                throw new Error("Failed to fetch Across bridge quote");
            }

            // ── Step C: Call SpokePool.depositV3 ────────────────────────
            setBridgeStep("depositing");
            toast.loading(`Bridging ${displayAmount} to Polygon…`, { id: "across-deposit" });

            const depositTxHash = await depositAsync({
                address: spokePool,
                abi: SPOKE_POOL_ABI,
                functionName: "depositV3",
                args: [
                    depositorAddress,         // depositor
                    recipientAddress,         // recipient (= Cashwyre deposit address on Polygon)
                    inputTokenAddress,        // inputToken
                    outputTokenAddress,       // outputToken (same token on Polygon)
                    inputAmountRaw,           // inputAmount
                    quote.outputAmount,       // outputAmount (after Across relay fee)
                    BigInt(ACROSS_BRIDGE_TARGET_CHAIN_ID), // destinationChainId
                    quote.exclusiveRelayer,   // exclusiveRelayer
                    quote.quoteTimestamp,     // quoteTimestamp
                    quote.fillDeadline,       // fillDeadline
                    quote.exclusivityDeadline,// exclusivityDeadline
                    "0x",                     // message (empty)
                ],
            });

            toast.dismiss("across-deposit");
            setBridgeStep("submitted");

            return depositTxHash;
        } catch (err) {
            toast.dismiss("across-approve");
            toast.dismiss("across-deposit");
            setBridgeStep("idle");

            const msg = parseWalletError(err);
            setBridgeError(msg);

            // Silent for user cancellations, toast for real errors
            if (msg !== "Transaction cancelled") {
                toast.error(msg);
            }
            return null;
        }
    }, [publicClient, approveAsync, depositAsync, getAcrossQuote]);

    return {
        bridgeStep,
        getAcrossQuote,
        executeAcrossBridge,
        isApproving,
        isDepositing,
        bridgeError,
    };
}

// ─── Helper: Apply Fundable 0.05% markup to bridge amount ──────────────────
/**
 * Given the Cashwyre quote's totalDepositInCryptoAsset, returns the
 * raw bigint amount to pass into Across (amount + 0.05% Fundable fee).
 */
export function applyBridgeMarkup(amountStr: string, decimals: number): bigint {
    // Multiply by 1.0005
    const base = parseUnits(amountStr, decimals);
    const markup = (base * BigInt(5)) / BigInt(10000); // 0.05% = 5/10000
    return base + markup;
}

// ─── Helper: Token address on Polygon for a given token symbol ────────────
export const POLYGON_TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
};
