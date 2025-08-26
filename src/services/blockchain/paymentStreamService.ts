import type { Call, AccountInterface } from "starknet";
import { cairo } from "starknet";
import { Chain } from "@starknet-react/chains";

import {
  getStreamContractAddress,
  durationToSeconds,
  normalizeAddress,
  recordStreamTransaction,
} from "@/lib/utills/stream";
import { getSupportedTokens } from "@/lib/utills";
import { fetchTokenPrices } from "@/services/apiServices";
import type {
  CreateStreamParams,
  CreateStreamResponse,
} from "@/types/payment-stream";

export class PaymentStreamService {
  static async createStream(
    account: AccountInterface | undefined,
    chain: Chain | undefined,
    params: CreateStreamParams
  ): Promise<CreateStreamResponse> {
    const contractAddress = getStreamContractAddress(chain);

    if (!contractAddress)
      return { success: false, message: "Stream contract not configured" };
    if (!account) return { success: false, message: "Wallet not connected" };

    // get token address
    const SUPPORTED_TOKENS = getSupportedTokens(chain?.network === "mainnet");
    const tokenAddress =
      SUPPORTED_TOKENS[params.tokenSymbol as keyof typeof SUPPORTED_TOKENS]
        ?.address;
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
            durationSeconds.toString(),
            params.cancellable ? "1" : "0",
            tokenAddress,
            params.transferable ? "1" : "0",
          ],
        },
      ];

      const result = await account.execute(calls);
      const tx = result.transaction_hash;
      const waited = await account.waitForTransaction(tx);

      // extract stream id from the transaction receipt events
      let streamId: string | undefined = undefined;

      type MinimalEvent = {
        from_address: string;
        keys?: string[];
        data?: string[];
      };

      type MinimalReceipt = { events?: MinimalEvent[] };
      const receipt = waited as unknown as MinimalReceipt;
      const events = receipt?.events ?? [];
      const streamEvents = events.filter(
        (e) =>
          typeof e?.from_address === "string" &&
          normalizeAddress(e.from_address) === normalizeAddress(contractAddress)
      );

      // try matching by StreamCreated selector
      const streamCreatedSelector =
        "0x289bd09ddaa7c41a0543ffe671c3d622964f675a5af7f14f27e1d3b46bd8194".toLowerCase();

      const candidate = streamEvents.find(
        (e) => e?.keys?.[0]?.toLowerCase() === streamCreatedSelector
      );

      if (candidate?.keys && candidate.keys.length > 1) {
        const id = candidate.keys[1];
        try {
          // validate it is numeric
          streamId = id;
        } catch {
          streamId = undefined;
        }
      }

      // record stream transaction to backend
      const tokenInfo = SUPPORTED_TOKENS[params.tokenSymbol as keyof typeof SUPPORTED_TOKENS];
      if (tokenInfo) {
        // Get USD rate for the token
        const tokenPrices = await fetchTokenPrices(["starknet", "ethereum"]);
        let usdRate = 1;
        
        if (params.tokenSymbol === "STRK") {
          usdRate = tokenPrices?.["starknet"]?.usd ?? 1;
        } else if (params.tokenSymbol === "ETH") {
          usdRate = tokenPrices?.["ethereum"]?.usd ?? 1;
        }
        
        // Calculate total USD amount
        const totalUsdAmount = (Number(params.totalAmount) / Math.pow(10, tokenInfo.decimals)) * usdRate;
        
        await recordStreamTransaction({
          streamId: streamId ? BigInt(streamId).toString() : "UNKNOWN",
          creator: account.address,
          recipient: params.recipient,
          amount: params.totalAmount,
          tokenSymbol: params.tokenSymbol,
          tokenAddress: tokenInfo.address,
          tokenDecimals: tokenInfo.decimals,
          duration: durationSeconds,
          isCancellable: params.cancellable,
          isTransferable: params.transferable,
          network: chain?.network || "sepolia",
          chainName: chain?.name || "sepolia",
          transactionHash: tx,
          usdRate: usdRate.toString(),
          totalUsdAmount: totalUsdAmount.toFixed(2),
        });
      }

      return { success: true, data: { transactionHash: tx } };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create stream";
      return { success: false, message };
    }
  }
}
