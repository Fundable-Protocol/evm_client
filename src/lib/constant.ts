import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

import { TokenOption } from "@/types";

export const databaseUrl = process.env.DATABASE_URL ?? "";

export const projectId = "4f854415eedab0dd9258793f029e728d";

export const distributionType = ["equal", "weighted"] as const;

export const supportedNetwork = ["mainnet", "testnet"] as const;

export const distributionStatus = ["completed", "failed", "pending"] as const;

export const equalDistributionType = [
  { label: "Equal amount per address", value: "amount_per_address" },
  { label: "Calculate Lump Sum", value: "lump_sum" },
] as const;

export const MAINNET_SUPPORTED_TOKENS = Object.freeze({
  USDC: {
    symbol: "USDC",
    address:
      "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  }
}) as Readonly<Record<string, Readonly<TokenOption>>>;

export const TESTNET_SUPPORTED_TOKENS = Object.freeze({
  USDC: {
    symbol: "USDC",
    address:
      "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    decimals: 6,
  }
}) as Readonly<Record<string, Readonly<TokenOption>>>;

export const TESTNET_CONTRACT_ADDRESS =
  "0xaa0939b802060785c541553911caa6781c41f5d5";

export const MAINNET_CONTRACT_ADDRESS =
  "0xaa0939b802060785c541553911caa6781c41f5d5";

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
