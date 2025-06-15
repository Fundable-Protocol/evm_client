import { AccountInterface } from "starknet";

export const fetchProtocolFee = async ({
  account,
  contractAddress,
}: {
  contractAddress: string;
  account?: AccountInterface;
}) => {
  if (!account || !contractAddress) {
    return {
      success: false,
      message: "Please connect your wallet first!",
    };
  }

  try {
    const response = await account.callContract({
      contractAddress,
      entrypoint: "get_protocol_fee_percent",
      calldata: [],
    });

    const result = Array.isArray(response)
      ? response
      : (response as { result: string[] })?.result;

    const resultValue = result[0];

    const decimalValue = Number.parseInt(resultValue, 16);

    return {
      success: true,
      data: decimalValue,
      message: "Protocol fee fetched successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to fetch protocol fee.",
    };
  }
};
