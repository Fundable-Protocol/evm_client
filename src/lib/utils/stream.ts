import { Chain } from "@starknet-react/chains";

import {
  MAINNET_STREAM_CONTRACT_ADDRESS,
  TESTNET_STREAM_CONTRACT_ADDRESS,
} from "../constant";
import { tryCatch } from ".";
import PaymentStreamApiService from "@/services/api/paymentStreamService";

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
  console.log("value", value);
  console.log("unit", unit);
  switch (unit) {
    case "hour":
      return value * 1;
    case "day":
      return value * 24;
    case "week":
      return value * 7 * 24;
    case "month":
      // Use month as 30 days
      return value * 30 * 24;
    case "year":
      return value * 365 * 24;
    default:
      return value;
  }
}

export async function recordStreamTransaction(streamData: {
  usdRate?: string;
  transactionStatus?: string;
  network: string;
  duration: number;
  tokenDecimals: number;
  tokenSymbol: string;
  isCancellable: boolean;
  chainName: string;
  streamId?: string;
  creator: string;
  recipient: string;
  amount: string;
  tokenAddress: string;
  isTransferable: boolean;
  transactionHash: string;
  totalUsdAmount?: string;
}): Promise<void> {
  try {
    const payload = {
      usd_rate: streamData.usdRate || "0.00",
      status: streamData.transactionStatus || "active",
      network: streamData.network.toUpperCase(),
      duration: streamData.duration,
      token_decimals: streamData.tokenDecimals,
      token_symbol: streamData.tokenSymbol,
      is_cancellable: streamData.isCancellable,
      chain_name: streamData.chainName,
      created_at: Date.now(),
      is_transferable: streamData.isTransferable,
      total_usd_amount: streamData?.totalUsdAmount
        ? Number(streamData.totalUsdAmount)
        : 1,
      amount: streamData.amount,
      creator: streamData.creator,
      recipient: streamData.recipient,
      token_address: streamData.tokenAddress,
      transaction_hash: streamData.transactionHash,
    };

    const { data, error } = await tryCatch(
      PaymentStreamApiService.createStream(streamData.creator, payload)
    );

    // fetch(
    //   "https://backend-main-no3f.onrender.com/api/payment-streams",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-wallet-id": streamData.creator,
    //     },
    //     body: JSON.stringify(payload),
    //   }
    // );

    if (!data?.success) {
      throw new Error(error?.message || "Failed to store stream transaction");
    }
  } catch {
    throw new Error("Failed to store stream transaction");
  }
}

export function getStreamExplorerUrl(stream?: {
  transaction_hash?: string;
  network?: string;
}): string | undefined {
  if (!stream?.transaction_hash || !stream?.network) return;

  const baseUrl = stream.network?.toUpperCase() === "MAINNET"
    ? "https://voyager.online/tx/"
    : "https://sepolia.voyager.online/tx/";

  return `${baseUrl}${stream.transaction_hash}`;
}
