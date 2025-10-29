import { createEmptyRow } from "@/lib/utils";
import { IDistributionData } from "@/types/distribution";
import { parseUnits } from "ethers";
import { z } from "zod";

export const saveWalletPolicy = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid wallet address format.",
  }),
});

export const isSnsAddress = (address: string) => {
  if (!address) return false;

  return address?.toLowerCase().endsWith(".stark");
};

export const isDuplicateAddress = (distributionData: IDistributionData[]) => {
  const addressSet = new Set();

  return distributionData.some((row) => {
    if (row.address) {
      if (addressSet.has(row.address)) return true;
      addressSet.add(row.address);
    }

    // if (row.starkAddress) {
    //   if (addressSet.has(row.starkAddress)) return true;
    //   addressSet.add(row.starkAddress);
    // }

    return false;
  });
};

export const isValidAmount = (amount: string): boolean => {
  if (!amount) return false;

  try {
    const bn = parseUnits(amount, 18);
    return bn >= parseUnits("0", 18);
  } catch {
    return false;
  }
};

export const isEmptyAmount = (distributionData: IDistributionData[]) => {
  return distributionData.every((row) => !row.amount);
};

export const validateCsvData = (data: unknown) => {
  console.log('validateCsvData input:', data);
  if (!Array.isArray(data)) {
    return {
      success: false,
      message: "Invalid file uploaded, Only Csv file is supported.",
    };
  }

  if (!data.length) {
    return {
      success: false,
      message: "This file is empty.",
    };
  }

  const transformedData = data
    .map((row, i) => {
      const [address, amount, label] = row;

      const hasHeader = ["address", "amount", "label"].includes(
        address?.toLowerCase()
      );

      if (i === 1 && hasHeader) return null;

      // Accept any non-empty address, amount is optional
      if (address) {
        return createEmptyRow({
          address,
          ...(amount && { amount }),
          ...(label && { label }),
        });
      }

      return null;
    })
    .filter(Boolean);

  console.log('validateCsvData transformedData:', transformedData);

  if (!transformedData.length) {
    return {
      success: false,
      message:
        "File contains invalid data. Only valid address, amount, and label (if enabled) are required.",
    };
  }

  return { success: true, data: transformedData as IDistributionData[] };
};
