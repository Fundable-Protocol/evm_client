import type { Call, AccountInterface } from "starknet";
import { cairo } from "starknet";
import { Chain } from "@starknet-react/chains";

import { getStreamContractAddress, durationToSeconds, recordStreamTx } from "@/lib/utills/stream";
import { getSupportedTokens } from "@/lib/utills";

export interface CreateStreamParams {
  name: string;
  recipient: string;
  tokenSymbol: string;
  totalAmount: string; 
  durationValue: number;
  durationUnit: "hour" | "day" | "week" | "month";
  cancellable: boolean;
  transferable: boolean;
}

export interface CreateStreamResult {
  transactionHash: string;
}

export class PaymentStreamService {
  static async createStream(
    account: AccountInterface | undefined,
    chain: Chain | undefined,
    params: CreateStreamParams
  ): Promise<CreateStreamResult> {
    const contractAddress = getStreamContractAddress(chain);

    if (!contractAddress)  throw new Error("Stream contract not configured");
    if (!account) throw new Error("Wallet not connected");

    // get token address
    const SUPPORTED_TOKENS = getSupportedTokens(chain?.network === "mainnet");
    const tokenAddress = SUPPORTED_TOKENS[
      params.tokenSymbol as keyof typeof SUPPORTED_TOKENS
    ]?.address;
    if (!tokenAddress) throw new Error("Unsupported token");

    const durationSeconds = durationToSeconds(
      params.durationValue,
      params.durationUnit
    );
    
    const { low, high } = cairo.uint256(params.totalAmount);

    // approve(token -> stream contract, amount), then create_stream(...)
    const calls: Call[] = [
      {
        entrypoint: "approve",
        contractAddress: tokenAddress,
        calldata: [contractAddress, low.toString(), high.toString()],
      },
      {
        entrypoint: "create_stream",
        contractAddress,
        calldata: [
          params.recipient,
          low,
          high,
          durationSeconds.toString(),
          params.cancellable ? "1" : "0",   
          tokenAddress, 
          params.transferable ? "1" : "0",
        ],
      },
    ];

    const result = await account.execute(calls);
    const tx = result.transaction_hash;
    
    await account.waitForTransaction(tx);

    recordStreamTx(
      {
        name: params.name,
        recipient: params.recipient,
        tokenSymbol: params.tokenSymbol,
        txHash: tx,
        network: chain?.network || "sepolia",
      },
      typeof window !== "undefined" ? window.localStorage : null
    );

    return { transactionHash: tx };
  }
}


