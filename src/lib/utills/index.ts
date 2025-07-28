import crypto from "crypto";
import { parseUnits } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

import {
  MAINNET_CONTRACT_ADDRESS,
  MAINNET_SUPPORTED_TOKENS,
  TESTNET_CONTRACT_ADDRESS,
  TESTNET_SUPPORTED_TOKENS,
} from "../constant";
import { IDistributionData } from "@/types/distribution";
import { isValidAmount, isValidStarknetAddress } from "@/validations";
import { ErrorWithCode, PromiseResult, TokenOption } from "@/types";
import { Chain } from "@starknet-react/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sliceAddress = (address: string) => {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
};

export const capitalizeWord = (str: string) => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;

  // Primary method: User Agent + Touch support check
  const userAgent = navigator?.userAgent.toLowerCase();

  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
  const hasTouchSupport =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Backup method: Screen size
  const isSmallScreen = window.innerWidth <= 768;

  // Combine checks: Must match user agent AND (touch support OR small screen)
  return isMobileUA && (hasTouchSupport || isSmallScreen);
};

export const createEmptyRow = (data?: IDistributionData): IDistributionData => {
  const rowId = uuidv4();

  if (data) return { ...data, id: rowId };

  return {
    id: rowId,
    label: "",
    amount: "",
    address: "",
    starkAddress: "",
  };
};

export const getContractAddress = (isMainnet: boolean) =>
  isMainnet ? MAINNET_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;

export const getSupportedTokens = (isMainnet: boolean) =>
  isMainnet ? MAINNET_SUPPORTED_TOKENS : TESTNET_SUPPORTED_TOKENS;

export const getTokenOptions = (chain: Chain) => {
  const isMainNet = chain.network === "mainnet";

  const SUPPORTED_TOKENS = getSupportedTokens(isMainNet);

  const tokenOptions = Object.values(getSupportedTokens(isMainNet)).map(
    (token) => ({
      label: token.symbol,
      value: token.symbol,
    })
  );

  return { isMainNet, SUPPORTED_TOKENS, tokenOptions };
};

export const validateDistribution = (
  address: string,
  amount: string
): { isValid: boolean; error?: string } => {
  if (!isValidStarknetAddress(address)) {
    return { isValid: false, error: "Invalid Starknet address" };
  }

  if (!isValidAmount(amount)) {
    return { isValid: false, error: "Invalid amount" };
  }

  return { isValid: true };
};

export const calculateTotalDistributionAmount = (
  distributions: IDistributionData[],
  selectedToken: Readonly<TokenOption>,
  protocolFeePercentage = 0
) => {
  const amounts = distributions.map((dist) =>
    BigInt(parseUnits(dist.amount || "0", selectedToken.decimals))
  );

  const totalAmount = amounts.reduce(
    (sum, amount) => sum + BigInt(amount),
    BigInt(0)
  );

  const protocolFee =
    (totalAmount * BigInt(protocolFeePercentage || 0)) / BigInt(10000);

  const totalAmountWithFee = totalAmount + protocolFee;

  const totalAmountString = (
    Number(totalAmountWithFee) /
    10 ** selectedToken.decimals
  ).toString();

  return {
    amounts,
    totalAmount,
    protocolFee,
    totalAmountString,
    totalAmountWithFee,
  };
};

export function generateUUID() {
  return crypto.randomUUID();
}

export function generateRandomUUID() {
  return Math.random().toString(36).slice(2);
}

export const generateKey = crypto.randomBytes(32).toString("hex");

export const formatThousandNumber = (number: number) => {
  if (!number) return "0";

  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;

  return String(number);
};

export async function tryCatch<T, E = ErrorWithCode>(
  promise: Promise<T>
): Promise<PromiseResult<T, E>> {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (error) {
    return { data: null, success: false, error: error as E };
  }
}

export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "FAILED":
      return "bg-red-500";
    case "PENDING":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};
