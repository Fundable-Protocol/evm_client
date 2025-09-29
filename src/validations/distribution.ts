import { z } from "zod";

import { isDuplicateAddress, isSnsAddress } from ".";
import { validateDistribution } from "@/lib/utils";
import {
  IDistributionData,
  IValidateDistributionAmounts,
  ICalculateLumpSumAmount,
  IDistributionInfo,
} from "@/types/distribution";

const csvRowSchema = z.object({
  address: z.string().length(66), // length of Ethereum address
  amount: z.coerce.number().positive(),
});

export const csvSchema = z.array(csvRowSchema);

export const isEmptyDistributionData = (
  distributionData: IDistributionData[]
) => {
  if (!distributionData.length) return true;

  return distributionData.some((row) => !row.address && !row.starkAddress);
};

const isInvalidAmount = (amount: number) => {
  return amount === 0 || Number.isNaN(amount) || amount < 0;
};

export async function validateDistributionAmounts(
  data: IValidateDistributionAmounts
): Promise<{ success: boolean; message?: string }> {
  const { distributionInfo, distributionData } = data;

  const firstAmount = Number(distributionData[0]?.amount);

  if (isInvalidAmount(firstAmount)) {
    return {
      success: false,
      message: "Valid amount is required for distribution.",
    };
  }

  if (distributionInfo.type === "equal") {
    const hasUnEqualAmount = distributionData.some(
      (dist) => dist.amount !== String(firstAmount)
    );

    if (hasUnEqualAmount) {
      return {
        success: false,
        message: "Amounts are not equal.",
      };
    }
  } else {
    const hasEmptyAmount = distributionData.some((dist) => !dist.amount);

    if (hasEmptyAmount) {
      return {
        success: false,
        message: "Amount is required for all addresses.",
      };
    }
  }

  return { success: true };
}

export function checkDistributionDataValidity(
  data: IDistributionData[],
  distributionInfo: IDistributionInfo
): {
  success: boolean;
  message: string;
} {
  if (isEmptyDistributionData(data)) {
    return {
      success: false,
      message: "Please provide valid distribution data.",
    };
  }

  if (isDuplicateAddress(data)) {
    return {
      success: false,
      message: "Duplicate address found. Please remove it.",
    };
  }

  if (distributionInfo.type === "equal" && !distributionInfo.amount) {
    return {
      success: false,
      message: "Please enter a valid amount for distribution",
    };
  }
  return {
    success: true,
    message: "Distribution data is valid.",
  };
}

export function validateIndividualDistributions(
  distributionData: IDistributionData[]
): { success: boolean; message?: string } {
  const validationErrors: string[] = [];

  distributionData.forEach((dist, index) => {
    const validation = validateDistribution(dist.address!, dist.amount);

    if (!validation.isValid && validation.error) {
      validationErrors.push(`Row ${index + 1}: ${validation.error}`);
    }
  });

  if (validationErrors.length > 0) {
    return {
      success: false,
      message: `Invalid distributions:\n${validationErrors.join("\n")}`,
    };
  }

  return { success: true };
}

export function calculateLumpSumAmount(data: ICalculateLumpSumAmount) {
  const { distributionData, distributionType, setDistributionData } = data;

  if (distributionType["equalAmountType"] !== "lump_sum") return;

  if (!distributionData[0]!.address) {
    return {
      success: false,
      message: "Please add at least one address to distribute to.",
    };
  }

  const value = distributionType.amount;

  if (!value || Number.isNaN(Number(value))) {
    return {
      success: false,
      message: "Please enter a valid lump sum amount",
    };
  }

  const perAddressAmount = (Number(value) / distributionData!.length).toFixed(
    3
  );

  setDistributionData((prev) =>
    prev.map((data) => ({
      ...data,
      amount: perAddressAmount,
    }))
  );

  return {
    success: true,
    message: `Calculated ${perAddressAmount} per address for ${
      distributionData!.length
    } addresses`,
  };
}

export const snsAddressValidation = (
  data: IDistributionData[],
  queueStarkNameResolution: (index: number, starkName: string) => void,
  isMainNet: boolean
) => {
  const hasUnresolvedSns = data.some((data) => {
    const hasSnsAddress = isSnsAddress(data.address!);
    const hasSnsName = isSnsAddress(data.starkAddress!);
    return hasSnsAddress || (hasSnsName && !data.address);
  });

  if (hasUnresolvedSns && !isMainNet) {
    return {
      success: false,
      hasUnresolvedSns,
      message: "SNS addresses are not supported on testnet.",
    };
  }

  if (!hasUnresolvedSns) return { success: true };

  data.forEach((data, i) => {
    const hasSnsAddress = isSnsAddress(data.address!);
    const hasSnsName = isSnsAddress(data.starkAddress!);

    if (hasSnsAddress) {
      queueStarkNameResolution(i, data.address!);
    }

    if (hasSnsName && !data.address) {
      queueStarkNameResolution(i, data.starkAddress!);
    }
  });

  return {
    success: false,
    message:
      "Please wait for SNS addresses to resolve or enter a valid starknet address, and try again.",
  };
};
