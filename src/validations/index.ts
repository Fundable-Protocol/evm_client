import { validateAndParseAddress } from "starknet";

export const isValidStarknetAddress = (address: string): boolean => {
  try {
    validateAndParseAddress(address);
    return true;
  } catch {
    return false;
  }
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

      if (isValidStarknetAddress(address)) {
        return {
          address,
          amount,
          ...(label && label),
        };
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

  return { success: true, data: transformedData };
};
