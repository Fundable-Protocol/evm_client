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

export const SUPPORTED_TOKENS: Record<
  string, // network: "mainnet" | "testnet"
  Record<
    string, // chain: "ethereum" | "base" | "arbitrum" | etc.
    Record<string, TokenOption> // token symbol: "USDC", "ETH", etc.
  >
> = {
  mainnet: {
    ethereum: {
      USDC: { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
      ETH: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
    },
    base: {
      USDC: { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
    },
    arbitrum: {
      USDC: { symbol: "USDC", address: "0x0000000000000000000000000000000000000002", decimals: 6 },
    },
    "bnb smart chain": {
      USDC: { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
      LUR: { symbol: "LUR", address: "0xc66B6f38aE5053A109cfd8639E0Ee17EC69cf788", decimals: 18 },
    },
    // ...add more chains as needed
  },
  testnet: {
    ethereum: {
      USDC: { symbol: "USDC", address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", decimals: 6 },
    },
    base: {
      USDC: { symbol: "USDC", address: "0x0000000000000000000000000000000000000003", decimals: 6 },
    },
    arbitrum: {
      USDC: { symbol: "USDC", address: "0x0000000000000000000000000000000000000004", decimals: 6 },
    },
    // ...add more chains as needed
  },
  // ...add more networks as needed
};

export const CONTRACT_ADDRESS =
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

export const supportedChainName = ["Starknet", "Ethereum"] as const;

export const featureCardImgTypes = ["airdrop", "stream"] as const;

export const apiSecretKey = process.env.API_SECRET_KEY || "";

export const validPageLimits = [10, 20, 50] as const;
