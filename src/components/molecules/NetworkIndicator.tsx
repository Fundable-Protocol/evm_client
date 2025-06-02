"use client";

import { useNetwork } from "@starknet-react/core";

const NetworkIndicator = ({
  isConnected = false,
}: {
  isConnected: boolean;
}) => {
  const { chain } = useNetwork();

  if (!isConnected) return null;

  const isMainNet = chain?.network === "mainnet";

  return (
    <div className={`px-4 py-2 rounded-full flex items-center gap-2`}>
      <span
        className={`size-3 rounded-full animate-pulse ${
          isMainNet ? "bg-green-400" : "bg-yellow-300"
        }`}
      />

      <span className="font-semibold text-white text-sm">
        {isMainNet ? "Mainnet" : "Testnet"}
      </span>
    </div>
  );
};

export default NetworkIndicator;
