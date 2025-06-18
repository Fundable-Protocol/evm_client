"use server";

import { tryCatch } from "@/lib/utills";
import { db } from "../../../db/drizzle";
import { and, eq, ilike } from "drizzle-orm";
import { feeConfigModel } from "../../../db/schema";
import { supportedChainName, supportedNetwork } from "@/lib/constant";

// export async function createFeeConfigs() {
//   try {
//     // Create mainnet fee config
//     const mainnetConfig = await db.insert(feeConfigModel).values({
//       amount: "100",
//       network: "mainnet",
//       chainId: "SN_MAIN",
//       chainName: "Starknet",
//     });

//     // Create testnet fee config
//     const testnetConfig = await db.insert(feeConfigModel).values({
//       amount: "2500",
//       network: "testnet",
//       chainId: "SN_SEPOLIA",
//       chainName: "Starknet",
//     });

//     return {
//       success: true,
//       message: "Fee configurations created successfully",
//       data: {
//         mainnet: mainnetConfig,
//         testnet: testnetConfig,
//       },
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: "Failed to create fee configurations",
//       error,
//     };
//   }
// }

export async function getProtocolFee(
  network: (typeof supportedNetwork)[number] = "testnet",
  chainName: (typeof supportedChainName)[number] = "Starknet"
) {
  try {
    const andQuery = and(
      eq(feeConfigModel.network, network),
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
