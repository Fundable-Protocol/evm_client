import type { Call, AccountInterface } from "starknet";
import { cairo } from "starknet";
import { Chain } from "@starknet-react/chains";

import {
  durationToSeconds,
  recordStreamTransaction,
  getStreamContractAddress,
} from "@/lib/utils/stream";
import { getTokenOptions } from "@/lib/utils";
import { fetchTokenPrices } from "@/services/apiServices";
import type {
  CreateStreamParams,
  CreateStreamResponse,
} from "@/types/payment-stream";

export class PaymentStreamService {
  static async createStream(
    account: AccountInterface | undefined,
    chain: Chain | undefined,
    params: CreateStreamParams & { creator: string }
  ): Promise<CreateStreamResponse> {
    const contractAddress = getStreamContractAddress(chain);

    if (!contractAddress) {
      return { success: false, message: "Stream contract not configured" };
    }

    if (!account) return { success: false, message: "Wallet not connected" };

    const { isMainNet, SUPPORTED_TOKENS } = getTokenOptions(chain!);

    const tokenAddress = SUPPORTED_TOKENS[params.tokenSymbol]?.address;

    if (!tokenAddress) return { success: false, message: "Unsupported token" };

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
            durationSeconds,
            params.cancellable ? "1" : "0",
            tokenAddress,
            params.transferable ? "1" : "0",
          ],
        },
      ];

      const result = await account.execute(calls);
      const tx = result.transaction_hash;

      // // record stream transaction to backend
      const tokenInfo =
        SUPPORTED_TOKENS[params.tokenSymbol as keyof typeof SUPPORTED_TOKENS];

      // Get USD rate for the token
      const tokenPrices = await fetchTokenPrices(["starknet", "ethereum"]);
      let usdRate = 1;

      if (params.tokenSymbol === "STRK") {
        usdRate = tokenPrices?.["starknet"]?.usd ?? 1;
      } else if (params.tokenSymbol === "ETH") {
        usdRate = tokenPrices?.["ethereum"]?.usd ?? 1;
      }

      // Calculate total USD amount
      const totalUsdAmount =
        (Number(params.totalAmount) / Math.pow(10, tokenInfo.decimals)) *
        usdRate;

      await recordStreamTransaction({
        // streamId: streamId ? BigInt(streamId).toString() : "UNKNOWN",
        creator: params.creator,
        recipient: params.recipient,
        amount: params.totalAmount,
        tokenSymbol: params.tokenSymbol,
        tokenAddress: tokenInfo.address,
        tokenDecimals: tokenInfo.decimals,
        duration: durationSeconds,
        isCancellable: params.cancellable,
        isTransferable: params.transferable,
        network: isMainNet ? "MAINNET" : "TESTNET",
        chainName: chain!.name,
        transactionHash: tx,
        usdRate: usdRate.toString(),
        totalUsdAmount: totalUsdAmount.toFixed(2),
      });

      return { success: true, data: { transactionHash: tx } };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create stream";
      return { success: false, message };
    }
  }
}
