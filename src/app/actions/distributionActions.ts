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

  const { data: totalAmountData, error: totalAmountError } = await tryCatch(
    DistributionService.getTotalAmountWithChange(user_address)
  );

  const { data: totalDistributionsData, error: totalDistributionsError } =
    await tryCatch(
      DistributionService.getTotalDistributionsWithChange(user_address)
    );

  const { data: totalFundedAddressesData, error: totalFundedAddressesError } =
    await tryCatch(
      DistributionService.getTotalFundedAddressesWithChange(user_address)
    );

  return {
    totalAmount: totalAmountError ? 0 : totalAmountData?.currentAmount ?? 0,
    totalAmountPercentageChange: totalAmountError
      ? 0
      : totalAmountData?.percentageChange ?? 0,
    totalDistributions: totalDistributionsError
      ? 0
      : totalDistributionsData?.currentDistributions ?? 0,
    totalDistributionsPercentageChange: totalDistributionsError
      ? 0
      : totalDistributionsData?.percentageChange ?? 0,
    totalFundedAddresses: totalFundedAddressesError
      ? 0
      : totalFundedAddressesData?.currentAddresses ?? 0,
    totalFundedAddressesPercentageChange: totalFundedAddressesError
      ? 0
      : totalFundedAddressesData?.percentageChange ?? 0,
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
