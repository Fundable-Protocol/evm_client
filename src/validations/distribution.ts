import { z } from "zod";

import { isDuplicateAddress } from ".";
import { validateDistribution } from "@/lib/utils";
import {
  IDistributionData,
  ICalculateDistributionAmounts,
  ICalculateLumpSumAmount,
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

  return distributionData.every((row) => !row.address && !row.starkAddress);
};

const isInvalidAmount = (amount: number) => {
  return amount === 0 || Number.isNaN(amount) || amount < 0;
};

export async function calculateDistributionAmounts(
  data: ICalculateDistributionAmounts
): Promise<{ success: boolean; message?: string }> {
  const { distributionInfo, distributionData, setDistributionData } = data;

  const firstAmount = Number(distributionData[0]?.amount);

  const generalAmount = Number(distributionInfo?.amount);

  // const isAmountPerAddress =
  //   distributionInfo.equalAmountType === "amount_per_address";

  if (isInvalidAmount(firstAmount) && isInvalidAmount(generalAmount)) {
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
      setDistributionData((prev) =>
        prev.map((data) => ({
          ...data,
          amount: String(
            isInvalidAmount(generalAmount) ? firstAmount : generalAmount
          ),
        }))
      );
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

export function checkDistributionDataValidity(data: IDistributionData[]): {
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
