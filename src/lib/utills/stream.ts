import { Chain } from "@starknet-react/chains";

import { MAINNET_STREAM_CONTRACT_ADDRESS, TESTNET_STREAM_CONTRACT_ADDRESS } from "../constant";

export type DurationUnit = "hour" | "day" | "week" | "month" | "year";

export function getStreamContractAddress(chain?: Chain): string {
  const isMainnet = chain?.network === "mainnet";
  return isMainnet
    ? MAINNET_STREAM_CONTRACT_ADDRESS
    : TESTNET_STREAM_CONTRACT_ADDRESS;
}


export function normalizeAddress(address?: string): string {
  if (!address) return "";
  const lower = address.toLowerCase();
  const noPrefix = lower.startsWith("0x") ? lower.slice(2) : lower;
  const trimmed = noPrefix.replace(/^0+/, "");
  return `0x${trimmed}`;
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

export async function recordStreamTransaction(
  streamData: {
    usdRate?: string;
    transactionStatus?: string;
    network: string;
    duration: number;
    tokenDecimals: number;
    tokenSymbol: string;
    isCancellable: boolean;
    chainName: string;
    streamId: string;
    creator: string;
    recipient: string;
    amount: string;
    tokenAddress: string;
    isTransferable: boolean;
    transactionHash: string;
    totalUsdAmount?: string;
  }
): Promise<void> {
  try {
    const payload = {
      usd_rate: streamData.usdRate || "0.00",
      status: streamData.transactionStatus || "COMPLETED",
      network: streamData.network.toUpperCase(),
      duration: streamData.duration,
      token_decimals: streamData.tokenDecimals,
      token_symbol: streamData.tokenSymbol,
      is_cancellable: streamData.isCancellable,
      chain_name: streamData.chainName,
      created_at: Math.floor(Date.now() / 1000),
      is_transferable: streamData.isTransferable,
      total_usd_amount: streamData.totalUsdAmount || "0.00",
      stream_id: streamData.streamId,
      amount: streamData.amount,
      creator: streamData.creator,
      recipient: streamData.recipient,
      token_address: streamData.tokenAddress,
      transaction_hash: streamData.transactionHash,
    };

    const response = await fetch(
      "https://backend-main-no3f.onrender.com/api/payment-streams",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-id": streamData.creator,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {

    }
  } catch {

  }
}


