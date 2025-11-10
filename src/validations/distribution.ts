import { z } from "zod";

import { isDuplicateAddress, isENSAddress } from ".";
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

  return distributionData.some((row) => !row.address);
};

const isInvalidAmount = (amount: number) => {
  return amount === 0 || Number.isNaN(amount) || amount < 0;
};

export async function validateDistributionAmounts(
  data: IValidateDistributionAmounts
): Promise<{ success: boolean; message?: string }> {
  const { distributionInfo, distributionData } = data;

  const firstAmount = distributionData[0]?.amount;

  if (isInvalidAmount(+firstAmount)) {
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

export const getUnresolvedENSRows = (
  distributionData: IDistributionData[]
): Array<{ rowNumber: number; ensName: string }> => {
  return distributionData
    .map((row, index) => {
      if (!row.address) return null;
      const hasENSAddress = isENSAddress(row.address);
      if (hasENSAddress && !row.address.startsWith("0x")) {
        return { rowNumber: index + 1, ensName: row.address };
      }
      return null;
    })
    .filter((item): item is { rowNumber: number; ensName: string } => item !== null);
};

export function formatUnresolvedENSError(unresolvedRows: Array<{ rowNumber: number; ensName: string }>): string {
  let errorMessage: string;

  if (unresolvedRows.length === 1) {
    errorMessage = `Row ${unresolvedRows[0].rowNumber} (${unresolvedRows[0].ensName}) could not be resolved. Please use an Ethereum address instead.`;
  } else if (unresolvedRows.length <= 5) {
    const rowsList = unresolvedRows
      .map(({ rowNumber, ensName }) => `Row ${rowNumber} (${ensName})`)
      .join(", ");
    errorMessage = `${unresolvedRows.length} rows have unresolved ENS addresses: ${rowsList}. Please use Ethereum addresses instead.`;
  } else {
    // For many rows, show first few and count
    const firstFew = unresolvedRows
      .slice(0, 3)
      .map(({ rowNumber, ensName }) => `Row ${rowNumber} (${ensName})`)
      .join(", ");
    const remainingCount = unresolvedRows.length - 3;
    errorMessage = `${unresolvedRows.length} rows have unresolved ENS addresses: ${firstFew}, and ${remainingCount} more. Please use Ethereum addresses instead.`;
  }

  return errorMessage;
}
