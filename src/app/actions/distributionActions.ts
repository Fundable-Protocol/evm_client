"use server";

import { z } from "zod";

import {
  updateDistributionSchema,
  createDistributionSchema,
} from "@/policies/distribution";

import { DistributionService } from "@/services/distributionService";
import { tryCatch } from "@/lib/utils";

export async function createDistributionAction(
  data: z.infer<typeof createDistributionSchema>
) {
  // Directly call your service function
  const distribution = await DistributionService.createDistribution(data);

  return distribution;
}

export async function updateDistributionAction(
  distributionId: string,
  data: z.infer<typeof updateDistributionSchema>
) {
  if (!distributionId) {
    throw new Error("Distribution ID is required");
  }

  // Validate params using zod
  const validatedData = updateDistributionSchema.parse(data);

  // You can optionally validate `data` shape here or inside the service

  return DistributionService.updateDistribution(distributionId, validatedData);
}

export async function getCardStatsAction(user_address: string) {
  if (!user_address) throw new Error("User address is required");

  const { data: totalAmount, error: totalAmountError } = await tryCatch(
    DistributionService.getTotalAmount(user_address)
  );

  // if (totalAmountError) throw new Error(totalAmountError?.message);

  const { data: totalDistributions, error: totalDistributionsError } =
    await tryCatch(DistributionService.getTotalDistributions(user_address));

  // if (totalDistributionsError) {
  //   throw new Error(totalDistributionsError?.message);
  // }

  const { data: totalFundedAddresses, error: totalFundedAddressesError } =
    await tryCatch(DistributionService.getTotalFundedAddresses(user_address));

  // if (totalFundedAddressesError) {
  //   throw new Error(totalFundedAddressesError?.message);
  // }

  return {
    totalAmount: totalAmountError ? 0 : totalAmount,
    totalDistributions: totalDistributionsError ? 0 : totalDistributions,
    totalFundedAddresses: totalFundedAddressesError ? 0 : totalFundedAddresses,
  };
}

// export async function getDistributionsAction(
//   params: Partial<z.infer<typeof distributionQuerySchema>>
// ) {
//   // Validate params using zod
//   const validatedParams = distributionQuerySchema.parse(params);

//   const { page = 1, limit = 10, status, user_address } = validatedParams;

//   if (user_address) {
//     return DistributionService.getDistributionsByUser(
//       user_address,
//       page,
//       limit
//     );
//   }

//   return DistributionService.getAllDistributions(page, limit, status);
// }

// export async function getDistributionsByAddress(userAddress: string) {
//   try {
//     const rows = await DistributionService.getTotalAmount(userAddress!);

//     const response = rows.map((row) => ({
//       tokenSymbol: row.tokenSymbol,
//       totalAmount: roundToTwoDecimals(+(row.totalAmount ?? 0)),
//     }));

//     return response;
//   } catch (error) {
//     throw new Error(
//       (error as Error)?.message ?? "Failed to fetch total amount"
//     );
//   }
// }
