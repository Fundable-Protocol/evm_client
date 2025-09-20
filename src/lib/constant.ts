import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

import { TokenOption } from "@/types";

export const databaseUrl = process.env.DATABASE_URL ?? "";

export const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";

export const projectId = "4f854415eedab0dd9258793f029e728d";

export const distributionType = ["equal", "weighted"] as const;

export const supportedNetwork = ["mainnet", "testnet"] as const;

export const distributionStatus = ["completed", "failed", "pending"] as const;

export const paymentStreamStatus = [
  "active",
  "paused",
  "canceled",
  "completed",
  "transfered",
] as const;

export const equalDistributionType = [
  { label: "Equal amount per address", value: "amount_per_address" },
  { label: "Calculate Lump Sum", value: "lump_sum" },
] as const;

export const MAINNET_SUPPORTED_TOKENS = Object.freeze({
  STRK: {
    symbol: "STRK",
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
  },
  USDC: {
    symbol: "USDC",
    address:
      "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    decimals: 6,
  },
  ETH: {
    symbol: "ETH",
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
  },
  USDT: {
    symbol: "USDT",
    address:
      "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    decimals: 6,
  },
}) as Readonly<Record<string, Readonly<TokenOption>>>;

export const TESTNET_SUPPORTED_TOKENS = Object.freeze({
  STRK: {
    symbol: "STRK",
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
  },
  USDC: {
    symbol: "USDC",
    address:
      "0x05be0e73ef0f477eb8d4fbea87802acbf55c266c2bab64aa93b2db573be15c41",
    decimals: 6,
  },
  ETH: {
    symbol: "ETH",
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
  },
}) as Readonly<Record<string, Readonly<TokenOption>>>;

export const TESTNET_CONTRACT_ADDRESS =
  "0x02495b0832001cde19e2bd3ec27beabe07b913000e155864a77b5e834ce60b6a";

export const MAINNET_CONTRACT_ADDRESS =
  "0x67a27274b63fa3b070cabf7adf59e7b1c1e5b768b18f84b50f6cb85f59c42e5";

export const MAINNET_RPC_URL = process.env.STARKNET_RPC_MAINNET ?? "";

export const TESTNET_RPC_URL = process.env.STARKNET_RPC_TESTNET ?? "";

export const TESTNET_STREAM_CONTRACT_ADDRESS =
  "0x0150f8e99d665ab76dca2f5816930cf14987d947a6ea7e0934c6ac2b4243b735";

export const MAINNET_STREAM_CONTRACT_ADDRESS =
  "0x07097d3e5851088ce1d8bf9280c3f9b52f59db92bf5af2226338f15c837f13bd";

export const distributionState = [
  "process-started",
  "initiate-distribution",
  "process-completed",
  "request-confirmed",
  "request-confirmation",
] as const;

export const transactionCardTypes = [
  "amount",
  "distributions",
  "addresses",
] as const;

export const supportedTokenSymbol = ["STRK", "USDT", "USDC", "ETH"] as const;

export const featureCardImgTypes = ["airdrop", "stream"] as const;

export const apiSecretKey = process.env.API_SECRET_KEY || "";

export const supportedChainName = ["Starknet", "Ethereum"] as const;

export const validPageLimits = [10, 20, 50] as const;
