import type { Call, AccountInterface } from "starknet";
import { cairo } from "starknet";
import { Chain } from "@starknet-react/chains";

import { getStreamContractAddress, durationToSeconds, recordStreamTx } from "@/lib/utills/stream";
import { getSupportedTokens } from "@/lib/utills";
import type { CreateStreamParams, CreateStreamResponse } from "@/types/payment-stream";

export class PaymentStreamService {
  static async createStream(
    account: AccountInterface | undefined,
    chain: Chain | undefined,
    params: CreateStreamParams
  ): Promise<CreateStreamResponse> {
    const contractAddress = getStreamContractAddress(chain);

    if (!contractAddress)
      return { success: false, message: "Stream contract not configured" };
    if (!account)
      return { success: false, message: "Wallet not connected" };

    // get token address
    const SUPPORTED_TOKENS = getSupportedTokens(chain?.network === "mainnet");
    const tokenAddress = SUPPORTED_TOKENS[
      params.tokenSymbol as keyof typeof SUPPORTED_TOKENS
    ]?.address;
    if (!tokenAddress)
      return { success: false, message: "Unsupported token" };

    try {
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
          creator: account.address,
          isCancellable: params.cancellable,
          isTransferable: params.transferable,
          amount: params.totalAmount,
          duration: durationSeconds,
          chainName: chain?.name || "sepolia",
        },
        typeof window !== "undefined" ? window.localStorage : null
      );

      return { success: true, data: { transactionHash: tx } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create stream";
      return { success: false, message };
    }
  }
}


