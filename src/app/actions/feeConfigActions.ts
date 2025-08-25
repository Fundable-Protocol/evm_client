"use server";

import { tryCatch } from "@/lib/utills";
import { db } from "../../../db/drizzle";
import { and, eq, ilike } from "drizzle-orm";
import { feeConfigModel } from "../../../db/schema";
import { supportedChainName, supportedNetwork } from "@/lib/constant";

export async function getProtocolFee(
  network: (typeof supportedNetwork)[number] = "testnet",
  chainName: (typeof supportedChainName)[number] = "Starknet"
) {
  try {
    const andQuery = and(
      eq(
        feeConfigModel.network,
        network?.toUpperCase() as "mainnet" | "testnet"
      ),
      ilike(feeConfigModel.chainName, chainName)
    );

    const { data: protocolFee, error: protocolFeeError } = await tryCatch(
      db
        .select({
          id: feeConfigModel.id,
          amount: feeConfigModel.amount,
          network: feeConfigModel.network,
          chainName: feeConfigModel.chainName,
        })
        .from(feeConfigModel)
        .where(andQuery)
    );

    return {
      success: !protocolFeeError,
      data: {
        protocolFee: Number(protocolFee?.[0]?.amount ?? 0),
      },
      error: protocolFeeError,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}