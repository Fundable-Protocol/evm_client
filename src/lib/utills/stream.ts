import { Chain } from "@starknet-react/chains";

import { MAINNET_STREAM_CONTRACT_ADDRESS, TESTNET_STREAM_CONTRACT_ADDRESS } from "../constant";

export type DurationUnit = "hour" | "day" | "week" | "month" | "year";

export function getStreamContractAddress(chain?: Chain): string {
  const isMainnet = chain?.network === "mainnet";
  return isMainnet
    ? MAINNET_STREAM_CONTRACT_ADDRESS
    : TESTNET_STREAM_CONTRACT_ADDRESS;
}

export function durationToSeconds(value: number, unit: DurationUnit): number {
  switch (unit) {
    case "hour":
      return value * 60 * 60;
    case "day":
      return value * 24 * 60 * 60;
    case "week":
      return value * 7 * 24 * 60 * 60;
    case "month":
      // Use month as 30 days
      return value * 30 * 24 * 60 * 60;
    case "year":
      return value * 365 * 24 * 60 * 60;
    default:
      return value;
  }
}

export function recordStreamTx(
  data: {
    name: string;
    recipient: string;
    tokenSymbol: string;
    txHash: string;
    network: string;
    creator: string;
    isCancellable: boolean;
    isTransferable: boolean;
    amount: string;
    duration: number;
    chainName: string;
    streamId?: string;
  },
  storage: Pick<Storage, "getItem" | "setItem"> | null =
    typeof window !== "undefined" ? window.localStorage : null
): void {
  if (!storage) return;
  const key = "fundable:lastStreamTx";
  const existing = storage.getItem(key);
  const list = existing ? (JSON.parse(existing) as unknown[]) : [];
  list.unshift({ ...data, createdAt: new Date().toISOString() });
  storage.setItem(key, JSON.stringify(list.slice(0, 25)));
}


