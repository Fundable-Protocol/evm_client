"use server";

import { eq } from "drizzle-orm";

import { db } from "../../../db/drizzle";
import { walletModel } from "../../../db/schema";
import { saveWalletPolicy } from "@/validations";

export async function saveWalletAction(data: { walletAddress: string }) {
  try {
    const parsed = saveWalletPolicy.parse(data);

    const { walletAddress } = parsed;

    const existingWallet = await db
      .select({ id: walletModel.id })
      .from(walletModel)
      .where(eq(walletModel.address, walletAddress))
      .limit(1);

    if (existingWallet[0]?.id) {
      console.log("ℹ️ [saveWalletAction] Wallet already exists:", walletAddress);
      return { message: "Wallet already exists", wallet: null };
    }

    const [newWallet] = await db
      .insert(walletModel)
      .values({ address: walletAddress, updated_at: new Date() })
      .returning();

    return { message: "Wallet saved successfully", wallet: newWallet };
  } catch (error) {
    console.error("❌ [saveWalletAction] Error saving wallet:", error);
    throw error;
  }
}
