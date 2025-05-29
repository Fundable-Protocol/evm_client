import { v4 as uuidv4 } from "uuid";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

import { IDistributionRowData } from "@/types/distribution";
import {
  MAINNET_CONTRACT_ADDRESS,
  MAINNET_SUPPORTED_TOKENS,
  TESTNET_CONTRACT_ADDRESS,
  TESTNET_SUPPORTED_TOKENS,
} from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sliceAddress = (address: string) => {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
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

export const createEmptyRow = (): IDistributionRowData => ({
  id: uuidv4(),
  address: "",
  amount: "",
});

export const getContractAddress = (isMainnet: boolean) =>
  isMainnet ? MAINNET_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;

export const getSupportedTokens = (isMainnet: boolean) =>
  isMainnet ? MAINNET_SUPPORTED_TOKENS : TESTNET_SUPPORTED_TOKENS;
