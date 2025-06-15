"use server";

import { z } from "zod";

import {
  updateDistributionSchema,
  createDistributionSchema,
} from "@/policies/distribution";
import { tryCatch } from "@/lib/utills";

import { supportedTokenSymbol } from "@/lib/constant";
import { ITransactionDataPoint } from "@/types/dashboard";
import { DistributionService } from "@/services/distributionService";
import { IHistoryQueryParams } from "@/types/history";
import { createFeeConfigs } from "./feeConfigActions";

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

  // const res = await createFeeConfigs();

  // console.log("feeConfigRes", res);

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

export async function getDistributionsAction(params: IHistoryQueryParams) {
  if (!params?.user_address) throw new Error("User address is required");

  const { data, error } = await tryCatch(
    DistributionService.getAllDistributions(params)
  );

  // console.log(data, error, success);

  return {
    data: error ? [] : data?.distributions,
    error: error ? error.message : null,
  };
}
