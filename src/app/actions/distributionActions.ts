"use server";

import { z } from "zod";

import {
  updateDistributionSchema,
  createDistributionSchema,
} from "@/policies/distribution";
import { tryCatch } from "@/lib/utills";

import { supportedTokenSymbol } from "@/lib/constant";
import { IHistoryQueryParams } from "@/types/history";
import { ITransactionDataPoint } from "@/types/dashboard";
import { DistributionService } from "@/services/distributionService";

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

export async function getChartDataAction(user_address: string, date?: number) {
  if (!user_address) throw new Error("User address is required");

  const distributions = await DistributionService.getChartData(
    user_address,
    date
  );

  // Initialize data for all months
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const groupedData = monthNames.reduce((acc, month) => {
    acc[month] = {
      time: month,
      USDT: 0,
      STRK: 0,
      USDC: 0,
      ETH: 0,
    };
    return acc;
  }, {} as Record<string, ITransactionDataPoint>);

  // Group data by month and token
  distributions.forEach((curr) => {
    const date = new Date(curr.created_at);
    const month = monthNames[date.getMonth()];
    const token = curr.token_symbol as (typeof supportedTokenSymbol)[number];
    const amount = Number(curr.total_amount);

    groupedData[month][token] += amount;
  });

  // Convert to array (already sorted by month order)
  const chartData = Object.values(groupedData);

  return chartData;
}

// async function updateDistributionsUsdRateAction() {
//   try {
//     const starknetTestName = "Starknet Sepolia Testnet";
//     const starknetMainnet = "Starknet";

//     const distributions = await db
//       .select({
//         id: distributionModel.id,
//         usd_rate: distributionModel.usd_rate,
//         total_amount: distributionModel.total_amount,
//       })
//       .from(distributionModel)
//       .where(eq(distributionModel.network, "mainnet".toUpperCase() as any));

//     // Get all distributions with usd_rate = 0
//     const distributionsWithZeroRate = await db
//       .update(distributionModel)
//       .set({
//         chain_name: starknetTestName,
//       })
//       .where(
//         eq(
//           distributionModel.network,
//           "TESTNET" as unknown as typeof distributionModel.network
//         )
//       );

//     return {
//       success: true,
//       data: {
//         distributionsWithZeroRate,
//       },
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : "Failed to update distributions with USD rate",
//       updatedCount: 0,
//     };
//   }
// }

export async function getDistributionsAction(params: IHistoryQueryParams) {
  if (!params?.user_address) throw new Error("User address is required");

  const { data, error } = await tryCatch(
    DistributionService.getAllDistributions(params)
  );

  return {
    data: error ? { distributions: [], total: 0 } : data,
    error: error ? error.message : null,
  };
}
