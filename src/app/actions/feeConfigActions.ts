"use server";

import { db } from "../../../db/drizzle";
import { feeConfigModel } from "../../../db/schema";

export async function createFeeConfigs() {
  try {
    // Create mainnet fee config
    const mainnetConfig = await db.insert(feeConfigModel).values({
      amount: "100",
      network: "mainnet",
      chainId: "SN_MAIN",
      chainName: "Starknet",
    });

    // Create testnet fee config
    const testnetConfig = await db.insert(feeConfigModel).values({
      amount: "2500",
      network: "testnet",
      chainId: "SN_SEPOLIA",
      chainName: "Starknet",
    });

    return {
      success: true,
      message: "Fee configurations created successfully",
      data: {
        mainnet: mainnetConfig,
        testnet: testnetConfig,
      },
    };
  } catch (error) {
    console.error("Error creating fee configs:", error);
    return {
      success: false,
      message: "Failed to create fee configurations",
      error,
    };
  }
}
