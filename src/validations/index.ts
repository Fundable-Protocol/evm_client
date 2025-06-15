import { createEmptyRow } from "@/lib/utills";
import { IDistributionData } from "@/types/distribution";
import { parseUnits } from "ethers";

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

      if (isSnsAddress(address)) {
        return createEmptyRow({
          amount,
          ...(label && label),
          ...(isSnsAddress(address) ? { starkAddress: address } : { address }),
        });
      }

      return null;
    })
    .filter(Boolean);

  if (!transformedData.length) {
    return {
      success: false,
      message:
        "File contains invalid data, Only valid Starknet address, amount, and label (if enabled) is required.",
    };
  }

  return { success: true, data: transformedData as IDistributionData[] };
};
