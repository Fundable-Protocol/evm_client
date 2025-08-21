import type { Call, AccountInterface } from "starknet";
import { cairo, num } from "starknet";
import { Chain } from "@starknet-react/chains";

import { getStreamContractAddress, durationToSeconds, recordStreamTx, normalizeAddress } from "@/lib/utills/stream";
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
      const waited = await account.waitForTransaction(tx);

      // extract stream id from the transaction receipt events
      let streamId: string | undefined = undefined;
      type MinimalEvent = { from_address: string; keys?: string[]; data?: string[] };
      type MinimalReceipt = { events?: MinimalEvent[] };
      const receipt = (waited as unknown) as MinimalReceipt;
      const events = receipt?.events ?? [];
      const streamEvents = events.filter(
        (e) => typeof e?.from_address === "string" && normalizeAddress(e.from_address) === normalizeAddress(contractAddress)
      );

      // try matching by StreamCreated selector
      const streamCreatedSelector = "0x289bd09ddaa7c41a0543ffe671c3d622964f675a5af7f14f27e1d3b46bd8194".toLowerCase();
      const candidate = streamEvents.find((e) => e?.keys?.[0]?.toLowerCase() === streamCreatedSelector);


      if (candidate?.keys && candidate.keys.length > 1) {
        const id = candidate.keys[1];
        try {
          // validate it is numeric
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _ = num.toBigInt(id);
          streamId = id;
        } catch {
          streamId = undefined;
        }
      }
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
          streamId: Number(streamId),
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


