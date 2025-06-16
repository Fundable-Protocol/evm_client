import { supportedChainName, supportedNetwork } from "./constant";
import { getProtocolFee } from "@/app/actions/feeConfigActions";

export const fetchProtocolFee = async (
  network: (typeof supportedNetwork)[number],
  chainName: (typeof supportedChainName)[number]
) => {
  if (!network || !chainName) {
    return {
      success: false,
      message: "Please connect your wallet first!",
    };
  }

  try {
    const { success, data } = await getProtocolFee(network, chainName);

    if (!success) throw new Error("Failed to fetch protocol fee.");

    const result = data?.protocolFee;

    return {
      success: true,
      data: result,
      message: "Protocol fee fetched successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to fetch protocol fee.",
    };
  }
};
